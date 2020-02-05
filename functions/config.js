// Environment Variables
const functions = require('firebase-functions');

module.exports = {
    SERVER_URL: functions.config().envariables.server_url,
};
