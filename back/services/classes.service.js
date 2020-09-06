const loki = require('lokijs');
const db = new loki('iesn-scheduler.db');

module.exports = () => {
    return {
        getByBloc: function (id) {
            return new Promise(function (resolve, reject) {
                db.loadDatabase({}, function () {
                    try {
                        const classes = db.getCollection('classes');
                        const classesBloc = classes.findOne({'bloc': id});
                        resolve(classesBloc);
                    } catch (err) {
                        reject(err);
                    }
                })
            });
        }
    }
};
