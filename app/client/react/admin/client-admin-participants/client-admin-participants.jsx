/**
 * Created by lnelson on 3/22/2017.
 */

import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import AdminParticipantsSummaryContainer from './client-admin-participants-summary.jsx';
import AdminParticipantsShowContainer from './client-admin-participants-show.jsx';
import {Participants} from '/lib/api/participants/participants';
import {Tasks} from '/lib/api/tasks/tasks';

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

class AdminParticipants extends React.Component {
    constructor() {
        super();
        this.state = {
            showForUser: "",
            conditionFilter: ""
        };
    }

    changeUser(event) {
        let selection = event.target.value ? event.target.value : "";
        this.setState({showForUser: selection})
    }

    changeFilter(event) {
        let selection = event.target.value ? event.target.value : "";
        this.setState({conditionFilter: selection})
    }

    getOption(user) {
        return user.username
    }

    getParticipant(emailAddress) {
        for (let ix in this.props.conditions) {
            let participant = this.props.conditions[ix];
            if (participant.emailAddress == emailAddress) return participant
        }
        return null
    }

    getTask(emailAddress, challengeDay) {
        for (let tix in this.props.tasks) {
            let task = this.props.tasks[tix];
            if (task.emailAddress == emailAddress && task.scheduledDate == challengeDay) return task
        }
        return null
    }

    getThumbnail(thumbnailLink) {
        if (thumbnailLink) {
            return (
                <div className="admin-activity-image-box">
                    <img src={thumbnailLink} />
                </div>
            );
        }
        return '';
    }

    getContentPreview() {
        if (this.state.showForUser) {
            let participant = this.getParticipant(this.state.showForUser);
            if (participant) {
                let challengeDay = Participants.getChallengeDay(participant);
                let task = this.getTask(participant.emailAddress, challengeDay);
                if (task && task.contentLink) {
                    let url = task.contentLink;
                    let title = task.title;
                    let description = task.description;
                    let thumbnailLink = task.thumbnailLink;
                    return (
                        <div className="admin-page-style">
                            <table><tbody><tr>
                                <td>{this.getThumbnail(thumbnailLink)}</td>
                                <td>{title}</td>
                                <td>{description}</td>
                                <td>{url}</td>
                            </tr></tbody></table>
                        </div>
                    )
                }
            }
        }
        return <span></span>
    }

    getConditions() {
        let cFind = this.props.conditions;
        let c;
        let cset = [];
        for (var ix = 0; ix < cFind.length; ix++) {
            c = cFind[ix];
            if (c && c.hasOwnProperty('condition') && c.condition) {
                let condition = safeTrim(c.condition);
                if (isNotIn(condition, cset)) {
                    if (condition)
                        cset.push(condition)
                }
            }
        }
        cset.sort();
        return cset
    }


    render() {

        //

        return (
            <div className="subcontainer admin-page-style">
                <h2>Participant Administration</h2>
                <h3>Participant Summary</h3>
                <AdminParticipantsSummaryContainer  />
                <hr/>
                <h3>Participants</h3>
                <label htmlFor="username">Who: </label>
                <select
                    onChange={(e) => this.changeUser(e)}
                    id="filter_questions_username">
                    <option value="">All Users</option>
                    {this.props.users.map((user, index) =>
                        <option key={index}>{this.getOption(user)}</option>
                    )}
                </select>
                <label htmlFor="conditionFilter">Filter by Study Condition: </label>
                <select
                    onChange={(e) => this.changeFilter(e)}
                    id="conditionFilter">
                    <option value="">All</option>
                    {this.getConditions().map((condition, index) =>
                        <option key={index}>{condition}</option>
                    )}
                </select>
                { this.getContentPreview()}
                <AdminParticipantsShowContainer
                    users={this.props.users}
                    showForUser={this.state.showForUser}
                    conditionFilter={this.state.conditionFilter}
                />

            </div>
        );
    }
}


AdminParticipants.propTypes = {
    users: React.PropTypes.array,
    ulistExists: React.PropTypes.bool,
    conditions: React.PropTypes.array,
    plistExists: React.PropTypes.bool,
    tasks: React.PropTypes.array,
    tlistExists: React.PropTypes.bool,
};

export default AdminParticipantsContainer = createContainer(() => {
    // Get users
    const collectionHandle = Meteor.subscribe('users.admin.access');
    const tasksHandle = Meteor.subscribe('tasks');
    const usersHandle = Meteor.subscribe('users');

    const allUsers = Meteor.users.find({}, {sort: {username: 1}})
    const ucount = allUsers.count();
    console.log("Subscribed, loading " + ucount + " users");

    const ulistExists = !!allUsers;
    const allConditions = Participants.find({});
    const plistExists = !!allConditions;
    const allTasks = Tasks.find({});
    const tlistExists = !!allTasks;

    return {
        users: ulistExists ? allUsers.fetch() : [],
        ulistExists,
        conditions: plistExists ? allConditions.fetch() : [],
        plistExists,
        tasks: tlistExists ? allTasks.fetch() : [],
        tlistExists
    };
}, AdminParticipants);


/*    */