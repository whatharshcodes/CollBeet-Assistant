"use strict";

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const { dialogflow, Table, Suggestions } = require("actions-on-google");

// Import the firebase-functions package for deployment.
const functions = require("firebase-functions");
const studentScheduleFunctions = require("./helperFunctions/studentScheduleFunctions");
const messScheduleFunctions = require("./helperFunctions/messScheduleFunctions");
const generalFunctions = require("./helperFunctions/generalFunctions");
const announcementFunctions = require("./helperFunctions/announcementFunctions");
const locationsFunctions = require("./helperFunctions/locationsFunctions");
const collegeInfoFunctions = require("./helperFunctions/collegeInfoFunctions");

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent("Default Welcome Intent", conv => {
  if (!conv.screen) {
    conv.ask(`Welcome to CollBeet Assistant. How can I help you?.`);
    return;
  }

  conv.ask(`Welcome to CollBeet Assistant. How can I help you?.`);

  conv.ask(
    new Suggestions([
      `Today's Lectures`,
      "Daily Announcements",
      "Mess Hall Schedule",
      "My Semester Fees",
      "All College Clubs",
      "Setup User Details"
    ])
  );
});

app.intent("Setup User Details", conv => {
  conv.ask(`I will now attempt to register your account details.`);

  conv.ask(
    `Can you start by telling me which department you are currently studying in?. For example if you are studying in "Information Technology Department". Just say, "I am currently studying in Information Technology".`
  );
});

app.intent("Save Department", async (conv, params) => {
  const dept = params.department;
  conv.user.storage.userDepartment = dept;
  const userDepartment = conv.user.storage.userDepartment;
  conv.ask(
    `Ok current department is now set successfully. Department reference code is ${userDepartment}.`
  );

  conv.ask(
    `Can you now tell me which semester you are currently studying in?. For example if you are studying in "4th" semester. You can say, "I am currently studying in 4th Semester".`
  );
});

app.intent("Save Semester", async (conv, params) => {
  const sem = params.semester;
  conv.user.storage.userSemester = sem;
  const userSemester = conv.user.storage.userSemester;

  if (!conv.screen) {
    conv.ask(
      `Ok your current semester is now set to ${userSemester}. User registration is now complete. In future if you want to change either your semester or department. Just say, "Setup my user details".`
    );

    conv.ask(`<speak><break time="0.7" />So how can I help you today?</speak>`);
    return;
  }

  conv.ask(
    `Ok your current semester is now set to ${userSemester}. User registration is now complete. In future if you want to change either your semester or department. Just say, "Setup my user details".`
  );

  conv.ask(`<speak><break time="0.7" />So how can I help you today?</speak>`);

  conv.ask(
    new Suggestions([
      "Today's Lectures",
      "Daily Announcements",
      "Mess Hall Schedule",
      "My Semester Fees",
      "All College Clubs",
    ])
  );
});

app.intent("Get Next Lecture", async conv => {
  const userSemester = conv.user.storage.userSemester;
  const userDepartment = conv.user.storage.userDepartment;

  if (!userSemester || !userDepartment) {
    if (!conv.screen) {
      conv.ask(
        `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
      );

      return;
    }

    conv.ask(
      `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
    );
    conv.ask(new Suggestions(["Setup User Details"]));
  } else {
    var details = await studentScheduleFunctions.getNextLectureDetails(
      userSemester,
      userDepartment
    );

    if (!conv.screen) {
      conv.ask(details.message);

      conv.ask(
        `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
      );
      return;
    }

    conv.ask(details.message);

    var dict = details.lectures;

    if (dict) {
      var rowarr = [];

      dict.forEach(myFunc);

      function myFunc(item) {
        if (item.breakValue == true) {
          const l = "Break";
          const t = "-";
          const s1 = item.startTime;
          var s = generalFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = generalFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        } else {
          const l = item.lectureName;
          const t = item.teacherName;
          const s1 = item.startTime;
          var s = generalFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = generalFunctions.getTimefromTimestamp(e1);

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

    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );
    conv.ask(
      new Suggestions([
        `Today's Lectures`,
        `Tomorrow's Lectures`,
        `Tuesday Lectures`
      ])
    );
  }
});

