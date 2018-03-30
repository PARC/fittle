/**
 * Server-side code used for new user registration.
 */


import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Participants} from '../../../../api/participants/participants';
import {AccountRoles} from '../../../../api/accounts/accounts';
import {TasksHelpers} from '../../../../api/tasks/tasks.helpers';

/**
 * Custom code used for new user registration. Designed as static methods to be used by the Meteor Accounts
 * package. Doing this, rather than creating entirely new login code, for quicker dev and to maintain
 * UI reactivity.
 *
 * @requires meteor/accounts-base
 * @requires meteor/meteor
 */
export class AccountRegistration {
    /** @throws {Meteor.Error} with <code>reason</code> field set if registration is not allowed. */
    static confirmRegistrationIsAllowed(emailAddress) {
        if (AccountRegistration.isSystemAdminAccountBeingCreated(emailAddress) === true) {
            return;
        }

        AccountRegistration.confirmEmailAddressIsAssociatedWithKnownParticipant(emailAddress);
        AccountRegistration.confirmAccountDoesNotExistForEmailAddress(emailAddress);
    }

    /** @return {boolean} */
    static isSystemAdminAccountBeingCreated(emailAddress) {
        // TODO (31 July 2016): Magic strings are bad. Should instead use of an imported value.
        const expectedDefaultAdminEmailAddress = "admin@parc.com";
        const result = (emailAddress === expectedDefaultAdminEmailAddress);
        console.log("isSystemAdminAccountBeingCreated: " + result);
        return result;
    }

    /** @throws {Meteor.Error} with <code>reason</code> field set. */
    static confirmEmailAddressIsAssociatedWithKnownParticipant(emailAddress) {
        const participant = Participants.findByEmailAddress(emailAddress);
        if (participant === null || participant === undefined) {
            throw AccountRegistration.createError("server.registration.unknown", "Unknown participant", "Unrecognized email address");
        }
    }

    /** @throws {Meteor.Error} with <code>reason</code> field set. */
    static confirmAccountDoesNotExistForEmailAddress(emailAddress) {
        const existingAccount = Accounts.findUserByEmail(emailAddress);
        if (existingAccount !== null && existingAccount !== undefined) {
            throw AccountRegistration.createError("server.registration.accountexists", "Account already exists", "An account already exists for this email");
        }
    }

    /**
     * DEPRECATED FOR I2 STUDY
     * Assign the newly created user tasks for the entire challenge.
    static assignTasksToParticipant(email, userId) {
        const goalText = Participants.findGoalForUser(email);
        const goalContent = Participants.findGoalContentLinkForParticipant(email);
        TasksHelpers.assignOneTaskForConsecutiveDays(userId, goalText, goalContent, email);
    }
    */

    /**
     * If there are any tasks pre-defined for this Participant, then assign them
     * @param email
     */
    static assignPredefinedTasksToParticipant(email, userId) {
        function showFeedback(result) {
            console.log('assignPredefinedTasksToParticipant result:' + result)
        }

        Meteor.call('assignPredefinedTasksToParticipant', email, userId, showFeedback);
    }

    /** Calls appropriate helpers to generate a <code>Message</code> documents for the newly created user. */
    static assignMessagesToParticipant(email) {
        function showFeedback(result) {
            console.log('assignMessagesToParticipant result:' + result)
        }

        Meteor.call('pushScheduledMessagesForParticipant', email, showFeedback);
    }

    /**
     * Helper for creating {Meteor.Error} objects in expected format.
     * @return {Meteor.Error}
     * TODO (28July2016): Refactor to more appropriate, global location.
     */
    static createError(errorCode, msgForDeveloper, msgForUser) {
        return new Meteor.Error(errorCode, msgForUser, msgForDeveloper);
    }

    /** Performs meteor/accounts-base specific work. */
    static storeEmailAddress(user) {
        // When creating a new users in the database, place the email
        // field in something a little more accessible. Hacky and the hacktones,
        // but I'm fine with that for now. (better solution would probably
        // be to add a custom helper to the Users collection.)
        user.primaryEmail = user.emails[0].address;


        // As of 07 July 2016, accounts are created using an email address, not a username.
        // When an acocunt is created, the email address is stored in an User.emails array
        // created by the Meteor accounts-ui package. This is no problem.
        // (You can see an example of theMeteor.Users collection at
        // https://guide.meteor.com/accounts.html#meteor-users-collection.)
        //
        // However, a lot of code was already authored retrieving a username (rather than
        // email address) from the User collection (e.g,. User.username). Rather than actually
        // refactor everything to replace User.username calls with something for accessing
        // the email address (as there is no "username"), we instead copy the user's email
        // address into a username field. This quick fix allows the old code (with calls to
        // User.username) to work, while maintaining the correct account creation process.
        //
        // This is something of a hack, though it's probably not the worst ever. The better
        // approach is to simply do all the refactoring. But, there are no automated tests
        // for the code that would be affected, so, again, we do this.  (M.Silva, 07July2016)
        user.username = user.primaryEmail;
    }


    /**
     * Provide default user profiling - but ONLY for timezone
     * TODO: Consider moving timezeone to Participants collection as a preferences field
     * IMPORTANT!!! :: https://guide.meteor.com/accounts.html#dont-use-profile
     */
    static setDefaultTimezone(user) {
        let d = new Date();
        let tzoffset = -d.getTimezoneOffset().toString();
        user.profile = {timezone: tzoffset};
    }

}


/**
 * Customize user account creation.
 * @throws <code>Meter.Error</code> if problem occurs during setup.
 * @return user object iff creation successful.
 */
Accounts.onCreateUser((options, user) => {
    AccountRegistration.storeEmailAddress(user);
    if (!user.profile || !user.profile.timezone) {
        AccountRegistration.setDefaultTimezone(user);
    }
    return user;
});


/**
 * Sets restrictions on new account creation.
 * @throws <code>Meter.Error</code> with set <code>reason</code> if creation is not allowed.
 * @return {boolean} <code>true</code> iff creation successful.
 */
Accounts.validateNewUser((user) => {
    // Throw exception if problem.
    AccountRegistration.confirmRegistrationIsAllowed(user.primaryEmail);
    return true;
});


/**
 * Hook called after inserting a new <code>User</code> document to assign that user to the appropriate
 * permissions role. The role set here dictates which version of the client app--participant or study administrator--
 * the user will see.
 *
 * TODO (01Aug2016): Much of the method body can be refactored into a single function in <code>AccountRegistration</code>.
 *
 * @param {?} id -- I don't know what this parameter is.
 * @param {User} doc -- New document (that is, the User) being inserted.
 * @requires 'matb33:collection-hooks'
 */
Meteor.users.after.insert(function (id, doc) {

    const email = doc.primaryEmail;
    const userId = doc._id;

    // Check the user is not an existing administrator
    if (AccountRegistration.isSystemAdminAccountBeingCreated(email)) {
        console.log("Created new user without assigning to a security group.");
        return;
    }

    console.log("*** get the tz offset for " + email +
            JSON.stringify(Meteor.users.findOne(userId))
    );
    // Assign user to appropriate role
    Roles.addUsersToRoles(userId, AccountRoles.participant, Roles.GLOBAL_GROUP);

    // DEPRECATED FOR I2 STUDY
    //AccountRegistration.assignTasksToParticipant(email, userId);
    AccountRegistration.assignPredefinedTasksToParticipant(email, userId);
    AccountRegistration.assignMessagesToParticipant(email);

    // Set a Participant's Study UTC Start Date at the point of user creation, modulo the most recent midnight
    Participants.setStudyStartUTC(email)
});

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





