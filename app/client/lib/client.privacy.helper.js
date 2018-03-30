/**
 * Created by lnelson on 5/30/17.
 * Functions used to help limit exposure of personally identifiable information (PII).
 * Note: Admin interfaces will have data access to all user information, and will limit when those are shown on an
 * as-needed basis. Client interfaces will always have access to the PII of the logged in user, and will limit when
 * those are shown on an as-needed basis.
 */
import {Participants} from '../../lib/api/participants/participants';

export const PrivacyHelpers = {
    getParticipantForLoggedInUser,
    'getDisplayNameForLoggedInUser': getDisplayNameForLoggedInUser,
    'getUserIdForLoggedInUser': getUserIdForLoggedInUser,
    'getStudyIdForLoggedInUser': getStudyIdForLoggedInUser,
    'revealUsernameForLoggedInUser': revealUsernameForLoggedInUser
};

const NO_DISPLAY_NAME = 'anonymous';
const NO_USER_NAME = 'anonymous';
const NO_USER_ID = null;
const NO_STUDY_ID = null;

/**
 * If a user is logged in return the internal User ID if it is available.
 * Otherwise return a 'No User ID' indicator
 * @param defaultName
 * @returns {*}
 */
export function getUserIdForLoggedInUser(sessionVar, defaultName) {
    const returnDefault = defaultName ? defaultName : NO_USER_ID;
    return Meteor.userId() ? Meteor.userId() : defaultName;
}

/**
 * If a user is logged in get the Participant display name if it is available.
 * Otherwise return a 'No Display Name' indicator
 * @param defaultName
 * @returns {*}
 */
export function getDisplayNameForLoggedInUser(defaultName) {
    const returnDefault = defaultName ? defaultName : NO_DISPLAY_NAME;
    if (!Meteor.user() || !Meteor.user().profile || !Meteor.user().profile.bio || !Meteor.user().profile.bio.displayName ) return returnDefault;
    // Only one Participant should be published for logged in user
    return Meteor.user().profile.bio.displayName
}

/**
 * Get the participant info for the logged in user
 * @returns {*}
 */
export function getParticipantForLoggedInUser() {
    if (!Meteor.user()) return undefined;
    // Only one Participant should be published for logged in user
    return Participants.findOne({emailAddress: Meteor.user().username});
}

/**
 * If a user is logged in return the Participant study ID if it is available.
 * Otherwise return a 'No Study ID' indicator*
 * @param defaultName
 * @returns {*}
 */
export function getStudyIdForLoggedInUser(defaultName) {
    const returnDefault = defaultName ? defaultName : NO_STUDY_ID;
    if (!Meteor.user()) return returnDefault;
    // Only one Participant should be published for logged in user
    const participant = Participants.findOne({emailAddress: Meteor.user().username});
    return participant.studyId ? participant.studyId : returnDefault
}


/**
 * If a user is logged in return the Participant display name if it is available.
 * Otherwise return a 'No Study ID' indicator*
 * @param defaultName
 * @returns {*}
 */
export function revealUsernameForLoggedInUser(defaultName) {
    const returnDefault = defaultName ? defaultName : NO_USER_NAME;
    return Meteor.user() ? Meteor.user().username : returnDefault;
}


/**
 * If a user is logged in return the Participant study ID if it is available.
 * Otherwise return a 'No Study ID' indicator*
 * @param defaultName
 * @returns {*}
 */
export function getStudyIdForUser(userId, defaultName) {
    const returnDefault = defaultName ? defaultName : NO_STUDY_ID;
    let thisUser = Meteor.users.findOne({_id:userId}); // This will only work in the Admin interfaces where
    if (!thisUser) return returnDefault;
    // Only one Participant should be published for logged in user
    const participant = Participants.findOne({emailAddress: Meteor.user().username});
    return participant.studyId ? participant.studyId : returnDefault
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
