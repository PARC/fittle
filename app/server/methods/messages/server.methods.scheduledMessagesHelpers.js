/**
 * Created by lnelson on 8/18/16.
 */
import {DateHelper, propagateKeys} from '../../../lib/helpers';
import {Scheduledmessages} from '../../../lib/api/scheduledmessages/scheduledmessages';
import {Participants} from '../../../lib/api/participants/participants';
import {Questions} from '../../../lib/api/questions/questions';
import {Configuration} from '../../studyConfiguration';
import {TasksHelpers} from '../../../lib/api/tasks/tasks.helpers';
import {Meteor} from 'meteor/meteor';
import {scheduleRemindersMessages} from './server.methods.reminderHelpers';
import {DateHelpers} from '../../../lib/helpers';
import {isAdmin} from '/server/server-helpers';
import {updateNotifications} from '/server/notifications/notifier.helpers';
import {EVENTS} from '/lib/api/studyevents/studyevents';
import {updateFutureReminderTimes} from './server.methods.reminderHelpers';


/**
 * Collect exports for this module into a public dictionary
 * @type {{participantMeetsConstraint: participantMeetsConstraint, pushScheduledMessagesForParticipant: pushScheduledMessagesForParticipant, answerQuestion: answerQuestion}}
 */
export const ScheduledMessagesHelper = {
    'parseMessageSequence': parseMessageSequence,
    'participantMeetsConstraint': participantMeetsConstraint,
    'pushScheduledMessagesForParticipant': pushScheduledMessagesForParticipant,
    'addDaysToUserRegistrationDate': addDaysToUserRegistrationDate,
    'isFutureDay': isFutureDay,
    'answerQuestion': answerQuestion
};

/**
 * Handle the special case of a day specification of 'now', meaning today
 * @param str
 * @param dayNow
 * @returns {*}
 */
function checkForNow(str, dayNow) {
    if (str && str.toLowerCase && str.toLowerCase() === 'now') {
        return dayNow.toString()
    } else {
        return str
    }
}


/**
 * Convert a day number (in string format from input data) since registering into an actual date
 *
 * <p><b>Discussion:</b> The goal of this function appears to be determining the date (returned
 * as a <tt>Date</tt> object) n days (given the the <tt>str</tt> argument) after the user registered.
 * Although a <tt>daysSinceRegistered</tt> parameter is in the function signature, I think it is
 * meaningless; it's always 0. </p>
 * <p><b>Attention:</b> This function never explicitly requests information about when the user
 * registered (e.g., via a parameter or querying Meteor.user). Instead, it seems to assume registration
 * occurred at midnight today.</p>
 *
 * @version 08 Nov 2016
 *
 * @param {String} str - String representation of a number.
 * @param {Date} startDate
 * @param {number} daysSinceRegistered - Number of days since the user registered an account.
 * @param {String} userTimezone - Name of the user's preferred timezone.
 * @returns {Date}
 */
export function addDaysToUserRegistrationDate(str, startDate, daysSinceRegistered, userTimezone) {
    try {
        //Could not reconcile with other uses of DateHelper.addDaysToDate(now, day), so used Javascript direct
        function addDays(dat, days) {
            //dat.setDate(dat.getDate() + days);
            let new_date = new Date(dat.getTime() + days * 24 * 60 * 60 * 1000);
            return new_date;
        }

        // How long has this user been around since registering?
        var daysSinceRegistered = daysSinceRegistered ? daysSinceRegistered : 0;

        //This was a bug: var day = Number(checkForNow(str, daysSinceRegistered)) - daysSinceRegistered;
        var day = Number(checkForNow(str, daysSinceRegistered));

        // Create Date obj representing midnight in the user's timezone on the day the user registered.
        let midnightOnDayUserRegistered = DateHelper.midnightOnDate(startDate, userTimezone);

        // Return a date object that is n days after the user registered, where the time portion represents
        // midnight the user's preferred timezone.

        return addDays(midnightOnDayUserRegistered, day);

    } catch (err) {
        console.log('Warn addDaysToUserRegistrationDate ' + err.message)
        return null
    }
}

