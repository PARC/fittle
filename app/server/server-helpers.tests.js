/**
 * Created by lnelson on 7/26/16.
 */

import {TestHelpers} from '../imports/test-helpers.js';
import {ServerHelpers} from './server-helpers';
import '../lib/collections';
import {Questions} from '../lib/api/questions/questions';
import {Participants} from '../lib/api/participants/participants';
import {Scheduledmessages} from '../lib/api/scheduledmessages/scheduledmessages';
import {Tasks} from '../lib/api/tasks/tasks';
import {Meteor} from 'meteor/meteor';
import {Activities} from '../lib/api/activities/activities';

describe('App Behavior Spec: SERVER: Server start', function () {
    /**
     * Test suite defining core functionality for working with study messaging data.
     */
    /** Set/Reset the database before/after each test! */
    beforeEach(function () {
    });

    afterEach(function () {
    });


    /**
     * Test suite defining server behavior on start up.
     */
    describe('Server start', function () {

        beforeEach(function () {
            TestHelpers.resetDatabase(null, function () {
            });
        });

        afterEach(function () {
        });
        context('On Server start', function (done) {

            it('should have the number of activity records in database that is in activites.json', function (done) {
                this.timeout(8000);
                ServerHelpers.startUp(true); // Run the server start up in testing mode
                let activities = {};
                let acount = 0;
                let activityFiles = Meteor.settings.private.ACTIVITIES_PATH;
                if (typeof activityFiles === 'string')
                    activityFiles = [activityFiles]
                for (let ix=0; ix<activityFiles.length; ix++) {
                    acount += JSON.parse(Assets.getText(activityFiles[ix])).length;
                }
                TestHelpers.areEqual(
                    ServerHelpers.collectionExists(Activities, acount),
                    true,
                    'Do not see collection'
                );
                done()
            });

            it('should have valid link to content in each study-related activity record', function () {
                let activitiesToCheck = [];
                let testQuery = {activity: {$in: activitiesToCheck}};
                let OK = ServerHelpers.checkDatabaseField(
                    Activities,
                    testQuery,
                    'content',
                    ServerHelpers.checkPublicFileExists
                );

                TestHelpers.areEqual(
                    OK,
                    true,
                    'Invalid link in activity record seen'
                );
            });

        });

        /*
         show collections:
         collection name in database, published as in Meteor
         activities, , Activities
         participants, Participants
         questionsquestions
         scheduledmessaging, Scheduledmessaging
         tasks, Tasks
         users, Users
         */

        context('Validate database collections', function () {

            it('Should have activities collection', function () {
                TestHelpers.areEqual(
                    ServerHelpers.collectionExists(Activities, 0),
                    true,
                    'Do not see collection'
                );
            });

            it('Should have participants collection', function () {
                TestHelpers.areEqual(ServerHelpers.collectionExists(Participants, 0),
                    true,
                    'Do not see collection'
                );
            });

            it('Should have questions collection', function () {
                TestHelpers.areEqual(ServerHelpers.collectionExists(Questions, 0),
                    true,
                    'Do not see collection'
                );
            });

            it('Should have scheduledmessages collection', function () {
                TestHelpers.areEqual(ServerHelpers.collectionExists(Scheduledmessages, 0),
                    true,
                    'Do not see collection'
                );
            });

            it('Should have tasks collection', function () {
                TestHelpers.areEqual(ServerHelpers.collectionExists(Tasks, 0),
                    true,
                    'Do not see collection'
                );
            });

            it('Should have users collection', function () {
                TestHelpers.areEqual(Meteor.users.find({}).count() >= 0,
                    true,
                    'Do not see collection'
                );
            });

        });

    });

});

describe('Unit Test', function () {
    /**
     * Test suite defining unit functionality for working with study messaging data.
     */
    /** Set/Reset the database before/after each test! */
    beforeEach(function () {
        TestHelpers.resetDatabase(null, function () {
        });
    });
    afterEach(function () {
        TestHelpers.resetDatabase(null, function () {
        });
    });
    describe('server-helpers.js', function () {

        context('method checkPublicFileExists', function () {

            it('Should correctly validate an existing file', function () {
                //Valid case
                var testPath = '/robots.txt';

                // Run the validation
                TestHelpers.areEqual(ServerHelpers.checkPublicFileExists(testPath),
                    true,
                    'Do not see existing file'
                );
            });

            it('Should correctly invalidate a non-existing file', function () {
                //Valid case
                var testPath = '/bogus.bogus';

                // Run the validation
                TestHelpers.areEqual(ServerHelpers.checkPublicFileExists(testPath),
                    false,
                    'Incorrectly indicated a non-existing file as existing'
                );
            });
        });

        context('method checkDatabaseField', function () {

            it('Should correctly validate a valid field', function () {
                // Set up valid items
                var activityRecord1 = {
                    "code": "269",
                    "activity": "I2_Walk",
                    "tag": "I2",
                    "content": "/content/I2/walk.html"
                };
                Activities.insert(activityRecord1);
                var activityRecord2 = {
                    "code": "270",
                    "activity": "I2_Eat_Veggies",
                    "tag": "I2",
                    "content": "/content/I2/Eat_Veggies.html"
                };
                Activities.insert(activityRecord2);

                // Valid case - one item
                var activitiesToCheck = ["KP_Full_Body_Workout"];
                var testQuery = {activity: {$in: activitiesToCheck}};
                var OK = ServerHelpers.checkDatabaseField(
                    Activities,
                    testQuery,
                    'content',
                    ServerHelpers.checkPublicFileExists
                );
                TestHelpers.areEqual(
                    OK,
                    true,
                    'Invalid link in activity record seen'
                );
                // Valid case - more than 1 item
                var activitiesToCheck2 = ["KP_Full_Body_Workout", "Active_Recv_Rest_Days"];
                var testQuery2 = {content: {$in: activitiesToCheck2}};
                var OK2 = ServerHelpers.checkDatabaseField(
                    Activities,
                    testQuery2,
                    'content',
                    ServerHelpers.checkPublicFileExists
                );
                TestHelpers.areEqual(
                    OK2,
                    true,
                    'Invalid link in activity record seen'
                );

            });
            it('Should correctly invalidate an invalid field', function () {
                //Set up invalid item
                var activityRecord1 = {
                    "code": "1",
                    "activity": "Active_Recv_Rest_Days",
                    "tag": "Band_Workout_Instructions",
                    "content": "/content/Band_Workout_Instructions/Bogus_Active_Recv_Rest_Days.html"
                };

                Activities.insert(activityRecord1);

                // Invalid case
                var activitiesToCheck = ["Active_Recv_Rest_Days"];
                var testQuery = {activity: {$in: activitiesToCheck}};
                var OK = ServerHelpers.checkDatabaseField(
                    Activities,
                    testQuery,
                    'content',
                    ServerHelpers.checkPublicFileExists
                );
                TestHelpers.areEqual(
                    OK,
                    false,
                    'Incorrectly reporting an invalid link as valid'
                );

            });
        });
    });
});
