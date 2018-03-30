/**
 * Created by lnelson on 5/12/16.
 */
import {DateHelper} from '../../lib/helpers';
import {
    StudyJsonData,
    importScheduledmessagesJson,
    importParticipantJson
} from './messages/server.methods.studyJsonData';
import Future from'fibers/future';
import {Scheduledmessages} from '../../lib/api/scheduledmessages/scheduledmessages';
import {Questions} from '../../lib/api/questions/questions';
import {Participants} from '../../lib/api/participants/participants';
import {Tasks} from '../../lib/api/tasks/tasks';
import {Roles} from 'meteor/alanning:roles';
import {AccountRoles} from '../../lib/api/accounts/accounts';
import {Accounts} from 'meteor/accounts-base';
import {PushNotificationWrapper} from '../notifications/pushNotificationWrapper';
import {ScheduledMessagesHelper} from './messages/server.methods.scheduledMessagesHelpers'
import {Activities} from '../../lib/api/activities/activities';
import {updateNotifications} from '/server/notifications/notifier.helpers';
import {Posts} from '/lib/api/posts/posts';
import {Badges} from '/lib/api/badges/badges';
import {StaticContent} from '/lib/staticContent';
import {HTTP} from 'meteor/http';
import {Promise} from 'meteor/promise';
import {AgentHelpers} from '/server/methods/agent-helpers';
import {Studyevents, EVENTS} from '/lib/api/studyevents/studyevents';
import {PostImageHelpers} from '../post_image_helpers';
import {CurrentStudy} from '../studyConfiguration';
import {Meteor} from 'meteor/meteor'
import {Logs} from '/lib/api/logs/logs';
import {TasksHelpers} from '/lib/api/tasks/tasks.helpers'
import P2PHelpers from '/lib/p2p.helpers';
import {PostReportBuilder} from './server.methods.analytics-helpers';
import _ from 'lodash';

const NO_DISPLAY_NAME = 'anonymous';
const DEFAULT_PRECHALLENGE_ACTIVITIES = Meteor.settings.private.DEFAULT_CHALLENGE; //'/content/prechallenge/activitySchedulePreChallengeSet.json';

var fileUploads = {};

/**
 * Check incoming data for duplication based on a key set
 * @param row_object
 * @param seen_already
 * @returns {boolean}
 */
function isNotDuplicate(row_object, seen_already) {
    //TODO this is hardcoded spec for unique keys - not generalizable
    var seen_key = [row_object.condition, row_object.askDate, row_object.askTime, row_object.sequence];
    if (!seen_already[seen_key]) {
        seen_already[seen_key] = true;
        return true
    }
    return false
}

/**
 * Read in a csv file for specifying Study Participant conditions
 * @param json_content
 */
var import_participant_json = function (json_content) {
    return importParticipantJson(json_content)
    /*
     var study_data = new StudyJsonData(Participants, json_content);
     study_data.validateFields();
     study_data.validateImport();
     study_data.validateAgainstSchema();
     study_data.guardedRemovePriorScheduledMessagesData();
     study_data.guardedSaveToDatabase();
     return study_data.getFeedback()
     */
};


/**
 * Read in a JSON file for specifying Messaging to users
 * @param json_content
 */
var import_scheduledmessages_json = function (json_content) {
    return importScheduledmessagesJson(json_content)
    /*
     var study_data = new StudyJsonData(Scheduledmessages, json_content);
     study_data.validateFields();
     study_data.validateImport();
     study_data.validateAgainstSchema();
     study_data.guardedRemovePriorScheduledMessagesData();
     study_data.guardedSaveToDatabase();
     study_data.guardedUpdateQuestions();
     return study_data.getFeedback()
     */
};


/**
 * Check that a day number has not passed already for a user
 * @param str
 * @param daysSinceRegistered
 * @returns {*}
 */
function isFutureDay(thisDay, daysSinceRegistered) {
    try {
        return (Number(thisDay) >= daysSinceRegistered)
    } catch (err) {
        console.log('Warn isFutureDay ' + err.message)
        return false
    }
}

/**
 * Keep a mapping of point values for specific user actions
 * @type {{yes: number, no: number, almost: number, acknowledge: number}}
 */
var points = {
    yes: 1,
    no: 1,
    almost: 1,
    acknowledge: 1
};

