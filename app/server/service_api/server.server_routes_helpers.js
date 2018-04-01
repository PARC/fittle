/**
 * Created by lnelson on 10/4/16.
 */
import {JsonRoutes} from 'meteor/simple:json-routes';
import {Participants} from '../../lib/api/participants/participants';
import {Scheduledmessages} from '../../lib/api/scheduledmessages/scheduledmessages';
import {Studyevents} from '../../lib/api/studyevents/studyevents';
import {ScheduledMessagesHelper} from '../methods/messages/server.methods.scheduledMessagesHelpers';
import {importScheduledmessagesJson, importParticipantJson} from '../methods/messages/server.methods.studyJsonData';
import {Questions} from '../../lib/api/questions/questions';
import {Tasks} from '../../lib/api/tasks/tasks';
import {Posts} from '../../lib/api/posts/posts';
import {DateHelper} from '../../lib/helpers';
import {Meteor} from 'meteor/meteor';
import {updateNotifications} from '/server/notifications/notifier.helpers';
import {Random} from 'meteor/random';
import {Agents} from '../../lib/api/agents/agents';
import {Logs} from '../../lib/api/logs/logs';


/**
 * Collect exports for this module into a public dictionary
 * @type {{participantMeetsConstraint: participantMeetsConstraint, pushScheduledMessagesForParticipant: pushScheduledMessagesForParticipant, answerQuestion: answerQuestion}}
 */
export const ServerRoutesHelpers = {
    'initializeServerRoutes': initializeServerRoutes
};

/**
 * Service API security
 * token processing
 * @param token
 * @returns {boolean}
 */
function isValidToken(token) {
    if (token == Meteor.settings.private.API_TOKEN) return true;
    return false
}

/**
 * Push questions to participants based on the current state of Scheduledmessages
 */
function pushScheduledMessagesForParticipants() {
    let allParticipants = Participants.find().fetch();
    for (let ix = 0; ix < allParticipants.length; ix++) {
        ScheduledMessagesHelper.pushScheduledMessagesForParticipant(allParticipants[ix].emailAddress)
    }
}

const helpExamples = {
    questions: {
        askDate: "-1",
        askTime: "07:00",
        preferenceToSet: "favouriteColor",
        choices: "Blue, Yellow",
        answers: {
            Blue: "blue",
            Yellow: "thrownOverTheEdgeIntoTheVolcano"
        },
        expireDate: "28",
        expireTime: "23:59",
        notify: "false",
        responseFormat: "list-choose-one",
        sequence: "1",
        name: "Monty Python",
        tag: "exampleQuestion",
        text: "What... is your favourite colour?",
        emailAddress: "lnelson@parc.com"
    },
    tasks: {
        emailAddress: "lnelson@parc.com",
        title: "Take additional 5 minutes for the meal",
        contentLink: "Eat_Slower_Eat_Less",
        scheduledDay: 0,
        schedule: "relative"
    },
    scheduledmessages: {
        sequences: [
            {
                name: "goalTypeSelect",
                constraints: [
                    {
                        attribute: "preferences.goalType",
                        value: ""
                    }
                ],
                askDate: "-1",
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
                        preferenceToSet: "goalType"
                    }
                ]
            }
        ]
    },
    participants: {
        emailAddress: "lnelson@parc.com",
        condition: "I2-10",
        settings: {
            name: "Les",
            gender: "robot",
            age: "105",
            location: "Here",
            selfEfficacy: "high",
            implementationIntention: "yes",
            reminders: "yes",
            reminderDistribution: "masked",
            reminderCount: "7"
        },
        preferences: {
            goalType: "",
            goalSpecific: "",
            dailyGoalText: "",
            goalContent: "",
            choice: "",
            place: "",
            person: "",
            eventTime: "",
            reminderPeriod: "",
            reminderText: ""
        }
    }
};

