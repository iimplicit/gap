var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();
var cors = require('cors');

var config = require('./config');
var db = require('./models/db');
var models = require('./models');
var expressJWT = require('express-jwt');

var sendError = require('./lib/util').sendError;


// view engine setup
global.publicpath = __dirname+'/public/';
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(expressJWT({ secret: config.jwt.secret}).unless({path: ['/api/login','/api/users', new RegExp('^/api/surveys'), new RegExp('^/api/surveys/submit')]}));

app.use('/', routes);
app.use('/users', users);
app.use('/api', api);

app.use(function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// UnauthorizedError handler
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return sendError(res, 'INVALID_TOKEN')
    }
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
