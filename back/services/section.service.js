const { getSectionInfosForVue } = require('../utils')
module.exports = () => {
    return {
        getBySection: function (section = 'IG') {
            return new Promise(function (resolve, reject) {
                try{
                    let sectionInfos = getSectionInfosForVue(section);
                    resolve(sectionInfos);
                }catch(e){
                    reject('404');
                }
            });
        }
    }
};
