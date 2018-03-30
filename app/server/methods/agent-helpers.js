/**
 * Created by lnelson on 1/24/17.
 * TODO: The response type returned by the Coach Agent needs further refinement
 */

/** HELPERS FOR USE IN SERVER OPERATION **/
import {Agents} from '/lib/api/agents/agents';
import {Studyevents} from '/lib/api/studyevents/studyevents';
import {Participants} from '/lib/api/participants/participants';
import {HTTP} from 'meteor/http';


/**
 * Export dictionary
 */

export const AgentHelpers = {
    'sendToOne': sendToOne,
    'sendToAll': sendToAll,
    'anonymizeValue': anonymizeValue,
    'anonymizeObject': anonymizeObject
};

export function anonymizeValue(value) {
    if (typeof value == 'string') {
        let val = value.trim();
        let participant = Participants.findOne({emailAddress: val});
        if (participant && participant.studyId && participant.studyId.length > 0) {
            return participant.studyId
        }
    }
    return value

}

export function anonymizeObject(obj) {
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] == "object") {
                anonymizeObject(obj[property]);
            } else {
                obj[property] = anonymizeValue(obj[property]);
            }
        }
    }
    return obj
}

/**
 * Send event data to any active agent subscribed to an event
 * @param event
 * @param eventData
 */
export function sendToAll(eventData) {
    // Validate event and save it in the database
    let _eventId = null;
    try {
        _eventId = Studyevents.insert(eventData);
    } catch (err) {
        console.log('ERROR Method sendToAll: ' + err.message);
        return
    }
    if (_eventId) {
        //let relevantAgents = Agents.find({active: true, events: event});
        let relevantAgents = Agents.find({active: true});
        relevantAgents.forEach(function (agent) {
            let _url = agent.url;
            if (eventData.shared && eventData.shared.indexOf(_url) < 0) {
                let data = anonymizeObject(eventData);
                console.log("INFO Sending event " + eventData.kind + " to " + agent.name + " (active=" +
                    JSON.stringify(agent.active) + "): " + agent.url);

                HTTP.call('POST', _url, {data: data},
                    (error, response) => {
                        if (error) {
                            console.log('ERROR Method sendToAll: invalid response from agent: ' + _url);
                            console.log(error)
                        } else {
                            try {
                                let response_json = JSON.parse(response.content);
                                if (response_json) {
                                    console.log("INFO Sent event to " + agent.name + ": " + _url + ": " + JSON.stringify(response));
                                    Studyevents.update({_id: _eventId}, {$push: {shared: _url}})
                                } else {
                                    console.log("INFO Could not send event to " + agent.name + ": " + _url + ": " + JSON.stringify(response.content));
                                }
                            } catch (err) {
                                console.log('ERROR Method sendToAll: invalid response from agent: ' + response.content + ": " + err.message)
                            }
                        }
                    }
                )
            }
        })
    } else {
        console.log('ERROR Method sendToAll: No insertion of event into the database');

    }
}


/**
 * Send event data to any active agent subscribed to an event
 * @param agentname
 * @param event
 */
export function sendToOne(agentname, event) {
    // Validate event and save it in the database
    let agent = Agents.findOne({name: agentname});
    if (agent) {
        //let relevantAgents = Agents.find({active: true, events: event});
        let _url = agent.url;
        if (event.shared && event.shared.indexOf(_url) < 0) {
            let data = anonymizeObject(event);
            console.log("INFO Sending event " + event.kind + " to " + agent.name + " (active=" +
                JSON.stringify(agent.active) + "): " + agent.url);

            HTTP.call('POST', _url, {data: data},
                (error, response) => {
                    if (error) {
                        console.log('Method sendToOne: ERROR invalid response from agent: ' + _url);
                        console.log(error)
                    } else {
                        try {
                            let response_json = JSON.parse(response.content);
                            if (response_json) {
                                console.log("INFO Sent event to " + agent.name + ": " + _url + ": " + JSON.stringify(response));
                                Studyevents.update({_id: event._id}, {$push: {shared: _url}})
                            } else {
                                console.log("INFO Could not send event to " + agent.name + ": " + _url + ": " + JSON.stringify(response.content));
                            }
                        } catch (err) {
                            console.log('ERROR Method sendToOne: invalid response from agent: ' + response.content + ": " + err.message)
                        }
                    }
                }
            )
        }

    } else {
        console.log('ERROR Method sendToOne: Could not find agent ' + agentname);

    }
}

/*************************************************************************
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

