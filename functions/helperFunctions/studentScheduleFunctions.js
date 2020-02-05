const axios = require("axios");
const apiEndpoints = require("../apiEndpoints");
const moment = require("moment");

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

          const { lectureName, teacherName, breakValue } = arr;

          if (breakValue == true) {
            return {
              success: true,
              message: `You have a break coming up next.`
            };
          } else {
            return {
              success: true,
              message: `You have a ${lectureName} Lecture coming up next. Lecture will be taken by ${teacherName}.`
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
