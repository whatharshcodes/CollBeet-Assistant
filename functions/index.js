"use strict";

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const { dialogflow, Table } = require("actions-on-google");

// Import the firebase-functions package for deployment.
const functions = require("firebase-functions");
const studentScheduleFunctions = require("./helperFunctions/studentScheduleFunctions");

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent("Default Welcome Intent", conv => {
  conv.ask(`Welcome to CollBeet Assistant. How can I help you?.`);
});

app.intent("Setup User Details", conv => {
  conv.ask(
    `I will now attempt to register your account details. Can you start by telling me which department you are currently studying in?. For example if you are studying in "Information Technology Department". You can say, "I am currently studying in Information Technology".`
  );
});

app.intent("Save Department", async (conv, params) => {
  const dept = params.department;
  conv.user.storage.userDepartment = dept;
  const userDepartment = conv.user.storage.userDepartment;
  conv.ask(
    `Ok current department is now set successfully. Department reference code is ${userDepartment}. Can you now tell me which semester you are currently studying in?. For example if you are studying in "4th" semester. You can say, "I am currently studying in 4th Semester".`
  );
});

app.intent("Save Semester", async (conv, params) => {
  const sem = params.semester;
  conv.user.storage.userSemester = sem;
  const userSemester = conv.user.storage.userSemester;
  conv.ask(
    `Ok your current semester is now set to ${userSemester}. In future if you want to change either your semester or department. Just say, "Setup my user details". User registration is now complete, You can now use CollBeet Assistant as usual.`
  );
});

app.intent("Get Next Lecture", async conv => {
  const userSemester = conv.user.storage.userSemester;
  const userDepartment = conv.user.storage.userDepartment;

  if (!userSemester || !userDepartment) {
    conv.ask(
      `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
    );
  } else {
    var details = await studentScheduleFunctions.getNextLectureDetails(
      userSemester,
      userDepartment
    );

    if (!conv.screen) {
      conv.ask(details.message);
      return;
    }

    conv.ask(details.message);

    var dict = details.lectures;
    console.log("THIS IS DICT " + dict);

    if (dict) {
      var rowarr = [];

      dict.forEach(myFunc);

      function myFunc(item) {
        if (item.breakValue == true) {
          const l = "Break";
          const t = "-";
          const s1 = item.startTime;
          var s = studentScheduleFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = studentScheduleFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        } else {
          const l = item.lectureName;
          const t = item.teacherName;
          const s1 = item.startTime;
          var s = studentScheduleFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = studentScheduleFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        }
      }

      conv.ask(
        new Table({
          title: "Upcoming Lectures",
          subtitle: "You have this lectures coming up next.",
          columns: [
            {
              header: "Subject Name",
              align: "LEADING"
            },
            {
              header: "Teacher Name",
              align: "LEADING"
            },
            {
              header: "Start Time",
              align: "LEADING"
            },
            {
              header: "End Time",
              align: "LEADING"
            }
          ],
          rows: rowarr
        })
      );
    }
  }
});

app.intent("List All Today's Lectures", async conv => {
  const userSemester = conv.user.storage.userSemester;
  const userDepartment = conv.user.storage.userDepartment;

  if (!userSemester || !userDepartment) {
    conv.ask(
      `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
    );
  } else {
    var details = await studentScheduleFunctions.getAllTodaysLectures(
      userSemester,
      userDepartment
    );

    if (!conv.screen) {
      if (details.fullmessage) {
        conv.ask(details.fullmessage);
        return;
      } else {
        conv.ask(details.message);
        return;
      }
    }

    conv.ask(details.message);

    var dict = details.lectures;
    console.log("THIS IS DICT " + dict);

    if (dict) {
      var rowarr = [];

      dict.forEach(myFunc);

      function myFunc(item) {
        if (item.breakValue == true) {
          const l = "Break";
          const t = "-";
          const s1 = item.startTime;
          var s = studentScheduleFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = studentScheduleFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        } else {
          const l = item.lectureName;
          const t = item.teacherName;
          const s1 = item.startTime;
          var s = studentScheduleFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = studentScheduleFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        }
      }

      conv.ask(
        new Table({
          title: "Today's Lectures",
          subtitle: "You have this lectures today.",
          columns: [
            {
              header: "Subject Name",
              align: "LEADING"
            },
            {
              header: "Teacher Name",
              align: "LEADING"
            },
            {
              header: "Start Time",
              align: "LEADING"
            },
            {
              header: "End Time",
              align: "LEADING"
            }
          ],
          rows: rowarr
        })
      );
    }
  }
});

