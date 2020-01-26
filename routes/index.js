const express = require('express');
const router = express.Router();
const utils = require('../utils.js');
const selectList = utils.getSelectList();
/*
    j'ai utilisé la variable "calendarURLRedirect" que je passe dans la view index.ejs qui me permet d'ajouter #calendarURL à l'URL après la redirection de la génération d'URL
        - ça permet d'attérir directement au niveau du champ de l'URL
        - je n'ai pas trouvé (impossible?) comment l'implémenter directement dans le "res.render('index', ...)"
 */

router.get('/', function (req, res, next) {
    utils.renderTemplate(res, req, 'index', {
        selectList: selectList,
        title: 'Home',
        calendarURL: req.flash('calendarURL'),
        toCalendarURL: req.flash('toCalendarURL')
    });
});

router.post('/', function (req, res, next) {
    if (!req.body.Classes) { // Aucun groupe sélectionné
        req.flash('errorToast', 'Aucun groupe sélectionné');
        res.redirect('/');
    } else {
        let fullURL = 'https://iesn.thibaultclaude.be' + req.originalUrl;

        /* Génération (ou copie si plusieurs groupes sélectionnés de l'array contenant les groupes */
        let classes = [];
        if (!Array.isArray(req.body.Classes)) {
            classes.push(req.body.Classes);
        } else {
            classes = req.body.Classes;
        }

        /* Idem mais avec les cours */
        let courses = [];
        if (!Array.isArray(req.body.Courses)) {
            courses.push(req.body.Courses);
        } else {
            courses = req.body.Courses;
        }

        /* Idem mais avec les langues */
        let languages = [];
        if (req.body.SecondLanguage2 && classes.map(classe => classe.substring(0, 1)).includes('2'))
            languages.push(req.body.SecondLanguage2);
        if (req.body.SecondLanguage3 && classes.map(classe => classe.substring(0, 1)).includes('3'))
            languages.push(req.body.SecondLanguage3);

        const paramCrsFull = utils.getFullParamsCours(courses, languages);

        req.flash('successToast', 'Calendrier généré avec succès');
        req.flash('calendarURL', `${fullURL}calendar?${classes.map(classe => `grp[]=${classe}`).join('&')}${paramCrsFull}`);
        req.flash('toCalendarURL', true);

        res.redirect('/');
    }
});

module.exports = router;
