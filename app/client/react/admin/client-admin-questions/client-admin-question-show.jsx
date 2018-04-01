/**
 * Created by lnelson on 3/22/2017.
 */

/*
 * Component to show one post in a list of posts
 */

import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Questions} from '/lib/api/questions/questions';
import moment from 'moment-timezone';

import Modal from 'react-modal';

function localizedDateAndTimeFromUnix(value) {
    if (value) {
        return value.toString();
        //var dateString = moment(value).format("MM/DD/YYYY HH:mm:ss");
        //return dateString;
    }
    return value;
}

class AdminQuestionShow extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    getDisplayName() {
        return this.props.question.username;
    }

    getText() {
        return this.props.question.text;
    }

    getTag() {
        return this.props.question.tag;
    }

    getAskDatetime() {
        return <span>{localizedDateAndTimeFromUnix(this.props.question.askDatetime)}</span>;
    }

    getExpireDatetime() {
        return <span>{localizedDateAndTimeFromUnix(this.props.question.expireDatetime)}</span>;
    }

    getName() {
        return this.props.question.name;
    }

    getTimestamp() {
        let timestamp = <span></span>;
        if (this.props.question.answered) {
            timestamp = <span>{localizedDateAndTimeFromUnix(this.props.question.createdAt)}</span>;
        }
        return timestamp
    }

    getAnswer() {
        let answer = <i>unanswered</i>;
        if (this.props.question.answered) {
            answer = this.props.question.answer;
        }
        return answer
    }

    getSequence() {
        return this.props.question.sequence;
    }


    delete() {
        Meteor.call("removeQuestion" , this.props.question._id)
    }

    render() {
        const elemStyle = {
            align:"left"
        };

        return (

            <tr>
                <td style={elemStyle}>{this.getDisplayName()}</td>
                <td style={elemStyle}>{this.getText()}</td>
                <td style={elemStyle}>{this.getTag()}</td>
                <td style={elemStyle}>{this.getAskDatetime()}</td>
                <td style={elemStyle}>{this.getExpireDatetime()}</td>
                <td style={elemStyle}>{this.getAnswer()}</td>
                <td style={elemStyle}>{this.getTimestamp()}</td>
                <td style={elemStyle}>{this.getName()}</td>
                <td style={elemStyle}>{this.getSequence()}</td>
                <td style={elemStyle}><button onClick={() => {if(confirm('Delete the item?')) {this.delete()};}}>Delete</button></td>
            </tr>
        );
    }
}

AdminQuestionShow.propTypes = {
    question: React.PropTypes.object,
    userId: React.PropTypes.string,
};

export default AdminQuestionShowContainer = createContainer(({question, userId, showForUser}) => {
    return {
        question,
        userId,
    };
}, AdminQuestionShow);
