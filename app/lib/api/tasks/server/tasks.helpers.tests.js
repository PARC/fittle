/**
 * Created by lnelson on 6/13/17.
 */
/** File contains tests to verify methods used for working with Tasks documents. */

import {TestHelpers} from '../../../../imports/test-helpers';
import {Faker} from '../../../../imports/test-helpers';
import {chai} from 'meteor/practicalmeteor:chai';

/** Helpers for test readability */
const catchError = TestHelpers.catch;
const areEqual = TestHelpers.areEqual;
const isError = TestHelpers.isError;
const isNotNullAndNotUndefined = TestHelpers.isNotNullAndNotUndefined;

//----------------------------------------------------------------------------------------------------------------------
//    Unit/Component Tests
//----------------------------------------------------------------------------------------------------------------------

import {_} from 'meteor/underscore';
import {Participants} from '../../participants/participants';
import {Tasks} from '../../tasks/tasks';
import {Factory} from 'meteor/dburles:factory';
import {TasksHelpers} from '../tasks.helpers';
import {Activities} from '../../activities/activities';

describe("Tasks Helpers methods", function () {

    let _participant = null;
    let _loggedInUser = null;
    let _taskTitle = null;
    let _userId = null;
    const VALID_PASSWORD = "testing";


    beforeEach(function () {
        TestHelpers.resetDatabase();
        // Participant data was loaded into the system before the user downloaded the app.
        Faker.defineParticipantsCollection();
        _participant = Factory.create('participants');

        // The user installs the app and creates an account.
        _loggedInUser = {
            primaryEmail: _participant.emailAddress,
            username: _participant.emailAddress,
            profile: {
                timezone: "-420",
                team: "Lobby"
            },
            email: _participant.emailAddress,
            password: VALID_PASSWORD
        };
        Accounts.createUser(_loggedInUser);

        // A User account and its corresponding Participants document exists. (Copy the data into local variables.)
        _userId = Meteor.users.findOne()._id;

        Activities.insert({
            code: "269",
            activity: "I2_Walk",
            tag: "I2",
            content: "content/I2/I2_Walk.html",
            title: "Walk",
            description: "Walk today",
            thumbnail: "content/I2/eatslowlythumb.png"
        });
        Activities.insert({
            code: "270",
            activity: "I2_Eat_Veggies",
            tag: "I2",
            content: "content/I2/I2_Eat_Veggies.html",
            title: "Eat Veggies",
            description: "Eat vegetables today",
            thumbnail: "content/I2/eatslowlythumb.png"
        });
        Activities.insert({
            code: "271",
            activity: "I2_Eat_Slower",
            tag: "I2",
            content: "content/I2/I2_Eat_Slower.html",
            title: "Eat Slowly",
            description: "Eat slowly today",
            thumbnail: "content/I2/eatslowlythumb.png"
        });
        Tasks.remove({});

    });


    afterEach(function () {
        _participant = null;
        _loggedInUser = null;
        _userId = null;
        _taskTitle = null;
        TestHelpers.resetDatabase();
    });


    describe("TasksHelpers methods unit tests", function () {

        /** Documents intended use of method.
         */
        context("Server calls getStartDate.", function () {

            it("Should return the start date of test Participant based on studyStartUTC.", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                let startDate = TasksHelpers.getStartDate(_participant);
                areEqual(startDate.toString(), _participant.studyStartUTC.toString());
            });

        });

        /** Documents intended use of method.
         *  Refers to a static JSON file stored in /public
         *  {  "value": "test" }
         */
        context("Server calls getPublicAsset .", function () {

            it("Should return the test value from a public JSON file", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                let testJson = TasksHelpers.getPublicAsset("/test_files/task.helpers.testing.json");
                areEqual(testJson.value, "test");
            });

        });

        /** Documents intended use of method.
         *  Refers to a static JSON file stored in /public
         *  {  "value": "test" }
         */
        context("Server calls getPrivateAsset .", function () {

            it("Should return the test value from a private JSON file", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                let testJson = TasksHelpers.getPrivateAsset("/test_files/task.helpers.testing.json");
                areEqual(testJson.value, "test");
            });

        });

        /** Documents intended use of method.
         *  Refers to a static JSON file stored in /public
         *  {  "value": "test" }
         */
        context("Server calls getStartDayFromDay .", function () {

            it("Should return the test value response if no previous day given in parameters", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                let day = TasksHelpers.getStartDayFromDay(_userId);
                areEqual(day, 0, "If no previous day specified, assume start day is 0");
            });

            it("Should return the test value response if no previous day given in parameters", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                let TEST_VALUE = 42;
                let day = TasksHelpers.getStartDayFromDay("bogus", TEST_VALUE);
                areEqual(day, TEST_VALUE, "If user not correctly specified, assume start day is the previous day");
            });

            it("Should return the test value response if no participant found given in userId", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                let TEST_VALUE = 42;
                let user = Meteor.users.findOne({_id: _userId});
                isNotNullAndNotUndefined(user, "User expected in test set up not found");
                areEqual(user._id, _userId, "User expected in test set up not correct");
                Participants.remove({});
                user = Meteor.users.findOne({_id: _userId});
                isNotNullAndNotUndefined(user, "User should have been removed in test set but still found");
                let day = TasksHelpers.getStartDayFromDay("bogus", TEST_VALUE);
                areEqual(day, TEST_VALUE, "If user not correctly specified, assume start day is the previous day");
            });

            it("Should return the response if all parameters met", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                const PREVIOUS_DAY = 14;
                const ASSIGNED_DAY = 5;
                let day = TasksHelpers.getStartDayFromDay(_userId, PREVIOUS_DAY, ASSIGNED_DAY);
                areEqual(day, PREVIOUS_DAY + ASSIGNED_DAY, "If no previous day specified, assume start day is 0");
            });


        });

        /** Documents intended use of method.
         *  Refers to a static JSON file stored in /public
         *  {  "value": "test" }
         */
        context("Server calls getStartDayFromAssignmentDate.", function () {
            const d = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);
            const TARGET_DATE = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();

            it("Should return the test value response if no previous day given in parameters", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                let day = TasksHelpers.getStartDayFromAssignmentDate(_userId);
                areEqual(day, 0, "If no previous day specified, assume start day is 0");
            });

            it("Should return the test value response if no user given in parameters", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                let TEST_VALUE = 42;
                let day = TasksHelpers.getStartDayFromAssignmentDate("bogus", TEST_VALUE);
                areEqual(day, TEST_VALUE, "If user not correctly specified, assume start day is the previous day");
            });

            it("Should return the test value response if no assignment date not given in parameters", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                let TEST_VALUE = 42;
                let day = TasksHelpers.getStartDayFromAssignmentDate(_userId, TEST_VALUE);
                areEqual(day, TEST_VALUE, "If user not correctly specified, assume start day is the previous day");
                day = TasksHelpers.getStartDayFromAssignmentDate(_userId, TEST_VALUE, 1);
                areEqual(day, TEST_VALUE, "If user not correctly specified, assume start day is the previous day");
                day = TasksHelpers.getStartDayFromAssignmentDate(_userId, TEST_VALUE, {});
                areEqual(day, TEST_VALUE, "If user not correctly specified, assume start day is the previous day");
            });

            it("Should return the test value response if no participant found given in userId", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                let TEST_VALUE = 42;
                let user = Meteor.users.findOne({_id: _userId});
                isNotNullAndNotUndefined(user, "User expected in test set up not found");
                areEqual(user._id, _userId, "User expected in test set up not correct");
                Participants.remove({});
                user = Meteor.users.findOne({_id: _userId});
                isNotNullAndNotUndefined(user, "User should have been removed in test set but still found");
                let day = TasksHelpers.getStartDayFromAssignmentDate(_userId, TEST_VALUE, TARGET_DATE);
                areEqual(day, TEST_VALUE, "If user not correctly specified, assume start day is the previous day");
            });

            it("Should return the response if all parameters met", function () {
                // When -- A newly registered user is assigned Tasks for the entire challenge.
                const PREVIOUS_DAY = 14;
                const ASSIGNED_DAY = 5;
                const d = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);

                const TARGET_DATE = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();

                let day = TasksHelpers.getStartDayFromAssignmentDate(_userId, PREVIOUS_DAY, TARGET_DATE);
                areEqual(day, PREVIOUS_DAY + ASSIGNED_DAY, "Wrong day calculated");
            });
        });

        /** Documents intended use of method.
         */
        context("Server calls getLastDay.", function () {
            const DEFAULT_LARGEST = 0;

            it("Should return " + DEFAULT_LARGEST + " if anything wrong with the JSON.", function () {
                let json = {};
                areEqual(DEFAULT_LARGEST, TasksHelpers.getLastDay(json));
                json = {schedule: []};
                areEqual(DEFAULT_LARGEST, TasksHelpers.getLastDay(json));
                json = {schedule: [{bogus: 99}]};
                areEqual(DEFAULT_LARGEST, TasksHelpers.getLastDay(json));
                json = {schedule: [{scheduledDay: "bogus"}]};
                areEqual(DEFAULT_LARGEST, TasksHelpers.getLastDay(json));
            });

            it("Should return largest if anything OK with the JSON.", function () {
                const THIS_LARGEST = 42;
                let json = {
                    "title": "Static Schedule",
                    "scheduling": "FromRegistered",
                    "schedule": [
                        {
                            "activity": "I2_Walk",
                            "scheduledDay": 0
                        },
                        {
                            "activity": "I2_Walk",
                            "scheduledDay": 1
                        },
                        {
                            "activity": "I2_Eat_Veggies",
                            "scheduledDay": 2
                        },
                        {
                            "activity": "I2_Eat_Slower",
                            "scheduledDay": 3
                        },
                        {
                            "activity": "I2_Walk",
                            "scheduledDay": 4
                        },
                        {
                            "activity": "I2_Eat_Veggies",
                            "scheduledDay": 5
                        },
                        {
                            "activity": "I2_Eat_Slower",
                            "scheduledDay": THIS_LARGEST
                        },
                        {
                            "activity": "I2_Walk",
                            "scheduledDay": 7
                        },
                        {
                            "activity": "I2_Eat_Veggies",
                            "scheduledDay": 8
                        },
                        {
                            "activity": "Relax Today",
                            "scheduledDay": 9
                        }
                    ]
                };
                areEqual(THIS_LARGEST, TasksHelpers.getLastDay(json));

            });

        });


    });


    describe("TasksHelpers methods integration tests", function () {

        /** Documents intended use of method.
         */
        context("Server calls assignTasksByJsonSet.", function () {

            it("Should assign Tasks for whole test set.", function () {
                TasksHelpers.assignTasksByJsonSet(
                    _userId,
                    _participant.emailAddress,
                    "Testing",
                    "/test_files/task.helpers.testing.jsonAssetSet.json");
                let tasks = Tasks.find();
                let taskArray = tasks.fetch();
                console.log(taskArray);
                areEqual(tasks.count(), 20);
                let expectedSchedule = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
                for (let ix = 0; ix < taskArray.length; ix++) {
                    let task = taskArray[ix];
                    areEqual(task.scheduledDate, expectedSchedule[ix])
                }

            });

        });

        context("Server calls assignTasksByJsonSet with Day specs", function () {

            it("Should assign Tasks for whole test set.", function () {
                TasksHelpers.assignTasksByJsonSet(
                    _userId,
                    _participant.emailAddress,
                    "Testing",
                    "/test_files/task.helpers.testing.jsonAssetSetByDay.json");
                let tasks = Tasks.find();
                areEqual(tasks.count(), 20);
                let expectedSchedule = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
                let taskArray = tasks.fetch();
                for (let ix = 0; ix < taskArray.length; ix++) {
                    let task = taskArray[ix];
                    areEqual(task.scheduledDate, expectedSchedule[ix])
                }
            });

        });

        /*
         // This test only works if you edit the indicated file and use a different absolute date - 16 days from now
         context("Server calls assignTasksByJsonSet with Date specs", function () {

         it("Should assign Tasks for whole test set.", function () {
         TasksHelpers.assignTasksByJsonSet(
         _userId,
         _participant.emailAddress,
         "Testing",
         "/test_files/task.helpers.testing.jsonAssetSetByDate.json");
         let tasks = Tasks.find();
         areEqual(tasks.count(), 20);
         let expectedSchedule = [0,1,2,3,4,5,6,7,8,9,16,17,18,19,20,21,22,23,24,25];
         let taskArray = tasks.fetch();
         for (let ix=0; ix<taskArray.length; ix++) {
         let task = taskArray[ix];
         console.log(expectedSchedule[ix]);
         console.log(task);
         areEqual(task.scheduledDate, expectedSchedule[ix])
         }
         });

         });
         */

    })

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

