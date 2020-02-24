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

const getMySemesterFee = async userDepartment =>
  await axios
    .get(apiEndpoints.collInfoUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        let dept = userDepartment;

        const receivedCollInfoData = data.filter(function(i) {
          return i.feestructure == true && i.deptcode == dept;
        });

        if (receivedCollInfoData.length > 0) {
          const arr = receivedCollInfoData[0];

          return {
            success: true,
            message: `Semester Fee is ${arr.semesterFee}.`
          };
        } else {
          return {
            success: false,
            message: `Sorry but I don't know your requested semester fee.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find requested semester fee.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any semester fee details.`
      };
    });

const getHODDetails = async userDepartment =>
  await axios
    .get(apiEndpoints.collInfoUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        let dept = userDepartment;

        const receivedCollInfoData = data.filter(function(i) {
          return i.hoddetail == true && i.deptcode == dept;
        });

        if (receivedCollInfoData.length > 0) {
          const arr = receivedCollInfoData[0];

          return {
            success: true,
            message: `${arr.department} Head Of Department is ${arr.hodName}. Head Of Department Contact is ${arr.hodContact}.`
          };
        } else {
          return {
            success: false,
            message: `Sorry but I don't know your requested Head Of Department Details.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find requested Head Of Department Details.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any Head Of Department Details.`
      };
    });

const getAllClubDetails = async () =>
  await axios
    .get(apiEndpoints.collInfoUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        const receivedCollInfoData = data.filter(function(i) {
          return i.clubdetail == true;
        });

        if (receivedCollInfoData.length > 0) {
          return {
            success: true,
            message: `You have following ${receivedCollInfoData.length} active club(s) in your college.`,
            fullmessage: `You have ${receivedCollInfoData.length} active club(s) in your college. Access from a screen enabled device to get more details.`,
            clubsarr: receivedCollInfoData
          };
        } else {
          return {
            success: false,
            message: `Sorry but you don't have any active clubs in your college.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find requested club Details.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any club Details.`
      };
    });

const getSpecificClubDetails = async (clubtype) =>
  await axios
    .get(apiEndpoints.collInfoUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        const receivedCollInfoData = data.filter(function(i) {
          return i.clubdetail == true && i.clubRefCode == clubtype;
        });

        if (receivedCollInfoData.length > 0) {
          return {
            success: true,
            message: `You have following ${receivedCollInfoData.length} ${receivedCollInfoData[0].clubType} in your college.`,
            fullmessage: `You have ${receivedCollInfoData.length} ${receivedCollInfoData[0].clubType} in your college. Access from a screen enabled device to get more details.`,
            clubsarr: receivedCollInfoData
          };
        } else {
          return {
            success: false,
            message: `Sorry but you don't have any requested type of active clubs in your college.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find requested type of active clubs.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any club Details.`
      };
    });

module.exports.getCollegeInfo = getCollegeInfo;
module.exports.getMySemesterFee = getMySemesterFee;
module.exports.getHODDetails = getHODDetails;
module.exports.getAllClubDetails = getAllClubDetails;
module.exports.getSpecificClubDetails =getSpecificClubDetails;
