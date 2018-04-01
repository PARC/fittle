# PARC Coach API

This describes document JSON structures used in the I2 studies
## Repository Structure

|File |Purpose  |
|----|:----|
|`I2QuestionsGoalTypeSelect.json` |Scheduledmessages for selecting a general goal|
|`I2QuestionsSpecificGoalSelect.json` | Scheduledmessages for selecting a specific goal|
|`I2QuestionsI2Select.json` |Scheduledmessages for implementation intention seeking |
|`I2QuestionsReporting.json` |Scheduledmessages for asking after reporting |
|`onboarding.json` | Participants white list|

## Participants field meanings

```
[
  {
    "emailAddress": "email address used to contact Participant for this study",
    "condition": "any string, assigned by Study Adminstartor or coach agent",
    "settings": { [values set about the Participant]
      "selfEfficacy": "e.g., high",
      "implementationIntention": "e.g., yes",
      "reminders": "e.g., yes",
      "reminderDistribution": "e.g., masked",
      "reminderCount": "e.g., 7",
      "goalReported": "e.g., empty"
    },
    "preferences" : { [Values obtained by answering questions]
      "goalType": "OPTIONAL: default value",
      "goalSpecific": "OPTIONAL: default value",
      "dailyGoalText": "OPTIONAL: default value",
      "difficulty":"OPTIONAL: default value",
      "goalContent": "OPTIONAL: default value",
      "choice": "OPTIONAL: default value",
      "place": "OPTIONAL: default value",
      "person": "OPTIONAL: default value",
      "eventTime": "OPTIONAL: default value",
      "reminderPeriod": "OPTIONAL: default value",
      "reminderText": "OPTIONAL: default value"
    }
  },
  {
  ... repeat as needed
  }
```

## Scheduledmessages field meanings

```
  "sequences": [
    {
      "name": "name of the scheduled message sequence",
      "constraints": [
        {
          "attribute": "stored participant value field; e.g., preferences.goalType",
          "value": "if this attribute has this value, the constraint passes and a question can be scheduled"
        }
      ],
      "askDate": "day in challenge when this message should become available; e.g., -1, 0, 1, ...",
      "askTime": "24hour time; e.g., 07:00",
      "expireDate": "day in challenge when this message should no longer be available; e.g., 28",
      "expireTime": "24hour time; 23:59",
      "sequenceBase": 10,  [Number which orders questions below against any other scheduled messages]
      "questions": [
        {
          "tag":"any string",
          "text": "text to display",
          "responseFormat": "what kind of question: e.g, list-choose-one | list-choose-multiple | text | time",
          "choices":{
            "choice value to return to the app": "choice text that gets displayed to the user for choosing"
          },
          "preferenceToSet": "OPTIONAL: attribute in the Participant collection that should be set with the answer value"
        },
        {
         ... repeat for more questions to be scheduled in sequence ...
         ... Each subsequent question is given a sequence number of sequenceBase++
        }
      ]
    }
  ]
}
```

## Usage

Upload via https://path.to.parccoach/admin or via the API; e.g.,
```
curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsGoalTypeSelect.json https://path.to.parccoach/serviceapi/scheduledmessages/add/token
```

## History

Created 21 April 2017
