"use strict";

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const { dialogflow } = require("actions-on-google");

// Import the firebase-functions package for deployment.
const functions = require("firebase-functions");
const studentScheduleFunctions = require("./helperFunctions/studentScheduleFunctions");

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent("Default Welcome Intent", conv => {
  conv.ask(`Welcome to CollBeet Assistant. How can I help you? .`);
});

app.intent("Get Next Lecture", async conv => {
  const userSemester = conv.user.storage.userSemester;
  const userDepartment = conv.user.storage.userDepartment;

  if(!userSemester || !userDepartment){
    conv.ask(`Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`);
  } else {
    var details = await studentScheduleFunctions.getNextLectureDetails(userSemester,userDepartment);
    conv.ask(details.message);
  }
});

app.intent("Setup User Details", (conv) => {
  conv.ask(`I will now attempt to register your account details. Can you start by telling me which department you are currently studying in?. For example if you are studying in "Information Technology Department". You can say, "I am currently studying in Information Technology".`);
});

app.intent("Save Department", async (conv, params) => {
  const dept = params.department;
  conv.user.storage.userDepartment = dept;
  const userDepartment = conv.user.storage.userDepartment;
  conv.ask(`Ok current department is now set successfully. Department reference code is ${userDepartment}. Can you now tell me which semester you are currently studying in?. For example if you are studying in "4th" semester. You can say, "I am currently studying in 4th Semester".`);
});

app.intent("Save Semester", async (conv, params) => {
  const sem = params.semester;
  conv.user.storage.userSemester = sem;
  const userSemester = conv.user.storage.userSemester;
  conv.ask(`Ok your current semester is now set to ${userSemester}. In future if you want to change either your semester or department. Just say, "Setup my user details". User registration is now complete, You can now use CollBeet Assistant as usual.`);
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
