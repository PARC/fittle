/**
 * Use this file to define the schema for Participants and its helpers.
 * The schema definition and validation functions are made possible by the packages:
 *
 *    (1) aldeed:collection2 (https://atmospherejs.com/aldeed/collection2)
 *    (2) aldeed:simple-schema (https://atmospherejs.com/aldeed/simple-schema)
 *
 **/

import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {getContentByActivity} from '../activities/activities';
import {DateHelper, isNotIn, propagateKeys} from '../../helpers';
import {Random} from 'meteor/random'

/**
 * Create the MongoDB collection.
 * @note The collection is created only if this code is executed on the server.
 * See https://guide.meteor.com/collections.html#mongo-collections for more info.
 * @type {Mongo.Collection}
 *
 * TODO: Consider using Study specific subschema for Settings and Preferences
 * TODO: Consider using Study specific validation routines on Settings and Preferences
 * TODO: If we use subschema, then what does that do to publicFields?
 * TODO: Consider putting CONDITION allowedValues into settings.json so client and server can run from one configuration value set
 *
 */
export const Participants = new Mongo.Collection('participants');
export const DEFAULT_TEAM_NAME = 'lobby';


/**
 * Defines all fields of Participants schema.
 *
 * Defining the fields in a dictionary, and then using the dictionary to reference the
 * fields elsewhere aids code management, and allows the IDE to check references to these fields.
 *
 * Use the ES6 syntax [FIELDS.KEY_NAME] to use values from this dictinoary as keys in other
 * dictionaries. See this link for more
 * info: http://stackoverflow.com/questions/2241875/how-to-create-an-object-property-from-a-variable-value-in-javascript
 *
 * @type {{EMAIL: string, GOAL_TEXT: string, CREATED_AT: string}}
 */
export const FIELDS = {
    EMAIL: "emailAddress",
    CONDITION: "condition",
    STUDY_ID: "studyId",
    SETTINGS: "settings",
    PREFERENCES: "preferences",
    STUDY_START_UTC: "studyStartUTC",
    CHALLENGE_START_UTC: "challengeStartUTC",
    CREATED_AT: "createdAt"
};


/**
 * Defines public fields of Participants collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Participants.publicFields = {
    [FIELDS.EMAIL]: 1,
    [FIELDS.CONDITION]: 1,
    [FIELDS.STUDY_ID]: 1,
    [FIELDS.SETTINGS]: 1,
    [FIELDS.STUDY_START_UTC]: 1,
    [FIELDS.CHALLENGE_START_UTC]: 1,
    [FIELDS.PREFERENCES]: 1
};

/**
 * Defines the Participants schema.
 */
Participants.schema = new SimpleSchema({

    [FIELDS.EMAIL]: {
        type: String,
        label: "Email address",
        regEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))$/,
        optional: false,
        unique: true,
        max: 100
    },

    [FIELDS.CONDITION]: {
        type: String,
        label: "Study condition",
        optional: false
    },

    [FIELDS.STUDY_ID]: {
        type: String,
        label: "UUID",
        optional: true,
        unique: true,
        max: 36
    },

    [FIELDS.SETTINGS]: {
        type: Object,
        label: "Settings for assigned Participant information",
        optional: true,
        blackbox: true
    },

    [FIELDS.PREFERENCES]: {
        type: Object,
        label: "Preferences for interactively set participant information",
        optional: true,
        blackbox: true
    },

    [FIELDS.STUDY_START_UTC]: {
        type: Date,
        label: "Start Day (UTC)",
        optional: true,
        defaultValue: new Date()
    },

    [FIELDS.CHALLENGE_START_UTC]: {
        type: Date,
        label: "Challenge Start Day (UTC)",
        optional: true
    },

    [FIELDS.CREATED_AT]: {
        type: Date,
        optional: true,
        defaultValue: new Date()
    }

});


/**
 * Attaches schema definition to the collection. Now, all mutators called on this collection
 * (insert/update/upsert) will first be validated.
 */
Participants.attachSchema(Participants.schema);


/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Participants document.
 * @return { {String, Object} } - Dictionary of the form <String, Object>
 * @author M. Silva
 *
 */
Participants.create = function (emailAddress, condition, settings, preferences) {
    let userSettings = settings ? settings : {};
    let userPrefences = preferences ? preferences : {};
    // Generate a study id for a participant if one is not specified already
    let studyId = userSettings.studyId ? userSettings.studyId : Random.id();

    let server_tzo = new Date().getTimezoneOffset();

    let dobj = new Date();
    let date = dobj.getUTCDate();
    let month = dobj.getUTCMonth();
    let year = dobj.getUTCFullYear();
    let utc_midnight = Date.UTC(year, month, date, 0, 0, 0)
    let date_midnight = new Date(utc_midnight + 60 * 1000 * server_tzo);

    const values = {
        [FIELDS.EMAIL]: emailAddress,
        [FIELDS.CONDITION]: condition,
        [FIELDS.STUDY_ID]: studyId,
        [FIELDS.SETTINGS]: userSettings,
        [FIELDS.PREFERENCES]: userPrefences,
        [FIELDS.STUDY_START_UTC]: date_midnight,
        [FIELDS.CHALLENGE_START_UTC]: date_midnight,
        [FIELDS.CREATED_AT]: new Date()
    };
    // By default all participants go into a lobby team unless they are explicitly assigned otherwise
    if (!values.settings.team) {
        values.settings.team = DEFAULT_TEAM_NAME
    }
    return values;
}