/**
 * Check that a day number has not passed already for a user
 * @param str
 * @param daysSinceRegistered
 * @returns {*}
 */
export function isFutureDay(thisDay, daysSinceRegistered) {
    try {
        return (Number(checkForNow(thisDay, daysSinceRegistered)) >= daysSinceRegistered)
    } catch (err) {
        console.log('Warn isFutureDay ' + err.message)
        return false
    }
}


/**
 * Check if this is a registered Participant (server only)
 * @param emailAddress
 * @returns {*}
 */
function isRegisteredNonAdminUser(participant) {
    if (!participant) return false;
    if (!Meteor.isServer) return false;
    let emailAddress = participant.emailAddress;
    let user = Meteor.users.findOne({username: emailAddress});
    if (!user) return false;
    if (!isAdmin(user._id)) return true;
    return false;
};

/**
 * Turn ScheduledMessages into Questions for one user
 * @param thisEmail
 * @returns {string}
 */
export function pushScheduledMessagesForParticipant(thisEmail, taskId) {
    function getStartDate(participant) {
        let startDate = null;
        if (participant && (participant.challengeStartUTC || participant.studyStartUTC)) {
            startDate = participant.challengeStartUTC ? participant.challengeStartUTC : participant.studyStartUTC
        }
        return startDate
    }

    //Find this user's condition
    let thisParticipant = Participants.findOne({emailAddress: thisEmail});
    let pushed = 0;
    let thisStartDate = getStartDate(thisParticipant);
    //let thisStartDate = thisParticipant.studyStartUTC;
    if (isRegisteredNonAdminUser(thisParticipant)) {
        let daysSinceRegistered = DateHelper.daysSince(thisStartDate);
        let timeTravelInDays = DateHelper.daysDiff(
            thisParticipant.studyStartUTC,
            thisParticipant.challengeStartUTC);

        //let nowWithTimeTravel = new Date(new Date().getTime() - timeTravelInDays * 24 + 60 * 60 * 1000);
        let nowWithTimeTravel = new Date(new Date().getTime());

        let rqs = Questions.find({
            username: thisEmail,
            answeredOnDay: null,
            askDatetime: {$gt: nowWithTimeTravel}
        }).fetch();
        for (let iq = 0; iq < rqs.length; iq++) {
            let rq = rqs[iq];
            console.log('INFO Removing question ' + rq.name + ' ' + rq.askDatetime + ' ' + rq.askDate + ' ' + rq.text + " answeredOnDay= " + JSON.stringify(rq.answeredOnDay));
        }
        //Remove any existing future questions for user and (re)push
        Questions.remove({username: thisEmail, answeredOnDay: null, askDatetime: {$gt: nowWithTimeTravel}});
        //Questions.remove({username: thisEmail, askDatetime: {$gt: new Date()}});
        let scheduledMessages = Scheduledmessages.find({}).fetch();

        for (let ix = 0; ix < scheduledMessages.length; ix++) {
            let scheduledMessage = scheduledMessages[ix];
            if (scheduledMessage && scheduledMessage.constraints && participantMeetsConstraint(thisParticipant, scheduledMessage.constraints)) {
                // -1 means 'schedule this for before the challenge starts'
                //let scheduledMessageAskDate = (scheduledMessage.askDate - timeTravelInDays).toString();
                //let scheduledMessageExpireDate = (scheduledMessage.expireDate - timeTravelInDays).toString();
                let scheduledMessageAskDate = (scheduledMessage.askDate).toString();
                let scheduledMessageExpireDate = (scheduledMessage.expireDate).toString();
                //if (scheduledMessageAskDate === "-1" || isFutureDay(scheduledMessageAskDate, daysSinceRegistered - timeTravelInDays)) {
                if (scheduledMessageAskDate === "-1" || isFutureDay(scheduledMessageAskDate, daysSinceRegistered)) {
                    let askDate = addDaysToUserRegistrationDate(scheduledMessageAskDate, thisStartDate,
                        daysSinceRegistered, DateHelper.preferredTimezoneForUser(thisParticipant.emailAddress));
                    let askTime = scheduledMessage.askTime;
                    let expireDate = addDaysToUserRegistrationDate(scheduledMessageExpireDate, thisStartDate,
                        daysSinceRegistered, DateHelper.preferredTimezoneForUser(thisParticipant.emailAddress));
                    let expireTime = scheduledMessage.expireTime;
                    let questionText = scheduledMessage.text;
                    let responseFormat = scheduledMessage.responseFormat;
                    let choices = scheduledMessage.choices ? scheduledMessage.choices.split(',') : [];
                    let answers = scheduledMessage.answers ? scheduledMessage.answers : {};
                    let tagstring = scheduledMessage.tag;
                    let sequence = scheduledMessage.sequence;
                    let name = scheduledMessage.name;
                    let notify = scheduledMessage.notify;
                    let preferenceToSet = scheduledMessage.preferenceToSet ? scheduledMessage.preferenceToSet : null;
                    let useTaskId = scheduledMessage.linkToActivity ? taskId : null;
                    let none = scheduledMessage.noneAllowed ? scheduledMessage.noneAllowed : false;
                    let askDay = scheduledMessageAskDate;
                    let expireDay = scheduledMessageExpireDate;
                    let props = scheduledMessage.props;
                    console.log("DEBUG pushScheduledMessagesForParticipant adding Question " + tagstring + " on day " + askDate);
                    pushed++;
                    // Insert a question into the collection
                    updateNotifications(
                        Questions.addQuestion(
                            questionText,
                            responseFormat,
                            choices,
                            thisEmail,
                            tagstring,
                            askDate,
                            askTime,
                            expireDate,
                            expireTime,
                            sequence,
                            notify,
                            name,
                            preferenceToSet,
                            answers,
                            useTaskId,
                            none,
                            askDay,
                            expireDay,
                            props
                        )
                    );
                } else {
                    console.log("INFO Ignoring past question: " + scheduledMessage.name + " @ " + scheduledMessageAskDate)
                }
            }
        }
    }
    let result = '<br/>Processed ' + pushed + ' scheduled messages';
    return result
}

