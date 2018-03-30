/**
 * Created by lnelson on 7/25/16.
 */
/**
 * Use this file to define the schema for Questions and its helpers.
 * The schema definition and validation functions are made possible by the packages:
 *
 *    (1) aldeed:collection2 (https://atmospherejs.com/aldeed/collection2)
 *    (2) aldeed:simple-schema (https://atmospherejs.com/aldeed/simple-schema)
 *
 **/

import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {DateHelper} from '../../helpers';


/**
 * Create the MongoDB collection.
 * @note The collection is created only if this code is executed on the server.
 * See https://guide.meteor.com/collections.html#mongo-collections for more info.
 * @type {Mongo.Collection}
 */
export const Questions = new Mongo.Collection('questions');

/**
 * Defines all fields of Questions schema.
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

const FIELDS = {
    ANSWER: "answer",
    ANSWERED: "answered",
    ANSWERS: "answers",
    ANSWER_DATE: "answerDate",
    ANSWERED_ON_DAY: "answeredOnDay",
    ASK_DATE: "askDate",
    ASK_DAY: "askDay",
    ASK_DATETIME: "askDatetime",
    ASK_TIME: "askTime",
    ATTRIBUTE_TO_SET: 'preferenceToSet',
    CHOICES: "choices",
    EXPIRED: "expired",
    EXPIRE_DATE: "expireDate",
    EXPIRE_DATETIME: "expireDatetime",
    EXPIRE_DAY: "expireDay",
    EXPIRE_TIME: "expireTime",
    NONE_ALLOWED: "noneAllowed",
    NOTIFY: "notify",
    RESPONSE_FORMAT: "responseFormat",
    SEQUENCE: "sequence",
    NAME: "name",
    TAG: "tag",
    TEXT: "text",
    USERNAME: "username",
    TASK_ID: "taskId",
    PROPS: "props",
    CREATED_AT: "createdAt"
};


/**
 * Defines public fields of Questions collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Questions.publicFields = {
    [FIELDS.ANSWERED]: 1,
    [FIELDS.ANSWER]: 1,
    [FIELDS.ANSWERS]: 1,
    [FIELDS.ANSWER_DATE]: 1,
    [FIELDS.ANSWERED_ON_DAY]: 1,
    [FIELDS.ASK_DATE]: 1,
    [FIELDS.ASK_DATETIME]: 1,
    [FIELDS.ASK_DAY]: 1,
    [FIELDS.ASK_TIME]: 1,
    [FIELDS.ATTRIBUTE_TO_SET]: 1,
    [FIELDS.CHOICES]: 1,
    [FIELDS.EXPIRED]: 1,
    [FIELDS.EXPIRE_DATE]: 1,
    [FIELDS.EXPIRE_DATETIME]: 1,
    [FIELDS.EXPIRE_DAY]: 1,
    [FIELDS.EXPIRE_TIME]: 1,
    [FIELDS.NONE_ALLOWED]: 1,
    [FIELDS.NOTIFY]: 1,
    [FIELDS.RESPONSE_FORMAT]: 1,
    [FIELDS.SEQUENCE]: 1,
    [FIELDS.NAME]: 1,
    [FIELDS.TAG]: 1,
    [FIELDS.TEXT]: 1,
    [FIELDS.PROPS]: 1,
    [FIELDS.USERNAME]: 1
};


/**
 * Defines the Questions schema.
 */