var updatePoints = function (taskId, action) {
    var thisTask = Tasks.findOne(taskId);
    var username = thisTask.username;
    var currentTaskValue = thisTask.value;
    var assignment = 0;
    if (action !== 'acknowledge') {
        if (!currentTaskValue) {
            //Don't give points for changing your mind about reporting
            assignment = !currentTaskValue && points[action] ? points[action] : 0
        }
    } else {
        assignment = points[action] ? points[action] : 0
    }
    if (assignment) {
        Meteor.users.update({username: username}, {$inc: {"profile.points": assignment}})
    }
};


/**
 * My utility function
 * @param needle
 * @param haystack
 * @returns {boolean}
 */
function isNotIn(needle, haystack) {
    for (var ix = 0; ix < haystack.length; ix++) {
        if (needle === haystack[ix])
            return false;
    }
    return true;
}


// Methods
Meteor.methods({
    pushTestNotification: function (username, title, text) {
        var _userId = Meteor.users.findOne({username: username})._id;
        PushNotificationWrapper.notifySingleUser(text, title, _userId);
    },
    addTask: function (activityTitle, when, username, contentLink) {
        function getUserId(emailAddress) {
            try {
                return Meteor.users.findOne({username: emailAddress})._id
            } catch (err) {
                return null
            }
        }

        let thisUserId = getUserId(username);
        let result = "Method addTask";
        if (thisUserId) {
            try {
                var taskData = Tasks.create(
                    thisUserId,
                    activityTitle,
                    when,
                    username,
                    contentLink);
                Tasks.insert(taskData);
                result = ": Added task: " + activityTitle + " @ " + when
            } catch (err) {
                result += ": ERROR addTask: " + err.message
            }
        } else {
            result += ": WARN User not found: " + usernae
        }
        console.log("INFO Method addTask: " + result);
    },
    removeTask: function (id) {
        if (id) {
            try {
                Tasks.remove({_id: id});
                console.log("INFO Removing task " + id);
            } catch (err) {
                console.log("ERROR: removeTask could not remove " + id + ": " + err.message);
            }

        } else {
            console.log("WARN: removeTask no ID to remove");
        }
    },
    addQuestion: function (text, responseFormat, choices, username, tag,
                           askDate,
                           askTime,
                           expireDate,
                           expireTime,
                           sequence,
                           notify,
                           noneAllowed) {
        let none = noneAllowed ? noneAllowed : false;
        let taskId = null;
        let name = null;
        let preferenceToSet = null;
        let answers = null;
        let props = null;

        let participant = Participants.findOne({emailAddress: username});

        if (participant) {
            let askDay = Participants.getChallengeDayForDate(participant, askDate);
            let expireDay = Participants.getChallengeDayForDate(participant, expireDate);
            if (expireDay >= 0)
                updateNotifications(
                    Questions.addQuestion(
                        text,
                        responseFormat,
                        choices,
                        username,
                        tag,
                        askDate,
                        askTime,
                        expireDate,
                        expireTime,
                        sequence,
                        notify,
                        name,
                        preferenceToSet,
                        answers,
                        taskId,
                        noneAllowed,
                        askDay,
                        expireDay,
                        props
                    )
                )
        }
    },
    removeQuestion: function (id) {
        if (id) {
            try {
                Questions.remove({_id: id});
                console.log("INFO Removing question " + id);
            } catch (err) {
                console.log("ERROR: removeQuestion could not remove " + id + ": " + err.message);
            }

        } else {
            console.log("WARN: removeQuestion no ID to remove");
        }
    },
    removeParticipant: function (id) {
        if (id) {
            try {
                Participants.remove({_id: id});
                console.log("INFO Removing participant " + id);
            } catch (err) {
                console.log("ERROR: removeParticipant could not remove " + id + ": " + err.message);
            }

        } else {
            console.log("WARN: removeParticipant no ID to remove");
        }
    },
    //addUserToTeam: function (username, teamname) {
    //    // Make sure the user is logged in before updating a user
    //    if (!Meteor.userId()) {
    //        throw new Meteor.Error("not-authorized");
    //    }
    //    let this_user = Meteor.users.findOne({username: username});
    //    console.log("found user info: " + JSON.stringify(this_user));
    //    Meteor.users.update(
    //        this_user._id,
    //        {$set: {"profile.team": teamname}}
    //    );
    //},
    getTeamMembersInfo: function (userId, teamname) {
        // Make sure the user is logged in before updating a user
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        console.log("Looking for members in " + teamname);

        var members = Meteor.users.find({"profile.team": teamname}).fetch();
        var mList = [];
        members.forEach(function (m) {
            if (m._id !== userId) {
                const mTeam = P2PHelpers.makeP2pTeamname(m._id, userId);
                let lastPost = Posts.find({topic: mTeam, userId: m._id}, {sort: {createdAt: -1}}).fetch()[0];
                let displayName = m.profile && m.profile.bio && m.profile.bio.displayName ? m.profile.bio.displayName : NO_DISPLAY_NAME;
                mList.push({
                    userId: m._id,
                    bio: Posts.createBio(m._id, displayName, m.profile.text, m.profile.bio && m.profile.bio.bioImage ? m.profile.bio.bioImage : StaticContent.defaultProfilePictureThumbnail()),
                    lastMessage: lastPost ? lastPost.text : '',
                    lastMessageTime: lastPost ? lastPost.createdAt : 0
                });
            }
        });
        return mList;
    },
    getTeamMembers: function (teamname) {
        // Make sure the user is logged in before updating a user
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var members = Meteor.users.find({"profile.team": teamname}).fetch();
        var mList = [];
        members.forEach(function (m) {
            mList.push(
                m.username)
        });
        return mList;
    },
    answerQuestion: function (thisId, answer) {
        // Make sure the user is logged in before updating a user
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        ScheduledMessagesHelper.answerQuestion(thisId, answer)
    },
    deleteTask: function (taskId) {
        Tasks.remove(taskId);
    },
    setCheckedYes: function (taskId) {
        updatePoints(taskId, "yes");
        Tasks.update(taskId, {$set: {checkedYes: true}});
        Tasks.update(taskId, {$set: {checkedAlmost: false}});
        Tasks.update(taskId, {$set: {checkedNo: false}});
        Tasks.update(taskId, {$set: {value: "yes"}});
        Tasks.update(taskId, {$set: {checked: true}});
    },
    setCheckedAlmost: function (taskId) {
        updatePoints(taskId, "almost");
        Tasks.update(taskId, {$set: {checkedYes: false}});
        Tasks.update(taskId, {$set: {checkedAlmost: true}});
        Tasks.update(taskId, {$set: {checkedNo: false}});
        Tasks.update(taskId, {$set: {value: "almost"}});
        Tasks.update(taskId, {$set: {checked: true}});
    },
    setCheckedNo: function (taskId) {
        updatePoints(taskId, "no");
        Tasks.update(taskId, {$set: {checkedYes: false}});
        Tasks.update(taskId, {$set: {checkedAlmost: false}});
        Tasks.update(taskId, {$set: {checkedNo: true}});
        Tasks.update(taskId, {$set: {value: "no"}});
        Tasks.update(taskId, {$set: {checked: true}});
    },
    getHref: function (text) {
        var found = Activities.find({
                activity: {$regex: new RegExp("^" + text.toLowerCase() + "$", "i")}
            }
        ).fetch();
        if (found) {
            return found[0].content
        }
        return ''
    },
    uploadParticipantJSON: function (fileContent) {
        var result = "No content";

        var jsonContent = null;
        try {
            jsonContent = JSON.parse(fileContent)
        } catch (err) {
            result = "Error in JSON: " + err.message
        }
        if (jsonContent) {
            var result = import_participant_json(jsonContent);
        }
        return result
    },
    uploadScheduledMessagesJSON: function (fileContent) {
        var result = "No content";
        var jsonContent = null;
        try {
            jsonContent = JSON.parse(fileContent)
        } catch (err) {
            result = "Error in JSON: " + err.message
        }
        if (jsonContent) {
            result = import_scheduledmessages_json(jsonContent);
        }
        return result
    },
    sendNotification: function (username, teamname, notification, callback) {
        /*
         var number;
         var toUser = Meteor.users.find({username: username}).fetch();
         if (toUser && toUser.length && toUser[0].profile)
         number = toUser[0].profile.number;
         if (number) {
         twilio = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
         twilio.sendSms({
         to: number, // Any number Twilio can deliver to
         from: process.env.TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
         body: notification // body of the SMS message
         }, function (err, responseData) { //this function is executed when a response is received from Twilio
         if (!err) { // "err" is an error received during the request, if any
         console.log('Notification sent successfully');
         callback('Notification sent successfully');
         } else {
         console.log('Notification not sent: ' + err.message);
         callback('Notification not sent: ' + err.message);

         }
         });
         } else {
         console.log('No number found for ' + username);
         callback('No number found for ' + username)
         }
         */

    },
    pushScheduledMessagesForParticipant: function (thisEmail) {
        return ScheduledMessagesHelper.pushScheduledMessagesForParticipant(thisEmail)
    },
    assignPredefinedTasksToParticipant: function (thisEmail, userId) {
        let participant = Participants.findOne({emailAddress: thisEmail});
        if (participant && participant.settings && participant.settings.prechallengeActivities && participant.settings.prechallengeActivities.length > 0) {
            let result = TasksHelpers.assignTasksByJsonSet(userId, thisEmail, "", participant.settings.prechallengeActivities);
            return result
        } else {
            let result = TasksHelpers.assignTasksByJsonSet(userId, thisEmail, "", DEFAULT_PRECHALLENGE_ACTIVITIES);
            return result
        }
    },
    assignPredefinedTasksToTeam: function (team) {
        let teamUsers = Meteor.users.find({"profile.team": team}).fetch();
        let result = "assignPredefinedTasksToTeam: ";
        for (ix = 0; ix < teamUsers.length; ix++) {
            let teamUser = teamUsers[ix];
            if (teamUser && teamUser.profile && teamUser.profile.team) {
                let participant = Participants.findOne({emailAddress: teamUser.username});
                let thisEmail = participant.emailAddress;
                if (participant && participant.settings && participant.settings.challengeActivities && participant.settings.challengeActivities.length > 0) {
                    // Remove any existing unreported tasks (e.g., lobby tasks previously assigned)
                    Tasks.remove({userId: teamUser._id, goalMet: {$exists: false}});
                    result += TasksHelpers.assignTasksByJsonSet(teamUser._id, thisEmail, "", participant.settings.challengeActivities);
                } else {
                    result += "No predefined tasks for " + thisEmail
                }
            }
        }
        return result
    },
    deleteAllParticipants: function () {
        // Remove all participant data (except the admin)
        try {
            Participants.remove({email: {$ne: 'admin'}})
        } catch (err) {
            console.log('Warning, deleteAllParticipants: ' + err.message)
        }
    },
    summarizeAllParticipantsByCondition: function () {
        let allParticipants = Participants.find().fetch();
        let summary = {};
        let registeredByCondition = {};
        for (let ix = 0; ix < allParticipants.length; ix++) {
            let condition = allParticipants[ix] && allParticipants[ix].condition ? allParticipants[ix].condition : null;
            if (condition) {
                if (!summary[condition])
                    summary[condition] = 0;
                summary[condition]++;
                if (!registeredByCondition[condition])
                    registeredByCondition[condition] = 0;
                if (Meteor.users.findOne({username: allParticipants[ix].emailAddress}))
                    registeredByCondition[condition]++
            }
        }
        let result = [];
        let keys = Object.keys(summary).sort();
        let totalParticipants = 0;
        let totalRegistered = 0;
        for (let ixr = 0; ixr < keys.length; ixr++) {
            result.push({
                condition: keys[ixr],
                numberInCondition: summary[keys[ixr]],
                numberRegistered: registeredByCondition[keys[ixr]]
            });
            totalParticipants += summary[keys[ixr]];
            totalRegistered += registeredByCondition[keys[ixr]];
        }
        result.push({condition: "TOTAL", numberInCondition: totalParticipants, numberRegistered: totalRegistered});
        return result
    },
    setClientTimezone: function (timezoneString) {
        // Make sure the user is logged in before updating a user
        if (this.userId) {
            Meteor.users.update(this.userId, {$set: {"profile.timezone": timezoneString}});
        } else {
            throw new Meteor.Error("not-authorized");
        }
    },
    allParticipantConditions: function () {
        let allParticipants = Participants.find().fetch();
        let conditions = {};
        for (let ix = 0; ix < allParticipants.length; ix++) {
            if (allParticipants[ix].condition)
                conditions[allParticipants[ix].condition] = true
        }
        return Object.keys(conditions).sort()
    },
    setTeam: function (userid, team) {
        console.log('Update ' + userid + ' for ' + team);
        Meteor.users.update({_id: userid}, {$set: {"profile.team": team}});
    },
    addUserToTeam: function (username, defaultTeam, canOverride) {
        let user = Meteor.users.findOne({username: username});
        let thisDefaultTeam = defaultTeam ? defaultTeam.trim() : "";
        let thisOverride = typeof canOverride == 'undefined' ? true : canOverride;

        let participant = Participants.findOne({emailAddress: username});

        // Participant settings are given preference over default team values
        let thisTeam =
            participant && participant.settings && participant.settings.team ?
                participant.settings.team : thisDefaultTeam;
        // Do not make re-assignment unless can override
        if (thisOverride)
            thisTeam = defaultTeam;

        // Explicitly setting for No Team overrides anything regardless of canOverride
        if (defaultTeam == "No team")
            thisTeam = "";

        if (user) {
            console.log('Update ' + user._id + ' for ' + thisTeam);
            Meteor.users.update({_id: user._id}, {$set: {"profile.team": thisTeam}});
        }
        if (participant) {
            Participants.update({_id: participant._id}, {$set: {"settings.team": thisTeam}})
        }
    },
    setBio: function (userid, bio) {
        console.log('Update ' + userid + ' for ' + bio);
        Meteor.users.update({_id: userid}, {$set: {"profile.bio": bio}});
    },
    setBioText: function (userid, bioText) {
        console.log('Update ' + userid + ' for ' + bioText);
        Meteor.users.update({_id: userid}, {$set: {"profile.bio.bioText": bioText}});
    },
    allTeams: function () {
        console.log('All teams = ' + Posts.getTeams());
        return Posts.getTeams()
    },
    allMembers: function () {
        console.log("Get all Users");
        let users = Meteor.users.find({});
        userNames = [];
        users.forEach(function (user) {
            userNames.push(user.username);
        });
        return userNames;
    },
    setPicture: function (userid, base64ImageString) {
        console.log('Update picture for ' + userid);
        Meteor.users.update({_id: userid}, {$set: {"profile.bio.bioImage": base64ImageString}});
    },
    setDisplayName: function (userid, displayName) {
        console.log('Update display name for ' + userid + ' to ' + displayName);
        Meteor.users.update({_id: userid}, {$set: {"profile.bio.displayName": displayName}});
    },
    getDisplayName: function (emailAddress) {
        let thisUser = Meteor.users.findOne({username: emailAddress})
        let displayName = thisUser && thisUser.profile && thisUser.profile.bio && thisUser.profile.bio.displayName ? thisUser.profile.bio.displayName : NO_DISPLAY_NAME;
        return displayName;
    },
    getProfilePicture: function (emailAddress) {
        let thisUser = Meteor.users.findOne({username: emailAddress});
        if (thisUser) {
            return thisUser.profile.bio.bioImage;
        }
        return StaticContent.defaultProfilePictureThumbnail()
    },
    getRegistrationStatus: function (emailAddress) {
        let user = Meteor.users.findOne({username: emailAddress});
        let participant = Participants.findOne({emailAddress: emailAddress});
        let isRegistered = !user ? false : true
        console.log("Getting registration status of " + emailAddress + " = " + isRegistered);
        return {isRegistered, participant};
    },
    getIsParticipant: function (emailAddress) {
        let user = Participants.findOne({emailAddress: emailAddress});
        let isParticipant = !user ? false : true
        console.log("Getting participant status of " + emailAddress + " = " + isParticipant);
        return isParticipant;
    },
    removePost: function (postId) {
        console.log("INFO Mark post for deletion " + postId);
        //Posts.remove(postId);
        Posts.update({_id: postId}, {$set: {deleted: true}});
    },
    postsCount: function (team) {
        return Posts.postsCount(team);
    },
    postImageToService: function (postObj, imgSize, img) {
        this.unblock();
        console.log("*** Upload to s3");
        PostImageHelpers.postToImageService(postObj, imgSize, img);
        console.log("*** Uploaded to s3")
    },
    pushImageChunk: function (postId, imageType, chunk, lastChunk) {
        let chunkId = postId + "_" + imageType;
        if (!fileUploads[chunkId]) {
            fileUploads[chunkId] = [];
        }
        fileUploads[chunkId].push(chunk);
        //console.log(">>>> got a file chunk for " + chunkId + ", last: " + lastChunk + ", len: " + fileUploads[chunkId].length);
        const fut = new Future();
        if (lastChunk) {
            console.log("LAST CHUNK");
            //console.log(chunk);
            let postObj = Posts.findOne({_id: postId});
            PostImageHelpers.postToImageService(postObj, imageType, _.join(fileUploads[chunkId], ''));
            delete fileUploads[chunkId];
        }
        fut.return(lastChunk.length);
        return fut.wait();
    },
    httpSend: function (method, url, data) {
        let result = HTTP.call(method, url, {data: data});
        return result
    },
    httpSendToAllAgents: function (eventName,
                                   kind,
                                   source,
                                   data) {
        try {
            data['eventName'] = eventName;
            let event_data = Studyevents.create(CurrentStudy, kind, source, data);
            AgentHelpers.sendToAll(event_data);
        } catch (err) {
            console.log("ERROR in Method httpSendToAllAgents: " + err.message)
        }
        return
    },
    httpReSendToOneAgent: function (agentname, event) {
        try {
            AgentHelpers.sendToOne(agentname, event);
        } catch (err) {
            console.log("ERROR in Method httpReSendToOneAgent: " + err.message)
        }
        return
    },
    changeUserPassword: function (username, resetPassword) {
        let status = false;
        if (Meteor.user().username == Meteor.settings.private.BUILTIN_ADMIN_EMAIL) {
            let user = Meteor.users.findOne({username: username});
            if (user) {
                Accounts.setPassword(user._id, resetPassword);
                console.log("INFO Resetting password for  " + username);
                status = true
            }
        }
        return status;
    },
    addCommentToPost: function (postId, comment) {
        Posts.update(
            {_id: postId},
            {$push: {"comments": comment}}
        );
        return;
    },
    addLikerToComment: function (postId, commentId, liker) {
        Posts.update(
            {_id: postId, "comments._id": commentId},
            {$push: {"comments.$.likers": liker}}
        );
        return;
    },
    removeLikerFromComment: function (postId, commentId, likerUserId) {
        Posts.update(
            {_id: postId, "comments._id": commentId},
            {$pull: {"comments.$.likers": {userId: likerUserId}}}
        );
        return;
    },

    //
    // Add to the logging data
    //      userId:  is the userId or 'unknown' for no user yet defined
    //      timeStamp: UTC timestamp of event
    //      logType:  the type of data being logged, such as 'debug', 'appEntry', 'appExit', etc
    //      logData:  json data structure of any special logged data to go with the log.  If present, a 'msg' property is a text string for the data
    //
    logit: function (userId, timeStamp, logType, logMessage, logData) {
        message = logMessage || '';
        let newLog = {
            timestamp: timeStamp,
            userId: userId,
            logType: logType,
            message: message,
            logData: logData
        };
        console.log(">>> " + JSON.stringify(newLog).substring(0, 128));
        Logs.insert(newLog);
    },
    reportedGoalToday: function (user, taskId, reportedValue) {
        // Run only if Meteor.user() is set. Logging out causes this autorun to execute, but in that case Meteor.user() is
        // null, which causes errors to be logged.
        if (user && user.username && user._id) {
            const participant = Participants.findOne({emailAddress: user.username});  // Only one participant should be published to this user
            if (participant) {
                let dayOfStudy = DateHelper.reactiveDaysSince(participant.studyStartUTC);
                let timeTravelInDays = DateHelper.daysDiff(
                    participant.studyStartUTC,
                    participant.challengeStartUTC);

                //TODO: This will need to be generalized when there are multiple tasks to do during a day
                Participants.update({_id: participant._id}, {$set: {"settings.goalReported": (dayOfStudy - timeTravelInDays).toString()}});
                if (typeof reportedValue !== 'undefined' && participant.preferences && participant.preferences.challengeStarted == "true") {
                    if (reportedValue == true) {
                        Participants.update({_id: participant._id}, {$set: {"settings.goalReportedUnmet": ""}});
                        Participants.update({_id: participant._id}, {$set: {"settings.goalReportedMet": (dayOfStudy - timeTravelInDays).toString()}});
                    } else {
                        Participants.update({_id: participant._id}, {$set: {"settings.goalReportedMet": ""}});
                        Participants.update({_id: participant._id}, {$set: {"settings.goalReportedUnmet": (dayOfStudy - timeTravelInDays).toString()}});
                    }
                }
                if (taskId && Questions.find({taskId: taskId, answered: true}).count() > 0) {
                    //Questions.makeUnanswered(taskId);
                    let writeResult = Questions.remove({taskId: taskId});
                    let resultString = "no";
                    if (writeResult && typeof writeResult == 'number')
                        resultString = String(writeResult);
                    console.log("INFO reportedGoalToday removing " + resultString + " questions for Task " + taskId);

                }
                ScheduledMessagesHelper.pushScheduledMessagesForParticipant(user.username, taskId)

            }
        }

    },
    showTeamReport: function (team) {
        // Run only if Meteor.user() is set. Logging out causes this autorun to execute, but in that case Meteor.user() is
        // null, which causes errors to be logged.
        let myTeam = Meteor.user().profile && Meteor.user().profile.team ? Meteor.user().profile.team : "Not on a team";
        let teamMembers = Meteor.users.find({"profile.team": team}).fetch();
        let report = {
            name: myTeam,
            count: teamMembers.length,
            longestStreak: 0,
            longestStreakForWeek: 0,
            teamGoalByDay: []
        };
        let longest = 0;
        let weekLongest = 0;
        let weekLongestStart = -1;
        let longestStart = -1;
        let reportedMemberTasks = [];

        let memberIndexLookup = {};
        let memberIndex = 0;

        for (let ix = 0; ix < teamMembers.length; ix++) {
            let member = teamMembers[ix];
            let memberId = member._id;
            let memberTasks = Tasks.find({userId: memberId}).fetch();
            if (!(memberId in memberIndexLookup)) {
                memberIndexLookup[memberId] = memberIndex++
            }
            let memberLongest = Tasks.getTaskReportingStreak(memberTasks);
            if (memberLongest > longest) {
                longest = memberLongest;
                longestStart = Tasks.getStartDayForTaskReportingStreak(memberTasks);

            }
            let weekMemberTasks = [];
            let firstReportThisWeek = -1;
            for (let jx = 0; jx < memberTasks.length; jx++) {
                let thisTask = memberTasks[jx];
                if (thisTask.reportCreatedAt) {
                    reportedMemberTasks.push(thisTask)
                }
                if (thisTask.reportCreatedAt && thisTask.reportCreatedAt > new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)) {
                    if (firstReportThisWeek < 0) {
                        firstReportThisWeek = thisTask.scheduledDate;
                    }
                    if (firstReportThisWeek > thisTask.scheduledDate) {
                        firstReportThisWeek = thisTask.scheduledDate;
                    }
                }
            }
            for (let jx = 0; jx < memberTasks.length; jx++) {
                let thisTask = memberTasks[jx];
                if (thisTask.scheduledDate >= firstReportThisWeek) {
                    weekMemberTasks.push(thisTask)
                }
            }

            let memberWeekLongest = Tasks.getTaskReportingStreak(weekMemberTasks);
            if (memberWeekLongest > weekLongest) {
                weekLongest = memberWeekLongest;
                weekLongestStart = Tasks.getStartDayForTaskReportingStreak(weekMemberTasks);
            }
        }
        // Get the team progress counts for reporting
        let maxDateSeen = 0;
        for (let ixm = 0; ixm < reportedMemberTasks.length; ixm++) {
            let memberTask = reportedMemberTasks[ixm];
            let thisScheduleDate = memberTask.scheduledDate;
            let thisUserId = memberTask.userId;
            let thisMemberIndex = memberIndexLookup[thisUserId];
            if (typeof thisMemberIndex !== 'undefined') {
                maxDateSeen = thisScheduleDate > maxDateSeen ? thisScheduleDate : maxDateSeen;
                if (typeof report.teamGoalByDay[thisScheduleDate] == 'undefined') {
                    report.teamGoalByDay[thisScheduleDate] = []
                }
                report.teamGoalByDay[thisScheduleDate][thisMemberIndex] = memberTask.goalMet;
            }
            /*
             if (typeof report.teamGoalByDay[thisScheduleDate] == 'undefined') {
             report.teamGoalByDay[thisScheduleDate] = {
             goalMet: 0,
             goalNotMet: 0,
             goalNotReported: teamMembers.length
             }
             }
             if (memberTask.goalMet) {
             report.teamGoalByDay[thisScheduleDate].goalMet++;
             report.teamGoalByDay[thisScheduleDate].goalNotReported--;
             } else {
             report.teamGoalByDay[thisScheduleDate].goalNotMet++;
             report.teamGoalByDay[thisScheduleDate].goalNotReported--;

             }
             */
        }
        // Fill in the unreported parts of the team counts for reporting
        /*
         for (let ixd = 0; ixd <= maxDateSeen; ixd++) {
         if (typeof report.teamGoalByDay[ixd] == 'undefined') {
         report.teamGoalByDay[ixd] = {
         goalMet: 0,
         goalNotMet: 0,
         goalNotReported: teamMembers.length
         }
         } else {
         report.teamGoalByDay[ixd].goalNotReported =
         teamMembers.length -
         report.teamGoalByDay[ixd].goalMet -
         report.teamGoalByDay[ixd].goalNotMet
         }
         }
         */
        report.longestStreak = longest;
        report.longestStreakStart = longestStart;
        report.longestStreakForWeek = weekLongest;
        report.longestStreakForWeekStart = weekLongestStart;
        return report;
    },
    showPostReport: function (userId) {
        let reportBuilder = new PostReportBuilder(userId);
        return reportBuilder.getReport()
    },
    createBadgeNotifications: function (fromUserId, toUserId, badgeType, badgeSubType, badgeInfo) {
        Badges.createBadges(fromUserId, toUserId, badgeType, badgeSubType, badgeInfo);
    },
    clearMyBadgeNotifications: function (badgeType, badgeSubType) {
        // Make sure the user is logged in before updating a user
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Badges.clearBadges(Meteor.userId(), badgeType, badgeSubType);
    },
    updateChallengeStart(participantId, challengeStartDate, adjustmentInDays) {
        let adjustment = adjustmentInDays * 24 * 60 * 60 * 1000;
        let newStartDate = new Date(challengeStartDate.getTime() + adjustment);
        console.log("INFO Update Day for " + participantId + " from " + challengeStartDate + " to " + newStartDate);
        Participants.update({_id: participantId}, {$set: {challengeStartUTC: newStartDate}});
        let thisParticipant = Participants.findOne({_id: participantId});
        // Adjust all questioning too
        ScheduledMessagesHelper.pushScheduledMessagesForParticipant(thisParticipant.emailAddress);
    },
    setChallengeStart(team, dateString) {
        // Get all team participants
        let users = Meteor.users.find().fetch();
        for (let ix = 0; ix < users.length; ix++) {
            let user = users[ix];
            if (user.profile && user.profile.team && user.profile.team == team) {
                let participant = Participants.findOne({emailAddress: user.username});
                if (participant) {
                    // Set start date for each participant
                    let timezone = typeof user.profile.timezone !== 'undefined' ? user.profile.timezone : '0';
                    let timezoneOffset = parseInt(timezone);
                    let challengeStartDate = DateHelper.getLocalDateWithFormat(dateString, 'MM-DD-YYYY', timezoneOffset);
                    let challengeActivitiesPath =
                        participant.settings && participant.settings.challengeActivities ?
                            participant.settings.challengeActivities : "";
                    let pieces = challengeActivitiesPath.split("/");
                    let challengeActivities = pieces.length > 0 ? pieces[pieces.length - 1] : "";
                    Participants.update(
                        {_id: participant._id},
                        {
                            $set: {
                                studyStartUTC: challengeStartDate,
                                challengeStartUTC: challengeStartDate,
                                "settings.challenge": CurrentStudy + "/" + challengeActivities,
                                "preferences.challengeStarted": "true"
                            }
                        }
                    );
                    console.log("*********DEBUG setChallengeStart Method to " + dateString);
                    console.log(Participants.findOne({_id: participant._id}))
                    console.log("/*********DEBUG setChallengeStart Method");

                }
            }
        }
        // Set tasks for each participant
        Meteor.call('assignPredefinedTasksToTeam', team);
        // Set all questions for each Participant
        let allParticipants = Participants.find().fetch();
        for (let ix = 0; ix < allParticipants.length; ix++) {
            ScheduledMessagesHelper.pushScheduledMessagesForParticipant(allParticipants[ix].emailAddress)
        }
    }

});



/*************************************************************************
 *
 *  © [2018] PARC Inc., A Xerox Company
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Xerox Corporation.
 * The intellectual and technical concepts contained
 * herein are proprietary to PARC Inc. and Xerox Corp.,
 * and may be covered by U.S. and Foreign Patents,
 * patents in process, and may be protected by copyright law.
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 *
 **************************************************************************/


