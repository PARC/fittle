/**
 * Created by lnelson on 9/21/16.
 */
/**
 * Use this file to define the schema for Studies and its helpers.
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
export const Studies = new Mongo.Collection('studies');

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
 * @type {{EMAIL: string, GOAL_TEXT: string, CREATED_AT: string}}
 */
const FIELDS = {
    STUDY_NAME: "studyName",
    STUDY_LENGTH: "studyLength",
    ADMINISTRATOR_NAME: "adminName",
    ADMINISTRATOR_EMAIL: "adminEmail",
    ADMINISTRATOR_PHONE: "adminPhone",
    CREATED_AT: "createdAt"
};


/**
 * Defines public fields of Scheduledmessages collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Studies.publicFields = {
    [FIELDS.STUDY_LENGTH]: 1,
    [FIELDS.ADMINISTRATOR_NAME]: 1,
    [FIELDS.ADMINISTRATOR_EMAIL]: 1,
    [FIELDS.ADMINISTRATOR_PHONE]: 1
};


/**
 * Defines the Scheduledmessages schema.
 */
Studies.schema = new SimpleSchema({

    [FIELDS.STUDY_LENGTH]: {
        type: Number,
        label: "Number of days in study",
        optional: false,
        blackbox: true
    },

    [FIELDS.STUDY_NAME]: {
        type: String,
        label: "Name of study",
        optional: false,
        defaultValue: 'Implementation Intention Study',
        max: 100
    },

    [FIELDS.ADMINISTRATOR_NAME]: {
        type: String,
        label: "Contact Name for Administrator",
        optional: false,
        max: 100
    },

    [FIELDS.ADMINISTRATOR_EMAIL]: {
        type: String,
        label: "Contact Email for Administrator",
        optional: false,
        max: 100
    },

    [FIELDS.ADMINISTRATOR_PHONE]: {
        type: String,
        label: "Contact Phone Number for Administrator",
        optional: false,
        max: 100
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
Studies.attachSchema(Studies.schema);


/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Scheduledmessages document.
 * @author L. Nelson
 */
Studies.create = function (studyName,
                           studyLength,
                           adminName,
                           adminEmail,
                           adminPhone) {
    const values = {
        [FIELDS.STUDY_NAME]: studyName ? studyName : 'no_name',
        [FIELDS.STUDY_LENGTH]: studyLength ? studyLength : 28,
        [FIELDS.ADMINISTRATOR_NAME]: adminName ? adminName : 'no_name',
        [FIELDS.ADMINISTRATOR_EMAIL]: adminEmail ? adminEmail : 'no_name',
        [FIELDS.ADMINISTRATOR_PHONE]: adminPhone ? adminPhone : 'no_name'
    };
    return values;
};

Studies.getByName = function (name) {
    return Studies.findOne({studyName: name});
};

/**
 * Insert values into the database if the study does not have an entry already.
 * Return if an insertion was initiated or not.
 * @param studyName
 * @param studyLength
 * @param adminName
 * @param adminEmail
 * @param adminPhone
 * @returns {boolean}
 */
Studies.insertIfNotThere = function (studyName,
                                     studyLength,
                                     adminName,
                                     adminEmail,
                                     adminPhone) {
    if (!Studies.getByName(studyName)) {
        const insertion = Studies.create(studyName,
            studyLength,
            adminName,
            adminEmail,
            adminPhone);
        Studies.insert(insertion);
        return true
    }
    return false
};