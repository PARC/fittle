/**
 * Unit tests for class used by server to validate new user registration.
 */


import { TestHelpers } from '../../../../../imports/test-helpers';
import { Factory } from 'meteor/dburles:factory';
import { AccountRegistration } from './accountRegistration';
import {Accounts} from 'meteor/accounts-base';
import {Faker} from '../../../../../imports/test-helpers';


describe('Study Registration', function () {

   const VALID_PASSWORD = "password";

   // Expected error messages.
   // const INVALID_EMAIL_PROVIDED_ERR_MSG = "Must provide a valid email address.";
   const UNRECOGNIZED_PARTICIPANT_ERR_MSG = "Unrecognized email address";
   const ACCOUNT_ALREADY_EXISTS_ERR_MSG = "An account already exists for this email";


   /** Test helper constants for improved readability. */
   const catchError = TestHelpers.catch;
   const isErrorWithReason = TestHelpers.isErrorWithReason;
   const isNullOrUndefined = TestHelpers.isNullOrUndefined;


   /** Email address of a Participants document known to be in the system. */
   let _knownParticipantEmailAddress;


   /** Create a known participant. */
   beforeEach(function () {
      Faker.defineParticipantsCollection();
      _knownParticipantEmailAddress = Factory.create('participants').emailAddress;
   });

   afterEach(function () {
      _knownParticipantEmailAddress = null;
      TestHelpers.resetDatabase();
   });


   context('Confirming email address is associated with a known participant', function () {

      it('Should not throw error if email address is associated with a known participant.', function () {
         const err = catchError(()=>AccountRegistration.confirmRegistrationIsAllowed(_knownParticipantEmailAddress));
         isNullOrUndefined(err);
      });

      it('Should throw error with message if email address is not associated with a known participant', function () {
         const unrecognizedEmailAddress = "user@isp.com";
         const err = catchError(()=>AccountRegistration.confirmRegistrationIsAllowed(unrecognizedEmailAddress));
         isErrorWithReason(err, UNRECOGNIZED_PARTICIPANT_ERR_MSG);
      });

   });
   

   context('Confirming there is not an existing account.', function () {

      it('Should not throw error if no account exists.', function () {
         const err = catchError(()=>AccountRegistration.confirmAccountDoesNotExistForEmailAddress(_knownParticipantEmailAddress));
         isNullOrUndefined(err);
      });

      it('Should raise error with appropriate message if account already exists for email address', function(){
         // Given -- An account already exists
         Accounts.createUser({'email':_knownParticipantEmailAddress, 'password':VALID_PASSWORD});
         // When, Then
         const err = catchError(()=>AccountRegistration.confirmRegistrationIsAllowed(_knownParticipantEmailAddress));
         isErrorWithReason(err, ACCOUNT_ALREADY_EXISTS_ERR_MSG);
      });

   });


   context('Creating a new account.', function () {

      it('Should not throw an error if registration information is valid and an account does not yet exist.', function(){
         const err = catchError( () => AccountRegistration.confirmRegistrationIsAllowed(_knownParticipantEmailAddress));
         isNullOrUndefined(err);
      });
      
   });

});