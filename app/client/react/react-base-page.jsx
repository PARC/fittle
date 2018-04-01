

import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {AccountRoles} from '/lib/api/accounts/accounts';
import {Roles} from 'meteor/alanning:roles';

import React, { Component } from 'react';
import Modal from 'react-modal';
import i18n from 'meteor/universe:i18n';
import { createContainer } from 'meteor/react-meteor-data';
import {StaticContent} from '/lib/staticContent';

// The react pages must be imported here:
import UserPosts from '/client/react/user/client-user-posts';
import UserAnalyticsContainer from '/client/react/user/client-user-analytics/client-user-analytics';
import UserHistoryContainer from '/client/react/user/client-user-history/client-user-history';
import LibraryContainer from '/client/react/user/client-user-library/client-user-library';
import ReportPageContainer from '/client/react/user/report-page';
import LoginShowContainer from '/client/react/login-page';
import RegisterShowContainer from '/client/react/register-page';
import PasswordShowContainer from '/client/react/password-page';
import UserNavigationContainer from '/client/react/user/user-navigation';
import AdminNavigationContainer from '/client/react/admin/admin-navigation';
import Peer2PeerContainer from '/client/react/user/client-peer2peer';
import QuestionsPageContainer from '/client/react/user/questions-page.jsx';
import IFrameImageViewerContainer from '/client/react/iframe-image-viewer.jsx';

import AdminScheduledMessages from '/client/react/admin/client-admin-scheduledmessages/client-admin-scheduledmessages';
import AdminParticipants from '/client/react/admin/client-admin-participants/client-admin-participants';
import AdminQuestions from '/client/react/admin/client-admin-questions/client-admin-questions';
import AdminTasks from '/client/react/admin/client-admin-tasks/client-admin-tasks';
import AdminTeams from '/client/react/admin/client-admin-teams/client-admin-teams';
import AdminLogsContainer from '/client/react/admin/client-admin-logs/client-admin-logs.jsx';
import {NavigationHelper} from '/client/lib/client.navigation.helpers';
import {Log} from '/client/log';
import ModalBoxContainer from './modal-box';
import UserProfileShowContainer from './user/client-user-profile-show';
import IFrameViewerContainer from './iframe-viewer';

// App component - represents the whole app
class ReactBasePage extends React.Component {

    componentWillMount() {
        Modal.setAppElement('body');
    }

    //
    // Methods for closing global pop-up messages
    //
    getInfo(infoStr) {
        let info = {};
        if (infoStr && infoStr.length > 1) {
            info = JSON.parse((infoStr));
        }
        return  info;
    }

    onRequestProfileClose() {
        NavigationHelper.closeProfile(Log.LOGWHERE_BASE);
    }

    onRequestIFrameClose() {
        NavigationHelper.closeIFrame(Log.LOGWHERE_BASE);
    }

    onRequestIFrameImageClose() {
        NavigationHelper.closeIFrameImage(Log.LOGWHERE_BASE);
    }

    onRequestErrorClose() {
        NavigationHelper.closeLocalModalError(Log.LOGWHERE_BASE);
    }

    onRequestWaitClose() {
        Session.set('wait-mode', 'false');
    }

    //
    // Render main page & modal components
    //

