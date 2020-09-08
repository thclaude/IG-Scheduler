/*
    TODO :
        Utiliser du NoSQL (mongo?)
        Implémenter toutes les méthodes (CRUD)
 */
module.exports = () => {
    return {
        getByBloc: function (id) {
            return new Promise(function (resolve, reject) {
                switch (id) {
                    case 1:
                        resolve([{text: "Groupe A", value: "1A"}, {text: "Groupe B", value: "1B"}, {
                            text: "Groupe C",
                            value: "1C"
                        }, {text: "Groupe D", value: "1D"}, {text: "Groupe E", value: "1E"}, {
                            text: "Groupe F",
                            value: "1F",
                            disabled: true
                        }, {text: "Groupe G", value: "1G", disabled: true}, {
                            text: "Groupe H",
                            value: "1H",
                            disabled: true
                        }])
                        break;
                    case 2:
                        resolve([{text: "Groupe A", value: "2A"}, {text: "Groupe B", value: "2B"}, {
                            text: "Groupe C",
                            value: "2C",
                            disabled: true
                        }, {text: "Groupe D", value: "2D", disabled: true}, {
                            text: "Groupe E",
                            value: "2E",
                            disabled: true
                        }, {text: "Groupe F", value: "2F", disabled: true}, {
                            text: "Groupe G",
                            value: "2G",
                            disabled: true
                        }, {text: "Groupe H", value: "2H", disabled: true}])
                        break;
                    case 3:
                        resolve([{text: "Groupe A", value: "3A"}, {text: "Groupe B", value: "3B"}, {
                            text: "Groupe C",
                            value: "3C",
                            disabled: true
                        }, {text: "Groupe D", value: "3D"}, {
                            text: "Groupe E",
                            value: "3E",
                            disabled: true
                        }, {text: "Groupe F", value: "3F", disabled: true}, {
                            text: "Groupe G",
                            value: "3G",
                            disabled: true
                        }, {text: "Groupe H", value: "3H", disabled: true}])
                        break;
                    default:
                        reject("404");
                }
            });
        }
    }
};
