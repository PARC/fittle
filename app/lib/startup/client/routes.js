/**
 * File for defining routes (and helpers for navigating those routes).
 *
 * @note File is placed in a location so its accessible to client, which needs to execute the
 * routes in production, and the server, which, given the current app structure, needs
 * access to this file so the app will compile.
 *
 * @note Placing file in a shared location is required when making use of packages such as Fast Render--
 * "a tool that helps you speed up for load of you app." Even though we are not currently using such
 * a tool, there's no reason to not make life easier in the future. For more info:
 * https://themeteorchef.com/snippets/client-side-routing-with-flow-router/
 *
 */

import {Accounts} from 'meteor/accounts-base';
import {AccountRoles} from '../../api/accounts/accounts';
import {Roles} from 'meteor/alanning:roles';
import {Meteor} from 'meteor/meteor';
import {StudyRegistrationPage} from '../../ui/components/registration/client/studyRegistration';
import {ConnectionHelpers} from '/client/lib/connectionHelper';
import React, { Component } from 'react';
import {ReactLayout} from 'meteor/kadira:react-layout';

// The react pages must be imported here:
import PageAbout from '../../../client/react/about';
import UserPosts from '../../../client/react/user/client-user-posts';
import AdminScheduledMessages from '../../../client/react/admin/client-admin-scheduledmessages/client-admin-scheduledmessages';
import AdminParticipants from '../../../client/react/admin/client-admin-participants/client-admin-participants';
import AdminQuestions from '../../../client/react/admin/client-admin-questions/client-admin-questions';
import AdminTasks from '../../../client/react/admin/client-admin-tasks/client-admin-tasks';
import UserAnalyticsContainer from '../../../client/react/user/client-user-analytics/client-user-analytics';
import UserHistoryContainer from '../../../client/react/user/client-user-history/client-user-history';
import ReportPageContainer from '../../../client/react/user/report-page';
import LoginShowContainer from '../../../client/react/login-page';
import RegisterShowContainer from '../../../client/react/register-page';
import PasswordShowContainer from '../../../client/react/password-page';

/** Map between path routes and names. Eliminates the user of magic strings. */
const Routes = {
    ROOT: {path:'/', name:'/'},
    ABOUT: {path:'/about', name:'about'},
    TERMS: {path:'/terms', name:'terms'},
    DEBUG: {path:'/debug', name:'debug'},
    STUDY_REGISTER: {path:'/studyregister', name:'studyregister'},
    PASSWORD_RECOVERY: {path: '/passwordrecovery', name:'passwordrecovery'},
    LOGIN_ID: {path:'/studyEnter', name:'studyEnter'},
    LOGIN: {path:'/studylogin', name:'studylogin'},
    REPORTING: {path:'/reportPage', name:'reportPage'},
    TRAINING: {path:'/training', name:'training'},
    STUDY_ADMIN: {path:'/admin', name:'admin'},
    MESSAGES: {path:'/adminQuestions', name:'adminQuestions'},
    STUDY_CONDITIONS: {path:'/adminConditions', name:'adminParticipants'},
    POSTSADMIN: {path:'/adminPosts', name:'adminPosts'},
    POSTSUSER: {path:'/userPosts', name:'userPosts'},
    PROFILEADMIN: {path:'/adminUserProfile', name:'adminUserProfile'},
    PROFILEUSER: {path:'/userProfile', name:'userProfile'},
    SHOWPRIVACY: {path:'/showPrivacy', name:'showPrivacy'},
    PARTICIPANTS: {path:'/adminUploadParticipantCSV', name:'adminUploadParticipantCSV'},
    LOAD_MESSAGES: {path:'/adminUploadMessagingCSV', name:'adminUploadMessagingCSV'},
    ADMIN_MESSAGING: {path:'/adminScheduledMessages', name:'adminScheduledMessages'},
    FAILED_CONNECTION: {path:'/failedConnection', name:'failedConnection'},
    NOT_CONNECTED: {path:'/notConnected', name:'notConnected'},
    SIGN_OUT: {path:'/sign-out', name:'sign-out'},
    ANALYTICS: {path:'/analytics', name:'analytics'},
    HISTORY: {path:'/history', name:'history'}
};