/**
 * Safely get a number when there's a number to get
 * @param str
 * @param defaultValue
 * @returns {*}
 */
function getNumber(str, defaultValue) {
    try {
        if (!str) {
            return defaultValue;
        }
        if (typeof str === 'string') {
            var number = parseInt(str);
            return isNaN(number) ? defaultValue : number
        } else if (isNaN(str)) {
            return defaultValue
        } else {
            return str
        }
    } catch (err) {
        return defaultValue
    }
}

/**
 * Return a sequence of scheduled messages inputs from a JSON ScheduledMessages sequence specification
 * @param messageJSON
 */
export function parseMessageSequence(messageJSON) {
    var rows = [];
    if (messageJSON.sequences) {
        var sequence;
        for (var ix = 0; ix < messageJSON.sequences.length; ix++) {
            sequence = 0;
            var seq = messageJSON.sequences[ix];
            var sequenceBase = getNumber(seq.sequenceBase, 0);
            if (seq.questions) {
                for (var ixq = 0; ixq < seq.questions.length; ixq++) {
                    sequence++;
                    var q = seq.questions[ixq];
                    var choices = [];
                    var answers = {};
                    var key;
                    // Are the choices given as a simple array of strings or key-value object?
                    if (Object.prototype.toString.call(q.choices) === '[object Array]') {
                        choices = q.choices;
                        for (var ixc = 0; ixc < q.choices.length; ixc++) {
                            answers[q.choices[ixc]] = q.choices[ixc]; // key and value will be the same in array case
                        }
                    } else if (typeof q.choices === 'object') {
                        for (key in q.choices) {
                            answers[q.choices[key]] = key; // The answer returned should be the compact text (key)
                            choices.push(q.choices[key]);  // The choice value should be the verbose choice text
                        }
                    }
                    choices = choices.join(); // Question expecting a list of options when there are options
                    let linkToActivity = seq.linkToActivity ? seq.linkToActivity : false;
                    let none = q.noneAllowed ? q.noneAllowed : false;
                    var row = Scheduledmessages.create(
                        seq.constraints,
                        seq.askDate,
                        seq.askTime,
                        seq.expireDate,
                        seq.expireTime,
                        q.responseFormat,
                        (sequence + sequenceBase),
                        choices,
                        answers,
                        q.text,
                        q.tag,
                        seq.name,
                        q.preferenceToSet,
                        q.notify,
                        linkToActivity,
                        none,
                        q.props ? q.props : {}
                    );
                    if (seq.expireDate) row.expireDate = seq.expireDate;
                    if (seq.expireTime) row.expireTime = seq.expireTime;
                    rows.push(row)
                }
            }
        }
    }
    return rows
}

