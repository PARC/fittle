# PARC Coach Specification Files

This describes documents Coach-related API calls to the Meteor Server

## Repository Structure

|File |Purpose  |
|----|:----|
|`server.server_routes_helpers.js` |Server Route implementation of Coaching API|
|`README.md` |This file|

## API CURL Examples

```
curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/resetAllForTesting/superWoof
curl -H "Content-Type: application/json" -X POST -d @./data/json/onboardingI2.json http://localhost:3000/serviceapi/participants/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsGoalTypeSelect.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsI2Select.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsSpecificGoalSelect.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsReporting.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/scheduledmessages/woof
curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/participants/woof
curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/questions/woof
curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/tasks/woof
curl -H "Content-Type: application/json" -X POST -d @/Users/lnelson/meteor_home/positivedayI2/data/json/exampleQuestion.json http://localhost:3000/serviceapi/questions/add/woof
curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/participant/<put ID here>/woof
curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/scheduledmessages//woof
curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/question/<put ID here>/woof
curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/task/<put ID here>/woof
```

See data files in parccoach/app/data/json/

## API Field meanings

```
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
```

