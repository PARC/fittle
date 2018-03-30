/**
 * Tests for admin participant functions
 * Created by lnelson on 7/15/16.
 */
import {TestHelpers} from '../../../imports/test-helpers.js';
import {chai} from 'meteor/practicalmeteor:chai';
import {StudyJsonData, importParticipantJson} from './server.methods.studyJsonData';
import '../../../lib/collections';
import {Meteor} from 'meteor/meteor';
import {Participants} from '../../../lib/api/participants/participants';
import '../methods';
import {Activities} from '../../../lib/api/activities/activities';

describe('App Behavior Spec: SERVER: Participant Data', function () {
    /**
     * Test suite defining core functionality for working with study messaging data.
     */
    /** Set/Reset the database before/after each test! */
    beforeEach(function () {
        TestHelpers.resetDatabase(null, function () {
        });
        // Setup -- Stub definition of Activities collection
        TestHelpers.factory.define('activities',
            Activities,
            {
                code: "32",
                activity: "Eat_Slower_Eat_Less",
                tag: "Eat_Slower_Eat_Less",
                content: "/content/Eat_Slower_Eat_Less/Eat_Slower_Eat_Less.html"
            });
        // Given -- The participant data has been loaded by the investigator
        TestHelpers.factory.create('activities');
    });

    afterEach(function () {
    });

    describe('Admin functions for working with participant data.', function () {
        var suite_name = this.title;
        var test_name;

        beforeEach(function () {
        });

        /** @locus {admin panel} */
        context('Validate participant data in the participant information import file.', function () {

            it('Should validate import data (fields and types) against database schema.', function () {
                var already_there = Participants.find({}).count();
                chai.assert.equal(already_there, 0, "Database should be empty for this test");

                //Valid case
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];

                // Run the validations
                var study_data = new StudyJsonData(Participants, import_content);
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true after initialization');
                study_data.validateFields();
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true after validateFields');
                study_data.validateImport();
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true after validateImport');
                study_data.validateAgainstSchema();
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true after validateAgainstSchema');
                // Check invalidity - invalid because of bad field values
                import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "boguscondition": "bogus",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];

                // Run the validations
                var study_data1 = new StudyJsonData(Participants, import_content);
                chai.assert.equal(study_data1.getIsValid(), true, 'isValid should be true after initialization');
                study_data1.validateFields();
                chai.assert.equal(study_data1.getIsValid(), true, 'isValid should be true after validateFields');
                study_data1.validateImport();
                chai.assert.equal(study_data1.getIsValid(), true, 'isValid should be true after validateImport');
                study_data1.validateAgainstSchema();

                // Check validity at end
                chai.assert.equal(study_data1.getIsValid(), false, 'Invalid document did validate');

            });

            it('Should print object number of first object where data is invalid', function () {
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    },
                    {
                        "emailAddress": "JustForTesting2@parc.com",
                        "boguscondition": "woof",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];

                // Run through all validations (at some point the Schema validations should fire)
                var study_data = new StudyJsonData(Participants, import_content);
                study_data.validateFields();
                study_data.validateImport();
                study_data.validateAgainstSchema();
                study_data.guardedSaveToDatabase();

                //Test expected vs actuals
                const expectedFeedbackSubstring = 'at object 2';
                const actualFeedback = study_data.getFeedback();
                var hasActualRowNumber = TestHelpers.isSubstring(actualFeedback, expectedFeedbackSubstring);
                chai.assert.equal(hasActualRowNumber, true, "Invalid object number is not being shown")

            });

            it('Should reject all data if any data is invalid', function () {
                // First record is invalid due to bad condition value
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    },
                    {
                        "emailAddress": "JustForTesting2@parc.com",
                        "boguscondition": "woof",
                        "settings": {
                            "name": "Rudolph2",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];


                // Run the validations
                var study_data = new StudyJsonData(Participants, import_content);
                study_data.validateFields();
                study_data.validateImport();
                study_data.validateAgainstSchema();
                study_data.guardedSaveToDatabase();

                // Check records at end
                var databaseSize = Participants.find().count();
                chai.assert.equal(databaseSize, 0, 'Should end with an no saved database records for this test');
            });
        });

        /** @locus {admin panel} */
        context('Loading participant data into the database.', function () {


            it('Should print row number of first row where data is invalid', function () {
                // Invalid due to deprecated fields
                var import_content = [
                    {
                        "emailAddress": "abc.test5@gmail.com",
                        "condition": "initial_affirmation",
                        "implementationIntention": "yes",
                        "selfEfficacy": "high",
                        "reminder": "no",
                        "reminderCount": "14",
                        "reminderDistribution": "masked",
                        "goal": "Eating slowly and mindfully.",
                        "goalContent": "Woof",
                        "goalText": "Take additional 10 minutes to complete your meal.",
                    }
                ];
                var study_data = new StudyJsonData(Participants, import_content);
                study_data.validateFields();
                study_data.validateImport();
                study_data.validateAgainstSchema();
                const expectedFeedback = 'Error validating against schema at object 1';
                const actualFeedback = study_data.getFeedback().indexOf(expectedFeedback) ? expectedFeedback : study_data.getFeedback();
                chai.assert.equal(expectedFeedback, actualFeedback);
            });

            it('Should reject all data if any data is invalid', function () {
                // Second record is invalid due to deprecated fields
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    },
                    {
                        "emailAddress": "JustForTesting26@gmail.com",
                        "condition": "control_initial_affirmation",
                        "implementationIntention": "yes",
                        "selfEfficacy": "high",
                        "reminder": "no",
                        "reminderCount": "14",
                        "reminderDistribution": "masked",
                        "goal": "Eating slowly and mindfully.",
                        "goalContent": "Woof",
                        "goalText": "Take additional 10 minutes to complete your meal.",
                    }

                ];
                var study_data_reject = new StudyJsonData(Participants, import_content);
                study_data_reject.validateFields();
                study_data_reject.validateImport();
                study_data_reject.validateAgainstSchema();
                const expectedValidity = false;
                const actualValidity = study_data_reject.getIsValid();
                chai.assert.equal(expectedValidity, actualValidity);
            });

            it('Should copy valid import data into database if all data is valid.', function () {
                // Valid document
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];

                importParticipantJson(import_content);
                import_content[0].emailAddress = import_content[0].emailAddress.toLowerCase();
                import_content[0].condition = import_content[0].condition.toLowerCase();

                var inserted = Participants.findOne(import_content[0]);
                chai.assert.equal(inserted ? true : false, true);
            });


            it('Should show successful data load message in console.', function () {
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];
                var study_data = new StudyJsonData(Participants, import_content);
                study_data.validateFields();
                const expectedFeedback = 'Load complete';
                const actualFeedback = study_data.getFeedback().indexOf(expectedFeedback) ? expectedFeedback : study_data.getFeedback();
                chai.assert.equal(expectedFeedback, actualFeedback);
            });

            it('Should load participant data in Participants collection if no errors.', function () {
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];
                var already_there = Participants.find({}).count();
                chai.assert.equal(already_there, 0);

                var study_data = new StudyJsonData(Participants, import_content);
                study_data.validateFields();
                study_data.validateImport();
                study_data.validateAgainstSchema();
                study_data.guardedSaveToDatabase();

                var now_there = Participants.find().count();
                chai.assert.equal(now_there, 1);
            });

            it('Loading participant data is additive.', function () {
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];
                var already_there = Participants.find({}).count();
                chai.assert.equal(already_there, 0);

                importParticipantJson(import_content);
                /*
                 var study_data = new StudyJsonData(Participants, import_content);
                 study_data.validateFields();
                 study_data.validateImport();
                 study_data.validateAgainstSchema();
                 study_data.guardedSaveToDatabase();
                 */
                chai.assert.equal(Participants.find({}).count(), 1);

                import_content[0].emailAddress = "BogusForTesting2@parc.com"
                importParticipantJson(import_content);
                /*
                 var study_data = new StudyJsonData(Participants, import_content);
                 study_data.validateFields();
                 study_data.validateImport();
                 study_data.validateAgainstSchema();
                 study_data.guardedSaveToDatabase();
                 now_there = Participants.find({}).count();
                 */
                chai.assert.equal(Participants.find({}).count(), 2);

            });

            it('Should overwrite data for existing email addresses', function () {
                // Valid object
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];
                var already_there = Participants.find({}).count();
                chai.assert.equal(already_there, 0);

                var study_data = new StudyJsonData(Participants, import_content);
                study_data.validateFields();
                study_data.validateImport();
                study_data.validateAgainstSchema();
                study_data.guardedSaveToDatabase();

                var now_there = Participants.find({}).count();
                chai.assert.equal(now_there, 1, "Test set-up item not created");

                // Set up the overwrite
                var newCondition = "I2-01";
                import_content[0].condition = newCondition;

                // Make the overwrite
                var study_data2 = new StudyJsonData(Participants, import_content);
                study_data2.validateFields();
                study_data2.validateImport();
                study_data2.validateAgainstSchema();
                study_data2.guardedSaveToDatabase();
                chai.assert.equal(study_data2.getIsValid(), true, 'isValid should be true after save');

                // Check the overwrite
                chai.assert.equal(Participants.find({}).count(), 1, "Wrong number of items for an update");
                var updated = Participants.findOne();
                chai.assert.equal(updated.condition, newCondition.toLowerCase(), "Existing value not updated");

            });

        });


        /** @locus {admin panel} */
        context('Deleting participant data from database.', function () {

            /** Reset the database after each test! */
            beforeEach(function () {
                TestHelpers.resetDatabase(null, function () {
                });
                // Setup -- Stub definition of Activities collection
                TestHelpers.factory.define('activities',
                    Activities,
                    {
                        code: "32",
                        activity: "Eat_Slower_Eat_Less",
                        tag: "Eat_Slower_Eat_Less",
                        content: "/content/Eat_Slower_Eat_Less/Eat_Slower_Eat_Less.html"
                    });
                // Given -- The participant data has been loaded by the investigator
                TestHelpers.factory.create('activities');

            });

            afterEach(function () {
                TestHelpers.resetDatabase(null, function () {
                });
            });

            it('Should be able to delete all particiapnt data from database all at once.', function () {
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];
                var already_there = Participants.find({}).count();
                chai.assert.equal(already_there, 0);

                var study_data = new StudyJsonData(Participants, import_content);
                study_data.validateFields();
                study_data.validateImport();
                study_data.validateAgainstSchema();
                study_data.guardedSaveToDatabase();

                var now_there = Participants.find({}).count();
                chai.assert.equal(now_there, 1, 'Should be at least 1 starting participants for this test');

                import_content[0].emailAddress = "BogusForTesting2@parc.com";
                var study_data2 = new StudyJsonData(Participants, import_content);
                study_data2.validateFields();
                study_data2.validateImport();
                study_data2.validateAgainstSchema();
                study_data2.guardedSaveToDatabase();
                now_there = Participants.find({}).count();
                chai.assert.equal(now_there, 2, 'Should be at least 2 starting participants for this test');


                const deleteAllPromise = new Promise((resolve, reject) => {
                    Meteor.call("deleteAllParticipants",
                        (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                const now_there = Participants.find({}).count();
                                resolve(now_there);
                            }
                        });
                });
                return deleteAllPromise.then(function (now_there) {
                    chai.assert.equal(now_there, 0, 'Should end up with empty participants database');
                });
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
    describe('StudyJsonData.js', function () {

        beforeEach(function () {
            TestHelpers.resetDatabase(null, function () {
            });
            // Setup -- Stub definition of Activities collection
            TestHelpers.factory.define('activities',
                Activities,
                {
                    code: "32",
                    activity: "Eat_Slower_Eat_Less",
                    tag: "Eat_Slower_Eat_Less",
                    content: "/content/Eat_Slower_Eat_Less/Eat_Slower_Eat_Less.html"
                });
            // Given -- The participant data has been loaded by the investigator
            TestHelpers.factory.create('activities');
        });

        afterEach(function () {
        });

        context('Load participant data in the participant CSV file.', function () {

            it('Should have correctly initialized instance variables upon instantiation', function () {
                //Valid case
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];

                // Run the validations
                var study_data = new StudyJsonData(Participants, import_content);
                // Study object integrity checking on creation - do this once here for all schedulemessaging tests
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true at validation start');
                chai.assert.equal(study_data.getName(), 'participants', 'name should be participants');
                chai.assert.equal(study_data.getOverwriteOnPrimaryKey(), 'emailAddress', "OverwriteOnPrimaryKey should be 'emailAddress'");
                chai.assert.equal(study_data.getAllowDuplication(), undefined, 'AllowDuplication should be undefined');

            });


            it('Should indicate valid data when there is valid data', function () {
                //Valid case
                var import_content = [
                    {
                        "emailAddress": "JustForTesting@parc.com",
                        "condition": "I2-10",
                        "settings": {
                            "name": "Rudolph",
                            "gender": "reindeer",
                            "age": "105",
                            "location": "Here",
                            "selfEfficacy": "high",
                            "implementationIntention": "yes",
                            "reminders": "yes",
                            "reminderDistribution": "masked",
                            "reminderCount": "7"
                        },
                        "preferences": {
                            "goalType": "",
                            "goalSpecific": "",
                            "dailyGoalText": "",
                            "goalContent": "",
                            "choice": "",
                            "place": "",
                            "person": "",
                            "eventTime": "",
                            "reminderPeriod": "",
                            "reminderText": ""
                        }
                    }
                ];
                // Run the validations
                var study_data = new StudyJsonData(Participants, import_content);
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true after initialization');
                study_data.validateFields();
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true after validateFields');
                study_data.validateImport();
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true after validateImport');
                study_data.validateAgainstSchema();
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true after validateAgainstSchema');
                study_data.guardedSaveToDatabase();
                chai.assert.equal(study_data.getIsValid(), true, 'isValid should be true after save');
            })
        });
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