app.intent("List All Today's Lectures", async conv => {
  const userSemester = conv.user.storage.userSemester;
  const userDepartment = conv.user.storage.userDepartment;

  if (!userSemester || !userDepartment) {
    if (!conv.screen) {
      conv.ask(
        `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
      );

      return;
    }

    conv.ask(
      `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
    );
    conv.ask(new Suggestions(["Setup User Details"]));
  } else {
    var details = await studentScheduleFunctions.getAllTodaysLectures(
      userSemester,
      userDepartment
    );

    if (!conv.screen) {
      if (details.fullmessage) {
        conv.ask(details.fullmessage);
        conv.ask(
          `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
        );
        return;
      } else {
        conv.ask(details.message);
        conv.ask(
          `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
        );
        return;
      }
    }

    conv.ask(details.message);

    var dict = details.lectures;

    if (dict) {
      var rowarr = [];

      dict.forEach(myFunc);

      function myFunc(item) {
        if (item.breakValue == true) {
          const l = "Break";
          const t = "-";
          const s1 = item.startTime;
          var s = generalFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = generalFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        } else {
          const l = item.lectureName;
          const t = item.teacherName;
          const s1 = item.startTime;
          var s = generalFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = generalFunctions.getTimefromTimestamp(e1);

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
    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );

    conv.ask(
      new Suggestions([
        `Next Lecture`,
        `Tomorrow's Lectures`,
        `Friday Lectures`
      ])
    );
  }
});

app.intent("List All Tomorrow's Lectures", async conv => {
  const userSemester = conv.user.storage.userSemester;
  const userDepartment = conv.user.storage.userDepartment;

  if (!userSemester || !userDepartment) {
    if (!conv.screen) {
      conv.ask(
        `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
      );

      return;
    }

    conv.ask(
      `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
    );
    conv.ask(new Suggestions(["Setup User Details"]));
  } else {
    var details = await studentScheduleFunctions.getAllTomorrowsLectures(
      userSemester,
      userDepartment
    );

    if (!conv.screen) {
      if (details.fullmessage) {
        conv.ask(details.fullmessage);
        conv.ask(
          `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
        );
        return;
      } else {
        conv.ask(details.message);
        conv.ask(
          `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
        );
        return;
      }
    }

    conv.ask(details.message);

    var dict = details.lectures;

    if (dict) {
      var rowarr = [];

      dict.forEach(myFunc);

      function myFunc(item) {
        if (item.breakValue == true) {
          const l = "Break";
          const t = "-";
          const s1 = item.startTime;
          var s = generalFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = generalFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        } else {
          const l = item.lectureName;
          const t = item.teacherName;
          const s1 = item.startTime;
          var s = generalFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = generalFunctions.getTimefromTimestamp(e1);

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
    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );

    conv.ask(
      new Suggestions([`Next Lecture`, `Today's Lectures`, `Monday Lectures`])
    );
  }
});

app.intent("Get Specific Day Lectures", async (conv, params) => {
  const userSemester = conv.user.storage.userSemester;
  const userDepartment = conv.user.storage.userDepartment;
  const days = params.days;

  if (!userSemester || !userDepartment) {
    if (!conv.screen) {
      conv.ask(
        `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
      );

      return;
    }

    conv.ask(
      `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
    );
    conv.ask(new Suggestions(["Setup User Details"]));
  } else {
    var details = await studentScheduleFunctions.getSpecificDayLectures(
      userSemester,
      userDepartment,
      days
    );

    if (!conv.screen) {
      if (details.fullmessage) {
        conv.ask(details.fullmessage);
        conv.ask(
          `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
        );
        return;
      } else {
        conv.ask(details.message);
        conv.ask(
          `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
        );
        return;
      }
    }

    conv.ask(details.message);

    var dict = details.lectures;

    if (dict) {
      var rowarr = [];

      dict.forEach(myFunc);

      function myFunc(item) {
        if (item.breakValue == true) {
          const l = "Break";
          const t = "-";
          const s1 = item.startTime;
          var s = generalFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = generalFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        } else {
          const l = item.lectureName;
          const t = item.teacherName;
          const s1 = item.startTime;
          var s = generalFunctions.getTimefromTimestamp(s1);
          const e1 = item.endTime;
          var e = generalFunctions.getTimefromTimestamp(e1);

          rowarr.push([l, t, s, e]);
        }
      }

      conv.ask(
        new Table({
          title: "Lectures Schedule",
          subtitle: "You have this lectures on that day.",
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
    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );

    conv.ask(
      new Suggestions([
        `Next Lecture`,
        `Tomorrow's Lectures`,
        `Today's Lectures`
      ])
    );
  }
});

app.intent("Get Mess Meal", async (conv, params) => {
  const mealType = params.mealtypes;

  var details = await messScheduleFunctions.getMessMeal(mealType);

  if (!conv.screen) {
    conv.ask(details.message);

    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );
    return;
  }

  conv.ask(details.message);

  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );

  conv.ask(
    new Suggestions([
      `Mess Hall Schedule`,
      `Today's Breakfast`,
      `Today's Lunch`,
      `Today's Snacks`,
      `Today's Dinner`
    ])
  );
});

app.intent("Get All Today's Mess Meal", async conv => {
  var details = await messScheduleFunctions.getAllTodaysMessMeal();

  if (!conv.screen) {
    if (details.fullmessage) {
      conv.ask(details.fullmessage);
      conv.ask(
        `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
      );
      return;
    } else {
      conv.ask(details.message);
      conv.ask(
        `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
      );
      return;
    }
  }

  conv.ask(details.message);

  var dict = details.mealsarr;

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
  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );

  conv.ask(
    new Suggestions([
      `Tomorrow's Canteen Meals`,
      `Today's Lunch`,
      `Today's Dinner`
    ])
  );
});

app.intent("Get All Tomorrow's Mess Meal", async conv => {
  var details = await messScheduleFunctions.getAllTomorrowsMessMeal();

  if (!conv.screen) {
    if (details.fullmessage) {
      conv.ask(details.fullmessage);
      conv.ask(
        `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
      );
      return;
    } else {
      conv.ask(details.message);
      conv.ask(
        `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
      );
      return;
    }
  }

  conv.ask(details.message);

  var dict = details.mealsarr;

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
  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );
  conv.ask(
    new Suggestions([
      `Today's Canteen Schedule`,
      `Today's Breakfast`,
      `Today's Snack`
    ])
  );
});

app.intent("Get All Announcements", async conv => {
  var details = await announcementFunctions.getAllAnnouncements();

  if (!conv.screen) {
    if (details.fullmessage) {
      conv.ask(details.fullmessage);
      conv.ask(
        `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
      );
      return;
    } else {
      conv.ask(details.message);
      conv.ask(
        `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
      );
      return;
    }
  }

  conv.ask(details.message);

  var dict = details.announcementarr;

  if (dict) {
    var rowarr = [];

    dict.forEach(myFunc);

    function myFunc(item) {
      const m = item.message;

      rowarr.push([m]);
    }
    conv.ask(
      new Table({
        title: "Daily Announcements",
        subtitle: "This are all the announcements for today",
        columns: [
          {
            header: "Announcements",
            align: "LEADING"
          }
        ],
        rows: rowarr
      })
    );
  }
  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );

  conv.ask(new Suggestions([`Next Lecture`]));
});

app.intent("Get Staffroom Location", async (conv, params) => {
  const userDepartment = params.department;

  var details = await locationsFunctions.getStaffroomLocation(userDepartment);

  conv.ask(details.message);

  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );
});

app.intent("Get Lab Location", async (conv, params) => {
  const userDepartment = params.department;

  var details = await locationsFunctions.getLabLocation(userDepartment);

  conv.ask(details.message);

  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );
});

app.intent("Get College Locations", async (conv, params) => {
  const locations = params.locations;

  var details = await locationsFunctions.getCollegeLocations(locations);

  conv.ask(details.message);

  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );
});

app.intent("Get College Info", async (conv, params) => {
  const collinfo = params.collinfo;

  var details = await collegeInfoFunctions.getCollegeInfo(collinfo);

  if (!conv.screen) {
    conv.ask(details.message);

    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );
    return;
  }

  conv.ask(details.message);

  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );

  conv.ask(
    new Suggestions([
      `Head Of Department Detail`,
      `College Address`,
      `My Semester Fee`,
      "All College Clubs"
    ])
  );
});