const ReactRoutes = {
    about: {page: PageAbout},
    userPosts: {page: UserPosts},
    admin: {page: AdminTasks},
    adminQuestions: {page: AdminQuestions},
    adminParticipants: {page: AdminParticipants},
    adminScheduledMessages: {page: AdminScheduledMessages},
    analytics: {page: UserAnalyticsContainer},
    history: {page: UserHistoryContainer},
    reportPage: {page: ReportPageContainer},
    studyEnter: {page: LoginShowContainer},
    studylogin: {page: PasswordShowContainer},
    studyregister: {page: RegisterShowContainer}
};

/**
 * Utility class for building routes.
 * @requires 'kadira:blaze-layout'
 */
class RouteBuilder
{
    /** Name of the base layout template used on every screen. */
    static get applicationLayout(){
        return 'applicationLayout';
    }

    /**
     * Creates dictionary defining regions for <code>BlazeLayout.render(layout, regions)</code>.
     * @param {String} templateName
     */
    static createRegion(templateName){
        return {navigation: 'navigation', main:templateName};
    }

    /**
     * Creates dictionary of path options used to construct a route.
     * @param {String} templateName
     */
    static createOptions(templateName){
        return {
            reactComponent: function() { return ReactRoutes[templateName]; },
            action: function () {
                if (ReactRoutes[templateName]) {
                    console.log("Return React page " + templateName);
                    BlazeLayout.render(RouteBuilder.applicationLayout, RouteBuilder.createRegion(templateName));
                    ReactLayout.render(ReactRoutes[templateName].page, document.getElementById('react-div'));
                } else {
                    // Do whatever we need when visiting this page.
                    console.log("Return Blaze page, clear React " + templateName);
                    ReactLayout.render(React.createClass({ render() {return <span></span>} }));
                    console.log("Return Blaze page, render Blaze");
                    BlazeLayout.render(RouteBuilder.applicationLayout, RouteBuilder.createRegion(templateName));
                    console.log("Return clear react-div");
                    let rd = document.getElementById("react-div");
                    if (rd) {
                        console.log("'" + rd.innerHTML + "'");
                        rd.innerHTML = '';
                        console.log("*** Cleared inner html");
                        console.log("'" + rd.innerHTML + "'");
                    }
                    console.log("And go to " + templateName);
                }
            },
            name: templateName
        };
    }

    /**
     * Adds a new route to the group.
     * @param {Dictionary} routeInfo - Info defined in <code>Routes</code> dictionary. Expected fields are
     * <code>path</code> and <code>name</code>.
     */
    static addRouteToGroup(routeGroup, routeInfo){
        routeGroup.route(routeInfo.path, RouteBuilder.createOptions(routeInfo.name));
    }
}

/**
* Helper for navigation within client app. Favor using this in components rather than directly calling
*/

export class ClientNavigationHelper
{

    /** Navigate to home page based on authenticated user's role. */
    static goToHomePage() {
        console.log("Set page to home");
        Session.set('page', 'home');
    }

    static goToRegister() {
        console.log("Set page to register");
        Session.set('page', 'register');
    }

    static goToPassword() {
        console.log("Set page to password");
        Session.set('page', 'password');
    }

    static goToStudyAdministratorHome(){

    }

    static goToParticipantHome(){
        Session.set('page', 'report');
    }

    static goToParticipantPosts(){
        Session.set('page', 'posts');
    }

    static goToParticipantHistory(){
        Session.set('page', 'history');
    }

    static goToParticipantAnalyitcs(){
        Session.set('page', 'analytics');
    }

    static goToParticipantPeer2Peer(){
        Session.set('page', 'peer2peer');
    }

    static goToParticipantReport(){
        Session.set('page', 'report');
    }

    static goToFailedConnection(){
        Session.set('connection', 'notConnected')
    }

    static goToNotConnected(){
        Session.set('connection', 'notConnected')
    }

    static goToEnterLoginId() {
        console.log("Set page to login");
        Session.set('page', 'login');
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

