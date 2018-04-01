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
            if (Meteor.isDevelopment) {
                Push.debug = true;
            }


            // From /private/APN_Fittle_KPH_Production_Cert.pem

            Push.Configure({
                apn: {
                    passphrase: "Atigdng04",
                    keyData: Assets.getText("ACTUAL_KEY_GOES_HERE.pem"),
                    certData: Assets.getText("ACTUAL_CERT_GOES_HERE.pem"),
                    production: true

                },
                gcm: {
                    apiKey: "ACTUAL_KEY_GOES_HER",
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
            console.log("ERROR: Could not initialize Push Notifications: " + err.message)
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