app.intent("Get Your Fee Details", async conv => {
  const userDepartment = conv.user.storage.userDepartment;

  if (!userDepartment) {
    if (!conv.screen) {
      conv.ask(
        `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
      );

      return;
    }

    conv.ask(
      `Sorry to access this feature you need to complete your user registration. Please say "Setup my user details", to complete your user registration.`
    );
    conv.ask(new Suggestions(["Setup User Details"]));
  } else {
    var details = await collegeInfoFunctions.getMySemesterFee(userDepartment);

    if (!conv.screen) {
      conv.ask(details.message);

      conv.ask(
        `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
      );
      return;
    }

    conv.ask(details.message);

    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );

    conv.ask(
      new Suggestions([
        `Head Of Department Detail`,
        `Department Semester Fees`,
        `College Phone Number`,
        "All College Clubs"
      ])
    );
  }
});

app.intent("Get Department Semester Fee", async (conv, params) => {
  const userDepartment = params.department;

  var details = await collegeInfoFunctions.getMySemesterFee(userDepartment);

  if (!conv.screen) {
    conv.ask(details.message);

    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );
    return;
  }

  conv.ask(details.message);

  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );

  conv.ask(
    new Suggestions([
      `My Semester Fees`,
      `College Website`,
      `Head Of Department Detail`,
      "All College Clubs"
    ])
  );
});

