
// Logic
import { Notifiers } from './notifiers';
import {ScheduledMessagesHelper} from '../../server/methods/messages/server.methods.scheduledMessagesHelpers';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { DateHelper } from '../../lib/helpers';

// Collections
import { Questions } from '../../lib/api/questions/questions';
import { Scheduledmessages } from '../../lib/api/scheduledmessages/scheduledmessages';
import { Participants } from '../../lib/api/participants/participants';

// Built-ins
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

// Testing
import { TestHelpers } from '../../imports/test-helpers';
import { sinon } from 'meteor/practicalmeteor:sinon';


/**
 * Causes Sinon to replace the global setTimeout, clearTimeout, setInterval, clearInterval and Date with a custom
 * implementation which is bound to the returned clock object.Sets the clock at the provided date-time.
 *
 * @param {Number} year
 * @param {Number} month
 * @param {Number} day
 * @param {Number} hour
 * @param {Number} minute
 * @param {Number} second
 * @param {Number} millisecond
 * @return {Object} Sinon object that includes a running clock.
 */
function stubClock(year, month, day, hour, minute, second, millisecond){
    const date = new Date(year, month, day);
    date.setUTCHours(hour, minute, second, millisecond);
    const startingTime = date.getTime();
    return sinon.useFakeTimers(startingTime);
}


/**
 * Used to restore methods stubbed by previous call to <tt>stubClock</tt>.
 * @param {Object} clock - Clock created by Sinon.
 */
function restoreClock(clock) {
    clock.restore();
}



