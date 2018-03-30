/**
 * Use this file to define the schema for Tasks and its helpers.
 * The schema definition and validation functions are made possible by the packages:
 *
 *    (1) aldeed:collection2 (https://atmospherejs.com/aldeed/collection2)
 *    (2) aldeed:simple-schema (https://atmospherejs.com/aldeed/simple-schema)
 *
 **/

import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {getActivityByActivity} from '../activities/activities'


/**
 * Create the MongoDB collection.
 * @note The collection is created only if this code is executed on the server.
 * See https://guide.meteor.com/collections.html#mongo-collections for more info.
 * @type {Mongo.Collection}
 */
export const Tasks = new Mongo.Collection('tasks');


/**
 * Defines all fields of Tasks schema.
 */
const FIELDS = {
    ID: "_id",
    USER_ID: "userId",
    EMAIL: "emailAddress",
    TAG: "tag",
    TITLE: "title",
    DESCRIPTION: "description",
    CONTENT_LINK: "contentLink",
    THUMBNAIL_LINK: "thumbnailLink",
    SCHEDULED_DATE: "scheduledDate",
    CREATED_AT: "createdAt",
    EMAIL_SENT: "emailSent",
    // User answer fields from the reporting screen:
    USER_GOAL_MET: 'goalMet',
    USER_GOAL_DIFFICULTY: 'goalDifficulty',
    USER_GOAL_CONFIDENCE: 'goalConfidence',
    USER_GOAL_KEENNESS: 'goalKeenness',
    USER_GOAL_WORTH_EFFORT: 'goalWorthEffort',
    REPORT_CREATED_AT: 'reportCreatedAt',
    REPORT_UPDATED_AT: 'reportUpdatedAt'
};


/**
 * Defines public fields of Tasks collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Tasks.publicFields = {
    [FIELDS.USER_ID]: 1,
    [FIELDS.EMAIL]: 1,
    [FIELDS.TAG]: 1,
    [FIELDS.TITLE]: 1,
    [FIELDS.DESCRIPTION]: 1,
    [FIELDS.SCHEDULED_DATE]: 1,
    [FIELDS.EMAIL_SENT]: 1,
    [FIELDS.CONTENT_LINK]: 1,
    [FIELDS.THUMBNAIL_LINK]: 1,
    [FIELDS.USER_GOAL_MET]: 1,
    [FIELDS.USER_GOAL_DIFFICULTY]: 1,
    [FIELDS.USER_GOAL_CONFIDENCE]: 1,
    [FIELDS.USER_GOAL_KEENNESS]: 1,
    [FIELDS.USER_GOAL_WORTH_EFFORT]: 1
};


/**
 * Defines the Participants schema.
 */
