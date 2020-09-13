/*
    TODO :
        Utiliser du NoSQL (mongo?)
        Implémenter toutes les méthodes (CRUD)
 */
const utils = require('../utils')
module.exports = () => {
    return {
        getByBloc: function (id) {
            return new Promise(function (resolve, reject) {
                switch (id) {
                    case 1:
                        resolve(utils.getBlocInfosForVue(1))
                        break;
                    case 2:
                        resolve(utils.getBlocInfosForVue(2))
                        break;
                    case 3:
                        resolve(utils.getBlocInfosForVue(3))
                        break;
                    default:
                        reject("404");
                }
            });
        }
    }
};
