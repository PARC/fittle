/**
 * Created by krivacic on 4/3/2017.
 */
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Tasks} from '/lib/api/tasks/tasks.js';
import {DateHelper} from '/lib/helpers';
import {EVENTS} from '/lib/api/studyevents/studyevents';
import IFrameViewerContainer from '../iframe-viewer.jsx';
import {Log} from '/client/log';
import {NavigationHelper} from '/client/lib/client.navigation.helpers';

class ReportPageScheduledActivity extends React.Component {
    constructor() {
        super();
        this.state = {
            task: null
        };
    }

    getTitle() {
        if (this.props.task &&  this.props.task.title) {
            return this.props.task.title;
        }
        return '';
    }

    activeStr(inOk) {
        if (inOk) {
            if (this.props.goalMet == true) {return 'active'}
            if (this.props.goalMet == false){return 'off'}
            return "";
        } else {
            if (this.props.goalMet == false) {return 'active'}
            if (this.props.goalMet == true){return 'off'}
            return "";
        }
    }

    urlFor(buttonName) {
        const urlStrs = {
            no: {
                active: '/reporting-images/checkmark-no-selected.svg',
                off: '/reporting-images/checkmark-no-off.svg',
                '': '/reporting-images/checkmark-no.svg'
            },
            ok: {
                active: '/reporting-images/checkmark-ok-selected.svg',
                off: '/reporting-images/checkmark-ok-off.svg',
                '': '/reporting-images/checkmark-ok.svg'
            }
        };
        return urlStrs[buttonName][this.activeStr(buttonName === 'ok')];
    }

    getThumbnail() {
        if (this.props.task &&  this.props.task.thumbnailLink) {
            return (
                <div className="report-activity-image-box">
                    <img src={this.props.task.thumbnailLink} />
                </div>
            );
        }
        return '';
    }

    reportCheck(e, val) {
        e.preventDefault();
        this.setState({task: this.props.task});
        Log.logAction(Log.LOGACTION_REPORT_GOAL, {goalMet: val, where: Log.LOGWHERE_REPORT});
        // If the report changes, report it
        if (this.props.goalMet !== val ) {
            //alert("reportCheck val=" + JSON.stringify(val));
            //alert(JSON.stringify(this.props.task));
            Meteor.call('reportedGoalToday', Meteor.user(), this.props.task._id, val);
            Tasks.update(this.props.task._id, {
                $set: {goalMet: val},
            });
            // Notify all coaches of goal reporting
            let localTaskObject = Tasks.clone(this.props.task);
            localTaskObject.goalMet = val;
            Meteor.call("httpSendToAllAgents", 'GoalMet', EVENTS.REPORT, Meteor.user().username, localTaskObject)
        }
    }

    openModal(e, task) {
        let url = (this.props.task && this.props.task.contentLink ? this.props.task.contentLink : "");
        NavigationHelper.showIFrame(Log.LOGACTION_REPORT_SHOW_CARD, this.props.userId, Log.LOGWHERE_REPORT, url, Log.LOGACTION_REPORT_SHOW_CARD, '');
    }

    render() {
        let username = Meteor.user() ? Meteor.user().username : '';
        return (
                <div className="vflex-vbox report-vbox-spacing">
                        <div className="flex-hbox report-activity-margin">
                            {this.getThumbnail()}
                            <div className="flex-vbox-no-margin report-activity-info-box">
                                <label className={"report-activity-title"}>
                                    {this.getTitle()}
                                </label>
                                <label className={"report-activity-text"}>
                                    {this.props.task.description}
                                </label>

                            </div>
                        </div>

                    <div className="flex-container container-center">
                        <div className="flex-container container-center" id="report-tap-button">
                            <label className={"btn btn-default report-text"} onClick={(e) => this.openModal(e, this.props.task)}>
                                {i18n.__("report-touch-for-more")}
                            </label>

                        </div>
                    </div>

                    <div className="flex-container container-center">
                        <label className="center-text report-text" id="report-completion" data-toggle="modal">
                            {i18n.__("report-please-report-completion")}
                        </label>
                    </div>

                    <div id="report-goal" data-toggle="buttons"
                         className="flex-container container-center text-center">
                        <div className={"btn-report-margins"} onClick={(e) => this.reportCheck(e, false)}>
                            <img src={this.urlFor('no')}>
                            </img>
                        </div>
                        <div className={"btn-report-margins"} onClick={(e) => this.reportCheck(e, true)}>
                            <img src={this.urlFor('ok')}>
                            </img>
                        </div>
                    </div>

                </div>
        );
    }
};

ReportPageScheduledActivity.propTypes = {
    task: React.PropTypes.object,
    currentDate: React.PropTypes.string
};

export default ReportPageScheduledActivityContainer = createContainer(({userId, task}) => {

    return {
        task,
        userId,
        goalMet: task && task.goalMet,
    };
}, ReportPageScheduledActivity);
