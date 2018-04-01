/**
 * Created by lnelson on 10/19/16.
 */
import {ImageHelper} from './client.image.helpers';
import {Posts} from '/lib/api/posts/posts';
import {Meteor} from 'meteor/meteor'
import {PrivacyHelpers} from '/client/lib/client.privacy.helper'
import {StaticContent} from '/lib/staticContent';

/**
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
    'getBio': getBio,
    'setBioText': setBioText
};

//----------------------------------------------------------------------------------------------------------------------
// Team functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get a team name from the user profile
 * @returns {*}
 */
function getTeam() {
    if (!Meteor.user())
        return null;
    return Meteor.user().profile.team
}

/**
 * Join a team (currently only 1 team allowed per Participant)
 * @param team
 */
function setTeam(team) {
    Meteor.call("setTeam", Meteor.user()._id, team);
}


//----------------------------------------------------------------------------------------------------------------------
// Picture functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get a team name from the user profile
 * @returns {*}
 */
function getPicture() {
    let pic = StaticContent.defaultProfilePictureThumbnail();
    if (!Meteor.user())
        return pic;
    let bio = Meteor.user().profile.bio;
    return bio && bio.bioImage ? bio.bioImage : pic;
}

/**
 * Set the profile picture using base64 encoding of an input file
 * @param base64ImageString
 */
function setPicture(base64ImageString) {
    Meteor.user().profile.bio.bioImage = base64ImageString;
    Meteor.call("setPicture", Meteor.user()._id, base64ImageString);
}


//----------------------------------------------------------------------------------------------------------------------
// Chat-related functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get a name to show to others in conversation
 */
function getDisplayName() {
    return PrivacyHelpers.getDisplayNameForLoggedInUser();
}

/**
 * Set a name to show to others in conversation
 * @param team
 */
function setDisplayName(name) {
    Meteor.call("setDisplayName", Meteor.user()._id, name);
}

//----------------------------------------------------------------------------------------------------------------------
// Bio-related functions
//----------------------------------------------------------------------------------------------------------------------


/**
 * Get the users bio to show to others in conversation
 * @returns {*}
 */
function getBio() {
    console.log("Getting bio");
    if (!Meteor.user()) {
        console.log("NO USER");
        return null;
    }
    let bio = Meteor.user().profile.bio;
    if (!bio) {
        bio = Posts.createBio(Meteor.userId(), PrivacyHelpers.getDisplayNameForLoggedInUser(), "", "");
        Meteor.call("setBio", Meteor.userId(), bio);
    } else {
        bio.displayName = PrivacyHelpers.getDisplayNameForLoggedInUser();
    }

    return bio;
}

/**
 * Set a name to show to others in conversation
 * @param team
 */
function setBioText(bioText) {
    Meteor.call("setBioText", Meteor.userId(), bioText);
}

