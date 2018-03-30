/**
 * Created by lnelson on 1/23/17.
 */
/**
 * Created by lnelson on 1/18/17.
 */
/** TESTS FOR PARTICIPANTS API **/

import {TestHelpers} from '/imports/test-helpers';
import {Faker} from '/imports/test-helpers';
import {Agents} from '../agents';
import {Promise} from 'meteor/promise';

describe("Agents collection and API", function () {
    /** Helpers for test readability */
    const assert = TestHelpers.assert;
    const catchError = TestHelpers.catch;
    const isErrorWithMessage = TestHelpers.isErrorWithMessage;
    const areEqual = TestHelpers.areEqual;
    const isNotNull = assert.isNotNull;
    const isNull = assert.isNull;
    const isUndefined = TestHelpers.isUndefined;
    const isError = assert.isError;

    /**
     * Values used throughout tests. Defined here to make code management easier, reduce
     * code duplication, and make understanding the schema a little easier.
     */
    const VALID_NAME = 'VALID_NAME';
    const INVALID_NAME = null;
    const VALID_EVENTS = ['start', 'stop', 'report'];
    const INVALID_EVENTS = ['invalid'];
    const VALID_URL = 'https://example.com';
    const INVALID_URL = 'woof';
    const MISSING = null;
    const MALFORMED_STRING = Array(102).join("a"); //string of length 101 > 100
    const MALFORMED_URL = 'http://'+MALFORMED_STRING+".com";

    /** Expected (error) messages. */
    const MISSING_NAME_ERR_MSG = "Name is required";
    const MISSING_URL_ERR_MSG = "URL is required";
    const MISSING_EVENTS_ERR_MSG = "Events to share with agent is required";
    const MALFORMED_NAME_ERR_MSG = "Name cannot exceed 100 characters";
    const MALFORMED_URL_ERR_MSG = "URL cannot exceed 100 characters";
    const INVALID_URL_ERR_MSG = "URL must be a valid URL";
    const MALFORMED_EVENTS_ERR_MSG = "invalid is not an allowed value";


    context("Inserting data.", function () {

        var _eventData = null;

        beforeEach(function () {
            _eventData = Agents.create(VALID_NAME, VALID_URL, VALID_EVENTS);
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should insert new document if all values are valid.", function () {
            // When
            Agents.insert(_eventData);
            // Then
            const agent = Agents.findOne(_eventData);
            isNotNull(agent, "Insert failed. Didn't receive inserted object");
            areEqual(agent.name, VALID_NAME);
            areEqual(agent.url, VALID_URL);
            areEqual(JSON.stringify(agent.events), JSON.stringify(VALID_EVENTS));
        });

        it("Should throw error if name is malformed.", function () {
            _eventData.name = MALFORMED_STRING;
            const err = catchError(()=>Agents.insert(_eventData));
            isErrorWithMessage(err, MALFORMED_NAME_ERR_MSG);
        });

        it("Should throw error on missing url.", function () {
            _eventData.url = null;
            const err = catchError(()=>Agents.insert(_eventData));
            isErrorWithMessage(err, MISSING_URL_ERR_MSG);
        });

        /* Needed to remove these test to allow urls like localhost:3000, which the SimpleSchema url regex disallows
        it("Should throw error if url is malformed.", function () {
            _eventData.url = MALFORMED_URL;
            const err = catchError(()=>Agents.insert(_eventData));
            isErrorWithMessage(err, MALFORMED_URL_ERR_MSG);
        });

        it("Should throw error if url is invalid.", function () {
            _eventData.url = INVALID_URL;
            const err = catchError(()=>Agents.insert(_eventData));
            isErrorWithMessage(err, INVALID_URL_ERR_MSG);
        });
        */

        it("Should throw error if events is malformed.", function () {
            _eventData.events = INVALID_EVENTS;
            const err = catchError(()=>Agents.insert(_eventData));
            isErrorWithMessage(err, MALFORMED_EVENTS_ERR_MSG);
        });

        it("Should throw error on missing events.", function () {
            _eventData.url = null;
            const err = catchError(()=>Agents.insert(_eventData));
            isErrorWithMessage(err, MISSING_URL_ERR_MSG);
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
