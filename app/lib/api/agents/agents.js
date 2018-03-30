/**
 * Created by lnelson on 1/23/17.
 */
/**
 * Created by lnelson on 1/17/17.
 */
/**
 * Created by lnelson on 9/21/16.
 */
/**
 * Use this file to define the schema for Agents and its helpers.
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
export const Agents = new Mongo.Collection('agents');

/**
 * Defines all fields of Studies schema.
 *
 * Defining the fields in a dictionary, and then using the dictionary to reference the
 * fields elsewhere aids code management, and allows the IDE to check references to these fields.
 *
 * Use the ES6 syntax [FIELDS.KEY_NAME] to use values from this dictinoary as keys in other
 * dictionaries. See this link for more
 * info: http://stackoverflow.com/questions/2241875/how-to-create-an-object-property-from-a-variable-value-in-javascript
 *
 * @type {{STUDY_NAME: string, KIND: string, SOURCE: string, TIMESTAMP: string, DATA: string, CREATED_AT: string}}
 */
const FIELDS = {
    NAME: "name",
    URL: "url",
    API_TOKEN: "apiToken",
    REMOTE_IP: "ip",
    EVENTS: "events",
    ACTIVE: "active",
    CREATED_AT: "createdAt"
};


/**
 * Defines public fields of Scheduledmessages collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Agents.publicFields = {
    [FIELDS.NAME]: 1,
    [FIELDS.URL]: 1,
    [FIELDS.API_TOKEN]: 1,
    [FIELDS.REMOTE_IP]: 1,
    [FIELDS.EVENTS]: 1,
    [FIELDS.ACTIVE]: 1
};


/**
 * Defines the Scheduledmessages schema.
 */
Agents.schema = new SimpleSchema({

    [FIELDS.NAME]: {
        type: String,
        label: "Name",
        optional: true,
        max: 100
    },

    [FIELDS.URL]: {
        type: String,
        label: "URL",
        optional: false,
        max: 200
    },

    [FIELDS.API_TOKEN]: {
        type: String,
        label: "API Token",
        defaultValue: "",
        max: 64
    },

    [FIELDS.REMOTE_IP]: {
        type: String,
        label: "Remote IP",
        defaultValue: "",
        max: 64
    },

    [FIELDS.EVENTS]: {
        type: [String],
        label: "Events to share with agent",
        optional: true,
        allowedValues: [
            'report',
            'start',
            'stop'
        ]
    },

    [FIELDS.ACTIVE]: {
        type: Boolean,
        label: "Active in study indicator",
        defaultValue: false
    },

    [FIELDS.CREATED_AT]: {
        type: Date,
        label: 'Creation timestamp',
        defaultValue: new Date()
    }

})
;


/**
 * Attaches schema definition to the collection. Now, all mutators called on this collection
 * (insert/update/upsert) will first be validated.
 */
Agents.attachSchema(Agents.schema);


/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Agents document.
 * @author L. Nelson
 */
Agents.create = function (name,
                          url,
                          events,
                          active) {
    const values = {
        [FIELDS.NAME]: name,
        [FIELDS.URL]: url,
        [FIELDS.EVENTS]: events,
        [FIELDS.ACTIVE]: active
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
