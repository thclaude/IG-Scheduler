const express = require('express');
const logger = require('morgan');

const http = require('http');
const cron = require('node-cron');
const bp = require("body-parser");
const apiRouter = require('./routes/api');
const calendarRouter = require('./routes/calendar');
const serverWebPort = require('./settings.json').serverWebPort;
const { load } = require('./utils.js');


// Update des codes pour les requêtes toutes les 5minutes entre 6h et 6h30
cron.schedule('0-30/1 6 * * *', utils.updateClassesCodes);
load();

const app = express();
app.use(bp.json({extend:true}));
app.use(bp.text({extend:true}));
app.use(bp.urlencoded({ extended: true }));
app.use(logger('tiny'));


app.use('/api', apiRouter);
app.use('/calendar', calendarRouter);

http.createServer(app).listen(serverWebPort, function () {
    console.log(`Webserver started on port ${serverWebPort}`);
});

module.exports = app;
