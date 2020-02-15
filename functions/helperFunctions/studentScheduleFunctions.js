const axios = require("axios");
const apiEndpoints = require("../apiEndpoints");
const moment = require("moment");

const generalFunctions = require("./generalFunctions.js");

const getNextLectureDetails = async (userSemester, userDepartment) =>
  await axios
    .get(apiEndpoints.studentScheduleUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        let d = new Date();
        let n = d.getDay();

        let dept = userDepartment;
        let semcode = userSemester;

        const allTodaysLectures = data
          .filter(function(i) {
            return i.deptcode === dept;
          })
          .map(function(i) {
            return i.activesem;
          })[0]
          .filter(function(i) {
            return i.semid == semcode;
          })
          .map(function(i) {
            return i.schedule;
          })[0]
          .filter(function(i) {
            return i.dayid == n;
          });

        let format = "HH:mm:ss";
        let hourFormat = "HH:mm";
        let currentTime = moment().format(format);
        let maxStartHour = moment(currentTime, format);

        let filteredWokrHours = allTodaysLectures.filter(function(el) {
          let start = moment(el.startTime).format(hourFormat);
          let checkHourStart = moment(start, format);

          return checkHourStart.isAfter(maxStartHour);
        });

        if (filteredWokrHours.length > 0) {
          const arr = filteredWokrHours[0];

          const {
            lectureName,
            teacherName,
            breakValue,
            startTime,
            endTime
          } = arr;

          if (breakValue == true) {
            return {
              success: true,
              message: `You have a break coming up next.`,
              lectures: filteredWokrHours
            };
          } else {
            var stime = generalFunctions.getTimefromTimestamp(startTime);
            var etime = generalFunctions.getTimefromTimestamp(endTime);

            return {
              success: true,
              message: `You have a ${lectureName} Lecture coming up next from ${stime} to ${etime}. Lecture will be taken by ${teacherName}. `,
              lectures: filteredWokrHours
            };
          }
        } else {
          return {
            success: false,
            message: `You have no lectures coming up next. I think you are done for the day. Enjoy!!`
          };
        }
      } else {
        console.log("No Lecture Added");
        return {
          success: false,
          message: `Sorry but I am unable to find any lectures for your request`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am not still informed about the requested lecture(s). Please try again later.`
      };
    });

const getAllTodaysLectures = async (userSemester, userDepartment) =>
  await axios
    .get(apiEndpoints.studentScheduleUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        let d = new Date();
        let n = d.getDay();

        let dept = userDepartment;
        let semcode = userSemester;

        const allTodaysLectures = data
          .filter(function(i) {
            return i.deptcode === dept;
          })
          .map(function(i) {
            return i.activesem;
          })[0]
          .filter(function(i) {
            return i.semid == semcode;
          })
          .map(function(i) {
            return i.schedule;
          })[0]
          .filter(function(i) {
            return i.dayid == n;
          });

        if (allTodaysLectures.length > 0) {
          const msgs = [];

          for (let i = 0; i <= allTodaysLectures.length - 1; i++) {
            var stime = generalFunctions.getTimefromTimestamp(
              allTodaysLectures[i].startTime
            );
            var etime = generalFunctions.getTimefromTimestamp(
              allTodaysLectures[i].endTime
            );

            if (allTodaysLectures[i].breakValue == false) {
              msgs.push(
                `Lecture no: ${i + 1}. Lecture Name: ${
                  allTodaysLectures[i].lectureName
                }, which will be taken by ${
                  allTodaysLectures[i].teacherName
                }. Lecture is from ${stime} to ${etime} <break time=\"0.7\" />`
              );
            } else {
              msgs.push(
                `Lecture no: ${i +
                  1} is a break from ${stime} to ${etime}. <break time=\"0.7\" />`
              );
            }
          }

          const responseString = msgs.join(". ");

          return {
            success: true,
            fullmessage: `<speak> You have ${allTodaysLectures.length} lecture(s) today. ${responseString} </speak>`,
            message: `You have following ${allTodaysLectures.length} lecture(s) today.`,
            lectures: allTodaysLectures
          };
        } else {
          return {
            success: false,
            message: `Sorry but I am unable to find any lectures for your request. Are you sure it's not a holiday ?`
          };
        }
      } else {
        console.log("No Lecture Added");
        return {
          success: false,
          message: `Sorry but I am unable to find any lectures for your request.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any lectures for your request.`
      };
    });

const getAllTomorrowsLectures = async (userSemester, userDepartment) =>
  await axios
    .get(apiEndpoints.studentScheduleUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        let d = new Date();
        let p = d.getDay();
        let n = p + 1;

        let dept = userDepartment;
        let semcode = userSemester;

        const allLectures = data
          .filter(function(i) {
            return i.deptcode === dept;
          })
          .map(function(i) {
            return i.activesem;
          })[0]
          .filter(function(i) {
            return i.semid == semcode;
          })
          .map(function(i) {
            return i.schedule;
          })[0]
          .filter(function(i) {
            return i.dayid == n;
          });

        if (allLectures.length > 0) {
          const msgs = [];

          for (let i = 0; i <= allLectures.length - 1; i++) {
            var stime = generalFunctions.getTimefromTimestamp(
              allLectures[i].startTime
            );
            var etime = generalFunctions.getTimefromTimestamp(
              allLectures[i].endTime
            );

            if (allLectures[i].breakValue == false) {
              msgs.push(
                `Lecture no: ${i + 1}. Lecture Name: ${
                  allLectures[i].lectureName
                }, which will be taken by ${
                  allLectures[i].teacherName
                }. Lecture is from ${stime} to ${etime} <break time=\"0.7\" />`
              );
            } else {
              msgs.push(
                `Lecture no: ${i +
                  1} is a break from ${stime} to ${etime}. <break time=\"0.7\" />`
              );
            }
          }

          const responseString = msgs.join(". ");

          return {
            success: true,
            fullmessage: `<speak> You have ${allLectures.length} lecture(s) tomorrow. ${responseString} </speak>`,
            message: `You have following ${allLectures.length} lecture(s) tomorrow.`,
            lectures: allLectures
          };
        } else {
          return {
            success: false,
            message: `Sorry but I am unable to find any lectures for your request. Are you sure it's not a holiday ?`
          };
        }
      } else {
        console.log("No Lecture Added");
        return {
          success: false,
          message: `Sorry but I am unable to find any lectures for your request.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any lectures for your request.`
      };
    });

module.exports.getNextLectureDetails = getNextLectureDetails;
module.exports.getAllTodaysLectures = getAllTodaysLectures;
module.exports.getAllTomorrowsLectures = getAllTomorrowsLectures;
