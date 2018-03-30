/**
 * Created by lnelson on 7/28/17.
 */
/**
 * Created by lnelson on 10/3/16.
 */

import {TestHelpers} from '../../../imports/test-helpers.js';
import {chai} from 'meteor/practicalmeteor:chai';
import {Participants} from '../../../lib/api/participants/participants';
import {Questions} from '../../../lib/api/questions/questions';
import {Accounts} from 'meteor/accounts-base';
import {sinon} from 'meteor/practicalmeteor:sinon';
import {DateHelper} from '../../../lib/helpers';
import {updateFutureReminderTimes} from './server.methods.reminderHelpers';
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
    const VALID_TAG = "reminder";
    const VALID_ATTRIBUTE_TO_SET = 'goalType';
    const VALID_ATTRIBUTE_TO_SET_REMINDER = 'reminderPeriod';
    const VALID_NOTIFY_QUESTION = 'true';
    const VALID_NOTIFY_SCHEDULED_MESSAGES = true;
    const VALID_ALTERNATE_ASK_TIME_DEFAULT = '12:00';
    const VALID_EXPIRE_TIME_DEFAULT = '23:59';
    const VALID_USERNAME = VALID_EMAIL;
    const VALID_PASSWORD = 'password';
    const VALID_TASK_ID = "z33ddGdAM6qFfk9pF";
    const VALID_ASK_DAY = "1";
    const VALID_EXPIRE_DAY = "1";
    const VALID_NONE_ALLOWED = false;

    let _participantImport = {
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
        VALID_EXPIRE_DAY
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


    describe('server.methods.reminderHelpers.js', function () {


        context('Method updateFutureReminderTimes', function () {

            it('Should update future question for a participant if conditions met', function () {

                Questions.addQuestion(
                    _questionFutureData.text,
                    _questionFutureData.responseFormat,
                    _questionFutureData.choices,
                    _questionFutureData.username,
                    _questionFutureData.tag,
                    _questionFutureData.askDate,
                    _questionFutureData.askTime,
                    _questionFutureData.expireDate,
                    _questionFutureData.expireTime,
                    _questionFutureData.sequence,
                    _questionFutureData.notify,
                    _questionFutureData.name,
                    _questionFutureData.preferenceToSet,
                    _questionFutureData.answers,
                    _questionFutureData.taskId,
                    _questionFutureData.noneAllowed,
                    _questionFutureData.askDay,
                    _questionFutureData.expireDay,
                    _questionFutureData.props
                );
                areEqual(Questions.find().count(), 1, 'Question did not get added to database');
                let checkqInitial = Questions.findOne();
                let initialAskTime = checkqInitial.askTime;
                areEqual(checkqInitial.askTime, VALID_ASK_TIME, 'Question did not get initialized properly');
                areEqual(Questions.find({username: _questionFutureData.username}).count(),1,'username not found');
                areEqual(Questions.find({askTime: {$ne: _questionFutureData.askTime}}).count(),0,'askTime not found');
                areEqual(Questions.find({tag: "reminder"}).count(),1,'Reminder tag not found');
                let now = new Date();
                areEqual(Questions.find({askDatetime: {$gt: now}}).count(),1,'Future askDatetime should have been found');
                updateFutureReminderTimes( _questionFutureData.username, VALID_ALTERNATE_ASK_TIME_DEFAULT);
                let checkq = Questions.findOne();
                areEqual(checkq.askTime, VALID_ALTERNATE_ASK_TIME_DEFAULT, 'Question did not get updated');
                // Check askDatetime
                let timeDiff = checkq.askDatetime.getTime() - checkqInitial.askDatetime.getTime();
                areEqual(timeDiff, 3*60*60*1000, 'Question askDatetime did not get updated properly');

            });
        });

        it('Should ignore past question for a participant if conditions met', function () {

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
                _questionFutureData.props
            );
            areEqual(Questions.find().count(), 1, 'Question did not get added to database');
            areEqual(Questions.find({username: _questionPastData.username}).count(),1,'username not found');
            areEqual(Questions.find({askDatetime: {$gt: Date.now()}}).count(),0,'Past askDatetime should not have been found');
            areEqual(Questions.find({askTime: {$ne: _questionPastData.askTime}}).count(),0,'askTime not found');
            areEqual(Questions.find({tag: "reminder"}).count(),1,'Reminder tag not found');

            let checkqInitial = Questions.findOne();
            let initialAskTime = checkqInitial.askTime;
            areEqual(checkqInitial.askTime, VALID_ASK_TIME, 'Question did not get initialized properly');
            updateFutureReminderTimes( _questionPastData.username, VALID_ALTERNATE_ASK_TIME_DEFAULT);
            let checkq = Questions.findOne();
            areEqual(checkq.askTime, VALID_ASK_TIME, 'Question should not get updated');
            areEqual(checkq.askDatetime.toString(), checkqInitial.askDatetime.toString(), 'Question askDatetime should not get updated');
        });
    })
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

