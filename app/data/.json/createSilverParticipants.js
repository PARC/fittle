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