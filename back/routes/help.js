const express = require('express');
const router = express.Router();
const utils = require('../utils.js');

router.get('/', function (req, res, next) {
    utils.renderTemplate(res, req, 'help', {
        title: 'Help'
    });
});

module.exports = router;
