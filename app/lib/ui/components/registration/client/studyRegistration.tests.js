/**
 * Test for client side new account registration. All tests should begin with a call to onSubmit().
 */

import { TestHelpers } from '../../../../../imports/test-helpers';
import { Faker } from '../../../../../imports/test-helpers';
import {StudyRegistrationPage} from './studyRegistration';

describe('Study Registration', function () {

   /**
    * Define known working and expected values here. These values can be used throughout the test, which
    * reduces duplication. And if the class implementation is updated thereby changing expectations, it's
    * easier to update the tests by defining the values at the top and together.
    */
   const VALID_EMAIL = "user@isp.comedy";
   const MALFORMED_EMAIL = "user@isp";
   const VALID_PASSWORD = "password";
   const MIN_PASSWORD_LENGTH = 4; // from StudyRegistrationValidationBuilder
   const MAX_PASSWORD_LENGTH = 20; // from StudyRegistrationValidationBuilder

   // Expected error messages.
   const INVALID_EMAIL_PROVIDED_ERR_MSG = "Must provide a valid email address.";
   const PASSWORD_MISMATCH_ERR_MSG = "Passwords do not match";
   const PASSWORD_TOO_SHORT_ERR_MSG = "Password must be at least 4 characters";
   const PASSWORD_TOO_LONG_ERR_MSG = "Password cannot exceed 20 characters";

   // Keys for accessing HTML form events. These keys should match what's used in the UI component.
   const kEmailAddress = "email-address";
   const kPassword = "password";
   const kPasswordConfirmation = "password-confirm";


   /**
    * Test helper constants for improved readability.
    */
   const catchError = TestHelpers.catch;
   const isErrorWithReason = TestHelpers.isErrorWithReason;
   const isTrue = TestHelpers.assert.isTrue;

   /** Well-formed, valid HTML form event stub. */
   let _eventStub;

   /** Instantiated StudyRegistrationPage object with the default error handling mocked. */
   let _studyRegistrationPage;

   /** Spy used for checking if StudyRegistrationPage mock error handler was called. */
   let _spyWasErrorHandlerCalled;


   /**
    * Create a valid form event object, and a StudyRegistrationPage object.
    */
   beforeEach(function(){

      // Create a valid HTML form submit event object.
      _eventStub = {
         'target' : {
            [kEmailAddress] : {value: VALID_EMAIL},
            [kPassword] : {value: VALID_PASSWORD},
            [kPasswordConfirmation] : {value: VALID_PASSWORD}
         },
         'preventDefault': function () {
            /** Stubbed method. */
         }
      };



      // Create StudyRegistrationPage object, and mock error handling so error aren't handled by the object.
      _studyRegistrationPage = new StudyRegistrationPage();
      _spyWasErrorHandlerCalled = false;
      _spyWasErrorHandlerCalled = false;
      StudyRegistrationPage.handleError = function(err){
         _spyWasErrorHandlerCalled = true;
         throw err;
      };

   });


   context('[Behavior Spec] User submits account registration', function() {
      

      context("Validating the email address.", function () {

         it('Should raise error with appropriate message if email address is malformed.', function () {
            _eventStub.target[kEmailAddress] = {value: MALFORMED_EMAIL};
            const err = catchError( () => _studyRegistrationPage.onSubmit(_eventStub) );
            isErrorWithReason(err, INVALID_EMAIL_PROVIDED_ERR_MSG);
         });

         /** Derived from the original spec: 'Should show raise error with appropriate message if any registration data is missing' */
         it('Should throw error with message is email address is missing.', function () {
            _eventStub.target[kEmailAddress].value = Faker.EMPTY_STRING;
            const err = catchError(()=>_studyRegistrationPage.onSubmit(_eventStub));
            isErrorWithReason(err, INVALID_EMAIL_PROVIDED_ERR_MSG);
         });

      });


      context("Validating the password.", function () {

         /** Derived from the original spec: 'Should show raise error with appropriate message if any registration data is missing' */
          it('Should throw error with appropriate message if password is empty string.', function () {
            _eventStub.target[kPassword].value = Faker.EMPTY_STRING;
            const err = catchError(()=>_studyRegistrationPage.onSubmit(_eventStub));
            isErrorWithReason(err, PASSWORD_TOO_SHORT_ERR_MSG);
         });

         /** Derived from the original spec: 'Should show raise error with appropriate message if passwords do not meet complexity requirements.' */
         it('Should throw error with message if password is whitespace string longer than min required password length.', function () {
            isTrue(Faker.WHITESPACE_STRING.length >= MIN_PASSWORD_LENGTH, "Test setup failed. Invalid assumption in test.");
            _eventStub.target[kPassword].value = Faker.WHITESPACE_STRING;
            const err = catchError(()=>_studyRegistrationPage.onSubmit(_eventStub));
            isErrorWithReason(err, PASSWORD_TOO_SHORT_ERR_MSG);
         });

         /** Derived from the original spec: 'Should show raise error with appropriate message if passwords do not meet complexity requirements.' */
         it('Should throw error with message if password is too short.', function () {
            const tooShortPassword = Faker.arbitraryStringOfLength(MIN_PASSWORD_LENGTH - 1);
            _eventStub.target[kPassword].value = tooShortPassword;
            const err = catchError(()=>_studyRegistrationPage.onSubmit(_eventStub));
            isErrorWithReason(err, PASSWORD_TOO_SHORT_ERR_MSG);
         });

         /** Derived from the original spec: 'Should show raise error with appropriate message if passwords do not meet complexity requirements.' */
         it('Should throw error with message is password is too long.', function () {
            const tooLongPassword = Faker.arbitraryStringOfLength(MAX_PASSWORD_LENGTH + 1);
            _eventStub.target[kPassword].value = tooLongPassword;
            const err = catchError(()=>_studyRegistrationPage.onSubmit(_eventStub));
            isErrorWithReason(err, PASSWORD_TOO_LONG_ERR_MSG);
         });


      });

      context("Validating password confirmation.", function () {

         it('Should show raise error with appropriate message if provided passwords do not match.', function () {
            _eventStub.target[kPasswordConfirmation].value = Faker.EMPTY_STRING;
            const err = catchError( () => _studyRegistrationPage.onSubmit(_eventStub) );
            isErrorWithReason(err, PASSWORD_MISMATCH_ERR_MSG);
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