const helpDescriptions = {
    questions: {
        askDate: "Number for askDate (days since challenge start, -1 means available since before challenge start",
        askTime: "HH:mm (24 hour time)",
        preferenceToSet: "atttribute to set in participant.preferences",
        choices: "Comma separated array of human readable choices that the participant is making",
        answers: "Dictionary for how choices map to internally used answers (e.g., values appropirate for preferenceToSet",
        expireDate: "Number for expireDate",
        expireTime: "HH:mm",
        notify: "true|false",
        responseFormat: "list-choose-one | list-choose-multiple | text | time",
        sequence: "String value of a sequence number to order questions asked at the same date and time",
        name: "Name used for a question - can be anything useful for the study",
        tag: "Tags used for a question - can be anything useful for the study",
        text: "Text of the question",
        emailAddress: "Who is this question going to"
    },
    tasks: {
        emailAddress: "Who is this task going to",
        title: "Display title for the activity",
        contentLink: "Content link for the activity (Maching something in /private/activities.jon",
        scheduledDay: "Number day in challenge",
        schedule: "absolute|relative (absolute day in the challenge, relative from now)"
    },
    scheduledmessages: {
        sequences: "array of question sequences",
        name: "Name used for a sequence question - can be anything useful for the study",
        constraints: "Logical expression structure for attributes and their values that may constrain the asking of a question sequence",
        askDate: "Number for askDate (days since challenge start, -1 means available since before challenge start",
        askTime: "HH:mm (24 hour time)",
        expireDate: "Number for expireDate",
        expireTime: "HH:mm",
        sequenceBase: "Base sequence number to be added to question sequence numbers",
        questions: "Array of question data that make up this sequnce of questions",
        tag: "Tags used for a question - can be anything useful for the study",
        text: "Text of the question",
        responseFormat: "list-choose-one | list-choose-multiple | text | time",
        choices: "Dictionary for how choices map to internally used answers (e.g., values used in participant.preferences attributes : values appropirate for participants to read",
        preferenceToSet: "atttribute to set in participant.preferences",
    },
    participants: {
        emailAddress: "Who is this person",
        condition: "Study specific code for participant's study cond-tion",
        settings: "Dictionary of attribute-value pairs describing a participant - can be anything useful for the study",
        preferences: "Dictionary of attribute-value pairs describing a participant that can be set by answers to questions - can be anything useful for the study but should be internally consistent"
    }
};

const exampleAPICalls = [
    'curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/resetAllForTesting/superWoof',
    'curl -H "Content-Type: application/json" -X POST -d @/Users/lnelson/meteor_home/positivedayI2/data/json/I2QuestionsGoalTypeSelect.json http://localhost:3000/serviceapi/scheduledmessages/add/woof',
    'curl -H "Content-Type: application/json" -X POST -d @/Users/lnelson/meteor_home/positivedayI2/data/json/I2QuestionsI2Select.json http://localhost:3000/serviceapi/scheduledmessages/add/woof',
    'curl -H "Content-Type: application/json" -X POST -d @/Users/lnelson/meteor_home/positivedayI2/data/json/I2QuestionsSpecificGoalSelect.json http://localhost:3000/serviceapi/scheduledmessages/add/woof',
    'curl -H "Content-Type: application/json" -X POST -d @/Users/lnelson/meteor_home/positivedayI2/data/json/onboardingI2.json http://localhost:3000/serviceapi/participants/add/woof',
    'curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/scheduledmessages/woof',
    'curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/participants/woof',
    'curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/questions/woof',
    'curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/tasks/woof',
    'curl -H "Content-Type: application/json" -X POST -d @/Users/lnelson/meteor_home/positivedayI2/data/json/exampleQuestion.json http://localhost:3000/serviceapi/questions/add/woof',
    'curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/participant/<put ID here>/woof',
    'curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/scheduledmessages//woof',
    'curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/question/<put ID here>/woof',
    'curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/task/<put ID here>/woof'

];

/**
 * Add Help server routes
 * @param collection
 */
