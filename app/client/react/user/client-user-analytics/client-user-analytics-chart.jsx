/**
 * Created by lnelson on 5/9/2017.
 */
/*
 * Component to show one post in a list of posts
 */
import React, {Component} from 'react';
import ReactDom from "react-dom";
import {createContainer} from 'meteor/react-meteor-data';
import {Tasks} from '/lib/api/tasks/tasks.js';
import {GoalMetChart} from './client-user-goalMetChart';
import {DateHelper} from '/lib/helpers.js';
import i18n from 'meteor/universe:i18n';

class UserAnalyticsChart extends React.Component {

    constructor() {
        super();
        this.state = {};
        //
        // Define some analytics properties that might eventually move out to analytics packages
        //
        this.BAR_CHART = 'barChart';
        this.BUTTON_GRAPH = 'buttonGraph';
        this.representation = this.BUTTON_GRAPH;

    }

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

    render() {

        switch (this.representation) {
            case this.BAR_CHART:
                return (
                    <div className="container">
                        <div className="row">
                            <h2>Your Goals Met</h2>
                        </div>
                        <div className="row">
                            <div className="col-md-offset-2 col-md-6">
                                <GoalMetChart data={this.props.data} width="480" height="320"/>
                            </div>
                        </div>
                    </div>
                );
                break;
            case this.BUTTON_GRAPH:
            function TableItem(props) {
                if (typeof props.item.goalMet === 'boolean') {
                    if (!props.item.goalMet) {
                        return <td><img src="/analytics-images/analytics-no-selected.svg"/></td>;
                    } else {
                        return <td><img src="/analytics-images/analytics-ok-selected.svg"/></td>;
                    }
                }
                return <td><img src="/analytics-images/analytics-no-report.svg"/></td>;
            }

            function StreakItem(props) {
                const elemStyle = {
                    fontSize: props.fontBoost + '%'
                };
                if (props.item) {
                    return <td style={elemStyle}>🔥</td>;
                }
                return <td style={elemStyle}>&nbsp;</td>
            }

            function HeaderLabelItem(props) {
                return <th>{props.item}</th>
            }

            function RowLabelItem(props) {
                return <td className="analytics-row-label">{props.item}</td>
            }

            function MonthTableLabel(props) {
                if (props.challengeDay <= 9) {
                    return <span></span>
                }
                return <p><br/>{i18n.__("chart-your-last")}&nbsp;{props.days28Limit}&nbsp;{i18n.__("chart-your-days")}
                </p>
            }


            function MonthTable(props) {
                if (props.challengeDay <= 9) {
                    return <span></span>
                }
                const elemStyle = {
                    minWidth: "4vw"
                };

                return (
                    <div>

                        <table className="analytics-table-mini">
                            <tbody>
                            <tr>
                                {props.last28.map((item, index) =>
                                    <TableItem key={index} item={item}/>
                                )}
                            </tr>
                            <tr>
                                {props.teamAll.map((item, index) =>
                                    <StreakItem key={index} item={item} fontBoost="80"/>
                                )}
                            </tr>
                            <tr>
                                {props.challengeDays28.map((item, index) =>
                                    <td style={elemStyle}>&nbsp;</td>
                                )}
                            </tr>

                            </tbody>
                        </table>

                    </div>
                )

            }


                let last7 = [];
                for (let ix = 0; ix < this.props.tasks.length; ix++) {
                    let task = this.props.tasks[ix];
                    if (task.scheduledDate > this.props.challengeDay - 7 && task.scheduledDate <= this.props.challengeDay) {
                        // Don't show day 0 before challenge
                        if (task.scheduledDate > 0) {
                            last7.push(task);
                        }
                    }
                }
                let days7Limit = Math.min(7, last7.length);


                // Set up the display labelling, given that we might be at the very beginning of a challenge
                let challengeDays7 = [];
                for (let idx = 0; idx < days7Limit; idx++) {
                    //challengeDays7[idx] = this.props.challengeDay - (days7Limit -1 - idx);
                    let task = last7[idx];
                    if (task) {
                        challengeDays7 [idx] = task.scheduledDate;
                    }
                }

                // Set the date strings for this week for this individual
                let challengeDays7Dates = [];
                for (let idx = 0; idx < days7Limit; idx++) {
                    //challengeDays7Dates [idx] = this.getDate(this.props.startDate, challengeDays7[idx]);
                    let task = last7[idx];
                    if (task) {
                        challengeDays7Dates [idx] = this.getDate(this.props.startDate, task.scheduledDate);
                    }
                }

                // Find individual streak for the week
                let streak = [];
                let streakStart = 0;
                let streakEnd = 0;
                let streakLength = 0;
                let longesStreakStart = 0;
                let longestStreakLength = 0;
                let longestStreakEnd = 0;
                let inStreak = false;

                for (let idx = 0; idx < days7Limit; idx++) {
                    //challengeDays7[idx] = this.props.challengeDay - (days7Limit -1 - idx);
                    let task = last7[idx];
                    if (task) {
                        // Check if there was a report today
                        if (typeof task.goalMet !== 'undefined') {
                            if (inStreak) {
                                // Streak is continuing
                                streakLength++;
                                streakEnd = task.scheduledDate;
                                if (streakLength > longestStreakLength) {
                                    longesStreakStart = streakStart;
                                    longestStreakLength = streakLength;
                                    longestStreakEnd = streakEnd;
                                }

                            } else {

                                // Streak is starting
                                streakStart = task.scheduledDate;
                                streakEnd = streakStart;
                                streakLength = 1;
                                inStreak = true;
                                if (streakLength > longestStreakLength) {
                                    longesStreakStart = streakStart;
                                    longestStreakLength = streakLength;
                                    longestStreakEnd = streakEnd;
                                }

                            }
                        } else {
                            if (inStreak) {
                                // Streak has ended
                                inStreak = false;
                                if (streakLength > longestStreakLength) {
                                    longesStreakStart = streakStart;
                                    longestStreakLength = streakLength;
                                    longestStreakEnd = streakEnd;
                                }
                            } // else {//Not in streak and did not report - nothing to do}
                        }
                    }
                }
                // Did the week finish on a streak?
                if (streakLength > longestStreakLength) {
                    longesStreakStart = streakStart;
                    longestStreakLength = streakLength;
                    longestStreakEnd = streakEnd;
                }

                for (let idx = 0; idx < days7Limit; idx++) {
                    let task = last7[idx];
                    if (task) {
                        let thisDay = task.scheduledDate;
                        streak[idx] = (
                        longestStreakLength > 0 &&
                        thisDay >= longesStreakStart &&
                        thisDay <= longestStreakEnd);
                    }
                }

                return (
                    <div className="subcontainer">
                        <p>
                            <br/>{i18n.__("chart-reporting-your-last")}&nbsp;{days7Limit}&nbsp;{i18n.__("chart-reporting-your-last-days")}
                        </p>
                        <table className="analytics-table">
                            <tbody>
                            <tr>
                                <RowLabelItem key={0} item={i18n.__("date-of-report")}/>
                                {challengeDays7Dates.map((item, index) =>
                                    <HeaderLabelItem key={index} item={item}/>
                                )}
                            </tr>
                            <tr>
                                <RowLabelItem key={0} item={i18n.__("report-result")}/>
                                {last7.map((item, index) =>
                                    <TableItem key={index} item={item}/>
                                )}
                            </tr>
                            <tr>
                                <RowLabelItem key={0} item={i18n.__("day-of-study")}/>
                                {challengeDays7.map((item, index) =>
                                    <HeaderLabelItem key={index} item={item}/>
                                )}
                            </tr>
                            <tr>
                                <RowLabelItem key={0} item={i18n.__("")}/>
                                {streak.map((item, index) =>
                                    <StreakItem key={index} item={item} fontBoost="80"/>
                                )}
                            </tr>
                            </tbody>
                        </table>

                    </div>
                );
                break;
            default:
                return <div></div>;
        }
    }
}


UserAnalyticsChart.propTypes = {
    data: React.PropTypes.array,
    tasks: React.PropTypes.array,
    challengeDay: React.PropTypes.number,
    startDate: React.PropTypes.string
};

export default UserAnalyticsChartContainer = createContainer(({chart, challengeDay, startDate, teamReport}) => {
    let user = Meteor.user();
    let userId = user._id;
    console.log(">>> Create UserAnalyticsChartContainer" + " <<<");
    let chartData = [];
    for (let ix = 0; ix < chart.length; ix++) {
        let task = chart[ix];
        let scheduledDate = task.scheduledDate;
        let title = (scheduledDate % 7).toString();
        title = title == "0" ? "7" : title;
        let qty = typeof task.goalMet !== 'undefined' ? (task.goalMet ? 2 : 1) : 0;
        let item = {
            qty: qty,
            scheduledDate: scheduledDate,
            xLabel: title
        };
        if (typeof task.goalMet !== 'undefined')
            item.goalMet = task.goalMet;
        chartData.push(item);
    }
    return {
        data: chartData,
        tasks: chart,
        challengeDay: challengeDay,
        startDate: startDate
    };
}, UserAnalyticsChart);

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
