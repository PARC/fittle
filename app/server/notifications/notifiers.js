/**
 * Every time the server starts it creates one or more Notifier manager (a class instance on the server). Each instance
 * keeps track one or more Questions that will need notification and when that question’s ask_datetime comes around,
 * send the standard notification to that user.
 *
 * A simple implementation is to use percolatestudio/meteor-synced-cron and track every Question that has
 * sendNotification set and create a 'cron' event on that ask_datetime of that Question for all Questions forever.
 * If the server goes down for any reason, the list gets rebuilt from scratch. If the system keeps running on and on,
 * these objects should persist as long as needed.
 *
 * NOTE on scaling up: If we become worried about have many many users with many many questions, we can set a
 * 'synced cron' cron job to create a Notifier instance to build on daily (hourly, etc) basis a list of notifications
 * just for that time period.
 *
 * Created by lnelson on 8/3/16.
 */
import '../../lib/collections';
import {Questions} from '../../lib/api/questions/questions';
import {DateHelper} from '../../lib/helpers';
import {PushNotificationWrapper} from './pushNotificationWrapper';

export const NotifierTitle = "New PARC Coach Activity";
export const NotifierText = "Please open your PARC Coach App to view the new activity";

export class Notifiers {
    // ..and an (optional) custom class constructor. If one is
    // not supplied, a default constructor is used instead:
    // constructor() { }

    static initializePushNotifications() {
        console.log('Initializing Push Notifications');
        PushNotificationWrapper.PUBLIC_API.initializePushNotifications()
    }
    _scheduleItemId(forAQuestion) {
        return forAQuestion._id.toString()
    }

    _initializeNotificationSchedule(forAQuestion) {
        var _forAQuestionId = this._scheduleItemId(forAQuestion);
        var _notificationTime = forAQuestion.askDatetime; //DateHelper.standardTimezoneDate(forAQuestion.askDatetime);  // Set to Chicago time
        var _userId = Meteor.users.findOne({username: forAQuestion.username})._id;
        var _username = forAQuestion.username;
        console.log('Scheduling notification at ' + _notificationTime + 'User Id:' + _userId);
        SyncedCron.add({
            name: _forAQuestionId,
            schedule: function (parser) {
                // ending_at is a Date object set to some future date
                // there is no recurrence
                return parser.recur().on(_notificationTime).fullDate();
            },
            job: function () {
                console.log("Pushing notification for " + _forAQuestionId + ' at ' + DateHelper.localizedNow());
                PushNotificationWrapper.notifySingleUser(NotifierText, NotifierTitle, _userId);

                // remove job so it doesn't recur
                SyncedCron.remove(this.name);
            }
        });

    }

    constructor() {
        this.questionsToTrack = Questions.find({
            notify: 'true',
            answered: false,
            askDatetime: {$gte: new Date()}
        }).fetch();
        var now = DateHelper.localizedNow();
        for (var i = 0; i < this.questionsToTrack.length; i++) {
            var aQuestion = this.questionsToTrack[i];
            if (aQuestion.expireTime && now > aQuestion.expireDatetime) {
                console.log('INFO Removing ' + aQuestion.expireDatetime);
                this.questionsToTrack.splice(i, 1);
            } else {
                this._initializeNotificationSchedule(aQuestion);
            }
        }
        SyncedCron.start()
    }

    _format_questions() {
        var formatted = [];
        for (var i = 0; i < this.questionsToTrack.length; i++) {
            var aQuestion = this.questionsToTrack[i];
            var formattedText = aQuestion.username + '@' + aQuestion.askDatetime;
            formatted.push(formattedText)
        }
        return formatted
    };

    /**
     * Getter for returning view of Question notifications being managed
     * @returns {string|string|string|string|*}
     */
    getQuestionsToTrack() {
        return _format_questions()
    }

    getNotificationSchedule() {
        var schedule = [];
        for (var i = 0; i < this.questionsToTrack.length; i++) {
            var aQuestion = this.questionsToTrack[i];
            var formattedText = SyncedCron.nextScheduledAtDate(this._scheduleItemId(aQuestion)).toString();
            schedule.push(formattedText)
        }
        return schedule

    }


}