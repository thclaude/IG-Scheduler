const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const http = require('http');
const cron = require('node-cron');

const apiRouter = require('./routes/api');
const serverWebPort = require('./settings.json').serverWebPort;
const utils = require('./utils.js');

// Update des codes pour les requêtes toutes les 5minutes entre 6h et 6h30
cron.schedule('0-30/1 6 * * *', utils.updateClassesCodes);
utils.load();

const app = express();

app.use(logger('tiny'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRouter);

http.createServer(app).listen(serverWebPort, function () {
    console.log(`Webserver started on port ${serverWebPort}`);
});

module.exports = app;
