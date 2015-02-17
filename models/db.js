/**
 * Created by syntaxfish on 15. 2. 2..
 */
var mongoose = require('mongoose');
var dbURI = require('../config').mongodb.dbURI;
var logger = require('../lib/logger');


module.exports = (function() {
    logger.info('Try connect Mongodb : ' + dbURI);

    mongoose.connect(dbURI, {auto_reconnect: true});

    mongoose.connection.on('connected', function() {
        logger.info('Connected Mongodb : ' + dbURI);
    }).on('disconnected', function() {
        logger.minor('Disconnected Mongodb : ' + dbURI);
    }).on('reconnected', function() {
        logger.info('Reconnected Mongodb : ' + dbURI);
    }).on('error', function(err) {
        logger.info('Error Mongodb : ' + dbURI + ' ' + err.stack);
    });

    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            logger.cri('Mongoose disconnected through app termination : ' + dbURI);
            process.exit(0);
        });
    });

    return mongoose;
})();