/**
 * Created by lnelson on 1/25/18.
 * Autogenerate the reporting questions for Fittle Silver for some number of days
 */

function scheduleGenerator(startDay, daysToGenerate) {

    let schedule = {
        "sequences": []
    };

    function oneDayContribution(day) {
        let dayString = String(day);
        let oneDaySequence = [
            {
                "name": "activityDebrief",
                "constraints": [
                    {
                        "attribute": "settings.goalReported",
                        "value": dayString
                    }
                ],
                "askDate": dayString,
                "askTime": "00:00",
                "expireDate": dayString,
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
                    },
                    {
                        "tag": "confidence",
                        "text": "How confident are you that you can meet this goal for the next 3 days?",
                        "responseFormat": "list-choose-one",
                        "choices": {
                            "1": "Not at all confident",
                            "2": "Slightly confident",
                            "3": "Somewhat confident",
                            "4": "Moderately confident",
                            "5": "Extremely confident"
                        }
                    },
                    {
                        "tag": "inclination",
                        "text": "How inclined are you to do this every day?",
                        "responseFormat": "list-choose-one",
                        "choices": {
                            "1": "Not at all keen",
                            "2": "Slightly keen",
                            "3": "Somewhat keen",
                            "4": "Moderately keen",
                            "5": "Extremely keen"
                        }
                    },
                    {
                        "tag": "worth",
                        "text": "Was doing this worth the effort?",
                        "responseFormat": "list-choose-one",
                        "choices": {
                            "1": "Much more effort than benefit",
                            "2": "Some more effort than benefit",
                            "3": "Almost the same effort as benefit",
                            "4": "Some more benefit than effort",
                            "5": "Much more benefit than effort"
                        }
                    }
                ]
            }
        ];
        return oneDaySequence
    }


    for (let i = startDay; i < daysToGenerate; i++) {
        let oneDay = oneDayContribution(i);
        for (let j = 0; j < oneDay.length; j++) {
            let oneDayItem = oneDay[j];
            schedule.sequences.push(oneDayItem);
        }
    }

    return JSON.stringify(schedule)
}

console.log(scheduleGenerator(29, 100))


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
