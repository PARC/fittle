/**
 * Created by lnelson on 9/9/16.
 */
/**
 * Use this file to define the collection and schema for Activities, and Activities helpers.
 **/

import {Meteor} from 'meteor/meteor';

export const Activities = new Meteor.Collection('activities');

/**
 * Find a content link for an anctivity. Since the call would be async on clients, restrict this method to the server
 * @param activity
 */
export function getActivityByActivity(activity) {
    if (Meteor.isServer) {
        var activity = Activities.findOne({activity: activity});
        if (activity)
            return activity
    }
    return null
}

/**
 * Find a content link for an anctivity. Since the call would be async on clients, restrict this method to the server
 * @param activity
 */
export function getContentByActivity(activity) {
    if (Meteor.isServer) {
        var activity = Activities.findOne({activity: activity});
        if (activity)
            return activity.content
    }
    return null
}

/**
 * Find a thumbnail link for an anctivity. Since the call would be async on clients, restrict this method to the server
 * @param activity
 */
export function getThumbnailByActivity(activity) {
    if (Meteor.isServer) {
        var activity = Activities.findOne({activity: activity});
        if (activity)
            return activity.thumbnail
    }
    return null
}

/**
 * Find a thumbnail link for an anctivity. Since the call would be async on clients, restrict this method to the server
 * @param activity
 */
export function getTitleByActivity(activity) {
    if (Meteor.isServer) {
        var activity = Activities.findOne({activity: activity});
        if (activity)
            return activity.title
    }
    return null
}

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
