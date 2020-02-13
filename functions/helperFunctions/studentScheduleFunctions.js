const axios = require("axios");
const apiEndpoints = require("../apiEndpoints");
const moment = require("moment");

const getTimefromTimestamp = (timestamp) => {
  var regex = /\T(.*?)\+/;
  var regTime = regex.exec(timestamp)[1];

  var timeArr = regTime.split(":");
  var onlySortedTime = timeArr.slice(0, -1).join(":");

  return onlySortedTime;
}

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
            var stime = getTimefromTimestamp(startTime);
            var etime = getTimefromTimestamp(endTime);

            return {
              success: true,
              message: `You have a ${lectureName} Lecture coming up next from ${stime} to ${etime}. Lecture will be taken by ${teacherName}. `,
              lectures: filteredWokrHours
            };
          }
        } else {
          return {
            success: false,
            message: `You have no lectures coming up next`
          };
        }
      } else {
        console.log("No Lecture Added");
        return {
          success: false,
          message: `Sorry I am unable to find any lectures`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but the requested lecture(s) are not added yet.`
      };
    });

module.exports.getNextLectureDetails = getNextLectureDetails;
module.exports.getTimefromTimestamp = getTimefromTimestamp;
