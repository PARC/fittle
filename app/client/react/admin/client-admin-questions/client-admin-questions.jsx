/**
 * Created by lnelson on 3/22/2017.
 */
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import AdminQuestionNewContainer from './client-admin-question-new.jsx';
import AdminQuestionsShowContainer from './client-admin-questions-show.jsx';

class AdminQuestions extends React.Component {
    constructor() {
        super();
        this.state = { showForUser: ""};
    }


    change(event) {
        let selection = event.target.value ? event.target.value : "";
        this.setState({showForUser: selection})
    }

    getOption(user) {
        return user.username
    }

    render() {

         return (
            <div className="subcontainer admin-page-style">
                <h2>Question Administration</h2>
                <h3>New Question</h3>
                <AdminQuestionNewContainer users={this.props.users} />
                <hr/>
                <h3>Questions</h3>
                <label htmlFor="username">Who: </label>
                <select
                    onChange={(e) => this.change(e)}
                    id="filter_questions_username">
                    <option value="" >All Users</option>
                    {this.props.users.map((user, index) =>
                        <option key={index}>{this.getOption(user)}</option>
                    )}
                </select>

                <AdminQuestionsShowContainer showForUser={this.state.showForUser} />
            </div>
        );
    }
};

AdminQuestions.propTypes = {
    users: React.PropTypes.array,
    ulistExists: React.PropTypes.bool
};

export default AdminQuestionsContainer = createContainer(() => {
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
}, AdminQuestions);

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
