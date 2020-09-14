const express = require('express');
const router = express.Router();
const {getBlocInfosForCalendar, getAxiosPortailLog, getCurrentCodes, sendDiscordMessage, updateClassesCodes} = require('../utils.js');
const ical = require("ical-generator");

const patternDate = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/;
const patternTitle = /Matière : ([a-zA-Z0-9-'ÉéèÈà_!:.\/ ()]*)([^\n]*\n+)+/;
const blocPattern = /\[(\d) IG [A-Z0-9]*]/

const { cleanBlocs, allClassesLabels } = getBlocInfosForCalendar()

const axiosPortailLog = getAxiosPortailLog();

let courses; /* Contiendra la liste des cours que l'utilisateur veut suivre */
let coreCourses; /* Contiendra les cours communs / déjà rencontrés pour ne pas avoir de doublons dans l'horaire */
let isBloc1; // L'utilisateur est du bloc 1
let isBloc2; // L'utilisateur est du bloc 2
let isBloc3; // L'utilisateur est du bloc 3

router.get('/', async function (req, res, next) {
    coreCourses = new Set();
    courses = [];

    let classesCodes = getCurrentCodes();
    let calendar = ical({name: "Cours", timezone: "Europe/Brussels"});

    if (req.query.grp && req.query.grp.every(group => Object.keys(classesCodes).includes(group))) { /* Check que les groupes existent bien */
        blocsDetermine(req.query.grp);
        fillCourses(req.query.crs1, req.query.crs2, req.query.crs3);

        let fetchURLParams = `[${req.query.grp.map(group => `%22${classesCodes[group]}%22`).join(', ')}]`; /* Mets au bon format les groupes avant la requête */
        axiosPortailLog.get(`plannings/promotion/${fetchURLParams}`, {
            transformResponse: [function (data) {
                let jsonData = JSON.parse(data);
                return jsonData.filter(cleanCourses)
            }]
        })
            .then(response => {
                for (let course of response.data) {
                    if (course.start && course.end) {
                        calendar.createEvent({
                            start: new Date(course.start.replace(patternDate, "$1-$2-$3T$4:$5:$6")),
                            end: new Date(course.end.replace(patternDate, "$1-$2-$3T$4:$5:$6")),
                            location: course.location,
                            summary: course.details.replace(patternTitle, "$1"),
                            description: course.details
                        });
                    }
                }
                calendar.serve(res);
            })
            .catch(err => {
                const message = `**Détails** : ${err}\n**FetchURLParams** : ${fetchURLParams}\n**Groupe** : ${req.query.grp.join(', ')}\n**Cours** :\nBloc 1 : ${req.query.crs1}\nBloc 2 : ${req.query.crs2}\nBloc 3 : ${req.query.crs3}`;
                sendDiscordMessage({title: "Erreur /calendar", text: message });
                updateClassesCodes();
            })
    } else {
        res.redirect('/');
    }
});

/*
    On remplit la liste de cours :
        - S'il est dans un bloc, on check si les cours si il a choisi des cours ou qu'il y a all => On ajoute tout
        - Sinon, on parcours la liste des cours sélectionnés et on les ajoute
 */
function fillCourses(course1, course2, course3) {
    if (isBloc1) addCourse(course1, 1);
    if (isBloc2) addCourse(course2, 2);
    if (isBloc3) addCourse(course3, 3);
}

/*
    Clean la liste des cours avec les cours utiles & évite les doublons (cours généraux) si plusieurs groupes du même blocs sont sélectionnés
    Amélioration :
        - Mettre direct le JSON dans le Set ? Possible/utile ? Enlèverai automatiquement les doublons
 */
function cleanCourses(course) {
    let transformedString = `${course.start}/${course.end}/${course.location}/${course.title}/${course.details}`; // On crée une chaîne uniquement

    let coreCourse = coreCourses.has(transformedString); // On regarde si notre Set a déjà cette chaine (=> cours qui a déjà été mis dans le calendrier)
    if (!coreCourse) {
        coreCourses.add(transformedString);
    }

    let isCourse = patternTitle.test(course.details) && allClassesLabels.some(lbl => lbl === course.details.match(patternTitle)[1]); // Si les détails correspondent au pattern (Matière : xxxx) et que le titre est dans tous les labels connus
    let addThisCourse = !isCourse; // Si c'est un cours connu alors on ne l'ajoute pas de suite

    if(isCourse){
        let label = course.details.match(patternTitle)[1];
        let bloc = parseInt(course.text.match(blocPattern)[1]);
        let foundCourse = cleanBlocs[bloc].filter(classe => classe.displayName === label)

        addThisCourse = courses.some(c => c === foundCourse[0].id) // Si l'ID est présent, alors il sera affiché dans le calendrier
    }

    return addThisCourse && !coreCourse; // On check si le cours doit être ajouté et qu'il n'a pas déjà été ajouté
}


function blocsDetermine(classes) {
    isBloc1 = classes.some(classe => classe.substring(0, 1) === '1');
    isBloc2 = classes.some(classe => classe.substring(0, 1) === '2');
    isBloc3 = classes.some(classe => classe.substring(0, 1) === '3');
}

function addCourse(courseParams, blocNum) {
    if (!courseParams || courseParams.includes("all")) {
        for (let classe of cleanBlocs[blocNum]) {
            courses.push(classe.id);
        }
    } else {
        courseParams.forEach(course => {
            courses.push(course);
        })
    }
}

module.exports = router;
