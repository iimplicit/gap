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

function _updateResponseCount(surveyId) {
    var Survey = mongoose.model('Survey');
    var SurveyResult = mongoose.model('SurveyResult');

    SurveyResult.findOne({surveyId: surveyId}, function(err, result) {
        if( err ) { return callback(err); }
        if( !result ) { return callback(err); }
        var responseCount = _.keys(result.result).length;

        console.log(responseCount);

        Survey.update({_id: surveyId}, {$set:{responseCount: responseCount}}, {upsert:true, safe:true});
    });
}

function _calculateResult(body, callback) {
    var Survey = mongoose.model('Survey');

    Survey.findOne({_id: body.surveyId}, function(err, survey) {
        var indices = _convertArrayByIndex(survey.formSetting.indices) || [];
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

        _calcTotal(resultArray);

        callback(null, {
            categories: categories,
            nations: nations,
            replies: replies,
            result:resultArray
        });
    });
};

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

function _sumScore(array, reply, categoryNum, nationNum) {
    _sumObject(array[categoryNum][nationNum], reply);

    return array;
};

function _calcTotal(array) {
    for(var i = 0; i < array.length-1; i++) {
        var nestedArray = array[i];
        for(var j = 0; j < nestedArray.length-1; j++) {
            _sumObject(nestedArray[nestedArray.length-1], nestedArray[j]);
            _sumObject(array[array.length-1][j], nestedArray[j]);
        }
    }

};

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

function _createRandomId() {
    return 'an' + new Date().getTime() + uuid(5);
};