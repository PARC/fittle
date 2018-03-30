import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import {ClientNavigationHelper} from '/lib/startup/client/routes';
import moment from 'moment-timezone';





/**
 *
 * @requires meteor/aldeed:simple-schema
 */
export class AccountRegistrationValidationBuilder
{
   /** @return {Number} */
   static get MIN_PASSWORD_LENGTH() {
      return 4;
   }

   /** @return {Number} */
    static get MAX_PASSWORD_LENGTH() {
       return 20;
    }

    static get EMAIL_ADDRESS_REGEX() {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))$/;
    }

   static createEmailSchema(){
      return {
         type: String,
         label: "Email",
         optional: false,
         regEx: AccountRegistrationValidationBuilder.EMAIL_ADDRESS_REGEX,
         trim: true,
         max: 50
      };
   }

   static createPasswordSchema(){
      return {
         type: String,
         label: "Password",
         optional: false,
         min: AccountRegistrationValidationBuilder.MIN_PASSWORD_LENGTH,
         max: AccountRegistrationValidationBuilder.MAX_PASSWORD_LENGTH,
         trim: false
      };
   }

   static createPasswordConfirmationSchema(){
      return {
         type: String,
         label: "Password confirmation",
         optional: false,
         custom: function(){
            if (this.value !== this.field('password').value){
               return "passwordMismatch";
            }
         }
      };
   }

   static get customErrorMessages(){
      return {
         "passwordMismatch" : "Passwords do not match",
         "regEx": [
            {exp: AccountRegistrationValidationBuilder.EMAIL_ADDRESS_REGEX,
               msg: "Must provide a valid email address."}
         ]
      };
   }

   static createRegistrationFormValidator(){

      // Create the validator
      const validator = new SimpleSchema({
         'email' : AccountRegistrationValidationBuilder.createEmailSchema(),
         'password' : AccountRegistrationValidationBuilder.createPasswordSchema(),
         'passwordConfirmation' : AccountRegistrationValidationBuilder.createPasswordConfirmationSchema()
      });

      // Load custom messages
      validator.messages(AccountRegistrationValidationBuilder.customErrorMessages);

      return validator;
   }

}






/**
 * New user registration. Provides functionality to UI registration template.
 *
 * @locus client
 * @requires meteor/accounts-base
 * @requires 'meteor/kadira:flow-router'
 */
export class StudyRegistrationPage
{
   static get kEmailAddres () { return "email-address"; }

   static get kPassword () { return "password"; }

   static get kPasswordConfirmation () { return "password-confirm"; }

   
   constructor(){
      this._email = "";
      this._password = "";
      this._reenteredPassword = "";
   }


   onSubmit(event){
      try {
         event.preventDefault();
         this.validateRegistrationForm(event);
         console.log("Email: " + this._email + ", default: " + Session.get('defaultLogin'));
         Session.set("hasRegistered", false);
         this.createAccount();
      } catch(err){
         StudyRegistrationPage.handleError(err);
      }
   }


   validateRegistrationForm(event){
      this.extractValuesFromHtmlEvent(event);
      const formValidator = AccountRegistrationValidationBuilder.createRegistrationFormValidator();
      const formData = {"email": this._email, "password":this._password, "passwordConfirmation":this._reenteredPassword};
      formValidator.validate(formData);
   }

   extractValuesFromHtmlEvent(event){
      const target = event.target;
      this.extractEmail(target);
      this.extractPassword(target);
      this.extractReenteredPassword(target);
   }


   /** @param {object} target - HTML event target */
   extractEmail(target){
      const kEmailAddress = StudyRegistrationPage.kEmailAddres;
      this._email = target[kEmailAddress].value.trim().toLowerCase();
   }


   /** @param {object} target - HTML event target */
   extractPassword(target){
      const kPassword = StudyRegistrationPage.kPassword;
      this._password =  target[kPassword].value.trim();
   }


   /** @param {object} target - HTML event target. */
   extractReenteredPassword(target){
      const kPasswordConfirmation = StudyRegistrationPage.kPasswordConfirmation;
      this._reenteredPassword = target[kPasswordConfirmation].value.trim();
   }


   /** @requires meteor/accounts-base */
   createAccount(){
       console.log("*** create account, email: " + this._email);
       let myThis = this;
       Accounts.createUser({
             'email':this._email,
             'password':this._password,
             'profile': {'timezone': moment().utcOffset().toString()}},

             function(error) {
                 if (error){
                     StudyRegistrationPage.handleError(error);
                 }else {
                     console.log("*** registered, email: " + myThis._email);
                     Session.set("hasRegistered", true);
                     if (this._email && (myThis._email !== Session.get('defaultLogin'))) {
                         console.log("**** Saving defaultLogin " + myThis._email);
                         Session.set('defaultLogin', myThis._email);
                         Session.defaultLogin = myThis._email;
                     }
                     Session.defaultLogin = myThis._email;
                     // *** NOTE TODO:  Shoving into lobby group till someone changes the group
                     Meteor.call("addUserToTeam", myThis._email, "lobby");

                     ClientNavigationHelper.goToHomePage();
                 }
             }
         );
   }


   /** Non-static function so it can be mocked during testing. */
   static handleError(err){
      // this.nullifyMemberValues();
      StudyRegistrationPage.displayErrorMessageForUser(err.reason);
   }


   static displayErrorMessageForUser(errorMessage){
      console.log("Client :: Error :: " + errorMessage);
      StudyRegistrationPage.displayMessageInModalWindow(errorMessage);
   }


   static displayMessageInModalWindow(message){
        // Retrieve modal window from DOM
        const modal = $('#errorModal');
        // Configure the modal (using jQuery)
        modal.find('#modal-error-message').text(message);
        // Display error message
        modal.modal('show');
    }

}

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


