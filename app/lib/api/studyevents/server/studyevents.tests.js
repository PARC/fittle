/**
 * Created by lnelson on 1/18/17.
 */
/** TESTS FOR PARTICIPANTS API **/

import {TestHelpers} from '/imports/test-helpers';
import {Faker} from '/imports/test-helpers';
import {Studyevents} from '../studyevents';
import {Promise} from 'meteor/promise';

describe("Studyevents collection and API", function () {
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
    const VALID_NAME = 'VALID_STUDY_NAME';
    const INVALID_NAME = null;
    const VALID_KIND = 'report';
    const INVALID_KIND = 'invalid';
    const VALID_SOURCE = Faker.email();
    const VALID_DATA = {data: 'woof'};
    const MISSING = null;
    const MALFORMED_STRING = Array(102).join("a"); //string of length 101 > 100

    /** Expected (error) messages. */
    const MISSING_NAME_ERR_MSG = "Name of study is required";
    const MISSING_KIND_ERR_MSG = "Kind of event is required";
    const MISSING_SOURCE_ERR_MSG = "Information source is required";
    const MISSING_DATA_ERR_MSG = "Event specific data is required";
    const MALFORMED_NAME_ERR_MSG = "Name of study cannot exceed 100 characters";
    const MALFORMED_KIND_ERR_MSG = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa is not an allowed value";
    const MALFORMED_SOURCE_ERR_MSG = "Information source cannot exceed 100 characters";


    context("Inserting data.", function () {

        var _eventData = null;

        beforeEach(function () {
            _eventData = Studyevents.create(VALID_NAME, VALID_KIND, VALID_SOURCE, VALID_DATA);
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should insert new document if all values are valid.", function () {
            // When
            Studyevents.insert(_eventData);
            // Then
            const studyevent = Studyevents.findOne(_eventData);
            isNotNull(studyevent, "Insert failed. Didn't receive inserted object");
            areEqual(studyevent.studyName, VALID_NAME);
            areEqual(studyevent.kind, VALID_KIND);
            areEqual(studyevent.source, VALID_SOURCE);
            areEqual(JSON.stringify(studyevent.data), JSON.stringify(VALID_DATA));
        });

        it("Should throw error on missing name.", function () {
            _eventData.studyName = null;
            const err = catchError(()=>Studyevents.insert(_eventData));
            isErrorWithMessage(err, MISSING_NAME_ERR_MSG);
        });

        it("Should throw error if name is malformed.", function () {
            _eventData.studyName = MALFORMED_STRING;
            const err = catchError(()=>Studyevents.insert(_eventData));
            isErrorWithMessage(err, MALFORMED_NAME_ERR_MSG);
        });

        it("Should throw error on missing kind.", function () {
            _eventData.kind = null;
            const err = catchError(()=>Studyevents.insert(_eventData));
            isErrorWithMessage(err, MISSING_KIND_ERR_MSG);
        });

        it("Should throw error if kind is malformed.", function () {
            _eventData.kind = MALFORMED_STRING;
            const err = catchError(()=>Studyevents.insert(_eventData));
            isErrorWithMessage(err, MALFORMED_KIND_ERR_MSG);
        });

        it("Should throw error on missing source.", function () {
            _eventData.source = null;
            const err = catchError(()=>Studyevents.insert(_eventData));
            isErrorWithMessage(err, MISSING_SOURCE_ERR_MSG);
        });

        it("Should throw error if source is malformed.", function () {
            _eventData.source = MALFORMED_STRING;
            const err = catchError(()=>Studyevents.insert(_eventData));
            isErrorWithMessage(err, MALFORMED_SOURCE_ERR_MSG);
        });

        it("Should throw error on missing data.", function () {
            _eventData.data = null;
            const err = catchError(()=>Studyevents.insert(_eventData));
            isErrorWithMessage(err, MISSING_DATA_ERR_MSG);
        });

    });

});


import {HTTP} from 'meteor/http';

