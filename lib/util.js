/**
 * Created by syntaxfish on 15. 2. 2..
 */
var ErrorCode = require('./ErrorCode');
var _ = require('underscore');

var secret = require('../config').jwt.secret;
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');


exports.sendError = function(res, err) {
    //TODO logging
    if( typeof err === 'string' && ErrorCode[err] ) {
        // custom error
        res.status(ErrorCode[err].status).json(ErrorCode[err]);
    } else {
        // default error
        res.status(ErrorCode['OTHER_CAUSE'].status).json(ErrorCode['OTHER_CAUSE']);
    }
};

exports.existUser = function(decodedToken, callback) {
    var User = mongoose.model('User');

    User.findOne({_id: decodedToken._id}, function(err, result) {
        if( err ) { return callback(err, result); }
        if( !result ) { return callback('INVALID_TOKEN', result); }

        callback(err, result);
    });
};

exports.decodeToken = function(token) {
    token = token.split('Bearer ')[1];
    try{
        var decoded = jwt.verify(token, secret);

        Object.keys(decoded).forEach(function(key) {
            if( typeof decoded[key] === 'string' ) {
                decoded[key] = decoded[key].replace('\'', '');
            }
        });
    }catch(err) {
        console.log(err);
    }

    return decoded;
};

exports.createAnonymouseUser = function(email, callback){
    if(!email) {  return callback('USERNAME_MISSING');  }

    var body = {
        username: email,
        email: email,
        password: email
    };

    var User = mongoose.model('User');
    User.create(body, function(err, user) {
        if( err && err.code === 11000 ) { return callback('ACCOUNT_ALREADY_LINKED'); }
        if( err ) { return callback('OTHER_CAUSE'); }

        callback(null,  { result : 'success', userId : user._id } );
    });
};