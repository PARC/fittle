/*
 * created 7/19/17 by krivacic
 * Helper to send email messages in text and html formats
 */

import {Participants} from '../../lib/api/participants/participants';
import {Tasks} from '../../lib/api/tasks/tasks';

/**
 * Helper code to fetch the task list from the Meteor server
 * ONLY runs on the server side
 */

exports.getTasks = function(taskSetterFn) {
    try {
      result = [];
      let parts = Participants.find({}).fetch();
      _.forEach(parts, (p) => {
          let day = Participants.getChallengeDay(p);
          let pTask = Tasks.findOne(
              {$and: [
              {emailAddress: p.emailAddress, scheduledDate: day},
              {
                  $or: [
                      {emailSent: null},
                      {emailSent: {$exists: false}},
                      {emailSent: false}
                  ]
              }
              ]
          });

          if (pTask) {
              result.push(pTask)
          }
      });
      taskSetterFn(200, result);
  } catch (err) {
      result = 'Error in /serviceapi/todaysTasks/ ' + err.message
      taskSetterFn(404, result);
  }
}

exports.setTaskDone = function(userId, day, taskSetterFn) {
    let scheduledDate = parseInt(day);
    let result = 'error';
    let status = false;

    console.log('INFO GET /serviceapi/taskDone/' + userId + "/" + scheduledDate);
    try {
        Tasks.update({userId: userId, scheduledDate: scheduledDate}, {$set: {emailSent: true}});
        taskSetterFn(200, "ok");
    } catch (err) {
        result = 'Error in /serviceapi/tasksDone/ ' + err.message;
        console.log("Error: " + result);
        taskSetterFn(404, result);
    }
}



