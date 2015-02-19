/**
 * Created by Phangji on 2/4/15.
 */
var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');
var uuid = require('uid2');

var sendError = require('../lib/util').sendError;
var decodeToken = require('../lib/util').decodeToken;
var createAnonymouseUser = require('../lib/util').createAnonymouseUser;

/**
 *
 * Submit survey reply ( calculate survey result and save )
 *
 * @date: 15. 2. 17.
 * @time: 11:12:52
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
exports.submit = function(req, res) {
    var body = req.body;
    var surveyId = body.surveyId = req.params.id;
    var token = req.get('Authorization');

    if(_.isEmpty(body) ) { return sendError(res, 'JSON_MISSING'); }

    async.waterfall([
        function isAnonymouseUser(callback) {
            var User = mongoose.model('User');

            if( !token ) {
                // is AnonymouseUser
                return callback(null, _createRandomId());
            } else {
                // not AnonymouseUser
                decodeToken(token, function(err, decodedToken) {
                    if( err ) { return callback(err); }
                    if( !decodedToken ) { return callback('INVALID_TOKEN'); }

                    User.findOne({_id: decodedToken._id}, function(err, user) {
                        if( err ) { return callback(err); }
                        if( !user ) { return callback('INVALID_QUERY'); }

                        return callback(err, decodedToken._id);
                    });
                });
            }
        },
        function calculateResult(userId, callback) {
            _calculateResult(body, function(err, result) {
                return callback(err, userId, result);
            });
        },
        function saveResultOnSurey(userId, result, callback) {
            var SurveyResult = mongoose.model('SurveyResult');

            SurveyResult.findOne({surveyId: surveyId}, function(err, model) {
                if(model === null) {
                    var surveyResult = {
                        updatedAt: Date.now(),
                        surveyId: surveyId,
                        result: {}
                    };
                    surveyResult.result[userId] = result;

                    SurveyResult.create(surveyResult, function(err) {
                        if( err ) { return callback(err); }

                        return callback(err, userId, result)
                    });
                } else {
                    var surveyResult = {
                        updatedAt: Date.now()
                    };

                    surveyResult['result.'+userId] = result;
                    SurveyResult.update({surveyId: surveyId}, {$set: surveyResult },{upsert: true}, function(err, changed) {
                        if( err ) { return callback(err); }
                        if( changed === 0 ) { return callback('INVALID_QUERY'); }

                        return callback(err, userId, result)
                    });
                }
            });
        },
        function saveResultOnUser(userId, result, callback){
            var User = mongoose.model('User');

            if( !token ) {
                // is AnonymouseUser
                return callback(null, result);
            } else {
                // not AnonymouseUser
                var user = {
                    updatedAt: Date.now()
                };
                user['surveyResult.'+surveyId] = result;

                User.update({_id: userId}, {$set: user}, {upsert:true}, function(err, changed){
                    if( err ) { return callback(err); }
                    if( changed === 0 ) { return callback('INVALID_QUERY'); }

                    return callback(err, result);
                });
            }
        },
        function updateResponseCount(result, callback) {
            var Survey = mongoose.model('Survey');
            var SurveyResult = mongoose.model('SurveyResult');

            SurveyResult.findOne({surveyId: surveyId}, function(err, surveyResult) {
                if( err ) { return callback(err); }
                if( !surveyResult ) { return callback(err); }
                var responseCount = _.keys(surveyResult.result).length;

                Survey.update({_id: surveyId}, {$set:{responseCount: responseCount}}, {upsert:true, safe:true}, function(err) {
                    return callback(err, result);
                });
            });
        }
    ], function done(err, result) {
        if( err ) { return sendError(res, err); }

        res.json(result);
    });
};

/**
 *
 * Calculate survey result
 *
 * @param {Object} body | Survey reply
 * @param {function(Error, Object)} callback | Survey result
 * 
 * @date: 15. 2. 17.
 * @time: 11:15:52
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
function _calculateResult(body, callback) {
    var Survey = mongoose.model('Survey');

    Survey.findOne({_id: body.surveyId}, function(err, survey) {
        var indicies  = _convertArrayByIndex(survey.formSetting.indicies) || [];
        var nations = _convertArrayByIndex(survey.formSetting.nations) || [];
        var categories = _convertArrayByIndex(survey.formSetting.categories) || [];
        var contents = _convertArrayByIndex(survey.items.content) || [];

        var replies = body.surveyReply;
        var resultArray = _createResultArray(categories.length+1, nations.length+1);

        var i = 0;

        contents.forEach(function(content) {
            var questions = content.questions || [];
            var category = content.category;
            var nation = content.nation;

            questions.forEach(function(question) {
                var response = question.responses[replies[i++]];

                _sumScore(resultArray, response.scores, category.index, nation.index)
            });
        });

        _calcTotal(indicies, resultArray);

        callback(null, {
            categories: categories,
            nations: nations,
            replies: replies,
            result:resultArray
        });
    });
};

/**
 *
 * Create an empty two-dimensional array to store the results of the Survey
 *
 * @param {Number} categoryNum | Number of category
 * @param {Number} nationNum | Number of nationNum
 *
 * @return {Array<Array<Object>>} result | Empty two-dimensional array
 *
 * @date: 15. 2. 17.
 * @time: 11:25:46
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
function _createResultArray(categoryNum, nationNum) {
    var result = [];

    for( var i = 0; i < categoryNum; i++ ) {
        var innerResult = new Array();
        for( var j = 0; j < nationNum; j++ ) {
            innerResult.push({});
        }
        result.push(innerResult);
    }

    return result;
};

/**
 *
 * Add a reply to the specified array position
 *
 * @param {Array<Array<Object>>} array | Survey Result array
 * @param {Object} reply | Survey reply score object
 * @param {Number} categoryNum | Index of category
 * @param {Number} nationNum | Index of nation
 *
 * @return {Array<Array<Object>>} array | Array of survey results added reply
 * 
 * @date: 15. 2. 17.
 * @time: 11:34:23
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
function _sumScore(array, reply, categoryNum, nationNum) {
    _sumObject(array[categoryNum][nationNum], reply);

    return array;
};

/**
 *
 * Calculate GEC scoring matrix total
 *
 * @param {Array<Object>} indicies | Index list
 * @param {Array<Array<Object>>} array | Survey reusult list
 *
 * @return {Array<Array<Object>>} array | Calculation is completed Survey reusult list
 *
 * @date: 15. 2. 18.
 * @time: 01:14:50
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
function _calcTotal(indicies, array) {
    var maxY = array.length-1;
    for(var i = 0; i < maxY; i++) {
        var maxX = array[i].length-1;
        for(var j = 0; j < maxX; j++) {
            _fillZero(array[i][j], indicies);
            _sumObject(array[maxY][maxX], array[i][j]); // Sum Total
            _sumObject(array[i][maxX], array[i][j] ); // Sum Categories
            _sumObject(array[maxY][j], array[i][j]); // Sum Nations
        }
    }

    return array;
};

/**
 *
 * Initialized to 0 the value of indicies.name property in the Object
 *
 * @param {Object} object | Survey result object
 * @param {Array<Object>} indicies | Index list
 *
 * @date: 15. 2. 19.
 * @time: 03:03:08
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
function _fillZero(object, indicies) {
    for( var i = 0; i < indicies.length; i++ ) {
        if( !object[indicies[i].name] ) {
            object[indicies[i].name] = 0;
        }
    }
}

/**
 *
 * Add a property of both Object
 *
 * @param {Object} dst | Survey result object
 * @param {Object} src | Survey result object
 *
 * @date: 15. 2. 19.
 * @time: 03:06:01
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
function _sumObject(dst, src) {
    _.keys(src).forEach(function(key) {
        if( dst[key] ) {
            dst[key] += src[key];
        } else {
            dst[key] = src[key];
        }
    });

    return dst;
};

function _convertArrayByIndex(arr) {
    // TODO convert by index
    return arr;
};

/**
 *
 * Create Random id
 *
 * @return {String} 'an' + new Date().getTime() + uuid(5) | Random id ( Meaning of "an" , an anonymous user )
 * 
 * @date: 15. 2. 19.
 * @time: 03:08:11
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
function _createRandomId() {
    return 'an' + new Date().getTime() + uuid(5);
};