/**
 * Case-insensitive
 * @note No error checking because schema definition disallows duplicate email addresses.
 * @param emailAddress
 * @throw Error if user does not exist.
 */
Participants.findByEmailAddress = function (emailAddress) {
    const selector = {[FIELDS.EMAIL]: {$regex: new RegExp(emailAddress, "i")}};
    return Participants.findOne(selector);
};


/**
 * @note No error checking because schema definition disallows duplicate email addresses.
 * @param emailAddress
 * @throw Error if user does not exist. Shouldn't be searching for people who ain't real!
 */
Participants.getConditionForUser = function (emailAddress) {
    const selector = {[FIELDS.EMAIL]: emailAddress};
    const participant = Participants.findOne(selector);
    if (participant)
        return participant.condition;
    return null
};


/**
 * Getter for a setting
 * @note No error checking because schema definition disallows duplicate email addresses.
 * @param emailAddress
 * @param settingName
 * @returns {*}
 * @throw Error if user does not exist. Shouldn't be searching for people who ain't real!
 */
Participants.getSettingForUser = function (emailAddress, settingName) {
    const selector = {[FIELDS.EMAIL]: emailAddress};
    const participant = Participants.findOne(selector);
    if (participant && participant.settings)
        return participant.settings[settingName];
    return null
};

/**
 * Setter for a setting
 * @note No error checking because schema definition disallows duplicate email addresses.
 * @param emailAddress
 * @param name
 * @returns {*}
 * @throw Error if user does not exist. Shouldn't be searching for people who ain't real!
 */
Participants.setSettingForUser = function (emailAddress, name, value) {
    const selector = {[FIELDS.EMAIL]: emailAddress};
    const participant = Participants.findOne(selector);
    if (participant && participant.settings && participant.settings[name]) {
        let modifier = {};
        modifier[name] = value;
        Participants.update({_id: participant._id}, {$set: modifier});
        return true;
    }
    return false
};


/**
 * Getter for a preference
 * @note No error checking because schema definition disallows duplicate email addresses.
 * @param emailAddress
 * @param name
 * @returns {*}
 * @throw Error if user does not exist. Shouldn't be searching for people who ain't real!
 */
Participants.getPreferenceForUser = function (emailAddress, name) {
    const selector = {[FIELDS.EMAIL]: emailAddress};
    const participant = Participants.findOne(selector);
    if (participant && participant.preferences)
        return participant.preferences[name];
    return null
};

/**
 * Setter for a preference
 * @note No error checking because schema definition disallows duplicate email addresses.
 * @param emailAddress
 * @param name
 * @returns {*}
 * @throw Error if user does not exist. Shouldn't be searching for people who ain't real!
 */
Participants.setPreferenceForUser = function (emailAddress, name, value) {
    const selector = {[FIELDS.EMAIL]: emailAddress};
    const participant = Participants.findOne(selector);
    if (participant && participant.settings && participant.settings[name]) {
        let modifier = {};
        modifier[name] = value;
        Participants.update({_id: participant._id}, {$set: modifier});
        return true;
    }
    return false
};


/**
 * Getter for start date of a study for a Participant in UTC
 * @param {String} emailAddress
 * @returns {Date|null}
 */
Participants.getStudyStartUTC = function (emailAddress) {
    const selector = {[FIELDS.EMAIL]: emailAddress};
    const participant = Participants.findOne(selector);
    if (participant)
        return participant.studyStartUTC;
    return null
};


/**
 * Setter for start date of a study for a Participant in UTC
 * @param emailAddress
 * @returns {*}
 */