Questions.schema = new SimpleSchema({
    [FIELDS.ANSWER]: {
        type: String,
        label: "Answer given",
        optional: true,
        defaultValue: ""
    },

    [FIELDS.ANSWERED]: {
        type: Boolean,
        label: "Indicates if answer given",
        optional: true,
        blackbox: true
    },

    [FIELDS.ANSWERS]: {
        type: Object,
        label: "Answers",
        optional: true,
        blackbox: true
    },

    [FIELDS.ANSWER_DATE]: {
        type: Date,
        label: "Answer date",
        optional: true
    },

    [FIELDS.ANSWERED_ON_DAY]: {
        type: Number,
        label: "Day in Challenge answer made",
        optional: true
    },

    [FIELDS.ASK_DATE]: {
        type: Date,
        label: "Ask date",
        optional: false
    },

    [FIELDS.ASK_DATETIME]: {
        type: Date,
        label: "Ask datetime",
        optional: false
    },

    [FIELDS.ASK_DAY]: {
        type: String,
        label: "Ask day",
        optional: false,
        max: 100,
        regEx: /^-?\d+$|now/
    },

    [FIELDS.ASK_TIME]: {
        type: String,
        label: "Ask time",
        regEx: /^[0-2][0-9]:[0-5][0-9]$/,
        optional: true,
        max: 100
    },

    [FIELDS.ATTRIBUTE_TO_SET]: {
        type: String,
        label: "Interaction aata attribute to set with an answer",
        optional: true,
        max: 100
    },

    [FIELDS.CHOICES]: {
        type: [String],
        label: "Choices",
        optional: true
    },

    [FIELDS.EXPIRED]: {
        type: Boolean,
        label: "Indicates expiration",
        optional: true
    },

    [FIELDS.EXPIRE_DATE]: {
        type: Date,
        label: "Expire date",
        optional: true
    },

    [FIELDS.EXPIRE_DATETIME]: {
        type: Date,
        label: "Expire datetime",
        optional: false
    },

    [FIELDS.EXPIRE_DAY]: {
        type: String,
        label: "Expire date",
        optional: true,
        max: 100,
        regEx: /^-?\d+$|now/
    },

    [FIELDS.EXPIRE_TIME]: {
        type: String,
        label: "Expire time",
        regEx: /^[0-2][0-9]:[0-5][0-9]$/,
        optional: true,
        max: 100
    },

    [FIELDS.NONE_ALLOWED]: {
        type: Boolean,
        label: "Show None option",
        optional: true
    },

    [FIELDS.NOTIFY]: {
        type: String,
        label: "Push Notifications",
        allowedValues: ['false', 'true'],
        optional: true
    },

    [FIELDS.RESPONSE_FORMAT]: {
        type: String,
        label: "Response format",
        optional: false,
        allowedValues: ['list-choose-one', 'list-choose-multiple', 'text', 'time']
    },

    [FIELDS.SEQUENCE]: {
        type: Number,
        label: "Sequence",
        optional: true
    },

    [FIELDS.NAME]: {
        type: String,
        label: "Name of question sequence",
        optional: false,
        max: 100
    },

    [FIELDS.TAG]: {
        type: String,
        label: "Tag",
        optional: true,
        max: 100
    },

    [FIELDS.TEXT]: {
        type: String,
        label: "Question text",
        optional: false,
        max: 200
    },

    [FIELDS.USERNAME]: {
        type: String,
        label: "Username of recipient",
        optional: false,
        max: 100
    },

    [FIELDS.TASK_ID]: {
        type: String,
        label: "Associated taskId",
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },

    [FIELDS.PROPS]: {
        type: Object,
        label: "Properties",
        optional: true,
        blackbox: true
    },

    [FIELDS.CREATED_AT]: {
        type: Date,
        defaultValue: new Date(),
        optional: true
    }

});


/**
 * Attaches schema definition to the collection. Now, all mutators called on this collection
 * (insert/update/upsert) will first be validated.
 */
Questions.attachSchema(Questions.schema);


/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Questions document.
 * @author L. Nelson
 */