/**
 * Parse an attribute and return its participant specific value if any
 * e.g., if attribute is 'emailAddress' then return partcipant.emailAddress
 * e.g., if attribute is 'preferences.goalType' then return partcipant.preferences.goalType
 * e.g., if attribute is 'settings.selfEfficacy' then return partcipant.settings.selfEfficacy
 * @param participant
 * @param attribute
 */
export function getValue(participant, attribute) {
    function isString(obj) {
        return (Object.prototype.toString.call(obj) === '[object String]');
    }

    let value = null;
    let complexAttribute = attribute;
    if (attribute && isString(attribute)) {
        complexAttribute = attribute.split('.');
        if (complexAttribute && complexAttribute.length === 1) {
            //Grab a value like participant.emailAddress
            value = participant[complexAttribute[0]]
        } else if (complexAttribute && complexAttribute.length > 1) {
            // Grab a value like participant.preferences.goalType
            value = participant[complexAttribute[0]]
            for (let ix = 1; ix < complexAttribute.length; ix++) {
                if (complexAttribute[ix] && value.hasOwnProperty(complexAttribute[ix])) {
                    value = value[complexAttribute[ix]];
                } else if (complexAttribute[ix]) {
                    value = ""
                }
            }
        }
    }
    return value
}

/**
 * See if Question constraints are met for a given user
 * An implicit AND operation on multiple attribute checks is assumed
 * @param participant
 * @param constraints
 * @returns {boolean}
 */
export function participantMeetsConstraint(participant, constraints) {
    if (!constraints || !constraints.length) {
        // Is this question unconstrained?
        console.log('Warn participantMeetsConstraint found unconstrained message');
        return false
    }
    let result = false;
    if (constraints && constraints.length) {
        //var username = participant.emailAddress;
        result = true;
        // Implicit AND operation on attribute checks assumed
        for (let ix = 0; ix < constraints.length; ix++) {
            let attribute = constraints[ix].attribute;
            let value = constraints[ix].value ? constraints[ix].value : "";
            let compareValue = getValue(participant, attribute) ? getValue(participant, attribute) : "";

            if (compareValue !== value) {
                return false
            }
        }
    }
    return result
}

/**
 * Map answer text to internal answer symbols
 * @param question
 * @param answer
 * @returns {*}
 */
function getAnswerResponse(question, answer) {
    if (question && question.answers && question.answers[answer]) {
        return question.answers[answer]
    }
    return answer
}

/**
 * Apply a new assignments based on new input values
 * @param participant
 * @param assignment
 * Example assignment record
 * { from: 'goalType',
 *   to: 'goalContent',
 *   assign:
 *      { eatSlowly: 'Eat_Slower_Eat_Less',
 *        walk: 'Walk',
 *        foodJournal: 'Keep_A_Food_Journal'
 *      }
 *  }
 */
