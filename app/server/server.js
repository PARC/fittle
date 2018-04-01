/**
 * Initialize server
 */
import {ServerHelpers} from './server-helpers';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import {Notifiers} from './notifications/notifiers';
import {Configuration} from './studyConfiguration';
import {ServerRoutesHelpers} from './service_api/server.server_routes_helpers';
import EmailHelper from './emailer/email_api';

Meteor.startup(function () {
    //ServerHelpers.legacyStartUp();  // Run old code created during earlier prototyping

    ServerHelpers.startUp();
    createBuiltInUsers();
    // TODO Remove this debug guard when done: When testing on localhost, do not enable Notifications

    //if ( process.env.ROOT_URL !== 'http://localhost:3000/') {
    Notifiers.initializePushNotifications();
    var notifier = new Notifiers();
    //}

    // Initialize server routes
    ServerRoutesHelpers.initializeServerRoutes();
    EmailHelper.startEmailer();
});


// TODO (20Dec2016): Change the email.
const BUILTIN_ADMIN_ACCOUNT_INFO = {
    email: Meteor.settings.private.BUILTIN_ADMIN_EMAIL,
    'password': Meteor.settings.private.BUILTIN_ADMIN_PASSWORD
};


/**
 * Creates built-in user accounts at server startup if the accounts are missing.
 *
 * TODO (31July2016): Move into server-helpers.js if that's a more appropriate location.
 *
 * @requires 'meteor/accounts-base'
 * @requires 'meteor/meteor'
 */
export function createBuiltInUsers() {

    console.log("Checking for administrator account...");

    if (Accounts.findUserByEmail(BUILTIN_ADMIN_ACCOUNT_INFO.email)) {
        console.log("Administrator account already exists.");
        return;
    }

    console.log("Creating admin account...");
    const userId = Accounts.createUser(BUILTIN_ADMIN_ACCOUNT_INFO);
    if (userId === null || userId === undefined) {
        console.log("ERROR creating admin account.");
        throw new Error("Problem occurred while creating administrator account. Cannot continue start-up.");
    }
    console.log("Created admin with id: " + userId);

    // Assign to admin role
    Roles.addUsersToRoles(userId, 'admin', Roles.GLOBAL_GROUP);

    console.log("Done creating administrator account.");
}

Meteor.onConnection(function (connection) {
    console.log("INFO onConnection: " + connection.clientAddress + ':' + connection.httpHeaders['user-agent']);
});