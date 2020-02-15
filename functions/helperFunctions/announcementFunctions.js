const axios = require("axios");
const apiEndpoints = require("../apiEndpoints");

const getAllAnnouncements = async () =>
  await axios
    .get(apiEndpoints.announcementsUrl)
    .then(res => res.data)
    .then(res => {
      const data = res.data;

      if (data) {
        const d1 = new Date();
        const n = d1.toDateString();

        const receivedAnnouncements = data.filter(function(i) {
          return i.date == n;
        });

        if (receivedAnnouncements.length > 0) {
          const msgs = [];

          for (let i = 0; i <= receivedAnnouncements.length - 1; i++) {
            msgs.push(
              `<audio src="https://showermeditation.s3.amazonaws.com/zapsplat_multimedia_alert_notification_ping_002_45054.mp3" /> ${receivedAnnouncements[i].message} <break time=\"0.7\" />`
            );
          }

          const responseString = msgs.join(". ");

          return {
            success: true,
            fullmessage: `<speak>You have following ${receivedAnnouncements.length} announcement(s) today. ${responseString}</speak>`,
            message: `<speak>You have following ${receivedAnnouncements.length} announcement(s) today.</speak>`,
            announcementarr: receivedAnnouncements
          };
        } else {
          return {
            success: false,
            message: `No announcements for today. Looks like you are all caught up.`
          };
        }
      } else {
        return {
          success: false,
          message: `Sorry but I am unable to find today's announcements.`
        };
      }
    })
    .catch(err => {
      console.log(err.message);
      return {
        success: false,
        message: `Sorry but I am unable to find any announcements.`
      };
    });

    module.exports.getAllAnnouncements = getAllAnnouncements;