function justHelp(collection) {
    if (helpExamples[collection])
        JsonRoutes.add("GET", "/serviceapi/" + collection + "/help/:token", function (req, res, next) {
                let token = req.params.token;
                let status = false;
                let result = 'No help for ' + collection;

                if (isValidToken(token)) {
                    if (collection) {
                        result = {
                            collection: collection,
                            example: helpExamples[collection],
                            description: helpDescriptions[collection]
                        }
                    }
                    status = true
                } else {
                    result = 'Access denied'
                }
                console.log('INFO GET /serviceapi/' + collection + '/help');
                JsonRoutes.sendResult(res, {
                    data: {
                        status: status,
                        timestamp: DateHelper.standardTimezoneDate(Date.now()),
                        results: result
                    }
                });
            }
        );
    if (!collection)
        JsonRoutes.add("GET", "/serviceapi/help/:token", function (req, res, next) {
                let token = req.params.token;
                let status = false;
                let result = 'No help for ' + collection;

                if (isValidToken(token)) {
                    result = {
                        example_API_calls: exampleAPICalls
                    }
                    status = true
                } else {
                    result = 'Access denied'
                }
                console.log('INFO GET /serviceapi/' + collection + '/help');
                JsonRoutes.sendResult(res, {
                    data: {
                        status: status,
                        timestamp: DateHelper.standardTimezoneDate(Date.now()),
                        results: result
                    }
                });
            }
        );
}

/**
 * Add server routes for Coach API to scheduledmessages
 */
function justScheduledmessages() {
    JsonRoutes.add("POST", "/serviceapi/scheduledmessages/add/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No add performed';
            let status = false;

            if (isValidToken(token)) {
                if (req.body.sequences) {
                    result = importScheduledmessagesJson(req.body);
                    pushScheduledMessagesForParticipants()
                    status = true
                }
            } else {
                result = 'Access denied'
            }
            let resultString = result.replace(new RegExp('<br/>', 'g'), '; ');
            console.log('INFO POST /serviceapi/scheduledmessages/add ' + resultString)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: resultString
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/scheduledmessages/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                result = Scheduledmessages.find({}, {
                    fields: {name: 1, sequence: 1},
                    sort: {name: 1, sequence: 1}
                }).fetch();
                status = true
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/scheduledmessages/ ');
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/scheduledmessages/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                result = Scheduledmessages.findOne({_id: id});
                if (result) {
                    status = true
                } else {
                    result = "Scheduledmessage with ID " + id + " not found";
                }
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/scheduledmessages/ ' + id)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("DELETE", "/serviceapi/scheduledmessages/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No deletion';
            let status = false;

            if (isValidToken(token)) {
                result = Scheduledmessages.remove({_id: id});
                if (result) {
                    status = true
                } else {
                    result = "Scheduledmessage with ID " + id + " not found";
                }
            } else {
                result = 'Access denied'
            }
            let resultsString = result + ' item' + (result === 1 ? '' : 's') + ' removed';
            console.log('INFO DELETE /serviceapi/scheduledmessages/ ' + id)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: resultsString
                }
            });
        }
    );

}

/**
 * Add server routes for Coach API to participants
 */
