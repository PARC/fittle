/**
 * Created by lnelson on 10/25/16.
 */
import {Meteor} from 'meteor/meteor'
import {ClientNavigationHelper} from '/lib/startup/client/routes';

export const FAILED_CONNECTION = 'failed';

/**
 * Module exports
 * @type {{checkConection: checkConnection}}
 */
export const ConnectionHelpers = {
    isConnected: isConnected,
    isOffline: isOffline,
    isWaiting: isWaiting,
    isFailed: isFailed,
    FAILED_CONNECTION: FAILED_CONNECTION
};

export function isConnected() {
    return Meteor.status().status === "connected";
};

export function isOffline() {
    return Meteor.status().status === "offline";
};

export function isWaiting() {
    return Meteor.status().status === "waiting";
};

export function isFailed() {
    return Meteor.status().status === "failed"
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
