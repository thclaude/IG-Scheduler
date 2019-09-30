const express = require('express');
const router = express.Router();
const utils = require('../utils.js');
const listeSelect = utils.getListeSelect();
/*
    j'ai utilisé la variable "calendarURLRedirect" que je passe dans la view index.ejs qui me permet d'ajouter #calendarURL à l'URL après la redirection de la génération d'URL
        - ça permet d'attérir directement au niveau du champ de l'URL
        - je n'ai pas trouvé (impossible?) comment l'implémenter directement dans le "res.render('index', ...)"
 */

router.get('/', function (req, res, next) {
    res.render('index', {
        calendarURL: '',
        listeSelect: listeSelect,
        calendarURLRedirect: false,
        toastrNotif: false
    });
});

router.post('/', function (req, res, next) {
    if (!req.body.Groupes) { // Aucun groupe sélectionné
        res.render('index', {
            calendarURL: '',
            listeSelect: listeSelect,
            calendarURLRedirect: false,
            toastrNotif: true,
            toastrObject: {
                type: 'error',
                text: 'Aucun groupe sélectionné',
                timeout: 5000
            }
        });

    } else {
        let fullURL = 'https://iesn.thibaultclaude.be' + req.originalUrl;

        /* Génération (ou copie si plusieurs groupes sélectionnés de l'array contenant les groupes */
        let groupes = [];
        if (!Array.isArray(req.body.Groupes)) {
            groupes.push(req.body.Groupes);
        } else {
            groupes = req.body.Groupes;
        }

        /* Idem mais avec les cours */
        let cours = [];
        if (!Array.isArray(req.body.Cours)) {
            cours.push(req.body.Cours);
        } else {
            cours = req.body.Cours;
        }

        const paramCrsFull = utils.getFullParamsCours(cours);

        res.render('index', {
            calendarURL: `${fullURL}calendar?${groupes.map(groupe => `grp[]=${groupe}`).join('&')}${paramCrsFull}`,
            listeSelect: listeSelect,
            calendarURLRedirect: true,
            toastrNotif: true,
            toastrObject: {
                type: 'success',
                text: 'Calendrier généré avec succès',
                timeout: 2000
            }
        });
    }
});

module.exports = router;
