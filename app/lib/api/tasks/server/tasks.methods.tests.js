/** File contains tests to verify methods used for working with Tasks documents. */

import {TestHelpers} from '../../../../imports/test-helpers';
import {Faker} from '../../../../imports/test-helpers';
import {Tasks} from '../tasks';
import { chai } from 'meteor/practicalmeteor:chai';

/** Helpers for test readability */
const catchError = TestHelpers.catch;
const areEqual = TestHelpers.areEqual;
const isError = TestHelpers.isError;



//----------------------------------------------------------------------------------------------------------------------
//    Unit/Component Tests
//----------------------------------------------------------------------------------------------------------------------

import { _ } from 'meteor/underscore';
import {Participants} from '../../participants/participants';
import { Factory } from 'meteor/dburles:factory';
import { TasksHelpers } from '../tasks.helpers';

describe("Tasks Methods", function () {

   var _participant = null;
   var _loggedInUser = null;
   var _taskTitle = null;
   var _userId = null;


   beforeEach(function () {
      // Participant data was loaded into the system before the user downloaded the app.
      Faker.defineParticipantsCollection();
      _participant = Factory.create('participants');

      // The user installs the app and creates an account.
      _loggedInUser = {_id:"6rPt2tPs25TPhpTyY", primaryEmail:_participant.emailAddress};

      // A User account and its corresponding Participants document exists. (Copy the data into local variables.)
      _userId = _loggedInUser._id;
      _taskTitle = _participant.preferences.dailyGoalText;
   });


   afterEach(function () {
      _participant = null;
      _loggedInUser = null;
      _userId = null;
      _taskTitle = null;
      TestHelpers.resetDatabase();
   });


   describe("assignOneTaskForConsecutiveDays()", function () {

      /** Documents intended use of method. */
      context("Server successfully created a new User account.", function () {

         it("Should create a new Tasks document for each day of the study.", function () {
            // When -- A newly registered user is assigned Tasks for the entire challenge.
            TasksHelpers.assignOneTaskForConsecutiveDays(_userId, _taskTitle);

            // Then -- There should be the same number of tasks as study days
            var tasks = Tasks.find({"userId": _userId}).fetch();
            const expectedNumTasks = TasksHelpers.STUDY_LENGTH_IN_DAYS;
            areEqual(tasks.length, expectedNumTasks);

            // Then -- There should be one task per day of the study
            // See: http://stackoverflow.com/questions/27606211/meteor-return-unique-documents-from-collection
            // for help understanding the underscore function.
            var uniqueTasksByScheduledDate = _.uniq(tasks, false, function (task) {
               return task.scheduledDate;
            });
            areEqual(uniqueTasksByScheduledDate.length, expectedNumTasks);
         });

      });


      /** Tests documenting how to use method and/or what errors it should produce. */
      context("Method usage", function () {

         describe("Expected exceptions", function () {

            it("Should throw error if userId parameter is null", function () {
               const err = catchError( () => TasksHelpers.assignOneTaskForConsecutiveDays(null, _taskTitle));
               isError(err);
            });

            it("Should throw error if userId is empty string.", function () {
               const emptyString = Faker.EMPTY_STRING;
               const err = catchError( ()=> TasksHelpers.assignOneTaskForConsecutiveDays(emptyString, _taskTitle));
               isError(err);
            });

            it("Should throw error if userId is whitepsace string.", function () {
               const whitespaceString = Faker.WHITESPACE_STRING;
               const err = catchError( ()=> TasksHelpers.assignOneTaskForConsecutiveDays(whitespaceString, _taskTitle));
               isError(err);
            });

            it("Should throw error if taskTitle parameter is null.", function () {
               const err = catchError( ()=> TasksHelpers.assignOneTaskForConsecutiveDays(_userId, null));
               isError(err);
            });

            it("Should throw error if taskTitle parameter is empty string.", function () {
               const emptyString = Faker.EMPTY_STRING;
               const err = catchError(()=>TasksHelpers.assignOneTaskForConsecutiveDays(_userId, emptyString));
               isError(err);
            });

            it("Should throw error if taskTitle parameter is whitespace string.", function () {
               const whitespaceString = Faker.WHITESPACE_STRING;
               const err = catchError( () => TasksHelpers.assignOneTaskForConsecutiveDays(_userId, whitespaceString));
               isError(err);
            });

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