describe('Push Notifications', function () {

    const assert = TestHelpers.assert;

    /** Values used for generating test data. */
    const VALID_EMAIL = "test_ScheduledMessagesHelper@parc.com";
    const VALID_CONSTRAINT = [
        {
            "attribute": "preferences.goalType",
            "value": "eatSlowly"
        }
    ];
    const VALID_NAME = "test_sequence";
    const VALID_ASK_DATE = "20";
    const VALID_ASK_TIME = "09:00";
    const VALID_EXPIRE_DATE = "21";
    const VALID_EXPIRE_TIME = "10:00";
    const VALID_RESPONSE_FORMAT = "list-choose-one";
    const VALID_SEQUENCE = 1;
    const VALID_CHOICES_SCHEDULE_MESSAGES = "yes,no";
    const VALID_ANSWERS = {
        yes: "yes",
        no: "no"
    };
    const VALID_TAG = "tag";
    const VALID_ATTRIBUTE_TO_SET = 'goalType';
    const VALID_NOTIFY_SCHEDULED_MESSAGES = true;


    /** Helper function. Copied and pasted from server.methods.scheduledMessagesHelpers.tests.js. */
    function __createFakeParticipant(){
        var _participantImport = {
            "emailAddress": VALID_EMAIL,
            "condition": "i2-10",
            "settings": {
                "name": "Les",
                "gender": "robot",
                "age": "105",
                "location": "Here",
                "selfEfficacy": "high",
                "implementationIntention": "yes",
                "reminders": "yes",
                "reminderDistribution": "masked",
                "reminderCount": "7"
            },
            "preferences": {
                "goalType": "eatSlowly",
                "goalSpecific": "",
                "dailyGoalText": "",
                "goalContent": "",
                "choice": "",
                "place": "",
                "person": "",
                "eventTime": "",
                "reminderPeriod": "",
                "reminderText": ""
            }
        };
        Participants.insert(
            Participants.create(
                _participantImport.emailAddress,
                _participantImport.condition,
                _participantImport.settings,
                _participantImport.preferences)
        );
    }


    /** Helper the returns a count of all scheduled cron jobs. */
    function numScheduledCronJobs(){
        return _.keys(SyncedCron._entries).length;
    }


    /** Helper function. Copied and pasted from server.methods.scheduledMessagesHelpers.tests.js. */
    function __createFakeScheduledMessages(){
        Scheduledmessages.insert(
            Scheduledmessages.create(VALID_CONSTRAINT, VALID_ASK_DATE, VALID_ASK_TIME, VALID_EXPIRE_DATE, VALID_EXPIRE_TIME,
                VALID_RESPONSE_FORMAT, VALID_SEQUENCE, VALID_CHOICES_SCHEDULE_MESSAGES, VALID_ANSWERS,
                "Future Scheduled Message", VALID_TAG, VALID_NAME, VALID_ATTRIBUTE_TO_SET,
                VALID_NOTIFY_SCHEDULED_MESSAGES)
        );
    }


    // Create a Scheduled message
    beforeEach(function () {

        // Confirm the database is empty
        TestHelpers.resetDatabase();
        assert.equal(Questions.find({}).count(), 0);
        assert.equal(Scheduledmessages.find({}).count(), 0);

        // Ensure no cron job are scheduled.
        SyncedCron._reset();
        assert.equal(numScheduledCronJobs(), 0, "There should be no pending cron jobs.");


    });

    afterEach(function () {
        TestHelpers.resetDatabase();
    });




    describe('Scheduling cron jobs by initializing the Notifier.', function () {

        // Store reference to Sinon clock. This is needed to restore Date related methods stubbed by Sinon.
        let _clock;

        // Reference to the question created during test setup. This is needed querying cron jobs.
        let _question;

        beforeEach(function(){

            // Setup -- Stub a Meteor method used by ScheduledMessagesHelper.pushScheduledMessagesForParticipant(...)
            sinon.stub(Meteor.users, 'findOne', function (){ return 9999; /* Arbitrary number */ });

            // Setup -- Stub method used for retrieving a user's timezone preference.
            sinon.stub(DateHelper, 'preferredTimezoneForUser', function (emailAddress) {
                console.log("Executing DateHelper.preferredTimezoneForUser stub.");
                return '-420';
            });

            // Setup -- Stub the clock, setting the date to 16 Oct 2016 9:00 AM (PST)
            //_clock = stubClock(2017, 9, 17, 16, 0, 0, 0);
            //assert.equal((new Date()).getTime(), (new Date(2016, 9, 17, 9, 0, 0, 0)).getTime());
            _clock = stubClock(2017, 7, 3, 16, 0, 0, 0);
            assert.equal((new Date()).getTime(), (new Date(2017, 7, 3, 9, 0, 0, 0)).getTime());

            // Setup -- Create a participant who has one scheduled message.
            __createFakeParticipant();
            __createFakeScheduledMessages();
            assert.equal(Scheduledmessages.find({}).count(), 1,
                "Test setup failed. Wrong number of Scheduledmessage documents.");

            // Setup -- Create a question from participant's scheduled message.
            ScheduledMessagesHelper.pushScheduledMessagesForParticipant(VALID_EMAIL);
            assert.equal(Questions.find({}).count(), 1, "Test setup failed. Wrong number of Question documents.");

            // Setup -- Retrieve a reference to the Question created during setup. It's used during the tests.
            _question = Questions.findOne();

            // When -- The Notifier is initialized
            Notifiers.initializePushNotifications();
            var notifier = new Notifiers();
        });


        afterEach(function () {
            restoreClock(_clock);
            // Remove Sinon stubs
            Meteor.users.findOne.restore();
            DateHelper.preferredTimezoneForUser.restore();
        });


        it('Should schedule cron jobs for Questions.', function () {
            // Then there should be one a scheduled cron job.
            assert.equal(numScheduledCronJobs(), 1, "Wrong number of scheduled cron jobs.");
        });

        it("Should schedule cron jobs at the same time Questions are scheduled to be asked.", function () {
            // Then the job should be scheduled to run on 6 Nov 2016 at 9:00 AM (PST).
            //const expectedAskDatetime = new Date(2016, 10, 6, 9, 0, 0, 0);
            //const expectedAskDatetime = new Date(2016, 10, 6, 9, 0, 0, 0);
            const expectedAskDatetime = new Date(2017, 7, 23, 9, 0, 0, 0);
            const actualScheduledCronDate = SyncedCron.nextScheduledAtDate(_question._id.toString());
            assert.equal(actualScheduledCronDate.getTime(), expectedAskDatetime.getTime());
        });
    });


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
