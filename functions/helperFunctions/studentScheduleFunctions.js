const axios = require("axios");
const apiEndpoints = require("../apiEndpoints");
const moment = require("moment");

const endPhrasesModule = require("../resources/endPhrases.js");

const getTimefromTimestamp = timestamp => {
  var regex = /\T(.*?)\+/;
  var regTime = regex.exec(timestamp)[1];

  var timeArr = regTime.split(":");
  var onlySortedTime = timeArr.slice(0, -1).join(":");

  return onlySortedTime;
};

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
            var stime = getTimefromTimestamp(allTodaysLectures[i].startTime);
            var etime = getTimefromTimestamp(allTodaysLectures[i].endTime);

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
            var stime = getTimefromTimestamp(allLectures[i].startTime);
            var etime = getTimefromTimestamp(allLectures[i].endTime);

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

const getMessMeal = async mealType =>
  await axios
    .get(apiEndpoints.messScheduleUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;
      if (data) {
        let d = new Date();
        let n = d.getDay();

        const type = mealType;

        const receivedMealData = data.filter(function(i) {
          return i.dayid == n && i.type == type;
        });

        if (receivedMealData.length > 0) {
          return {
            success: true,
            message: `In ${type} today, we are serving ${receivedMealData[0].fooditems}`
          };
        } else {
          return {
            success: false,
            message: `Sorry but I don't know what's in ${type} today.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find your requested meal.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any mess hall schedule.`
      };
    });

const getAllTodaysMessMeal = async () =>
  await axios
    .get(apiEndpoints.messScheduleUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;
      if (data) {
        let d = new Date();
        let n = d.getDay();

        const receivedMealData = data.filter(function(i) {
          return i.dayid == n;
        });

        if (receivedMealData.length > 0) {
          const msgs = [];

          for (let i = 0; i <= receivedMealData.length - 1; i++) {
            msgs.push(
              `For ${receivedMealData[i].type}, we are serving ${receivedMealData[i].fooditems}. <break time=\"0.7\" />`
            );
          }

          const responseString = msgs.join(". ");

          return {
            success: true,
            message: `In today's Mess Hall Schedule, we are serving following dishes.`,
            fullmessage: `<speak>In today's Mess Hall Schedule, ${responseString}</speak>`,
            mealsarr: receivedMealData
          };
        } else {
          return {
            success: false,
            message: `Sorry but I don't know what's today's mess hall schedule.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find your requested mess hall schedule.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any mess hall schedule.`
      };
    });

const getAllTomorrowsMessMeal = async () =>
  await axios
    .get(apiEndpoints.messScheduleUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;
      if (data) {
        let d = new Date();
        let n0 = d.getDay();
        let n;

        if (n0 == 6) {
          n = 0;
        } else {
          n = n0 + 1;
        }

        const receivedMealData = data.filter(function(i) {
          return i.dayid == n;
        });

        if (receivedMealData.length > 0) {
          const msgs = [];

          for (let i = 0; i <= receivedMealData.length - 1; i++) {
            msgs.push(
              `For ${receivedMealData[i].type}, we are serving ${receivedMealData[i].fooditems}. <break time=\"0.7\" />`
            );
          }

          const responseString = msgs.join(". ");

          return {
            success: true,
            message: `In tomorrow's Mess Hall Schedule, we are serving following dishes.`,
            fullmessage: `<speak>In tomorrow's Mess Hall Schedule, ${responseString}</speak>`,
            mealsarr: receivedMealData
          };
        } else {
          return {
            success: false,
            message: `Sorry but I don't know what's tomorrow's mess hall schedule.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find your requested mess hall schedule.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any mess hall schedule.`
      };
    });

const getRandomNumber = max => {
  return Math.floor(Math.random() * max);
};

const radomEndPhrase = () => {
  const endPhrasesArr = endPhrasesModule.endPhrasesArr;

  const index = getRandomNumber(endPhrasesArr.length);

  const phrase = endPhrasesArr[index];

  return phrase;
};

const getAllAnnouncments = async () =>
  await axios
    .get(apiEndpoints.announcementsUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        const d1 = new Date();
        const n = d1.toDateString();

        console.log(n);

        const receivedAnnouncements = data.filter(function(i) {
          return i.date == n;
        });

        if (receivedAnnouncements.length > 0) {
          const msgs = [];

          for (let i = 0; i <= receivedAnnouncements.length - 1; i++) {
            msgs.push(
              `<audio src="https://showermeditation.s3.amazonaws.com/zapsplat_multimedia_alert_notification_ping_002_45054.mp3" /> ${receivedAnnouncements[i].message} <break time=\"0.7\" />`
            );
          }

          const responseString = msgs.join(". ");

          return {
            success: true,
            fullmessage: `<speak>You have following ${receivedAnnouncements.length} announcement(s) today. ${responseString}</speak>`,
            message: `<speak>You have following ${receivedAnnouncements.length} announcement(s) today.</speak>`,
            announcementarr: receivedAnnouncements
          };
        } else {
          return {
            success: false,
            message: `No announcements for today. Looks like you are all caught up.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find today's announcements.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any announcements.`
      };
    });

module.exports.getNextLectureDetails = getNextLectureDetails;
module.exports.getTimefromTimestamp = getTimefromTimestamp;
module.exports.getAllTodaysLectures = getAllTodaysLectures;
module.exports.getAllTomorrowsLectures = getAllTomorrowsLectures;
module.exports.getMessMeal = getMessMeal;
module.exports.getAllTodaysMessMeal = getAllTodaysMessMeal;
module.exports.getAllTomorrowsMessMeal = getAllTomorrowsMessMeal;
module.exports.getRandomNumber = getRandomNumber;
module.exports.radomEndPhrase = radomEndPhrase;
module.exports.getAllAnnouncments = getAllAnnouncments;
