/**
 * Created by lnelson on 3/7/18.
 */

/**
 * Use this file to define the schema for Cards and its helpers.
 * The schema definition and validation functions are made possible by the packages:
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
export const Cards = new Mongo.Collection('cards');

/**
 * Defines all fields of Log schema.
 *
 * Defining the fields in a dictionary, and then using the dictionary to reference the
 * fields elsewhere aids code management, and allows the IDE to check references to these fields.
 *
 */

const FIELDS = {
    NAME: "name",
    CONTENT_LINK: "contentLink",
    WEEK: "week",
    TAG: "tag",
    VISIBLE: "visible",
    CREATED_AT: "createdAt"
};

/**
 * Defines public fields of Card collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Cards.publicFields = {
    [FIELDS.NAME]: 1,
    [FIELDS.CONTENT_LINK]: 1,
    [FIELDS.WEEK]: 1,
    [FIELDS.TAG]: 1,
    [FIELDS.VISIBLE]: 1
};

/**
 * Defines the Questions schema.
 */
Cards.schema = new SimpleSchema({
    [FIELDS.NAME]: {
        type: String,
        label: "Name of card",
        optional: false,
        max: 100
    },

    [FIELDS.CONTENT_LINK]: {
        type: String,
        label: "Link to Task Content",
        optional: false,
        max: 128,
        denyUpdate: true
    },

    [FIELDS.WEEK]: {
        type: Number,
        label: "Scheduled week for Card",
        optional: true,
        min: 0,
        max: 52
    },

    [FIELDS.TAG]: {
        type: String,
        label: "Tag",
        optional: true,
        max: 100
    },

    [FIELDS.VISIBLE]: {
        type: Boolean,
        label: "Indicates if card can be shown now",
        optional: true
    },

    [FIELDS.CREATED_AT]: {
        type: Date,
        defaultValue: new Date(),
        denyUpdate: true,
    }

});


/**
 * Attaches schema definition to the collection. Now, all mutators called on this collection
 * (insert/update/upsert) will first be validated.
 */
Cards.attachSchema(Cards.schema);


/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Participants document.
 * @author L. Nelson
 */
Cards.create = function (name, contentLink, week, tag, visible) {
    let thisName = name ? name : "No Name";
    let thisContentLink = contentLink ? contentLink : "No Name";
    let thisWeek = week ? week : 0;
    let thisTag = tag ? tag : "";
    let thisVisible = visible ? visible : true;

    const values = {
        [FIELDS.NAME]: thisName,
        [FIELDS.CONTENT_LINK]: contentLink,
        [FIELDS.WEEK]: thisWeek,
        [FIELDS.TAG]: thisTag,
        [FIELDS.VISIBLE]: thisVisible
    };
    return values;
};

