/**
 * Created by lnelson on 9/14/16.
 */
import {Configuration} from '../../studyConfiguration';
import {DateHelper} from '../../../lib/helpers';
import {importScheduledmessagesJson} from './server.methods.studyJsonData';
import {Questions} from '../../../lib/api/questions/questions';
import {Participants} from '../../../lib/api/participants/participants';

/**
 * Build the Scheduled Messages needed for the reminders needed in the I2 Study for a participant
 * TODO Move formats to scheduledMessages for Study Specific settings, preferences, and formats
 */
const REMINDER_TEXT_ATTRIBUTE = 'reminderText';
const REMINDER_REPLACE_ATTRIBUTES = ['choice', 'person', 'place'];

/**
 * Get basic form for one scheduled message sequence with one reminder in it
 * @param name
 * @param askDate
 * @param askTime
 * @param expireDate
 * @param expireTime
 * @param sequenceBase
 * @param text
 * @returns {{name: *, constraints: Array, askDate: *, askTime: *, expireDate: *, expireTime: *, sequenceBase: *, questions: *[]}}
 * @constructor
 */
function REMINDER_SEQUENCE(emailAddress, name, askDate, askTime, expireDate, expireTime, sequenceBase, text) {
    return {
        name: name,
        constraints: [
            {
                "attribute": "emailAddress",
                "value": emailAddress
            }
        ],
        askDate: askDate,
        askTime: askTime,
        expireDate: expireDate,
        expireTime: expireTime,
        sequenceBase: sequenceBase,
        questions: [
            {
                tag: "reminder",
                text: text,
                responseFormat: "list-choose-one",
                notify: true,
                choices: ["OK"]
            }
        ]
    }
}

/**
 * Get basic form for scheduling messages input
 * @returns {{sequences: Array}}
 * @constructor
 */
function REMINDER_SCHEDULED_MESSSGE() {
    return {
        sequences: []
    }
};

/**
 * Get how many messages sequences are defined
 * @param sequences
 * @returns {*}
 */
function getSequenceLength(sequences) {
    try {
        return sequences.sequences.length
    } catch (err) {
    }
    return 0;
}


/**
 * Return reminderCount for a string lookup on reminderDistribution
 * @param participant
 * @returns {*}
 */
function getReminderCount(participant) {
    try {
        return participant.settings.reminderCount
    } catch (err) {
    }
    return "0"
}

/**
 * Return reminderCount for a string lookup on reminderDistribution
 * @param participant
 * @returns {*}
 */
function getReminderDistribution(participant) {
    try {
        return participant.settings.reminderDistribution
    } catch (err) {
    }
    return ""
}

/**
 * Return reminder schedule from the configuration based on Participant settings
 * @param participant
 * @returns {*}
 */
function getReminderSchedule(reminderDistribution, reminderCount) {
    try {
        return Configuration.getData().reminderGenericSchedule[reminderDistribution][reminderCount]
    } catch (err) {
    }
    return null
}

/**
 * Return eventTime set by a Participant
 * @param participant
 * @returns {*}
 */
function getEventTime(participant) {
    try {
        return DateHelper.timeBefore(participant.preferences.eventTime, "0")
    } catch (err) {
        console.log('WARN getEventTime error: ' + err.message)
    }
    return null
}

/**
 * Return eventTime set by a Participant
 * @param participant
 * @returns {*}
 */
function getReminderTime(participant) {
    try {
        return DateHelper.timeBefore(participant.preferences.eventTime, participant.preferences.reminderPeriod)
    } catch (err) {
        console.log('WARN getReminderTime error: ' + err.message)
    }
    return null
}


/**
 * Make a string replacement using Participant data into the reminderText
 * @param participant
 * @param attributeList
 * @returns {format}
 */
