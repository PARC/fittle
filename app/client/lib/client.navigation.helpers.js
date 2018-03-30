/**
 * Created by lnelson on 12/5/16.
 */
import {Log} from '/client/log';
import {P2P} from '/client/react/user/user-navigation.jsx';
export const NavigationHelper = {
    'chatWith': chatWith,
    'displayLocalModalError': displayLocalModalError,
    closeLocalModalError,
    showZenDesk,
    showTerms,
    showPrivacy,
    showProfile,
    closeIFrame,
    closeIFrameImage,
    closeProfile,
    showImage,
    showIFrame,
};


//----------------------------------------------------------------------------------------------------------------------
// User and Team functions
//----------------------------------------------------------------------------------------------------------------------

/**
 *
 * Transferrs to a chat with the given p2pMember / groupName
 */
export function chatWith(groupName, userId, p2pMemberDisplayName, p2pMemberId, how) {
    Session.set('p2pMember', p2pMemberDisplayName);
    Session.set('p2pMemberId', p2pMemberId);
    Session.set('p2pView', groupName);
    Session.set('page', 'peer2peer');
    Log.logAction("navigation", {to: P2P, how: how, userId: userId, team: groupName, memberId: p2pMemberId, member: p2pMemberDisplayName});
}

/**
 * Setup session & state vars to show the local error modal, with ability to be closed by the android back button.
 * Note:  This requires a local modal to use the state variable to display the modal
 * @param myThis    Local state var to set
 * @param where     Were the event occurred
 * @param errmsg    The error message to insert in the local HTML
 * @param user      the id the running user ('none' if no id yet)
 */
export function  displayLocalModalError(myThis, where, errmsg, user) {
    let iframeInfo = {text: errmsg, user: user, where: where};
    Log.logAction(Log.LOGACTION_OPEN_ERROR, iframeInfo);
    console.log("**** ERROR: " + errmsg);
    myThis.setState({modalErrorMessage: errmsg});
    Session.set('show-error-info', JSON.stringify(iframeInfo));
    Session.set('show-error-modal', true);
}

/**
 * Close a local modal error window.
 * @param where where the close is comming from
 */
export function closeLocalModalError(where) {
    let iframeInfo = getInfo("show-error-info");
    iframeInfo.where = where;
    Log.logAction(Log.LOGACTION_CLOSE_ERROR, iframeInfo);
    Session.set('show-error-modal', false);
    Session.set('show-error-info', '');
}

export function showIFrame(action, user, where, url, type, title) {
    let iframeInfo = {user, where, type, url};
    Log.logAction(action, iframeInfo);
    Session.set('show-iframe-url', url);
    Session.set('show-iframe-session', 'iframe');
    Session.set('show-iframe-title', title);
    Session.set('show-iframe-info', JSON.stringify(iframeInfo));
    Session.set('show-iframe', true);
}

export function showImage(user, where, url, inx, postId) {
    let iframeInfo = {url, imageIndex: inx, postId, user, where, type: Log.LOGACTION_SHOW_IMAGE};
    Log.logAction(Log.LOGACTION_SHOW_IMAGE, iframeInfo);
    Session.set('show-iframe-image-url', url);
    Session.set('show-iframe-image-session', 'iframe');
    Session.set('show-iframe-image-info', JSON.stringify(iframeInfo));
    Session.set('show-iframe-image', true);
}

export function showZenDesk(user, where) {
    let iframeInfo = {user, where, type: Log.LOGACTION_SHOW_ZENDESK};
    Log.logAction(Log.LOGACTION_SHOW_ZENDESK, iframeInfo);

    if (Meteor.isCordova) {
        cordova.InAppBrowser.open(Meteor.settings.public.ZENDESK_URL, '_system');
    } else {
        window.open(Meteor.settings.public.ZENDESK_URL, '_system');
    }
    //Session.set('show-iframe-url', Meteor.settings.public.ZENDESK_URL);
    //Session.set('show-iframe-session', 'iframe');
    //Session.set('show-iframe-title', '');
    //Session.set('show-iframe-info', JSON.stringify(iframeInfo));
    //Session.set('show-iframe', true);
}

export function showPrivacy(user, where) {
    let iframeInfo = {user, where, type: Log.LOGACTION_SHOW_PRIVACY};
    Log.logAction(Log.LOGACTION_SHOW_PRIVACY, iframeInfo);
    //Session.set('show-iframe-url', Meteor.settings.public.S3_FETCHURL + "docs/" + Session.get('currentLanguage') + "/" + "privacy-policy.html");
    Session.set('show-iframe-url', "./" + "privacy-policy.html");
    Session.set('show-iframe-session', 'iframe');
    Session.set('show-iframe-title', i18n.__("about-privacy-header"));
    Session.set('show-iframe-info', JSON.stringify(iframeInfo));
    Session.set('show-iframe', true);
}

export function showTerms(user, where) {
    let iframeInfo = {user, where, type: Log.LOGACTION_SHOW_TERMS};
    Log.logAction(Log.LOGACTION_SHOW_TERMS, iframeInfo);
    console.log("Choice terms-and-conditions");
    //Session.set('show-iframe-url', Meteor.settings.public.S3_FETCHURL + "docs/" + Session.get('currentLanguage') + "/" + "terms-of-use.html");
    Session.set('show-iframe-url', "./" + "terms-of-use.html");
    Session.set('show-iframe-session', 'iframe');
    Session.set('show-iframe-title', i18n.__("about-terms-header"));
    Session.set('show-iframe-info', JSON.stringify(iframeInfo));
    Session.set('show-iframe', true);
}

export function closeIFrame(where) {
    let info = getInfo('show-iframe-info');
    info.where = where;
    Log.logAction(Log.LOGACTION_CLOSE_IFRAME, {info});
    Session.set('show-iframe', false);
    Session.set('show-iframe-url', '');
    Session.set('show-iframe-title', '');
    Session.set('show-iframe-session', '');
    Session.set('show-iframe-info', '');
}


export function closeIFrameImage(where) {
    let info = getInfo('show-iframe-info');
    info.where = where;
    Log.logAction(Log.LOGACTION_CLOSE_IFRAME, {info});
    Session.set('show-iframe-image', false);
    Session.set('show-iframe-image-url', '');
    Session.set('show-iframe-image-session', '');
    Session.set('show-iframe-image-info', '');
}

export function showProfile(source, myId, where) {
    Session.set('profile-bio', JSON.stringify(source));
    Session.set("profile-userid", myId);
    Session.set("show-profile", true);
    Log.logAction(Log.LOGACTION_SHOW_PROFILE, {userId: myId, where: where, who: source.userId})
}

export function closeProfile(where) {
    let bio = getInfo('profile-bio');
    info = {where, who: bio.userId};
    Log.logAction(Log.LOGACTION_CLOSE_PROFILE, {info});
    Session.set('show-profile', false);
    Session.set('profile-bio', '');
    Session.set('profile-userid', '');
}

function getInfo(infoKey) {
    let infoStr = Session.get(infoKey);
    let info = {};
    if (infoStr && infoStr.length > 1) {
        info = JSON.parse((infoStr));
    }
    return  info;
}

/*************************************************************************
 *
 * © [2018] PARC Inc., A Xerox Company
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
