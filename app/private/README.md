# Fittle Specification Files

This describes document JSON structures used in the I2 studies by Study Administrators to configure a Study

## Repository Structure

|File |Purpose  |
|----|:----|
|`activities.json` |Map activities (a.k.a 'Tasks' to metadata|
|`studyConfigurations.json` |Static values about the Study and Assignments<sup>*</sup>|

<sup>*</sup>Note: Assignments are used to translate answers made by Participants into specific texts to be used in the app.

## Activity

This describes how to use the Activity specifications; e.g., activities.json

### Field meanings

```
[
  {
     "code": "any string [not used by app]",
     "activity": "Unique identifier for an activity; e.g., I2_Walk",
     "tag": "any string [not used by app]",
     "content": "relative URL to the content associated with this activity, e.g., content/I2/I2_Walk.html",
     "title": "Title to be displayed about this activity, e.g., Walk",
     "thumbnail": "relative URL to the thumbnail image associated with this activity, e.g., content/I2/eatslowlythumb.png"
  },
  {
  ... repeat as needed
  }
```

### Usage

This is read automatically as a Meteor asset by the app. It is used when the app creates Task objects.

Any API calls should be use values consistent with meta data in activities.json.

The name of the activities JSON file to be used for a study is set in a Meteor settings file (e.g., settings.json)

## Activity Schedule

This describes how to use the Activity specifications; e.g., activityScheduleDefault.json

### Field meanings

```
{
  "title": "any string",
  "schedule": [
    {
      "description": "Use if the activity description is static and not produced as a result of Question/Answering",
      "activityTitle": "Any 'activity' from an Activity file (a.k.a, activities.json), e.g., I2_Walk",
      "scheduledDay": 0,  [Any integer number; e.g. 0, 1, 28]
      "scheduling": "How the scheduledDay number is to be interpreted, i.e., FromToday | FromRegistered | FromChallengeStart"
    },
    {
    ... repeat as needed
    }
  ]
  }
```

WHERE:

|scheduling |Format  |
|----|:----|
|`FromToday` |The scheduling number means the relative offset of days from today|
|`FromRegistered` |The scheduling number means the relative offset of days from when a Participant registers|
|`FromChallengeStart` |The scheduling number means the relative offset of days from from when a Participant starts a Challenge|
| |NOTE: The only 'scheduling' format currently implemented is FromRegistered|

### Usage

This is read automatically as a Meteor asset by the app. It is used when the app creates Task objects for a newly registered Participant
that has predefined activities. These are set in the onboarding JSON file for participants; e.g.,

```
{
   "emailAddress": "static@parc.com",
   "condition": "I2-10",
   "settings": {
     "name": "Les",
     "gender": "robot",
     "age": "105",
     "location": "Here",
     "selfEfficacy": "high",
     "implementationIntention": "yes",
     "reminders": "yes",
     "reminderDistribution": "masked",
     "reminderCount": "7",
     "goalReported": "empty",
     "challengeActivities": "activityScheduleDefault.json"   <---- Leave "" if no predefined activities
   },
   "preferences" : {
     "goalType": "predefined",                                <---- Leave "" if goals assigned by questioning
     "goalSpecific": "",
     "dailyGoalText": "",
     "difficulty":"",
     "goalContent": "",
     "choice": "",
     "place": "",
     "person": "",
     "eventTime": "",
     "reminderPeriod": "",
     "reminderText": ""
   }
}
```

Currently the there is one default scheduled implemented applicable to all new Participant Registrations, namely activityScheduleDefault.json. This
may be generalized as a Meteor setting (e.g., a definition in settings.json)

## Deployment Notes

* When switching from Silver to Non-Silver deployments, prior to building the system, delete the folder .meteor/local


```
*************************************************************************
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
```