function justParticipants() {
    JsonRoutes.add("POST", "/serviceapi/participants/add/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No add performed';
            let status = false;

            if (isValidToken(token)) {
                result = importParticipantJson(req.body);
                pushScheduledMessagesForParticipants();
                status = true
            } else {
                result = 'Access denied'
            }
            let resultString = result.replace(new RegExp('<br/>', 'g'), '; ');
            console.log('INFO POST /serviceapi/participants/add ');
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: resultString
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/participants/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                result = Participants.find({}, {
                    fields: {studyId: 1, condition: 1},
                    sort: {studyId: 1}
                }).fetch();
                status = true
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/participants/ ');
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/participants/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                result = Participants.findOne({_id: id});
                if (result) {
                    status = true
                } else {
                    result = Participants.findOne({studyId: id});
                    if (result) {
                        status = true
                    } else {
                        result = "Participant with ID " + id + " not found";
                    }
                }
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/participants/:id ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("DELETE", "/serviceapi/participants/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No deletion';
            let status = false;

            if (isValidToken(token)) {
                result = Participants.remove({_id: id});
                if (result) {
                    status = true
                } else {
                    result = Participants.remove({studyId: id});
                    if (result) {
                        status = true
                    } else {
                        result = "Participant with ID " + id + " not found";
                    }
                }
            } else {
                result = 'Access denied'
            }
            let resultsString = result + ' item' + (result === 1 ? '' : 's') + ' removed';
            console.log('INFO DELETE /serviceapi/participants/:id ' + resultsString)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: resultsString
                }
            });
        }
    );

    JsonRoutes.add("POST", "/serviceapi/participants/update/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No update performed';
            let status = false;

            if (isValidToken(token)) {
                let emailAddress = req.body.emailAddress;
                let studyId = req.body.studyId;
                let attribute = req.body.attribute;
                let value = req.body.value;
                if (studyId) {
                    status = Participants.setAttributeByStudyId(studyId, attribute, value);
                } else {
                    status = Participants.setAttribute(emailAddress, attribute, value);
                }
                ScheduledMessagesHelper.pushScheduledMessagesForParticipant();
                result = 'Update performed on ' + (studyId ? studyId : emailAddress) + ' setting ' + attribute + ' to ' + value;
            } else {
                result = 'Access denied'
            }
            console.log('INFO POST /serviceapi/participants/update ');
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );


    JsonRoutes.add("POST", "/serviceapi/participants/incrementday/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No increment performed';
            let status = false;

            if (isValidToken(token)) {
                let participant = Participants.findOne({_id: id});
                if (!participant) {
                    participant = Participants.findOne({studyId: id});
                }
                if (participant) {
                    Meteor.call(
                        "updateChallengeStart",
                        participant._id,
                        participant.challengeStartUTC,
                        -1);
                    result = 'Increment challenge day performed on ' + participant.emailAddress;
                    status = true
                } else {
                    result = "Participant with ID " + id + " not found";
                }
            } else {
                result = 'Access denied'
            }
            console.log('INFO POST /serviceapi/participants/incrementday ' + result);
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

}

/**
 * Add a question based on an imported JSON Question specification
 * @param jsonQuestionItem
 * @returns {string}
 */
function importQuestionFromJSON(jsonQuestionItem) {
    //Find this user's condition
    let result = "No question added";
    if (jsonQuestionItem && jsonQuestionItem.emailAddress) {
        let thisParticipant = Participants.findOne({emailAddress: jsonQuestionItem.emailAddress});
        if (thisParticipant) {
            var daysSinceRegistered = DateHelper.daysSince(thisParticipant.studyStartUTC);
            // -1 means 'schedule this for before the challenge starts'
            if (jsonQuestionItem.askDate === "-1" || isFutureDay(jsonQuestionItem.askDate, daysSinceRegistered)) {

                var askDate = ScheduledMessagesHelper.addDaysToUserRegistrationDate(jsonQuestionItem.askDate,
                    thisParticipant.studyStartUTC, daysSinceRegistered,
                    DateHelper.preferredTimezoneForUser(thisParticipant.emailAddress));
                var askTime = jsonQuestionItem.askTime;

                var expireDate = ScheduledMessagesHelper.addDaysToUserRegistrationDate(jsonQuestionItem.expireDate,
                    thisParticipant.studyStartUTC, daysSinceRegistered,
                    DateHelper.preferredTimezoneForUser(thisParticipant.emailAddress));
                var expireTime = jsonQuestionItem.expireTime;

                var questionText = jsonQuestionItem.text;
                var responseFormat = jsonQuestionItem.responseFormat;
                var choices = jsonQuestionItem.choices ? jsonQuestionItem.choices.split(',') : [];
                var answers = jsonQuestionItem.answers ? jsonQuestionItem.answers : {};
                var tagstring = jsonQuestionItem.tag;
                var sequence = jsonQuestionItem.sequence;
                var name = jsonQuestionItem.name;
                var username = jsonQuestionItem.emailAddress;
                var notify = jsonQuestionItem.notify;
                var preferenceToSet = jsonQuestionItem.preferenceToSet ? jsonQuestionItem.preferenceToSet : null;
                var taskId = null;
                var none = jsonQuestionItem.noneAllowed ? jsonQuestionItem.noneAllowed : false;
                // Insert a question into the collection
                try {
                    updateNotifications(
                        Questions.addQuestion(
                            questionText,
                            responseFormat,
                            choices,
                            username,
                            tagstring,
                            askDate,
                            askTime,
                            expireDate,
                            expireTime,
                            sequence,
                            notify,
                            name,
                            preferenceToSet,
                            answers,
                            taskId,
                            none,
                            jsonQuestionItem.askDate,
                            jsonQuestionItem.expireDate,
                            jsonQuestionItem.props ? jsonQuestionItem.props : {}
                        )
                    );
                    result = "Added question: " + jsonQuestionItem.name + " @ " + jsonQuestionItem.askDate
                } catch (err) {
                    result += "; Error: " + err.message
                }
            } else {
                result = "Ignoring past question: " + jsonQuestionItem.name + " @ " + jsonQuestionItem.askDate
            }
        }
    }
    console.log("INFO importQuestionFromJSON: " + result);
    return result
}

