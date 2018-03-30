/**
 * Created by lnelson on 9/30/16.
 */
import {Configuration, CurrentStudy} from './studyConfiguration';
import {TestHelpers, Faker} from '../imports/test-helpers';
import {Studies} from '../lib/api/studies/studies';

/*
 ____________________________________

 IMPLEMENTATION-INTENTION-USE-CASES

 Mohan
 ____________________________________


 <2016-08-04 Thu>
 */

describe('SERVER: I2 Behavior Specification Test', function () {

    /** Helpers for test readability */
    const assert = TestHelpers.assert;
    const catchError = TestHelpers.catch;
    const isErrorWithMessage = TestHelpers.isErrorWithMessage;
    const areEqual = TestHelpers.areEqual;
    const isNotNull = assert.isNotNull;
    const isUndefined = TestHelpers.isUndefined;
    const isError = assert.isError;
    const isNullOrUndefined = TestHelpers.isNullOrUndefined;
    const isNotNullAndNotUndefined = TestHelpers.isNotNullAndNotUndefined;

    const _configurationData = Configuration.getData();
    const _currentStudy = CurrentStudy;

    beforeEach(function () {
        TestHelpers.resetDatabase();
        isNotNull(_currentStudy, "Current Study is not defined in Configuration data");
        isNotNull(Configuration, "Could not access Study Configuration");
        isNotNull(_configurationData, "Could not access any Study Configuration data");
    });

    afterEach(function () {
        TestHelpers.resetDatabase();
    });

    /*
     1 Study specification
     =====================

     1.1 Requirements
     ~~~~~~~~~~~~~~~~

     - Administrator be able specify a study by setting
     - a study-id
     - number of days the study runs for: 28 days for I2 study
     - contact person and their contact information
     - be able to access some reports
     - list of people signed up in the app in a condition-#


     1.2 pre-conditions
     ~~~~~~~~~~~~~~~~~~

     - None


     1.3 Post-conditions
     ~~~~~~~~~~~~~~~~~~~

     - An admin page
     - study-id
     - place to upload the participant list
     - place to update the contact person, contact information
     - a reporting panel displaying list of people in a condition-#


     1.4 Scenarios
     ~~~~~~~~~~~~~

     1. Administrator uploads information as JSON string
     - Example input { "study-id": "implementation-intention",
     "study-length": 28, "admin-person": "Admin Person",
     "admin-email": "admin.person@study.i2", "admin-phone": 12345 }
     2. Validate JSON
     3. If validation is positive
     1. create an admin page for the study
     4. If validation is negative
     1. report the line number the first failure occurs
     2. reject data
     3. prompt for re-upload
     */

    describe('Admin study set up.', function () {
        function _testStudyStringAttribute(attribute) {
            isNotNull(_configurationData.study[attribute], "No study data given for attribute " + attribute);
            areEqual(typeof _configurationData.study[attribute] === 'string', true, "Study " + attribute + " is not a string");
            areEqual(typeof _configurationData.study[attribute].trim() !== '', true, "Study " + attribute + " is whitespace");
        }

        context('Admin study information access.', function () {
            beforeEach(function () {
                isNotNull(_configurationData.study, "No basic study data defined");
            });

            it('Should provide a 28 day study', function () {
                isNotNull(_configurationData.study.studyLength, "No study length given");
                areEqual(typeof _configurationData.study.studyLength === 'number', true, "Study length is not a number");
                areEqual(_configurationData.study.studyLength > 0, true, "Study length is not a postive number");
            });

            it('Should provide a study name', function () {
                let studyName = Configuration.getName();
                areEqual(typeof studyName !== 'underfined', true, "Study name is undefined");
                isNotNull(studyName, "Study name is null");
                areEqual(typeof studyName === 'string', true, "Study name is not a string");
                areEqual(studyName.trim() !== '', true, "Study name is whitespace");
            });

            it('Should identify Study administrators by name, contact email address, and contact phone number', function () {
                _testStudyStringAttribute("adminName");
                _testStudyStringAttribute("adminPhone");
                _testStudyStringAttribute("adminEmail");
            });

            it('Should identify which study is active', function () {
                areEqual(Configuration.getName() === _currentStudy, true, "Study name does not match currently active study");
            });

            it('Should put current study configuration data in database if it is not there', function () {
                isNullOrUndefined(Studies.getByName(_currentStudy), "Study data should not be in database at start of test");
                Configuration.insertInDbIfNotThere();
                areEqual(Studies.find().count(), 1, "There should be one study in the database after insert");

                isNotNullAndNotUndefined(Studies.getByName(_currentStudy), "No study data found in database for current study");
            });

            it('Should not put current study configuration data in database if it is there', function () {
                areEqual(Studies.find().count(), 0, "There should be no studies in the database to start");
                isNullOrUndefined(Studies.getByName(_currentStudy), "Study data should not be in database at start of test");
                areEqual(Configuration.insertInDbIfNotThere(), true, "An insertion was not attempted");
                areEqual(Studies.find().count(), 1, "There should be one study in the database after insert");
                isNotNullAndNotUndefined(Studies.getByName(_currentStudy), "No study data found in database for current study");
                areEqual(Configuration.insertInDbIfNotThere(), false, "An insertion was attempted when ");
                isNotNullAndNotUndefined(Studies.getByName(_currentStudy), "No study data found in database for current study");
            });
        });

    });

    /**
     * Study set up tests are handled by the adminScheduledMessagesData.server.tests and server.methods.scheduledMessagesHelpers.tests
     */
    /*
     2 Implementation intention study setup
     ======================================

     2.1 Requirements
     ~~~~~~~~~~~~~~~~

     - Administrator be able to specify
     - conditions of the study
     - a set of goal-types
     - for each of goal-types, goal-relevance -> text explaining the
     relevance of the goal to their life
     - for each of the goal-types, a set of goal-specifics organized into
     two categories: difficult and easy
     - for each of goal-specifics, card content
     - for each of goal-type, implementation intention fields, acceptable
     values in the fields
     - for each of goal-specifics, a goal-base-text [note: has structure]
     - for each of goal-specifics, a reminder-base-text [note: this has
     structure that receives information from different inputs]
     - reminder-generic-schedule (a list of days) for all reminder=yes
     conditions [note: the schedule has time structure from the
     implementation intention setting step


     2.2 pre-conditions
     ~~~~~~~~~~~~~~~~~~

     - A specified study


     2.3 Post-conditions
     ~~~~~~~~~~~~~~~~~~~

     - A set of goal-types, goal-specifics, cards, implementation intention
     fields, and relevant associations

     2.4 Scenarios
     ~~~~~~~~~~~~~

     1. Administrator uploads a JSON string containing this information
     2. Validate input
     1. valid JSON format
     2. file contains all the fields in the example
     3. all (goal-type, goal-specific) tags used in fields should have
     been mapped to a string
     4. there doesn't exist a tag not connected to subsequent
     information
     5. card names exist in the data
     6. implementation intention structure must contain event-time and
     reminder duration
     3. If the file is validated
     - Display success and store information
     4. If cannot be validated
     - reject file, identify the first error, ask for re-upload
     5. Allow of data updation with

     */

    /**
     * Participant identification tests are handled by the adminParticipantData.server.tests
     */

    /*
     3 Participant identification
     ============================

     3.1 Requirements
     ~~~~~~~~~~~~~~~~

     - Administrator be able to whitelist participants in the study


     3.2 Pre-requisite
     ~~~~~~~~~~~~~~~~~

     - a study is specified and has an admin page


     3.3 Post-condition
     ~~~~~~~~~~~~~~~~~~

     - set of email-ids of whitelisted participant associated with a
     condition # and condition assignments


     3.4 Scenarios
     ~~~~~~~~~~~~~

     1. Administrator uploads a set of email-ids using a structured format
     in the admin panel for the study
     1. email-ids belong to qualified participants of the study, may be
     collected using a survey, must be verified
     - Example input
     { "email-id":"shakey@stanford.robot", "name":"Shakey Stanford",
     "condition-#":10, "demographics":{ "gender":"robot", "age":"42",
     "location":"Stanford AI lab" } "conditions":{
     "self-efficacy":"high", "implementation-intention":"yes",
     "reminders":"yes", "distribution":"masked",
     "number-of-reminders":7, }, "email-id":"test2@abc.com",
     "name":"Test Abc", "demographics":{ "gender":"human",
     "age":"22", "location":"somewhere far far away" }
     "condition-#":8, "conditions":{ "self-efficacy":"low",
     "implementation-intention":"yes", "reminders":"no" }, }
     2. Validate input
     1. Valid JSON
     2. condition fields exist in the study specification, the
     assignments belong to acceptable values
     3. If valid
     1. generate a list of participants
     4. If not validated,
     1. reject input, prompt for correction and re-input
     */

    /**
     * Participant sign-up is handled by studyRegistration.tests accountRegistrationServer.tests
     */
    /*
     4 Participant sign-up
     =====================

     4.1 Requirements
     ~~~~~~~~~~~~~~~~

     - User be able to create an account using the email address provided
     to the administrator and the study-code provided by the
     administrator
     - User introduced to the basic aspects of the app


     4.2 pre-conditions
     ~~~~~~~~~~~~~~~~~~

     - A specified study
     - A non-empty collection of participants (contains the user's email
     id) for the study with assigned condition-#, condition assignments


     4.3 Post-condition
     ~~~~~~~~~~~~~~~~~~

     - User account is created for the specified study
     - User remains logged in for future sessions on their device


     4.4 Scenarios
     ~~~~~~~~~~~~~

     1. Administrator directs the user to download the app
     2. User downloads the app
     3. On clicking the app icon, the user is taken to a login screen with
     an option to sign-up
     4. User clicks the sign-up option
     5. User enters the email address given to the administrator
     6. User enters the study-id provided to the participant
     7. If the email address is in the whitelisted email addresses for the
     study
     1. User is asked to create a password, asked to enter it again to
     make sure no errors are made
     2. User is assigned to a condition, while keeping the distribution
     of participants/conditions balanced
     3. User is logged in
     4. User is given an overview of how to use the app
     5. User performs goal-setting (goal-setting use-case)
     6. Keep user logged in
     8. If the email address is not in the whitelisted email addresses for
     the study
     1. The user is prompted that they might be using a wrong email
     address, recommended to verify the email address
     2. Provided the contact person info
     */
    //
    // This is handled by existing specifications and test
    //


    /*
     5 Participant log-in
     ====================

     5.1 Requirements
     ~~~~~~~~~~~~~~~~

     - User be able to enter their account in the study


     5.2 pre-conditions
     ~~~~~~~~~~~~~~~~~~

     - User has signed-up onto the study, has the correct email address and
     password


     5.3 Post-conditions
     ~~~~~~~~~~~~~~~~~~~

     - User lands on the activity page
     - User remains logged-in after log-in, unless they log-out


     5.4 Scenarios
     ~~~~~~~~~~~~~

     1. User navigates to the log-in page
     2. User is asked to enter their email-address, password
     3. If account details are correct
     1. User is taken to their activity page
     4. If account details aren't correct
     1. User is prompted about the error
     2. Provide password reset with their email, study-id
     3. If email exists in the study-id, reset password
     4. If not, provide contact name & number
     */
    //
    // This is handled by existing specifications and test
    //

    /*
     6 Training
     ==========

     [page pointing to a video or instruction]
     */
    //TODO: modify existing tranining material

    /**
     * Goal setting and Implementation Setting set up is handled by server.methods.scheduledMessages.tests
     * UI is verified by inspection
     */

    /*
     7 Goal setting
     ==============

     7.1 Requirements
     ~~~~~~~~~~~~~~~~

     - User be able to select a specific goal of a type predetermined in
     the study


     7.2 pre-conditions
     ~~~~~~~~~~~~~~~~~~

     - A set of goal-types, goal specifics and associated information
     - Conditions a user is associated with


     7.3 Post-conditions
     ~~~~~~~~~~~~~~~~~~~

     - A user identifier is associated with a goal-type, goal-relevance, a
     goal-specific, a goal-base-text, a goal content card


     7.4 Scenario
     ~~~~~~~~~~~~

     Applies only when the user enters the app the first time
     1. User is shown a set of goal-types along with goal-relevance
     2. User is asked to make a selection over goal-types
     3. Selected goal-type is associated with the user identifier
     4. Based on the selected goal-type and the self-efficacy condition,
     the user is shown a set of goal-specifics
     5. User is asked to make a selection over the goal-specifics
     6. Selected goal-specific and the related goal-content card is
     associated with user identifier
     7. On selection, user is asked to rate goal-specifics on a difficulty
     scale using a likert-scale. This value is stored for later analysis
     8. On answer, user identifier is associated with the measurements


     7.5 Notes
     ~~~~~~~~~

     - Is the user allowed to go back and change answers? Yes.


     8 Implementation intention setting
     ==================================

     8.1 Requirements
     ~~~~~~~~~~~~~~~~

     - User be able to set an implementation intention for the goal that
     they have selected


     8.2 pre-conditions
     ~~~~~~~~~~~~~~~~~~

     - goal-specific associated with the user identifier
     - implementation intention fields associated with the goal-specific


     8.3 Post-conditions
     ~~~~~~~~~~~~~~~~~~~

     - user identifier is associated with the implementation intention


     8.4 Scenario (occurs after goal-setting, only occurs when the user logs-in for the first time)
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

     1. Based on the goal-specific choice, user is asked to select/enter
     values for the associated implementation intention fields except
     reminder-duration
     2. if the user is in reminder condition, ask them to pick a reminder
     duration
     3. Associate user identifier with the implementation intention

     */

    /**
     * Goal display and reporting is handled by reportPage tests
     */

    /*
     9 Daily goal display
     ====================

     9.1 Requirements
     ~~~~~~~~~~~~~~~~

     - User be able to view their today's goal, access information cards


     9.2 Pre-requisite
     ~~~~~~~~~~~~~~~~~

     - User identifier be associated with goal-specific, goal-base-text,
     goal-content


     9.3 Post-condition
     ~~~~~~~~~~~~~~~~~~

     - none


     9.4 Scenario
     ~~~~~~~~~~~~

     1. User logs-in the application, clicks on daily activities tab (or
     accesses daily activities in any other way)
     2. User can view the goal they have to perform today and the number of
     days left in the challenge. The goal-text is generated from
     goal-base-text and a part of the implementation intention. The
     study assigns the same goal (goal-text, goal-type, goal-specific
     associated with the user identifier) for all 28 days the study runs
     for.
     3. Daily goal is accompanied with a reporting link. The actual
     reporting buttons are hidden from view. This is done to separate
     goal pursuit from reporting as we learned from user studies with
     NutriWalking.
     4. Daily goal is accompanied with a more-info link. On clicking the
     link, the user can access the card.


     10 Daily goal reporting
     =======================

     10.1 Requirements
     ~~~~~~~~~~~~~~~~~

     - User be able to report on their today's goal


     10.2 Pre-requisite
     ~~~~~~~~~~~~~~~~~~

     - User be assigned a daily goal
     - User remains logged-in


     10.3 Post-condition
     ~~~~~~~~~~~~~~~~~~~

     - User identifier is associated with the day, goal-specific, and the
     report


     10.4 Scenario
     ~~~~~~~~~~~~~

     1. User logs-in the application, clicks on the daily activities tab.
     2. User clicks on the reporting link
     3. User is given two options: yes or no along with the text - 'Did you
     achieve this goal?'
     4. User can pick on option
     5. User is allowed to change their reports for today.
     */
    //TODO: Modify or remove I2A Goal Reporting questions

    /**
     * Setting up of reminders is handled by server.methods.scheduledMessages.tests
     * UI for reminders is verified by inspections
     */
    /*
     11 Reminders
     ============

     11.1 Requirements
     ~~~~~~~~~~~~~~~~~

     - User be reminded of their goals if they are in the reminder = yes
     condition


     11.2 Pre-requisite
     ~~~~~~~~~~~~~~~~~~

     - User has a daily goal, has set an implementation intention, user has
     turned on their notifications
     - User identifier is associated with a reminder schedule


     11.3 Post-conditions
     ~~~~~~~~~~~~~~~~~~~~

     - none


     11.4 Scenario
     ~~~~~~~~~~~~~

     1. For every day appearing in the reminder_generic_schedule, generate
     a notification saying 'go to the app'
     2. Trigger the notification at time = event_time - reminder_duration
     (from implementation intentions)
     3. After the notification is posted the user can get to the app
     through following ways:
     1. on clicking the notification
     2. by opening the app directly
     4. If the event-time hasn't passed, display the reminder text in a
     modal pop-up. The reminder text is generated from the
     reminder_base_text and the implementation intention of the user.
     1. If the user acknowledges the reminder by clicking OK, display
     the activity screen.
     2. Capture and store this event.
     5. If the event-time has passed, display a generic message in a popup
     saying that the relevant event has passed. [Is this OK from a UX
     perspective?]
     */
//
// This is handled by exisiting scheduled messaging and new reminder scheduling logic and it unit tests
//


    /*
     12 Scoring
     ==========

     12.1 Requirements
     ~~~~~~~~~~~~~~~~~

     - Users are scored for their interactions with the app


     12.2 Pre-requisities
     ~~~~~~~~~~~~~~~~~~~~


     12.3 Post-conditions
     ~~~~~~~~~~~~~~~~~~~~


     12.4 Scenario
     ~~~~~~~~~~~~~

     1. Award 5 points for reporting on an activity
     2. Award 1 point for every time the app is opened
     3. If the user is in 'reminder=no' condition, randomly add 7 or 14
     points to their final score.
     - rationale is that users in 'reminder=yes' condition will be given
     1 additional opportunity to go to the app. This will occur 7 or
     14 times.
     */
    //TODO: New code to be added after scoring is finalized
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