Participants.setStudyStartUTC = function (emailAddress) {
    let user = Meteor.users.findOne({username: emailAddress});
    let clientTimezoneOffset = 0;
    try {
        clientTimezoneOffset = parseInt(user.profile.timezone)
    } catch (err) {
        console.log("WARN setStudyStartUTC could not get client timezone offset: " + err.message)
    }
    clientTimezoneOffset = -420;
    let now_in_servertime = new Date();
    let server_utc_offset_in_minutes = now_in_servertime.getTimezoneOffset();
    let now_in_utc = new Date(now_in_servertime.getTime() + 60 * 1000 * server_utc_offset_in_minutes).getTime();
    let now_in_clienttime = new Date(now_in_utc + 60 * 1000 * clientTimezoneOffset);
    let milliseconds_since_midnight_clienttime = now_in_clienttime.getMilliseconds() + 1000 * now_in_clienttime.getSeconds() + 1000 * 60 * now_in_clienttime.getMinutes() + 1000 * 60 * 60 * now_in_clienttime.getHours();
    let midnight_in_clienttime = now_in_clienttime.getTime() - milliseconds_since_midnight_clienttime;
    let client_midnight_in_utc = new Date(midnight_in_clienttime - 60 * 1000 * clientTimezoneOffset);

    //let resetDate = new Date();
    Participants.update(
        {emailAddress: emailAddress},
        {
            $set: {
                studyStartUTC: client_midnight_in_utc,
                challengeStartUTC: client_midnight_in_utc
            }
        });
};


/**
 * Return a sequence of participant inputs from a JSON participant specification
 * @param participantJSON
 */
export function parseParticipantRecords(participantJSON) {
    var rows = [];
    for (var ix = 0; ix < participantJSON.length; ix++) {
        var participantRecord = participantJSON[ix];
        if (participantRecord) {
            var row = Participants.create(
                participantRecord.emailAddress,
                participantRecord.condition,
                participantRecord.settings,
                participantRecord.preferences);
            // Pick up any additional fields not handled by create method
            propagateKeys(participantRecord, row);
            rows.push(row)
        }
    }
    return rows
}

/**
 *
 * @param attribute
 * @returns {boolean}
 */
function checkAttribute(attribute) {
    for (let key in FIELDS) {
        if (FIELDS[key] == attribute) return true;
    }
    return false
}

/**
 * Getter for first level attribute for a Participant in UTC
 * @param {String} emailAddress
 * @returns {Date|null}
 */
Participants.getAttribute = function (emailAddress, attribute) {
    if (!checkAttribute(attribute)) return null;
    const selector = {[FIELDS.EMAIL]: emailAddress};
    const participant = Participants.findOne(selector);
    if (participant)
        return participant[attribute];
    return null
};

/**
 * Setter for first level attribute for a Participant
 * @param emailAddress
 * @returns {*}
 */
Participants.setAttribute = function (emailAddress, attribute, value) {
    const selector = {[FIELDS.EMAIL]: emailAddress};
    if (!checkAttribute(attribute) || !Participants.findOne(selector)) return false;
    var setModifier = {$set: {}};
    setModifier.$set[attribute] = value;
    Participants.update(selector, setModifier);
    return true
};

/**
 * Setter for first level attribute for a Participant using Study ID to identify Participant
 * @param emailAddress
 * @returns {*}
 */
Participants.setAttributeByStudyId = function (studyId, attribute, value) {
    const selector = {[FIELDS.STUDY_ID]: studyId};
    let participant = Participants.findOne(selector);
    if (!participant) return false;
    var setModifier = {$set: {}};
    let modifiers = attribute.split(".");
    if (modifiers.length == 1) {
        setModifier.$set[attribute] = value;
    } else if (modifiers.length == 2) {
        setModifier.$set[modifiers[0]] = participant[modifiers[0]];
        setModifier.$set[modifiers[0]][modifiers[1]] = value;
    } else {
        return;
    }
    Participants.update(selector, setModifier);
    return true
};


/**
 * Get the day in the challenge for a participant, including any time-traveling going on
 * @param participant
 * @returns {number}
 */
Participants.getChallengeDay = function (participant) {
    let startDate = null;
    if (participant && (participant.challengeStartUTC || participant.studyStartUTC)) {
        startDate = participant.challengeStartUTC ? participant.challengeStartUTC : participant.studyStartUTC
    }
    if (startDate) return DateHelper.daysSince(startDate);
    return -1;
};

/**
 * Get the day in the challenge for a participant, including any time-traveling going on
 * @param participant
 * @returns {number}
 */
Participants.getChallengeDayForDate = function (participant, forDate) {
    let startDate = null;
    if (participant) {
        let thisParticipant = Participants.findOne({_id: participant._id});
        if (thisParticipant && (thisParticipant.challengeStartUTC || thisParticipant.studyStartUTC)) {
            startDate = thisParticipant.challengeStartUTC ? thisParticipant.challengeStartUTC : thisParticipant.studyStartUTC
        }
        if (startDate) return DateHelper.daysDiff(startDate, forDate);
    }
    return -1;
};

/**
 * Get start time as adjusted for time travel or not
 * @param participant
 * @returns {*}
 */
Participants.getStartDate = function (participant) {
    let startDate = null;
    if (participant) {
        let thisParticipant = Participants.findOne({_id: participant._id});
        if (thisParticipant && (thisParticipant.challengeStartUTC || thisParticipant.studyStartUTC)) {
            startDate = thisParticipant.challengeStartUTC ? thisParticipant.challengeStartUTC : thisParticipant.studyStartUTC
        }
    }
    return startDate
};