/**
 * Add server routes for Coach API to questions
 */
function justQuestions() {
    JsonRoutes.add("POST", "/serviceapi/questions/add/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No add performed';
            let status = false;

            if (isValidToken(token)) {
                if (req.body) {
                    result = importQuestionFromJSON(req.body);
                    status = true
                }
            } else {
                result = 'Access denied'
            }
            console.log('INFO POST /serviceapi/questions/add ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/questions/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                try {
                    result = Questions.find({}, {
                        sort: {username: 1, askDate: 1, askTime: 1, sequence: 1}
                    }).fetch();
                } catch (err) {
                    result = 'Error in /serviceapi/questions/ ' + err.message
                }
                status = true
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/questions/ ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/questions/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                try {
                    result = Questions.findOne({_id: id});
                    if (result) {
                        status = true
                    } else {
                        result = "Question with ID " + id + " not found";
                    }
                } catch (err) {
                    result = 'Error in /serviceapi/questions/:id/ ' + err.message
                }
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/questions/:id ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("DELETE", "/serviceapi/questions/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No deletion';
            let status = false;

            if (isValidToken(token)) {
                let removeResult = Questions.remove({_id: id});
                let result = removeResult + ' item' + (removeResult === 1 ? '' : 's') + ' removed';
                status = true
            } else {
                result = 'Access denied'
            }
            console.log('INFO DELETE /serviceapi/questions/:id ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

}

/**
 * Parse which day is indicated
 *
 * @param day
 * @param daysSinceRegistered
 * @param schedule
 * @returns {*}
 */
function getDay(day, daysSinceRegistered, schedule) {
    let thisSchedule = schedule && schedule.toLowerCase && schedule.toLowerCase() === 'relative' ? 'relative' : 'absolute';
    if (thisSchedule === 'relative') {
        try {
            return (parseInt(day) + daysSinceRegistered).toString()
        } catch (err) {
            console.log("WARN Error in getDay: " + err.message);
        }
    }
    return day
}

/**
 * Add a question based on an imported JSON Question specification
 * @param jsonTaskItem
 * @returns {string}
 */
/*
 Example input
 {
 "emailAddress" : "lnelson@parc.com",
 "title" : "Take additional 5 minutes for the meal",
 "contentLink" : "Eat_Slower_Eat_Less",
 "scheduledDay" : 0,
 "schedule" : "relative"
 }
 */

/**
 * Get the Meteor user id from a participant's email address
 * @param emailAddress
 */
function getUserId(emailAddress) {
    try {
        return Meteor.users.findOne({username: emailAddress})._id
    } catch (err) {
        return null
    }
}


/**
 * Check that a day number has not passed already for a user
 * @param str
 * @param daysSinceRegistered
 * @returns {*}
 */
function isFutureDay(thisDay, daysSinceRegistered) {
    try {
        return (Number(checkForNow(thisDay, daysSinceRegistered)) > daysSinceRegistered)
    } catch (err) {
        console.log('Warn isFutureDay ' + err.message)
        return false
    }
}

/**
 * Helper function to process added Task
 * @param jsonTaskItem
 * @returns {string}
 */
function importTaskFromJSON(jsonTaskItem) {
    //Find this user's condition
    let result = "No task added";
    if (jsonTaskItem && jsonTaskItem.emailAddress) {
        let thisParticipant = Participants.findOne({emailAddress: jsonTaskItem.emailAddress});
        if (thisParticipant) {
            var daysSinceRegistered = DateHelper.reactiveDaysSince(thisParticipant.studyStartUTC);
            // -1 means 'schedule this for before the challenge starts'
            let askDay = getDay(jsonTaskItem.scheduledDay, daysSinceRegistered, jsonTaskItem.schedule);
            if (askDay === "-1" || ScheduledMessagesHelper.isFutureDay(askDay, daysSinceRegistered)) {
                // Insert a task into the collection
                let thisUserId = getUserId(jsonTaskItem.emailAddress);
                if (thisUserId) {
                    try {
                        var taskData = Tasks.create(
                            thisUserId,
                            jsonTaskItem.title,
                            askDay,
                            jsonTaskItem.emailAddress,
                            jsonTaskItem.contentLink);
                        Tasks.insert(taskData);
                        result = "Added task: " + jsonTaskItem.title + " @ " + askDay
                    } catch (err) {
                        result += "; Error: " + err.message
                    }
                } else {
                    result += "; User not found: " + jsonTaskItem.emailAddress
                }
            } else {
                result += "; Ignoring past task: " + jsonTaskItem.title + " @ " + askDay
            }
        }
    }
    console.log("INFO importTaskFromJSON: " + result);
    return result
}

/**
 * Helper function to process added Post
 * @param jsonPostItem
 * @returns {string}
 */
function importPostFromJSON(jsonPostItem) {
    //Find this user's condition
    let result = "No post added";
    if (jsonPostItem && jsonPostItem.emailAddress) {
        let thisParticipant = Participants.findOne({emailAddress: jsonPostItem.emailAddress});
        if (thisParticipant) {
            // Insert a task into the collection
            let thisUserId = getUserId(jsonPostItem.emailAddress);
            if (thisUserId) {
                try {
                    var postsData = Posts.create(
                        jsonPostItem.emailAddress,
                        jsonPostItem.text,
                        jsonPostItem.topic);
                    Posts.insert(postsData);
                    result = "Added post for " + jsonPostItem.emailAddress + ": " + jsonPostItem.text
                } catch (err) {
                    result += "; Error: " + err.message
                }
            } else {
                result += "; User not found: " + jsonPostItem.emailAddress
            }

        }
    }
    console.log("INFO importPostFromJSON: " + result);
    return result
}

/**
 * Add server routes for Coach API to tasks
 */
function justPosts() {
    JsonRoutes.add("POST", "/serviceapi/posts/add/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No add performed';
            let status = false;

            if (isValidToken(token)) {
                if (req.body) {
                    result = importPostFromJSON(req.body);
                    status = true
                }
            } else {
                result = 'Access denied'
            }
            console.log('INFO POST /serviceapi/tasks/add ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/posts/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                try {
                    result = Posts.find({}, {
                        sort: {emailAddress: 1, topic: 1, createdAt: 1}
                    }).fetch();
                } catch (err) {
                    result = 'Error in /serviceapi/posts/ ' + err.message
                }
                status = true
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/posts/ ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/posts/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                try {
                    result = Posts.findOne({_id: id});
                    if (result) {
                        status = true
                    } else {
                        result = "Post with ID " + id + " not found";
                    }
                } catch (err) {
                    result = 'Error in /serviceapi/posts/:id/ ' + err.message
                }
                status = true
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/posts/:id ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("DELETE", "/serviceapi/posts/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No deletion';
            let status = false;

            if (isValidToken(token)) {
                result = Posts.remove({_id: id});
                status = true
            } else {
                result = 'Access denied'
            }
            let resultsString = result + ' item' + (result === 1 ? '' : 's') + ' removed';
            console.log('INFO DELETE /serviceapi/posts/:id ' + resultsString)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: resultsString
                }
            });
        }
    );

}

