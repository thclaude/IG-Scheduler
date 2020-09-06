const express = require('express');
const router = express.Router();

const classesService = require('../services/classes.service')();
const groupsService = require('../services/groups.service')();

router.get('/groups/:blocID', function (req, res, next) {
    let blocID = parseInt(req.params.blocID);
    groupsService.getByBloc(blocID)
        .then(result => {
            if(!result)
                res.status(404).send('Not Found');
            else
                res.json(result)
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        })
});

router.get('/classes/:blocID', function (req, res, next) {
    let blocID = parseInt(req.params.blocID);
    classesService.getByBloc(blocID)
        .then(result => {
            if(!result)
                res.status(404).send('Not Found');
            else
                res.json(result)
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        })
});

module.exports = router;
