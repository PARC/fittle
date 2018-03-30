/**
 * Created by lnelson on 9/21/16.
 */
/**
 * Created by lnelson on 7/25/16.
 */
/** TESTS FOR PARTICIPANTS API **/

import {TestHelpers} from '../../../../imports/test-helpers';
import {Faker} from '../../../../imports/test-helpers';
import {Studies} from '../studies';
describe("Studies collection and API", function () {

    /** Helpers for test readability */
    const assert = TestHelpers.assert;
    const catchError = TestHelpers.catch;
    const isErrorWithMessage = TestHelpers.isErrorWithMessage;
    const isSanitizedErrorWithMessage = TestHelpers.isSanitizedErrorWithMessage;
    const areEqual = TestHelpers.areEqual;
    const isNotNull = assert.isNotNull;
    const isNull = assert.isNull;
    const isUndefined = TestHelpers.isUndefined;
    const isNullOrUndefined = TestHelpers.isNullOrUndefined;
    const isNotNullAndNotUndefined = TestHelpers.isNotNullAndNotUndefined;
    const isError = assert.isError;

    /**
     * Values used throughout tests. Defined here to make code management easier, reduce
     * code duplication, and make understanding the schema a little easier.
     */
    const VALID_STUDY_NAME = 'Implementation Intention Study';
    const INVALID_VALUE = "";
    const VALID_STUDY_LENGTH = 28;
    const INVALID_STUDY_LENGTH = 0;
    const VALID_ADMIN_NAME = 'Shiwali Mohan';
    const VALID_ADMIN_PHONE = '+1-650-812-4000';
    const VALID_ADMIN_EMAIL = 'Shiwali.Mohan@parc.com';

    const STUDY_NAME_MISSING = 'Name of study is required';
    const STUDY_LENGTH_MISSING = 'Number of days in study is required';
    const ADMIN_NAME_MISSING = 'Contact Name for Administrator is required';
    const ADMIN_EMAIL_MISSING = 'Contact Email for Administrator is required';
    const ADMIN_PHONE_MISSING = 'Contact Phone Number for Administrator is required';

    context("Inserting data.", function () {

        var _studyData = null;

        beforeEach(function () {
            _studyData = Studies.create(
                VALID_STUDY_NAME,
                VALID_STUDY_LENGTH,
                VALID_ADMIN_NAME,
                VALID_ADMIN_EMAIL,
                VALID_ADMIN_PHONE
            );
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should insert new document if all values are valid.", function () {
            Studies.insert(_studyData);
            const study = Studies.findOne(_studyData);
            isNotNull(study, "Insert failed. Didn't receive inserted object");
            areEqual(study.studyName, VALID_STUDY_NAME);
            areEqual(study.studyLength, VALID_STUDY_LENGTH);
            areEqual(study.adminName, VALID_ADMIN_NAME);
            areEqual(study.adminEmail, VALID_ADMIN_EMAIL);
            areEqual(study.adminPhone, VALID_ADMIN_PHONE);
        });

        it("Should throw error on missing study name.", function () {
            _studyData.studyName = null;
            const err = catchError(()=>Studies.insert(_studyData));
            isErrorWithMessage(err, STUDY_NAME_MISSING);
        });

        it("Should throw error on missing study length.", function () {
            _studyData.studyLength = null;
            const err = catchError(()=>Studies.insert(_studyData));
            isErrorWithMessage(err, STUDY_LENGTH_MISSING);
        });

        it("Should throw error on missing administrator name.", function () {
            _studyData.adminName = null;
            const err = catchError(()=>Studies.insert(_studyData));
            isErrorWithMessage(err, ADMIN_NAME_MISSING);
        });

        it("Should throw error on missing administrator email.", function () {
            _studyData.adminEmail = null;
            const err = catchError(()=>Studies.insert(_studyData));
            isErrorWithMessage(err, ADMIN_EMAIL_MISSING);
        });

        it("Should throw error on missing administrator phone number.", function () {
            _studyData.adminPhone = null;
            const err = catchError(()=>Studies.insert(_studyData));
            isErrorWithMessage(err, ADMIN_PHONE_MISSING);
        });

    });

    context("Retrieving data.", function () {

        var _studyData = null;

        beforeEach(function () {
            _studyData = Studies.create(
                VALID_STUDY_NAME,
                VALID_STUDY_LENGTH,
                VALID_ADMIN_NAME,
                VALID_ADMIN_EMAIL,
                VALID_ADMIN_PHONE
            );
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should return  document if study name found.", function () {
            Studies.insert(_studyData);
            const study = Studies.getByName(VALID_STUDY_NAME);
            isNotNullAndNotUndefined(study, "Retrieve failed. Didn't return inserted object");
            areEqual(study.studyName, VALID_STUDY_NAME);
            areEqual(study.studyLength, VALID_STUDY_LENGTH);
            areEqual(study.adminName, VALID_ADMIN_NAME);
            areEqual(study.adminEmail, VALID_ADMIN_EMAIL);
            areEqual(study.adminPhone, VALID_ADMIN_PHONE);
        });

        it("Should return null if study name not found.", function () {
            const study = Studies.getByName(VALID_STUDY_NAME);
            isNullOrUndefined(study, "Retrieve failed. Didn't return inserted object");
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