describe('Unit Test', function () {
    describe('Studyevents send', function () {
        /** Helpers for test readability */
        const assert = TestHelpers.assert;
        const catchError = TestHelpers.catch;
        const isErrorWithMessage = TestHelpers.isErrorWithMessage;
        const areEqual = TestHelpers.areEqual;
        const isNotNull = assert.isNotNull;
        const isNull = assert.isNull;
        const isUndefined = TestHelpers.isUndefined;
        const isError = assert.isError;
        const isNullOrUndefined = TestHelpers.isNullOrUndefined;
        const isNotNullAndNotUndefined = TestHelpers.isNotNullAndNotUndefined;

        /**
         * Values used throughout tests. Defined here to make code management easier, reduce
         * code duplication, and make understanding the schema a little easier.
         */
        const VALID_NAME = 'VALID_STUDY_NAME';
        const INVALID_NAME = null;
        const VALID_KIND = 'report';
        const INVALID_KIND = 'invalid';
        const VALID_SOURCE = Faker.email();
        const VALID_DATA = {data: 'woof'};
        const MISSING = null;
        const MALFORMED_STRING = Array(102).join("a"); //string of length 101 > 100

        /** Expected (error) messages. */
        const MISSING_NAME_ERR_MSG = "Name of study is required";
        const MISSING_KIND_ERR_MSG = "Kind of event is required";
        const MISSING_SOURCE_ERR_MSG = "Information source is required";
        const MISSING_DATA_ERR_MSG = "Event specific data is required";
        const MALFORMED_NAME_ERR_MSG = "Study name must be an array";
        const MALFORMED_KIND_ERR_MSG = "Kind of event must be an array";
        const MALFORMED_SOURCE_ERR_MSG = "Information source must be an array";

        context("Send http request", function () {
            var _eventData = null;
            let serverSeen = true;
            const url = 'https://parccoach-exagent.meteorapp.com/api/v1/ping/' + Meteor.settings.private.API_TOKEN;
            beforeEach(function (testSetUpDone) {
                if (Meteor.settings.private.RUN_COACH_SERVER_TEST) {
                    _eventData = Studyevents.create(VALID_NAME, VALID_KIND, VALID_SOURCE, VALID_DATA);
                    HTTP.call('GET', url,
                        function (error, response) {
                            if (error) {
                                console.log("ERROR: Test server: " + error.message);
                                serverSeen = false;
                            }
                            testSetUpDone();
                        })
                } else {
                    TestHelpers.resetDatabase();
                    testSetUpDone();
                }
            });

            afterEach(function () {
                TestHelpers.resetDatabase();
            });

            afterEach(function () {
                TestHelpers.resetDatabase();
            });

            it("Should receive response for valid request", function () {
                if (Meteor.settings.private.RUN_COACH_SERVER_TEST) {
                    this.timeout(8000);
                    areEqual(serverSeen, true, "No test server seen: " + Meteor.settings.private.PATH_TO_COACH_TEST_SERVER);
                    Studyevents.insert(_eventData);
                    // Then
                    const studyevent = Studyevents.findOne(_eventData);
                    isNotNull(studyevent, "Insert failed. Didn't receive inserted object");
                    areEqual(studyevent.studyName, VALID_NAME);
                    areEqual(studyevent.kind, VALID_KIND);
                    areEqual(studyevent.source, VALID_SOURCE);
                    areEqual(JSON.stringify(studyevent.data), JSON.stringify(VALID_DATA));
                    var callback = function (error, response) {
                        isNullOrUndefined(error, "Got error from test server");
                        isNotNull(response, "No response from test server");
                        done()
                    };
                    const makeCall = new Promise((resolve, reject) => {
                        const url = 'https://parccoach-exagent.meteorapp.com/api/v1/event/add/' + Meteor.settings.private.API_TOKEN;
                        Meteor.call('httpSend', 'POST', url, {data: studyevent},
                            (error, response) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(response);
                                }
                            })
                    });
                    return makeCall.then(function (response) {
                        isNotNull(response, "No response from test server");
                        isNotNull(response.content, "No content from test server");
                        areEqual(response.data.status, true);

                        /*
                         let returnValues = response.data.data;
                         areEqual(returnValues.studyName, VALID_NAME);
                         areEqual(returnValues.kind, VALID_KIND);
                         areEqual(returnValues.source, VALID_SOURCE);
                         areEqual(JSON.stringify(returnValues.data), JSON.stringify(VALID_DATA));
                         */

                    }).catch(err => {
                        throw new Meteor.Error(err)
                    });
                }
            });
            it("Should handle response for invalid request", function () {
                if (Meteor.settings.private.RUN_COACH_SERVER_TEST) {
                    this.timeout(8000);
                    areEqual(serverSeen, true, "No test server seen: " + Meteor.settings.private.PATH_TO_COACH_TEST_SERVER);
                    Studyevents.insert(_eventData);
                    // Then
                    const studyevent = Studyevents.findOne(_eventData);
                    isNotNull(studyevent, "Insert failed. Didn't receive inserted object");
                    areEqual(studyevent.studyName, VALID_NAME);
                    areEqual(studyevent.kind, VALID_KIND);
                    areEqual(studyevent.source, VALID_SOURCE);
                    areEqual(JSON.stringify(studyevent.data), JSON.stringify(VALID_DATA));
                    const makeCall = new Promise((resolve, reject) => {
                        Meteor.call('httpSend', 'POST', 'https://parccoach-exagent.meteorapp.com/api/v1/invalid/woof', {data: studyevent},
                            (error, response) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(response);
                                }
                            })
                    });
                    return makeCall.then(function (response) {
                        isNotNull(response, "No response from test server");
                        isNotNull(response.content, "No content from test server");
                        areEqual(response.status, false);

                        /*
                         let returnValues = response.data.data;
                         areEqual(returnValues.studyName, VALID_NAME);
                         areEqual(returnValues.kind, VALID_KIND);
                         areEqual(returnValues.source, VALID_SOURCE);
                         areEqual(JSON.stringify(returnValues.data), JSON.stringify(VALID_DATA));
                         */

                    }).catch(err => {
                        areEqual(err.response.statusCode, 404, "Error code not returned by coach agent");
                    });
                }
            });

        });

    })
});
