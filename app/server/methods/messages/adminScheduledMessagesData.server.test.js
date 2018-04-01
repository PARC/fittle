/**
 * Created by lnelson on 7/19/16.
 */
/**
 * Tests for admin participant functions
 * Created by lnelson on 7/15/16.
 */
import {TestHelpers} from '../../../imports/test-helpers.js';
import {chai} from 'meteor/practicalmeteor:chai';
import {Scheduledmessages} from '../../../lib/api/scheduledmessages/scheduledmessages';
import {Participants} from '../../../lib/api/participants/participants';
import {Questions} from '../../../lib/api/questions/questions';
import {DateHelper} from '../../../lib/helpers';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import {sinon} from 'meteor/practicalmeteor:sinon';
import {StudyJsonData, importScheduledmessagesJson} from './server.methods.studyJsonData';


describe('App Behavior Spec: SERVER: Scheduled Messages Data', function () {
    /**
     * Test suite defining core functionality for working with study messaging data.
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

    describe('Admin functions for working with study messaging data.', function () {

        /** @locus {admin panel} */
        context('Validate study messaging data in the messaging CSV file.', function () {

            it('Should validate JSON data (fields and types) against database schema', function () {
                //Valid case
                var jsonContent = {
                    "sequences": [
                        {
                            "name": "goalTypeSelect",
                            "constraints": [
                                {
                                    "attribute": "preferences.goalType",
                                    "value": ""
                                }
                            ],
                            "askDate": "now",
                            "askTime": "07:00",
                            "expireDate": "28",
                            "expireTime": "23:59",
                            "sequenceBase": 10,
                            "questions": [
                                {
                                    "tag": "goalType",
                                    "text": "Which activity would you like to do?",
                                    "responseFormat": "list-choose-one",
                                    "choices": {
                                        "eatSlowly": "Eat slowly and mindfully",
                                        "walk": "Walk everyday",
                                        "foodJournal": "Keep a food journal"
                                    },
                                    "notify": false,
                                    "preferenceToSet": "goalType"
                                }
                            ]
                        }
                    ]
                };

                // Run the validations
                var study_data = new StudyJsonData(Scheduledmessages, jsonContent);
                study_data.validateFields();
                study_data.validateImport();
                study_data.validateAgainstSchema();
                chai.assert.equal(study_data.getIsValid(), true, 'Wrongly indicated that valid data did not validate');

                //Invalid because of bad field value
                (jsonContent.sequences)[0].askDate = 'bogus';

                // Run the validations
                var study_data1 = new StudyJsonData(Scheduledmessages, jsonContent);
                study_data1.validateFields();
                study_data1.validateImport();
                study_data1.validateAgainstSchema();
                chai.assert.equal(study_data1.getIsValid(), false, 'Wrongly indicated invalid data validated');
            });

            it('Should print object number of first object where data is invalid', function () {
                //Invalid because of bad field value
                var jsonContent = {
                    "sequences": [
                        {
                            "name": "goalTypeSelect",
                            "constraints": [
                                {
                                    "attribute": "preferences.goalType",
                                    "value": ""
                                }
                            ],
                            "askDate": "now",
                            "askTime": "07:00",
                            "expireDate": "28",
                            "expireTime": "23:59",
                            "sequenceBase": 10,
                            "questions": [
                                {
                                    "tag": "goalType",
                                    "text": "Which activity would you like to do?",
                                    "responseFormat": "list-choose-one",
                                    "choices": {
                                        "eatSlowly": "Eat slowly and mindfully",
                                        "walk": "Walk everyday",
                                        "foodJournal": "Keep a food journal"
                                    },
                                    "notify": false,
                                    "preferenceToSet": "goalType"
                                }
                            ]
                        },
                        {
                            "name": "bogusTypeSelect",
                            "constraints": [
                                {
                                    "attribute": "preferences.goalType",
                                    "value": ""
                                }
                            ],
                            "askDate": "bogus",
                            "askTime": "07:00",
                            "expireDate": "28",
                            "expireTime": "23:59",
                            "sequenceBase": 10,
                            "questions": [
                                {
                                    "tag": "goalType",
                                    "text": "Which activity would you like to do?",
                                    "responseFormat": "list-choose-one",
                                    "choices": {
                                        "eatSlowly": "Eat slowly and mindfully",
                                        "walk": "Walk everyday",
                                        "foodJournal": "Keep a food journal"
                                    },
                                    "notify": false,
                                    "preferenceToSet": "goalType"
                                }
                            ]
                        }
                    ]
                };

                // Run the validations
                var study_data = new StudyJsonData(Scheduledmessages, jsonContent);
                study_data.validateFields();
                study_data.validateImport();
                study_data.validateAgainstSchema();
                study_data.guardedSaveToDatabase();

                //Test expected vs actuals
                const expectedFeedbackSubstring = 'at object 2';
                const actualFeedback = study_data.getFeedback();
                var hasActualRowNumber = TestHelpers.isSubstring(actualFeedback, expectedFeedbackSubstring);
                chai.assert.equal(hasActualRowNumber, true, "Invalid object number is not being shown");
            });

            it('Should reject all data if any data is invalid', function () {
                //One valid and one invalid because of bad field value
                var jsonContent = [
                    {
                        "condition": "initial_affirmation",
                        "askDate": "bogus",
                        "askTime": "18:45",
                        "expireDate": "2",
                        "expireTime": "19:00",
                        "sequence": 1,
                        "kind": "list-choose-one",
                        "choices": "OK",
                        "text": "Remember to take a walk for 15 minutes during the part of day: afternoon, at: in the park near my home, with: my friend",
                        "notify": "true",
                        "tag": "reminder"
                    },
                    {
                        "condition": "initial_affirmation",
                        "askDate": "2",
                        "askTime": "18:45",
                        "expireDate": "2",
                        "expireTime": "19:00",
                        "sequence": 1,
                        "kind": "list-choose-one",
                        "choices": "OK",
                        "text": "Remember to take a walk for 15 minutes during the part of day: afternoon, at: in the park near my home, with: my friend",
                        "notify": "true",
                        "tag": "reminder"
                    }
                ];

                // Run the validations
                var study_data = new StudyJsonData(Scheduledmessages, jsonContent);
                study_data.validateFields();
                study_data.validateImport();
                study_data.validateAgainstSchema();
                study_data.guardedSaveToDatabase();

                // Check records at end
                const databaseSize = Scheduledmessages.find().count();
                chai.assert.equal(databaseSize, 0, 'Should end with an no saved database records for this test');

            });

        });

        /** @locus {admin panel} */
        context('Loading study messaging data into the database.', function () {

            it('Should overwrite study messaging data with the same name', function () {
                //Valid case
                var jsonContent = {
                    "sequences": [
                        {
                            "name": "goalTypeSelect",
                            "constraints": [
                                {
                                    "attribute": "preferences.goalType",
                                    "value": ""
                                }
                            ],
                            "askDate": "now",
                            "askTime": "07:00",
                            "expireDate": "28",
                            "expireTime": "23:59",
                            "sequenceBase": 10,
                            "questions": [
                                {
                                    "tag": "goalType",
                                    "text": "Which activity would you like to do?",
                                    "responseFormat": "list-choose-one",
                                    "choices": {
                                        "eatSlowly": "Eat slowly and mindfully",
                                        "walk": "Walk everyday",
                                        "foodJournal": "Keep a food journal"
                                    },
                                    "notify": false,
                                    "preferenceToSet": "goalType"
                                }
                            ]
                        }
                    ]
                };

                // Load once to start test
                importScheduledmessagesJson(jsonContent);
                chai.assert.equal(Scheduledmessages.find().count(), 1, 'Should show one record after initial load');
                chai.assert.equal(Scheduledmessages.findOne().askDate, "now", 'Should show imported value in field to test');

                // Set up overwrite
                (jsonContent.sequences)[0].askDate = "1";
                importScheduledmessagesJson(jsonContent);
                chai.assert.equal(Scheduledmessages.find().count(), 1, 'Should still show one record after overwrite ');
                chai.assert.equal(Scheduledmessages.findOne().askDate, "1", 'Should show updated value in field to test');

            });

            it('Should copy valid data into database if all data is valid.', function () {
                //Valid case
                var jsonContent = {
                    "sequences": [
                        {
                            "name": "goalTypeSelect",
                            "constraints": [
                                {
                                    "attribute": "preferences.goalType",
                                    "value": ""
                                }
                            ],
                            "askDate": "now",
                            "askTime": "07:00",
                            "expireDate": "28",
                            "expireTime": "23:59",
                            "sequenceBase": 10,
                            "questions": [
                                {
                                    "tag": "goalType",
                                    "text": "Which activity would you like to do?",
                                    "responseFormat": "list-choose-one",
                                    "choices": {
                                        "eatSlowly": "Eat slowly and mindfully",
                                        "walk": "Walk everyday",
                                        "foodJournal": "Keep a food journal"
                                    },
                                    "notify": false,
                                    "preferenceToSet": "goalType"
                                }
                            ]
                        }
                    ]
                };
                let testQuery = {
                    "constraints": [{"attribute": "preferences.goalType", "value": ""}],
                    "askDate": "now",
                    "askTime": "07:00",
                    "expireDate": "28",
                    "expireTime": "23:59",
                    "responseFormat": "list-choose-one",
                    "sequence": 11,
                    "choices": "Eat slowly and mindfully,Walk everyday,Keep a food journal",
                    "answers": {
                        "Eat slowly and mindfully": "eatSlowly",
                        "Walk everyday": "walk",
                        "Keep a food journal": "foodJournal"
                    },
                    "text": "Which activity would you like to do?",
                    "tag": "goaltype",
                    "name": "goalTypeSelect",
                    "preferenceToSet": "goalType",
                    "notify": false
                };

                // Load once to start test
                importScheduledmessagesJson(jsonContent);
                chai.assert.equal(Scheduledmessages.find().count(), 1, 'Should show one record after overwrite ');
                var found = Scheduledmessages.findOne(testQuery) ? true : false;
                chai.assert.equal(found, true, 'Should have the loaded record after initial load');

                // Set up overwrite
                testQuery.askDate = "1";
                (jsonContent.sequences)[0].askDate = testQuery.askDate;
                importScheduledmessagesJson(jsonContent);
                chai.assert.equal(Scheduledmessages.find().count(), 1, 'Should still show one record second load');
                var found = Scheduledmessages.findOne(testQuery) ? true : false;
                chai.assert.equal(found, true, 'Should have the updated record after second load');


            });

            it('Should show successful data load message in console.', function () {
                //Valid data
                //Valid case
                var jsonContent = {
                    sequences: [
                        {
                            name: "goalTypeSelect",
                            constraints: [
                                {
                                    attribute: "preferences.goalType",
                                    value: ""
                                }
                            ],
                            askDate: "0",
                            askTime: "07:00",
                            expireDate: "28",
                            expireTime: "23:59",
                            sequenceBase: 10,
                            questions: [
                                {
                                    tag: "goalType",
                                    text: "Which activity would you like to do?",
                                    responseFormat: "list-choose-one",
                                    choices: {
                                        eatSlowly: "Eat slowly and mindfully",
                                        walk: "Walk everyday",
                                        foodJournal: "Keep a food journal"
                                    },
                                    notify: false,
                                    preferenceToSet: "goalType"
                                }
                            ]
                        }
                    ]
                };
                let testQuery = {
                    "constraints": [{"attribute": "preferences.goalType", "value": ""}],
                    "askDate": "0",
                    "askTime": "07:00",
                    "expireDate": "28",
                    "expireTime": "23:59",
                    "responseFormat": "list-choose-one",
                    "sequence": 11,
                    "choices": "Eat slowly and mindfully,Walk everyday,Keep a food journal",
                    "answers": {
                        "Eat slowly and mindfully": "eatSlowly",
                        "Walk everyday": "walk",
                        "Keep a food journal": "foodJournal"
                    },
                    "text": "Which activity would you like to do?",
                    "tag": "goaltype",
                    "name": "goalTypeSelect",
                    "preferenceToSet": "goalType",
                    "notify": false
                };

                // Load once to start test
                let actualFeedback = importScheduledmessagesJson(jsonContent);
                chai.assert.equal(Scheduledmessages.find().count(), 1, 'Should show one record after overwrite ');

                var found = Scheduledmessages.findOne(testQuery) ? true : false;
                chai.assert.equal(found, true, 'Should have the loaded record after initial load');
                var expectedFeedback = 'Uploading JSON file Validating Fields<br/>Validating Import File<br/>Validating Schema<br/>Removing prior Scheduled Messages for goalTypeSelect<br/>Saving imported data to Database<br/>Added scheduledmessages.goalTypeSelect.11<br/>Load complete<br/>Update Questions for new schedule of messages<br/>';
                chai.assert.equal(actualFeedback, expectedFeedback, 'Should return the successful data load message after load');

            });

            context('Dealing with Questions upon load.', function () {
                var jsonContent_preexisting = {
                    "sequences": [
                        {
                            name: "goalTypeSelect11",
                            constraints: [
                                {
                                    attribute: "preferences.goalType",
                                    value: "1"
                                }
                            ],
                            askDate: "0",
                            askTime: "07:00",
                            expireDate: "28",
                            expireTime: "23:59",
                            sequenceBase: 10,
                            questions: [
                                {
                                    tag: "goalType",
                                    text: "Question 1 for user that should not be removed",
                                    responseFormat: "list-choose-one",
                                    choices: {
                                        eatSlowly: "Eat slowly and mindfully",
                                        walk: "Walk everyday",
                                        foodJournal: "Keep a food journal"
                                    },
                                    notify: false,
                                    preferenceToSet: "goalType"
                                }
                            ]
                        },
                        {
                            name: "goalTypeSelect13",
                            constraints: [
                                {
                                    attribute: "preferences.goalType",
                                    value: "1"
                                }
                            ],
                            askDate: "3",
                            askTime: "07:00",
                            expireDate: "28",
                            expireTime: "23:59",
                            sequenceBase: 10,
                            questions: [
                                {
                                    tag: "goalType",
                                    text: "Question 2 for user that should be removed",
                                    responseFormat: "list-choose-one",
                                    choices: {
                                        eatSlowly: "Eat slowly and mindfully",
                                        walk: "Walk everyday",
                                        foodJournal: "Keep a food journal"
                                    },
                                    notify: false,
                                    preferenceToSet: "goalType"
                                }
                            ]
                        }
                    ]
                };

                function testSetup() {

                    // Create test Participants
                    let importRecord = Participants.create("test_user1@parc.com", "i2-01", {}, {goalType: "1"});
                    const participantId = Participants.insert(importRecord);
                    chai.assert.equal(Participants.find().count(), 1, 'Set up for test should have 1 participants at start');

                    let participant = Participants.findOne(participantId);
                    TestHelpers.isNotNullAndNotUndefined(participant, 'Set up for test should show created participant to start test');

                    // Create test users
                    Accounts.createUser({
                        email: "test_user1@parc.com",
                        password: "Testing1234"
                    });
                    chai.assert.equal(Meteor.users.find().count(), 1, 'Set up for test should show 1 users to start test');


                    //Two valid records in different conditions, only one should get deleted
                    // Set up preexisting records
                    let initialFeedback = importScheduledmessagesJson(jsonContent_preexisting);

                    chai.assert.equal(Questions.find().count(), 2, 'Set up for test should show 2 Questions in database to start test');

                    // Put User on Day 2
                    //var changingUser = Meteor.users.findOne({username: 'test_user1@parc.com'});
                    var date = new Date(participant.studyStartUTC);
                    date.setDate(date.getDate() - 2);
                    Participants.update({emailAddress: 'test_user1@parc.com'},
                        {
                            $set: {
                                studyStartUTC: date,
                                challengeStartUTC: date
                            }
                        });
                    //Fix for I2 Study Bug 9: Use a date difference computation that is only needed here
                    function daysBetween(newerDate, olderDate) {
                        // Need a function that is unaffected by spanning accross Daylight Saving and Standard times
                        return Math.floor((newerDate.getTime() - olderDate.getTime()) / (24 * 60 * 60 * 1000));
                    }

                    chai.assert.equal(daysBetween(participant.studyStartUTC, date), 2, 'Set up for test should show a user on Day 2');

                    // Do Scheduled Messages re-load
                    var newQuestionText = "Changed question 2 for user 1";
                    var newQuestionDate = "3";
                    var jsonContent_new_load = {
                        "sequences": [
                            {
                                name: "goalTypeSelect13",
                                constraints: [
                                    {
                                        attribute: "preferences.goalType",
                                        value: "1"
                                    }
                                ],
                                askDate: newQuestionDate,
                                askTime: "07:00",
                                expireDate: "28",
                                expireTime: "23:59",
                                sequenceBase: 10,
                                questions: [
                                    {
                                        tag: "goalType",
                                        text: newQuestionText,
                                        responseFormat: "list-choose-one",
                                        choices: {
                                            eatSlowly: "Eat slowly and mindfully",
                                            walk: "Walk everyday",
                                            foodJournal: "Keep a food journal"
                                        },
                                        notify: false,
                                        preferenceToSet: "goalType"
                                    }
                                ]
                            }
                        ]
                    };

                    let updateFeedback = importScheduledmessagesJson(jsonContent_new_load);

                    // Check after set up of reload of Scheduled Messages
                    chai.assert.equal(Scheduledmessages.find().count(), 2, 'Incorrect number of Scheduled Messages records in database after reload');
                    chai.assert.equal(Questions.find({username: "test_user1@parc.com"}).count(), 2, 'Should show 2 Questions for changing user after reload of JSON file');
                }

                beforeEach(function () {
                    // Stub method used for retrieving a user's timezone preference.
                    //noinspection JSUnusedLocalSymbols
                    sinon.stub(DateHelper, 'preferredTimezoneForUser', function (emailAddress) {
                        console.log("Executing DateHelper.preferredTimezoneForUser stub.");
                        return '-420';
                    });

                    TestHelpers.resetDatabase(null, function () {
                    });
                });
                afterEach(function () {
                    TestHelpers.resetDatabase(null, function () {
                    });
                    // Remove Sinon stubs
                    DateHelper.preferredTimezoneForUser.restore();
                });

                it('Should remove all existing future Question data in the same study condition from the database when successfully loading study messaging data ', function () {
                    // Check for the removal
                    testSetup();

                    var q_IA = Questions.findOne(
                        {
                            username: "test_user1@parc.com",
                            text: "Question 2 for user that should be removed"
                        });
                    chai.assert.equal(q_IA, null, 'Future question for user was not removed');

                });

                it('Should insert new unanswered Question data for all future successfully loaded study messaging data for all users in affected study conditions', function () {
                    testSetup();

                    // Check for the insertion
                    var newQuestionText = "Changed question 2 for user 1";
                    chai.assert.equal(
                        Questions.findOne({username: "test_user1@parc.com", text: newQuestionText}).text,
                        newQuestionText,
                        'Updated question did not get added');

                });
            });
        });
    });
})
;

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
    describe('StudyJsonData.js', function () {

        /** @locus {admin panel} */
        context('Load study messaging data in the messaging CSV file.', function () {

            it('Should have correctly initialized instance variables upon instantiaion', function () {
                //Valid case
                var jsonContent = [
                    {
                        "condition": "initial_affirmation",
                        "askDate": "2",
                        "askTime": "18:45",
                        "expireDate": "2",
                        "expireTime": "19:00",
                        "sequence": 1,
                        "kind": "list-choose-one",
                        "choices": "OK",
                        "text": "Remember to take a walk for 15 minutes during the part of day: afternoon, at: in the park near my home, with: my friend",
                        "notify": "true",
                        "tag": "reminder"
                    }
                ];

                // Run the validations
                var study_data = new StudyJsonData(Scheduledmessages, jsonContent);
                // Study object integrity checking on creation - do this once here for all schedulemessaging tests
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true at validation start');
                chai.assert.equal(study_data.getName(), 'scheduledmessages', 'name should be scheduledmessages');
                chai.assert.equal(study_data.getOverwriteOnPrimaryKey(), undefined, 'OverwriteOnPrimaryKey should be undefined');
                chai.assert.equal(study_data.getAllowDuplication(), false, 'AllowDuplication should be false');
                chai.assert.isDefined(study_data.getSchema(), 'Database schema should not be undefined');
                chai.assert.notEqual(study_data.getSchema(), null, 'Database schema should not be null');

            });

        });
    });
});