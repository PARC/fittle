# Implementation Notes

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

mongo ds133710-a0.mlab.com:33710/parccoach-prod -u i2ameteorclient -p vKy7G6#t07EI1MIX

mongo shell command: db.activities.remove({})