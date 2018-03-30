/**
 * Created by lnelson on 3/22/2017.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Participants} from '../../../../lib/api/participants/participants';
import Datetime from 'react-datetime';
import {dynamicSort} from '../../../../lib/helpers';


//import ReactDom from "react-dom";

//import AdminTaskNewContainer from './client-admin-task-new.jsx';
//import AdminTasksShowContainer from './client-admin-tasks-show.jsx';

class AdminTeams extends React.Component {
    static NO_TEAM = "No team";
    static NOT_STARTED = "Not started";

    constructor() {
        super();
        this.state = {
            selectedTeam: "",
            selectedDate: []
        };
    }

    selectTeamForUser(event) {
        let selection = event.target.value ? event.target.value : "";
        let userTeam = "";
        for (let ix = 0; ix < this.props.users.length; ix++) {
            let thisUser = this.props.users[ix];
            if (thisUser.username == selection && thisUser.profile && thisUser.profile.team) {
                this.setState({selectedTeam: thisUser.profile.team});
                //ReactDom.findDOMNode(this.refs.filter_team_name).value = '';
                return
            }
        }
        this.setState({selectedTeam: ""})
    }

    changeTeam(event) {
        let selection = event.target.value ? event.target.value : "";
        this.setState({selectedTeam: selection});
        //ReactDom.findDOMNode(this.refs.filter_team_username).value = '';
    }

    dateChange(aMoment, index) {
        let month = aMoment.format('MM');
        let day = aMoment.format('DD');
        let year = aMoment.format('YYYY');
        let mutateThis = this.state.selectedDate.slice(); //creates the clone of the state
        mutateThis[index] = month + '-' + day + '-' + year;
        this.setState({selectedDate: mutateThis})
    }

    startChallenge(team, event, index) {
        if (this.state.selectedDate && this.state.selectedDate[index]) {
            let dateString = this.state.selectedDate[index];
            let answer = confirm("Start challenge for team " + team + " on " + this.state.selectedDate[index] + " at " + dateString + "?")
            if (answer) {
                Meteor.call('setChallengeStart', team, dateString);
            }
        } else {
            alert("Please select a new date before starting a challenge for team " + team);
        }
    }

    getOption(user) {
        return user.username
    }

    showTeams() {
        function chooseStartDate(parent, index) {

            return (
                <div className="admin-datepick-div">
                    <Datetime
                        dateFormat={true}
                        timeFormat={false}
                        ref={(node) => this._selection = node}
                        onChange={(e) => parent.dateChange(e, index)}/>
                </div>
            );
        }

        let teamReport = [];
        for (let ix = 0; ix < this.props.teams.length; ix++) {
            let team = this.props.teams[ix];
            let members = this.props.teamMembers[team];
            if (members) {
                teamReport[team] = {
                    count: members.length,
                    started: AdminTeams.NOT_STARTED
                };
                for (let jx = 0; jx < members.length; jx++) {
                    let participant = members[jx];
                    if (participant && participant.settings && participant.settings.challenge && participant.settings.challenge !== "")
                        teamReport[team].started = participant.settings.challenge
                }
            }
        }

        function startButton(parent, team, started, index) {
            const startLabel = started ? "RESTART" : "START";
            return (
                <div className="admin-datepick-div">
                    <button
                        onClick={
                            (e) => {
                                parent.startChallenge(team, e, index);
                            }
                        }>{startLabel}</button>
                </div>
            )
        }

        return (
            <div>
                <table className="admin-table">
                    <tbody>
                    <tr>
                        <th>Team</th>
                        <th>Members</th>
                        <th>Started</th>
                        <th>Action</th>
                    </tr>
                    {this.props.teams.map((team, index) =>
                        <tr key={index}>
                            <td>{team}</td>
                            <td>{teamReport[team].count}</td>
                            <td>{teamReport[team].started}</td>
                            <td className="admin-hide-overflow">
                                {chooseStartDate(this, index)}
                                {startButton(this, team, teamReport[team].started && teamReport[team].started !== AdminTeams.NOT_STARTED, index)}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        )
    }

    showTeamSelection() {
        if (this.state.selectedTeam == "") {
            return <p>Participants without a Team</p>
        } else {
            return <p>Team {this.state.selectedTeam}</p>
        }
    }

    assignTeam(username, event,) {
        let selection = event.target.value ? event.target.value : "";
        console.log("INFO Assign " + username + " to team " + selection);
        Meteor.call('addUserToTeam', username, selection);
    }


    assignTeamFromText(username, event) {
        event.preventDefault();
        let selection = event.target.teamname.value ? event.target.teamname.value : "";
        console.log("INFO Assign " + username + " to team " + selection);
        Meteor.call('addUserToTeam', username, selection);
    }

    showActivities(participant) {
        let user = this.props.userToParticipantMap[participant._id];
        if (!user) return "Not registered yet";
        let challengeActivitiesPath =
            participant.settings && participant.settings.challengeActivities ?
                participant.settings.challengeActivities : "";
        let pieces = challengeActivitiesPath.split("/");
        return pieces.length > 0 ? pieces[pieces.length - 1] : "No preassigned activities";
    }

    showSelectedTeam() {
        let members = [];
        if (this.state.selectedTeam && this.state.selectedTeam.length) {
            members = this.props.teamMembers[this.state.selectedTeam] ? this.props.teamMembers[this.state.selectedTeam] : [];
            /*
             for (let ix = 0; ix < this.props.users.length; ix++) {
             let thisUser = this.props.users[ix];
             if (thisUser.profile && thisUser.profile.team && thisUser.profile.team == this.state.selectedTeam) {
             members.push(thisUser)
             }
             }
             members.sort();
             */
        } else {
            for (let ix = 0; ix < this.props.participants.length; ix++) {
                let thisParticipant = this.props.participants[ix];
                if (!thisParticipant.settings || !thisParticipant.settings.team) {
                    members.push(thisParticipant)
                }
            }
            members.sort(dynamicSort("emailAddress"));

        }
        if (members.length > 0) {
            return (
                <div>
                    {this.showTeamSelection()}
                    <table className="admin-table">
                        <tbody>
                        <tr>
                            <th>Participant</th>
                            <th>Activities</th>
                            <th>Action</th>
                        </tr>
                        {members.map((member, index) =>
                            <tr key={index}>
                                <td>{member.emailAddress}</td>
                                <td>{this.showActivities(member)}</td>
                                <td>
                                    <select
                                        onChange={(e) => this.assignTeam(member.emailAddress, e)}
                                        id="selected_team">
                                        <option value="">Select Team</option>
                                        <option value={AdminTeams.NO_TEAM}>{AdminTeams.NO_TEAM}</option>
                                        {this.props.teams.map((team, iindex) =>
                                            <option value={team} key={iindex * 10 + index}>{team}</option>
                                        )}
                                    </select>
                                    <form onSubmit={(e) => this.assignTeamFromText(member.emailAddress, e)}>
                                        <label className="admin-label">
                                            New Name:
                                            <input name="teamname" className="admin-input" type="text"/>
                                        </label>
                                        <input type="submit" value="Submit"/>
                                    </form>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )
        }
        return <div></div>
    }

    render() {

        return (
            <div className="subcontainer admin-page-style">
                <h2>Team Administration</h2>
                <h2>Teams</h2>
                {this.showTeams()}
                <hr/>
                <h2>Team Members</h2>
                <label className="admin-label" htmlFor="teamname">Team by name: </label>
                <select
                    onChange={(e) => this.changeTeam(e)}
                    id="filter_team_name">
                    <option value="">Choose a team</option>
                    {this.props.teams.map((team, index) =>
                        <option key={index}>{team}</option>
                    )}
                </select>
                <label className="admin-label" htmlFor="userteam">Team with Participant: </label>
                <select
                    onChange={(e) => this.selectTeamForUser(e)}
                    id="filter_team_username">
                    <option value="">Choose a user</option>
                    {this.props.users.map((user, index) =>
                        <option value={this.getOption(user)} key={index}>{this.getOption(user)}</option>
                    )}
                </select>

                {this.showSelectedTeam()}

            </div>
        )
    }
}

