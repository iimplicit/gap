/**
 * Created by syntaxfish on 15. 2. 2..
 */
var ErrorCode = require('./ErrorCode');
var _ = require('underscore');

var secret = require('../config').jwt.secret;
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');
var json2csv = require('json2csv');

var logger = require('./logger');


/**
 *
 * Send error code to client and error logging
 *
 * @param {WriteableStream} res | HTTP response object
 * @param {Object | String} err | Object is system error object , String is custom error code string
 *
 * @date: 15. 2. 19.
 * @time: 03:13:46
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
exports.sendError = function(res, err) {
    if( typeof err === 'string' && ErrorCode[err] ) {
        // custom error
        logger.cri('[SendError] ' + ErrorCode[err] );
        res.status(ErrorCode[err].status).json(ErrorCode[err]);
    } else {
        // default error
        logger.cri('[SendError] ' + err.stack );
        res.status(ErrorCode['OTHER_CAUSE'].status).json(ErrorCode['OTHER_CAUSE']);
    }
};

/**
 *
 * Make sure that it is a user who is member registration .
 *
 * @param {Object} decodedToken | Decoded Token : { username, password }
 * @param {function(error, result)} callback | Callback function
 *
 * @date: 15. 2. 19.
 * @time: 03:16:31
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
exports.existUser = function(decodedToken, callback) {
    var User = mongoose.model('User');

    User.findOne({_id: decodedToken._id}, function(err, result) {
        if( err ) { return callback(err, result); }
        if( !result ) { return callback('INVALID_TOKEN', result); }

        callback(err, result);
    });
};

/**
 *
 * Decode Token
 *
 * @param {String} token | JosnWebToken
 * @param {function(error, decoded)} callback | Callback function
 *
 * @return {Object} decoded | Decoded Token
 *
 * @date: 15. 2. 19.
 * @time: 04:01:12
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
exports.decodeToken = function(token, callback) {
    token = token.split('Bearer ')[1];
    var error = null;
    try{
        var decoded = jwt.verify(token, secret);

        Object.keys(decoded).forEach(function(key) {
            if( typeof decoded[key] === 'string' ) {
                decoded[key] = decoded[key].replace('\'', '');
            }
        });
    }catch(err) {
        error = err;
    }

    if(_.isFunction(callback)) {
        return callback(error, decoded);
    } else {
        return decoded;
    }
};

/**
 *
 * Create Anonymouse User
 *
 * @param {String} email | Email address
 * @param {function(error, user)} callback | Callback function
 * 
 * @date: 15. 2. 19.
 * @time: 04:04:05
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
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

/**
 *
 * Export Json to CSV
 *
 * @param {Object} json | Json Object
 * @param {Array<String>} fields | Fields of export to json
 * @param {function(error, result)} callback | Callback function
 * 
 * @return {String} json2csv({data: values, fields: _exportFields(json, fields)}, callback) | Csv string
 *
 * @date: 15. 2. 19.
 * @time: 04:05:40
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
exports.exportJson2Csv = function(json, fields, callback) {
    var values = [];
    if( !json ) { return callback(new Error('Json Must not be Null')); }
    if(_.isArray(json) !== true) { json = [json];}


    json.forEach(function(survey) {
        Array.prototype.push.apply(values, _exportJsonArray(survey));
    });

    return json2csv({data: values, fields: _exportFields(json, fields)}, callback);
};

/**
 *
 * Change json with mutable form in CSV
 *
 * @param {Object} object | Survey result Object
 *
 * @return {Array<Object>} jsonList | Survey result array
 * 
 * @date: 15. 2. 19.
 * @time: 04:08:24
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
function _exportJsonArray(object) {
    var jsonList = [{}];
    var keys = _.keys(object);

    keys.forEach(function(key) {
        if(_.isArray(object[key])) {
            var arr = object[key];
            var tempJsonList = [];

            arr.forEach(function(innerObject) {

                if(_.isObject(innerObject)) {
                    jsonList.forEach(function(origin) {
                        tempJsonList.push(_.extend(_.clone(origin), innerObject));
                    });
                } else {
                    jsonList.forEach(function(origin) {
                        var cloneObject = _.clone(origin);
                        cloneObject[key] = innerObject;
                        tempJsonList.push(cloneObject);
                    });
                }
            });

            jsonList = tempJsonList;
        } else if(_.isObject(object[key])) {
            _.map(jsonList, function(json) {
                return _.extend(json, object[key]);
            });
        } else {
            _.map(jsonList, function(json) {
                return json[key] = object[key];
            });
        }
    });

    return jsonList;
};

/**
 *
 * Extract the Fields of Json.
 *
 * @param {Object} json | Survey result object
 * @param {fields} fields | Extraction Fields
 *
 * @return {Array<String>} newFields |
 *
 * @date: 15. 2. 19.
 * @time: 04:24:39
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
function _exportFields(json, fields) {
    json = _.isArray(json) ?
        json[0] :
        json;

    var newFields = [];

    fields.forEach(function(field) {
        var object = json[field];
        if(_.isArray(object) && object.length > 0) {
            fields = _.without(fields, field);
            Array.prototype.push.apply(newFields, _.keys(object[0]));
        } else if(_.isObject(object)) {
            fields = _.without(fields, field);
            Array.prototype.push.apply(newFields, _.keys(object));
        } else {
            newFields.push(field);
        }

    });

    return newFields;
};
