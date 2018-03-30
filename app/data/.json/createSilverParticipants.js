/**
 * Created by lnelson on 2/01/18.
 * Autogenerate the participant JSON records for Fittle Silver for some number of people
 * To run:
 *   * Install nodejs (https://nodejs.org/en/)
 *   * For Mac/Linux: node createSilverParticipants > participants.json
 *   * For Windows?  I think the same, but it has been 10 years...
 */

function participantGenerator(startId, participantsToGenerate, lang) {

    let participantList = [];

    function oneParticipant(id) {
        if (id < 0) return null;
        let idString = String(id);
        if (id < 10) idString = '0' + idString;
        if (id < 100) idString = '0' + idString;
        let studyId = "study" + idString + "@parc.com"
        let oneParticipant = {
            "emailAddress": studyId,
            "condition": "silver",
            "settings": {
                "name": studyId,
                "studyId": "",
                "language": lang,
                "challengeActivities": "/content/silver/en/activityScheduleSet.json"
            },
            "preferences": {}
        };
        return oneParticipant
    }

    for (let i = 0; i < participantsToGenerate; i++) {
        participantList.push(oneParticipant(i + startId))
    }

    return JSON.stringify(participantList)
}

console.log(participantGenerator(1, 10, "en"))

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
