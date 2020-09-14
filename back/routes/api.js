const express = require('express');
const router = express.Router();
const { getAllSections, sendDiscordMessage } = require('../utils');
const cors = require('cors');

router.all('*', cors({
    origin: '*',
    optionsSuccessStatus: 200
}))

router.all('/discord/*', cors({
    origin: 'https://iesn.thibaultclaude.be/',
    optionsSuccessStatus: 200
}))

const classesService = require('../services/classes.service')();
const groupsService = require('../services/groups.service')();
const calendarService = require('../services/calendar.service')();
const sectionService = require('../services/section.service')();

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

router.get('/calendar/:blocGroup', function (req, res, next) {
    let blocGroup = req.params.blocGroup;
    calendarService.getByBlocGroup(blocGroup)
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.status(404).send('Not Found');
        })
});

router.get('/section/:section', function (req, res, next) {
    let section = req.params.section;
    if(!getAllSections().includes(section)) return res.status(404).send('Not Found');
    sectionService.getBySection()
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.status(404).send('Not Found');
        })
});

router.post('/discord/send', function (req, res, next) {
    if(req.get('origin') !== 'https://iesn.thibaultclaude.be/') return res.status(403).send('Forbidden');
    try{
        const message = `**Section** : ${req.body.section}
                   **Cours** : ${req.body.classe || 'Non communiqué'}
                   **Contact** : ${req.body.contact || 'Non communiqué'}
                   **Description** : ${req.body.description}`
        sendDiscordMessage({title: "Bug Report", text: message }, false);
        res.status(200).send('Sended');
    }catch(e){
        console.error(e)
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;
