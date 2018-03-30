/**
 * Created by lnelson on 3/22/2017.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Questions} from '/lib/api/questions/questions';

/**
 * My utility function
 * @param needle
 * @param haystack
 * @returns {boolean}
 */
function isNotIn(needle, haystack) {
    for (var ix = 0; ix < haystack.length; ix++) {
        if (needle === haystack[ix])
            return false;
    }
    return true;
}

function safeTrim(str) {
    try {
        return str.trim()
    } catch (err) {
        console.log('Error in trimming string ' + str + ' ' + err.message);
        return str
    }
}


class AdminQuestionNew extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    //Access Methods for Collection attributes

    getOption(user) {
        return user.username
    }

    getQuestionTexts() {
        let qFind = this.props.questions;
        let q;
        let qset = [];
        for (var ix = 0; ix < qFind.length; ix++) {
            q = qFind[ix];
            if (q && q.hasOwnProperty('text') && isNotIn(q.text, qset)) {
                let qToPush = safeTrim(q.text);
                if (qToPush)
                    qset.push(q.text)
            }
        }
        qset.sort();
        return qset
    }

    getChoiceTexts() {
        let qFind = this.props.questions;
        let q;
        let qset = [];
        for (var ix = 0; ix < qFind.length; ix++) {
            q = qFind[ix];
            if (q && q.hasOwnProperty('choices') && q.choices) {
                let response = q.choices.join(',');
                if (isNotIn(response, qset)) {
                    let responseToPush = safeTrim(response);
                    if (responseToPush)
                        qset.push(response)
                }
            }
        }
        qset.sort();
        return qset
    }

    getQuestionTags() {
        let qFind = this.props.questions;
        let q;
        let qset = [];
        for (var ix = 0; ix < qFind.length; ix++) {
            q = qFind[ix];
            if (q && q.hasOwnProperty('tag') && q.tag) {
                let qtag = safeTrim(q.tag);
                if (isNotIn(qtag, qset)) {
                    if (qtag)
                        qset.push(qtag)
                }
            }
        }
        qset.sort();
        return qset
    }

    // Event processing
    submission(event) {
        function parse(dateString) {
            try {
                if (typeof dateString == 'string') {
                    let parsed = dateString.split('/');
                    let month = parseInt(parsed[0])-1;
                    let day = parseInt(parsed[1]);
                    let year = parseInt(parsed[2]);
                    return new Date(year,month,day);
                }
            } catch (err) {
                console.log("ERROR: Bad date input in AdminQuestionNew: " + err.message)
            }
            return null
        }
        event.preventDefault();
        // Get value from form element
        let text = event.target.text.value;
        let pretext = event.target.pretext.value;
        let questionText = text ? text : pretext;
        let username = event.target.username.value;
        let responseFormat = event.target.responseFormat.value;
        let choices_string = event.target.choices.value;
        let prechoices_string = event.target.prechoices.value;
        let questionChoices = choices_string ? choices_string : prechoices_string;
        let choices = questionChoices.split(',');
        let tag = event.target.tag.value;
        let pretag = event.target.pretag.value;
        let questionTag = tag ? tag : pretag;
        let askDate = event.target.askDate.value;
        let askTime = event.target.askTime.value;
        if (askTime.length === 4) askTime = '0' + askTime;
        let expireDate = event.target.expireDate.value;
        let expireTime = event.target.expireTime.value;
        let sequence = event.target.sequence.value;
        let notify = event.target.notify.value;
        let none = event.target.noneAllowed ? event.target.noneAllowed.value : false;

        let askDateObject = parse(askDate);
        let expireDateObject = parse(expireDate);
        if (askDateObject && expireDateObject) {
            // Insert a question into the collection
            Meteor.call("addQuestion",
                questionText,
                responseFormat,
                choices,
                username,
                questionTag,
                askDateObject,
                askTime,
                expireDateObject,
                expireTime,
                sequence,
                notify,
                none
            )
        }

        // Clear form
        event.target.text.value = "";
        //event.target.choices.value = "";
    }


    render() {
        return (
            <div className="subcontainer">
                <form className="new-question"
                      onSubmit={(e) => this.submission(e)}>
                    <label htmlFor="newqtext">What to ask: </label>
                    <input id="newqtext" name="text" type="text" placeholder="goes here" defaultValue="" />
                    <select name="pretext" id="pretext">
                        <option value=""></option>
                        {this.getQuestionTexts().map((txt, index) =>
                            <option key={index}>{txt}</option>
                        )}
                    </select>
                    <br/>
                    <label htmlFor="newqkind">What kind: </label>
                    <select name="responseFormat" id="newqkind">
                        <option value="text">Enter a text value</option>
                        <option value="list-choose-one">Choose one from a list</option>
                        <option value="list-choose-multiple">Choose any from a list</option>
                    </select>
                    <br/>
                    <label htmlFor="newqtag">Tag: </label>
                    <input id="newqtag" name="tag" type="text" placeholder="tag value goes here" defaultValue="" />
                    <select name="pretag" id="pretag">
                        <option value="" ></option>
                        {this.getQuestionTags().map((txt, index) =>
                            <option key={index}>{txt}</option>
                        )}
                    </select>
                    <br/>
                    <label htmlFor="newqchoices">What to answer: </label>
                    <input id="newqchoices" name="choices" type="text" placeholder="choice1, choice2, ..." defaultValue="" />
                    <select name="prechoices" id="prechoices">
                        <option value="" ></option>
                        {this.getChoiceTexts().map((txt, index) =>
                            <option key={index}>{txt}</option>
                        )}
                     </select>
                    <br/>
                    <label htmlFor="username">For Who: </label>
                    <select name="username">
                        <option value="" >Select a user</option>
                        {this.props.users.map((user, index) =>
                            <option key={index}>{this.getOption(user)}</option>
                        )}
                    </select>
                    <br/>
                    <label htmlFor="askDate">Ask Date (UTC): </label>
                    <input id="askDate" name="askDate" type="date" placeholder="Enter a date mm/dd/yyyy"/>
                    <label htmlFor="askTime">Ask Time (UTC): </label>
                    <input id="askTime" name="askTime" type="time" placeholder="Enter a time hh:mm" defaultValue="12:00"/>

                    <br/>
                    <label htmlFor="expireDate">Expire Date (UTC): </label>
                    <input id="expireDate" name="expireDate" type="date" placeholder="Enter a date mm/dd/yyyy"/>
                    <label htmlFor="expireTime">Expire Time (UTC): </label>
                    <input id="expireTime" name="expireTime" type="time" placeholder="Enter a time hh:mm"
                           defaultValue="12:00"/>

                    <br/>
                    <label htmlFor="sequence">Question Sequence: </label>
                    <input id="sequence" name="sequence" type="text" defaultValue="1"/>

                    <br/>
                    <label htmlFor="notify">Send Notification: </label>
                    <select name="notify" id="notify">
                        <option value="false">false</option>
                        <option value="true">true</option>
                    </select>

                    <br/>
                    <input type="submit" value="Ask Question"/>
                </form>
            </div>
        );
    }
}

AdminQuestionNew.propTypes = {
    questions: React.PropTypes.array,
    loading: React.PropTypes.bool,
    listExists: React.PropTypes.bool
};

export default AdminQuestionNewContainer = createContainer(({users}) => {
    // Get Questions
    const questionsHandle = Meteor.subscribe('questions');
    const loading = !questionsHandle.ready();
    //const props = users;
    //alert(props);
    let myQuestions = Questions.find({}, {sort: {createdAt: -1}});
    const count = myQuestions.count();
    console.log("Subscribed, loading " + count + " questions: " + loading.toString());
    const listExists = !loading && !!myQuestions;

    return {
        loading,
        questions: listExists ? myQuestions.fetch() : [],
        listExists,
    };
}, AdminQuestionNew);


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
 