app.intent("Get HOD Details", async (conv, params) => {
  const userDepartment = params.department;

  var details = await collegeInfoFunctions.getHODDetails(userDepartment);

  if (!conv.screen) {
    conv.ask(details.message);

    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );
    return;
  }

  conv.ask(details.message);

  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );

  conv.ask(
    new Suggestions([
      `My Semester Fees`,
      `College Website`,
      `College Phone Number`,
      "All College Clubs"
    ])
  );
});

app.intent("All College Clubs Info", async conv => {
  var details = await collegeInfoFunctions.getAllClubDetails();

  if (!conv.screen) {
    conv.ask(details.fullmessage);
    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );
    return;
  }

  conv.ask(details.message);

  var dict = details.clubsarr;

  if (dict) {
    var rowarr = [];

    dict.forEach(myFunc);

    function myFunc(item) {
      const cn = item.clubName;
      const cln = item.clubLeaderName;
      const clc = item.clubLeaderContact;
      const ct = item.clubType;

      rowarr.push([cn,cln,clc,ct]);
    }
    conv.ask(
      new Table({
        title: "College Clubs",
        subtitle: "This are all active college clubs",
        columns: [
          {
            header: "Club Name",
            align: "LEADING"
          },
          {
            header: "Club Leader Name",
            align: "LEADING"
          },
          {
            header: "Club Leader Contact",
            align: "LEADING"
          },
          {
            header: "Club Type",
            align: "LEADING"
          }
        ],
        rows: rowarr
      })
    );
  }
  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );

  conv.ask(new Suggestions([`Next Lecture`, `College Address`, `Head Of Department Detail`, `Technology Clubs`]));
});

app.intent("Specific College Clubs", async (conv,params) => {
  var clubtype = params.clubs;

  var details = await collegeInfoFunctions.getSpecificClubDetails(clubtype);

  if (!conv.screen) {
    conv.ask(details.fullmessage);
    conv.ask(
      `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
    );
    return;
  }

  conv.ask(details.message);

  var dict = details.clubsarr;

  if (dict) {
    var rowarr = [];

    dict.forEach(myFunc);

    function myFunc(item) {
      const cn = item.clubName;
      const cln = item.clubLeaderName;
      const clc = item.clubLeaderContact;
      const ct = item.clubType;

      rowarr.push([cn,cln,clc,ct]);
    }
    conv.ask(
      new Table({
        title: "College Clubs",
        subtitle: "This are all active college clubs",
        columns: [
          {
            header: "Club Name",
            align: "LEADING"
          },
          {
            header: "Club Leader Name",
            align: "LEADING"
          },
          {
            header: "Club Leader Contact",
            align: "LEADING"
          },
          {
            header: "Club Type",
            align: "LEADING"
          }
        ],
        rows: rowarr
      })
    );
  }
  conv.ask(
    `<speak><break time=\"0.7\" />${generalFunctions.radomEndPhrase()}</speak>`
  );

  conv.ask(new Suggestions([`Next Lecture`, `College Address`, `Head Of Department Detail`, "All College Clubs"]));
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
