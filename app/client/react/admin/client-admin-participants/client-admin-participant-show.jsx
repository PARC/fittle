/**
 * Created by lnelson on 3/22/2017.
 */

/*
 * Component to show one post in a list of posts
 */


import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Participants} from '/lib/api/participants/participants';
import moment from 'moment-timezone';
import {DateHelper} from '../../../../lib/helpers';


function localizedDateAndTimeFromUnix(value) {
    if (value) {
        var dateString = moment(value).format("MM/DD/YYYY HH:mm:ss");
        return dateString;
    }
    return value;
}

class AdminParticipantShow extends React.Component {
    constructor() {
        super();
        this.state = {
            dayInStudy: 0
        }
    }

    getUser() {
        return this.props.item.emailAddress;
    }

    getCondition() {
        return this.props.item.condition;
    }

    getSetting(setting) {
        return (this.props.item.settings && this.props.item.settings[setting]) ? this.props.item.settings[setting] : ''
    }

    getDayInStudy() {
        let startDate = null;
        if (this.props.item && (this.props.item.challengeStartUTC || this.props.item.studyStartUTC)) {
            startDate = this.props.item.challengeStartUTC ? this.props.item.challengeStartUTC : this.props.item.studyStartUTC
        }
        if (!startDate) return 0;
        let day = DateHelper.daysSince(startDate);
        this.state.dayInStudy = day;

        return this.state.dayInStudy  //daysDiffInTimezone(startDate, timezone);
    }

    isRegistered() {
        return this.props.isRegistered;
    }

    delete() {
        Meteor.call("removeParticipant", this.props.item._id)
    }

    updateStart (adjustment) {
        console.log(this.props.item);
        Meteor.call(
            "updateChallengeStart",
            this.props.item._id,
            this.props.item.challengeStartUTC,
            adjustment)
    }

    changeLanguage(e) {
        e.preventDefault();
        Participants.update(
            {_id: this.props.item._id},
            {$set: {'settings.language': e.target.value}}
        );
    }

    changeNavLimits(e) {
        e.preventDefault();
        Participants.update(
            {_id: this.props.item._id},
            {$set: {'settings.navLimits': e.target.value}}
        );
    }

    render() {

        return (

            <tr>
                <td>{this.getUser()}</td>
                <td>{this.getCondition()}</td>
                <td>{this.getSetting('selfEfficacy')}</td>
                <td>{this.getSetting('reminders')}</td>
                <td>{this.getSetting('reminderDistribution')}</td>
                <td>{this.getSetting('reminderCount')}</td>

                <td>
                    {this.getDayInStudy()}
                    &nbsp;
                    &nbsp;
                    <button onClick={() => {
                        let newday = this.state.dayInStudy+1;
                        this.setState({dayInStudy: newday});
                        this.updateStart(-1);
                    }}>+
                    </button>
                    <button onClick={() => {
                        let newday = this.state.dayInStudy-1;
                        this.setState({dayInStudy: newday});
                        this.updateStart(1);
                    }}>-
                    </button>
                </td>
                <td>{this.isRegistered()}</td>

                <td>
                <select
                    onChange={(e) => this.changeLanguage(e)}
                    id="selected_language">
                    <option value="">{this.getSetting('language')}</option>
                    {_.map(['en', 'es', 'phone'], function(lang) {
                        return <option key={Math.random() * 1000}>{lang}</option>
                    })}
                </select>
                </td>

                <td>
                    <select
                        onChange={(e) => this.changeNavLimits(e)}
                        id="selected_nav_limits">
                        <option value="">{this.getSetting('navLimits')}</option>
                        {_.map(['','peer2peer', 'peer2peer,posts', 'peer2peer,posts,analytics'], function(nav) {
                            return <option key={Math.random() * 1000}>{nav}</option>
                        })}
                    </select>
                </td>

                <td>
                    <button onClick={() => {
                        if (confirm('Delete the item?')) {
                            this.delete()
                        }
                    }}>Delete
                    </button>
                </td>
            </tr>
        );
    }
}

AdminParticipantShow.propTypes = {
    question: React.PropTypes.object,
    userId: React.PropTypes.string,
    isRegistered: React.PropTypes.string
};

export default AdminParticipantShowContainer = createContainer(({users, item, userId, showForUser}) => {
    let user = _.find(users, (o) => {
        return o.primaryEmail ===  item.emailAddress;
    });
    let isRegistered = !user ? '' : 'true';
    return {
        item,
        userId,
        isRegistered,
    };
}, AdminParticipantShow);


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
