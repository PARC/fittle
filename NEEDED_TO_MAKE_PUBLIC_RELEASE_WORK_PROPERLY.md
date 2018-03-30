# Installing Fittle Public

Out of the box, this public release of Fittle almost works. But there are a few things that can't be released publicly that
are required for a fully functioning local operation of Fittle.

Note: 'Local operation' means that the system does its job when run on localhost: i.e., ```meteor run --settings=settings.json```

Prerequisite reading for this document: app/IMPLEMENTATION_NOTES.md

The needed configuration settings are given below.

## Settings Files

Settings files includes app/settings.json and any files used to build a settings.json file
(e.g., app/shell/settings.master.local.txt).

1. Amazon S3 service values
   1.1 See doc/S3_Service_Notes.md
   1.2 Set values for the follow attributes (after creating the appropiate S3 services)
   ```
   "S3_ID": "ACTUAL_ID_GOES_HERE",
   "S3_SECRET":  "ACTUAL_SECRET_GOES_HERE",
   "S3_BUCKET": "ACTUAL_NAME_GOES_HERE",
   "S3_BASEURL": "https://s3-us-west-1.amazonaws.com/ACTUAL_NAME_GOES_HERE/",
   "IMAGE_API_SERVICE": "https://HOSTNAME.herokuapp.com/",
   "IMAGE_API_PREFIX": "api/getImage/",
   "IMAGE_API_TOKEN": "ACTUAL_TOKEN_GOES_HERE",
   ```

2. Private Fittle Values
   ```
   "API_TOKEN": "ACTUAL_TOKEN_GOES_HERE",
   "API_TOKEN_ADMIN": "ACTUAL_TOKEN_GOES_HERE",
   ```

3. Public Fittle Values
   ```
   "BUILTIN_ADMIN_EMAIL": "admin@parc.com",
   "S3_FETCHURL": "https://s3-us-west-1.amazonaws.com/ACTUAL_HOSTNAME_GOES_HERE/",
   "ZENDESK_URL": "https://ACTUAL_URL_GOES_HERE.zendesk.com"
   ```

```

## Mobile Configuration Files

Mobile configuration files includes app/mobile-configuration-*.json and any files used to build these files
(e.g., app/shell/mobile-config-master.txt)

1. Set the basic App Information
```
App.info({
   id: 'com.parc.fittle.ACTUAL_NAME_GOES_HERE',
   name: 'ACTUAL_APP_NAME_GOES_HERE',
   description: 'ACTUAL_DESCRIPTION_GOES_HERE',
   author: 'ACTUAL_NAME_GOES_HEREC',
   email: 'ACTUAL_ADDRESS_GOES_HERE',
   version: "0.2.7"
});

2. Update graphics and icons as appropriate. It is best to keep the actual image files in app/resources.


## Content Files for Proprietary Challenges

Fittle has non-proprietary content that provides examples for Fittle Content generation (see doc/Content_README.md).

If a proprietary content set outside the publ that is not part of the public release is to be used, the following steps are needed:

1. Unzip and copy proprietary Web content into app/public/content.

2. Unzip and copy proprietary 'activities.json'-related (see doc/Content_README.md) files into app/private/content.

3. In the settings.json file

   ```
      "ACTIVITIES_PATH": [
         "ADD_LINK_TO_PROPRIETARY_ACTIVITIES_FILE_FROM_STEP_2_ABOVE/activities.json",
         "activitiesI2.json",
         "content/prechallenge/activitiesPreChallenge.json",
         "content/sampleweek/activities.json"],

   ```

## Enable Coaching agent if applicable

See doc/agent_README.md


## Enable PUSH Notifications

1. Create certificates needed for iOS and Android

2. Edit the Push Notification code to use these certificates: app/server/notifications/pushNotificationWrapper.js

```
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

```

## Once all that works....

1. Meaning that ```meteor run --settings=settings.json``` and lets you navigate with a browser to http://localhost:3000.

2. Update the onboarding file pointed at in app/shell/resetForTesting.sh to include emailAddress you will use for testing.

3. Reset the database by running app/shell/resetForTesting.sh

4. Fittle should now be running for operations as described in app/IMPLEMENTATION_NOTES.md