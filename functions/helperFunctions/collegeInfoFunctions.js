const axios = require("axios");
const apiEndpoints = require("../apiEndpoints");

const getCollegeInfo = async collinfo =>
  await axios
    .get(apiEndpoints.collInfoUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        let cinf = collinfo;

        const receivedCollegeInfo = data.filter(function(i) {
          return i.responseid == cinf;
        });

        if (receivedCollegeInfo.length > 0) {
          const arr = receivedCollegeInfo[0];

          return {
            success: true,
            message: `It is ${arr.responsetext}`
          };
        } else {
          return {
            success: false,
            message: `Sorry but I don't know that info about our college.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find requested college info.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any college info.`
      };
    });

module.exports.getCollegeInfo = getCollegeInfo;
