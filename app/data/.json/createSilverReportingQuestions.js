/**
 * Created by lnelson on 1/25/18.
 * Autogenerate the reporting questions for Fittle Silver for some number of days
 */

function scheduleGenerator(daysToGenerate) {

    let schedule = {
        "sequences": []
    };

    function oneDayContribution(day) {
        let dayString = String(day);
        let oneDaySequence = [
            {
                "name": "activityDebriefSilverMet",
                "constraints": [
                    {
                        "attribute": "settings.goalReportedMet",
                        "value": dayString
                    }
                ],
                "askDate": dayString,
                "askTime": "00:00",
                "expireDate": dayString,
                "expireTime": "23:59",
                "sequenceBase": 300,
                "linkToActivity": true,
                "questions": [
                    {
                        "tag": "goalmet",
                        "text": "Were the exercises easy for you to do?",
                        "responseFormat": "list-choose-one",
                        "choices": {
                            "yes": "Yes",
                            "no": "No"
                        },
                        "preferenceToSet": "goalMetEasy"
                    }
                ]
            },
            {
                "name": "activityDebriefSilverMetEasy",
                "constraints": [
                    {
                        "attribute": "settings.goalReportedMet",
                        "value": dayString
                    },
                    {
                        "attribute": "preferences.goalMetEasy",
                        "value": "yes"
                    }
                ],
                "askDate": dayString,
                "askTime": "00:00",
                "expireDate": dayString,
                "expireTime": "23:59",
                "sequenceBase": 300,
                "linkToActivity": true,
                "questions": [
                    {
                        "tag": "goalMetFollowUp",
                        "text": "Which one(s) were easy to do? (Select all that apply):",
                        "afterword": "Great! You can always try a more challenging version of an exercise.",
                        "responseFormat": "list-choose-multiple",
                        "choices": {
                            "upper": "Upper body",
                            "lower": "Lower body",
                            "balance": "Balance",
                            "flexibility": "Flexibility",
                            "cardio": "Cardio"
                        },
                        "preferenceToSet": "goalMetEasy"
                    }
                ]
            },
            {
                "name": "activityDebriefSilverMetNotEasy",
                "constraints": [
                    {
                        "attribute": "settings.goalReportedMet",
                        "value": dayString
                    },
                    {
                        "attribute": "preferences.goalMetEasy",
                        "value": "no"
                    }
                ],
                "askDate": dayString,
                "askTime": "00:00",
                "expireDate": dayString,
                "expireTime": "23:59",
                "sequenceBase": 300,
                "linkToActivity": true,
                "questions": [
                    {
                        "tag": "goalMetFollowUp",
                        "text": "Which one(s) were too challenging for you to do? (Select all that apply):",
                        "afterword": "OK, You may want to try less challenging versions of these exercises.",
                        "responseFormat": "list-choose-multiple",
                        "choices": {
                            "upper": "Upper body",
                            "lower": "Lower body",
                            "balance": "Balance",
                            "flexibility": "Flexibility",
                            "cardio": "Cardio"
                        },
                        "preferenceToSet": "goalMetEasy"
                    }
                ]
            },
            {
                "name": "activityDebriefUnmet",
                "constraints": [
                    {
                        "attribute": "settings.goalReportedUnmet",
                        "value": dayString
                    }
                ],
                "askDate": dayString,
                "askTime": "00:00",
                "expireDate": dayString,
                "expireTime": "23:59",
                "sequenceBase": 300,
                "linkToActivity": true,
                "questions": [
                    {
                        "tag": "goalMetFollowUp",
                        "text": "Did you do some of the exercises?",
                        "responseFormat": "list-choose-one",
                        "choices": {
                            "yes": "Yes",
                            "no": "No"
                        },
                        "preferenceToSet": "goalMetSome"
                    }
                ]
            },
            {
                "name": "activityDebriefSilverMetNone",
                "constraints": [
                    {
                        "attribute": "settings.goalReportedUnmet",
                        "value": dayString
                    },
                    {
                        "attribute": "preferences.goalMetSome",
                        "value": "no"
                    }
                ],
                "askDate": dayString,
                "askTime": "00:00",
                "expireDate": dayString,
                "expireTime": "23:59",
                "sequenceBase": 300,
                "linkToActivity": true,
                "questions": [
                    {
                        "tag": "goalMetFollowUp",
                        "text": "What are the reasons you did not do any exercise today? (Select all that apply):",
                        "afterword": "OK, Try to do one or more of the exercises next time.",
                        "responseFormat": "list-choose-multiple",
                        "choices": {
                            "unwell": "I was not feeling well",
                            "traveling": "I was traveling",
                            "sore": "I'm sore from doing yesterday's exercises",
                            "bored": "I was bored doing these exercises",
                            "rest": "I wanted to take a day to rest",
                        },
                        "preferenceToSet": "goalMetSome"
                    }
                ]
            },
            {
                "name": "activityDebriefSilverMetSome",
                "constraints": [
                    {
                        "attribute": "settings.goalReportedUnmet",
                        "value": dayString
                    },
                    {
                        "attribute": "preferences.goalMetSome",
                        "value": "yes"
                    }
                ],
                "askDate": dayString,
                "askTime": "00:00",
                "expireDate": dayString,
                "expireTime": "23:59",
                "sequenceBase": 300,
                "linkToActivity": true,
                "questions": [
                    {
                        "tag": "goalMetFollowUp",
                        "text": "Which one(s) did you do? (Select all that apply):",
                        "afterword": "As a challenge consider completing more of your scheduled exercises next time.",
                        "responseFormat": "list-choose-multiple",
                        "choices": {
                            "upper": "Upper body",
                            "lower": "Lower body",
                            "balance": "Balance",
                            "flexibility": "Flexibility",
                            "cardio": "Cardio"
                        },
                        "preferenceToSet": "goalMetSome"
                    }
                ]
            }
        ];
        return oneDaySequence
    }


    for (let i = 0; i < daysToGenerate; i++) {
        let oneDay = oneDayContribution(i);
        for (let j = 0; j < oneDay.length; j++) {
            let oneDayItem = oneDay[j];
            schedule.sequences.push(oneDayItem);
        }
    }

    return JSON.stringify(schedule)
}

console.log(scheduleGenerator(29))