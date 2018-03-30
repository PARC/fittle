/** HELPERS FOR USE IN AUTOMATED TESTING **/





/**
 * Generic helper for providing easier access (via wrappers) to third-party methods for testing and
 * additional methods used to ease test authoring and readability.
 */
import {chai} from 'meteor/practicalmeteor:chai';
import {resetDatabase} from 'meteor/xolvio:cleaner';
import {Factory} from 'meteor/dburles:factory';

export const TestHelpers = {

    'assert': chai.assert,
    'factory': Factory,

    'areEqual': chai.assert.strictEqual,

   /**
    * @param {Date} expected
    * @param {Date} actual
    */
    'areEqualTimestamps' : function(expected, actual){
        chai.assert.strictEqual(expected.getTime(), actual.getTime());
    },

    /** Special helper for cleaner BDD try/catch testing. Allows capturing a thrown exception. */
    'catch': function (f) {
        try {
            f();
        }
        catch (e) {
            console.log("Test helper caught error: " + e.message);
            return e;
        }
    },

    'chai' : chai,

   /**
    * @param {Date} dateToCheck
    * @param {Date} dateToBeAfter
    */
    'isAfter' : function(dateToCheck, dateToBeAfter){
        assert.isAbove(dateToCheck.getTime(), dateToBeAfter.getTime());
    },

    'isError': function (obj) {
        chai.assert.instanceOf(obj, Error);
    },

    'isErrorWithMessage': function (obj, msg) {
        chai.assert.instanceOf(obj, Error);
        chai.assert.strictEqual(obj.message, msg);
    },

    'isErrorWithReason': function (obj, reason){
        chai.assert.instanceOf(obj, Error);
        chai.assert.strictEqual(obj.reason, reason);
    },

    'isNullOrUndefined' : function (obj) {
        const isNull = (obj === null);
        const isUndefined = (obj === undefined);
        chai.assert.isTrue( (isNull || isUndefined), "Expected object to be either null or undefined.");
    },

    'isNotNullAndNotUndefined' : function (obj, errorMsg) {
        const isNotNull = (obj !== null);
        const isNotUndefined = (obj !== undefined);
        chai.assert.isTrue( (isNotNull && isNotUndefined),
            "Expected object to be neither null or undefined. :: " + errorMsg);
    },

    'isUndefined': chai.assert.isUndefined,

    'resetDatabase': resetDatabase,

    /** Helper for failing a test that has not yet been implemented (i.e., for use with placeholder tests). */
    'testNotImplemented': function () {
        chai.assert.fail(null, null, "Test not implemented.");
    },
    'testExpectedToFail': function (comment) {
        if (!comment)
            throw 'testExpectedToFail: NO EXPLANATION GIVEN';
        chai.assert.fail(null, null, "Test Expected to Fail: " + comment);
    },
    'VISUAL_CONFIMATION' : 'Expected results confirmed visually when run in Meteor',
    'TEST_NOT_IMPLEMENTED' : 'Test not implemented',
    'isSubstring': function (string, substring) {
        return string.indexOf(substring) > -1
    }
};


/**
 * Helper for generating fake data.
 * Ideally, this should be a simple wrapper for the practicalmeteor:faker package.
 * However, as of 19 July 2016, that package doesn't seem to run on the client, which
 * causes problems. So in cases where fake data may need to be generated on the client,
 * use a different approach (such as hard-code a value).
 */
import {faker} from 'meteor/practicalmeteor:faker';
import {Participants} from '../lib/api/participants/participants';
export const Faker = {

    "arbitraryStringOfLength": function (len) {
        // From: http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
        var arbString = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < len; i++) {
            arbString += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return arbString;
    },

    "defineParticipantsCollection" : function () {
        //TODO (04Aug2016) Make this more useful. It was hastily moved from Participants.js because of issues deploying to production.
        let now = new Date();
        Factory.define('participants', Participants, {
            'emailAddress': Faker.email(),
            'preferences' : {
                'dailyGoalText': Faker.sentence()
            },
            'createdAt': now,
            'studyStartUTC': now,
            'challengeStartUTC': now,
            'condition': 'initial_affirmation'
        });
    },

    "email": function () {
        // Hard-coded value created via faker.internet.email()
        return "Luis76@gmail.com";
    },

    "EMPTY_STRING": "",

    "sentence": function () {
        // Hard-coded value created via faker.lorem.sentence(wordCount=5, range=0)
        return "Qui laudantium in eos voluptatem.";
    },

    "WHITESPACE_STRING": "     "

};


/**
 * Helpers used for rendering Blaze templates.
 * Source: http://guide.meteor.com/testing.html#simple-blaze-unit-test
 */
import {_} from 'meteor/underscore';
import {Template} from 'meteor/templating';
import {Blaze} from 'meteor/blaze';
import {Tracker} from 'meteor/tracker';

const withDiv = function withDiv(callback) {
    const el = document.createElement('div');
    document.body.appendChild(el);
    try {
        callback(el);
    } finally {
        document.body.removeChild(el);
    }
};

export const withRenderedTemplate = function withRenderedTemplate(template, data, callback) {
    withDiv((el) => {
        const ourTemplate = _.isString(template) ? Template[template] : template;
        Blaze.renderWithData(ourTemplate, data, el);
        Tracker.flush();
        callback(el);
    });
};

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




