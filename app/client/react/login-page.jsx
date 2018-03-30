/**
 * Created by krivacic on 3/22/2017.
 */

/*
 * Component to show one post in a list of posts
 */

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {ClientNavigationHelper} from '/lib/startup/client/routes';
import i18n from 'meteor/universe:i18n';
import {Log} from '/client/log';
import {NavigationHelper} from '/client/lib/client.navigation.helpers';
import {LanguageHelpers} from '/client/lib/languageHelper';

class LoginShow extends React.Component {
    constructor() {
        super();
        this.state = {textAvailable: false, badEmail: false};
    }

    validateEmail(emailAddress) {
        const EMAIL_REGX =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))$/;
        return EMAIL_REGX .test(emailAddress);
    }

    onRequestErrorClose() {
        NavigationHelper.closeLocalModalError(Log.LOGWHERE_LOGIN);
    }

    selectTextInput(e) {
        txt = e.target.value;
        this.username = txt;
        this.props.defaultLoginName = txt;
        this.setState({selectValue: txt});
        this.setState({textAvailable: txt.length > 0});
    }

    displayModalError(myThis, errmsg) {
        NavigationHelper.displayLocalModalError(myThis, Log.LOGWHERE_LOGIN, "Login error: " + errmsg,  'none');
    }

    selectPrivacy(e) {
        e.preventDefault();
        NavigationHelper.showPrivacy('none', Log.LOGWHERE_LOGIN);
    }

    selectTerms(e) {
        e.preventDefault();
        NavigationHelper.showTerms('none', Log.LOGWHERE_LOGIN);
    }

    gotoZendesk(e) {
        e.preventDefault();
        NavigationHelper.showZenDesk('none', Log.LOGWHERE_LOGIN);
    }

    onClick(e) {
        let myThis = this;
        e.preventDefault();

        if (!this.state.textAvailable) {return;}

        var username = this.state.selectValue.trim().toLowerCase();
        let validEmail = this.validateEmail(username);

        Log.logAction(Log.LOGACTION_SUBMIT_EMAIL, {validForm: validEmail, where: Log.LOGWHERE_LOGIN});

        if (validEmail) {
            Session.set('wait-mode', 'true');
            Meteor.call("getRegistrationStatus", username, function (err, res) {
                Session.set('wait-mode', 'false');
                if (err) {
                    Log.logError(Log.LOGERROR_SERVER_ERROR, {error: "Server error on getRegistrationStatus", where: Log.LOGWHERE_LOGIN});
                    myThis.displayModalError(myThis, "Server error");
                } else {
                    let isRegistered = res && res.isRegistered;
                    let participant = res && res.participant;

                    if (participant && participant.settings && participant.settings.language) {
                        let lang = participant.settings.language;
                        Session.set('systemLanguage', lang);
                        console.log("INFO Set system language to " + lang);
                        LanguageHelpers.setLanguage();
                    }
                    if (isRegistered) {
                        Session.defaultLogin = username;
                        Session.set('defaultLogin', username);
                        Log.logEvent(Log.LOGEVENT_EMAIL_REGISTERED, {where: Log.LOGWHERE_LOGIN});
                        if (Accounts.userId()) {
                            ClientNavigationHelper.goToHomePage();
                        } else {
                            ClientNavigationHelper.goToPassword();
                        }
                    } else {
                        console.log("INFO Needing  to register ");
                        console.log("INFO participant: " + JSON.stringify(participant));
                        Meteor.call("getIsParticipant", username, function (err2, res2) {
                            if (err2) {
                                Log.logError(Log.LOGERROR_SERVER_ERROR, {error: "Server error on getIsParticipant", where: Log.LOGWHERE_LOGIN});
                                myThis.displayModalError(myThis, "Server error");
                            } else if (res2) {
                                Session.defaultLogin = username;
                                Session.set('defaultLogin', username);
                                Log.logEvent(Log.LOGEVENT_EMAIL_NOT_REGISTERED, {where: Log.LOGWHERE_LOGIN});
                                ClientNavigationHelper.goToRegister();
                            } else {
                                Log.logEvent(Log.LOGEVENT_EMAIL_NOT_FOUND, {error: "Unknown email address", where: Log.LOGWHERE_LOGIN});
                                myThis.displayModalError(myThis, "Unknown email address: " + username);
                            }
                        });
                    }
                }
            });
        } else {
            this.setState({badEmail: true});
        }
    }

    getModalFrame(parent, message) {
        return (
            <div className="flex-vbox align-items-center justify-content-space-between full-100-pct-height">
                <div className="error-base-image">
                    <img className="flex-item" src="unknown_user.svg" />
                </div>
                <div className="container-center center-text">
                    <h3>{i18n.__('unknown-user')}</h3>
                </div>
                <div className="container-center center-text error-text">
                    {i18n.__('unknown-user-message')}
                </div>
                <div className="container-center center-text error-text">
                    {i18n.__('please-contact-the')}
                </div>
                <label className={"btn btn-default btn-blue"} onClick={(e) => parent.gotoZendesk(e)}>
                    {i18n.__('parc-study-investigators')}
                </label>
                <div className="container-center center-text error-text">
                    {i18n.__('if-you-have-questions')}
                </div>
            </div>
        );
    }



    render() {

        if (this.state.selectValue == undefined) {
            this.state.selectValue = this.props.defaultLoginName;
            this.state.textAvailable = this.props.defaultLoginName.length > 0;
        }

        function setSessionVal(key, val) {
            Session.set(key, val);
        }

        let larger = "";
        let emailMessage;
        let emailHilite = ' gray-input-border';
        let copyrightDiv =
            <div className="container-center center-text c-padding info-font-2">
                &copy; MMXVII PARC, a Xerox company
            </div>;

        let imageDiv =
            <div className="login-base-image">
                <img className="flex-item" src="fittle_core.svg" />
            </div>;
        if (Meteor.settings.public.IS_SILVER) {
            imageDiv =
                <div className="login-base-image-silver">
                    <img className="flex-item" src="fittle_core.svg" />
                </div>;
        }
        if (this.props.keyboardOpen) {
            imageDiv =
                <div className="login-base-image-small">
                    <img className="flex-item" src="fittle_core.svg"/>
                </div>;
        }

        if (this.state.badEmail) {
            emailHilite = " error-input-border";
            emailMessage =
                <div className="container-center center-text error-text">
                    {i18n.__('bad-email-message')}
                </div>;
            copyrightDiv =
                <label className={"btn btn-default btn-blue"} onClick={(e) => this.gotoZendesk(e)}>
                    {i18n.__("contact-study-investigators")}
                </label>
        }

        let info1 =
            <div className="container-center center-text info-font">
                {i18n.__('about-terms-conditions')}&nbsp;
            </div>;
        let info2 =
            <div className="flex-hbox align-items-center no-margin info-font">
                <label className={"btn btn-default btn-normal"} onClick={(e) => this.selectTerms(e, 'terms', true)}>
                    {i18n.__("about-terms-header")}
                </label>
                <div className="ogin-privacy-line">&nbsp;&&nbsp;</div>
                <label className={"btn btn-default btn-normal"} onClick={(e) => this.selectPrivacy(e, 'privacy', true)}>
                    {i18n.__("about-privacy-header")}
                </label>
            </div>;


        return (
            <div className="flex-hbox-container justify-content-space-between full-height align-items-center">
                {imageDiv}
                {emailMessage}
                <form onSubmit={(e) => this.onClick(e)}>
                <div className={"flex-hbox password-div form-control" + larger + " no-margin align-items-center login-username " +  emailHilite}>
                            <input className={"form-control"}  type="email"
                                   placeholder={i18n.__('login-user')}
                                   autoCapitalize='off'
                                   value={this.state.selectValue}
                                   onChange={(e) => this.selectTextInput(e)}
                                   ref={el => this.textArea = el}
                            />
                </div>
                </form>

                <div className="login-submit">
                            <button type="button"
                                    className="btn btn-block"
                                    onClick={(e) => this.onClick(e)}
                                    disabled={!this.state.textAvailable}
                                    value={i18n.__("button-submit")} >
                                {i18n.__('button-submit')}
                            </button>
                </div>

                {info1}
                {info2}
                {copyrightDiv}
                <ModalBoxContainer showModal={this.props.showingErrorModal}
                                   title={''}
                                   modalComponent={this.getModalFrame(this, this.state.modalErrorMessage)}
                                   errorModal="true"
                                   closeFn={(e) => this.onRequestErrorClose(e)} />
            </div>
        );
    }
}

LoginShow.propTypes = {

};

export default LoginShowContainer = createContainer(() => {
    let defaultLogin = '';
    if (Session.defaultLogin) {
        defaultLogin = Session.defaultLogin;
    };
    return {
        defaultLoginName: defaultLogin,
        showingErrorModal: Session.get('show-error-modal'),
        keyboardOpen: Session.get('keyboard-open') === 'true'
};
}, LoginShow);


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
