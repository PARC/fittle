/**
 * Created by lnelson on 9/28/16.
 */
/**
 * Created by lnelson on 7/25/16.
 */
/** TESTS FOR PARTICIPANTS API **/

import {TestHelpers} from '../../../../imports/test-helpers';
import {Faker} from '../../../../imports/test-helpers';
import {Questions} from '../questions';
describe("Questions collection and API", function () {

    /** Helpers for test readability */
    const assert = TestHelpers.assert;
    const catchError = TestHelpers.catch;
    const isErrorWithMessage = TestHelpers.isErrorWithMessage;
    const isSanitizedErrorWithMessage = TestHelpers.isSanitizedErrorWithMessage;
    const areEqual = TestHelpers.areEqual;
    const isNotNull = assert.isNotNull;
    const isUndefined = TestHelpers.isUndefined;
    const isError = assert.isError;
    const areEqualTimestamps = TestHelpers.areEqualTimestamps;

    const testdate = new Date('2016, 9, 28');

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
    const VALID_ASK_DATE = testdate;
    const VALID_ASK_TIME = "09:00";
    const VALID_ASK_DAY = "1";
    const VALID_NONE_ALLOWED = false;
    const VALID_EXPIRE_DAY = "1";
    const VALID_EXPIRE_DATE = testdate;
    const VALID_EXPIRE_TIME = "10:00";
    const VALID_RESPONSE_FORMAT = "list-choose-one";
    const VALID_SEQUENCE = 1;
    const VALID_CHOICES = ["yes","no"];
    const VALID_ANSWERS = {
        yes: "yes",
        no: "no"
    };
    const VALID_TEXT = Faker.sentence();
    const VALID_TAG = "tag";
    const VALID_ATTRIBUTE_TO_SET = 'goalType';
    const VALID_NOTIFY = 'true';
    const VALID_ASK_TIME_DEFAULT = '00:00';
    const VALID_EXPIRE_TIME_DEFAULT = '23:59';
    const VALID_USERNAME = 'Rudolph.Reinder@parc.com';
    const VALID_TASK_ID = "z33ddGdAM6qFfk9pF";

    const CONDITION_MISSING = 'Study condition is required';
    const CONDITION_MALFORMED = 'bogus is not an allowed value';
    const ASK_DATE_MISSING = 'Ask date is required';
    const ASK_TIME_MISSING = 'Ask time is required';
    const ASK_TIME_MALFORMED = 'Ask time failed regular expression validation';
    const RESPONSE_FORMAT_MISSING = 'Response format is required';
    const RESPONSE_FORMAT_MALFORMED = 'bogus is not an allowed value';
    const TEXT_MISSING = 'Question text is required';
    const NAME_MISSING = 'Name of question is required';
    const CHOICES_MISSING = 'Choices is required';
    const CHOICES_MALFORMED = 'Choices must be an array';
    const NOTIFY_MALFORMED = 'Push Notifications must be a boolean';
    const EXPIRED_MALFORMED = 'Indicates expiration must be a boolean';
    const ASK_DATE_MALFORMED = 'Ask date must be a Date';
    const ASK_DATETIME_MALFORMED = 'Ask datetime must be a Date';
    const ANSWER_DATE_MALFORMED = 'Answer date must be a Date';
    const EXPIRE_DATE_MALFORMED = 'Expire date must be a Date';
    const EXPIRE_DATETIME_MALFORMED = 'Expire datetime must be a Date';
    const ANSWERED_MALFORMED = 'Indicates if answer given must be a boolean';
    const USERNAME_MISSING = 'Username of recipient is required';

    context("Inserting data.", function () {

        var _questionData = null;

        beforeEach(function () {
            _questionData = Questions.create(
                VALID_ASK_DATE,
                VALID_ASK_TIME,
                VALID_ATTRIBUTE_TO_SET,
                VALID_CHOICES,
                VALID_ANSWERS,
                VALID_EXPIRE_DATE,
                VALID_EXPIRE_TIME,
                VALID_NOTIFY,
                VALID_RESPONSE_FORMAT,
                VALID_SEQUENCE,
                VALID_NAME,
                VALID_TAG,
                VALID_TEXT,
                VALID_USERNAME,
                VALID_TASK_ID,
                VALID_NONE_ALLOWED,
                VALID_ASK_DAY,
                VALID_EXPIRE_DAY
            );
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should insert new document if all values are valid.", function () {
            // When
            Questions.insert(_questionData);
            // Then
            const question = Questions.findOne(_questionData);
            isNotNull(question, "Insert failed. Didn't receive inserted object");
            areEqualTimestamps(question.askDate, VALID_ASK_DATE);
            areEqual(question.askTime, VALID_ASK_TIME);
            areEqualTimestamps(question.expireDate, VALID_EXPIRE_DATE);
            areEqual(question.expireTime, VALID_EXPIRE_TIME);
            areEqual(question.responseFormat, VALID_RESPONSE_FORMAT);
            areEqual(question.sequence, VALID_SEQUENCE);
            areEqual(JSON.stringify(question.choices), JSON.stringify(VALID_CHOICES));
            areEqual(JSON.stringify(question.answers), JSON.stringify(VALID_ANSWERS));
            areEqual(question.text, VALID_TEXT);
            areEqual(question.tag, VALID_TAG);
            areEqual(question.name, VALID_NAME);
            areEqual(question.preferenceToSet, VALID_ATTRIBUTE_TO_SET);
            areEqual(question.notify, VALID_NOTIFY);
            areEqual(question.username, VALID_USERNAME);
        });

        it("Should throw error if text is null.", function () {
            _questionData.text = null;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, TEXT_MISSING);
        });

        it("Should throw error if text is only whitespace.", function () {
            _questionData.text = Faker.WHITESPACE_STRING;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, TEXT_MISSING);
        });

        it("Should throw error if text is empty string.", function () {
            _questionData.text = Faker.EMPTY_STRING;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, TEXT_MISSING);
        });

        it("Should throw error if askDate is null.", function () {
            _questionData.askDate = null;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, ASK_DATE_MISSING);
        });

        it("Should throw error if responseFormat is null.", function () {
            _questionData.responseFormat = null;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, RESPONSE_FORMAT_MISSING);
        });

        it("Should throw error if responseFormat is empty string.", function () {
            _questionData.responseFormat = Faker.EMPTY_STRING;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, RESPONSE_FORMAT_MISSING);
        });

        it("Should throw error if responseFormat is only whitespace.", function () {
            _questionData.responseFormat = Faker.WHITESPACE_STRING;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, RESPONSE_FORMAT_MISSING);
        });

        it("Should throw error if responseFormat is malformed.", function () {
            _questionData.responseFormat = MALFORMED_VALUE;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, RESPONSE_FORMAT_MALFORMED);
        });

        it("Should throw error if expired is malformed.", function () {
            _questionData.expired = MALFORMED_VALUE;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, EXPIRED_MALFORMED);
        });

        it("Should throw error if notify is malformed.", function () {
            _questionData.notify = MALFORMED_VALUE;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, RESPONSE_FORMAT_MALFORMED);
        });

        it("Should throw error if askDate is malformed.", function () {
            _questionData.askDate = MALFORMED_VALUE;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, ASK_DATE_MALFORMED);
        });

        it("Should throw error if askDatetime is malformed.", function () {
            _questionData.askDatetime = MALFORMED_VALUE;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, ASK_DATETIME_MALFORMED);
        });

        it("Should throw error if expireDate is malformed.", function () {
            _questionData.expireDate = MALFORMED_VALUE;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, EXPIRE_DATE_MALFORMED);
        });

        it("Should throw error if answerDate is malformed.", function () {
            _questionData.answerDate = MALFORMED_VALUE;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, ANSWER_DATE_MALFORMED);
        });

        it("Should throw error if expireDatetime is malformed.", function () {
            _questionData.expireDatetime = MALFORMED_VALUE;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, EXPIRE_DATETIME_MALFORMED);
        });

        it("Should throw error if answered is malformed.", function () {
            _questionData.answered = MALFORMED_VALUE;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, ANSWERED_MALFORMED);
        });

        it("Should throw error if choices is malformed.", function () {
            _questionData.choices = MALFORMED_VALUE;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, CHOICES_MALFORMED);
        });

        it("Should throw error if username is null.", function () {
            _questionData.username = null;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, USERNAME_MISSING);
        });

        it("Should throw error if username is empty string.", function () {
            _questionData.username = Faker.EMPTY_STRING;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, USERNAME_MISSING);
        });

        it("Should throw error if username is only whitespace.", function () {
            _questionData.username = Faker.WHITESPACE_STRING;
            const err = catchError(()=>Questions.insert(_questionData));
            isErrorWithMessage(err, USERNAME_MISSING);
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
