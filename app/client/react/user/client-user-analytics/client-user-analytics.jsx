/**
 * Created by krivacic on 3/22/2017.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Tasks} from '/lib/api/tasks/tasks.js';
import {Participants} from '/lib/api/participants/participants.js';
import {DateHelper} from '/lib/helpers.js';
import UserAnalyticsChartContainer from './client-user-analytics-chart.jsx';
import {PrivacyHelpers} from '../../../lib/client.privacy.helper';
import {ProfileHelper} from '../../../lib/client.user.profile.helpers';
import ReportPageScheduledActivityHeaderContainer from '../report-page-scheduled-activity-header.jsx';
import {NavigationHelper} from '/client/lib/client.navigation.helpers';

/**
 * Get the challenge start date from start of challenges, if started, or from registration
 * @param props
 * @returns {*}
 */
function getStartDate(props) {
    let startDate = null;
    if (props.participant && (props.participant.challengeStartUTC || props.participant.studyStartUTC)) {
        startDate = props.participant.challengeStartUTC ? props.participant.challengeStartUTC : props.participant.studyStartUTC
    }
    return startDate
}

class UserAnalytics extends React.Component {
    // Initialize for Analytics presentation
    constructor() {
        super();
        this.state = {
            startDate: "Date not set yet",
            showEmailLabel: i18n.__("show-email-address"),
            dayInStudy: -1,
            teamReport: {
                name: "",
                count: 0,
                longestStreak: 0,
                longestStreakStart: -1,
                longestStreakForWeek: 0,
                longestStreakForWeekStart: -1,
                teamGoalByDay: {}
            }
        };
    }

    // Show when the challenge started
    getStartDate() {
        let startDate = getStartDate(this.props);
        if (startDate) {
            this.state.startDate = DateHelper.localizedDateMidnightWithFormat(
                startDate,
                DateHelper.STND_DATE_FORMAT);
        }
        return <p>Start Date: {this.state.startDate}</p>
    }

    // Show this Participants Profile information
    showProfile(event) {
        event.preventDefault();
        NavigationHelper.showProfile(ProfileHelper.getBio(), this.props.userId, Log.LOGWHERE_PROGRESS);
    }

    // Where is this Participant in the challenge activities
    getDayInStudy() {
        let startDate = null;
        if (this.props.participant && (this.props.participant.challengeStartUTC || this.props.participant.studyStartUTC)) {
            startDate = this.props.participant.challengeStartUTC ? this.props.participant.challengeStartUTC : this.props.participant.studyStartUTC
        }
        let timezone = this.props.userData.profile && this.props.userData.profile.timezone ? this.props.userData.profile.timezone : "0";
        timezone = parseInt(timezone);
        timezone = timezone === NaN ? 0 : timezone;

        if (startDate) {
            this.state.dayInStudy = DateHelper.daysDiffUTC(startDate);
        }
        return <p>{i18n.__("day-in-study")}{this.state.dayInStudy}</p>
    }

    // Show this participant's reporting (i.e., goal met. not met. or unreported for each of last 7 days at most)
    getGoalMetChart() {
        if (this.props.tasks.length > 0) {
            let startDate = null;
            if (this.props.participant && (this.props.participant.challengeStartUTC || this.props.participant.studyStartUTC)) {
                startDate = this.props.participant.challengeStartUTC ? this.props.participant.challengeStartUTC : this.props.participant.studyStartUTC
            }
            return (
                <UserAnalyticsChartContainer
                    chart={this.props.tasks}
                    challengeDay={this.state.dayInStudy}
                    startDate={this.state.startDate}
                    teamReport={this.state.teamReport}
                />
            )
        }
        return <span></span>
    }

    // Show streak length
    getGoalReportingStreak() {
        return <p>{i18n.__("longest-streak")}: {Tasks.getTaskReportingStreak(this.props.tasks)}</p>
    }

