/**
 * Created by krivacic on 4/3/2017.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Participants} from '/lib/api/participants/participants'
import {Tasks} from '/lib/api/tasks/tasks.js';
import {DateHelper} from '/lib/helpers';
import ReportPageScheduledActivityHeaderContainer from './report-page-scheduled-activity-header.jsx';
import ReportPageScheduledActivityContainer from './report-page-scheduled-activity.jsx';
import {REPORT} from '/lib/api/badges/badges';
import i18n from 'meteor/universe:i18n';

class ReportPage extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        // clear out badges for this conversation
        Meteor.call('clearMyBadgeNotifications', REPORT, '');

        if (this.props.task) {
            return (
                <div className="subcontainer">
                    <ReportPageScheduledActivityHeaderContainer />
                    <ReportPageScheduledActivityContainer task={this.props.task} userId={this.props.userId}/>
                </div>
            );
        } else if (this.props.studyOver) {
            return (
                <div className="flex-hbox-container full-height align-items-center">
                    <div className="login-base-image">
                        <img className="flex-item" src="fittle_core.svg"/>
                    </div>
                    <h3>
                        <center>{i18n.__("study-over")}</center>
                    </h3>
                </div>
            );
        }

        let username = Meteor.user() ? Meteor.user().username : '';
        return (
            <div className="flex-hbox-container full-height align-items-center">
                <div className="login-base-image">
                    <img className="flex-item" src="fittle_core.svg"/>
                </div>
                <h3>
                    <center>{i18n.__("no-tasks-at-this-time")}</center>
                </h3>
            </div>
        );
    }
}
;

ReportPage.propTypes = {
    studyOver: React.PropTypes.bool,
    task: React.PropTypes.object,
    userId: React.PropTypes.string,
};

export default ReportPageContainer = createContainer(() => {
    /*
     console.log(">>> Create ReportPageContainer" + " <<<");
     console.log("Current day: " + Session.get('currentDay') + " user: " + Meteor.user()._id + ", today: " + Session.get('currentDay')
     + ", is int = " + (Number.isInteger(Session.get('currentDay')))
     );
     */
    const user = Meteor.user();

    const tasksHandle = Meteor.subscribe('tasks');
    const participantsHandle = Meteor.subscribe('participants');

    // Run only if Meteor.user() is set. Logging out causes this autorun to execute, but in that case Meteor.user() is
    // null, which causes errors to be logged.
    if (user) {
        const participant = Participants.findOne();  // Only one participant should be published to this user
        if (participant) {
            //let startDate = Participants.getStartDate(participant);
            /*
            if (participant.challengeStartUTC ) {
                startDate = participant.challengeStartUTC
            } else {
                startDate = participant.studyStartUTC
            }
            */
            //let dayOfStudy = DateHelper.reactiveDaysSince(startDate) ;
            let dayOfStudy = null;

            let startDate = null;
            if (participant && (participant.challengeStartUTC || participant.studyStartUTC)) {
                startDate = participant.challengeStartUTC ? participant.challengeStartUTC : participant.studyStartUTC
            }

            if (startDate) {
                let dayOfStudy = DateHelper.daysDiffUTC(startDate);
                Session.set('currentDay', dayOfStudy);
            }

            //Session.set('currentDay', dayOfStudy);
        }
    }

    function getCurrentTask() {
        //console.log('app/client/react/user/report-page.jsx dayOfStudy='+ Session.get('currentDay'));
        let task = Tasks.findOne({
            userId: Meteor.user()._id,
            scheduledDate: Session.get('currentDay')
        });
        return task;
    }

    function studyOver () {
        try {
            return Meteor.settings.public.STUDY_LENGTH_IN_DAYS;
        } catch (err) {
            console.log("ERROR TasksHelpers Study length problem, using default: " + err.message)
        }
        return 28;
    }

    return {
        studyOver: Number(Session.get('currentDay')) > studyOver(),
        task: getCurrentTask(),
        userId: Meteor.userId(),
    };
}, ReportPage);
