
/**
 * Created by krivacic 3/16/2017.
 */
import {Meteor} from 'meteor/meteor'

// SEE:  Logging_Mechanism.docx in doc directory

const LOGTYPE_DEBUG= 'debug';
const LOGTYPE_ACTION = 'action';
const LOGTYPE_EVENT = 'event';
const LOGTYPE_WARNING = 'warning';
const LOGTYPE_ERROR = 'error';
const LOGTYPE_FATAL = 'fatal';

const LOGEVENT_APP_START = 'appStart';
const LOGEVENT_APP_RESUME = 'appResume';
const LOGEVENT_APP_PAUSE = 'appPause';
const LOGEVENT_EMAIL_REGISTERED = 'email-registered';
const LOGEVENT_EMAIL_NOT_REGISTERED = 'email-not-registered';
const LOGEVENT_EMAIL_NOT_FOUND = 'email-not-found';
const LOGEVENT_LOGIN_FAIL = 'login-fail';
const LOGEVENT_LOGIN_SUCCESS = 'login-success';
const LOGEVENT_REGISTRATION_FAIL = 'registration-fail';
const LOGEVENT_REGISTRATION_SUCCESS = 'registration-success';
const LOGEVENT_QUESTION_SHOW = 'question-show';
    /*
     * Log Error types
     */
const LOGERROR_SERVER_ERROR = 'server-error';


/*
 * Log actions allowed
 */
const LOGACTION_NAVIGATE = 'navigate';
const LOGACTION_OPEN_ERROR = 'open-error-modal';
const LOGACTION_CLOSE_ERROR = 'close-error-modal';
const LOGACTION_REG_TRY = 'reg-try';
const LOGACTION_REG_SUCCESS = 'reg-success';
const LOGACTION_SHOW_PASSWORD = 'show-password';
const LOGACTION_HIDE_PASSWORD = 'hide-password';
const LOGACTION_SHOW_ZENDESK = 'show-zendesk';
const LOGACTION_SHOW_TERMS = 'show-terms';
const LOGACTION_SHOW_PRIVACY = 'show-privacy';
const LOGACTION_CLOSE_IFRAME = 'close-iframe';
const LOGACTION_SHOW_PROFILE = 'show-profile';
const LOGACTION_CLOSE_PROFILE = 'close-profile';
const LOGACTION_EDIT_PROFILE = 'edit-profile';
const LOGACTION_PROFILE_BIO_TEXT = 'bio-text-edit';
const LOGACTION_PROFILE_DISPLAYNAME_TEXT = 'display-name-edit';
const LOGACTION_SHOW_IMAGE = 'show-image';
const LOGACTION_RESET_PASSWORD = 'reset-password';
const LOGACTION_LOGIN_ATTEMPT = 'login-attempt';
const LOGACTION_P2P_SUBMIT_CHAT = 'p2p-submit-chat';
const LOGACTION_P2P_KEYPRESS = 'p2p-keypress';
const LOGACTION_P2P_EXPAND_CHAT = 'p2p-expand-chat';
const LOGACTION_P2P_CANCEL_CHAT = 'p2p-cancel-chat';
const LOGACTION_LIKE_COMMENT = 'like-comment';
const LOGACTION_UNLIKE_COMMENT = 'unlike-comment';
const LOGACTION_LIKE_POST = 'like-post';
const LOGACTION_UNLIKE_POST = 'unlike-post';
const LOGACTION_HIDE_COMMENTS = 'hide-comments';
const LOGACTION_SHOW_COMMENTS = 'show-comments';
const LOGACTION_SUBMIT_POST = 'submit-post';
const LOGACTION_POST_KEYPRESS = 'post-keypress';
const LOGACTION_POST_COMMENT_KEYPRESS = 'post-comment-keypress';
const LOGACTION_POST_EXPAND = 'post-expand';
const LOGACTION_POST_CANCEL = 'post-cancel';
const LOGACTION_POST_COMMENT_EXPAND = 'post-comment-expand';
const LOGACTION_POST_COMMENT_SUBMIT = 'post-comment-submit';
const LOGACTION_CAMERA_OPEN = 'camera-open';
const LOGACTION_CAMERA_DONE = 'camera-done';
const LOGACTION_CAMERA_CANCEL = 'camera-cancel';
const LOGACTION_CAMERA_CLOSE = 'camera-close';
const LOGACTION_FILE_OPEN = 'file-open';
const LOGACTION_FILE_CANCEL = 'file-cancel';
const LOGACTION_FILE_CLOSE = 'file-close';
const LOGACTION_QUESTON_RESPONSE = 'question-response';
const LOGACTION_REPORT_GOAL = 'report-goal';
const LOGACTION_REPORT_SHOW_CARD = 'report-show-card';
const LOGACTION_CATCH_BACK_BUTTON = 'back';
const LOGACTION_POST_MORE = "post-more";