function format(participant, reminderTextAttribute, attributeList) {
    let content = new String(participant.preferences[reminderTextAttribute]);
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
function getReminderText(participant) {
    // Top level data is loaded
    if (participant && participant.settings && participant.preferences &&
        Configuration && Configuration.getData() && Configuration.getData().reminderGenericSchedule &&
        Configuration.getData().reminderGenericSchedule.uniform && Configuration.getData().reminderGenericSchedule.masked) {
        // Settings data is loaded
        if (participant.settings.reminders === 'yes' &&
            getReminderCount(participant) &&
            participant.settings.reminderDistribution) {
            // Participant Data is loaded
            if (participant.preferences &&
                participant.preferences.choice &&
                participant.preferences.place &&
                participant.preferences.person &&
                participant.preferences.eventTime &&
                participant.preferences.reminderPeriod) {
                let returnText = format(participant, REMINDER_TEXT_ATTRIBUTE, REMINDER_REPLACE_ATTRIBUTES);
                return returnText;
            }
        } else {
            console.log('INFO Participant ' + participant.emailAddress + ' will not get reminders')
        }
    } else {
        console.log('WARN Top level reminder structures not available for Participant ' + participant.emailAddress)
    }
    return null
}

/**
 * Create a unique name for a reminder
 * @param participant
 * @param day
 * @param time
 * @returns {*}
 */
function createReminderSequenceName(participant, day, time) {
    if (participant)
        return Configuration.name + "_" + participant.emailAddress + "_" + day + '_' + time;
    return "reminder"
}

/**
 * Create all the scheduled messages needed for one Participant's reminders.
 * Reminder text is based on a participant's answers to questions
 * Reminder schedule is based on assigned condition and the time of day preferences a person as answered
 * @param participant
 * @param reminderText
 * @returns {*}
 */
function buildMessageSequencesForReminders(participant, reminderText) {
    let sequences = REMINDER_SCHEDULED_MESSSGE();
    if (reminderText) {
        let reminderSchedule = getReminderSchedule(
            getReminderDistribution(participant),
            getReminderCount(participant));
        if (reminderSchedule) {
            //Bug 20 - don't assume JSON is correctly sized: let messageCount = parseInt(getReminderCount(participant));
            let messageCount = reminderSchedule.length; // Bug 20 - use all of what schedule is there in JSON
            for (let ix = 0; ix < messageCount; ix++) {
                let askDate = reminderSchedule[ix];
                let expireDate = askDate;
                // Start the reminder prior to the asking, and expire at the ask time
                let askTime = getReminderTime(participant);
                let expireTime = getEventTime(participant);
                let sequenceBase = 100;
                let name = createReminderSequenceName(participant, askDate, askTime);
                //REMINDER_SEQUENCE(emailAddress, name, askDate, askTime, expireDate, expireTime, sequenceBase, text)
                let thisSequence = REMINDER_SEQUENCE(participant.emailAddress, name, askDate, askTime, expireDate, expireTime, sequenceBase, reminderText);
                sequences.sequences.push(thisSequence)
            }
        }
    }
    return getSequenceLength(sequences) ? sequences : null;
}

/**
 * See if the Scheduled Messages for reminders can be scheduled
 * @param participant
 * @returns {boolean}
 */
export function scheduleRemindersMessages(participant) {
    var reminderText = getReminderText(participant);
    var reminderScheduledMessages = buildMessageSequencesForReminders(participant, reminderText);
    // Schedule these Messages
    if (reminderScheduledMessages) {
        let feedback = importScheduledmessagesJson(reminderScheduledMessages);
        console.log("INFO scheduleRemindersMessages:" + feedback);
        return feedback;
    }
    return "No Messages Imported"
}

/**
 * Get the number of milliseconds since midnight represented by the reminderTime string
 * @param reminderTime
 * @returns {number}
 */
export function getReminderTimeValue(reminderTime) {
    if (!reminderTime || typeof reminderTime !== 'string') return -1;
    // Remove any extraneous bits added to reminderTime along the way (e.g., timezone conversion numbers might get added
    // when time values come from user input)
    let thisTime = reminderTime.split(' ')[0];
    let regex = /([01]\d|2[0-3]):([0-5]\d)/;
    if (!regex.test(thisTime)) return -1;
    let timevalues = thisTime.split(":");
    let hours = -1;
    let minutes = -1;
    try {
        hours = parseInt(timevalues[0]);
        minutes = parseInt(timevalues[1]);
    } catch (err) {
        console.log("ERROR: getReminderTimeValue could not read time values: " + err.message)
    }
    if (minutes < 0 || hours < 0) return -1;
    return 1000 * (hours * 60 * 60 + minutes * 60);
}

/**
 * Update all future questions with a new reminder time
 * @param username
 * @param reminderTime
 */
export function updateFutureReminderTimes(username, reminderTime) {
    if (!reminderTime || typeof reminderTime !== 'string') return;
    // Handle less than ideal formatting that the input stream can take
    let newTime = reminderTime.split(' ')[0];
    let regex = /\d:\d/;
    if (!regex.test(newTime)) return;

    let reformat = newTime.split(":");
    let hours = parseInt(reformat[0]);
    let minutes = parseInt(reformat[1]);
    if (hours > 23 || minutes > 59) return;
    let reformedHours = hours > 9 ? hours.toString() : '0' + hours.toString();
    let reformedMinutes = minutes > 9 ? minutes.toString() : '0' + minutes.toString();
    let reformedTime = reformedHours + ":" + reformedMinutes;

    let newAskTimeValue = getReminderTimeValue(reformedTime);
    if (newAskTimeValue < 0) return;
    let thisParticipant = Participants.findOne({emailAddress: username});
    if (!thisParticipant) return;

    let now = new Date();
    let questions = Questions.find(
        {
            username: username,
            askDatetime: {$gt: now},
            askTime: {$ne: reformedTime},
            tag: /reminder/
        }
    ).fetch();
    if (questions.length) {
        // Adjust the askTime and the askDatetime by the new values - keeping the same askDate/askDay
        for (let iq = 0; iq < questions.length; iq++) {
            let q = questions[iq];
            let previousAskTimeValue = getReminderTimeValue(q.askTime);
            if (previousAskTimeValue > 0) {
                let timeDiff = newAskTimeValue - previousAskTimeValue;
                try {
                    let newAskDatetime = new Date(q.askDatetime.getTime() + timeDiff)
                    Questions.update({_id: q._id}, {$set: {askDatetime: newAskDatetime, askTime: reformedTime}})
                } catch (err) {
                    console.log("ERROR: updateFutureReminderTimes could not adjust time values: " + err.message)
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
