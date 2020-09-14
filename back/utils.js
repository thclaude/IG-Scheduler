const credentials = require('./credentials.json');
const axios = require('axios');
const _ = require('lodash');
const fs = require('fs');
const IESNInfos = require('./IESN.json');
const groupsIESN = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

const axiosPortailLog = axios.create({
    baseURL: 'https://portail.henallux.be/api/',
    timeout: 15000,
    headers: {
        'Authorization': 'Bearer ' + credentials.bearerPortail,
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'
    }
});

let currentCodes;

module.exports = {
    load: () => {
        module.exports.updateClassesCodes(true);
    },

    sendDiscordMessage: (messageObj, isErr = true) => {
        const discordMessage = {
            content: isErr ? `<@${credentials.idDiscord}>` : "",
            avatar_url: "https://portail.henallux.be/favicon-96x96.png",
            username: "IESNScheduler",
            embeds: [{
                timestamp: new Date(Date.now()),
                color: isErr ? 16723200 : 51980,
                fields: [
                    {
                        name: messageObj.title,
                        value: messageObj.text
                    }
                ]
            }]
        };
        axios({
            method: 'post',
            url: credentials.webhookURL,
            data: JSON.stringify(discordMessage),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    updateClassesCodes: (onLoad = false) => {
        searchClassesCodes()
            .then(res => {
                let reqCodes = JSON.stringify(res);

                if (!_.isEqual(currentCodes, reqCodes)) {
                    currentCodes = reqCodes;
                    module.exports.sendDiscordMessage( {title: "Information", text: onLoad ? "Codes mis en cache" : "Code mis à jour" }, false);
                }
                //getCalendars();
            })
            .catch(err => {
                module.exports.sendDiscordMessage({title: "Erreur cache des codes-cours", text: "**Détails** : " + err });
            })
    },

    getCurrentCodes: () => {
        return JSON.parse(currentCodes);
    },

    getAxiosPortailLog: () => {
        return axiosPortailLog;
    },

    getBlocInfosForVue: (blocNb, section = 'IG') => {
        let finalArray = []
        if(IESNInfos[section][blocNb]){
            const UEwithClasses = IESNInfos[section][blocNb].classes.filter(classe => classe.classes)
            const UEWithoutClasses = IESNInfos[section][blocNb].classes.filter(classe => !classe.classes)

            UEWithoutClasses.map(mapToVueObject).forEach(classe => finalArray.push(classe))

            UEwithClasses.forEach(classe => {
                finalArray.push({header: classe.displayName})
                classe.classes.map(mapToVueObject).forEach(c => finalArray.push(c))
            })
        }
        return finalArray
    },

    getBlocInfosForCalendar: (section = 'IG') => {
        let cleanBlocs = {
            1: [],
            2: [],
            3: []
        };

        for(let i = 1; i <= 3; i++){
            if(IESNInfos[section][i].classes.length > 0){
                const UEwithClasses = IESNInfos[section][i].classes.filter(classe => classe.classes)
                const UEWithoutClasses = IESNInfos[section][i].classes.filter(classe => !classe.classes)
                UEWithoutClasses.map(mapToCalendar).forEach(classe => {
                    cleanBlocs[i].push(classe);
                })

                UEwithClasses.forEach(classe => {
                    classe.classes.map(mapToCalendar).forEach(c => {
                        cleanBlocs[i].push(c);
                    })
                })
            }
        }

        const allClassesLabels = [].concat(cleanBlocs[1], cleanBlocs[2], cleanBlocs[3]).map(elem => elem.displayName);

        return {
            cleanBlocs,
            allClassesLabels
        }
    },

    getGroupsInfos: (blocNumber, section = 'IG') => {
        return IESNInfos[section][blocNumber].groups;
    },

    getSectionInfosForVue: (section = 'IG') => {

        let tempObject = {
            /*bloc1: {
                groups: [],
                classes: []
            },bloc2: {
                groups: [],
                classes: []
            },bloc3: {
                groups: [],
                classes: []
            }*/
        }
        for(let blocNumber = 1; blocNumber <= 3; blocNumber ++){
            tempObject["bloc" + blocNumber] = {
                groups: [],
                classes: []
            }
            tempObject["bloc" + blocNumber].classes = module.exports.getBlocInfosForVue(blocNumber, section);
            if(tempObject["bloc" + blocNumber].classes.length > 0){
                module.exports.getGroupsInfos(blocNumber, section).forEach(grpLetter => {
                    tempObject["bloc" + blocNumber].groups.push({
                        text: "Groupe " + grpLetter, value: `${blocNumber + grpLetter}`
                    })
                })
            }
        }

        return tempObject;
    },

    getAllSections: () => {
        return Object.keys(IESNInfos)
    }
};

const searchClassesCodes = () => {
    return new Promise(async (resolve, reject) => {
        let updatedJson = {};
        try {
            let resBlocsID = await axiosPortailLog.get('classes/orientation_and_implantation/6/1', {
                transformResponse: [function (data) {
                    let jsonData = JSON.parse(data);
                    return jsonData.data.map(item => item.id);
                }]
            });

            for (let bloc of resBlocsID.data) {
                let resClassesID = await axiosPortailLog.get(`classes/classe_and_orientation_and_implantation/${bloc}/6/1`, {
                    transformResponse: [function (data) {
                        let jsonData = JSON.parse(data);
                        return jsonData.data.filter(grp => grp.classe);
                    }]
                });
                for (let classe of resClassesID.data) {
                    let classeID = classe.annee.charAt(0) + classe.classe;
                    updatedJson[classeID] = classe.id;
                }
            }
            resolve(updatedJson);
        } catch (e) {
            reject(e);
        }
    })
}

const mapToVueObject = (obj) => {
    return {
        text: obj.displayName,
        value: obj.id
    }
}

const mapToCalendar = (obj) => {
    return {
        displayName: obj.displayName,
        completeName: obj.completeName,
        id: obj.id
    }
}

const getCalendars = () => {
    const currentCodes = module.exports.getCurrentCodes();

    for (const classe in currentCodes) {
        const writer = fs.createWriteStream('./calendars/' + classe + '.ical');

        axios({
            method: 'get',
            url: `https://portail.henallux.be/api/plannings/promotion/[%22${currentCodes[classe]}%22]/ical`,
            responseType: 'stream',
            timeout: 15000,
            headers: {
                'Authorization': 'Bearer ' + credentials.bearerPortail,
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'
            }
        }).then(response => {
            return new Promise((resolve, reject) => {
                response.data.pipe(writer);
                let error = null;
                writer.on('error', err => {
                    error = err;
                    writer.close();
                    reject(err);
                });
                writer.on('close', () => {
                    if (!error) {
                        resolve(true);
                    }
                });
            });
        });
    }
}
