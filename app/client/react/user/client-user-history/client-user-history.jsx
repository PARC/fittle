/**
 * Created by krivacic on 3/22/2017.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Tasks} from '../../../../lib/api/tasks/tasks.js';
import {Participants} from '../../../../lib/api/participants/participants.js';
import {DateHelper} from '../../../../lib/helpers.js';
import IFrameViewerContainer from '../../iframe-viewer.jsx';
import ReportPageScheduledActivityHeaderContainer from '../report-page-scheduled-activity-header.jsx';


function getStartDate(props) {
    let startDate = null;
    if (props.participant && (props.participant.challengeStartUTC || props.participant.studyStartUTC)) {
        startDate = props.participant.challengeStartUTC ? props.participant.challengeStartUTC : props.participant.studyStartUTC
    }
    return startDate
}


function getDayInStudy(props) {
    let startDate = null;
    if (props.participant && (props.participant.challengeStartUTC || props.participant.studyStartUTC)) {
        startDate = props.participant.challengeStartUTC ? props.participant.challengeStartUTC : props.participant.studyStartUTC
    }
    let timezone = props.userData.profile && props.userData.profile.timezone ? props.userData.profile.timezone : "0";
    timezone = parseInt(timezone);
    timezone = timezone === NaN ? 0 : timezone;
    return DateHelper.daysDiffInTimezone(startDate, timezone);
}


class UserHistory extends React.Component {
    constructor() {
        super();
        this.state = {
            startDate: "Date not set yet",
            showInfoModal: false,
            task: null,
            dayInStudy: -1,
            postReport: {}
        };
    }

    getStartDate() {
        if (!this.props.ploading) {
            let startDate = getStartDate(this.props);
            if (startDate) {
                this.state.startDate = DateHelper.localizedDateMidnightWithFormat(
                    startDate,
                    DateHelper.STND_DATE_FORMAT);
                this.state.dayInStudy = DateHelper.daysSince(startDate);
            }
        }
        return <p>Start Date: {this.state.startDate}</p>
    }

    getDate(startDate, day) {
        const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        function addDays(dat, days) {
            dat.setDate(dat.getDate() + days);
            return dat;
        }

        if (startDate) {
            let baseDate = addDays(new Date(startDate), day + 1);
            let thisDate = DateHelper.localizedDateMidnightWithFormat(
                baseDate,
                DateHelper.STND_DATE_FORMAT);

            return months[baseDate.getMonth()] + ' ' + baseDate.getDate();

            return thisDate
        }
        return ""
    }


    getPostReport(day) {
        let report = "";
        let readReport = "";
        let postsReport = "";
        let commentsReport = "";
        let likesReport = "";
        if (day - 1 > 0 && this.props.postReport && this.props.postReport.visits && day - 1 < this.props.postReport.visits.length) {
            readReport = this.props.postReport.visits[day - 1] > 0 ? " " + i18n.__("hist-read-social-feed") : ""
        }
        if (day - 1 > 0 && this.props.postReport && this.props.postReport.posts && day - 1 < this.props.postReport.posts.length) {
            postsReport = this.props.postReport.posts[day - 1] > 0 ? " " + i18n.__("hist-posts") + " " + this.props.postReport.posts[day - 1] : ""
        }
        if (day - 1 > 0 && this.props.postReport && this.props.postReport.comments && day - 1 < this.props.postReport.comments.length) {
            commentsReport = this.props.postReport.posts[day - 1] > 0 ? " " + i18n.__("hist-comments") + " " + this.props.postReport.comments[day - 1] : ""
        }
        if (day - 1 > 0 && this.props.postReport && this.props.postReport.likes && day - 1 < this.props.postReport.likes.length) {
            likesReport = this.props.postReport.posts[day - 1] > 0 ? " " + i18n.__("hist-likes") + " " + this.props.postReport.likes[day - 1] : ""
        }
        report = readReport;
        if (postsReport.length > 0)
            report = report.length > 0 ? report + "; " + postsReport : postsReport;
        if (commentsReport.length > 0)
            report = report.length > 0 ? report + "; " + commentsReport : commentsReport;
        if (likesReport.length > 0)
            report = report.length > 0 ? report + "; " + likesReport : likesReport;
        return report
    }

    goalMetLabel(thisGoal) {
        let label = i18n.__("hist-no-report");
        if (typeof thisGoal !== 'undefined') {
            label = thisGoal ? i18n.__("hist-goal-met") : i18n.__("hist-goal-not-met");
        }
        return label;
    }

    getButtonClass(goalMet, contentLink) {
        if (contentLink) {
            if (goalMet !== undefined) {
                if (goalMet) {
                    return 'btn-history-goal-met';
                }
                return 'btn-history-goal-not-met';

            }
            return '';
        }
        return 'btn-history-no-content';
    }

    getButtonImage(goalMet) {
        if (goalMet !== undefined) {
            if (goalMet) {
                return '/analytics-images/analytics-ok-selected.svg';
            }
            return '/analytics-images/analytics-no-selected.svg';
        }
        return '/analytics-images/analytics-no-report.svg';
    }

    getDateDiv(task, inx) {
        return (
        <div  className="rTableRow" key={"K_" + inx}>
            {this.getDate(this.state.startDate, task.scheduledDate) + ", " + i18n.__("hist-day") + " " + task.scheduledDate}
        </div>
        );
    }

    getTasks() {
        if (!this.props.ploading) {
            let startDate = getStartDate(this.props);
            if (startDate) {
                this.state.startDate = DateHelper.localizedDateMidnightWithFormat(
                    startDate,
                    DateHelper.STND_DATE_FORMAT);
                this.state.dayInStudy = DateHelper.daysSince(startDate);
            }
        }

        let lastDate = undefined;

        let listItems = [];
        let pinx = 1;


        _.each(this.props.tasks, (task, i) => {
            if (i > 0) {
                if (task && task.scheduledDate <= this.state.dayInStudy) {
                    //console.log("Dat in study: " + this.state.dayInStudy + ", sd: " + task.scheduledDate);
                    //console.log(JSON.stringify(task));

                    if (lastDate !== task.scheduledDate) {
                        // Not addin the date to the to list
                        //listItems.push(this.getDateDiv(task, i));
                        lastDate = task.scheduledDate;
                    }

                    let taskHistoryLabel = "";
                    let taskDayLabel = new Date(task.reportCreatedAt || task.createdAt).toLocaleTimeString();
                    if (typeof task.goalMet !== 'undefined') {
                        taskDayLabel = this.getDate(this.state.startDate, task.scheduledDate) + ", " + i18n.__("hist-day") + " " + task.scheduledDate;
                    }

                    taskHistoryLabel = task.title;
                    const timeDate = new Date(task.reportCreatedAt || task.createdAt);
                    const timeStrs = timeDate.toLocaleTimeString().split(':');
                    let ampm = timeStrs[2].split(' ')[1];
                    let minutes = "";
                    // Display minutes as at two digit number, but only if there is a report event
                    minutes = "" + timeStrs[1];
                    let taskTimeLabel =  task.reportCreatedAt ? ", " + timeStrs[0] + ':' + minutes + ampm : "";

                    listItems.push(
                        <div className="rTableRow" key={"ROW_" + pinx++}>
                            <div className="rTableCell rTableLeft">
                                {this.getDate(this.state.startDate, task.scheduledDate) + taskTimeLabel}
                            </div>
                            <div className="rTableCell rTableRight">
                                <div className={"btn btn-history " +
                                (this.getButtonClass(task.goalMet, task.contentLink))}
                                     onClick={(e) => this.openModal(e, task)}
                                >
                                    <div className="history-image-box">
                                        <img width="100%" src={this.getButtonImage(task.goalMet)}/>
                                    </div>
                                    <label>
                                        {taskHistoryLabel}
                                    </label>
                                </div>
                            </div>
                        </div>
                    );

                    // push other events for this same day here:
                    // (i.e. the POSTS info
                    let feedHistoryLabel = this.getPostReport(task.scheduledDate);
                    feedHistoryLabel = [];  //No POSTS in history
                    if (feedHistoryLabel.length > 0) {
                            listItems.push
                            (
                                <div className="rTableRow" key={"ROW_"+ pinx++}>
                                    <div className="rTableCell rTableLeft">
                                        <label></label>
                                    </div>
                                    <div className="rTableCell rTableRight">
                                        {feedHistoryLabel}
                                    </div>
                                </div>
                            );
                    }

                }
            }
        });

        if (listItems.length == 0) {
            listItems.push
            (
                <div className="rTableRow" key={"ROW_"+ pinx++}>
                    <div className="rTableCell rTableLeft">
                        <label></label>
                    </div>
                    <div className="rTableCell rTableRight">
                        <p>{i18n.__("hist-empty")}</p>
                    </div>
                </div>
            );
        }

        return(listItems);


    }


    openModal(e, task) {
        e.preventDefault();
        let url = (task && task.contentLink ? task.contentLink : "");
        if (url && url.length > 0) {
            this.setState({task: task});
            this.setState({showInfoModal: true});
        }
    }

    onRequestClose() {
        this.setState({showInfoModal: false});
    }


    render() {
        //console.log("Tasks: " + JSON.stringify(this.props.tasks));

        let url = this.state.task && this.state.task.contentLink ? this.state.task.contentLink : "";
        let currentLanguage = Session.get('currentLanguage');
        if (currentLanguage && currentLanguage !== 'en') {
            let replaceTarget = 'html-en';
            let replacement = 'html-' + currentLanguage.trim();
            url = url.replace(replaceTarget, replacement)
        }

        return (
            <div className="flex-vbox">
                <ReportPageScheduledActivityHeaderContainer />
                <div className="history-text">
                    {this.getTasks()}
                    {this.getPostReport()}
                    <div className="rTableRow" key={"ROW_END"}>
                        <div className="rTableCell rTableLeft">
                            <label></label>
                        </div>
                        <div className="rTableCell rTableRight">
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
                <IFrameViewerContainer showing={this.state.showInfoModal}
                                       sessionName='history-info-modal'
                                       url={url}
                                       title={''}
                                       closeFn={(e) => this.onRequestClose(e)}/>
            </div>
        );
    }
}


UserHistory.propTypes = {
    userId: React.PropTypes.string,
    userData: React.PropTypes.object,
    tasks: React.PropTypes.array,
    participant: React.PropTypes.object,
    loading: React.PropTypes.bool,
    ploading: React.PropTypes.bool,
    postReport: React.PropTypes.object
};

export default UserHistoryContainer = createContainer(() => {
    let user = Meteor.user();
    let userId = user._id;
    console.log(">>> Create UserHistoryContainer" + " <<<");
    console.log("*** userId: " + userId);
    const collectionHandle = Meteor.subscribe('tasks');
    const loading = !collectionHandle.ready();
    const pcollectionHandle = Meteor.subscribe('participants');
    const ploading = !pcollectionHandle.ready();

    let myTasks = Tasks.find({userId: userId});
    const count = myTasks.count();
    console.log("Subscribed, loading " + count + " tasks: ");
    const listExists = !loading && !!myTasks;

    const userData = {
        profile: user.profile,
        username: user.username
    };

    const participant = Participants.findOne({emailAddress: user.username});

    if (!Session.get("showPostReport")) {
        Session.set("showPostReport", {title: "Getting Post Report"})
    }
    Meteor.call('showPostReport', userId, (err, result) => {
        if (err) {
            Session.set('postReport', {title: "Could not get post report for User History: " + err.message})
        } else {
            Session.set('postReport', result)
        }
    });

    return {
        userId,
        userData,
        tasks: listExists ? myTasks.fetch() : [],
        participant,
        loading,
        ploading,
        postReport: Session.get('postReport')
    };
}, UserHistory);
