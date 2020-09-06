const express = require('express');
const router = express.Router();

const classesService = require('../services/classes.service')();
const groupsService = require('../services/groups.service')();

router.get('/groups/:blocID', function (req, res, next) {
    let blocID = parseInt(req.params.blocID);
    groupsService.getByBloc(blocID)
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.status(404).send('Not Found');
        })
});

router.get('/classes/:blocID', function (req, res, next) {
    let blocID = parseInt(req.params.blocID);
    classesService.getByBloc(blocID)
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.status(404).send('Not Found');
        })
});

module.exports = router;
