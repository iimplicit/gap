/**
 * Created by syntaxfish on 15. 2. 2..
 */
var mongoose = require('mongoose');
var _ = require('underscore');

var jwt = require('jsonwebtoken');
var secret = require('../config').jwt.secret;

var sendError = require('../lib/util').sendError;
var decodeToken = require('../lib/util').decodeToken;


exports.create = function(req, res) {
    if( _.isEmpty(req.body) ) {return sendError(res, 'JSON_MISSING'); }

    var User = mongoose.model('User');
    var body = req.body;

    if( !body.username ) { return sendError(res, 'USERNAME_MISSING'); }
    if( !body.password ) { return sendError(res, 'PASSWORD_MISSING'); }


    User.create(body, function(err, user) {
        if( err && err.code === 11000 ) { return sendError(res, 'ACCOUNT_ALREADY_LINKED'); }
        if( err ) { return sendError(res, err); }

        res.json({success: true, token: _createToken(user)});
    });
};

exports.login = function(req, res) {
    if( _.isEmpty(req.body) ) {return sendError(res, 'JSON_MISSING'); }

    var User = mongoose.model('User');
    var username = req.body.username;
    var password = req.body.password;

    if( !username ) { return sendError(res, 'USERNAME_MISSING'); }
    if( !password ) { return sendError(res, 'PASSWORD_MISSING'); }

    User.findOne({username: username})
        .select('_id password username')
        .exec(function(err, user) {
            if( err ) { return sendError(res, err); }
            if( !user ) { return sendError(res, 'INVALID_USERNAME'); }
            if( user.password !== password ) { return sendError(res, 'INVALID_PASSWORD'); }

            res.json({success: true, token: _createToken(user)});
        });
};

exports.delete = function(req, res) {
    var token = req.get('Authorization');
    if( !token ) { return sendError(res, 'TOKEN_MISSING'); }

    var User = mongoose.model('User');
    var user = decodeToken(token);

    User.remove({_id: user._id}, function(err, result) {
        if( err ) { return sendError(res, err); }
        if( result === 0 ) { return sendError(res, 'INVALID_QUERY'); }

        res.json({success: true});
    });
};

exports.read = function(req, res) {
    var token = req.get('Authorization');
    if( !token ) { return sendError(res, 'TOKEN_MISSING'); }

    var User = mongoose.model('User');
    var user = decodeToken(token);

    User.findOne({_id: user._id})
        .select('username email')
        .exec(function(err, user) {
            if( err ) { return sendError(res, err); }
            if( !user ) { return sendError(res, 'INVALID_QUERY'); }

            res.json({success: true, user: user});
        });
};

exports.update = function(req, res) {
    var token = req.get('Authorization');
    if( !token ) { return sendError(res, 'TOKEN_MISSING'); }

    var user = decodeToken(token);
    var User = mongoose.model('User');
    var body = req.body;

    if( !user._id ) { return sendError(res, 'INVALID_TOKEN'); }

    // can't change username, _id
    delete body.username;
    delete body._id;

    body.updatedAt = Date.now();

    User.update({_id: user._id}, {$set: body}, function(err, result) {
        if( err ) { return sendError(res, err); }
        if( result === 0 ) { return sendError(res, 'INVALID_QUERY'); }

        res.json({success: true});
    });
};


function _createToken(user) {
    if( user.password ) { delete user.password; }

    return jwt.sign(user, secret, { expiresInMinutes: 1 }); 
};
