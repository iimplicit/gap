/**
 * Created by syntaxfish on 15. 2. 2..
 */
var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');
var json_2_csv = require('json-2-csv').json2csv;

var sendError = require('../lib/util').sendError;
var existUser= require('../lib/util').existUser;

var config = require('../config');

exports.create = function(req, res) {
    var decodedToken = req.decodeToken;
    var body = req.body;

    if( _.isEmpty(body) ) { return sendError(res, 'JSON_MISSING'); }

    body.userId = decodedToken._id;

    existUser(decodedToken, function(err) {
        if(err) { return sendError(res, 'INVALID_TOKEN'); }

        var Survey = mongoose.model('Survey');
        Survey.create(body, function(err, survey) {
            if( err ) { return callback(err, survey); }

            res.json({success: true, _id: survey._id, createdAt: survey.createdAt, updatedAt: survey.updatedAt});
        });
    });
};

exports.readList = function(req, res) {
    var decodedToken = req.decodeToken;
    var Survey = mongoose.model('Survey');

    existUser(decodedToken, function(err, user){
        if(err) { return sendError(res, 'INVALID_TOKEN'); }
        var Survey = mongoose.model('Survey');

        Survey.find({userId: user._id})
            .select('title updatedAt createdAt _id responseCount')
            .exec(function(err, results) {
            if(err) { return sendError(res, err); }

            res.json({success: true, surveyList: results});
        });
    });
};

exports.read = function(req, res) {
    var token = req.get('Authorization');
    var id = req.params.id;

    var Survey = mongoose.model('Survey');
    Survey.findOne({_id: id})
        .exec(function(err, survey) {
            if( err ) { return sendError(res, err); }
            if( !survey ) { return sendError(res, 'INVALID_QUERY'); }
            var decodedToken = token === undefined ? null : decodeToken(token);


            if( !decodedToken || survey.userId.toString() !== decodedToken._id ) {
                var survey = survey.toObject();
                delete survey.responseCount;
                delete survey.analyticsData;
                delete survey.surveyResult;
                delete survey.userId;
                delete survey.__v;

                return res.json({success: true, survey: survey});
            } else {

                return res.json({success: true, survey: survey});
            }
    });

};

exports.update = function(req, res) {
    var decodedToken = req.decodeToken;
    var body = req.body;
    var surveyId = req.params.id;

    body.updatedAt = Date.now();

    existUser(decodedToken, function(err, user) {
        if(err) { return sendError(res, 'INVALID_TOKEN'); }
        var Survey = mongoose.model('Survey');

        Survey.update({_id: surveyId, userId: decodedToken._id}, {$set: body}, function(err, result) {
            if( err ) { return sendError(res, err); }
            if( result === 0 ) { return sendError(res, 'INVALID_QUERY'); }

            res.json({success: true, _id: surveyId, updatedAt: body.updatedAt});
        });
    });
};

exports.delete = function(req, res) {
    var decodedToken = req.decodeToken;
    var surveyId = req.params.id;

    existUser(decodedToken, function(err, user) {
        if (err) { return sendError(res, 'INVALID_TOKEN'); }
        var Survey = mongoose.model('Survey');

        Survey.remove({_id: surveyId, userId: decodedToken._id}, function(err, result) {
            if( err ) { return sendError(res, err); }
            if( result === 0 ) { return sendError(res, 'INVALID_QUERY'); }

            res.json({success: true});
        });
    });
};

exports.copy = function(req, res) {
    var decodedToken = req.decodeToken;
    var surveyId = req.params.id;

    existUser(decodedToken, function(err, user) {
        if (err) { return sendError(res, 'INVALID_TOKEN'); }
        var Survey = mongoose.model('Survey');

        async.waterfall([
            function findSurvey(callback) {
                Survey.findOne({_id: surveyId, userId: decodedToken._id}, function(err, survey) {
                    if( err ) { return callback(err); }
                    if( !survey ) { return callback('INVALID_QUERY'); }

                    callback(err, survey);
                });
            },
            function copySurvey(survey, callback) {
                survey.createdAt = survey.updatedAt = Date.now();
                survey._id = mongoose.Types.ObjectId();
                survey.responseCount = 0;
                survey.title = 'COPY ' + survey.title;
                survey.isNew = true; //<--------------------IMPORTANT
                survey.save(function(err, result) {
                    callback(err, result);
                });

            }
        ], function done(error, result) {
            if( error ) { return sendError(res, error); }
            if( !result ) { return sendError(res, 'INVALID_QUERY')}

            res.json({success: true, _id: result._id, createdAt: result.createdAt, updatedAt: result.updatedAt});
        });
    });
};

exports.exportData = function(req, res) {
    var decodedToken = req.decodeToken;
    var surveyId = req.params.id;
    var content_type = req.get('Accept');

    //if( content_type !== 'text/csv' ) { return sendError(res, 'NOT_ACCEPTABLE'); }

    existUser(decodedToken, function(err, user) {
        if (err) { return sendError(res, 'INVALID_TOKEN'); }
        var SurveyResult = mongoose.model('SurveyResult');

        var Survey = mongoose.model('Survey');

        async.parallel([
            function findSurveyInfo(callback) {
                Survey.findOne({_id: surveyId}, callback);
            },
            function findSurveyResult(callback) {
                SurveyResult.findOne({surveyId: surveyId}, callback);
            }
        ], function done(err, results) {
            if( err ) { return sendError(err); }
            if( !results[0] ) { return sendError(res, 'INVALID_QUERY'); }
            if( !results[1] ) { return sendError(res, 'INVALID_QUERY'); }

            var jsonList = _convertJsonList(results);

            json_2_csv(jsonList, function(err, csv) {
                res.setHeader('Content-disposition', 'attachment; filename='+results[0].title+'.csv');
                res.setHeader('Content-type', 'text/csv');
                res.write(csv);
                res.end();
            });

        });
    });
};

function _getQuestionCounts(contents) {
    var questionCounts = [];
    for( var i = 0; i < contents.length; i++ ) {
        var content = contents[i];

        questionCounts.push(content.questions.length);
    }

    return questionCounts;
};

function _convertJsonList(results) {
    var survey = results[0];
    var surveyResult = results[1].result;
    var questionCounts = _getQuestionCounts(survey.items.content);
    var maxQuestionCount = _.max(questionCounts);
    var jsonList = [];

    var userIds = _.keys(surveyResult);
    for( var i = 0; i < userIds.length; i++ ) {
        var userId = userIds[i];
        var replies = surveyResult[userId].replies;
        var repliesIndex = 0;

        for( var j = 0; j < questionCounts.length; j++ ) {
            var questionCount = questionCounts[j];
            var userJsonData = {
                userId: userId,
                scenario: survey.items.content[j].scenario
            };

            for( var k = 0; k < maxQuestionCount; k++ ) {
                if( k < questionCount ) {
                    userJsonData['question_'+ (k+1)] = parseInt(replies[repliesIndex++]);
                } else {
                    userJsonData['question_'+ (k+1)] = '';
                }
            }

            jsonList.push(userJsonData);
        }
    }
    return jsonList;
}
