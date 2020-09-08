const utils = require('../utils.js');
const axiosPortailLog = utils.getAxiosPortailLog();
const patternDate = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/;
const patternTitle = /Matière : ([a-zA-Z0-9-'ÉéèÈà_!.\/ ()]*)([^\n]*\n+)+/;
const igCourseCode = RegExp('IG[0-9]{3}');
const colors = ['purple', 'deep-purple', 'indigo', 'teal', 'green', 'light-green', 'cyan', 'amber', 'light-blue', 'orange', 'deep-orange', 'brown', 'blue-grey', 'grey', 'shades', 'pink', 'lime'];
module.exports = () => {
    return {
        getByBlocGroup: function (blocGroup) {
            return new Promise(function (resolve, reject) {
                let classesCodes = utils.getCurrentCodes();
                axiosPortailLog.get(`plannings/promotion/[%22${classesCodes[blocGroup]}%22]`, {
                    transformResponse: [function (data) {
                        return JSON.parse(data)
                    }]
                })
                    .then(response => {
                        let tempData = [];
                        let actualCourses = []
                        for (let course of response.data) {
                            if (course.start && course.end) {
                                let codeCourse = course.text.substring(0, 5);
                                let isIGCourseCode = igCourseCode.test(codeCourse)
                                if (!actualCourses.includes(codeCourse) && isIGCourseCode)
                                    actualCourses.push(codeCourse);
                                tempData.push({
                                    color: isIGCourseCode ? colors[actualCourses.indexOf(codeCourse)] : 'red',
                                    end: course.end.replace(patternDate, "$1-$2-$3T$4:$5:$6"),
                                    name: course.details.replace(patternTitle, "$1"),
                                    start: course.start.replace(patternDate, "$1-$2-$3T$4:$5:$6"),
                                    timed: true,
                                    details: course.details.replace(/\n/g, '<br/><br/>')
                                })
                            }
                        }
                        resolve(tempData);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    })
            })
        }
    }
};