const LOGACTION_UPDATE_PROFILE = 'update-profile';

const LOGACTION_SUBMIT_EMAIL = 'submit-email';

/*
 * log where actions occur
 */
const LOGWHERE_LOGIN = 'login';
const LOGWHERE_REGISTER = 'register';
const LOGWHERE_PASSWORD = 'password';
const LOGWHERE_BASE = 'base';
const LOGWHERE_BACK = 'back';
const LOGWHERE_POST = 'post';
const LOGWHERE_POST_COMMENT = 'post-comment';
const LOGWHERE_P2P = 'p2p';
const LOGWHERE_P2P_LIST = 'p2p-list';
const LOGWHERE_PROFILE = 'profile';
const LOGWHERE_QUESTION = 'question';
const LOGWHERE_REPORT = 'report';
const LOGWHERE_PROGRESS = 'progress';

const LOGUPDATE_PROFILE_DISPLAYNAME = 'profile-update-display-name';
const LOGUPDATE_PROFILE_BIO = 'profile-update-bio';
const LOGUPDATE_PROFILE_PIC = 'profile-update-picture';

let logLevel = 6;

export const Log = {
    LOGEVENT_APP_START: LOGEVENT_APP_START,
    LOGEVENT_APP_RESUME: LOGEVENT_APP_RESUME,
    LOGEVENT_APP_PAUSE: LOGEVENT_APP_PAUSE,
    LOGEVENT_EMAIL_REGISTERED,
    LOGEVENT_EMAIL_NOT_REGISTERED,
    LOGEVENT_EMAIL_NOT_FOUND,
    LOGEVENT_LOGIN_FAIL,
    LOGEVENT_LOGIN_SUCCESS,
    LOGEVENT_REGISTRATION_FAIL,
    LOGEVENT_REGISTRATION_SUCCESS,
    LOGEVENT_QUESTION_SHOW,

// LogActions
    LOGACTION_OPEN_ERROR,
    LOGACTION_CLOSE_ERROR,
    LOGACTION_REG_SUCCESS,
    LOGACTION_REG_TRY,
    LOGACTION_SHOW_PASSWORD,
    LOGACTION_HIDE_PASSWORD,
    LOGACTION_SHOW_ZENDESK,
    LOGACTION_SHOW_TERMS,
    LOGACTION_SHOW_PRIVACY,
    LOGACTION_CLOSE_IFRAME,
    LOGACTION_SHOW_PROFILE,
    LOGACTION_EDIT_PROFILE,
    LOGACTION_UPDATE_PROFILE,
    LOGACTION_CLOSE_PROFILE,
    LOGACTION_SHOW_IMAGE,
    LOGACTION_RESET_PASSWORD,
    LOGACTION_SUBMIT_EMAIL,
    LOGACTION_LOGIN_ATTEMPT,
    LOGACTION_P2P_SUBMIT_CHAT,
    LOGACTION_P2P_KEYPRESS,
    LOGACTION_P2P_EXPAND_CHAT,
    LOGACTION_P2P_CANCEL_CHAT,
    LOGACTION_LIKE_COMMENT,
    LOGACTION_UNLIKE_COMMENT,
    LOGACTION_LIKE_POST,
    LOGACTION_UNLIKE_POST,
    LOGACTION_HIDE_COMMENTS,
    LOGACTION_SHOW_COMMENTS,
    LOGACTION_SUBMIT_POST,
    LOGACTION_POST_KEYPRESS,
    LOGACTION_POST_COMMENT_KEYPRESS,
    LOGACTION_POST_EXPAND,
    LOGACTION_POST_COMMENT_EXPAND,
    LOGACTION_POST_COMMENT_SUBMIT,
    LOGACTION_POST_CANCEL,
    LOGACTION_POST_MORE,
    LOGACTION_CAMERA_OPEN,
    LOGACTION_CAMERA_DONE,
    LOGACTION_CAMERA_CANCEL,
    LOGACTION_CAMERA_CLOSE,
    LOGACTION_FILE_OPEN,
    LOGACTION_FILE_CANCEL,
    LOGACTION_FILE_CLOSE,
    LOGACTION_PROFILE_BIO_TEXT,
    LOGACTION_PROFILE_DISPLAYNAME_TEXT,
    LOGACTION_QUESTON_RESPONSE,
    LOGACTION_REPORT_GOAL,
    LOGACTION_REPORT_SHOW_CARD,
    LOGACTION_NAVIGATE,
    LOGACTION_CATCH_BACK_BUTTON,

    // Log Errors
    LOGERROR_SERVER_ERROR,

    // Log where(s)
    LOGWHERE_LOGIN,
    LOGWHERE_REGISTER,
    LOGWHERE_PASSWORD,
    LOGWHERE_BASE,
    LOGWHERE_BACK,
    LOGWHERE_POST,
    LOGWHERE_POST_COMMENT,
    LOGWHERE_P2P,
    LOGWHERE_P2P_LIST,
    LOGWHERE_PROFILE,
    LOGWHERE_QUESTION,
    LOGWHERE_REPORT,
    LOGWHERE_PROGRESS,

    // Profile update types

    LOGUPDATE_PROFILE_DISPLAYNAME,
    LOGUPDATE_PROFILE_BIO ,
    LOGUPDATE_PROFILE_PIC,

logDebug: logDebug,
    logAction: logAction,
    logEvent: logEvent,
    logWarning: logWarning,
    logError: logError,
    logFatal: logFatal,
    setLogLevel: setLogLevel
};