function makeAssignment(participant, assignment) {
    if (assignment.to &&
        assignment.from &&
        assignment.assign &&
        participant.preferences[assignment.from] &&
        assignment.assign[participant.preferences[assignment.from]]) {
        // Build $set query
        var setModifier = {$set: {}};
        var actualAssignmentForThisParticipant = participant.preferences[assignment.from];
        setModifier.$set['preferences.' + assignment.to] = assignment.assign[actualAssignmentForThisParticipant];
        // Apply the update query
        console.log("INFO Make assignment for " + participant.emailAddress + ": " + JSON.stringify(setModifier));
        Participants.update({_id: participant._id}, setModifier);
    }

}

/**
 * Apply any new assignments based on new input values
 * @param participant
 */
function makeAssignments(participant) {
    if (Configuration.getData().assignments) {
        for (let ix = 0; ix < Configuration.getData().assignments.length; ix++) {
            makeAssignment(participant, Configuration.getData().assignments[ix])
        }
    }
}

/**
 * If there's a matching userId return it
 * @param emailAddress
 * @returns {*}
 */
function findUserIdForParticipant(emailAddress) {
    var user = Meteor.users.findOne({username: emailAddress})
    return user ? user._id : null
}


/**
 * Make a string replacement using Participant data into the reminderText
 * @param participant
 * @param attributeList
 * @returns {format}
 */
function format(participant, reminderTextAttribute, attributeList) {
    var content = new String(participant.preferences[reminderTextAttribute]);
    for (let i = 0; i < attributeList.length; i++) {
        content = content.replace(
            '{{' + attributeList[i] + '}}',
            participant.preferences[attributeList[i]]);
    }
    return content;
};


/**
 * Does this participant have all the fields needed for formatting reminder messages and if so
 * return the formatted reminder text string for this Participant
 * @returns {boolean}
 */
function getTaskText(participant) {
    const TASK_ATTRIBUTE = 'dailyGoalText';
    const TASK_REPLACE_ATTRIBUTES = ['choice'];

    // All data is loaded
    if (participant && participant.preferences && participant.preferences.dailyGoalText && participant.preferences.choice) {
        return format(participant, TASK_ATTRIBUTE, TASK_REPLACE_ATTRIBUTES)
        //return participant.preferences.dailyGoalText + ": " + participant.preferences.choice
    }
    return null
}

/**
 * Process an answer from the user
 * @param thisId
 * @param answer
 */
