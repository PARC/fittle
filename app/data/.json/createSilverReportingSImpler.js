/**
 * Created by lnelson on 1/30/18.
 */
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
                        "attribute": "settings.goalReported",
                        "value": dayString
                    },
                    {
                        "attribute": "preferences.challengeStarted",
                        "value": "true"
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
                        "text": "Which exercises(s) did you do? (Select all that apply):",
                        "responseFormat": "list-choose-multiple",
                        "choices": {
                            "upper": "Upper body",
                            "lower": "Lower body",
                            "balance": "Balance",
                            "flexibility": "Flexibility",
                            "cardio": "Cardio"
                        },
                    },
                    {
                        "tag": "goalMetFollowUp",
                        "text": "Were any exercise easy to do? Great! You might try a more challenging version next time. Select all that apply:",
                        "responseFormat": "list-choose-multiple",
                        "choices": {
                            "upper": "Upper body",
                            "lower": "Lower body",
                            "balance": "Balance",
                            "flexibility": "Flexibility",
                            "cardio": "Cardio"
                        },
                    },
                    {
                        "tag": "goalMetFollowUp",
                        "text": "Was any exercise difficult to do? That's OK, try a less challenging version next time. Select all that apply:",
                        "responseFormat": "list-choose-multiple",
                        "choices": {
                            "upper": "Upper body",
                            "lower": "Lower body",
                            "balance": "Balance",
                            "flexibility": "Flexibility",
                            "cardio": "Cardio"
                        },
                    },
                    {
                        "tag": "goalMetFollowUp",
                        "text": "Was there any other reasons you did not do an exercise today? That's OK, you can try next time (Select all that apply):",
                        "responseFormat": "list-choose-multiple",
                        "choices": {
                            "unwell": "I was not feeling well",
                            "traveling": "I was traveling",
                            "sore": "I'm sore from doing yesterday's exercises",
                            "bored": "I was bored doing these exercises",
                            "rest": "I wanted to take a day to rest",
                        },
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

/*************************************************************************
 *
 *  [2018] PARC Inc., A Xerox Company
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
