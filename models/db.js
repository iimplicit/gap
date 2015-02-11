/**
 * Created by syntaxfish on 15. 2. 2..
 */
var mongoose = require('mongoose');
var dbURI = require('../config').mongodb.dbURI;

module.exports = (function() {
    console.log('try connect : ', dbURI);

    mongoose.connect(dbURI, {auto_reconnect: true});

    mongoose.connection
        .on('connected', function() {
        console.log('mongodb connected : ', dbURI);
    })
        .on('disconnected', function() {
        console.log('mongodb disconnected : ', dbURI);
    })
        .on('reconnected', function() {
        console.log('mongodb reconnected : ', dbURI);
    })
        .on('error', function() {
        console.log('mongodb error : ', dbURI);
    });

    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            console.log('Mongoose disconnected through app termination');
            process.exit(0);
        });
    });

    return mongoose;
})();