 render() {

     function pageNotFound(page) {
         return <div><h3>Sorry Page {page} was not found</h3></div>
     }

     function getRoute(page, isAdmin, isParticipant, loggedIn) {
         console.log("INFO Get Route, route: " + page + ", isAdmin: " + isAdmin + ", isParticipant: " + isParticipant + ", logged in: " + loggedIn);
         if (isAdmin) {
             switch(page) {
                 case 'home':
                     if (loggedIn) {
                         Session.set('page', 'admin-schedule');
                         return <AdminScheduledMessages />;
                     }
                 // fall into login
                 case 'login':
                     return <LoginShowContainer />;
                 case 'password':
                     return <PasswordShowContainer />;
                 case 'admin-schedule':
                     return <AdminScheduledMessages />;
                 case 'admin-participants':
                     return <AdminParticipants />;
                 case 'admin-questions':
                     return <AdminQuestions />;
                 case 'admin-tasks':
                     return <AdminTasks />;
                 case 'admin-teams':
                     return <AdminTeams />;
                 case 'admin-logs':
                     return <AdminLogsContainer/>;
                 default:
                     return <LoginShowContainer />;;
             }

         } else if (isParticipant) {
             switch(page) {
                 case 'home':
                     if (loggedIn) {
                         Session.set('page', 'report');
                         return <ReportPageContainer />;
                     }
                     // Fall into login
                 case 'login':
                     return <LoginShowContainer />;
                 case 'password':
                     return <PasswordShowContainer />;
                 case 'report':
                     return <ReportPageContainer />;
                 case 'posts':
                     return <UserPosts />;
                 case 'history':
                     //return <UserHistoryContainer />;
                     return <LibraryContainer />;
                 case 'analytics':
                     return <UserAnalyticsContainer />;
                 case 'peer2peer':
                     return <Peer2PeerContainer />;
                 case 'register':
                     return <RegisterShowContainer />;
                 default:
                     return <LoginShowContainer />;;
             }
         } else {
             switch(page) {
                 case 'home':
                 case 'login':
                     Session.set('page', 'login');
                     console.log("*** Render login show container ");
                     return <LoginShowContainer />;
                 case 'register':
                     return <RegisterShowContainer />;
                 case 'password':
                     return <PasswordShowContainer />;
                 default:
                     return <LoginShowContainer />;;
             }
         }
     }

     function getHeader(isAdmin, isParticipant, loggedIn) {
         console.log("Get FOOTER " + isAdmin);
         if (isAdmin)
         {
             return (<header className="header navigation"> <AdminNavigationContainer /> </header>);
         }
         return <span></span>
     }

     function getFooter(page, isAdmin, isParticipant, loggedIn, isSilver) {
         console.log("Get FOOTER " + isParticipant);
         if (isSilver) {
             if (isParticipant && loggedIn)
             {
                 return (<UserNavigationContainer currentPage={page} isSilver={isSilver} /> );
             } else {
                 return (
                     <div className="flex-vbox navigation-left">
                     </div>
                     );
             }
         }
        if (isParticipant && loggedIn)
        {
            return (<footer className="footer navigation"> <UserNavigationContainer currentPage={page} /> </footer>);
        }
        return <span></span>
     }

     function getQuestionBox(isParticipant, loggedIn, userName, quetionHoldOff) {
         console.log("**** qbox holdoff: " + quetionHoldOff + ", participant? " + isParticipant);
         if (isParticipant && loggedIn) {
             return <QuestionsPageContainer userName={userName} holdOff={quetionHoldOff}/>
         }
         return <span></span>
     }

     function getConnectionBox() {
         Meteor.status().status !== "connected"
     }

     function getModalFrame(parent) {
         return (
             <div className="flex-vbox align-items-center justify-content-space-between full-100-pct-height">
                 <div className="error-base-image">
                     <img className="flex-item" src={StaticContent.getNoInternetImage()} />
                 </div>
                 <div className="container-center center-text">
                     <h2>{i18n.__('network-unavailable')}</h2>
                 </div>
                 <div className="container-center center-text">
                     <h3>{i18n.__('network-unavailable-message')}</h3>
                 </div>
                 <div className="container-center center-text">
                     <h3>{i18n.__('check-your-settings')}</h3>
                 </div>
             </div>
         );
     }

     function getModalWaitingFrame(parent) {
         return (
             <div className="flex-vbox align-items-center justify-content-space-between full-100-pct-height">
                 <div className="error-base-image">
                     <img className="flex-item" src={StaticContent.getNoInternetImage()} />
                 </div>
                 <div className="container-center center-text">
                     <h2>{i18n.__('network-waiting')}</h2>
                 </div>
                 <div className="container-center center-text">
                     <h3>{i18n.__('network-waiting-message')}</h3>
                 </div>
                 <div className="container-center center-text">
                     <h3>{i18n.__('check-your-settings')}</h3>
                 </div>
             </div>
         );
     }

     const isAdmin = Roles.userIsInRole(Meteor.userId(), AccountRoles.administrator);
     const isParticipant = Roles.userIsInRole(Meteor.userId(), AccountRoles.participant);
     let userName = Meteor.user() ? Meteor.user().username : '';

     const headerLine = getHeader(isAdmin, isParticipant, this.props.loggedIn);
     const contentArea = <div className="flex-stretch-v"> {getRoute(this.props.page, isAdmin, isParticipant, this.props.loggedIn)}</div>;
     const footerArea = getFooter(this.props.page, isAdmin, isParticipant, this.props.loggedIn, this.props.isSilver);

     function getLayout(parent) {

         if (isAdmin) {
             console.log("*** Get silver layout");
             return (
                 <div className="admin-full-height flex-hbox-no-margin">
                     {headerLine}
                     <div className="no-padding admin-width">
                         {contentArea}
                     </div>
                 </div>
             );
         }

         if (parent.props.isSilver && !isAdmin) {
             console.log("*** Get silver layout");
             return (
                 <div className="full-height flex-hbox-no-margin">
                     {footerArea}
                     <div className="no-padding silver-width">
                        {headerLine}
                        {contentArea}
                     </div>
                 </div>
             );
         }

         return (<div className="full-height">
                    {headerLine}
                    {contentArea}
                    {footerArea}
             </div>
         );
     }

     function waitingText() {
         return (
             <div className="flex-vbox align-items-center justify-content-space-around full-100-pct-height">
                 <div className="container-center center-text">
                     <h1>{i18n.__('response-waiting-title')}</h1>
                 </div>
                 <br/>
                 <div className="container-center center-text">
                     <h2>{i18n.__('response-waiting-message')}</h2>
                 </div>
             </div>
         );
     }

     console.log("*** Render the page " + this.props.page);

     return (
            <div className="app-container" id="react-div">

                {getLayout(this)}

                {getQuestionBox(isParticipant, this.props.loggedIn, userName, this.props.quetionHoldOff)}
                <ModalBoxContainer showModal={this.props.showConnectionFailed}
                                   title={''}
                                   modalComponent={getModalFrame(this)}
                                   errorModal="true"
                                   noExitCheck="true"
                                   closeFn={(e) => this.onRequestClose(e)} />

                <ModalBoxContainer showModal={this.props.showConnectionWaiting}
                                   title={''}
                                   modalComponent={getModalWaitingFrame(this)}
                                   errorModal="true"
                                   noExitCheck="true"
                                   closeFn={(e) => this.onRequestClose(e)} />
                <ModalBoxContainer showModal={this.props.showingProfileModal}
                                   closeFn = {(e) => this.onRequestProfileClose(e)}
                                   modalComponent = {<UserProfileShowContainer
                                       bio={this.getInfo(Session.get('profile-bio'))}
                                       userId={Session.get('profile-userid')}
                                       exitFn={(e) => this.onRequestProfileClose(e)} >
                                   </UserProfileShowContainer>
                                   }/>
                <ModalBoxContainer showModal={this.props.waitMode}
                                   closeFn = {(e) => this.onRequestWaitClose(e)}
                                   noExitCheck="true"
                                   modalComponent = {waitingText()}/>
                <IFrameViewerContainer showing = {this.props.showingIFrame}
                                       sessionName = {Session.get("show-iframe-session")}
                                       url={Session.get("show-iframe-url")}
                                       title={''}
                                       closeFn={(e) => this.onRequestIFrameClose(e)} />
                <IFrameImageViewerContainer showing = {this.props.showingIFrameImage}
                                       sessionName = {Session.get("show-iframe-image-session")}
                                       url={Session.get("show-iframe-image-url")}
                                       closeFn={(e) => this.onRequestIFrameImageClose(e)} />

            </div>
     );

 }


};

ReactBasePage.propTypes = {
    page: React.PropTypes.string,
};

export default ReactBasePageContainer = createContainer(({}) => {
    return {
        page : Session.get('page'),
        showConnectionFailed: Session.get('connection') == 'failed' || Session.get('connection') == 'offline',
        showConnectionWaiting: Session.get('connection') == 'waiting',
        showingProfileModal: Session.get('show-profile'),
        showingIFrame: Session.get('show-iframe'),
        showingIFrameImage: Session.get('show-iframe-image'),
        quetionHoldOff: Session.get('holdOffQuestions'),
        loggedIn: Accounts.userId(),
        waitMode: Session.get('wait-mode') === 'true',
        isSilver: Meteor.settings.public.IS_SILVER
    };
}, ReactBasePage);
