/**
 * Created by krivacic on 6/2/2017.
 */
/**
 * Use this file to define the schema for Badges and its helpers.
 * The schema definition and validation functions are made possible by the packages:
 *
 *
 **/

import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {DateHelper} from '../../helpers';


//NOTE:  These must match the navigation tab strings
export const BADGE_HISTORY = 'history';
export const BADGE_ANALYTICS = 'analytics';
export const BADGE_REPORT = 'report';
export const BADGE_POST = 'posts';
export const BADGE_P2P = 'peer2peer';

/**
 * Create the MongoDB collection.
 * @note The collection is created only if this code is executed on the server.
 * See https://guide.meteor.com/collections.html#mongo-collections for more info.
 * @type {Mongo.Collection}
 */
export const Badges = new Mongo.Collection('badges');

/**
 * Defines all fields of Badges schema.
 *
 * Defining the fields in a dictionary, and then using the dictionary to reference the
 * fields elsewhere aids code management, and allows the IDE to check references to these fields.
 *
 */

const FIELDS = {
    TYPE: "type",               // badge type, see constants below
    SUB_TYPE: "subType",        // used to specify the 'team' in POST and P2P badges
    BADGE_INFO: "info",         // extra info, badge dependent.
    USER_ID: "userId",          // userId the badge is targeted for
    CREATED_AT: "createdAt"
};


/**
 * Defines public fields of Questions collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Badges.publicFields = {
    [FIELDS.TYPE]: 1,
    [FIELDS.SUB_TYPE]: 1,
    [FIELDS.BADGE_INFO]: 1,
    [FIELDS.USER_ID]: 1,
    [FIELDS.CREATED_AT]: 1,
};

/**
 * Defines the Questions schema.
 */
Badges.schema = new SimpleSchema({
    [FIELDS.TYPE]: {
        type: String,
        label: "Badge type",
        optional: false,
        defaultValue: ""
    },

    [FIELDS.SUB_TYPE]: {
        type: String,
        label: "Sub type",
        optional: false,
        defaultValue: ""
    },

    [FIELDS.BADGE_INFO]: {
        type: Object,
        label: "Info",
        optional: false,
        blackbox: true
    },

    [FIELDS.USER_ID]: {
        type: String,
        label: "User ID",
        optional: false
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
Badges.attachSchema(Badges.schema);


/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Questions document.
 * @author L. Nelson
 */
Badges.create = function (userId, badgeType, subType, badgeInfo) {
    const values = {
        [FIELDS.TYPE]: badgeType,
        [FIELDS.SUB_TYPE]: subType,
        [FIELDS.BADGE_INFO]: badgeInfo,
        [FIELDS.USER_ID]: userId,
        [FIELDS.CREATED_AT]: new Date()
    };
    return values;
};

/**
 * Add a badge to the database
 * @param badgeType
 * @param subType
 * @param badgeInfo
 * @param userId
 */
Badges.addBadge = function (userId, badgeType, subType, badgeInfo) {
    console.log('INFO Adding Badge ' + badgeType + ", " + subType + ", " + badgeInfo + ", " + userId);
    let createThis = Badges.create(userId, badgeType, subType, badgeInfo);
    returnId = Badges.insert(createThis);
    return returnId;
};

/**
 * Remove all the badges for a user with the given badgeType & subType
 * @param userId
 * @param badgeType
 * @param subType
 */
Badges.clearBadges = function(userId, badgeType, subType) {
    Badges.remove({[FIELDS.USER_ID]: userId, [FIELDS.TYPE]: badgeType, [FIELDS.SUB_TYPE]: subType});
}

/**
 * create the correct badge notifications for a badge destined for toUserId, except in the POST case
 * @param fromUserId
 * @param toUserId
 * @param badgeType
 * @param badgeSubType
 * @param badgeInfo
 */
Badges.createBadges = function(fromUserId, toUserId, badgeType, badgeSubType, badgeInfo) {
    switch (badgeType) {
        case BADGE_HISTORY:
        case BADGE_ANALYTICS:
        case BADGE_REPORT:
            // add a badge to the indicated user
            Badges.addBadge(toUserId, badgeType, badgeSubType, badgeInfo);
            break;
        case BADGE_POST:
            // must create a badge for each team member
            var members = Meteor.users.find({"profile.team": badgeSubType}).fetch();
            console.log("*** Find members of team " + badgeSubType);
            members.forEach(function (m) {
                // Don't add a badge to yourself
                if (m._id !== fromUserId) {
                    console.log("Add a badge for " + m._id);
                    Badges.addBadge(m._id, badgeType, badgeSubType, badgeInfo);
                }
            });
            break;
        case BADGE_P2P:
            // add a badge to your peer.
            Badges.addBadge(toUserId, badgeType, badgeSubType, badgeInfo);
            break;
    }
    console.log("*** Badges created.")
}
