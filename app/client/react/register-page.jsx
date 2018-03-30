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
import {NavigationHelper} from '/client/lib/client.navigation.helpers';
import {ProfileHelper} from '/client/lib/client.user.profile.helpers';
import { Accounts } from 'meteor/accounts-base';
import moment from 'moment-timezone';
import {Log} from '/client/log';
import {Posts} from '/lib/api/posts/posts';
import i18n from 'meteor/universe:i18n';

class RegisterShow extends React.Component {
    constructor() {
        super();
        this.state = {textAvailable: false, showPassword: true};
    }

    selectTextInput(e) {
        const txt = e.target.value;
        this.setState({canSubmit: txt.length > 3, textAvailable: txt && txt.length > 3});
        this.pw = e.target.value;
    }

    onClick(e) {
        e.preventDefault();

        /** @requires meteor/accounts-base */

        if (!this.state.textAvailable) {return;}

        let myThis = this;
        let email = Session.get('defaultLogin');
        let password = this.pw;
        Log.logAction(Log.LOGACTION_REG_TRY, {who: Log.LOGWHERE_REGISTER});

        const userInfo = {
                'email':email,
                'password':password,
                'profile': {'timezone': moment().utcOffset().toString(), 'team': 'lobby'}};
        Session.set('wait-mode', 'true');
        Accounts.createUser(userInfo,
            function(error) {
                Session.set('wait-mode', 'false');
                if (error){
                    Log.logError(Log.LOGEVENT_REGISTRATION_FAIL, {who: Log.LOGWHERE_REGISTER})
                    NavigationHelper.displayLocalModalError(myThis, Log.LOGWHERE_REGISTER, "Error registering user, error: " + error, 'none');
                } else {
                    Log.logEvent(Log.LOGEVENT_REGISTRATION_SUCCESS, {who: Log.LOGWHERE_REGISTER});
                    Session.set("hasRegistered", true);
                    // NOTE:  team didn't get set in createUser
                    Meteor.call('addUserToTeam', email, 'lobby');
                    let bio = Posts.createBio(Meteor.userId(), '', 'No bio', undefined);
                    Meteor.call("setBio", Meteor.userId(), bio);
                    ClientNavigationHelper.goToHomePage();
                }
            }
        );
    }

    reverseShowPassword(e) {
        e.preventDefault();
        Log.logAction(this.state.showPassword ? Log.LOGACTION_SHOW_PASSWORD   : Log.LOGACTION_HIDE_PASSWOR, {where:Log.LOGWHERE_REGISTER});
        this.setState({showPassword: !this.state.showPassword});
    }

    selectPrivacy(e, key, val) {
        e.preventDefault();
        NavigationHelper.showPrivacy('none', Log.LOGWHERE_REGISTER);
    }

    selectTerms(e, key, val) {
        e.preventDefault();
        NavigationHelper.showTerms('none', Log.LOGWHERE_REGISTER);
    }

    gotoZendesk(e) {
        e.preventDefault();
        NavigationHelper.showZenDesk('none', Log.LOGWHERE_REGISTER);
    }

    onRequestErrorClose() {
        NavigationHelper.closeLocalModalError(Log.LOGWHERE_REGISTER);
    }

    render() {

        let pwType = "password";
        if (this.state.showPassword) {
            pwType = "";
        }


        function getModalFrame(parent, message) {
            return (
                <div className="flex-vbox align-items-center justify-content-space-between full-100-pct-height">
                    <div className="error-base-image">
                        <img className="flex-item" src="unknown_user.svg" />
                    </div>
                    <div className="container-center center-text">
                        <h3>{i18n.__('registration-error')}</h3>
                    </div>
                    <div className="container-center center-text">
                        {parent.modalErrorMessage}
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
        let info3 =
            <label className={"btn btn-default btn-blue"} onClick={(e) => this.gotoZendesk(e)}>
                {i18n.__("contact-study-investigators")}
            </label>;

        return (
            <div className="flex-hbox-container justify-content-space-between full-height align-items-center">

                {imageDiv}

                <form onSubmit={(e) => this.onClick(e)}>
                <div className={"flex-hbox password-div form-control no-margin align-items-center login-username gray-input-border"}>
                    <input className={"form-control"} type={pwType}
                           autoCapitalize='off'
                           placeholder={i18n.__('reg-create-password')}
                           onChange={(evt) => this.selectTextInput(evt)}
                    />
                    <img className="flex-item" src={this.state.showPassword ? "eye.svg" : "eye-not.svg"} onClick={(e) => this.reverseShowPassword(e)}/>
                </div>
                </form>

                <div className={"container-center center-text info-font"} >
                    {i18n.__('password-must-be-4-characters-long')}
                </div>

                <div className="login-submit">
                    <button type="button"
                            className="btn btn-block"
                            onClick={(e) => this.onClick(e)}
                            disabled={!this.state.textAvailable}
                    >
                        {i18n.__('register-login')}
                    </button>
                </div>

                {info1}
                {info2}
                {info3}

                <ModalBoxContainer showModal={this.props.showingErrorModal}
                                   title={''}
                                   modalComponent={getModalFrame(this, this.state.modalErrorMessage)}
                                   errorModal="true"
                                   closeFn={(e) => this.onRequestErrorClose(e)} />
            </div>
        );
    }
}

RegisterShow.propTypes = {

};

export default RegisterShowContainer = createContainer(() => {

    return {
        defaultLoginName: Session.defaultLogin,
        showingErrorModal: Session.get('show-error-modal'),
        keyboardOpen: Session.get('keyboard-open') === 'true',
    };
}, RegisterShow);


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