Tasks.schema = new SimpleSchema({

    [FIELDS.ID]: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },

    [FIELDS.USER_ID]: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: "User ID",
        denyUpdate: true
    },

    [FIELDS.EMAIL]: {
        type: String,
        label: "Email address",
        regEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))$/,
        optional: true,
        max: 100
    },

    [FIELDS.EMAIL_SENT]: {
        type: Boolean,
        label: "Email Sent",
        defaultValue: false,
        optional: true
    },

    [FIELDS.TITLE]: {
        type: String,
        label: "Task title",
        optional: false,
        max: 128,
        denyUpdate: true
    },


    [FIELDS.TAG]: {
        type: String,
        label: "Task tag",
        optional: true,
        max: 128
    },

    [FIELDS.DESCRIPTION]: {
        type: String,
        label: "Task description",
        optional: false,
        max: 256,
        denyUpdate: true
    },

    [FIELDS.SCHEDULED_DATE]: {
        type: Number,
        label: "Scheduled day",
        optional: false,
        min: 0,
        max: 365,
        denyUpdate: true
    },

    [FIELDS.CONTENT_LINK]: {
        type: String,
        label: "Link to Task Content",
        optional: true,
        max: 128,
        denyUpdate: true
    },

    [FIELDS.THUMBNAIL_LINK]: {
        type: String,
        label: "Link to Task Content",
        optional: true,
        max: 128,
        denyUpdate: true
    },

    [FIELDS.USER_GOAL_MET]: {
        type: Boolean,
        label: "Goal met",
        denyUpdate: false,
        optional: true,
        defaultValue: undefined
    },


    [FIELDS.USER_GOAL_DIFFICULTY]: {
        type: Number,
        label: "Goal Difficulty",
        min: 1,
        max: 5,
        denyUpdate: false,
        optional: true,
        defaultValue: undefined
    },

    [FIELDS.USER_GOAL_CONFIDENCE]: {
        type: Number,
        label: "User Confidence",
        min: 1,
        max: 5,
        denyUpdate: false,
        optional: true,
        defaultValue: undefined
    },

    [FIELDS.USER_GOAL_KEENNESS]: {
        type: Number,
        label: "Goal Keenness",
        min: 1,
        max: 5,
        denyUpdate: false,
        optional: true,
        defaultValue: undefined
    },

    [FIELDS.USER_GOAL_WORTH_EFFORT]: {
        type: Number,
        label: "User Goal Worth Effort",
        min: 1,
        max: 5,
        denyUpdate: false,
        optional: true,
        defaultValue: undefined
    },

    [FIELDS.REPORT_CREATED_AT]: {
        type: Date,
        label: "Report create at",
        defaultValue: undefined,
        optional: true
    },

    [FIELDS.REPORT_UPDATED_AT]: {
        type: Date,
        label: "Report updated at",
        defaultValue: undefined,
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
Tasks.attachSchema(Tasks.schema);


/**
 * Hook called before updating a <code>Tasks</code> document.
 *
 * @param {?} id -- I don't know what this parameter is.
 * @param {User} doc -- A <em>copy</em> of the <code>Tasks</code> document that will be updated.
 * @param {Object} modifier -- Dictionary with the values to update.
 * @requires 'matb33:collection-hooks'
 */
Tasks.before.update(function (userId, task, fieldNames, modifier, options) {
    // User is creating a new report on an existing Task
    if (task[FIELDS.REPORT_CREATED_AT] === undefined || task[FIELDS.REPORT_CREATED_AT] === null) {
        const currentTimestamp = new Date();
        modifier.$set.reportCreatedAt = currentTimestamp;
        modifier.$set.reportUpdatedAt = currentTimestamp;
    }
    // User is updating an existing report
    else if (task[FIELDS.REPORT_CREATED_AT] !== undefined && task[FIELDS.REPORT_CREATED_AT] !== null) {
        modifier.$set.reportUpdatedAt = new Date();
    }

});


/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Participants document.
 * @author M. Silva
 */
Tasks.create = function (userId, taskTitle, scheduledDate, emailAddress, taskActivity) {
    let activity = getActivityByActivity(taskActivity);

    let contentLink = "";
    let thumbnailLink = "";
    let description = taskTitle && taskTitle.length > 0 ? taskTitle : "";
    let title = "";
    if (activity) {
        thumbnailLink = activity.thumbnail ? activity.thumbnail : "";
        contentLink = activity.content ? activity.content : taskActivity;
        title = activity.title ? activity.title : "";
        // TODO: Setting the precise descriptions will most likely need to be adjusted for each study
        description = description.length > 0 ? activity.description + ": " + description : activity.description
    } else {
        if (taskActivity) description = taskActivity
    }
    if (!title) {
        title = taskTitle
    }
    if (!title) {
        title = taskActivity
    }
    const values = {
        [FIELDS.USER_ID]: userId,
        [FIELDS.EMAIL]: emailAddress,
        [FIELDS.TITLE]: title,
        [FIELDS.DESCRIPTION]: description,
        [FIELDS.CONTENT_LINK]: contentLink,
        [FIELDS.THUMBNAIL_LINK]: thumbnailLink,
        [FIELDS.SCHEDULED_DATE]: scheduledDate,
        [FIELDS.USER_GOAL_MET]: undefined,
        [FIELDS.USER_GOAL_DIFFICULTY]: undefined,
        [FIELDS.USER_GOAL_CONFIDENCE]: undefined,
        [FIELDS.USER_GOAL_KEENNESS]: undefined,
        [FIELDS.USER_GOAL_WORTH_EFFORT]: undefined
    };
    return values;
};


/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Participants document.
 * @author M. Silva
 */
Tasks.clone = function (task) {
    const values = {
        [FIELDS.USER_ID]: task[FIELDS.USER_ID],
        [FIELDS.EMAIL]: task[FIELDS.EMAIL],
        [FIELDS.TITLE]: task[FIELDS.TITLE],
        [FIELDS.DESCRIPTION]: task[FIELDS.DESCRIPTION],
        [FIELDS.CONTENT_LINK]: task[FIELDS.CONTENT_LINK],
        [FIELDS.THUMBNAIL_LINK]: task[FIELDS.THUMBNAIL_LINK],
        [FIELDS.SCHEDULED_DATE]: task[FIELDS.SCHEDULED_DATE],
        [FIELDS.USER_GOAL_MET]: task[FIELDS.USER_GOAL_MET],
        [FIELDS.USER_GOAL_DIFFICULTY]: task[FIELDS.USER_GOAL_DIFFICULTY],
        [FIELDS.USER_GOAL_CONFIDENCE]: task[FIELDS.USER_GOAL_CONFIDENCE],
        [FIELDS.USER_GOAL_KEENNESS]: task[FIELDS.USER_GOAL_KEENNESS],
        [FIELDS.USER_GOAL_WORTH_EFFORT]: task[FIELDS.USER_GOAL_WORTH_EFFORT],
        [FIELDS.REPORT_CREATED_AT]: task[FIELDS.REPORT_CREATED_AT],
        [FIELDS.REPORT_UPDATED_AT]: task[FIELDS.REPORT_UPDATED_AT],
        [FIELDS.CREATED_AT]: task[FIELDS.CREATED_AT]
    };
    return values;
};


/**
 * Finds the <code>Task</code> with the given id.
 * @return {Task} iff found; null otherwise.
 */
Tasks.findById = function (id) {
    return Tasks.findOne({[FIELDS.ID]: id});
};

/**
 * Find longest consecutive days of reporting for a given set of tasks
 * @param taskList
 * @returns {number}
 */
Tasks.getTaskReportingStreak = function (taskList){
    let longest = 0;
    let current = 0;
    let onStreak = false;
    let previousDay = -1;
    for (let ix = 0; ix < taskList.length; ix++) {
        let task = taskList[ix];

        if (onStreak && typeof task.goalMet !== 'undefined') {
            if (task.scheduledDate !== previousDay) {
                // Only increment if we have in fact moved on to a new day (for when there are multiple activities in a day)
                current++;
            }
        }
        if (!onStreak && typeof task.goalMet !== 'undefined') {
            onStreak = true;
            current = 1;
        }
        if (onStreak && typeof task.goalMet === 'undefined') {
            onStreak = false;
            longest = current > longest ? current : longest;
            current = 0;
        }
        previousDay = task.scheduledDate;
    }
    longest = current > longest ? current : longest;
    return longest
};


/**
 * Find longest consecutive days of reporting for a given set of tasks
 * @param taskList
 * @returns {number}
 */
Tasks.getStartDayForTaskReportingStreak = function (taskList){
    let longest = 0;
    let current = 0;
    let onStreak = false;
    let previousDay = -1;
    let currentStartDay = -1;
    let longestStartDay = -1;
    for (let ix = 0; ix < taskList.length; ix++) {
        let task = taskList[ix];
        if (onStreak && typeof task.goalMet !== 'undefined') {
            if (task.scheduledDate !== previousDay) {
                // Only increment if we have in fact moved on to a new day (for when there are multiple activities in a day)
                current++;
            }
        }
        if (!onStreak && typeof task.goalMet !== 'undefined') {
            onStreak = true;
            currentStartDay = task.scheduledDate;
            current = 1;
        }
        if (onStreak && typeof task.goalMet === 'undefined') {
            onStreak = false;
            if (current >= longest) {
                longest = current;
                if (currentStartDay < 0) currentStartDay = task.scheduledDate;
                longestStartDay = currentStartDay;
            }
            current = 0;
        }
        previousDay = task.scheduledDate;
    }
    if (onStreak) {
        if (current >= longest) {
            longest = current;
            if (currentStartDay < 0) currentStartDay = task.scheduledDate;
            longestStartDay = currentStartDay;
        }

    }
    return longestStartDay
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
