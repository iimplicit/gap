/**
 * Created by syntaxfish on 15. 2. 11..
 */

var mongoose = require('mongoose');

exports.survey = function(req, res, next) {
    var token = req.get('Authorization');
    if( !token ) { return sendError(res, 'TOKEN_MISSING'); }



};