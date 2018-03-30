/**
 * Created by lnelson on 7/25/16.
 */
/** TESTS FOR PARTICIPANTS API **/

import {TestHelpers} from '../../../../imports/test-helpers';
import {Faker} from '../../../../imports/test-helpers';
import {Scheduledmessages} from '../scheduledmessages';
describe("Scheduledmessages collection and API", function () {

    /** Helpers for test readability */
    const assert = TestHelpers.assert;
    const catchError = TestHelpers.catch;
    const isErrorWithMessage = TestHelpers.isErrorWithMessage;
    const isSanitizedErrorWithMessage = TestHelpers.isSanitizedErrorWithMessage;
    const areEqual = TestHelpers.areEqual;
    const isNotNull = assert.isNotNull;
    const isUndefined = TestHelpers.isUndefined;
    const isError = assert.isError;


    /**
     * Values used throughout tests. Defined here to make code management easier, reduce
     * code duplication, and make understanding the schema a little easier.
     */
    const MALFORMED_VALUE = "bogus";
    const VALID_CONSTRAINT = [
        {
            "attribute": "preferences.goalType",
            "value": "eatSlowly"
        }
    ];
    const VALID_NAME = "test_sequence";
    const VALID_ASK_DATE = "1";
    const VALID_ASK_TIME = "09:00";
    const VALID_EXPIRE_DATE = "1";
    const VALID_EXPIRE_TIME = "10:00";
    const VALID_RESPONSE_FORMAT = "list-choose-one";
    const VALID_SEQUENCE = 1;
    const VALID_CHOICES = "yes,no";
    const VALID_ANSWERS = {
        yes: "yes",
        no: "no"
    };
    const VALID_TEXT = Faker.sentence();
    const VALID_TAG = "tag";
    const VALID_ATTRIBUTE_TO_SET = 'goalType';
    const VALID_NOTIFY = true;
    const VALID_ASK_TIME_DEFAULT = '00:00';
    const VALID_EXPIRE_TIME_DEFAULT = '23:59';


    const CONDITION_MISSING = 'Study condition is required';
    const CONDITION_MALFORMED = 'bogus is not an allowed value'
    const ASK_DATE_MISSING = 'Ask date is required';
    const ASK_DATE_MALFORMED = 'Ask date failed regular expression validation'
    const ASK_TIME_MISSING = 'Ask time is required';
    const ASK_TIME_MALFORMED = 'Ask time failed regular expression validation'
    const RESPONSE_FORMAT_MISSING = 'Message kind is required';
    const RESPONSE_FORMAT_MALFORMED = 'bogus is not an allowed value'
    const TEXT_MISSING = 'Message text is required';
    const CHOICES_MISSING = 'Choices is required';
    const NOTIFY_MALFORMED = 'Push Notifications must be a boolean'

    context("Inserting data.", function () {

        var _scheduledmessageData = null;

        beforeEach(function () {
            _scheduledmessageData = Scheduledmessages.create(
                VALID_CONSTRAINT,
                VALID_ASK_DATE,
                VALID_ASK_TIME,
                VALID_EXPIRE_DATE,
                VALID_EXPIRE_TIME,
                VALID_RESPONSE_FORMAT,
                VALID_SEQUENCE,
                VALID_CHOICES,
                VALID_ANSWERS,
                VALID_TEXT,
                VALID_TAG,
                VALID_NAME,
                VALID_ATTRIBUTE_TO_SET,
                VALID_NOTIFY
            );
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should insert new document if all values are valid.", function () {
            // When
            Scheduledmessages.insert(_scheduledmessageData);
            // Then
            const scheduledmessage = Scheduledmessages.findOne(_scheduledmessageData);
            isNotNull(scheduledmessage, "Insert failed. Didn't receive inserted object");
            areEqual(JSON.stringify(scheduledmessage.constraints), JSON.stringify(VALID_CONSTRAINT));
            areEqual(scheduledmessage.askDate, VALID_ASK_DATE);
            areEqual(scheduledmessage.askTime, VALID_ASK_TIME);
            areEqual(scheduledmessage.expireDate, VALID_EXPIRE_DATE);
            areEqual(scheduledmessage.expireTime, VALID_EXPIRE_TIME);
            areEqual(scheduledmessage.responseFormat, VALID_RESPONSE_FORMAT);
            areEqual(scheduledmessage.sequence, VALID_SEQUENCE);
            areEqual(JSON.stringify(scheduledmessage.choices), JSON.stringify(VALID_CHOICES));
            areEqual(JSON.stringify(scheduledmessage.answers), JSON.stringify(VALID_ANSWERS));
            areEqual(scheduledmessage.text, VALID_TEXT);
            areEqual(scheduledmessage.tag, VALID_TAG);
            areEqual(scheduledmessage.name, VALID_NAME);
            areEqual(scheduledmessage.preferenceToSet, VALID_ATTRIBUTE_TO_SET);
            areEqual(scheduledmessage.notify, VALID_NOTIFY);
        });

        it("Should throw error if text is only whitespace.", function () {
            _scheduledmessageData.text = Faker.WHITESPACE_STRING;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, TEXT_MISSING);
        });

        it("Should throw error if askDate is null.", function () {
            _scheduledmessageData.askDate = null;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, ASK_DATE_MISSING);
        });

        it("Should throw error if askDate is empty string.", function () {
            _scheduledmessageData.askDate = Faker.EMPTY_STRING;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, ASK_DATE_MISSING);
        });

        it("Should throw error if askDate is only whitespace.", function () {
            _scheduledmessageData.askDate = Faker.WHITESPACE_STRING;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, ASK_DATE_MISSING);
        });

        it("Should throw error if askDate is malformed.", function () {
            _scheduledmessageData.askDate = MALFORMED_VALUE;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, ASK_DATE_MALFORMED);
        });

        it("Should default to midnight if askTime is null.", function () {
            _scheduledmessageData = Scheduledmessages.create(
                VALID_CONSTRAINT,
                VALID_ASK_DATE,
                null,
                VALID_EXPIRE_DATE,
                VALID_EXPIRE_TIME,
                VALID_RESPONSE_FORMAT,
                VALID_SEQUENCE,
                VALID_CHOICES,
                VALID_ANSWERS,
                VALID_TEXT,
                VALID_TAG,
                VALID_NAME,
                VALID_ATTRIBUTE_TO_SET,
                VALID_NOTIFY
            );
            Scheduledmessages.insert(_scheduledmessageData);
            areEqual(Scheduledmessages.findOne().askTime, VALID_ASK_TIME_DEFAULT);
        });

        it("Should default to midnight if askTime is empty string.", function () {
            _scheduledmessageData = Scheduledmessages.create(
                VALID_CONSTRAINT,
                VALID_ASK_DATE,
                Faker.EMPTY_STRING,
                VALID_EXPIRE_DATE,
                VALID_EXPIRE_TIME,
                VALID_RESPONSE_FORMAT,
                VALID_SEQUENCE,
                VALID_CHOICES,
                VALID_ANSWERS,
                VALID_TEXT,
                VALID_TAG,
                VALID_NAME,
                VALID_ATTRIBUTE_TO_SET,
                VALID_NOTIFY
            );
            Scheduledmessages.insert(_scheduledmessageData);
            areEqual(Scheduledmessages.findOne().askTime, VALID_ASK_TIME_DEFAULT);
        });

        it("Should default to midnight if askTime is only whitespace.", function () {
            _scheduledmessageData = Scheduledmessages.create(
                VALID_CONSTRAINT,
                VALID_ASK_DATE,
                Faker.WHITESPACE_STRING,
                VALID_EXPIRE_DATE,
                VALID_EXPIRE_TIME,
                VALID_RESPONSE_FORMAT,
                VALID_SEQUENCE,
                VALID_CHOICES,
                VALID_ANSWERS,
                VALID_TEXT,
                VALID_TAG,
                VALID_NAME,
                VALID_ATTRIBUTE_TO_SET,
                VALID_NOTIFY
            );
            Scheduledmessages.insert(_scheduledmessageData);
            areEqual(Scheduledmessages.findOne().askTime, VALID_ASK_TIME_DEFAULT);
        });

        it("Should default to minute before midnight if there is an expireDate and expireTime is null.", function () {
            _scheduledmessageData = Scheduledmessages.create(
                VALID_CONSTRAINT,
                VALID_ASK_DATE,
                VALID_ASK_TIME,
                VALID_EXPIRE_DATE,
                null,
                VALID_RESPONSE_FORMAT,
                VALID_SEQUENCE,
                VALID_CHOICES,
                VALID_ANSWERS,
                VALID_TEXT,
                VALID_TAG,
                VALID_NAME,
                VALID_ATTRIBUTE_TO_SET,
                VALID_NOTIFY
            );
            Scheduledmessages.insert(_scheduledmessageData);
            areEqual(Scheduledmessages.findOne().expireTime, VALID_EXPIRE_TIME_DEFAULT);
        });

        it("Should default to minute before midnight if there is an expireDate and expireTime is empty string.", function () {
            _scheduledmessageData = Scheduledmessages.create(
                VALID_CONSTRAINT,
                VALID_ASK_DATE,
                VALID_ASK_TIME,
                VALID_EXPIRE_DATE,
                Faker.EMPTY_STRING,
                VALID_RESPONSE_FORMAT,
                VALID_SEQUENCE,
                VALID_CHOICES,
                VALID_ANSWERS,
                VALID_TEXT,
                VALID_TAG,
                VALID_NAME,
                VALID_ATTRIBUTE_TO_SET,
                VALID_NOTIFY
            );
            Scheduledmessages.insert(_scheduledmessageData);
            areEqual(Scheduledmessages.findOne().expireTime, VALID_EXPIRE_TIME_DEFAULT);
        });

        it("Should default to minute before midnight if there is an expireDate and expireTime is only whitespace.", function () {
            _scheduledmessageData = Scheduledmessages.create(
                VALID_CONSTRAINT,
                VALID_ASK_DATE,
                VALID_ASK_TIME,
                VALID_EXPIRE_DATE,
                Faker.WHITESPACE_STRING,
                VALID_RESPONSE_FORMAT,
                VALID_SEQUENCE,
                VALID_CHOICES,
                VALID_ANSWERS,
                VALID_TEXT,
                VALID_TAG,
                VALID_NAME,
                VALID_ATTRIBUTE_TO_SET,
                VALID_NOTIFY
            );
            Scheduledmessages.insert(_scheduledmessageData);
            areEqual(Scheduledmessages.findOne().expireTime, VALID_EXPIRE_TIME_DEFAULT);
        });

        it("Should throw error if askTime is malformed.", function () {
            _scheduledmessageData.askTime = MALFORMED_VALUE;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, ASK_TIME_MALFORMED);
        });

        it("Should throw error if responseFormat is null.", function () {
            _scheduledmessageData.responseFormat = null;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, RESPONSE_FORMAT_MISSING);
        });

        it("Should throw error if responseFormat is empty string.", function () {
            _scheduledmessageData.responseFormat = Faker.EMPTY_STRING;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, RESPONSE_FORMAT_MISSING);
        });

        it("Should throw error if responseFormat is only whitespace.", function () {
            _scheduledmessageData.responseFormat = Faker.WHITESPACE_STRING;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, RESPONSE_FORMAT_MISSING);
        });

        it("Should throw error if responseFormat is malformed.", function () {
            _scheduledmessageData.responseFormat = MALFORMED_VALUE;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, RESPONSE_FORMAT_MALFORMED);
        });


        it("Should throw error if notify is malformed.", function () {
            _scheduledmessageData.notify = MALFORMED_VALUE;
            const err = catchError(()=>Scheduledmessages.insert(_scheduledmessageData));
            isErrorWithMessage(err, NOTIFY_MALFORMED);
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
