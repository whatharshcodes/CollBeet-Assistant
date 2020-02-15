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
            message: `You can find ${arr.department} staff room at ${arr.responsetext}`,
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

module.exports.getStaffroomLocation = getStaffroomLocation;
