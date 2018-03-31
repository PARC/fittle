# Implementation Notes

## Typical Fittle Development Cycle

1. Start from the Development branch and create a feature git branch, e.g., feature_new_example_challenge.

2. Make changes to code and database and JSON structures (see doc/How_To_Assemble_A_Fittle_Challenge.md).

3. If new activities (e.g., activities.json) are created, these are imported into the mongo database when the Meteor server starts.
If you want to remove activities, this needs to be done manually via the mongo command shell (see below).

4. Update the settings and configure files in app/shell as needed

   4.1 e.g., app/shell/setForLocal.sh

   4.2 e.g., app/shell/example.resetForTesting.sh

5. Run and test locally using a terminal window (e.g., meteor run --settings=settings.json). Note you MUST specify the settings file in this way for Fittle,
unlike whatever you may have read in other Meteor documentation.  Look at the server logs sent to this terminal window. Use a browser as the Meteor client.
Commonly it is convenient to use Safari for the Fittle Admin interface (i.e., navigate to localhost:3000 and login as admin@parc.com using the password kept
in settings.json). Use Chrome as the client interface (i.e., navigate to localhost:3000 and login as whatever@example.com using the password kept in the Participant
whitelist (e.g., app/data/json/onboardingExample.json).

6. Use the Admin interface (app/data/How to Use Fittle Admin Interface.pdf) to start the test Participant on a challenge and update their challenge day as needed for testing.

7. Stackoverflow (www.stackoverflow.com) is your friend. Cut and paste error messages into their and you usually find your answer for what's wrong.

8. When everything works, do a final git commit on the feature branch.

9. Now update the settings and configure files in app/shell as needed for android or ios device testing (Android is always easier).

   9.1 We use galaxy and mlab for hosting (galaxy.com and mlab.com).  You will need to set up your own instances on these hosting sites.

   9.1 e.g., app/shell/setForProduction.sh

   9.2 e.g., app/shell/galaxy.resetForTesting.sh

10. Deploy the current Meteor system to a remote host e.g., app/shell/deploy_prod.sh).
```
NOTE!! You will need to update all these app/shell scripts for your particular galaxy host and mlab database.
```

11. Test on a device, e.g., Android

    11.1 meteor run android-device --setting=settings.json --mobile-server=https://whatever.meteorapp.com

    11.2 Use browser to run Fittle Admin interface on https://whatever.meteorapp.com

12. Fix problems and commit to the feature branch.

13. Merge the feature branch with development branch (and occasionally with master branch).

14. Repeat

## Usernames and Email Addresses

Currently the system uses emailAddresses for usernames.

If we wish to enforce or not enforce email syntax the following edits need to be undone or made, respectively:

* Remove the regEx requirements from app/lib/api/tasks/tasks.js
* Remove the regEx requirements from app/lib/api/participants/participants.js
* Remove the validation of email syntax in app/client/react/login-page.jsx (validateEmail method)

## Manual Database Access

### Fittle Silver production

This is used for deleting the activities db, so they may be recreated on re-deployment when the activities
have changed.

mongo HOSTNAME.mlab.com:33710/ACTUAL_HOSTNAME_GOES_HERE -u YOUR_DBUSER_HERE -p <put real pw here>

mongo shell command: db.activities.remove({})


## Known Issue - bcrypt Node package

When starting the Fittle Meteor app, Meteor complains about something that is not a problem. This message can be
ignored.  Note also, that updating to Meteor 1.6.1+ will require work.  You'll need to update all packages
and make sure that the Meteor Cordova linkage does not go out of sync (e.g., adding depreactions to
packages in use). This is non-trivial work.

