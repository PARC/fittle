/**
 * Created by lnelson on 7/25/16.
 */
/**
 * Created by lnelson on 7/25/16.
 */
/**
 * Use this file to define the schema for Scheduledmessages and its helpers.
 * The schema definition and validation functions are made possible by the packages:
 *
 *    (1) aldeed:collection2 (https://atmospherejs.com/aldeed/collection2)
 *    (2) aldeed:simple-schema (https://atmospherejs.com/aldeed/simple-schema)
 *
 **/

import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';


/**
 * Create the MongoDB collection.
 * @note The collection is created only if this code is executed on the server.
 * See https://guide.meteor.com/collections.html#mongo-collections for more info.
 * @type {Mongo.Collection}
 */
export const Scheduledmessages = new Mongo.Collection('scheduledmessages');

/**
 * Defines all fields of Scheduledmessages schema.
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
    CONSTRAINTS: "constraints",
    NAME: "name",
    ASK_DATE: "askDate",
    ASK_TIME: "askTime",
    EXPIRE_DATE: "expireDate",
    EXPIRE_TIME: "expireTime",
    SEQUENCE: "sequence",
    RESPONSE_FORMAT: "responseFormat",
    CHOICES: "choices",
    NONE_ALLOWED: "noneAllowed",
    ANSWERS: "answers",
    TEXT: "text",
    TAG: "tag",
    ATTRIBUTE_TO_SET: 'preferenceToSet',
    NOTIFY: "notify",
    LINK_TO_ACTIVITY: "linkToActivity",
    PROPS: "props",
    CREATED_AT: "createdAt"
};


/**
 * Defines public fields of Scheduledmessages collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Scheduledmessages.publicFields = {
    [FIELDS.CONSTRAINTS]: 1,
    [FIELDS.NAME]: 1,
    [FIELDS.ASK_DATE]: 1,
    [FIELDS.ASK_TIME]: 1,
    [FIELDS.EXPIRE_DATE]: 1,
    [FIELDS.EXPIRE_TIME]: 1,
    [FIELDS.RESPONSE_FORMAT]: 1,
    [FIELDS.SEQUENCE]: 1,
    [FIELDS.CHOICES]: 1,
    [FIELDS.NONE_ALLOWED]: 1,
    [FIELDS.ANSWERS]: 1,
    [FIELDS.TEXT]: 1,
    [FIELDS.TAG]: 1,
    [FIELDS.ATTRIBUTE_TO_SET]: 1,
    [FIELDS.NOTIFY]: 1,
    [FIELDS.PROPS]: 1,
    [FIELDS.LINK_TO_ACTIVITY]: 1
};


/**
 * Defines the Scheduledmessages schema.
 */
Scheduledmessages.schema = new SimpleSchema({

    [FIELDS.CONSTRAINTS]: {
        type: [Object],
        label: "Interaction values that constrain a message schedule",
        optional: true,
        blackbox: true
    },

    [FIELDS.NAME]: {
        type: String,
        label: "Name of question sequence",
        optional: false,
        max: 100
    },

    [FIELDS.ASK_DATE]: {
        type: String,
        label: "Ask date",
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
    [FIELDS.EXPIRE_DATE]: {
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

    [FIELDS.RESPONSE_FORMAT]: {
        type: String,
        label: "Message kind",
        optional: false,
        allowedValues: ['list-choose-one', 'list-choose-multiple', 'text', 'time']
    },

    [FIELDS.SEQUENCE]: {
        type: Number,
        label: "Sequence",
        optional: true
    },

    [FIELDS.CHOICES]: {
        type: String,
        label: "Choices",
        optional: true
    },

    [FIELDS.NONE_ALLOWED]: {
        type: Boolean,
        label: "Show None option",
        optional: true
    },

    [FIELDS.ANSWERS]: {
        type: Object,
        label: "Dictionary of answer values",
        optional: true,
        blackbox: true
    },

    [FIELDS.TEXT]: {
        type: String,
        label: "Message text",
        optional: false,
        max: 200
    },

    [FIELDS.TAG]: {
        type: String,
        label: "Tag",
        optional: true,
        max: 100
    },

    [FIELDS.ATTRIBUTE_TO_SET]: {
        type: String,
        label: "Interaction aata attribute to set with an answer",
        optional: true,
        max: 100
    },

    [FIELDS.NOTIFY]: {
        type: Boolean,
        label: "Push Notifications",
        defaultValue: false,
        optional: true
    },

    [FIELDS.LINK_TO_ACTIVITY]: {
        type: Boolean,
        label: "Activity link indicator",
        defaultValue: false,
        optional: true
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
Scheduledmessages.attachSchema(Scheduledmessages.schema);


/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Scheduledmessages document.
 * @author L. Nelson
 */
Scheduledmessages.create = function (constraints,
                                     askDate,
                                     askTime,
                                     expireDate,
                                     expireTime,
                                     responseFormat,
                                     sequence,
                                     choices,
                                     answers,
                                     text,
                                     tag,
                                     name,
                                     preferenceToSet,
                                     notify,
                                     linkToActivity,
                                     noneAllowed,
                                     props)
{
    let thisAskTime = askTime;
    try {
        thisAskTime = thisAskTime.trim()
    } catch (err) {

    }
    if (!thisAskTime)
        thisAskTime = '00:00';
    if (thisAskTime && thisAskTime.hasOwnProperty('trim') && !thisAskTime.trim()) {
        thisAskTime = '00:00'
    }
    let thisExpireTime = expireTime;
    if (expireDate) {
        try {
            thisExpireTime = thisExpireTime.trim()
        } catch (err) {

        }
        if (!thisExpireTime) {
            thisExpireTime = '23:59'
        }
    }
    let thisNotify = notify ? true : false;
    let thisActivityLink = linkToActivity ? linkToActivity : false;
    let none = noneAllowed ? noneAllowed : false;
    const values = {
        [FIELDS.CONSTRAINTS]: constraints,
        [FIELDS.ASK_DATE]: askDate,
        [FIELDS.ASK_TIME]: thisAskTime,
        [FIELDS.EXPIRE_DATE]: expireDate,
        [FIELDS.EXPIRE_TIME]: thisExpireTime,
        [FIELDS.RESPONSE_FORMAT]: responseFormat,
        [FIELDS.SEQUENCE]: sequence,
        [FIELDS.CHOICES]: choices,
        [FIELDS.NONE_ALLOWED]: none,
        [FIELDS.ANSWERS]: answers,
        [FIELDS.TEXT]: text,
        [FIELDS.TAG]: tag,
        [FIELDS.NAME]: name ? name : 'no_name',
        [FIELDS.ATTRIBUTE_TO_SET]: preferenceToSet,
        [FIELDS.NOTIFY]: notify,
        [FIELDS.LINK_TO_ACTIVITY]: thisActivityLink,
        [FIELDS.PROPS]: props,
        [FIELDS.CREATED_AT]: new Date()
    };
    return values;
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


