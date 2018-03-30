/**
 * Created by lnelson on 12/5/16.
 */
/**
 * Created by lnelson on 10/19/16.
 */
import {ImageHelper} from './client.image.helpers';
import {Meteor} from 'meteor/meteor'
import {PrivachHelpers} from '/client/lib/client.privacy.helper'

/**
 *
 * Dictionary providing access to date related helpers.
 * Although this dictionary is unnecessary (because most functions and variables are also individually exported
 * via the 'export' statement), this convention makes clearer elsewhere in the code (i.e., in other files)
 * where the helper comes from. For example, the code will read ProfileHelper.getPicture() provides more info
 * than getPicture().
 */
export const ProfileHelper = {
    'getDisplayName': getDisplayName,
    'setDisplayName': setDisplayName,
    'getPicture': getPicture,
    'setPicture': setPicture,
    'getTeam': getTeam,
    'setTeam': setTeam,

};

function getUserFromUsername(emailAddress) {
    return Meteor.users.findOne({username: emailAddress});
}

//----------------------------------------------------------------------------------------------------------------------
// Team functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get a team name from the user profile
 * @returns {*}
 */
function getTeam(emailAddress) {
    let user = getUserFromUsername(emailAddress)
    if (!user)
        return null;
    return user.profile.team
}

/**
 * Join a team (currently only 1 team allowed per Participant)
 * @param team
 */
function setTeam(team, emailAddress) {
    let user = getUserFromUsername(emailAddress)
    if (user)
        Meteor.call("setTeam", user._id, team);
}


//----------------------------------------------------------------------------------------------------------------------
// Picture functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get a team name from the user profile
 * @returns {*}
 */
function getPicture(emailAddress) {
    let user = getUserFromUsername(emailAddress);
    if (!user) return null;
    return user.profile.image
}

/**
 * Set the profile picture using base64 encoding of an input file
 * @param base64ImageString
 */
function setPicture(base64ImageString, emailAddress) {
    let user = getUserFromUsername(emailAddress);
    if (!user)
        Meteor.call("setPicture", user._id, base64ImageString);
}


//----------------------------------------------------------------------------------------------------------------------
// Chat-related functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get the name to show to others in conversation
 * @returns {*}
 */
function getDisplayName(emailAddress) {
    return PrivachHelpers.getDisplayNameForLoggedInUser(emailAddress);
}

/**
 * Set a name to show to others in conversation
 * @param team
 */
function setDisplayName(name, emailAddress) {
    let user = getUserFromUsername(emailAddress);
    if (!user)
        Meteor.call("setDisplayName", user._id, name);
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
