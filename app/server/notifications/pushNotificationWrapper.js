/*
 * A singleton that wraps Raix:Push notification library
 * to enable looser coupling of the 3rd party library
 */

export class PushNotificationWrapper {

    /**
     * @return {string}
     */
    static get DEFAULT_SOUND() { return 'airhorn.caf'; }

    /**
     * @return {string}
     */
    static get DEFAULT_FROM() { return 'PARC Coach'; }

    /** 
     * This is basically for convenience, by default
     * this module doesn't couple with meteor
     */
    static get PUBLIC_API() {
        return {
            'initializePushNotifications' : PushNotificationWrapper.initializePushNotifications,
            'notifyAllUsers' : PushNotificationWrapper.notifyAllUsers,
            'notifySingleUser' : PushNotificationWrapper.notifySingleUser
        };
    }

    static initializePushNotifications() {
        try {
            console.log('INFO initialize Push Notifications');
            //if (Meteor.isDevelopment) {
            Push.debug = true;
            //}

            console.log("DEBUG initializePushNotifications Certificates");
            console.log("Key=" + Assets.getText("APN_Fittle_ACTUAL_VALUE_HERE_Production_Key.pem"));
            console.log("Cert=" + Assets.getText("APN_Fittle_ACTUAL_VALUE_HERE_Production_Cert.pem"));
            // From /private/APN_Fittle_ACTUAL_VALUE_HERE_Production_Cert.pem

            Push.Configure({
                apn: {
                    passphrase: "ACTUAL_PW_GOES_HERE",
                    keyData: Assets.getText("APN_Fittle_ACTUAL_VALUE_HERE_Production_Key.pem"),
                    certData: Assets.getText("APN_Fittle_ACTUAL_VALUE_HERE_Production_Cert.pem"),
                    production: true

                },
                gcm: {
                    apiKey: "ACTUAL_KEY_GOES_HERE",
                    projectNumber: 666
                },
                production: true
            });

            //Deny all users from sending push notifications from client
            Push.deny({
                send: function (userId, notification) {
                    return true;
                }
            });
        } catch (err) {
            console.log("ERROR in initializing PUSH NOTIFICATIONS: " + err.message)
        }
    }

    static notifyAllUsers(text, title, badge = 1,
                          from = PushNotificationWrapper.DEFAULT_FROM, 
                          sound = PushNotificationWrapper.DEFAULT_SOUND) {
        Push.send({
            from: from,
            title: title,
            text: text,
            badge: badge,
            sound: sound,
            payload: {
                title: title,
                text: text,
                //historyId: result
            },
            query: {
                //send to all users since query is missing
            }
        });
    }

    static notifySingleUser(text, title, userId, badge = 1,
                            from = PushNotificationWrapper.DEFAULT_FROM, 
                            sound = PushNotificationWrapper.DEFAULT_SOUND) {
        console.log('INFO Pushing notification to ' + userId);
        Push.send({
            from: from,
            title: title,
            text: text,
            badge: badge,
            sound: sound,
            payload: {
                title: title,
                //historyId: result
            },
            query: {
                userId: userId //this sends to a specific Meteor.user()._id
            }
        });
    }
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
