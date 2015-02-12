/**
 * Created by Phangji on 2/4/15.
 */
var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');

var sendError = require('../lib/util').sendError;
var decodeToken = require('../lib/util').decodeToken;
var createAnonymouseUser = require('../lib/util').createAnonymouseUser;

exports.submit = function(req, res) {
    var body = req.body;
    var surveyId = req.params.id;

    if(_.isEmpty(body) ) { return sendError(res, 'JSON_MISSING'); }

    var token = req.get('Authorization');
    var email = body.email;
    var userId;
    var Survey = mongoose.model('Survey');

    async.waterfall([
        function checkAnonymouseUser(callback) {
            if(token) {
                var decodedToken = decodeToken(token);
                userId = decodedToken._id;
                return callback(null);
            }
            if(!email) { return callback('USERNAME_MISSING') }

            createAnonymouseUser(email, function (err, results) {
                console.log('results', results);
                if(err){  return callback('OTHER_CAUSE');  }
                userId = results.userId;
                callback(null);
            });
        },
        function getIndexSetting(callback) {

            Survey.findOne( { _id: surveyId } )
                .exec(function (err, survey) {
                    if( err ) { return callback(err); }
                    if( !survey ) { return callback('INVALID_QUERY'); }

                    callback(null, survey.indexSetting);
                    console.log(survey.indexSetting);
                });
        },
        function calculateResult(indexSetting, callback) {
            var surveyReply = body.surveyReply;

            // ***** insert calculation ***** using indexSetting, surveyReply

            // ***** insert calculation *****

            var result = { a : 3 , b : 2 };
            callback(null, result);
        },
        function saveResult(newData, callback) {
            var body = {
                surveyResult : null
            };
            Survey.findOne({_id: surveyId}, function (err, survey) {
                if(err) { return callback(res, err); }

                if(_.isUndefined(survey.surveyResult)){
                    survey.surveyResult = {};
                }
                survey.surveyResult[userId.toString()] = newData;
                console.log(survey.surveyResult);
                callback(null, { surveyResult : survey.surveyResult });
            });
        },
        function saveResult2(body, callback) {
            Survey.update( {_id: surveyId}, { $set : body} , function(err, result) {
                if( err ) { console.log(err);  return callback(err); }
                if( result === 0 ) { return callback('INVALID_QUERY'); }
                res.json({  success: true  });
            });
        }
    ]);
};

