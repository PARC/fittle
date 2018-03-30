/**
 * Created by lnelson on 11/11/16.
 */
import {Questions} from '../../lib/api/questions/questions';
import {DateHelper} from '../../lib/helpers';
import {PushNotificationWrapper} from './pushNotificationWrapper';
import {NotifierText, NotifierTitle} from './notifiers';

/**
 * Update the notifications queue
 * @param forAQuestion
 */
function updateNotificationSchedule(forAQuestion) {
    if (forAQuestion) {
        let _user = Meteor.users.findOne({username: forAQuestion.username});
        if (_user) {
            let _forAQuestionId = forAQuestion._id.toString();
            let _notificationTime = forAQuestion.askDatetime;
            let _userId = Meteor.users.findOne({username: forAQuestion.username})._id;
            console.log('Scheduling notification at ' + _notificationTime + ' for ' + forAQuestion.username);
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
    }
}
/**
 * Schedule notifications for a new question if appropriate
 * @param aQuestion
 */
export function updateNotifications(aQuestionId) {
    if (aQuestionId) {
        let aQuestion = Questions.findOne({_id: aQuestionId});
        var now = DateHelper.localizedNow();
        if (aQuestion && aQuestion.notify === 'true' && (!aQuestion.expireTime || now <= aQuestion.expireDatetime)) {
            // Process a question that has not already expired
            if (aQuestion.askDatetime <= now) {
                // We are here in between the ask and expire time of the question
                let _user = Meteor.users.findOne({username: aQuestion.username});
                if (_user)
                    PushNotificationWrapper.notifySingleUser(NotifierText, NotifierTitle, _user._id);
            } else {
                // We are here dealing with a future question
                updateNotificationSchedule(aQuestion);
            }
        }
    }
}


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