    // Show up to 7 days of team reporting progess (i.e., goal met. not met. or unreported for each membmer)
    showTeamReport() {
        // Initialize for Team reporting
        const MET = "met";
        const NOT_MET = "not met";
        const NOT_REPORTED = "not reported";
        // Toggle shading on Team progress rows
        const elemStyleEven = {
            backgroundColor: 'lightgrey'
        };
        const elemStyleOdd = {
            backgroundColor: 'white'
        };
        function bgStyle(n) {
            if (n % 2 == 0)
                return elemStyleEven
            else
                return elemStyleOdd
        }

        // Show one reporting item for one day for one Participant (i.e., goal met. not met. or unreported )
        function TableItem(props) {
            let item = props.item;
            kind = NOT_REPORTED;
            if (typeof item == 'boolean') {
                kind = item ? MET : NOT_MET;
            }
            if (kind === MET) {
                return <td style={bgStyle(props.index)}><img src="/analytics-images/analytics-ok-selected.svg"/></td>;
            } else if (kind === NOT_MET) {
                return <td style={bgStyle(props.index)}><img src="/analytics-images/analytics-no-selected.svg"/></td>;
            } else {
                return <td style={bgStyle(props.index)}><img src="/analytics-images/analytics-no-report.svg"/></td>
            }
        }

        // Show Team progress column headings
        function HeaderItem(props) {
            return <th>&nbsp;{props.item}</th>
        }
        function HeaderRow(props) {
            return (
                <tr>
                    {props.item.map((item, index) =>
                        <HeaderItem key={index} item={item}/>
                    )}
                </tr>
            )
        }

        // Show Team progress row
        function TableRow(props) {
            return (
                <tr>
                    {props.item.map((item, index) =>
                        <TableItem key={index} item={item} index={props.index}/>
                    )}
                </tr>
            )
        }

        // Show the goal reporting for the team as a table
        function ReportTable(props) {
            return (
                <div>
                    <table className="analytics-table-mini">
                        <tbody>
                        <HeaderRow item={props.heading}/>
                        {props.item.map((item, index) =>
                            <TableRow key={index} item={item} index={index}/>
                        )}
                        </tbody>
                    </table>

                </div>
            )
        }

        /**
         * Return a formatted date (MM/DD)
         * @param startDate
         * @param day
         * @returns {*}
         */
        function getDate(startDate, day) {
            function addDays(dat, days) {
                dat.setDate(dat.getDate() + days);
                return dat;
            }

            if (startDate) {
                let thisDate = DateHelper.localizedDateMidnightWithFormat(
                    addDays(new Date(startDate), day),
                    DateHelper.STND_DATE_NO_YEAR_FORMAT);
                return thisDate
            }
            return ""
        }

        // Set up team progress, from start to end day, at most last 7 days reported
        let endDay = this.state.dayInStudy;
        let startDay = endDay <= 7 ? 1 : endDay - 6;
        let dayRow = [];
        for (let iday = startDay; iday <= endDay; iday++) {
            dayRow.push(iday)
        }

        let reportedEndDay = 0;
        if (this.state.teamReport.count > 0) {
            // Collect reporting of all team members, each members reporting on a timeline (by day)
            let reportMatrix = [];
            for (let imember = 0; imember < this.state.teamReport.count; imember++) {
                reportMatrix[imember] = [];
                for (let iday = startDay; iday <= endDay; iday++) {
                    if (iday > 0) {
                        let listForDay = this.state.teamReport.teamGoalByDay[iday];
                        let itemForDayForMember = listForDay ? listForDay[imember] : null;
                        reportMatrix[imember][iday] = itemForDayForMember
                    }
                }
            }
            let dayRow = [];
            //let adjustedEndDay = endDay - (reportedEndDay - endDay);
            for (let iday = startDay; iday <= endDay; iday++) {
                if (iday > 0) {
                    dayRow.push(getDate(this.state.startDate, iday));
                }
            }


            return (
                <div>
                    <p>{i18n.__("nav-team")}: {this.state.teamReport.name},&nbsp;
                        <span
                            className="analytics-fonts-emphasis">{this.state.teamReport.count} {i18n.__("members")}</span>
                    </p>
                    <ReportTable item={reportMatrix} heading={dayRow}/>
                </div>
            )
        }
        return (
            <div>
                <p><br/>{i18n.__("nav-team")}: {this.props.userData.profile.team}
                </p>
            </div>
        )

    }


    render() {
        // Initialize for Analytics vertical presentations
        let startDate = this.getStartDate();
        let dayInStudy = this.getDayInStudy();
        Meteor.call('showTeamReport', this.props.userData.profile.team, (err, res) => {
            if (err) {
                console.log("ERROR client-user-analytics.jsx: " + JSON.stringify(err, null, 2))
            } else {
                this.state.teamReport = res;
            }
        });

        return (
            <div className="subcontainer container-center center-text analytics-fonts">
                <div className="subcontainer">
                    <ReportPageScheduledActivityHeaderContainer />
                </div>
                <div className="flex-hbox analytics-profile-pos social-feed-element analytics-image-right">
                    <a className="media-box" target="_blank" onClick={(e) => this.showProfile(e)}>
                        <img className="media-img" src={ProfileHelper.getPicture()}>
                        </img>
                    </a>
                </div>
                <div>
                    {this.getGoalMetChart()}
                    {this.getGoalReportingStreak()}
                    {this.showTeamReport()}
                </div>
            </div>
        );
    }
}


UserAnalytics.propTypes = {
    userId: React.PropTypes.string,
    userData: React.PropTypes.object,
    startDate: React.PropTypes.object,
    tasks: React.PropTypes.array,
    loading: React.PropTypes.bool
};

export default UserAnalyticsContainer = createContainer(() => {
    // Initialize for Analytics vertical by collecting model data needed for Analytics
    let user = Meteor.user();
    let userId = user._id;
    console.log(">>> Create UserAnalyticsContainer" + " <<<");
    const collectionHandle = Meteor.subscribe('tasks');
    const loading = !collectionHandle.ready();

    let myTasks = Tasks.find({userId: userId});
    const count = myTasks.count();
    console.log("Subscribed, loading " + count + " tasks: ");
    const listExists = !loading && !!myTasks;

    const userData = {
        profile: user.profile,
        username: user.username
    };
    console.log(userData);

    const participant = Participants.findOne({emailAddress: user.username});

    return {
        userId,
        userData,
        tasks: listExists ? myTasks.fetch() : [],
        participant,
        loading
    };
}, UserAnalytics);

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
 
