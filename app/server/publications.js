import {Participants} from '/lib/api/participants/participants';
import {Scheduledmessages} from '/lib/api/scheduledmessages/scheduledmessages';
import {Questions} from '/lib/api/questions/questions';
import {Tasks} from '/lib/api/tasks/tasks';
import {ServerHelpers} from '/server/server-helpers.js';
import {Activities} from '/lib/api/activities/activities';
import {Badges} from '/lib/api/badges/badges';
import {Logs} from '/lib/api/logs/logs';


//======================================================================================================================
// Shared publications -- Data from these subscriptions is available to admin and non-admin users. Use with caution.
//======================================================================================================================
// This code only runs on the server

Meteor.publish("messages", function () {
    return Messages.find();
});

Meteor.publish("activities", function () {
    return Activities.find();
});

Meteor.publish("teams", function () {
    return Teams.find();
});

Meteor.publish("logs", function () {
    return Logs.find();
});

Meteor.publish('emojis', function() {
    // Here you can choose to publish a subset of all emojis
    return Emojis.find();
});

/**
 * Publication for Tasks collection. Defines what Tasks documents should be made available to the logged-in
 * user when a subscription is created.
 */
Meteor.publish("tasks", function () {

    this.onStop(function() {
        console.log("Server is stopping a Tasks subscription.");
    });

    if (!this.userId) {
        console.log("No Tasks will be published for this subscription request.");
        return this.ready();
    }
    console.log("Publishing Tasks for user: " + this.userId);
    if (ServerHelpers.isAdmin(this.userId)) {
        return Tasks.find({});
    } else {
        return Tasks.find({userId: this.userId});
    }
});


/**
 * Publication for Questions collection. Defines what Question data should be available to the logged-in
 * user when a subscription is created.
 */
Meteor.publish("questions", function () {

    this.onStop(function() {
        console.log("Server is stopping a Questions subscription.");
    });


    if (!this.userId) {
        console.log("No Question questions will be published for this subscription request.");
        return this.ready();
    }

    if (ServerHelpers.isAdmin(this.userId)) {
        console.log("Questions being published for admin");
        return Questions.find({});
    } else {
        let user = Meteor.users.findOne({_id: this.userId});
        if (user) {
            console.log("Questions being published for user: " + user._id);
            // console.log(user.username);
            return Questions.find({username: user.username});
        }
    }
});



Meteor.publish('participants', function () {
    this.onStop(function() {
        console.log("Server is stopping a Participants subscription.");
    });


    if (!this.userId) {
        console.log("No Participants will be published for this subscription request.");
        return this.ready();
    }

    if (ServerHelpers.isAdmin(this.userId)) {
        console.log("Participants being published for admin");
        return Participants.find({});
    } else {
        let user = Meteor.users.findOne({_id: this.userId});
        if (user) {
            console.log("Participants being published for user: " + user._id);
            return Participants.find({emailAddress: user.username});
        }
    }
});

Meteor.publish('scheduledmessages', function () {
    return Scheduledmessages.find();
});


//======================================================================================================================
// Publications for admin panel -- Defines data available via admin panel.
//======================================================================================================================



/**
 * Publish account info about all users in the system. 
 *  
 * @note The use of custom fields (i.e., those not present by default in the Meteor accounts package) 
 * in the Users collection (e.g,. primaryEmail) necessitate this publication. Without it,
 * those custom fields would not be available to the admin panel.
 *
 * @note Not all account info is published. For more info about limiting published fields, see:
 *      https://guide.meteor.com/security.html#fields
 */
Meteor.publish('users.admin.access', function(){
    console.log("users.admin.access");

    const fieldsToPublish = {fields: {"_id":1, "primaryEmail": 1, "profile": 1, "isAdmin": 1, "createdAt":1, "username":1}};

    var userId = this.userId,
        currentUser = Meteor.users.findOne( { "_id": userId } );

    if (!currentUser) return;
    if (!Meteor.settings || !Meteor.settings.private || !Meteor.settings.private.BUILTIN_ADMIN_EMAIL ) return;
    if (currentUser.username !== Meteor.settings.private.BUILTIN_ADMIN_EMAIL ) return;

    return Meteor.users.find({}, fieldsToPublish);
});


//======================================================================================================================
// Publications for mobile/client app -- 
//      Defines data available via non-admin account on client app. Use these subscriptions to limit what 
//      to what data users have access. For example, in non-team environments, standard users do not 
//      require access to other user's account information or scheduled tasks. 
//======================================================================================================================

/**
 * Publish info about only the currently logged-in user.
 *
 * @note The use of custom fields (i.e., those not present by default in the Meteor accounts package) 
 * in the Users collection (e.g,. primaryEmail) necessitate this publication. Without it,
 * those custom fields would not be available to the client.
 * 
 * @note Not all account info is published.
 */
Meteor.publish('user.client.private', function(){
    if (!this.userId) {
        console.log("No data for 'user.client.private' will be published for this subscription request.");
        return this.ready();
    }

    console.log("Publishing user.client.private.");
    const fieldsToPublish = {fields: {"_id":1, "primaryEmail": 1, "profile": 1, "createdAt": 1}};
    return Meteor.users.find({"_id": this.userId}, fieldsToPublish);
});

/**
 * Publication for Badges collection. Defines what Badges documents should be made available to the logged-in
 * user when a subscription is created.
 */
Meteor.publish("badges", function () {

    this.onStop(function() {
        console.log("Server is stopping a Badges subscription.");
    });

    if (!this.userId) {
        console.log("No Badges will be published for this subscription request.");
        return this.ready();
    }
    console.log("Publishing Badges for user: " + this.userId);
        return Badges.find({userId: this.userId});
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