Questions.create = function (askDate,
                             askTime,
                             preferenceToSet,
                             choices,
                             answers,
                             expireDate,
                             expireTime,
                             notify,
                             responseFormat,
                             sequence,
                             name,
                             tag,
                             text,
                             username,
                             taskId,
                             noneAllowed,
                             askDay,
                             expireDay,
                             props)
{
    let this_ask_datetime = askDate;
    let this_expire_datetime = null;

    if (askDate && askTime) {
        // Calculate exactly when to ask the question. This works on the assumption the askTime
        // is a Date object configured to midnight in the user's preferred timezone (which means
        // it might not be midnight UTC).
        this_ask_datetime = DateHelper.addHoursAndMinutesToDateObject(askDate, askTime);
    }
    if (expireDate && expireTime) {
        // Calculate exactly when to expire the question. This works on the assumption the expireDate
        // is a Date object configured to midnight in the user's preferred timezone (which means
        // it might not be midnight UTC).
        this_expire_datetime = DateHelper.addHoursAndMinutesToDateObject(expireDate, expireTime);
    }
    let none = noneAllowed ? noneAllowed : false;
    const values = {
        [FIELDS.ANSWERED]: false,
        [FIELDS.ANSWER]: "",
        [FIELDS.ANSWERS]: answers,
        [FIELDS.ANSWERED_ON_DAY]: null,
        [FIELDS.ASK_DATE]: askDate,
        [FIELDS.ASK_DAY]: askDay,
        [FIELDS.ASK_DATETIME]: this_ask_datetime,
        [FIELDS.ASK_TIME]: askTime ? askTime : '00:00',
        [FIELDS.ATTRIBUTE_TO_SET]: preferenceToSet,
        [FIELDS.CHOICES]: choices ? choices : '',
        [FIELDS.EXPIRE_DATE]: expireDate,
        [FIELDS.EXPIRED]: false,
        [FIELDS.EXPIRE_DATETIME]: this_expire_datetime,
        [FIELDS.EXPIRE_DAY]: expireDay,
        [FIELDS.EXPIRE_TIME]: expireTime ? expireTime : '00:00',
        [FIELDS.NONE_ALLOWED]: none,
        [FIELDS.NOTIFY]: notify,
        [FIELDS.RESPONSE_FORMAT]: responseFormat ? responseFormat : 'text',
        [FIELDS.SEQUENCE]: sequence ? sequence : '0',
        [FIELDS.NAME]: name ? name : 'no_name',
        [FIELDS.TAG]: tag ? tag : '',
        [FIELDS.TEXT]: text,
        [FIELDS.USERNAME]: username,
        [FIELDS.TASK_ID]: taskId ? taskId : null,
        [FIELDS.PROPS]: props ? props : {},
        [FIELDS.CREATED_AT]: new Date()
    };
    return values;
};


Questions.alreadyAnsweredQuery = function (askDay,
                                           askTime,
                                           choices,
                                           expireDay,
                                           expireTime,
                                           responseFormat,
                                           sequence,
                                           name,
                                           tag,
                                           text,
                                           username) {
    const values = already_answered_query = {
        [FIELDS.TEXT]: text,
        [FIELDS.RESPONSE_FORMAT]: responseFormat,
        [FIELDS.CHOICES]: choices,
        [FIELDS.TAG]: tag,
        [FIELDS.ASK_DAY]: askDay,
        [FIELDS.ASK_TIME]: askTime,
        [FIELDS.EXPIRE_DAY]: expireDay,
        [FIELDS.EXPIRE_TIME]: expireTime,
        [FIELDS.SEQUENCE]: sequence,
        [FIELDS.NAME]: name,
        [FIELDS.USERNAME]: username
    };
    return values
};


/**
 * Add a Question object to the database
 * @param text
 * @param responseFormat
 * @param choices
 * @param username
 * @param tag
 * @param askDate
 * @param askTime
 * @param expireDate
 * @param expireTime
 * @param sequence
 * @param {Boolean} notify
 * @param name
 * @param preferenceToSet
 * @param answers
 */
Questions.addQuestion = function (text,
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
                                  props)
{
    let thisNotify = typeof notify === 'boolean' ? notify.toString() : notify;
    let thisName = name ? name : 'no_name';
    let returnId = null;
    let thisTaskId = taskId ? taskId : null;
    let none = noneAllowed ? noneAllowed : false

    // If this addition is from Administrators data re-load and the Question already exists for today,
    // then don't reload it
    let already_answered_query = Questions.alreadyAnsweredQuery(
        askDay,
        askTime,
        choices,
        expireDay,
        expireTime,
        responseFormat,
        sequence,
        name,
        tag,
        text,
        username
    );
    
    if (!Questions.findOne(already_answered_query)) {
        console.log('INFO Adding Question ' + thisName + '.' + sequence + ' named Question ' + name + ' tagged with ' + tag + ' for user ' + username);
        let createThis = Questions.create(
            askDate,
            askTime,
            preferenceToSet,
            choices,
            answers,
            expireDate,
            expireTime,
            thisNotify,
            responseFormat,
            sequence,
            thisName,
            tag,
            text,
            username,
            thisTaskId,
            none,
            askDay,
            expireDay,
            props ? props : {});
        returnId = Questions.insert(createThis)
    }
    return returnId
};


Questions.makeUnanswered = function (taskId) {
    Questions.update({taskId: taskId, answered: true}, {$set: {answered: false}}, {multi: true})
};

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
