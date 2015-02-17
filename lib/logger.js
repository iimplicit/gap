/**
 * Created by syntaxfish on 15. 2. 16..
 */


module.exports = (function() {
    'use strict';

    var winston = require('winston');
    var loggingOption = require('../config').loggingOption;

    var DailyRotateFile = winston.transports.DailyRotateFile;
    var Console = winston.transports.Console;

    var logger = new (winston.Logger)({
        levels: loggingOption.levels,
        colors: loggingOption.colors,
        transports: [
            new DailyRotateFile({
                filename: 'log/log',
                datePattern: '.yyyy-MM-dd',
                colorize: true,
                level: 'normal',
                timestamp: true,
                maxsize: 1024,
                maxFiles: 10
            }),
            new Console({
                colorize: true,
                level: 'info'
            })
        ]
    });

    return logger;
})();