function setLogLevel(newLevel) {
    if (newLevel >= 0) {
        logLevel = newLevel;
    }
}

// DEBUG, ACRTIONS, EVENTS, WARN, ERROR, FATAL

function logit (logType, thisLevel, logMsg, logData) {
    if (logLevel < thisLevel) {return;}
    let userId = Meteor.userId();
    if ('string' !== typeof userId) {userId='unknown';}
    let now = new Date().getTime();

    let deviceId = 'browser';
    if (Meteor.isCordova) {
        deviceId = device.platform + "-" + device.uuid;
    }
    Meteor.call('logit', userId, now, logType, logMsg, logData, _.noop);
};

function logDebug(logMsg, data) {
    logit(LOGTYPE_DEBUG, 6, logMsg, data);
}

function logAction(logMsg, data) {
    logit(LOGTYPE_ACTION, 5, logMsg, data);
}

function logEvent(logMsg, data) {
    logit(LOGTYPE_EVENT, 4, logMsg, data);
}

function logWarning(event, data) {
    logit(LOGTYPE_WARNING, 3, event, data);
}

function logError(event, data) {
    logit(LOGTYPE_ERROR, 2, event, data);
}

function logFatal(event, data)  {
    logit(LOGTYPE_FATAL, 1, event, data);
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
