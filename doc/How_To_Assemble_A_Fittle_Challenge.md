# Guide for Creating _Fittle_ Challenge

This document describes practical steps in assembling the data needed for a Fittle Challenge.

Main references: doc/Content_README.md and app/data/How to Use Fittle Admin Interface.pdf

1. Create a Participant whitelist

    1.1 For example, see app/data/json/onboardingExample.json

    ```
    {
        "emailAddress": "test1@example.com",
        "condition": "control",
        "settings": {
          "name": "Test1",
          "studyId": "P1",
          "language": "en",
          "challengeActivities": "/content/I2/activityScheduleI2.json"
        },
        "preferences": {
          "displayName" : ""
        }
      }
    ```

    1.2 It is most important to set the emailAddress attribute as this is used to whitelist a Participant for logging into the Fittle App.

    1.3 It is important to set the challengeActivities attribute as this determines which activities are scheduled for a person when a challenge is started.

    1.4 The language setting directs which internationalization scheme should be used for this Participant; e.g., app/i18n/en.i18n.json

    1.5 Preference are used to constrain whether a scheduled message gets scheduled or not. You can included more preferences or not, this is not enforced by the system. If there are extras that
    are not used this does not cause a problem. Answering a question can set a preference.

    1.6 You can used the condition attribute to constrain scheduled messages. This is not the case in this example challenge. Otherwise this attribute is just for record keeping about the
    Particiapnt. You can include other such attributes if you like, but we tend to put such 'record-keeping' attributes into the settings group. For example, studyId is for record-keeping only. This is not enforced by the system. If there are extras that
    are not used this does not cause a problem.

2. Create activities for a Participant

    2.1 For example, see app/private/activityScheduleI2.json

    2.2 Make sure the activities are available in the settings.json file, private.ACTIVITIES_PATH attribute list.

    2.3 See doc/Content_README.md about the scheme for defining the activity JSON structures.

    2.4 Note that each individual can be assigned their own activity sequence in this way. Typically, each study group such as 'control' vs. 'treatment' groups.
    get their own activities.

3. Create Scheduled Messages for participants.

    3.1 For example see app/data/json/GetDisplayName.json

    ```
        {
          "name": "getDisplayName",
          "constraints": [
            {
              "attribute": "preferences.displayName",
              "value": ""
            }
          ],
          "askDate": "-1",
          "askTime": "07:00",
          "expireDate": "28",
          "expireTime": "23:59",
          "sequenceBase": 10,
          "questions": [
            {
              "tag":"you",
              "text": "Set the public display name to be seen by your team members.",
              "responseFormat": "text",
              "choices": [],
              "preferenceToSet": "displayName",
              "props": {
                "textLabel":"Display name",
                "textPlaceholder":"Display name (min 2 chars)",
                "startWithChar": true,
                "minLength": 2
              }
            }
          ]
        }
    ```

    3.2 The constraints determine if a Scheduled Message for a given challenge day (i.e., askDate, above) should be asked as a Question.
    If there are multiple constraints in the constraints array, there is an implied 'AND' operation on these constraints.

    3.3. For example, in the getDisplayName Scheduled Message, if preferences.displayName is not set, then a Question is asked of the Participant
    to set it, provided that the challenge is not greater than 28 days from the Participant registering with the app.  The "-1" askDate above
    simply guarantees that this question is always eligible to be asked since once registering the challenge day is greater than or equal to 0.

    3.4 The preferenceToSet attribute above causes the users answer to the asked question to be stored into that Participants 'preferences' group (see 1.1, above).

    3.5 Note that you could have subsequent Scheduled Messages that then are constrained by this user's answer that preferenceToSet. In this way you can get a tree of questions
    that depend on previous answers.

    3.6 Note that Questions are much like Scheduled Messages, except they have an actual date and time assigned to them, not the relative challenge day integer.

    3.7 Note that the 'sequenceBase' attribute acts like a priority number for questions.  The way scheduled messages get asked is questions is through the following ordering:

    ..3.7.1 If a scheduled message is between its ask date and time and expire date and time, it is eligible to be asked as a question.

    ..3.7.2 If a scheduled message passes its constraint, it is eligible to be asked as a question.

    ..3.7.3 If a scheduled message has not already been asked, it is eligible to be asked as a question.

    ..3.7.4 The eligible scheduled message with the lowest sequenceBase gets scheduled as a question first.

    3.8 Note that uestions get asked with the following response type: text entry, choice of one among several options, choice of many among several options, and a time value.
    If instead of a question you simply one to make a statement to the user, you can phrase that as a statement with no question make and a choice of only one option (e.g., "OK").

    3.9 Note that you can use the constraints to give different messages to different groups or individuals, e.g., 'control' vs. 'treatment' groups.

4. Create special Scheduled Messages to be trigger by the user reporting on an Activity

    4.1 For example, see app/data/json/I2QuestionsReporting.json
    ```
        {
          "name": "activityDebrief",
          "constraints": [
            {
              "attribute": "settings.goalReported",
              "value": "3"
            }
          ],
          "askDate": "3",
          "askTime": "00:00",
          "expireDate": "3",
          "expireTime": "23:59",
          "sequenceBase": 200,
          "linkToActivity": true,
          "questions": [
            {
              "tag": "difficulty",
              "text": "How difficult was it to meet this goal?",
              "responseFormat": "list-choose-one",
              "choices": {
                "1": "Not at all difficult",
                "2": "Slightly difficult",
                "3": "Somewhat difficult",
                "4": "Moderately difficult",
                "5": "Extremely difficult"
              }
             ...
            }
          ]
        }
    ```

    4.2 The settings.goalReported attribute above is special. The Fittle code for reporting about an activity sets this value to the current challenge day upon
    the user making a report about an activity (i.e., clicking the 'X' or 'check-mark'  buttons on the Fittle Activity View).

    4.3 This constraint on the scheduled message then allows these questions to be asked for the current day.  In the example above, that would be challenge day '3'

5. Create any daily messages or tips

    5.1 These are simply Scheduled Messages that provide the information for that day.

    5.2 For example, see app/data/json/ExampleDailyTips.json

    5.3 You can write a program to generate sequences of repetitive Scheduled Messages. For example, see app/data/.json

6. To start a person on a challenge

    6.1 Use the Admin interface. See app/data/How to Use Fittle Admin Interface.pdf

    6.2 Upload the Participant whitelist. Note you can also do this via a script such as app/shell/example.resetForTesting.sh.

    6.3 Once the person registers, you can see that in the Admin Participant panel.

    6.4 Assign the Participant to a team using the Admin Team interface.

    6.5 When you have enough people on a team for the purposes of the study, start that team's challenge using the Admin Team interface.

   .
