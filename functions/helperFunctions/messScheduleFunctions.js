const axios = require("axios");
const apiEndpoints = require("../apiEndpoints");

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

module.exports.getMessMeal = getMessMeal;
module.exports.getAllTodaysMessMeal = getAllTodaysMessMeal;
module.exports.getAllTomorrowsMessMeal = getAllTomorrowsMessMeal;
