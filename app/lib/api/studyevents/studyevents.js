/**
 * Created by lnelson on 1/17/17.
 */
/**
 * Created by lnelson on 9/21/16.
 */
/**
 * Use this file to define the schema for Studyevents and its helpers.
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
export const Studyevents = new Mongo.Collection('studyevents');
const EVENT_ANSWER = 'answer';
const EVENT_REPORT = 'report';
const EVENT_START = 'start';
const EVENT_STOP = 'stop';
export const EVENTS = {
    ANSWER: EVENT_ANSWER,
    REPORT: EVENT_REPORT,
    START: EVENT_START,
    STOP: EVENT_STOP
};

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
    STUDY_NAME: "studyName",
    KIND: "kind",
    SOURCE: "source",
    DATA: "data",
    SHARED: "shared",
    CREATED_AT: "createdAt"
};


/**
 * Defines public fields of Scheduledmessages collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Studyevents.publicFields = {
    [FIELDS.STUDY_NAME]: 1,
    [FIELDS.KIND]: 1,
    [FIELDS.SOURCE]: 1,
    [FIELDS.SHARED]: 1,
    [FIELDS.DATA]: 1
};


/**
 * Defines the Scheduledmessages schema.
 * { studyName: "somename",
 *   kind: "one of 'answer' or 'report' or 'start' or 'stop' - this is negotiable",
 *   source: "someidentifieferforsource",
 *   data: { attribute1: "value1 which maybe be a string, number, object, array, etc - anything JSON",
  *          attributeN: "valueN"
  *        },
 *   shared: true,
 *   createdAt: "someUnixTimestamp probably like "
 * }
 */
Studyevents.schema = new SimpleSchema({

    [FIELDS.STUDY_NAME]: {
        type: String,
        label: "Name of study",
        optional: false,
        defaultValue: 'KPH Transition Study',
        max: 100
    },

    [FIELDS.KIND]: {
        type: String,
        label: "Kind of event",
        optional: false,
        allowedValues: [
            EVENT_ANSWER,
            EVENT_REPORT,
            EVENT_START,
            EVENT_STOP
        ]
    },

    [FIELDS.SOURCE]: {
        type: String,
        label: "Information source",
        optional: false,
        max: 100
    },

    [FIELDS.DATA]: {
        type: Object,
        label: "Event specific data",
        optional: false,
        blackbox: true
    },

    [FIELDS.SHARED]: {
        type: [String],
        label: "Agents shared",
        optional: true,
        max: 100
    },

    [FIELDS.CREATED_AT]: {
        type: Date,
        defaultValue: new Date(),
        optional: true
    }

})
;


/**
 * Attaches schema definition to the collection. Now, all mutators called on this collection
 * (insert/update/upsert) will first be validated.
 */
Studyevents.attachSchema(Studyevents.schema);


/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Studyevents document.
 * @author L. Nelson
 */
Studyevents.create = function (studyName,
                               kind,
                               source,
                               data) {
    const values = {
        [FIELDS.STUDY_NAME]: studyName,
        [FIELDS.KIND]: kind,
        [FIELDS.SOURCE]: source,
        [FIELDS.SHARED]: [],
        [FIELDS.DATA]: data
    };
    return values;
};

