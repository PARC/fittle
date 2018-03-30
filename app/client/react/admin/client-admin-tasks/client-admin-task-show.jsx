/**
 * Created by lnelson on 3/22/2017.
 */

/*
 * Component to show one post in a list of posts
 */


import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Tasks} from '/lib/api/tasks/tasks';
import moment from 'moment-timezone';

import Modal from 'react-modal';

function localizedDateAndTimeFromUnix(value) {
    if (value) {
        var dateString = moment(value).format("MM/DD/YYYY HH:mm:ss");
        return dateString;
    }
    return value;
}

class AdminTaskShow extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    getUser() {
        return this.props.item.emailAddress;
    }

    getTitle() {
        return this.props.item.title;
    }

    getGoalMet() {
        let goalRepr = typeof this.props.item.goalMet !== 'undefined' ? this.props.item.goalMet.toString() : 'unreported';
        return goalRepr;
    }

    getReportUpdatedAt() {
        return <span>{localizedDateAndTimeFromUnix(this.props.item.reportUpdatedAt)}</span>;
    }

    getScheduledDate() {
        return this.props.item.scheduledDate;
    }

    delete() {
        Meteor.call("removeTask" , this.props.item._id)
    }

    render() {

        return (

            <tr>
                <td>{this.getUser()}</td>
                <td>{this.getTitle()}</td>
                <td>{this.getScheduledDate()}</td>
                <td>{this.getGoalMet()}</td>
                <td>{this.getReportUpdatedAt()}</td>
                <td><button onClick={() => {if(confirm('Delete the item?')) {this.delete()};}}>Delete</button></td>
            </tr>
        );
    }
}

AdminTaskShow.propTypes = {
    question: React.PropTypes.object,
    userId: React.PropTypes.string,
};

export default AdminTaskShowContainer = createContainer(({item, userId, showForUser}) => {
    return {
        item,
        userId,
    };
}, AdminTaskShow);
/* */

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
 