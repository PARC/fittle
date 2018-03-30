/**
 * Created by lnelson on 3/22/2017.
 */
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import AdminTaskNewContainer from './client-admin-task-new.jsx';
import AdminTasksShowContainer from './client-admin-tasks-show.jsx';

class AdminTasks extends React.Component {
    constructor() {
        super();
        this.state = {
            showForUser: "",
            goalFilter: "reported"
        };
    }

    changeUser(event) {
        let selection = event.target.value ? event.target.value : "";
        this.setState({showForUser: selection})
    }

    changeGoalFilter(event) {
        let selection = event.target.value ? event.target.value : "";
        this.setState({goalFilter: selection})
    }

    getOption(user) {
        return user.username
    }

    render() {

         //

         return (
            <div className="subcontainer admin-page-style">
                <h2>Activity Administration</h2>
                <h3>New Activity</h3>
                <AdminTaskNewContainer users={this.props.users} />
                <hr/>
                <h3>Activities</h3>
                <label htmlFor="username">Who: </label>
                <select
                    onChange={(e) => this.changeUser(e)}
                    id="filter_questions_username">
                    <option value="" >All Users</option>
                    {this.props.users.map((user, index) =>
                        <option key={index}>{this.getOption(user)}</option>
                    )}
                </select>
                <label htmlFor="goalMetReport">Filter goal: </label>
                <select
                    onChange={(e) => this.changeGoalFilter(e)}
                    id="filter_tasks_goal">
                    <option value="reported" >Reported</option>
                    <option value="unreported" >Unreported</option>
                    <option value="" >All</option>
                </select>

                <AdminTasksShowContainer
                    showForUser={this.state.showForUser}
                    goalFilter={this.state.goalFilter}
                />
            </div>
        );
    }
};

AdminTasks.propTypes = {
    users: React.PropTypes.array,
    ulistExists: React.PropTypes.bool
};

export default AdminTasksContainer = createContainer(() => {
    // Get users
    const collectionHandle = Meteor.subscribe('users.admin.access');
    const allUsers = Meteor.users.find({}, {sort: {username: 1}})
    const ucount = allUsers.count();
    console.log("Subscribed, loading " + ucount + " users");
    const ulistExists = !!allUsers;

    return {
        users: ulistExists ? allUsers.fetch() : [],
        ulistExists,
    };
}, AdminTasks);

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
 