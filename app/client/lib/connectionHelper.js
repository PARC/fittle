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
