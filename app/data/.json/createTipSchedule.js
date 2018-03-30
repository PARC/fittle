/**
 * Created by lnelson on 5/1/17.
 */

function scheduleGenerator() {

    function formatDayString(day) {
        if (day >= 0 && day < 10) {
            return "0" + day.toString()
        } else {
            return day.toString()
        }
    }

    function formatConstraint(attribute, value) {
        if (attribute) {
            var constraintObj = {
                "attribute": attribute,
                "value": value ? value : ""
            }
            return [constraintObj]
        }
        return []
    }

    const oneTipFormat = {
        "name": "DailyTipsDay",
        "constraints": [],
        "askDate": "1",
        "askTime": "07:00",
        "expireDate": "1",
        "expireTime": "23:59",
        "sequenceBase": 5,
        "questions": [
            {
                "tag": "tip",
                "text": "",
                "responseFormat": "list-choose-one",
                "choices": {
                    "ok": "OK"
                }
            }
        ]
    };

    const tipTextByDay = [
        {
            "day": 0,
            "text": "Welcome to the Reflect and Move Forward habit, which starts tomorrow."
        },
        {
            "day": 1,
            "text": "Welcome to the Reflect and Move Forward habit, a set of personal reflection and supportive team sharing exercises. Tap the icon to get more info."
        },
        {
            "day": 2,
            "text": "How do you acknowledge accomplishments and reward success? Tap the icon to get more info."
        },
        {
            "day": 3,
            "text": "Repeat yesterday’s Group Exercise on how you acknowledge accomplishments and reward success. Tap the icon to get more info."
        },
        {
            "day": 4,
            "text": "Progress can be measured in several meaningful ways. Tap the icon to get more info."
        },
        {
            "day": 5,
            "text": "See today’s examples of successful behavior goals and share some of your own with the team. Tap the icon to get more info."
        },
        {
            "day": 6,
            "text": "Change how you view and measure a habit’s success to one that’s a bit saner and self-compassionate. Tap the icon to get more info."
        },
        {
            "day": 7,
            "text": "Repeat yesterday’s exercise on measuring a habits’ success using exercise as an example and share with the team. Tap the icon to get more info."
        },
        {
            "day": 8,
            "text": "See today’s new examples of subtle behavior changes and share some of your own with the team. Tap the icon to get more info."
        },
        {
            "day": 9,
            "text": "Mastering habits. How does it happen for you and what conditions need to be in place? Tap the icon to get more info."
        },
        {
            "day": 10,
            "text": "Mastering a new habit can give you the space and energy needed to reduce the frequency of undesirable behaviors. Tap the icon to get more info."
        },
        {
            "day": 11,
            "text": "Learn how to spot improvements in your desired behaviors and mindset and then share with the team. Tap the icon to get more info."
        },
        {
            "day": 12,
            "text": "See today’s new information on mastering habits using examples from the Eat Protein Early and Often habit and share with the team. Tap the icon to get more info."
        },
        {
            "day": 13,
            "text": "Share with the team any last minute thoughts or experiences you’ve had while in the program. Tap the icon to get more info."
        },
        {
            "day": 14,
            "text": "The Reflect and Move Forward team sharing habit ends today. Read the wrap-up and learn about the next challenge. Tap the icon to get more info."
        }
    ];

    var schedule = {
        "sequences": []
    };

    // Define one constraining attribute-value pair
    //var constrainingAttribute = "settings.location";
    //var constrainingValue = "maui";
    var constrainingAttribute = "preferences.goalType";
    var constrainingValue = "";

    for (var i = 0; i < tipTextByDay.length; i++) {
        var oneDay = JSON.parse(JSON.stringify(oneTipFormat));
        var tipObj = tipTextByDay[i]
        oneDay.name = oneDay.name + formatDayString(tipObj.day);
        oneDay.questions[0].text = tipTextByDay[i] && tipTextByDay[i].text ? tipTextByDay[i].text : "";
        oneDay.constraints = formatConstraint(constrainingAttribute, constrainingValue);
        oneDay.askDate = tipObj.day.toString();
        oneDay.expireDate = tipObj.day.toString();
        schedule.sequences.push(oneDay);
    }

}

scheduleGenerator()

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
