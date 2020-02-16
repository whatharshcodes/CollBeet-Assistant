const axios = require("axios");
const apiEndpoints = require("../apiEndpoints");

const getStaffroomLocation = async userDepartment =>
  await axios
    .get(apiEndpoints.locationsUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        let dept = userDepartment;

        console.log(userDepartment);
        const receivedStaffroomData = data.filter(function(i) {
          return i.staffroom == true && i.deptcode == dept;
        });

        if (receivedStaffroomData.length > 0) {
          const arr = receivedStaffroomData[0];

          return {
            success: true,
            message: `You can find ${arr.department} staff room at ${arr.responsetext}`
          };
        } else {
          return {
            success: false,
            message: `Sorry but I don't know the location of your requested staff room.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find requested staff room's location.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any staff room's location.`
      };
    });

const getLabLocation = async userDepartment =>
  await axios
    .get(apiEndpoints.locationsUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        let dept = userDepartment;

        console.log(userDepartment);
        const receivedLabData = data.filter(function(i) {
          return i.lab == true && i.deptcode == dept;
        });

        if (receivedLabData.length > 0) {
          const arr = receivedLabData[0];

          return {
            success: true,
            message: `You can find ${arr.department} lab at ${arr.responsetext}`
          };
        } else {
          return {
            success: false,
            message: `Sorry but I don't know the location of your requested lab.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find requested lab's location.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any lab's location.`
      };
    });

const getCollegeLocations = async locations =>
  await axios
    .get(apiEndpoints.locationsUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        let loct = locations;

        const receivedLocationData = data.filter(function(i) {
          return i.responseid == loct;
        });

        if (receivedLocationData.length > 0) {
          const arr = receivedLocationData[0];

          return {
            success: true,
            message: `You can find it at ${arr.responsetext}`
          };
        } else {
          return {
            success: false,
            message: `Sorry but I don't know the location of your requested place.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find requested place location.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any place location.`
      };
    });

module.exports.getStaffroomLocation = getStaffroomLocation;
module.exports.getLabLocation = getLabLocation;
module.exports.getCollegeLocations = getCollegeLocations;
