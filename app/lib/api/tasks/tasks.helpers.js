/** Methods for working with Tasks collection **/

import {Tasks} from './tasks';
import {Participants} from '../participants/participants';
import {HTTP} from 'meteor/http';
import {DateHelper} from '../../helpers';
import {Activities} from '../activities/activities';

export class TasksHelpers {
    /**
     * @return {number}
     */
    static get STUDY_LENGTH_IN_DAYS() {
        try {
            return Meteor.settings.public.STUDY_LENGTH_IN_DAYS;
        } catch (err) {
            console.log("ERROR TasksHelpers Study length problem, using default: " + err.message)
        }
        return 28;
    }


    /**
     * Service side read of a JSON asset that is not in /private
     * Limitation: This does not use HTTPS currently.
     * @param assetFile
     */
    static getPublicAsset(assetFile) {
        try {
            //TODO: Need to add option {secure:true} when running on Galaxy
            return HTTP.get(Meteor.absoluteUrl(assetFile)).data;
        } catch (err) {
            console.log("ERROR: could not get public asset " + assetFile + ":" + err.message)
        }
    }

    /**
     * Service side read of a JSON asset that is not in /private
     * Public assets start with a '/' if they are a relative URL to some folder in /public
     * Private assets in a folder need to skip the initial '/' folder indicator
     * @param assetFile
     */
    static getPrivateAsset(assetFile) {
        try {
            let filename = (' ' + assetFile).slice(1); // Deep copy string value
            if (filename.charAt(0) === '/') {   // Trim the leading folder indicator for private assets
                filename = filename.substr(1);
            }
            return JSON.parse(Assets.getText(filename));
        } catch (err) {
            console.log("ERROR: could not get private asset " + assetFile + ":" + err.message);
            return null
        }
    }


    /**
     * Assign one activity for the whole study (e.g., I2 and I2A studies)
     * @param userId
     * @param taskTitle
     * @param taskContentLink
     * @param emailAddress
     * @param numberOfDays
     */
    static assignOneTaskForConsecutiveDays(userId, taskTitle, taskContentLink, emailAddress, numberOfDays) {
        if (!numberOfDays) numberOfDays = TasksHelpers.STUDY_LENGTH_IN_DAYS;
        for (let scheduledDay = 1; scheduledDay <= numberOfDays; scheduledDay++) {
            let taskData = Tasks.create(userId, taskTitle, scheduledDay, emailAddress, taskContentLink);
            Tasks.insert(taskData);
        }
    }

    /**
     * Assign tasks for a study from a JSON.
     *
     * @param userId
     * @param emailAddress
     * @param jsonAssetFile
     */

    /*
     {
     "description": "string",
     "activityTitle": "string",
     "scheduledDay": number,
     "scheduling": "FromToday | FromRegistered | FromChallengeStart"
     }
     */
    static assignTasksByJson(userId, emailAddress, currentGoal, jsonAssetFile, startDay) {
        startDay = typeof startDay === 'number' ? startDay : 0;
        let result = "No activities assigned for " + emailAddress + " for " + jsonAssetFile;
        if (!Meteor.isServer) return result;
        //let activitySchedule = JSON.parse(Assets.getText(jsonAssetFile));
        //let activitySchedule = TasksHelpers.getPublicAsset(jsonAssetFile);
        let activitySchedule = TasksHelpers.getPrivateAsset(jsonAssetFile);

        let detailedSchedule = activitySchedule.schedule;
        //let scheduling = typeof activitySchedule.scheduling !== 'undefined' ? activitySchedule.scheduling : "FromRegistered";
        for (let key in detailedSchedule) {
            let schedule = detailedSchedule[key];
            let scheduledDay =
                typeof schedule.scheduledDay !== 'undefined' &&
                schedule.hasOwnProperty('scheduledDay') &&
                schedule.scheduledDay <= TasksHelpers.STUDY_LENGTH_IN_DAYS ?
                    schedule.scheduledDay + startDay :
                    null;
            if (scheduledDay !== null) {
                let taskTitle = currentGoal;
                let taskContentLink = schedule.activity ? schedule.activity : "";

                //TODO: Adjust scheduledDay for the type of scheduling (FromToday, FromRegistered, FromChallengeStart)
                // Currently FromRegistered is assumed
                let taskData = Tasks.create(userId, taskTitle, scheduledDay, emailAddress, taskContentLink);
                Tasks.insert(taskData);
                result = "Assigned activities for " + emailAddress + " from " + jsonAssetFile;
            }
        }
        return result
    }

    /**
     * Get a participants challenge start date
     * @param participant
     * @returns {*}
     */
    static getStartDate(participant) {
        let startDate = null;
        if (participant && (participant.challengeStartUTC || participant.studyStartUTC)) {
            startDate = participant.challengeStartUTC ? participant.challengeStartUTC : participant.studyStartUTC
        }
        return startDate
    }

    /**
     * Get a participants challenge start date
     * @param participant
     * @returns {*}
     */
    static getStartDateString(participant) {
        let startDate = null;
        if (participant && (participant.challengeStartUTC || participant.studyStartUTC)) {
            startDate = participant.challengeStartUTC ? participant.challengeStartUTC : participant.studyStartUTC
        }
        if (startDate) {
            let month = startDate.getMonth() + 1;
            let monthString = month < 10 ? "0" + month.toString() : month.toString();
            let day = startDate.getDate();
            let dayString = day < 10 ? "0" + day.toString() : day.toString();
            let yearString = startDate.getFullYear().toString();
            let separator = "-";
            return monthString + separator + dayString + separator + yearString;
        }
        return ""
    }

