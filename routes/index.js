const express = require('express');
const router = express.Router();
const blocs = require('../blocs.json');
let listeSelect = {1: [], 2: [], 3: []};

/*
    j'ai utilisé la variable "calendarURLRedirect" que je passe dans la view index.ejs qui me permet d'ajouter #calendarURL à l'URL après la redirection de la génération d'URL
        - ça permet d'attérir directement au niveau du champ de l'URL
        - je n'ai pas trouvé (impossible?) comment l'implémenter directement dans le "res.render('index', ...)"
 */

/* Parcours du fichiers "blocs.json" pour préparer une liste qui sera utilisée pour remplir les selectss dans la view index.ejs */
for (let bloc in blocs) {
    for (let cours in blocs[bloc]) {
        let tempSelect = {
            value: blocs[bloc][cours],
            text: cours
        };
        listeSelect[bloc].push(tempSelect);
    }
}

router.get('/', function (req, res, next) {
    res.render('index', {calendarURL: '', listeSelect: listeSelect, calendarURLRedirect: false, toastrNotif: false});
});

router.post('/', function (req, res, next) {
    if (!req.body.Groupes) { // Aucun groupe sélectionné
        res.render('index', {
            calendarURL: '',
            listeSelect: listeSelect,
            calendarURLRedirect: falsse,
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

        /*
            Parcours des cours sélectionnés pour la génération des String pour les paramètres URL
                - A revoir ?
        */
        let tempCrs1 = cours.filter(crs => crs === "1" || (crs >= 100 && crs <= 199));
        let paramCrs1 = `${tempCrs1.includes("1") ? 'crs1[]=all' : tempCrs1.map(crs => `crs1[]=${crs}`).join('&')}`;
        let tempCrs2 = cours.filter(crs => crs === "2" || (crs >= 200 && crs <= 299));
        let paramCrs2 = `${tempCrs2.includes("2") ? 'crs2[]=all' : tempCrs2.map(crs => `crs2[]=${crs}`).join('&')}`;
        let tempCrs3 = cours.filter(crs => crs === "3" || (crs >= 300 && crs <= 399));
        let paramCrs3 = `${tempCrs3.includes("3") ? 'crs3[]=all' : tempCrs3.map(crs => `crs3[]=${crs}`).join('&')}`;

        /*
            Concatenation des paramètres précédemment créés
                - A revoir?
         */
        let paramCrsFull = (paramCrs1 && paramCrs1.length > 0) ? '&' + paramCrs1 : '';
        paramCrsFull += (paramCrs2 && paramCrs2.length > 0) ? '&' + paramCrs2 : '';
        paramCrsFull += (paramCrs3 && paramCrs3.length > 0) ? '&' + paramCrs3 : '';

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
