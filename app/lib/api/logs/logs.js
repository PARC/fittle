/**
 * Created by krivacic on 6/2/2017.
 */
/**
 * Use this file to define the schema for Logs and its helpers.
 * The schema definition and validation functions are made possible by the packages:
 *
 * Make sure to update .gitignore to see changes to this file: e.g.,
 * logs
 * !app/api/logs/logs.js
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
export const Logs = new Mongo.Collection('logs');

/**
 * Defines all fields of Log schema.
 *
 * Defining the fields in a dictionary, and then using the dictionary to reference the
 * fields elsewhere aids code management, and allows the IDE to check references to these fields.
 *
 */

const FIELDS = {
    TIMESTAMP: "timeStamp",
    USER_ID: "userId",
    LOG_TYPE: "logType",
    LOG_DATA: "logData",
    MESSAGE: "message"
};

/**
 * Defines public fields of Questions collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Logs.publicFields = {
    [FIELDS.TIMESTAMP]: 1,
    [FIELDS.USER_ID]: 1,
    [FIELDS.LOG_TYPE]: 1,
    [FIELDS.LOG_DATA]: 1,
    [FIELDS.MESSAGE]: 1
};

/**
 * Defines the Questions schema.
 */
Logs.schema = new SimpleSchema({
    [FIELDS.MESSAGE]: {
        type: String,
        label: "Message",
        optional: false,
        defaultValue: ""
    },

    [FIELDS.LOG_DATA]: {
        type: Object,
        label: "data",
        optional: false,
        defaultValue: ""
    },

    [FIELDS.LOG_TYPE]: {
        type: String,
        label: "Type",
        optional: false,
        blackbox: true
    },

    [FIELDS.USER_ID]: {
        type: String,
        label: "User ID",
        optional: false
    },

    [FIELDS.TIMESTAMP]: {
        type: Date,
        defaultValue: new Date(),
        optional: true
    }

});


/**
 * Attaches schema definition to the collection. Now, all mutators called on this collection
 * (insert/update/upsert) will first be validated.
 */
Logs.attachSchema(Logs.schema);

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


