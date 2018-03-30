/**
 * Created by lnelson on 3/22/2017.
 *
 */


import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import AdminLogShow from './client-admin-log-show.jsx';
import {Logs} from '/lib/api/logs/logs';


class AdminLogsShow extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="subcontainer">
                <table className="admin-table">
                    <tbody>
                    <tr>
                        <th>Time</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Message</th>
                        <th>Data</th>
                    </tr>
                    {this.props.items.map((item, index) =>
                        <AdminLogShowContainer key={index} item={item}/>
                    )}
                    </tbody>
                </table>
            </div>
        );
    }
}

AdminLogsShow.propTypes = {
    questions: React.PropTypes.array,
    loading: React.PropTypes.bool,
    listExists: React.PropTypes.bool
};

function getParticipantsQuery(props) {
    let query = {};
    if (props.showForUser) {
        query['userId'] = props.showForUser;
    }
    /*
    let queryFilter = null;
    if (props.conditionFilter) {
        queryFilter = props.conditionFilter
    }
    if (queryFilter) {
        query['condition'] = queryFilter
    }
    */
    return query
}

export default AdminLogsShowContainer = createContainer(({showForUser, conditionFilter}) => {
    // Get Tasks
    const collectionHandle = Meteor.subscribe('logs');
    const loading = !collectionHandle.ready();
    const props = {showForUser, conditionFilter};
    let myCollection = Logs.find(getParticipantsQuery(props), {sort: {timestamp:1}});
    //let myCollection = Logs.find({});
    const count = myCollection.count();
    console.log("Subscribed, loading " + count + " logs: " + loading.toString());
    const listExists = !loading && !!myCollection;

    return {
        loading,
        items: listExists ? myCollection.fetch() : [],
        listExists
    };
}, AdminLogsShow);

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
