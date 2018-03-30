/**
 * Created by lnelson on 3/22/2017.
 *
 */


import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import AdminParticipantShow from './client-admin-participant-show.jsx';
import {Participants} from '/lib/api/participants/participants';


class AdminParticipantsShow extends React.Component {
    constructor() {
        super();
        this.state = { };
    }

    render() {
        return (

            <div className="subcontainer">
                <table className="admin-table">
                    <tbody>

                    <tr>
                        <th>Email</th>
                        <th>Condition</th>
                        <th>Self-efficacy</th>
                        <th>Reminders</th>
                        <th>Reminder Distribution</th>
                        <th>Reminder Count</th>
                        <th>Day in Study</th>
                        <th>Registered</th>
                        <th>Language</th>
                        <th>Nav Limits</th>
                    </tr>

                    {this.props.items.map((item, index) =>
                    <AdminParticipantShow key={index} item={item} users={this.props.users} />
                    )}

                    </tbody>
                </table>
            </div>
        );
    }
}

AdminParticipantsShow.propTypes = {
    questions: React.PropTypes.array,
    loading: React.PropTypes.bool,
    listExists: React.PropTypes.bool
};

function getParticipantsQuery (props) {
    let query = {};
    if (props.showForUser) {
        query['emailAddress'] = props.showForUser;
    }
    let queryFilter = null;
    if (props.conditionFilter) {
        queryFilter = props.conditionFilter
    }
    if (queryFilter) {
        query['condition'] = queryFilter
    }
    return query
}

export default AdminParticipantsShowContainer = createContainer(({users, showForUser, conditionFilter}) => {
    // Get Tasks
    const collectionHandle = Meteor.subscribe('participants');
    const loading = !collectionHandle.ready();
    const props = {showForUser, conditionFilter};
    let myCollection = Participants.find(getParticipantsQuery(props), {sort: {condition: 1, emailAddress:1}});
    const count = myCollection.count();
    console.log("Subscribed, loading " + count + " participants: " + loading.toString());
    const listExists = !loading && !!myCollection;

    return {
        loading,
        items: listExists ? myCollection.fetch() : [],
        listExists,
        users

    };
}, AdminParticipantsShow);


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
