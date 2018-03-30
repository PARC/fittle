/** Test for client side new account registration. All tests should begin with onSubmit() */

import { TestHelpers } from '../../../../imports/test-helpers';
import { Faker } from '../../../../imports/test-helpers';
import { Factory } from 'meteor/dburles:factory';
import {StudyRegistrationPage} from './client/studyRegistration';
import {Meteor} from 'meteor/meteor';


describe('Study Registration', function () {

   /** Configure timeout for all tests in this suite. */
   this.timeout(5000);

   /** Valid constants used throughout tests. */
   const VALID_PASSWORD = "password";
   const EMAIL_ADDRESS_FOR_PARTICIPANT_WITH_ACCOUNT = "user@isp.com";

   /** Well-formed, valid HTML form event stub. */
   let _eventStub;

   /** Email address of a Participants document known to be in the system. */
   let _knownParticipantEmailAddress;

   /** Keys for accessing HTML form events. These keys should match what's used in the UI component. */
   const kEmailAddress = "email-address";
   const kPassword = "password";
   const kPasswordConfirmation = "password-confirm";

   /** Test helper constants for improved readability. */
   const isDefined = TestHelpers.assert.isDefined;
   const isTrue = TestHelpers.assert.isTrue;
   const areEqual = TestHelpers.areEqual;


   /**
    * Create a participant for whom there is an account. Create a participant for whom there is NOT an account
    * and a valid HTML form submit event object for the participant.
    */
   beforeEach(function (done) {

      /** Create a participant for whom there is no user account. */
      Faker.defineParticipantsCollection();
      _knownParticipantEmailAddress = Factory.create('participants').emailAddress;

      /** Create an event stub for that participant */
      _eventStub = {
         'target': {
            [kEmailAddress]: {value: _knownParticipantEmailAddress},
            [kPassword]: {value: VALID_PASSWORD},
            [kPasswordConfirmation]: {value: VALID_PASSWORD}
         },
         'preventDefault': function () {
            /** Stubbed method. */
         }
      };


      /** Create a participant and a user account for that participant. */
      Factory.create('participants', {"emailAddress":EMAIL_ADDRESS_FOR_PARTICIPANT_WITH_ACCOUNT});
      const sr = new StudyRegistrationPage();
      sr.callbackOnAccountCreate = function (error){
         if (error){ TestHelpers.assert.fail(null, null, "Test setup failed. Could not create user account.");
         } else {
            done();
         }
      };
      sr.onSubmit({
         'target': {
            [kEmailAddress]: {value: EMAIL_ADDRESS_FOR_PARTICIPANT_WITH_ACCOUNT},
            [kPassword]: {value: VALID_PASSWORD},
            [kPasswordConfirmation]: {value: VALID_PASSWORD}
         },
         'preventDefault': function () {
            /** Stubbed method. */
         }
      });


   });


   /** Clean the database. */
   afterEach(function () {
      _knownParticipantEmailAddress = null;
      TestHelpers.resetDatabase();
   });



   /** These tests should be executed only on the client. */
   if (Meteor.isClient) {

     describe('User submitted valid registration information.', function(){

         // /** Set timeout of 5 seconds for this test suite */
         // timeout(5000);

         let meteorAccountId;
         let clientCallbackWasRun;

         beforeEach(function (testSetupDone) {

            // Setup -- Use mock callback to access user ID that is returned to client on successful account creation.
            const mockCallback = function () {
               console.log("CALLED MOCK : StudyRegistrationPage.callbackOnAccountCreate()");
               clientCallbackWasRun = true;
               meteorAccountId = Meteor.userId();
               // Let Mocha know the setup is complete, so we can begin making assertions.
               testSetupDone();
            };

            // Create StudyRegistrationPage configured to use our mock callback.
            const studyRegistrationPage = new StudyRegistrationPage();
            studyRegistrationPage.callbackOnAccountCreate = mockCallback;

            // When -- User submits registration information.
            studyRegistrationPage.onSubmit(_eventStub);
         });


         it('Should create new user account.', function(){
            // Then
            isTrue(clientCallbackWasRun);
            isDefined(meteorAccountId);
         });

      });

      
      describe("User submits an email address tied to an existing account.", function () {

         let errorMessageDisplayed;

         beforeEach(function (testSetupDone) {

            const studyRegistrationPage = new StudyRegistrationPage();
            StudyRegistrationPage.displayErrorMessageForUser = function(errorMessage){
               console.log("CALLED MOCK : StudyRegistrationPage.displayErrorMessageForUser()");
               errorMessageDisplayed = errorMessage;
               testSetupDone();
            };
            // Modify event stub to simulate user who already has an account trying to create a new one
            _eventStub.target[kEmailAddress] = {value: EMAIL_ADDRESS_FOR_PARTICIPANT_WITH_ACCOUNT};
            studyRegistrationPage.onSubmit(_eventStub);

         });


         it("Should raise error with message.", function () {
            areEqual(errorMessageDisplayed, "Email already exists.");
         });


      });


      describe("User submits an email address not associated with a participant", function () {

         let errorMessageDisplayed;

         beforeEach(function (testSetupDone) {

            const studyRegistrationPage = new StudyRegistrationPage();
            StudyRegistrationPage.displayErrorMessageForUser = function(errorMessage){
               console.log("CALLED MOCK : StudyRegistrationPage.displayErrorMessageForUser()");
               errorMessageDisplayed = errorMessage;
               testSetupDone();
            };
            // Modify event stub to simulate user trying to register with an unrecognized email address.
            _eventStub.target[kEmailAddress] = {value: "unknownemailaddress@isp.com"};
            studyRegistrationPage.onSubmit(_eventStub);

         });

         //TODO: Implement test.
         it("Should navigate to help page.", function () {
            TestHelpers.testNotImplemented();
         });
      });

      //TODO: Implement test
      describe("Unexpected error on server prevents accounts from being created.", function () {
         it("Should display an error message.", function () {
            TestHelpers.testNotImplemented();
         });
      });

   }

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
