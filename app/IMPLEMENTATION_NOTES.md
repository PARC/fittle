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