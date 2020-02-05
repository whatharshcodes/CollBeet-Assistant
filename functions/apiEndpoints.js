const envVariables = require('./config');

// Server URL Environment Variable

const {SERVER_URL} = envVariables;

// REST API Endpoints

module.exports = {
  studentScheduleUrl: `${SERVER_URL}/api/student`,
  messScheduleUrl: `${SERVER_URL}/api/mess`,
  announcementsUrl: `${SERVER_URL}/api/announcements`,
  locationsUrl: `${SERVER_URL}/api/locations`,
  collInfoUrl: `${SERVER_URL}/api/info`,
};
