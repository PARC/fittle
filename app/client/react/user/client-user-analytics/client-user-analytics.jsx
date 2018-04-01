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
            detailReport: null,
            analyticsWindow: 0
        }
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

    /**
     * Get date header item
     * @param startDate
     * @param day
     * @returns {string}
     */
    getDate(startDate, day) {
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


    // Show up to 7 days of team reporting progess (i.e., goal met. not met. or unreported for each membmer)
    showDetailReport() {
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
            if (kind == MET) {
                return <td><img src="/analytics-images/analytics-ok-selected.svg"/></td>;
            } else if (kind == NOT_MET) {
                return <td><img src="/analytics-images/analytics-no-selected.svg"/></td>;
            } else {
                return <td><img src="/analytics-images/analytics-no-report.svg"/></td>
            }
        }


        // Show one reporting item for one day for one Participant (i.e., goal met. not met. or unreported )
        function SilverTableItem(props) {
            let item = props.item;

            if (props && props.index == 0) {
                item = i18n.__(item);
                console.log("return heading");
                return (<td>{item}</td>);
            }

            if (item == MET) {
                return (<td><img src="/analytics-images/analytics-ok-selected.svg"/></td>);
            } else if (item == NOT_MET) {
                return <td><img src="/analytics-images/analytics-no-selected.svg"/></td>;
            } else {
                return <td><img src="/analytics-images/analytics-no-report.svg"/></td>
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
                        <SilverTableItem key={index} item={item} index={index}/>
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

        // Show the goal reporting for the team as a table
        function SilverReportTable(props) {
            return (
                <div>
                    <table className="analytics-table">
                        <tbody>
                        <HeaderRow item={props.header}/>
                        <TableRow key={0} item={props.completion} index={0}/>
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

        // Adjust current week to be partial (1 to 7 days long) and aligned with weeks starting at Challenge Day 1
        let relativeDayInChallengeWeek =  this.state.dayInStudy %7;

        // Set up detailed progress, from start to end day, at most last 7 days reported
        let endDay = this.state.dayInStudy;
        let startDay = endDay - 7;
        if (this.state.analyticsWindow == 0) {
            if (relativeDayInChallengeWeek==0) relativeDayInChallengeWeek = 7;
            startDay = endDay - (relativeDayInChallengeWeek - 1)
        } else {
            endDay = endDay - (this.state.analyticsWindow -7) - relativeDayInChallengeWeek;
            startDay = endDay - 7 > 0 ? endDay - 7 : 1;

        }
        if (startDay<1) startDay=1;

        console.log("relativeDayInChallengeWeek="+relativeDayInChallengeWeek + "\nstartDay="+startDay +
        "\nendDay="+endDay);

        // Set up header rows placed above the detailed report
        let dayHeader = [i18n.__('date-of-report')];
        let completionRow = [i18n.__('report-result')];

        if (this.state.detailReport && this.state.detailReport.detailGoalByDay && this.state.detailReport.detailGoalByDay.length > 0) {
            // Collect reporting of all team members, each members reporting on a timeline (by day)
            let reportMatrix = [];
            let thisRow = [];
            for (let icol = 0; icol < this.state.detailReport.heading.length; icol++) {
                reportMatrix[icol] = [];
                reportMatrix[icol][0] = this.state.detailReport.heading[icol];
                for (let iday = startDay; iday <= endDay; iday++) {
                    reportMatrix[icol][iday] = null;
                }
            }

            for (let iday = startDay; iday <= endDay; iday++) {
                if (iday > 0) {
                    // Set dates for date header row
                    dayHeader[iday] = this.getDate(this.state.startDate, iday);

                    // Set dates for date header row
                    completionRow[iday] = this.state.detailReport.goalByDay[iday];

                    // Assemble detailed report matrix
                    let listForDay = this.state.detailReport.detailGoalByDay[iday];
                    let goalMetForDay = this.state.detailReport.goalByDay[iday];
                    if (listForDay) {
                        let items = listForDay.split(",");

                        for (let i = 0; i < items.length; i++) {
                            try {
                                let index = parseInt(items[i]);
                                reportMatrix[index][iday] = goalMetForDay
                            } catch (err) {
                                console.log("ERROR Day parsing error " + err.message)
                            }
                        }
                    }
                }
            }

            return (
                <SilverReportTable item={reportMatrix} header={dayHeader} completion={completionRow}/>
            )
        }
        return (
            <span>
            </span>
        )

    }

    analyticsNavPressed(navValue) {
        let analyticsWindow = this.state.analyticsWindow;
        analyticsWindow += navValue;
        if (analyticsWindow >= 0 && analyticsWindow < this.state.dayInStudy) {
            this.setState({analyticsWindow: analyticsWindow});
        }
    }

    /**
     * Shpw nav buttons fopr analytics report (forward or back in time form current alaytics window)
     * @param direction
     * @returns {*}
     */
    showAnalyticsButtonPrevious() {
        let class_name = "analytics-nav-button";
        if (this.state.dayInStudy -  this.state.analyticsWindow - 7 <= 0) {
            class_name = "analytics-nav-button-disabled";
        }
        return (
            <div className={class_name} onClick={(e) => this.analyticsNavPressed(7)}>
                {_i18n.__('analytics-silver-nav-previous')}
            </div>
        )
    }

    showAnalyticsButtonNext() {
        let class_name = "analytics-nav-button";
        if (this.state.analyticsWindow == 0) {
            class_name = "analytics-nav-button-disabled";
        }
        return (
            <div className={class_name} onClick={(e) => this.analyticsNavPressed(-7)}>
                {_i18n.__('analytics-silver-nav-next')}
            </div>
        )
    }


    render() {
        // Initialize for Analytics vertical presentations
        let startDate = this.getStartDate();
        let dayInStudy = this.getDayInStudy();
        let weekInStudy = Math.ceil((this.state.dayInStudy - this.state.analyticsWindow) / 7);
        if (!this.state.detailReport) {
            Meteor.call('showDetailReport', weekInStudy, this.props.tasks, (err, res) => {
                if (err) {
                    console.log("ERROR client-user-analytics.jsx: " + JSON.stringify(err, null, 2))
                } else {
                    this.setState({detailReport: res});
                }
            })
        }


        return (
            <div className="subcontainer container-center center-text analytics-fonts">
                <p>
                    <br/>{i18n.__("progress-report")}&nbsp;{weekInStudy}
                </p>
                <div>
                    {this.showDetailReport()}
                </div>
                <div>
                    <br/>
                    {this.showAnalyticsButtonPrevious()}&nbsp;&nbsp;
                    {this.showAnalyticsButtonNext()}
                </div>
            </div>
        );
    }
}


UserAnalytics.propTypes = {
    userId: React.PropTypes.string,
    userData: React.PropTypes.object,
    tasks: React.PropTypes.array,
    participant: React.PropTypes.object

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
        participant
    };
}, UserAnalytics);