/**
 * Add server routes for Coach API to tasks
 */
function justTasks() {
    JsonRoutes.add("POST", "/serviceapi/tasks/add/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No add performed';
            let status = false;

            if (isValidToken(token)) {
                if (req.body) {
                    result = importTaskFromJSON(req.body);
                    status = true
                }
            } else {
                result = 'Access denied'
            }
            console.log('INFO POST /serviceapi/tasks/add ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/tasks/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                try {
                    result = Tasks.find({}, {
                        fields: {username: 1, askDate: 1, askTime: 1, sequence: 1},
                        sort: {username: 1, askDate: 1, askTime: 1, sequence: 1}
                    }).fetch();
                } catch (err) {
                    result = 'Error in /serviceapi/tasks/ ' + err.message
                }
                status = true
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/tasks/ ' + result);
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/todaysTasks/:token", function (req, res, next) {
            let token = req.params.token;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                try {
                    result = [];
                    let parts = Participants.find({}).fetch();
                    _.forEach(parts, (p) => {
                        let day = Participants.getChallengeDay(p);
                        let pTask = Tasks.findOne(
                            {
                                $and: [
                                    {emailAddress: p.emailAddress, scheduledDate: day},
                                    {
                                        $or: [
                                            {emailSent: null},
                                            {emailSent: {$exists: false}},
                                            {emailSent: false}
                                        ]
                                    }]
                            });
                        if (pTask) {
                            result.push(pTask)
                        }
                    });
                } catch (err) {
                    result = 'Error in /serviceapi/todaysTasks/ ' + err.message
                }
                status = true
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/todaysTasks/ ' + result);
            console.log(JSON.stringify(result));
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/taskDone/:userId/:scheduledDate/:token", function (req, res, next) {
            let token = req.params.token;
            let userId = req.params.userId;
            let scheduledDate = parseInt(req.params.scheduledDate);
            let result = 'error';
            let status = false;

            console.log('INFO GET /serviceapi/taskDone/ ' + userId + "/" + scheduledDate + "/" + token);

            if (isValidToken(token)) {
                console.log('INFO GET /serviceapi/taskDone/ ' + userId + "/" + scheduledDate);
                try {
                    Tasks.update({userId: userId, scheduledDate: scheduledDate}, {$set: {emailSent: true}});
                    result = "ok";
                } catch (err) {
                    result = 'Error in /serviceapi/tasksDone/ ' + err.message
                }
                status = true;
            } else {
                result = 'Access denied'
            }
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi/tasks/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No data';
            let status = false;

            if (isValidToken(token)) {
                try {
                    result = Tasks.findOne({_id: id});
                    if (result) {
                        status = true
                    } else {
                        result = "Task with ID " + id + " not found";
                    }
                } catch (err) {
                    result = 'Error in /serviceapi/tasks/:id/ ' + err.message
                }
                status = true
            } else {
                result = 'Access denied'
            }
            console.log('INFO GET /serviceapi/tasks/:id ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("DELETE", "/serviceapi/tasks/:id/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No deletion';
            let status = false;

            if (isValidToken(token)) {
                result = Tasks.remove({_id: id});
                status = true
            } else {
                result = 'Access denied'
            }
            let resultsString = result + ' item' + (result === 1 ? '' : 's') + ' removed';
            console.log('INFO DELETE /serviceapi/tasks/:id ' + resultsString)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: resultsString
                }
            });
        }
    );

}

