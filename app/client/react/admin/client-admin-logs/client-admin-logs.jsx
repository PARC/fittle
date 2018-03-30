/**
 * Created by lnelson on 3/22/2017.
 */

import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import AdminLogsShowContainer from './client-admin-logs-show.jsx';
import {Participants} from '/lib/api/participants/participants';

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

class AdminLogs extends React.Component {
    constructor() {
        super();
        this.state = {
            showForUser: "",
            conditionFilter: ""
        };
    }

    changeUser(event) {
        let selection = event.target.value ? event.target.value : "";
        let userRec = _.find(this.props.users,function(o) {return o.username === selection});
        let userId = userRec ? userRec._id : undefined;
        let showFor = userId;
        this.setState({showForUser: showFor})
    }

    changeFilter(event) {
        let selection = event.target.value ? event.target.value : "";
        this.setState({conditionFilter: selection})
    }

    getOption(user) {
        return user.username
    }

    render() {

        return (
            <div className="subcontainer admin-page-style">
                <h2>Logs</h2>
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

                <AdminLogsShowContainer
                    showForUser={this.state.showForUser}
                />

            </div>
        );
    }
}


AdminLogs.propTypes = {
    users: React.PropTypes.array,
    ulistExists: React.PropTypes.bool,
    conditions: React.PropTypes.array,
    plistExists: React.PropTypes.bool,
};

export default AdminLogsContainer = createContainer(() => {
    // Get users
    const collectionHandle = Meteor.subscribe('users.admin.access');

    const allUsers = Meteor.users.find({}, {sort: {username: 1}})
    const ucount = allUsers.count();
    console.log("Subscribed, loading " + ucount + " users");
    const ulistExists = !!allUsers;
    const allConditions = Participants.find({});
    const plistExists = !!allConditions;

    return {
        users: ulistExists ? allUsers.fetch() : [],
        ulistExists,
        conditions: plistExists ? allConditions.fetch() : [],
        plistExists
    };
}, AdminLogs);


/*    */

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
