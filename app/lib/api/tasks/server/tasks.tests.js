/** Tests for CRUD operations performed with Tasks collection */




import {TestHelpers} from '../../../../imports/test-helpers';
import {Faker} from '../../../../imports/test-helpers';
import {Tasks} from '../tasks';

describe("Tasks collection and API", function () {

   /** Helpers for test readability */
   const assert = TestHelpers.assert;
   const catchError = TestHelpers.catch;
   const isErrorWithMessage = TestHelpers.isErrorWithMessage;
   const areEqual = TestHelpers.areEqual;
   const isNotNull = assert.isNotNull;
   const isUndefined = TestHelpers.isUndefined;
   const isError = assert.isError;
   const isNullOrUndefined = TestHelpers.isNullOrUndefined;
   const instanceOf = TestHelpers.assert.instanceOf;
   const isDefined = TestHelpers.assert.isDefined;
   const isTrue = TestHelpers.assert.isTrue;
   const isAfter = TestHelpers.isAfter;
   const areEqualTimestamps = TestHelpers.areEqualTimestamps;


   /**
    * Values used throughout tests. Defined here to make code management easier, reduce
    * code duplication, and make understanding the schema a little easier.
    */
   const VALID_USER_ID = "6rPt2tPs25TPhpTyY";
   const MALFORMED_USER_ID = "abcdefghijklmn";
   const VALID_EMAIL = "6rPt2tPs25TPhpTyY@example.com";
   const MALFORMED_EMAIL = "user@isp";
   const VALID_SCHEDULED_DATE = 5;
   const VALID_MIN_SCHEDULED_DATE = 0;
   const VALID_MAX_SCHEDULED_DATE = 365;
   const VALID_TITLE = "Eat Slowly";
   const VALID_TITLE_MAX_LENGTH = Faker.arbitraryStringOfLength(128);
   const INVALID_TITLE_TOO_LONG = Faker.arbitraryStringOfLength(129);
   const VALID_GOAL_MET_BOOLEAN = true;
   const INVALID_GOAL_MET_VALUE = 'true';
   const VALID_MAX_GOAL_DIFFICULTY = 5;
   const VALID_MIN_GOAL_DIFFICULTY = 1;
   const INVALID_NONNUMERIC_VALUE = 'a';
   const VALID_MAX_CONFIDENCE = 5;
   const VALID_MIN_CONFIDENCE = 1;
   const VALID_MAX_KEENNESS = 5;
   const VALID_MIN_KEENNESS = 1;
   const VALID_MAX_WORTH_EFFORT = 5;
   const VALID_MIN_WORTH_EFFORT = 1;




   /** Expected (error) messages. */
   const MISSING_USER_ID_ERR_MSG = "User ID is required";
   const MALFORMED_USER_ID_ERR_MSG = "User ID must be a valid alphanumeric ID";
   const USER_ID_UPDATE_ERR_MSG = "User ID cannot be set during an update";
   const SCHEDULED_DATE_MIN_ERR_MSG = "Scheduled day must be at least 0";
   const SCHEDULED_DATE_MAX_ERR_MSG = "Scheduled day cannot exceed 365";
   const SCHEDULED_DATE_MISSING_ERR_MSG = "Scheduled day is required";
   const SCHEDULED_DATE_UPDATE_ERR_MSG = "Scheduled day cannot be set during an update";
   const TITLE_MISSING_ERR_MSG = "Task title is required";
   const TITLE_TOO_LONG_ERR_MSG = "Task title cannot exceed 128 characters";
   const TITLE_UPDATE_ERR_MSG = "Task title cannot be set during an update";
   const GOAL_MET_NOT_BOOL_ERR_MSG = "Goal met must be a boolean";
   const GOAL_DIFFICULTY_NONNUMERIC_ERR_MSG = "Goal Difficulty must be a number";
   const GOAL_DIFFICULTY_MAX_ERR_MSG = "Goal Difficulty cannot exceed 5";
   const USER_CONFIDENCE_NONNUMERIC_ERR_MSG = "User Confidence must be a number";
   const USER_CONFIDENCE_MAX_ERR_MSG = "User Confidence cannot exceed 5";
   const USER_KEENNESS_NONNUMERIC_ERR_MSG = "Goal Keenness must be a number";
   const USER_KEENNESS_MAX_ERR_MSG = "Goal Keenness cannot exceed 5";
   const USER_GOAL_WORTH_EFFORT_NONNUMERIC_ERR_MSG = "User Goal Worth Effort must be a number";
   const USER_GOAL_WORTH_EFFORT_MAX_ERR_MSG = "User Goal Worth Effort cannot exceed 5";
   const MALFORMED_EMAIL_ERR_MSG = "Email address failed regular expression validation";


   context("Inserting data.", function () {

      var _taskData = null;

      beforeEach(function () {
         _taskData = Tasks.create(VALID_USER_ID, VALID_TITLE, VALID_SCHEDULED_DATE, VALID_EMAIL);
      });

      afterEach(function () {
         TestHelpers.resetDatabase();
      });

      it("Should insert new document if all values are valid.", function () {
         // When
         Tasks.insert(_taskData);
         // Then
         const task = Tasks.findOne(_taskData);
         isNotNull(task, "Failed to insert document into Tasks collection.");
         areEqual(task.userId, VALID_USER_ID);
         areEqual(task.title, VALID_TITLE);
         areEqual(task.scheduledDate, VALID_SCHEDULED_DATE);
         areEqual(task.emailAddress, VALID_EMAIL);
      });

      describe("User ID field", function () {

         it("Should thrown error if user ID is invalid format.", function () {
            _taskData.userId = MALFORMED_USER_ID;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, MALFORMED_USER_ID_ERR_MSG);
         });

         it("Should thrown error if user ID is null.", function () {
            _taskData.userId = null;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, MISSING_USER_ID_ERR_MSG);
         });

         it("Should throw error on attempt to update.", function () {
            // Given -- A task has been inserted into the database
            Tasks.insert(_taskData);

            // When -- Change the user id, and try to write back to database
            const task = Tasks.findOne(_taskData);
            const updatedUserId = VALID_USER_ID.substring(0, VALID_USER_ID.length-1) + "6";
            const modifier = {$set :{"userId":updatedUserId}};
            const err = catchError(()=> Tasks.update(task, modifier) );

            // Then -- Expect an error
            isErrorWithMessage(err, USER_ID_UPDATE_ERR_MSG );
         });
      });

      describe("Email address field", function () {

         it("Should throw error if email address is malformed.", function () {
            _taskData.emailAddress = MALFORMED_EMAIL;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, MALFORMED_EMAIL_ERR_MSG);
         });

      });

      describe("Scheduled date field", function () {

         it("Should not throw error if min value.", function () {
            _taskData.scheduledDate = VALID_MIN_SCHEDULED_DATE;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should throw error if less than min allowed value.", function () {
            _taskData.scheduledDate = VALID_MIN_SCHEDULED_DATE - 1;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, SCHEDULED_DATE_MIN_ERR_MSG);
         });

         it("Should not throw error if max allowed value.", function () {
            _taskData.scheduledDate = VALID_MAX_SCHEDULED_DATE;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should throw error if greater than max allowed value.", function () {
            _taskData.scheduledDate = VALID_MAX_SCHEDULED_DATE + 1;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, SCHEDULED_DATE_MAX_ERR_MSG);
         });

         it("Should throw error if missing.", function () {
            _taskData.scheduledDate = null;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, SCHEDULED_DATE_MISSING_ERR_MSG);
         });

         it("Should throw error when trying to update.", function () {
            // Given -- A task has been inserted into the database
            Tasks.insert(_taskData);
            const task = Tasks.findOne(_taskData);

            // When -- Change the scheduled day value, and try to write back to database
            const modifier = {$set :{"scheduledDate":VALID_SCHEDULED_DATE + 1}}
            const err = catchError(()=> Tasks.update(task, modifier) );

            // Then -- Expect an error
            isErrorWithMessage(err, SCHEDULED_DATE_UPDATE_ERR_MSG);
         });
      });

      describe("Title field", function () {

         it("Should throw error if null.", function () {
            _taskData.title = null;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, TITLE_MISSING_ERR_MSG);
         });

         it("Should throw error if empty string.", function () {
            _taskData.title = Faker.EMPTY_STRING;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, TITLE_MISSING_ERR_MSG);
         });

         it("Should throw error if whitespace string.", function () {
            _taskData.title = Faker.WHITESPACE_STRING;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, TITLE_MISSING_ERR_MSG);
         });

         it("Should not throw error if title is max length", function () {
            _taskData.title = VALID_TITLE_MAX_LENGTH;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should throw error if too long.", function () {
            _taskData.title = INVALID_TITLE_TOO_LONG;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, TITLE_TOO_LONG_ERR_MSG);
         });

         it("Should throw error on update.", function () {
            // Given -- A task has been inserted into the database
            Tasks.insert(_taskData);

            // When -- Change the title, and try to write back to database
            const task = Tasks.findOne(_taskData);
            const updatedTitle = VALID_TITLE + "_changed";
            const modifier = {$set :{"title":updatedTitle}};
            const err = catchError(()=> Tasks.update(task, modifier) );

            // Then -- Expect an error
            isErrorWithMessage(err, TITLE_UPDATE_ERR_MSG);
         });
      });

      describe("User Goal Met field", function () {

         it("Should not throw error if boolean value.", function () {
            _taskData.goalMet = VALID_GOAL_MET_BOOLEAN;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should throw error if non-boolean value entered", function () {
            _taskData.goalMet = INVALID_GOAL_MET_VALUE;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, GOAL_MET_NOT_BOOL_ERR_MSG);
         });

         it("Should not be required", function () {
            delete _taskData.goalMet;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should be able to be updated", function () {
            // Given -- A task has been inserted into the database
            Tasks.insert(_taskData);
            const task = Tasks.findOne(_taskData);

            // When -- Change the scheduled day value, and try to write back to database
            const modifier = {$set :{"goalMet":VALID_GOAL_MET_BOOLEAN}};

            const err = catchError(()=>Tasks.update(task, modifier));
            isUndefined(err);
         });
      });

      describe("User Goal Difficulty field", function () {

         it("Should not throw error if value is min.", function () {
            _taskData.goalDifficulty = VALID_MIN_GOAL_DIFFICULTY;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should not throw error if value is max.", function () {
            _taskData.goalDifficulty = VALID_MAX_GOAL_DIFFICULTY;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should throw error if value is over max.", function () {
            _taskData.goalDifficulty = VALID_MAX_GOAL_DIFFICULTY + 1;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, GOAL_DIFFICULTY_MAX_ERR_MSG);
         });


         it("Should throw error if non-numeric value entered", function () {
            _taskData.goalDifficulty = INVALID_NONNUMERIC_VALUE;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, GOAL_DIFFICULTY_NONNUMERIC_ERR_MSG);
         });

         it("Should not be required", function () {
            delete _taskData.goalDifficulty;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should be able to be updated", function () {
            // Given -- A task has been inserted into the database
            Tasks.insert(_taskData);
            const task = Tasks.findOne(_taskData);

            // When -- Change the scheduled day value, and try to write back to database
            const modifier = {$set :{"goalDifficulty":VALID_MIN_GOAL_DIFFICULTY}};

            const err = catchError(()=>Tasks.update(task, modifier));
            isUndefined(err);
         });
      });

      describe("User Confidence field", function () {

         it("Should not throw error if value is min.", function () {
            _taskData.goalConfidence = VALID_MIN_CONFIDENCE;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should not throw error if value is max.", function () {
            _taskData.goalConfidence = VALID_MAX_CONFIDENCE;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

        it("Should throw error if value is over max.", function () {
            _taskData.goalConfidence = VALID_MAX_CONFIDENCE+1;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, USER_CONFIDENCE_MAX_ERR_MSG);
         });

         it("Should throw error if non-numeric value entered", function () {
            _taskData.goalConfidence = INVALID_NONNUMERIC_VALUE;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, USER_CONFIDENCE_NONNUMERIC_ERR_MSG);
         });

         it("Should not be required", function () {
            delete _taskData.goalConfidence;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should be able to be updated", function () {
            // Given -- A task has been inserted into the database
            Tasks.insert(_taskData);
            const task = Tasks.findOne(_taskData);

            // When -- Change the scheduled day value, and try to write back to database
            const modifier = {$set :{"goalConfidence": VALID_MAX_CONFIDENCE}};

            const err = catchError(()=>Tasks.update(task, modifier));
            isUndefined(err);
         });
      });

      describe("User Goal Keenness field", function () {

         it("Should not throw error if value is min.", function () {
            _taskData.goalKeenness = VALID_MIN_KEENNESS;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should not throw error if value is max.", function () {
            _taskData.goalKeenness = VALID_MAX_KEENNESS;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

        it("Should throw error if value is over max.", function () {
            _taskData.goalKeenness = VALID_MAX_KEENNESS+1;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, USER_KEENNESS_MAX_ERR_MSG);
         });

         it("Should throw error if non-numeric value entered", function () {
            _taskData.goalKeenness = INVALID_NONNUMERIC_VALUE;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, USER_KEENNESS_NONNUMERIC_ERR_MSG);
         });

         it("Should not be required", function () {
            delete _taskData.goalKeenness;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should be able to be updated", function () {
            // Given -- A task has been inserted into the database
            Tasks.insert(_taskData);
            const task = Tasks.findOne(_taskData);

            // When -- Change the scheduled day value, and try to write back to database
            const modifier = {$set :{"goalKeenness": VALID_MAX_KEENNESS}};

            const err = catchError(()=>Tasks.update(task, modifier));
            isUndefined(err);
         });
      });

      describe("Goal Worth Effort field", function () {

         it("Should not throw error if value is min.", function () {
            _taskData.goalWorthEffort = VALID_MIN_WORTH_EFFORT;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should not throw error if value is max.", function () {
            _taskData.goalWorthEffort = VALID_MAX_WORTH_EFFORT;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

        it("Should throw error if value is over max.", function () {
            _taskData.goalWorthEffort = VALID_MAX_WORTH_EFFORT+1;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, USER_GOAL_WORTH_EFFORT_MAX_ERR_MSG);
         });

         it("Should throw error if non-numeric value entered", function () {
            _taskData.goalWorthEffort = INVALID_NONNUMERIC_VALUE;
            const err = catchError(()=>Tasks.insert(_taskData));
            isErrorWithMessage(err, USER_GOAL_WORTH_EFFORT_NONNUMERIC_ERR_MSG);
         });

         it("Should not be required", function () {
            delete _taskData.goalWorthEffort;
            const err = catchError(()=>Tasks.insert(_taskData));
            isUndefined(err);
         });

         it("Should be able to be updated", function () {
            // Given -- A task has been inserted into the database
            Tasks.insert(_taskData);
            const task = Tasks.findOne(_taskData);

            // When -- Change the scheduled day value, and try to write back to database
            const modifier = {$set :{"goalWorthEffort": VALID_MAX_WORTH_EFFORT}};

            const err = catchError(()=>Tasks.update(task, modifier));
            isUndefined(err);
         });
      }); 

      describe("Report created at field", function () {

         it("Is null when Task is created", function () {
            const data = Tasks.create(VALID_USER_ID, VALID_TITLE, VALID_SCHEDULED_DATE, VALID_EMAIL);
            const taskId = Tasks.insert(data);
            const task = Tasks.find({"_id":taskId});
            assert.isDefined(task, "Task is undefined. Something went wrong with setup.");
            TestHelpers.isNullOrUndefined(task.reportCreatedAt);
         });

      });

   });


   context("Updated data.", function () {

      let _taskId;

      const VALID_GOAL_CONFIDENCE_VALUE = 3;
      const VALID_GOAL_DIFFICULTY_VALUE = 3;
      const VALID_USER_GOAL_KEENNESS_VALUE= 3;
      const VALID_USER_GOAL_WORTH_EFFORT_VALUE = 3;
      const VALID_GOAL_MET_VALUE = true;

      const CONFIDENCE_FIELD = 'goalConfidence';
      const GOAL_DIFFICULTY_FIELD = 'goalDifficulty';
      const GOAL_MET_FIELD = 'goalMet';
      const USER_GOAL_KEENNESS_FIELD = 'goalKeenness';
      const USER_GOAL_WORTH_EFFORT_FIELD = 'goalWorthEffort';

      /** Helper function for updating task values. */
      const updateTask = function (field, value){
         Tasks.update(_taskId, { $set: { [field]:  value } });
      }



      context("Adding report information for the first time.", function () {

         beforeEach(function(){
            // Create a valid Task that can updated in each of the tests.
            const data = Tasks.create(VALID_USER_ID, VALID_TITLE, VALID_SCHEDULED_DATE, VALID_EMAIL);
            _taskId = Tasks.insert(data);

            // Check the test is properly setup
            const task = Tasks.findOne({"_id":_taskId});
            assert.isDefined(task, "Task is undefined. Something went wrong with setup.");
            TestHelpers.isNullOrUndefined(task.reportCreatedAt);
            TestHelpers.isNullOrUndefined(task.goalMet);
            TestHelpers.isNullOrUndefined(task.goalConfidence);
            TestHelpers.isNullOrUndefined(task.goalDifficulty);
         });

         describe("Report created at field.", function () {

            it("Should set value when when 'goalMet' field is set.", function () {
               // When
               updateTask(GOAL_MET_FIELD, VALID_GOAL_MET_VALUE);
               // Then
               const task = Tasks.findById(_taskId);
               isDefined(task.reportCreatedAt);
               instanceOf(task.reportCreatedAt, Date);
            });

            it("Should set value when 'goalDifficulty' field is set.", function () {
               // When
               updateTask(GOAL_DIFFICULTY_FIELD, VALID_GOAL_DIFFICULTY_VALUE);
               // Then
               const task = Tasks.findById(_taskId);
               isDefined(task.reportCreatedAt);
               instanceOf(task.reportCreatedAt, Date);
            });

            it("Should set value when 'goalConfidence' field is set.", function () {
               // When
               updateTask(CONFIDENCE_FIELD, VALID_GOAL_CONFIDENCE_VALUE);
               // Then
               const task = Tasks.findById(_taskId);
               isDefined(task.reportCreatedAt);
               instanceOf(task.reportCreatedAt, Date);
            });
            it("Should set value when 'Goal Keenness' field is set.", function () {
               // When
               updateTask(USER_GOAL_KEENNESS_FIELD, VALID_USER_GOAL_KEENNESS_VALUE);
               // Then
               const task = Tasks.findById(_taskId);
               isDefined(task.reportCreatedAt);
               instanceOf(task.reportCreatedAt, Date);
            });
            it("Should set value when 'Goal Worth Effort' field is set.", function () {
               // When
               updateTask(USER_GOAL_WORTH_EFFORT_FIELD, VALID_USER_GOAL_WORTH_EFFORT_VALUE);
               // Then
               const task = Tasks.findById(_taskId);
               isDefined(task.reportCreatedAt);
               instanceOf(task.reportCreatedAt, Date);
            });




         });

         describe("Report updated at field.", function () {

            it("Should set value equal to 'reportCreatedAt' field when when 'goalMet' field is set.", function () {
               // When
               updateTask(GOAL_MET_FIELD, VALID_GOAL_MET_VALUE);
               // Then
               const task = Tasks.findById(_taskId);
               isDefined(task.reportUpdatedAt);
               instanceOf(task.reportUpdatedAt, Date);
               areEqual(task.reportCreatedAt.getTime(), task.reportUpdatedAt.getTime());
            });

            it("Should set value equal to 'reportCreatedAt' field when 'goalDifficulty' field is set.", function () {
               // When
               updateTask(GOAL_DIFFICULTY_FIELD, VALID_GOAL_DIFFICULTY_VALUE);
               // Then
               const task = Tasks.findById(_taskId);
               isDefined(task.reportUpdatedAt);
               instanceOf(task.reportUpdatedAt, Date);
               areEqual(task.reportCreatedAt.getTime(), task.reportUpdatedAt.getTime());
            });

            it("Should set value equal to 'reportCreatedAt' field when 'goalConfidence' field is set.", function () {
               // When
               updateTask(CONFIDENCE_FIELD, VALID_GOAL_CONFIDENCE_VALUE);
               // Then
               const task = Tasks.findById(_taskId);
               isDefined(task.reportUpdatedAt);
               instanceOf(task.reportUpdatedAt, Date);
               areEqual(task.reportCreatedAt.getTime(), task.reportUpdatedAt.getTime());
            });

            it("Should set value equal to 'reportCreatedAt' field when 'Goal Keenness' field is set.", function () {
               // When
               updateTask(USER_GOAL_KEENNESS_FIELD, VALID_USER_GOAL_KEENNESS_VALUE);
               // Then
               const task = Tasks.findById(_taskId);
               isDefined(task.reportUpdatedAt);
               instanceOf(task.reportUpdatedAt, Date);
               areEqual(task.reportCreatedAt.getTime(), task.reportUpdatedAt.getTime());
            });

            it("Should set value equal to 'reportCreatedAt' field when 'goalConfidence' field is set.", function () {
               // When
               updateTask(USER_GOAL_WORTH_EFFORT_FIELD, VALID_USER_GOAL_WORTH_EFFORT_VALUE);
               // Then
               const task = Tasks.findById(_taskId);
               isDefined(task.reportUpdatedAt);
               instanceOf(task.reportUpdatedAt, Date);
               areEqual(task.reportCreatedAt.getTime(), task.reportUpdatedAt.getTime());
            });


         });

      });

      context("Adding/updating additional report information.", function () {

         let _task;

         beforeEach(function(){
            // Create a valid Task that can updated in each of the tests.

            // Setup -- A Task was created...
            const data = Tasks.create(VALID_USER_ID, VALID_TITLE, VALID_SCHEDULED_DATE, VALID_EMAIL);
            _taskId = Tasks.insert(data);

            // Given -- ...and then report on.
            updateTask(GOAL_MET_FIELD, VALID_GOAL_MET_VALUE);

            // Check the test is properly setup.
            _task = Tasks.findById(_taskId);
            assert.isDefined(_task, "Task is undefined. Something went wrong with setup.");
            isTrue(_task.goalMet);
            isNullOrUndefined(_task.goalDifficulty);
            isNullOrUndefined(_task.goalConfidence);

            // Critical that we confirm these values are defined and begin with the same value.
            assert.isDefined(_task.reportCreatedAt);
            assert.isDefined(_task.reportUpdatedAt);
            areEqual(_task.reportCreatedAt.getTime(), _task.reportUpdatedAt.getTime());
         });

         context("Updating 'goalMet' field.", function () {

            beforeEach(function () {
               updateTask(GOAL_MET_FIELD, false);
            });

            it("Should not change 'reportCreatedAt' field.", function (){
               const updatedTask = Tasks.findById(_task._id);
               areEqualTimestamps(_task.reportCreatedAt, updatedTask.reportCreatedAt);
            });

            it("Should update 'reportUpdatedAt' field.", function () {
               const updatedTask = Tasks.findById(_task._id);
               isAfter(updatedTask.reportUpdatedAt, updatedTask.reportCreatedAt);
            });

         });

         context("Updating 'goalDifficulty' field.", function () {

            beforeEach(function () {
               updateTask(GOAL_DIFFICULTY_FIELD, VALID_GOAL_DIFFICULTY_VALUE);
            });

            it("Should not change 'reportCreatedAt' field.", function (){
               const updatedTask = Tasks.findById(_task._id);
               areEqualTimestamps(_task.reportCreatedAt, updatedTask.reportCreatedAt);
            });

            it("Should update 'reportUpdatedAt' field.", function () {
               const updatedTask = Tasks.findById(_task._id);
               isAfter(updatedTask.reportUpdatedAt, updatedTask.reportCreatedAt);
            });

         });

         context("Updating 'goalConfidence' field.", function () {

            beforeEach(function () {
               updateTask(CONFIDENCE_FIELD, VALID_GOAL_CONFIDENCE_VALUE);
            });

            it("Should not change 'reportCreatedAt' field.", function (){
               const updatedTask = Tasks.findById(_task._id);
               areEqualTimestamps(_task.reportCreatedAt, updatedTask.reportCreatedAt);
            });

            it("Should update 'reportUpdatedAt' field.", function () {
               const updatedTask = Tasks.findById(_task._id);
               isAfter(updatedTask.reportUpdatedAt, updatedTask.reportCreatedAt);
            });

         });

        context("Updating 'Goal Keenness' field.", function () {

            beforeEach(function () {
               updateTask(USER_GOAL_KEENNESS_FIELD, VALID_USER_GOAL_KEENNESS_VALUE);
            });

            it("Should not change 'reportCreatedAt' field.", function (){
               const updatedTask = Tasks.findById(_task._id);
               areEqualTimestamps(_task.reportCreatedAt, updatedTask.reportCreatedAt);
            });

            it("Should update 'reportUpdatedAt' field.", function () {
               const updatedTask = Tasks.findById(_task._id);
               isAfter(updatedTask.reportUpdatedAt, updatedTask.reportCreatedAt);
            });

         });

        context("Updating 'Goal Worth Effort' field.", function () {

            beforeEach(function () {
               updateTask(USER_GOAL_WORTH_EFFORT_FIELD, VALID_USER_GOAL_WORTH_EFFORT_VALUE);
            });

            it("Should not change 'reportCreatedAt' field.", function (){
               const updatedTask = Tasks.findById(_task._id);
               areEqualTimestamps(_task.reportCreatedAt, updatedTask.reportCreatedAt);
            });

            it("Should update 'reportUpdatedAt' field.", function () {
               const updatedTask = Tasks.findById(_task._id);
               isAfter(updatedTask.reportUpdatedAt, updatedTask.reportCreatedAt);
            });

         });


      });
   });

    context("Clone object.", function () {

        let _task;

        const VALID_GOAL_CONFIDENCE_VALUE = 3;
        const VALID_GOAL_DIFFICULTY_VALUE = 3;
        const VALID_USER_GOAL_KEENNESS_VALUE= 3;
        const VALID_USER_GOAL_WORTH_EFFORT_VALUE = 3;
        const VALID_GOAL_MET_VALUE = true;

        const CONFIDENCE_FIELD = 'goalConfidence';
        const GOAL_DIFFICULTY_FIELD = 'goalDifficulty';
        const GOAL_MET_FIELD = 'goalMet';
        const USER_GOAL_KEENNESS_FIELD = 'goalKeenness';
        const USER_GOAL_WORTH_EFFORT_FIELD = 'goalWorthEffort';

        context("Clone valid task", function () {

            beforeEach(function(){
                // Create a valid Task that can updated in each of the tests.
                _task = Tasks.create(VALID_USER_ID, VALID_TITLE, VALID_SCHEDULED_DATE, VALID_EMAIL);
                let now = new Date();
                _task.createdAt = now;
                _task.reportCreatedAt = now;
                _task.reportUpdatedAt = now;
            });

            describe("Validate valid clone.", function () {

                it("Should clone field values", function () {
                    a_cloned_task = Tasks.clone(_task);
                    console.log(a_cloned_task);
                    areEqual(_task._id, a_cloned_task._id, "_id is not cloned properly");
                    areEqual(_task.userId, a_cloned_task.userId, "userId is not cloned properly");
                    areEqual(_task.emailAddress, a_cloned_task.emailAddress, "emailAddress is not cloned properly");
                    areEqual(_task.title, a_cloned_task.title, "title is not cloned properly");
                    areEqual(_task.description, a_cloned_task.description, "description is not cloned properly");
                    areEqual(_task.contentLink, a_cloned_task.contentLink, "contentLink is not cloned properly");
                    areEqual(_task.thumbnailLink, a_cloned_task.thumbnailLink, "thumbnailLink is not cloned properly");
                    areEqual(_task.emailSent, a_cloned_task.emailSent, "emailSent is not cloned properly");
                    areEqualTimestamps(_task.createdAt, a_cloned_task.createdAt, "createdAt is not cloned properly");
                    areEqual(_task.goalMet, a_cloned_task.goalMet, "goalMet is not cloned properly");
                    areEqualTimestamps(_task.reportCreatedAt, a_cloned_task.reportCreatedAt, "reportCreatedAt is not cloned properly");
                    areEqualTimestamps(_task.reportUpdatedAt, a_cloned_task.reportUpdatedAt, "reportUpdatedAt is not cloned properly");

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
