/**
 * Created by syntaxfish on 15. 2. 11..
 */

var decodeToken = require('../util').decodeToken;
var sendError = require('../util').sendError;


/**
 *
 * Check JsonWebToken middleware
 *
 * @date: 15. 2. 19.
 * @time: 04:28:30
 * @author: Changwook Park ( syntaxfish@gmail.com )
 *
 * **/
exports.token = function(req, res, next) {
    var token = req.get('Authorization');
    if( !token ) { return sendError(res, 'TOKEN_MISSING'); }

    decodeToken(token, function(err, token) {
        if( err ) { return sendError(res, 'INVALID_TOKEN')}
        req.decodeToken = token;
        next();
    });
};