/**
 * Created by syntaxfish on 15. 2. 2..
 */
var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');

var sendError = require('../lib/util').sendError;
var decodeToken = require('../lib/util').decodeToken;
var existUser= require('../lib/util').existUser;



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

            res.json({success: true, _id: survey._id});
        });
    });
};

exports.readList = function(req, res) {
    var decodedToken = req.decodeToken;
    var Survey = mongoose.model('Survey');

    existUser(decodedToken, function(err, user){
        if(err) { return sendError(res, 'INVALID_TOKEN'); }
        var Survey = mongoose.model('Survey');

        Survey.find({userId: user._id}, function(err, results) {
            if(err) { return sendError(res, err); }

            res.json({success: true, surveyList: results});
        });
    });
};

exports.read = function(req, res) {
    var decodedToken = req.decodeToken;
    var Survey = mongoose.model('Survey');
    var id = req.params.id;

    Survey.findOne({_id: id})
        .exec(function(err, survey) {
            if( err ) { return sendError(res, err); }
            if( !survey ) { return sendError(res, 'INVALID_QUERY'); }
            if( survey.userId.toString() !== decodedToken._id ) { return sendError(res, 'PERMISSION_DENIED'); }

            res.json({success: true, survey: survey});
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

            res.json({success: true});
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

