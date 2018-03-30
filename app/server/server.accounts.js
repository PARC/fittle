/**
 * Created by lnelson on 3/30/16.
 */
import {Accounts} from 'meteor/accounts-base';

/**
 * Provide default user profiling.
 * IMPORTANT!!! :: https://guide.meteor.com/accounts.html#dont-use-profile
 */
// Accounts.onCreateUser(function (options, user) {
//
//    console.log("Accounts.onCreateUser()");
//
// 	// When creating a new users in the database, place the email
// 	// field in something a little more accessible. Hacky and the hacktones,
//     // but I'm fine with that for now. (better solution would probably
//     // be to add a custom helper to the Users collection.)
//     user.primaryEmail = user.emails[0].address;
//
//
// 	// As of 07 July 2016, accounts are created using an email address, not a username.
//     // When an acocunt is created, the email address is stored in an User.emails array
//     // created by the Meteor accounts-ui package. This is no problem.
//     // (You can see an example of theMeteor.Users collection at
//     // https://guide.meteor.com/accounts.html#meteor-users-collection.)
//     //
//     // However, a lot of code was already authored retrieving a username (rather than
//     // email address) from the User collection (e.g,. User.username). Rather than actually
//     // refactor everything to replace User.username calls with something for accessing
//     // the email address (as there is no "username"), we instead copy the user's email
//     // address into a username field. This quick fix allows the old code (with calls to
//     // User.username) to work, while maintaining the correct account creation process.
//     //
//     // This is something of a hack, though it's probably not the worst ever. The better
//     // approach is to simply do all the refactoring. But, there are no automated tests
//     // for the code that would be affected, so, again, we do this.  (M.Silva, 07July2016)
//     user.username = user.primaryEmail;
//
//
//     // Temporary solution (05July2016) that bases admin membership on the user's email address.
//     // The code for deciding who is and who is not an admin should exist only on the server,
//     // never on the client.
//     const regex = /.+@parc-admin\.com$/;
//     const isAdmin = regex.test(user.primaryEmail);
//     user.isAdmin = isAdmin;
//
//
//
//     /** IMPORTANT!!! :: https://guide.meteor.com/accounts.html#dont-use-profile */
//     // Use provided profile in options, or create an empty object
//     user.profile = options.profile || {};
//     // Initialize the newly created user object
//     user.profile.teams = ['Lobby'];
//     user.profile.points = 0;
//     // Returns the user object
//     return user;
// });
//
//
// Accounts.validateNewUser(function(user){
//    console.log("Accounts.validateNewUser()");
// });


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