app.intent("List All Tomorrow's Lectures", async conv => {
  const userSemester = conv.user.storage.userSemester;
  const userDepartment = conv.user.storage.userDepartment;

  if (!userSemester || !userDepartment) {
    conv.ask(
      `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
    );
  } else {
    var details = await studentScheduleFunctions.getAllTomorrowsLectures(
      userSemester,
      userDepartment
    );

    if (!conv.screen) {
      if (details.fullmessage) {
        conv.ask(details.fullmessage);
        return;
      } else {
        conv.ask(details.message);
        return;
      }
    }

    conv.ask(details.message);

    var dict = details.lectures;
    console.log("THIS IS DICT " + dict);

    if (dict) {
      var rowarr = [];

      dict.forEach(myFunc);

      function myFunc(item) {
        if (item.breakValue == true) {
          const l = "Break";
          const t = "-";
          const s1 = item.startTime;
          var s = studentScheduleFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = studentScheduleFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        } else {
          const l = item.lectureName;
          const t = item.teacherName;
          const s1 = item.startTime;
          var s = studentScheduleFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = studentScheduleFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        }
      }

      conv.ask(
        new Table({
          title: "Tomorrow's Lectures",
          subtitle: "You have this lectures Tomorrow.",
          columns: [
            {
              header: "Subject Name",
              align: "LEADING"
            },
            {
              header: "Teacher Name",
              align: "LEADING"
            },
            {
              header: "Start Time",
              align: "LEADING"
            },
            {
              header: "End Time",
              align: "LEADING"
            }
          ],
          rows: rowarr
        })
      );
    }
  }
});

app.intent("Get Mess Meal", async (conv, params) => {
  const mealType = params.mealtypes;

  var details = await studentScheduleFunctions.getMessMeal(mealType);

  conv.ask(details.message);
});

app.intent("Get All Today's Mess Meal", async conv => {
  var details = await studentScheduleFunctions.getAllTodaysMessMeal();

  if (!conv.screen) {
    if (details.fullmessage) {
      conv.ask(details.fullmessage);
      return;
    } else {
      conv.ask(details.message);
      return;
    }
  }

  conv.ask(details.message);

  var dict = details.mealsarr;
  console.log("THIS IS DICT " + dict);

  if (dict) {
    var rowarr = [];

    dict.forEach(myFunc);

    function myFunc(item) {
      const t = item.type;
      const tC = t.charAt(0).toUpperCase() + t.slice(1);

      const f = item.fooditems;

      rowarr.push([tC, f]);
    }
    conv.ask(
      new Table({
        title: "Today's Meal Schedule",
        subtitle: "We are serving following dishes today",
        columns: [
          {
            header: "Meal Time",
            align: "LEADING"
          },
          {
            header: "Dishes",
            align: "LEADING"
          }
        ],
        rows: rowarr
      })
    );
  }
});

app.intent("Get All Tomorrow's Mess Meal", async conv => {
  var details = await studentScheduleFunctions.getAllTomorrowsMessMeal();

  if (!conv.screen) {
    if (details.fullmessage) {
      conv.ask(details.fullmessage);
      return;
    } else {
      conv.ask(details.message);
      return;
    }
  }

  conv.ask(details.message);

  var dict = details.mealsarr;
  console.log("THIS IS DICT " + dict);

  if (dict) {
    var rowarr = [];

    dict.forEach(myFunc);

    function myFunc(item) {
      const t = item.type;
      const tC = t.charAt(0).toUpperCase() + t.slice(1);

      const f = item.fooditems;

      rowarr.push([tC, f]);
    }
    conv.ask(
      new Table({
        title: "Tomorrow's Meal Schedule",
        subtitle: "We are serving following dishes tomorrow",
        columns: [
          {
            header: "Meal Time",
            align: "LEADING"
          },
          {
            header: "Dishes",
            align: "LEADING"
          }
        ],
        rows: rowarr
      })
    );
  }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