```
$ meteor run --settings=settings.json
[[[[[ ~/Desktop/2018/FittlePublic/fittleTest/fittle/app ]]]]]

=> Started proxy.
=> Meteor 1.6.1 is available. Update this project with 'meteor update'.
=> Started MongoDB.
W20180331-15:26:33.008(-7)? (STDERR) Note: you are using a pure-JavaScript implementation of bcrypt.
W20180331-15:26:33.029(-7)? (STDERR) While this implementation will work correctly, it is known to be
W20180331-15:26:33.030(-7)? (STDERR) approximately three times slower than the native implementation.
W20180331-15:26:33.030(-7)? (STDERR) In order to use the native implementation instead, run
W20180331-15:26:33.030(-7)? (STDERR)
W20180331-15:26:33.030(-7)? (STDERR)   meteor npm install --save bcrypt
W20180331-15:26:33.030(-7)? (STDERR)
W20180331-15:26:33.031(-7)? (STDERR) in the root directory of your application.
W20180331-15:26:33.443(-7)? (STDERR) WARNING: npm peer requirements not installed:
W20180331-15:26:33.444(-7)? (STDERR)  - react@15.6.2 installed, react@0.14.x needed
W20180331-15:26:33.444(-7)? (STDERR)  - react-dom@15.6.2 installed, react-dom@0.14.x needed
W20180331-15:26:33.444(-7)? (STDERR)  - react-addons-transition-group@15.6.2 installed, react-addons-transition-group@0.14.x needed
W20180331-15:26:33.444(-7)? (STDERR)  - react-addons-css-transition-group@15.6.2 installed, react-addons-css-transition-group@0.14.x needed
W20180331-15:26:33.444(-7)? (STDERR)  - react-addons-linked-state-mixin@15.6.2 installed, react-addons-linked-state-mixin@0.14.x needed
W20180331-15:26:33.444(-7)? (STDERR)  - react-addons-create-fragment@15.6.2 installed, react-addons-create-fragment@0.14.x needed
W20180331-15:26:33.445(-7)? (STDERR)  - react-addons-update@15.6.2 installed, react-addons-update@0.14.x needed
W20180331-15:26:33.445(-7)? (STDERR)  - react-addons-pure-render-mixin@15.6.2 installed, react-addons-pure-render-mixin@0.14.x needed
W20180331-15:26:33.445(-7)? (STDERR)  - react-addons-test-utils@15.6.2 installed, react-addons-test-utils@0.14.x needed
W20180331-15:26:33.445(-7)? (STDERR)  - react-addons-perf@15.4.2 installed, react-addons-perf@0.14.x needed
W20180331-15:26:33.445(-7)? (STDERR)
W20180331-15:26:33.446(-7)? (STDERR) Read more about installing npm peer dependencies:
W20180331-15:26:33.446(-7)? (STDERR)   http://guide.meteor.com/using-packages.html#peer-npm-dependencies
W20180331-15:26:33.446(-7)? (STDERR)
W20180331-15:26:33.541(-7)? (STDERR) Warning: ReactTestUtils has been moved to react-dom/test-utils. Update references to remove this warning.
I20180331-15:26:33.688(-7)? INFO email_helper: Meteor.settings.private.CURRENT_LOCATION=LOCAL
I20180331-15:26:33.688(-7)? INFO email_helper: Meteor.settings.private.SEND_EMAIL_REMINDERS=false
I20180331-15:26:33.689(-7)? INFO email_helper: Meteor.settings.private.COACH_LOCATIONS=
I20180331-15:26:33.689(-7)? { BASE_URL: 'localhost',
I20180331-15:26:33.689(-7)?   BASE_PORT: 3001,
I20180331-15:26:33.689(-7)?   BASE_EMAIL_URL: 'https://ACTUAL_HOSTNAME_GOES_HERE.meteorapp.com',
I20180331-15:26:33.689(-7)?   FROM_EMAIL_ADDRESS: 'ACTUAL_ADDRESS_GOES_HERE',
I20180331-15:26:33.690(-7)?   FROM_EMAIL_PS: 'ACTUAL_PS_GOES_HERE' }
I20180331-15:26:34.811(-7)? Server starting for ACTUAL_VALUE_HERE
I20180331-15:26:34.976(-7)? INFO Initialize activities with activitiesI2.json OK
I20180331-15:26:34.983(-7)? INFO Initialize activities with content/prechallenge/activitiesPreChallenge.json OK
I20180331-15:26:34.994(-7)? INFO Initialize activities with content/sampleweek/activities.json OK
I20180331-15:26:35.076(-7)? INFO Initialize agents with agents.json OK
I20180331-15:26:35.077(-7)? Server started
I20180331-15:26:35.077(-7)? Checking for administrator account...
I20180331-15:26:35.084(-7)? Creating admin account...
I20180331-15:26:35.317(-7)? isSystemAdminAccountBeingCreated: true
I20180331-15:26:35.319(-7)? isSystemAdminAccountBeingCreated: true
I20180331-15:26:35.319(-7)? Created new user without assigning to a security group.
I20180331-15:26:35.327(-7)? Created admin with id: yMi3gcH4mJmjv8CNQ
I20180331-15:26:35.332(-7)? Done creating administrator account.
I20180331-15:26:35.333(-7)? Initializing Push Notifications
I20180331-15:26:35.333(-7)? INFO initialize Push Notifications
I20180331-15:26:35.333(-7)? DEBUG initializePushNotifications Certificates
I20180331-15:26:35.457(-7)? ERROR in initializing PUSH NOTIFICATIONS: Unknown asset: APN_Fittle_ACTUAL_VALUE_HERE_Production_Key.pem
=> Started your app.

=> App running at: http://localhost:3000/
I20180331-15:27:35.467(-7)? *** Check schedule emails

```