/**
 * Add all server routes
 */
export function initializeServerRoutes() {

    justScheduledmessages();
    justParticipants();
    justQuestions();
    justTasks();
    justPosts();
    justHelp('questions');
    justHelp('participants');
    justHelp('scheduledmessages');
    justHelp('tasks');
    //TODO justHelp('posts');
    justHelp('');
    justCoaching();


    JsonRoutes.add("DELETE", "/serviceapi/resetAllForTesting/:token", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No deletion';
            let status = false;

            if (token === Meteor.settings.private.API_TOKEN_ADMIN) {
                result = "Remove Participants: " + Participants.remove({});
                result += "; Remove Scheduledmessages: " + Scheduledmessages.remove({});
                result += "; Remove Questions: " + Questions.remove({});
                result += "; Remove Tasks: " + Tasks.remove({});
                result += "; Remove Users: " + Meteor.users.remove({username: {$ne: 'admin@parc.com'}});
                result += "; Remove Logs: " + Logs.remove({});
                status = true;
            }
            console.log('INFO DELETE /serviceapi/scheduledmessages/:id ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );

    JsonRoutes.add("GET", "/serviceapi", function (req, res, next) {
            let token = req.params.token;
            let id = req.params.id;
            let result = 'No service available';
            let status = false;


            console.log('INFO GET /serviceapi ' + result)
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    );
}

/**
 * Add route for a coach-agent registering with the Fittle server
 * NOTE: this ability was the intended means for dynamic agent management, but currently
 * we use static agent management through /parccoach/app/private/agents.json
 * Note also that started to introduce the notion that a coach agent would 'subscribe' to a subset
 * of possible Fittle events. Currently we statically send over whatever events are instrumented into the
 * code (via Meteor method call to httpSendToAllAgents.
 */
function justRegister() {
    JsonRoutes.add("GET", "/serviceapi/register/:name/:token", function (req, res, next) {
        let token = req.params.token;
        let agentName = req.params.name;
        let status = false;
        let result = {};

        let agentIP = null;
        if (req && req.headers) {
            console.log("INFO GET /serviceapi/register/ from IP " + req.headers['x-forwarded-for']);
            agentIP = req.headers['x-forwarded-for']
        }

        if (isValidToken(token)) {
            let agent = Agents.findOne({name: agentName});
            if (agent && agent.active && agentIP) {
                let newToken = Random.hexString(32);
                result = {
                    apiToken: newToken
                };
                status = true;
                Agents.update({_id: agent._id}, {$set: {apiToken: newToken, ip: agentIP}})
            }
            console.log('INFO GET /serviceapi/register/' + agentName);
            JsonRoutes.sendResult(res, {
                data: {
                    status: status,
                    timestamp: DateHelper.standardTimezoneDate(Date.now()),
                    results: result
                }
            });
        }
    });
}

/**
 * Add routes for a coach-agent with the Fittle server
 * */
function justCoaching() {
    //justRegister(); // Leaving this here for future reference
    JsonRoutes.add("GET", "/serviceapi/sync/:name/:token", function (req, res, next) {
        let token = req.params.token;
        let agentName = req.params.name;
        let status = false;
        let result = {};


        if (isValidToken(token)) {
            let agent = Agents.findOne({name: agentName});
            if (agent && agent.active && agent.url) {
                let studyevents = Studyevents.find({shared: {"$ne": agent.url}}).fetch();
                result = "Found " + studyevents.length + " unsent events";
                status = true;
                for (let ix = 0; ix < studyevents.length; ix++) {
                    let studyevent = studyevents[ix];
                    Meteor.call('httpReSendToOneAgent', agent.name, studyevent)
                }
            }
            console.log('INFO GET /serviceapi/sync/' + agentName);
        }
        JsonRoutes.sendResult(res, {
            data: {
                status: status,
                timestamp: DateHelper.standardTimezoneDate(Date.now()),
                results: result
            }
        });

    });

}
