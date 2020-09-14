/*
    TODO :
        Utiliser du NoSQL (mongo?)
        Implémenter toutes les méthodes (CRUD)
 */
const { getGroupsInfos } = require('../utils')
module.exports = () => {
    return {
        getByBloc: function (id) {
            return new Promise(function (resolve, reject) {
                switch (id) {
                    case 1:
                        resolve(getGroupsInfos(1).map(grpLetter => {return {
                                text: `Groupe ${grpLetter}`,
                                value: `1${grpLetter}`
                            }
                        }))
                        break;
                    case 2:
                        resolve(getGroupsInfos(2).map(grpLetter => {return {
                            text: `Groupe ${grpLetter}`,
                            value: `2${grpLetter}`
                        }
                        }))
                        break;
                    case 3:
                        resolve(getGroupsInfos(3).map(grpLetter => {return {
                            text: `Groupe ${grpLetter}`,
                            value: `3${grpLetter}`
                        }
                        }))
                        break;
                    default:
                        reject("404");
                }
            });
        }
    }
};