export function answerQuestion(thisId, answer) {
    let thisQuestion = Questions.findOne({_id: thisId});
    if (!thisQuestion) {
        console.log('ERROR Server error, no question to answer with ID' + thisId)
    } else {
        console.log('INFO Answering ' + thisQuestion.name + '.' + thisQuestion.sequence + ' with ' + answer);

        // Note the day in study, including any time-traveling done in testing
        let participant = Participants.findOne({emailAddress: thisQuestion.username});
        let dayOfStudy = DateHelper.reactiveDaysSince(participant.studyStartUTC);
        let timeTravelInDays = DateHelper.daysDiff(
            participant.studyStartUTC,
            participant.challengeStartUTC);
        let answeredOnDay = (dayOfStudy - timeTravelInDays).toString();
        let now = Date.now();

        // Record the answer
        Questions.update(
            {_id: thisId},
            {
                $set: {
                    answer: answer,
                    answered: true,
                    answerDate: now,
                    answeredOnDay: answeredOnDay
                }
            },
            function (err, responseData) {
                if (err) { // "err" is an error received during the request, if any
                    console.log('ERROR answerQuestion Error in updating answer: ' + err.message);
                }
            }
        );

        thisQuestion = Questions.findOne({_id: thisId});

        if (thisQuestion.username) {
            thisQuestion = Questions.findOne({_id: thisId});
            Meteor.call("httpSendToAllAgents", 'answerQuestion', EVENTS.ANSWER, thisQuestion.username, {
                event: 'answerQuestion',
                question: thisQuestion
            });
        }

        // Set the preferences value for this Participant with this answer
        if (thisQuestion.preferenceToSet && thisQuestion.username) {

            let isBio = thisQuestion.preferenceToSet.startsWith('bio.');
            let preferenceToSet = isBio ? thisQuestion.preferenceToSet.substr(4) : thisQuestion.preferenceToSet;

            if (participant && participant.preferences) {
                // Note the goal type before making assignments so we can check if this is a goal setting assignment
                let previousGoal = getTaskText(participant);
                let previousReminderPeriod = Participants.getPreferenceForUser(participant.emailAddress, 'reminderPeriod');
                // TODO LEAVE the following var statements as 'var', not 'let' - something does not get passed correctly
                // TODO with the let context. Tried setting the subdocument using the following with only partial effect -
                // TODO https://stackoverflow.com/questions/24986026/how-to-dynamically-set-a-subdocument-field-in-mongodb
                var newpreferences = participant.preferences;
                var answer = getAnswerResponse(thisQuestion, answer);
                newpreferences[preferenceToSet] = answer;
                console.log("INFO updating preferences: " + JSON.stringify(newpreferences));
                Participants.update(
                    {_id: participant._id},
                    {$set: {preferences: newpreferences}}
                );

                if (isBio) {
                    // special case things going into the bio
                    // preferences is only used to mark if question answered.
                    let userId = Meteor.userId();
                    if (preferenceToSet === 'displayName') {
                        console.log("INFO updateing bio: " + answer);
                        Meteor.users.update({_id: userId}, {$set: {"profile.bio.displayName": answer}});
                    } else {
                        console.log('ERROR answerQuestion Error in bio answer for: ' + bioName);
                    }
                } else {
                    // Update the Participant interaction (user model) for new inputs - this reset participant attributes
                    makeAssignments(participant);
                    // Reacquire updated participant attributes
                    participant = Participants.findOne({emailAddress: thisQuestion.username});
                    // Check if this is the first setting of daily goal text and set the study goals if it is
                    let currentGoal = getTaskText(participant);
                    let userId = findUserIdForParticipant(participant.emailAddress);
                    let taskContent = Participants.getPreferenceForUser(participant.emailAddress, 'goalContent');
                    if (!previousGoal && currentGoal && userId && taskContent) {
                        console.log('INFO Assigning study goal for ' + participant.emailAddress + ': ' + currentGoal);
                        TasksHelpers.assignOneTaskForConsecutiveDays(userId, currentGoal, taskContent, participant.emailAddress)
                        //TasksHelpers.assignTasksByJson(userId, participant.emailAddress, currentGoal, "activityScheduleDefault.json")
                    }
                    // Check if this is the first setting of reminder period, which is the last piece of information needed
                    // for reminding, and set up the reminder scheduled messages
                    // Disabling I2 Reminder scheme for ACTUAL_VALUE_HERE/Miami Studies
                    let currentReminderPeriod = Participants.getPreferenceForUser(participant.emailAddress, 'reminderPeriod');
                    if (!previousReminderPeriod && currentReminderPeriod) {
                        console.log('INFO Assigning reminders for ' + participant.emailAddress);
                        scheduleRemindersMessages(participant)
                    }
                    // Update the Participant's Question asking for new interaction constraints
                    if (thisQuestion.taskId) {
                        // If this is a follow-on question to a Task reporting question, note that
                        pushScheduledMessagesForParticipant(thisQuestion.username, thisQuestion.taskId)
                    } else {
                        pushScheduledMessagesForParticipant(thisQuestion.username)
                    }

                    // Update reminderTimes if reminderTime has changed by user input
                    updateFutureReminderTimes(participant.emailAddress, answer)
                }
            }
        }
    }
}


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
