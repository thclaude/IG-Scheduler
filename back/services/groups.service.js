const loki = require('lokijs');
const db = new loki('iesn-scheduler.db');

module.exports = () => {
    return {
        getByBloc: function (id) {
            return new Promise(function (resolve, reject) {
                db.loadDatabase({}, function () {
                    try {
                        const groups = db.getCollection('groups');
                        const groupsBloc = groups.findOne({'bloc': id});
                        resolve(groupsBloc);
                    } catch (err) {
                        reject(err);
                    }
                })
            });
        }
    }
};
