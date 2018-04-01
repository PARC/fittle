/** TESTS FOR PARTICIPANTS API **/

import {TestHelpers} from '../../../../imports/test-helpers';
import {Faker} from '../../../../imports/test-helpers';
import {Participants, FIELDS} from '../participants';
describe("Participants collection and API", function () {

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
    const VALID_EMAIL = Faker.email();
    const INVALID_EMAIL = "bogus@parc.com";
    const MALFORMED_EMAIL = "user@isp";
    const VALID_STUDY_CONDITION = "initial_affirmation";

    /** Expected (error) messages. */
    const MISSING_EMAIL_ERR_MSG = "Email address is required";
    const MALFORMED_EMAIL_ERR_MSG = "Email address failed regular expression validation";
    const MISSING_CONDITION_ERR_MSG = "Study condition is required";

    const VALID_SELF_EFFICACY = 'high';
    const VALID_GOAL_TEXT = 'My goal';
    const VALID_SETTINGS = {selfEfficacy: VALID_SELF_EFFICACY};
    const VALID_PREFERENCES = {goalText: VALID_GOAL_TEXT};


    context("Inserting data.", function () {

        var _participantData = null;

        beforeEach(function () {
            _participantData = Participants.create(VALID_EMAIL, VALID_STUDY_CONDITION);
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should insert new document if all values are valid.", function () {
            // When
            Participants.insert(_participantData);
            // Then
            const participant = Participants.findOne(_participantData);
            isNotNull(participant, "Insert failed. Didn't receive inserted object");
            areEqual(participant.emailAddress, VALID_EMAIL);
            areEqual(participant.condition, VALID_STUDY_CONDITION);
        });

        it("Should throw error on missing email address.", function () {
            _participantData.emailAddress = null;
            const err = catchError(()=>Participants.insert(_participantData));
            isErrorWithMessage(err, MISSING_EMAIL_ERR_MSG);
        });
        it("Should throw error if email address is malformed.", function () {
            _participantData.emailAddress = MALFORMED_EMAIL;
            const err = catchError(()=>Participants.insert(_participantData));
            isErrorWithMessage(err, MALFORMED_EMAIL_ERR_MSG);
        });

        it("Should throw error if condition is null.", function () {
            _participantData.condition = null;
            const err = catchError(()=>Participants.insert(_participantData));
            isErrorWithMessage(err, MISSING_CONDITION_ERR_MSG);
        });

        it("Should throw error if condtion is empty string.", function () {
            _participantData.condition = Faker.EMPTY_STRING;
            const err = catchError(()=>Participants.insert(_participantData));
            isErrorWithMessage(err, MISSING_CONDITION_ERR_MSG);
        });

        it("Should throw error if condition is only whitespace.", function () {
            _participantData.condition = Faker.WHITESPACE_STRING;
            const err = catchError(()=>Participants.insert(_participantData));
            isErrorWithMessage(err, MISSING_CONDITION_ERR_MSG);
        });

        it("Should throw error if inserting participant with duplicate email address.", function () {
            Participants.insert(_participantData);

            // When -- Trying to insert participant with same email address
            const data = Participants.create(VALID_EMAIL, VALID_STUDY_CONDITION);
            const err = catchError(()=>Participants.insert(data));

            // Then -- Expect an error with a fun message.
            assert.instanceOf(err, Error);
            assert.include(err.message, "E11000 duplicate key error collection: meteor.participants");
        });
    });


    context("Retrieving condition for participant", function () {

        var _participantData = null;

        beforeEach(function () {
            _participantData = Participants.create(VALID_EMAIL, VALID_STUDY_CONDITION);
            Participants.insert(_participantData);
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should return condition if participant with given email address exists.", function () {
            const condition = Participants.getConditionForUser(VALID_EMAIL);
            areEqual(condition, VALID_STUDY_CONDITION);
        });

        it("Should throw an error if participant with given email address does not exist.", function () {
            const emailAddressForUserNotInSystem = "user@isp.com";
            assert.notEqualIgnoreCase(VALID_EMAIL, emailAddressForUserNotInSystem, "Test setup failed!");
            const err = catchError(() => Participants.getConditionForUser(emailAddressForUserNotInSystem));
            isNotNull(err);
        });

        it("Should throw error if argument is null", function () {
            const err = catchError(() => Participants.getConditionForUser(null));
            isNotNull(err);
        });
    });


    context("Retrieving setting value for participant", function () {

        var _participantData = null;

        beforeEach(function () {
            _participantData = Participants.create(VALID_EMAIL, VALID_STUDY_CONDITION, VALID_SETTINGS, VALID_PREFERENCES);
            Participants.insert(_participantData);
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should return setting if participant with given email address exists.", function () {
            const setting = Participants.getSettingForUser(VALID_EMAIL, 'selfEfficacy');
            areEqual(setting, VALID_SELF_EFFICACY);
        });

        it("Should throw an error if participant with given email address does not exist.", function () {
            const emailAddressForUserNotInSystem = "user@isp.com";
            assert.notEqualIgnoreCase(VALID_EMAIL, emailAddressForUserNotInSystem, "Test setup failed!");
            const err = catchError(() => Participants.getSettingForUser(emailAddressForUserNotInSystem));
            isNotNull(err);
        });

        it("Should throw error if argument is null", function () {
            const err = catchError(() => Participants.getSettingForUser(null));
            isNotNull(err);
        });
    });


    context("Retrieving preference value for participant", function () {

        var _participantData = null;

        beforeEach(function () {
            _participantData = Participants.create(VALID_EMAIL, VALID_STUDY_CONDITION, VALID_SETTINGS, VALID_PREFERENCES);
            Participants.insert(_participantData);
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should return preference if participant with given email address exists.", function () {
            const preference = Participants.getPreferenceForUser(VALID_EMAIL, 'goalText');
            areEqual(preference, VALID_GOAL_TEXT);
        });

        it("Should throw an error if participant with given email address does not exist.", function () {
            const emailAddressForUserNotInSystem = "user@isp.com";
            assert.notEqualIgnoreCase(VALID_EMAIL, emailAddressForUserNotInSystem, "Test setup failed!");
            const err = catchError(() => Participants.getPreferenceForUser(emailAddressForUserNotInSystem));
            isNotNull(err);
        });

        it("Should throw error if argument is null", function () {
            const err = catchError(() => Participants.getPreferenceForUser(null));
            isNotNull(err);
        });
    });

    context("Getting and Setting first level participant attributes", function () {

        let _participantData = null;
        let CHANGED_EMAIL = "changeme@parc.com";
        let CHANGED_CONDITION = "changedCondition";

        beforeEach(function () {
            _participantData = Participants.create(VALID_EMAIL, VALID_STUDY_CONDITION, VALID_SETTINGS, VALID_PREFERENCES);
            Participants.insert(_participantData);
        });

        afterEach(function () {
            TestHelpers.resetDatabase();
        });

        it("Should return null if participant with given email address does not exists.", function () {
            const attribute = Participants.getAttribute(INVALID_EMAIL, FIELDS.EMAIL);
            isNull(attribute, "Attribute should be null if there is no Participant with email address");
        });

        it("Should return null if attribute is not in Schema", function () {
            const attribute = Participants.getAttribute(VALID_EMAIL, "bogus");
            isNull(attribute, "Attribute should be null if attribute is not in Schema");
        });

        it("Should return value if attribute is in Schema", function () {
            let attribute = Participants.getAttribute(VALID_EMAIL, FIELDS.EMAIL);
            areEqual(attribute, VALID_EMAIL);
            attribute = Participants.getAttribute(VALID_EMAIL, FIELDS.CONDITION);
            areEqual(attribute, VALID_STUDY_CONDITION);
            attribute = Participants.getAttribute(VALID_EMAIL, FIELDS.SETTINGS);
            areEqual(JSON.stringify(attribute), JSON.stringify(VALID_SETTINGS));
            attribute = Participants.getAttribute(VALID_EMAIL, FIELDS.PREFERENCES);
            areEqual(JSON.stringify(attribute), JSON.stringify(VALID_PREFERENCES));
        });

        it("Should set value if attribute is in Schema", function () {
            let result = Participants.setAttribute(VALID_EMAIL, FIELDS.EMAIL, CHANGED_EMAIL);
            areEqual(result, true);
            let attribute2 = Participants.getAttribute(CHANGED_EMAIL, FIELDS.EMAIL);
            areEqual(attribute2, CHANGED_EMAIL);
            result = Participants.setAttribute(CHANGED_EMAIL, FIELDS.CONDITION, CHANGED_CONDITION);
            areEqual(result, true);
            attribute2 = Participants.getAttribute(CHANGED_EMAIL, FIELDS.CONDITION);
            areEqual(attribute2, CHANGED_CONDITION);
        });

        it("Should return false if setting attribute that is not in Schema", function () {
            const result = Participants.setAttribute(VALID_EMAIL, "bogus", "anything");
            areEqual(result, false);
        });


    });
});