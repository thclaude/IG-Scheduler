const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
const http = require('http');
const indexRouter = require('./routes/index');
const calendarRouter = require('./routes/calendar');
const helpRouter = require('./routes/help');
const portServerWeb = require('./settings.json').portServerWeb;
const utils = require('./utils.js');
const cron = require('node-cron');

// Update des codes pour les requêtes tous les matins à 6h01
cron.schedule('*/5 * * * *', utils.majCodes);

const app = express();

// create a rotating write stream
const accessLogStream = rfs('access.log', {
    interval: '1d',
    path: path.join(__dirname, 'log')
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('combined', {
    stream: accessLogStream, skip: function (req, res) {
        return res.statusCode < 400
    }
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/calendar', calendarRouter);
app.use('/help', helpRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.render('error', {errorCode: err.status, toastrNotif: false});
});

http.createServer(app).listen(portServerWeb, function () {
    console.log(`Webserver started on port ${portServerWeb}`);
});

module.exports = app;
