/**
 * Created by lnelson on 10/3/16.
 */

import {TestHelpers} from '../../../imports/test-helpers.js';
import {chai} from 'meteor/practicalmeteor:chai';
import {Scheduledmessages} from '../../../lib/api/scheduledmessages/scheduledmessages';
import {Participants} from '../../../lib/api/participants/participants';
import {Questions} from '../../../lib/api/questions/questions';
import {Tasks} from '../../../lib/api/tasks/tasks';
import {Accounts} from 'meteor/accounts-base';
import {sinon} from 'meteor/practicalmeteor:sinon';
import {DateHelper} from '../../../lib/helpers';
import {ScheduledMessagesHelper} from './server.methods.scheduledMessagesHelpers';
import './server.methods.scheduledMessagesHelpers';
import {Meteor} from 'meteor/meteor';

describe('Unit Test', function () {
    /**
     * Test suite defining unit functionality for working with study messaging data.
     */
    const catchError = TestHelpers.catch;
    const areEqual = TestHelpers.areEqual;


    const _pastAskDate = new Date(2001, 1, 1);
    const _pastExpireDate = new Date(2001, 1, 2);
    const _futureAskDate = new Date(2038, 1, 18);
    const _futureExpireDate = new Date(2038, 1, 19);


    const VALID_EMAIL = "test_ScheduledMessagesHelper@parc.com";
    const VALID_STUDY_CONDITION = "I2-10";
    const VALID_CONSTRAINT = [
        {
            "attribute": "preferences.goalType",
            "value": "eatSlowly"
        }
    ];
    const INVALID_CONSTRAINT = [
        {
            "attribute": "preferences.goalType",
            "value": "woof"
        }
    ];
    const VALID_NAME = "test_sequence";
    const VALID_ASK_DATE = _pastAskDate;
    const VALID_ASK_TIME = "09:00";
    const VALID_EXPIRE_DATE = _pastExpireDate;
    const VALID_EXPIRE_TIME = "10:00";
    const VALID_RESPONSE_FORMAT = "list-choose-one";
    const VALID_SEQUENCE = 1;
    const VALID_CHOICES_QUESTION = ["yes", "no"];
    const VALID_CHOICES_SCHEDULE_MESSAGES = "yes,no";
    const VALID_ANSWERS = {
        yes: "yes",
        no: "no"
    };
    const VALID_TEXT = "This is a test of ScheduledMessagesHelper";
    const VALID_TAG = "tag";
    const VALID_ATTRIBUTE_TO_SET = 'goalType';
    const VALID_ATTRIBUTE_TO_SET_REMINDER = 'reminderPeriod';
    const VALID_NOTIFY_QUESTION = 'true';
    const VALID_NOTIFY_SCHEDULED_MESSAGES = true;
    const VALID_ASK_TIME_DEFAULT = '00:00';
    const VALID_EXPIRE_TIME_DEFAULT = '23:59';
    const VALID_USERNAME = VALID_EMAIL;
    const VALID_PASSWORD = 'password';
    const VALID_TASK_ID = "z33ddGdAM6qFfk9pF";
    const VALID_ASK_DAY = "1";
    const VALID_EXPIRE_DAY = "1";
    const VALID_NONE_ALLOWED = false;

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
    const _questionPastData = Questions.create(
        _pastAskDate,
        VALID_ASK_TIME,
        VALID_ATTRIBUTE_TO_SET,
        VALID_CHOICES_QUESTION,
        VALID_ANSWERS,
        _pastExpireDate,
        VALID_EXPIRE_TIME,
        VALID_NOTIFY_QUESTION,
        VALID_RESPONSE_FORMAT,
        VALID_SEQUENCE,
        VALID_NAME,
        VALID_TAG,
        "Past Question",
        VALID_USERNAME,
        VALID_TASK_ID,
        VALID_NONE_ALLOWED,
        VALID_ASK_DAY,
        VALID_EXPIRE_DAY
    );

    const _myProps = {myProp: "true"};

    const _questionFutureData = Questions.create(
        _futureAskDate,
        VALID_ASK_TIME,
        VALID_ATTRIBUTE_TO_SET,
        VALID_CHOICES_QUESTION,
        VALID_ANSWERS,
        _futureExpireDate,
        VALID_EXPIRE_TIME,
        VALID_NOTIFY_QUESTION,
        VALID_RESPONSE_FORMAT,
        VALID_SEQUENCE,
        VALID_NAME,
        VALID_TAG,
        "Future Question",
        VALID_USERNAME,
        VALID_TASK_ID,
        VALID_NONE_ALLOWED,
        VALID_ASK_DAY,
        VALID_EXPIRE_DAY,
        _myProps
    );

    /** Set/Reset the database before/after each test! */
    beforeEach(function () {
        TestHelpers.resetDatabase(null, function () {
            Participants.insert(
                Participants.create(
                    _participantImport.emailAddress,
                    _participantImport.condition,
                    _participantImport.settings,
                    _participantImport.preferences)
            );
            Accounts.createUser({'email': _participantImport.emailAddress, 'password': VALID_PASSWORD});

        });
    });
    afterEach(function () {
        TestHelpers.resetDatabase(null, function () {
        });
    });


    describe('server.methods.scheduledMessagesHelpers.js', function () {


        context('Method addQuestion', function () {

            it('Should add a question to the database for a participant ', function () {
                console.log("Add question with args " +
                    [
                        _questionPastData.text,
                        _questionPastData.responseFormat,
                        _questionPastData.choices,
                        _questionPastData.username,
                        _questionPastData.tag,
                        _questionPastData.askDate,
                        _questionPastData.askTime,
                        _questionPastData.expireDate,
                        _questionPastData.expireTime,
                        _questionPastData.sequence,
                        _questionPastData.notify,
                        _questionPastData.name,
                        _questionPastData.preferenceToSet,
                        _questionPastData.answers,
                        _questionPastData.taskId,
                        _questionPastData.noneAllowed,
                        _questionPastData.askDay,
                        _questionPastData.expireDay,
                        _questionPastData.props
                    ]);

                Questions.addQuestion(
                    _questionPastData.text,
                    _questionPastData.responseFormat,
                    _questionPastData.choices,
                    _questionPastData.username,
                    _questionPastData.tag,
                    _questionPastData.askDate,
                    _questionPastData.askTime,
                    _questionPastData.expireDate,
                    _questionPastData.expireTime,
                    _questionPastData.sequence,
                    _questionPastData.notify,
                    _questionPastData.name,
                    _questionPastData.preferenceToSet,
                    _questionPastData.answers,
                    _questionPastData.taskId,
                    _questionPastData.noneAllowed,
                    _questionPastData.askDay,
                    _questionPastData.expireDay,
                    _questionPastData.props
                )
                areEqual(Questions.find().count(), 1, 'Question did not get added to database');
            });
        });

        context('Method pushScheduledMessagesForParticipant', function () {

            const TZ_LOS_ANGELES = "-420";

            function stubPrefferedTimezoneForUser(timezoneName) {
                // Setup -- Stub method used for retrieving a user's timezone preference. Need to do this because
                // this information is access by ScheduledMessagesHelper.pushScheduledMessagesForParticipant(...), which
                // is called as part of ScheduledMessageHelpers.answerQuestion(...).
                sinon.stub(DateHelper, 'preferredTimezoneForUser', function (emailAddress) {
                    console.log("Executing DateHelper.preferredTimezoneForUser stub.");
                    return timezoneName;
                });
            }

            function restorePreferredTimezoneForUser() {
                // Cleanup -- Remove Sinon stub
                DateHelper.preferredTimezoneForUser.restore();
            }

            function createQuestionsAndScheduledMessages() {
                Questions.insert(_questionPastData);
                Questions.insert(_questionFutureData);
                Scheduledmessages.insert(
                    Scheduledmessages.create(
                        VALID_CONSTRAINT,
                        "20",
                        VALID_ASK_TIME,
                        "21",
                        VALID_EXPIRE_TIME,
                        VALID_RESPONSE_FORMAT,
                        VALID_SEQUENCE,
                        VALID_CHOICES_SCHEDULE_MESSAGES,
                        VALID_ANSWERS,
                        "Future Scheduled Message",
                        VALID_TAG,
                        VALID_NAME,
                        VALID_ATTRIBUTE_TO_SET,
                        VALID_NOTIFY_SCHEDULED_MESSAGES
                    )
                );
                Scheduledmessages.insert(
                    Scheduledmessages.create(
                        VALID_CONSTRAINT,
                        "-2",
                        VALID_ASK_TIME,
                        "-2",
                        VALID_EXPIRE_TIME,
                        VALID_RESPONSE_FORMAT,
                        VALID_SEQUENCE,
                        VALID_CHOICES_SCHEDULE_MESSAGES,
                        VALID_ANSWERS,
                        "Past Scheduled Message",
                        VALID_TAG,
                        VALID_NAME,
                        VALID_ATTRIBUTE_TO_SET,
                        VALID_NOTIFY_SCHEDULED_MESSAGES
                    )
                );
                areEqual(Questions.find({text: _questionPastData.text}).count(), 1, 'Past Question not present at start of test');
                areEqual(Questions.find({text: _questionFutureData.text}).count(), 1, 'Future Question not present at start of test');
                ScheduledMessagesHelper.pushScheduledMessagesForParticipant(VALID_EMAIL);
            }


            describe('Adding and removing questions to the database.', function () {

                beforeEach(function () {
                    stubPrefferedTimezoneForUser(TZ_LOS_ANGELES);
                    createQuestionsAndScheduledMessages();
                });

                afterEach(function () {
                    restorePreferredTimezoneForUser();
                });

                it('Should remove any future questions scheduled for a participant when pushing new future questions ', function () {
                    areEqual(Questions.find({text: _questionFutureData.text}).count(), 0, 'Future Question that should have been removed present at start of test');
                });

                it('Should keep any past questions scheduled for a participant before pushing new future questions ', function () {
                    areEqual(Questions.find({text: _questionPastData.text}).count(), 1, 'Past Question not present at end of test');
                });

                it('Should add future questions to the database for a participant ', function () {
                    areEqual(Questions.find({text: "Future Scheduled Message"}).count(), 1, 'Future Scheduled Message not present at end of test');
                });

                it('Should ignore past scheduled messages when updating the database for a participant ', function () {
                    areEqual(Questions.find({text: "Past Scheduled Message"}).count(), 0, 'Past Scheduled Message that should have been ignored present at start of test');
                });

            });

            describe('Scheduling questions based on the user\'s timezone preference.', function () {

                const assert = TestHelpers.assert;

                // Store reference to Sinon clock. This is needed to restore Date related methods stubbed by Sinon.
                let _clock;

                /**
                 * Causes Sinon to replace the global setTimeout, clearTimeout, setInterval, clearInterval and Date with
                 * a custom implementation which is bound to the returned clock object.Sets the clock at the provided
                 * date-time
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
                function stubClock(year, month, day, hour, minute, second, millisecond) {
                    const date = new Date(year, month, day);
                    date.setUTCHours(hour, minute, second, millisecond);
                    const startingTime = date.getTime();
                    return sinon.useFakeTimers(startingTime);
                }

                /**
                 * Helper for creating a <tt>ScheduledMessage</tt> (needed for this test suite).
                 * @param {String} askDate
                 * @param {String} askTime
                 * @param {String} expireDate
                 * @param {String} expireTime
                 */
                function createScheduledMessage(askDate, askTime, expireDate, expireTime) {
                    const messageText = "Message created through unit testing.";
                    Scheduledmessages.insert(
                        Scheduledmessages.create(
                            VALID_CONSTRAINT, askDate, askTime, expireDate, expireTime, VALID_RESPONSE_FORMAT,
                            VALID_SEQUENCE, VALID_CHOICES_SCHEDULE_MESSAGES, VALID_ANSWERS, messageText,
                            VALID_TAG, VALID_NAME, VALID_ATTRIBUTE_TO_SET, VALID_NOTIFY_SCHEDULED_MESSAGES
                        )
                    );
                }

                /** Helper function to insert specific Participant needed for this test suite. */
                function createFakeParticipant() {
                    var _participantImport = {
                        "emailAddress": VALID_EMAIL,
                        "condition": "i2-10",
                        "settings": {
                            "name": "Robot", "gender": "robot", "age": "105", "location": "Here",
                            "selfEfficacy": "high", "implementationIntention": "yes", "reminders": "yes",
                            "reminderDistribution": "masked", "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "eatSlowly", "goalSpecific": "", "dailyGoalText": "",
                            "goalContent": "", "choice": "", "place": "", "person": "", "eventTime": "",
                            "reminderPeriod": "", "reminderText": ""
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


                /** A lot of setup is required, including the undoing of work done in prior beforeEach calls. */
                it('Question ask and expiration time is based on ScheduledMessage and user\'s timezone preference. (Case 1)', function () {

                    // Setup -- Clear anything inserted into the database by beforeEach(...) calls higher in the
                    // test hierarchy.
                    TestHelpers.resetDatabase();

                    // Setup -- Stub the clock, setting the date to 15 Oct 2016 9:00 AM (PST).
                    _clock = stubClock(2016, 9, 17, 16, 0, 0, 0);
                    assert.equal((new Date()).getTime(), (new Date(2016, 9, 17, 9, 0, 0, 0)).getTime());

                    // Setup -- Create a fake participant.
                    createFakeParticipant();

                    // Setup -- Stub method for retrieving the user's timezone preference.
                    const preferredTimezone = "-420";
                    sinon.stub(DateHelper, 'preferredTimezoneForUser', function (emailAddress) {
                        return preferredTimezone;
                    });

                    // Setup -- Stub a Meteor method used by ScheduledMessagesHelper.pushScheduledMessagesForParticipant(...)
                    // This is done instead of creating an actual user account.
                    sinon.stub(Meteor.users, 'findOne', function () {
                        return 9999;
                        /* Arbitrary number */
                    });

                    // Setup -- Insert a ScheduledMessage into the database. Must be done only after stubbing clock.
                    createScheduledMessage("10", "09:00", "11", "10:00");
                    assert.equal(Scheduledmessages.find({}).count(), 1);

                    // When -- Scheduled messages are created from Questions.
                    ScheduledMessagesHelper.pushScheduledMessagesForParticipant(VALID_EMAIL);

                    // Then -- The scheduled message should be scheduled to ask at 27 Oct 2016 at 9:00 AM (PST)
                    const expectedAskDatetime = new Date(2016, 9, 27, 9, 0, 0, 0);
                    const actualAskDatetime = Questions.findOne().askDatetime;
                    assert.equal(actualAskDatetime.getTime(), expectedAskDatetime.getTime(),
                        "Ask datetimes do not match.");

                    // Then -- ...and the scheduled message's expire time should be correct based on the user's timezone.
                    const expectedExpireDatetime = new Date(2016, 9, 28, 10, 0, 0, 0);
                    const actualExpireDatetime = Questions.findOne().expireDatetime;
                    assert.equal(actualExpireDatetime.getTime(), expectedExpireDatetime.getTime(),
                        "Expiration datetimes do not match.");

                    // Cleanup -- Remove stubs.
                    Meteor.users.findOne.restore();
                    DateHelper.preferredTimezoneForUser.restore();
                    _clock.restore();

                });

                /** A lot of setup is required, including the undoing of work done in prior beforeEach calls. */
                it('Question ask and expiration time is based on ScheduledMessage and user\'s timezone preference. (Case 2)', function () {

                    // Setup -- Clear anything inserted into the database by beforeEach(...) calls higher in the
                    // test hierarchy.
                    TestHelpers.resetDatabase();

                    // Setup -- Stub the clock, setting the date to 15 Oct 2016 9:00 AM (EST).
                    _clock = stubClock(2016, 9, 17, 13, 0, 0, 0);

                    // Setup -- Create a fake participant.
                    createFakeParticipant();

                    // Setup -- Stub method for retrieving the user's timezone preference.
                    const preferredTimezone = "-240";
                    sinon.stub(DateHelper, 'preferredTimezoneForUser', function (emailAddress) {
                        return preferredTimezone;
                    });

                    // Setup -- Stub a Meteor method used by ScheduledMessagesHelper.pushScheduledMessagesForParticipant(...)
                    // This is done instead of creating an actual user account.
                    sinon.stub(Meteor.users, 'findOne', function () {
                        return 9999;
                        /* Arbitrary number */
                    });

                    // Setup -- Insert a ScheduledMessage into the database. Must be done only after stubbing clock.
                    createScheduledMessage("10", "09:00", "11", "10:00");
                    assert.equal(Scheduledmessages.find({}).count(), 1);

                    // When -- Scheduled messages are created from Questions.
                    ScheduledMessagesHelper.pushScheduledMessagesForParticipant(VALID_EMAIL);

                    // Then -- The scheduled message should be scheduled to ask at 27 Oct 2016 at 9:00 AM (EST)/ 6:00 AM (PST)
                    const expectedAskDatetime = new Date(2016, 9, 27, 6, 0, 0, 0);
                    const actualAskDatetime = Questions.findOne().askDatetime;
                    assert.equal(actualAskDatetime.getTime(), expectedAskDatetime.getTime(),
                        "Ask datetimes do not match.");

                    // Then -- ...and the scheduled message's expire time should be correct based on the user's timezone.
                    const expectedExpireDatetime = new Date(2016, 9, 28, 7, 0, 0, 0);
                    const actualExpireDatetime = Questions.findOne().expireDatetime;
                    assert.equal(actualExpireDatetime.getTime(), expectedExpireDatetime.getTime(),
                        "Expiration datetimes do not match.");

                    // Cleanup -- Remove stubs.
                    Meteor.users.findOne.restore();
                    DateHelper.preferredTimezoneForUser.restore();
                    _clock.restore();

                });

            });


        });

        context('Method parseMessageSequence', function () {

            it('Should create a row of scheduled message data from valid JSON', function () {
                const VALID_JSON = {
                    "sequences": [
                        {
                            "name": "goalTypeSelect",
                            "constraints": [
                                {
                                    "attribute": "preferences.goalType",
                                    "value": ""
                                }
                            ],
                            "askDate": "-1",
                            "askTime": "07:00",
                            "expireDate": "28",
                            "expireTime": "23:59",
                            "sequenceBase": 10,
                            "questions": [
                                {
                                    "tag": "goalType",
                                    "text": "Which activity would you like to do?",
                                    "responseFormat": "list-choose-one",
                                    "choices": {
                                        "eatSlowly": "Eat slowly and mindfully",
                                        "walk": "Walk everyday",
                                        "foodJournal": "Keep a food journal"
                                    },
                                    "preferenceToSet": "goalType"
                                }
                            ]
                        }
                    ]
                };
                const row = ScheduledMessagesHelper.parseMessageSequence(VALID_JSON);
                areEqual(row.length, 1, 'Should have one row after parse of valid JSON');
            });
        });

        context('Method participantMeetsConstraint', function () {
            it('Should return true if a constraint passes for a participant', function () {
                areEqual(ScheduledMessagesHelper.participantMeetsConstraint(_participantImport, VALID_CONSTRAINT), true, 'Should have passed correct constraint');
            });

            it('Should return false if a constraint does not pass for a participant', function () {
                areEqual(ScheduledMessagesHelper.participantMeetsConstraint(_participantImport, INVALID_CONSTRAINT), false, 'Should not have passed unmatching constraint');
            });

            it('Should return false if there is no constraint to pass', function () {
                areEqual(ScheduledMessagesHelper.participantMeetsConstraint(_participantImport, undefined), false, 'Should have passed undefined constraint');
                areEqual(ScheduledMessagesHelper.participantMeetsConstraint(_participantImport, null), false, 'Should have passed null constraint');
            });
        });

        context('Method answerQuestion', function () {
            var _thisId = null;
            beforeEach(function () {
                TestHelpers.resetDatabase(null, function () {
                    Participants.insert(
                        Participants.create(
                            _participantImport.emailAddress,
                            _participantImport.condition,
                            _participantImport.settings,
                            _participantImport.preferences)
                    );
                });

            });

            it('Should update the database with an answer to a question', function () {
                Questions.insert(_questionPastData);
                _thisId = Questions.findOne()._id;
                TestHelpers.isNotNullAndNotUndefined(_thisId, "Did not initialize answerQuestion test properly")
                var newValue = "new value";
                ScheduledMessagesHelper.answerQuestion(_thisId, newValue);
                areEqual(Questions.findOne({_id: _thisId}).answer, newValue, 'Answer did not get set');
            });

            it('Should make preference assignments based on an answer that requires an assignemnt', function () {
                Questions.insert(_questionPastData);
                _thisId = Questions.findOne()._id;
                TestHelpers.isNotNullAndNotUndefined(_thisId, "Did not initialize answerQuestion test properly")
                var newValue = "new value";
                ScheduledMessagesHelper.answerQuestion(_thisId, newValue);
                areEqual(Participants.findOne().preferences.goalType, newValue, 'Answer did not initialize a Participant preference');
            });
        });

        context('Method answerQuestion:reminder test', function () {
            var _thisId = null;
            beforeEach(function () {
                TestHelpers.resetDatabase(null, function () {
                    let _participantToRemind = {
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
                            "goalSpecific": "eat_slowly_5_additional",
                            "dailyGoalText": "Remember to take additional 5 minutes to have {{choice}}, at: {{place}}, with: {{person}}",
                            "goalContent": "Eat_Slower_Eat_Less",
                            "choice": "CHOICE",
                            "place": "PLACE",
                            "person": "PERSON",
                            "eventTime": "07:00",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    };
                    Participants.insert(
                        Participants.create(
                            _participantToRemind.emailAddress,
                            _participantToRemind.condition,
                            _participantToRemind.settings,
                            _participantToRemind.preferences)
                    );
                    Accounts.createUser({'email': _participantToRemind.emailAddress, 'password': VALID_PASSWORD});
                });

            });

            it('Should schedule reminders if this is the first setting of the reminder period for a participant', function () {
                // This test only applies to I2 configuration
                if (Meteor.settings.public.STUDY_NAME !== "I2") return;

                // Setup -- Stub method used for retrieving a user's timezone preference. Need to do this because
                // this information is access by ScheduledMessagesHelper.pushScheduledMessagesForParticipant(...), which
                // is called as part of ScheduledMessageHelpers.answerQuestion(...).
                sinon.stub(DateHelper, 'preferredTimezoneForUser', function (emailAddress) {
                    console.log("Executing DateHelper.preferredTimezoneForUser stub.");
                    return '-420';
                });

                let questionReminderData = JSON.parse(JSON.stringify(_questionPastData));
                questionReminderData.preferenceToSet = VALID_ATTRIBUTE_TO_SET_REMINDER;
                Questions.insert(questionReminderData);
                _thisId = Questions.findOne()._id;
                TestHelpers.isNotNullAndNotUndefined(_thisId, "Did not initialize answerQuestion test properly")
                ScheduledMessagesHelper.answerQuestion(_thisId, "dummy answer - gets overwritten in this test when assigning to reminderText preference");
                let newValue = "Remember to take additional 5 minutes to have {{choice}}, at: {{place}}, with: {{person}}";
                areEqual(Participants.findOne().preferences.reminderText, newValue, 'Answer did not initialize Participant reminder preference');
                let instantiatedValue = "Remember to take additional 5 minutes to have CHOICE, at: PLACE, with: PERSON";
                let qs = Questions.find({}).fetch();
                areEqual(Questions.find({text: instantiatedValue}).count(), 7, 'Answer did not create message schedule for reminders');

                // Cleanup -- Remove Sinon stub
                DateHelper.preferredTimezoneForUser.restore();
            });

        });

        context('Method answerQuestion:task assignment test', function () {
            var _thisId = null;
            beforeEach(function () {
                TestHelpers.resetDatabase(null, function () {
                    let _participantToRemind = {
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
                            "goalContent": "Eat_Slower_Eat_Less",
                            "choice": "CHOICE",
                            "place": "PLACE",
                            "person": "PERSON",
                            "eventTime": "07:00",
                            "reminderPeriod": "15 minutes",
                            "reminderText": "Remind me"
                        }
                    };
                    Participants.insert(
                        Participants.create(
                            _participantToRemind.emailAddress,
                            _participantToRemind.condition,
                            _participantToRemind.settings,
                            _participantToRemind.preferences)
                    );
                    Accounts.createUser({
                        email: VALID_EMAIL,
                        password: "Testing1234"
                    });

                    const VALID_CHOICES_QUESTION_SPECIFIC_GOAL = ["Take additional 5 minutes for the meal"];
                    const VALID_ATTRIBUTE_TO_SET_SPECIFIC_GOAL = "goalSpecific";
                    const VALID_ANSWERS_SPECIFIC_GOAL = {
                        "Take additional 5 minutes for the meal": "eat_slowly_5_additional"
                    };
                    const _questionSpecificGoal = Questions.create(
                        _pastAskDate,
                        VALID_ASK_TIME,
                        VALID_ATTRIBUTE_TO_SET_SPECIFIC_GOAL,
                        VALID_CHOICES_QUESTION_SPECIFIC_GOAL,
                        VALID_ANSWERS_SPECIFIC_GOAL,
                        _pastExpireDate,
                        VALID_EXPIRE_TIME,
                        VALID_NOTIFY_QUESTION,
                        VALID_RESPONSE_FORMAT,
                        VALID_SEQUENCE,
                        VALID_NAME,
                        VALID_TAG,
                        "Specific Goal question used to trigger setting of dailyGoalText",
                        VALID_USERNAME,
                        VALID_TASK_ID,
                        VALID_NONE_ALLOWED,
                        VALID_ASK_DAY,
                        VALID_EXPIRE_DAY
                    );
                    Questions.insert(_questionSpecificGoal);
                    areEqual(Questions.find().count(), 1, 'Initial Question did not get added to database');

                    //Answer needed is "Take additional 5 minutes for the meal"

                });

            });


            it('Should set the study goals for a user if this is the first setting of daily goal text preference for a participant', function () {
                // This test only applies to I2 configuration
                if (Meteor.settings.public.STUDY_NAME !== "I2") return;

                let _thisId = Questions.findOne()._id;
                TestHelpers.isNotNullAndNotUndefined(_thisId, "Did not initialize answerQuestion test properly")
                ScheduledMessagesHelper.answerQuestion(_thisId, "Take additional 5 minutes for the meal");
                areEqual(Tasks.find().count(), 28, 'Task not created for evey day of study');
            });

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
