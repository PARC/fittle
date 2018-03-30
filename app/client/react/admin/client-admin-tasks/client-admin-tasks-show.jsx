/**
 * Created by lnelson on 3/22/2017.
 */

import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import AdminTaskShow from './client-admin-task-show.jsx';
import {Tasks} from '/lib/api/tasks/tasks';


class AdminTasksShow extends React.Component {
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
                        <th>User</th>
                        <th>Activity</th>
                        <th>Date</th>
                        <th>Goal Met</th>
                        <th>Reported On</th>
                    </tr>

                    {this.props.items.map((item, index) =>
                        <AdminTaskShow key={index} item={item}/>
                    )}

                    </tbody>
                </table>
            </div>
        );
    }
}

AdminTasksShow.propTypes = {
    items: React.PropTypes.array,
    loading: React.PropTypes.bool,
    listExists: React.PropTypes.bool
};

function getTaskQuery (props) {
    let query = {};
    if (props.showForUser) {
        query['emailAddress'] = props.showForUser;
    }
    let goalQuery = null;
    if (props.goalFilter) {
        goalQuery = { $exists: props.goalFilter == 'reported' }
    }
    if (goalQuery) {
        query['goalMet'] = goalQuery
    }
    return query
}

export default AdminTasksShowContainer = createContainer(({showForUser, goalFilter}) => {
    // Get Tasks
    const collectionHandle = Meteor.subscribe('tasks');
    const loading = !collectionHandle.ready();
    const props = {showForUser, goalFilter};
    let myCollection = Tasks.find(getTaskQuery(props), {sort: {createdAt: -1}});
    /*
    let myCollection = null;
    if (props.showForUser) {
        myCollection = Tasks.find({emailAddress: props.showForUser}, {sort: {createdAt: -1}});
    } else {
        myCollection = Tasks.find({}, {sort: {createdAt: -1}});
    }
    */
    const count = myCollection.count();
    console.log("Subscribed, loading " + count + " tasks: " + loading.toString());
    const listExists = !loading && !!myCollection;

    return {
        loading,
        items: listExists ? myCollection.fetch() : [],
        listExists,
    };
}, AdminTasksShow);

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
 