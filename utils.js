const credentials = require('./credentials.json');
const fetch = require("node-fetch");
const blocs = require('./blocs.json');
const _ = require('lodash');

let currentCodes;

module.exports = {
    load: () => {
        module.exports.majCodes(true);
    },

    envoiMessageDiscord: (message, isErr = true) =>{
        const discordMessage = {
            content: isErr ? `<@${credentials.idDiscord}>` : "",
            avatar_url: "https://portail.henallux.be/favicon-96x96.png",
            username: "IESNScheduler",
            title: isErr ? "Error" : "Information",
            embeds: [{
                timestamp: new Date(Date.now()),
                color: isErr ? 16723200 : 51980,
                fields: [
                    {
                        name: "Message",
                        value: message
                    }
                ]
            }]
        };

        fetch(credentials.webhookURL, {
            method: 'post',
            body: JSON.stringify(discordMessage),
            headers: { 'Content-Type': 'application/json' },
        }).catch(err => console.log(err));
    },

    majCodes: (onLoad = false) => {
        rechercheCodes
            .then(res => {
                const reqCodes = JSON.stringify(res);

                if(!onLoad)
                    module.exports.envoiMessageDiscord("Checking if code update is necessary : " + (_.isEqual(currentCodes, reqCodes) ? "no" : "yes"), false);

                if(!_.isEqual(currentCodes, reqCodes)){
                    currentCodes = reqCodes;
                    module.exports.envoiMessageDiscord(onLoad ? "Codes added to cache" : "Codes updated", false);
                }
            })
            .catch(err => {
                module.exports.envoiMessageDiscord("Error when searching codes " + err);
            })
    },

    getListeSelect: () => {
        let listeSelect = {1: [], 2: [], 3: []};
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
        return listeSelect;
    },

    getFullParamsCours: (cours) => {
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

        return paramCrsFull
    },

    getCurrentCodes: () => {
        return JSON.parse(currentCodes);
    }
};

const rechercheCodes = new Promise(async function(resolve, reject) {
    let jsonUpdated = {};
    try{
        let resBlocID = await fetch(`https://portail.henallux.be/api/classes/orientation_and_implantation/6/1`, {
            "method": "GET",
            "headers": {
                "authorization": `Bearer ${credentials.bearerPortail}`
            }
        });
        let resBlocIDFormatted = await resBlocID.json();
        let blocsID = resBlocIDFormatted.data.map(item => item.id);
        for (let blocID of blocsID) {
            let resGroupID = await fetch(`https://portail.henallux.be/api/classes/classe_and_orientation_and_implantation/${blocID}/6/1`, {
                "method": "GET",
                "headers": {
                    "authorization": `Bearer ${credentials.bearerPortail}`
                }
            });
            let resGroupIDFormatted = await resGroupID.json();
            let groupes = resGroupIDFormatted.data.filter(grp => grp.classe);
            for (let groupe of groupes) {
                let idGroupe = groupe.annee.charAt(0) + groupe.classe;
                jsonUpdated[idGroupe] = groupe.id;
            }
        }
        resolve(jsonUpdated);
    }catch(e){
        reject(e);
    }
});