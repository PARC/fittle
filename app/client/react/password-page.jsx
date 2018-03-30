/**
 * Created by krivacic on 3/22/2017.
 */

/*
 * Component to show one post in a list of posts
 */

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Modal from 'react-modal';
import {ClientNavigationHelper} from '/lib/startup/client/routes';
import {Log} from '/client/log';
import {NavigationHelper} from '/client/lib/client.navigation.helpers';
import i18n from 'meteor/universe:i18n';


class PasswordShow extends React.Component {
    constructor() {
        super();
        this.state = {textAvailable: false, showPassword: true};
    }

    onRequestClose() {
        NavigationHelper.closeLocalModalError(Log.LOGWHERE_PASSWORD);
    }

    selectTextInput(e) {
        txt = e.target.value;
        this.setState({selectValue: txt});
        this.setState({textAvailable: txt.length > 0});
    }

    onClick(event) {
        let myThis = this;

        if (!this.state.textAvailable) {return}

        Log.logAction(Log.LOGACTION_LOGIN_ATTEMPT, {where: Log.LOGWHERE_PASSWORD});
        event.preventDefault();
        var password = this.textArea.value;

        // Define callback that will be executed after trying to login the user. This callback explicitly handles
        // a login failure. If the login was successful, our overridden version Accounts.onLogin(), which is defined
        // elsewhere in the app code, will be called.
        Session.set('wait-mode', 'true');
        const callbackToHandleLoginFailure = function (error) {
            Session.set('wait-mode', 'false');
            if (error){
                // The user might not have been found, or their passwword
                // could be incorrect. Inform the user that their
                // login attempt has failed.
                myThis.state.modalErrorMessage = "Incorrect password";
                myThis.setState({badPassword: true});
                Log.logEvent(Log.LOGEVENT_LOGIN_FAIL, {where: Log.LOGWHERE_PASSWORD, error});
            } else {
                Log.logEvent(Log.LOGEVENT_LOGIN_SUCCESS, {where: Log.LOGWHERE_PASSWORD});
                ClientNavigationHelper.goToHomePage();
            }
        };
        // If validation passes, supply the appropriate fields to the Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(this.props.defaultLoginName, password, callbackToHandleLoginFailure);
    }

    resetPassword(e) {
        e.preventDefault();
        let myThis = this;
        Log.logAction(Log.LOGACTION_RESET_PASSWORD, {where: Log.LOGWHERE_PASSWORD});
        // Define function that will be called after attempting to send the user a password reset email.
        const callbackRequestPasswordResetEmail = function(error){
            if (error){
                myThis.setState({modalError: error});
            } else {
                myThis.setState({modalError: false});
            }
            NavigationHelper.displayLocalModalError(myThis, Log.LOGWHERE_PASSWORD, error, 'none')
        };
        Accounts.forgotPassword({email: this.props.defaultLoginName}, callbackRequestPasswordResetEmail);
    }

    reverseShowPassword(e) {
        Log.logAction(this.state.showPassword ? Log.LOGACTION_SHOW_PASSWORD   : Log.LOGACTION_HIDE_PASSWOR, {where:Log.LOGWHERE_PASSWORD});
        e.preventDefault();
        this.setState({showPassword: !this.state.showPassword});
    }

    gotoZendesk(e) {
        e.preventDefault();
        NavigationHelper.showZenDesk('none', Log.LOGWHERE_PASSWORD);
    }

    render() {

        function getModalFrame(parent, err) {
            if (err) {
                return (
                    <div className="flex-vbox align-items-center justify-content-space-between full-100-pct-height">
                        <div className="error-base-image">
                            <img className="flex-item" src="unknown_user.svg" />
                        </div>
                        <div className="container-center center-text">
                            <h3>{i18n.__('error-resetting-password')}</h3>
                        </div>
                        <div className="container-center center-text">
                            {err.message}
                        </div>
                        <div className="container-center center-text">
                            {i18n.__('please-contact-the')}
                        </div>
                        <label className={"btn btn-default btn-blue"} onClick={(e) => parent.gotoZendesk(e)}>
                            {i18n.__('parc-study-investigators')}
                        </label>
                        <div className="container-center center-text">
                            {i18n.__('if-you-have-questions')}
                        </div>
                    </div>
                );
            }
            return (
                <div className="flex-vbox align-items-center justify-content-space-between full-100-pct-height">
                    <div className="error-base-image">
                        <img className="flex-item" src="fittle_core.svg" />
                    </div>
                    <div className="container-center center-text">
                        <h3>{i18n.__('success-resetting-password')}</h3>
                    </div>
                    <div className="container-center center-text">
                        {i18n.__('reset-success-text')}
                    </div>
                    <div className="container-center center-text">
                        {i18n.__('please-contact-the')}
                    </div>
                    <label className={"btn btn-default btn-blue"} onClick={(e) => parent.gotoZendesk(e)}>
                        {i18n.__('parc-study-investigators')}
                    </label>
                    <div className="container-center center-text">
                        {i18n.__('if-you-have-questions')}
                    </div>
                </div>
            );
        }

        let pwClass = '';

        let pwType = "password";
        if (this.state.showPassword) {
            pwType = "text";
        }

        let passwordMessage;
        let passwordHilite;

        if (this.state.badPassword) {
            passwordHilite = " error-input-border";
            passwordMessage =
                <div className="container-center center-text error-text">
                    {i18n.__('bad-password-message')}
                </div>;
        }
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

        let info3 =
            <label className={"btn btn-default btn-blue"} onClick={(e) => this.gotoZendesk(e)}>
                {i18n.__("contact-study-investigators")}
            </label>;

        let info2 =
            <label className={"btn btn-default btn-normal"} onClick={(e) => this.resetPassword(e)}>
                {i18n.__("tap-if-forgot-password")}
            </label>;

        return (
            <div className="flex-hbox-container justify-content-space-between full-height align-items-center">

                {imageDiv}

                {passwordMessage}

                <form onSubmit={(e) => this.onClick(e)}>
                <div className={"flex-hbox password-div no-margin align-items-center login-username form-control  gray-input-border"}>
                    <input className={"form-control"} type={pwType}
                           autoCapitalize='off'
                           placeholder={i18n.__('login-enter-password-header')}
                           onChange={(e) => this.selectTextInput(e)}
                           ref={el => this.textArea = el}
                    />
                    <img className="flex-item" src={this.state.showPassword ? "eye-not.svg" : "eye.svg"} onClick={(e) => this.reverseShowPassword(e)}/>
                </div>
                </form>

                <div className="login-submit">
                    <button type="button"
                            className="btn btn-block"
                            onClick={(e) => this.onClick(e)}
                            disabled={!this.state.textAvailable}
                            >
                        {i18n.__('button-login')}
                    </button>
                </div>

                {info2}
                {info3}

                <ModalBoxContainer showModal={this.props.showingModal}
                                   title={i18n.__("")}
                                   modalComponent={getModalFrame(this, this.state.modalError)}
                                   closeFn={(e) => this.onRequestClose(e)} />

            </div>
        );
    }
}


PasswordShow.propTypes = {

};

export default PasswordShowContainer = createContainer(() => {
    let defaultLogin = '';
    if (Session.defaultLogin) {
        defaultLogin = Session.defaultLogin;
    };
    return {
        defaultLoginName: defaultLogin,
        showingModal: Session.get('show-error-modal'),
        keyboardOpen: Session.get('keyboard-open') === 'true',
    };
}, PasswordShow);

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