AdminTeams.propTypes = {
    users: React.PropTypes.array,
    ulistExists: React.PropTypes.bool,
    participants: React.PropTypes.array,
    plistExists: React.PropTypes.bool,
    teams: React.PropTypes.array,
    userToParticipantMap: React.PropTypes.array,
    teamMembers: React.PropTypes.object
};

export default AdminTeamsContainer = createContainer(() => {
    // Get users
    const collectionHandle = Meteor.subscribe('users.admin.access');
    const allUsers = Meteor.users.find({}, {sort: {username: 1}}).fetch();
    const ucount = allUsers.length;
    console.log("Subscribed, loading " + ucount + " users");
    const ulistExists = !!allUsers;
    let teams = [];
    let teamMembers = {};
    const participantsHandle = Meteor.subscribe('participants');
    const allParticipants = Participants.find().fetch();
    const plistExists = !!allParticipants;
    if (plistExists) {
        for (let ix = 0; ix < allParticipants.length; ix++) {
            if (allParticipants[ix].settings && allParticipants[ix].settings.team) {
                let thisTeam = allParticipants[ix].settings.team;
                if (teams.indexOf(thisTeam) < 0) {
                    teams.push(thisTeam)
                }
            }
        }
        for (let itx = 0; itx < teams.length; itx++) {
            let team = teams[itx];
            for (let ix = 0; ix < allParticipants.length; ix++) {
                let thisParticipant = allParticipants[ix];
                if (thisParticipant.settings && thisParticipant.settings.team && thisParticipant.settings.team == team) {
                    if (typeof teamMembers[thisParticipant.settings.team] == 'undefined') {
                        teamMembers[thisParticipant.settings.team] = [];
                    }
                    teamMembers[thisParticipant.settings.team].push(thisParticipant);
                }
            }
        }
        for (let imx = 0; imx < teamMembers.length; imx++) {
            teamMembers[imx].sort(dynamicSort("emailAddress"))
        }
    }
    teams.sort();

    let userToParticipantMap = [];
    if (plistExists && ulistExists) {
        for (let ix = 0; ix < allParticipants.length; ix++) {
            let participant = allParticipants[ix];
            for (let jx = 0; jx < allUsers.length; jx++) {
                let user = allUsers[jx];
                if (user.username == participant.emailAddress)
                    userToParticipantMap[participant._id] = user
            }
        }
    }

    return {
        users: ulistExists ? allUsers : [],
        ulistExists,
        participants: plistExists ? allParticipants : [],
        plistExists,
        teams,
        userToParticipantMap,
        teamMembers
    };
}, AdminTeams);

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
