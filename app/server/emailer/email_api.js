/* eslint no-console: "off"*/

var Emailer = require('./email_helper');
var TaskHelper  = require('./task_helper');

const moment = require('moment-timezone');

function sendEmailFor(taskInfo) {
  const coachLocation = Meteor.settings.private.COACH_LOCATIONS[Meteor.settings.private.CURRENT_LOCATION];
  let html = ""
    + "<body>"
    + "<div>"
    + "<h2>"
    + taskInfo.title
    + "</h2>"
    + "<p>"
    + taskInfo.description
    + "<p>"
    + '<a href="' + coachLocation.BASE_URL + "/" + taskInfo.contentLink + '">'
    + 'Click for More'
    + '</a>'
    + "</div>"
    + "</body>"
  ;
  // send the email
  Emailer.sendTextAndHtmlEmail(taskInfo.emailAddress, taskInfo.title, taskInfo.description, html, Meteor.bindEnvironment(function(err, res) {
    if (err) {
        console.log("Email ERROR result: " + err);
    } else {
        // go and clear the send flag here
        TaskHelper.setTaskDone(taskInfo.userId, taskInfo.scheduledDate, function(err, res) {console.log("Task done: " + err)});
    }
  }) )
}
/**
 * Send an email to each user with an unsent task
*/
function sendEmails(taskList) {
  // Send Emails to all in the taskList and
  // then mark them as sent
  if (taskList) {
    console.log("***Sending " + taskList.length + " emails");
    taskList.forEach((item) => {console.log(moment().format("MM/DD/YYYY HH:mm:ss") + " email to " + item.emailAddress); sendEmailFor(item)});
  }
}

function doUpdates() {
  if (Meteor.settings.private.SEND_EMAIL_REMINDERS) {
      console.log("Fetching Tasks at " + moment().format("MM/DD/YYYY HH:mm:ss"));
      TaskHelper.getTasks(function (status, data) {
          if (status === 200) {
              sendEmails(data);
          }
      });
  }
}

function scheduleUpdates() {
  console.log("*** Check schedule emails")
  Meteor.setTimeout(scheduleUpdates, 10 * 60 * 1000);
  doUpdates();
}


exports.startEmailer = function() {
    Meteor.setTimeout(scheduleUpdates, 60 * 1000);
}