    static getDayInStudy(user, previousDay, startDateString, forDateString) {
        let newDate = null;
        let startDate = null;

        try {
            newDate = new Date(forDateString);
            startDate = new Date(startDateString);
        } catch (err) {
            console.log("ERROR: getDayInStudy " + err.message);
            return previousDay
        }
        if (startDate && newDate) {
            // Calculate from the beginning of challenge for participant to the now and from now to the target date given
            //return previousDay + DateHelper.daysDiffInTimezone(startDateString, timezone) -
            //    DateHelper.daysDiffInTimezone(newDateMidnightLocal, timezone);
            return previousDay + DateHelper.daysDiff(startDate, newDate);
        }
        return previousDay
    }


    /**
     * Get a numeric start date from a numeric start date, relative to a previous value
     * @param userId
     * @param previousDay
     * @param day
     * @returns {*}
     */
    static getStartDayFromDay(userId, previousDay, day) {
        if (typeof previousDay !== 'number') return 0;
        if (typeof day !== 'number') return previousDay
        let user = Meteor.users.findOne({_id: userId});
        if (!user)  return previousDay;
        const participant = Participants.findOne({emailAddress: user.username});
        return !participant ? previousDay : previousDay + day;
    }


    static getStartDayFromAssignmentDate(userId, previousDay, assignmentDate) {
        if (typeof previousDay !== 'number') return 0;
        if (typeof assignmentDate !== 'string') return previousDay;
        let user = Meteor.users.findOne({_id: userId});
        if (!user)  return previousDay;
        const participant = Participants.findOne({emailAddress: user.username});
        if (!participant) return previousDay;
        let startDate = TasksHelpers.getStartDateString(participant);

        if (!startDate) return previousDay;
        try {
            let unused = new Date(assignmentDate);
        } catch (err) {
            console.log("ERROR: getStartDayFromAssignmentDate" + err.message);
            return previousDay
        }
        return TasksHelpers.getDayInStudy(user, previousDay, startDate, assignmentDate)
    }

    static getLastDay(jsonAsset) {
        let lastDay = 0;
        if (jsonAsset && jsonAsset.hasOwnProperty('schedule')) {
            for (let key in jsonAsset.schedule) {
                let item = jsonAsset.schedule[key];
                if (item &&
                    item.hasOwnProperty('scheduledDay') &&
                    typeof item.scheduledDay === 'number' &&
                    item.scheduledDay > lastDay) {
                    lastDay = item.scheduledDay
                }
            }
        }
        return lastDay
    }

    static getNextStartDayFromAssetFile(jsonAssetFile) {
        //let jsonAsset = TasksHelpers.getPublicAsset(jsonAssetFile);
        let jsonAsset = TasksHelpers.getPrivateAsset(jsonAssetFile);
        // Assumes that subsequent files start with Day 1, only the first in set starts at Day 0 (registration day)
        // return TasksHelpers.getLastDay(jsonAsset) + 1
        return TasksHelpers.getLastDay(jsonAsset)
    }

    static getStartDateFromJSON(userId,
                                startDayForThisContent,
                                startDateForThisContent,
                                baseStartDate) {
        baseStartDate = typeof baseStartDate !== 'number' ? 0 : baseStartDate;
        let startDate = baseStartDate;
        if (typeof startDayForThisContent === 'number') {
            return TasksHelpers.getStartDayFromDay(userId, baseStartDate, startDayForThisContent)
        }

        if (typeof startDateForThisContent === 'string') {
            // An absolute day is given, so no relative calculations needed (i.e., previousDay=0)
            return TasksHelpers.getStartDayFromAssignmentDate(userId, 0, startDateForThisContent)
        }
        return startDate
    }

    /**
     * Assign tasks for a study from a JSON Assets file which contains multiple JSON Assets.
     * @param userId
     * @param emailAddress
     * @param currentGoal
     * @param jsonAssetsFile
     */
    static assignTasksByJsonSet(userId, emailAddress, currentGoal, jsonAssetsFile) {
        if (!Meteor.isServer) return null;
        console.log("INFO assignTasksByJsonSet jsonAssetsFile=" + jsonAssetsFile);
        //let activityScheduleList = JSON.parse(Assets.getText(jsonAssetsFile));
        //let activityScheduleList = TasksHelpers.getPublicAsset(jsonAssetsFile);
        let activityScheduleList = TasksHelpers.getPrivateAsset(jsonAssetsFile);
        let runningStartDay = 0;
        let listNumber = 1;
        let maxStartSoFar = 0;
        for (let key in activityScheduleList) {
            let item = activityScheduleList[key];
            if (item && item.hasOwnProperty("contentRoot") && item["contentRoot"]) {
                let assetFile = item["contentRoot"];
                let startDayForThisContent = item["startDayForThisContent"];
                let startDateForThisContent = item["startDateForThisContent"];
                let thisStartDate = TasksHelpers.getStartDateFromJSON(
                    userId,
                    startDayForThisContent,
                    startDateForThisContent,
                    runningStartDay);
                if (thisStartDate > maxStartSoFar) maxStartSoFar = thisStartDate;
                TasksHelpers.assignTasksByJson(userId,
                    emailAddress,
                    currentGoal,
                    assetFile,
                    TasksHelpers.getStartDateFromJSON(
                        userId,
                        startDayForThisContent,
                        startDateForThisContent,
                        runningStartDay)
                );
                runningStartDay = maxStartSoFar + TasksHelpers.getNextStartDayFromAssetFile(assetFile)
            }
            listNumber++;
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
