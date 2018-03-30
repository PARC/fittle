/**
 * Created by krivacic on 3/22/2017.
 */

/*
 * Component to show one post in a list of posts
 */

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Posts} from '/lib/api/posts/posts';
import moment from 'moment-timezone';
import {Log} from '/client/log';
import _ from 'lodash';
import {PostHelper} from '/client/lib/client.post.helpers';
import {Badges} from '/lib/api/badges/badges';
import {BADGE_P2P} from '/lib/api/badges/badges';
import {SocialHelpers} from '/client/lib/social.helper';

let readSingleImageAndInsert = PostHelper.readSingleImageAndInsert;

class Peer2PeerShow extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.chatString = '';
    }

    getFromNow(createdAt) {
        return moment(createdAt).fromNow();
    }

    enableCheck() {
        const newPostEnable = this.chatString.length > 0;
        let newState = {};
        let changeMade = false;

        if (this.state.postEnable != newPostEnable)  {
            newState.postEnable = newPostEnable;
            changeMade = true;
        }
        if (changeMade) {
            this.setState(newState);
        }
    }

    expandPost(d) {
        if (!this.state.expandPost) {
            this.setState({expandPost: true});
            Log.logAction(Log.LOGACTION_P2P_EXPAND_CHAT, {where: Log.LOGWHERE_P2P});
        }
    }

    inputCheck(e) {
        this.chatString = e.target.value;
        this.enableCheck();
    }

    submitChat(event) {
        event.preventDefault();
        const target = event.currentTarget;
        const text = this.chatString;
        let imageUri = undefined;
        readSingleImageAndInsert(imageUri, Meteor.user().username, this.props.userId, text, this.props.team);
        Log.logAction(Log.LOGACTION_P2P_SUBMIT_CHAT, {text: event.target.value, team: this.props.team});
        Meteor.call('createBadgeNotifications', this.props.userId, this.props.p2pMemberUserId, BADGE_P2P, this.props.team, {}, _.noop);
        this.chatString = "";
        this.textArea.value = '';
        this.setState({chatEnable: false, expandPost: false});
    }

    cancelChat(event) {
        if (event) {event.preventDefault();}
        Log.logAction(Log.LOGACTION_P2P_CANCEL_CHAT, {where: Log.LOGWHERE_P2P});
        this.chatString = "";
        if (this.textArea) {this.textArea.value = '';}
        this.setState({expandPost: false});
    }

    componentDidUpdate() {
        if (Session.get("scroll-to-bottom") || true) {
            setTimeout(() => {this.gotoBottom()}, 100);
        }
    }

    gotoList() {
        Session.set('p2pMember', undefined);
        Session.set('p2pView', undefined);
    }

    gotoBottom(){
        const justScrolledToBottom =  Session.get("justScrolledToBottom");
        var element = document.getElementById("scroll-bottom");
        if (element) {
            $("#chat-scroll-bottom")[0].scrollIntoView();
        }
    }

    render() {
        // clear out badges for this conversation
        Meteor.call('clearMyBadgeNotifications', BADGE_P2P, this.props.team, _.noop);

        if (this.props.keyboardJustClosed) {Session.set('keyboard-just-closed', 'false');}

        if (this.state.expandPost || this.state.expandPost) {
            if (Meteor.isCordova) {
                if (!this.props.keyboardOpen) {
                    cordova.plugins.Keyboard.show();
                }
            }
        }

        function getChatFooter(myThis) {
            let useSmall = myThis.props.keyboardOpen ? '' : ' post-line-small ';

            if (myThis.state.expandPost) {
                return (
                    <div className={(myThis.props.isSilver ? "post-footer-chat " : "post-footer-chat-v") }>
                        <div className="flex-hbox-no-margin post-footer-big">
                            <textarea className={"post-line-c "} rows={(myThis.props.isSilver ? 2 : 4)} placeholder={i18n.__('chat-with') + " " + myThis.props.peerDisplayName}
                              autoFocus
                              onChange={(e)=>myThis.inputCheck(e)}
                              ref={textArea => myThis.textArea = textArea}
                            >
                            </textarea>
                            <div className="flex-item">
                                <button type="button" className={"btn btn-submit btn-cancel-margin post-chat-button-width" }
                                        onClick={(e) => {myThis.cancelChat(e)}}>{i18n.__('button-cancel')}
                                </button>
                            </div>
                            <div className="flex-item post-item-right">
                                <button type="button"
                                        className={"btn btn-primary btn-submit  btn-cancel-margin post-chat-button-width" }
                                        disabled={!myThis.state.postEnable}
                                        onClick={(e) => {myThis.submitChat(e)}}>{i18n.__('chat-button')}
                                </button>
                            </div>
                        </div>
                        <div className="tap-message">
                            Tap text area to get back keyboard.
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className={(myThis.props.isSilver ? "post-footer-s post-footer-v-height" : "post-footer post-footer-norm") + " post-line-small-height"}>
                        <div className="flex-hbox-no-margin post-footer-buttons-chat">
                                <textarea className="post-line post-line-small" rows="1" placeholder={i18n.__('chat-with') + " " + myThis.props.peerDisplayName}
                                 onClick={(e)=>myThis.expandPost(e)}
                                >
                                </textarea>

                                <button type="button" className="btn btn-submit btn-chat-back"
                                        onClick={(e) => {myThis.gotoList(e)}}>{i18n.__('button-back')}
                                </button>
                        </div>
                    </div>
                );
            }
        }

        function showMessages(myThis) {
            if (myThis.props.conversation && myThis.props.conversation.length > 0) {
                return (
                    _.map(myThis.props.conversation, function(litem) {
                        let fromClass = myThis.props.userId == litem.userId ? "fromSelf" : "fromPeer";
                        return(
                            <div className={'message-list ' + fromClass}  key={"footer_" + (Math.random()*10000).toString()}>
                                <div className={'message ' + fromClass}
                                     key={JSON.stringify(litem) + Math.floor(Math.random() * 1000).toString()}>
                                    {SocialHelpers.fixTextCr(litem.text)}
                                </div>
                                <div className="fromNow"  key={"footer_" + (Math.random()*10000).toString()} >
                                    {myThis.getFromNow(litem.createdAt)}
                                </div>
                            </div>
                        );
                    })
                );
            }
            return (
                <div className={'message-list'}>
                    <div className={'message message-center'}
                         key={Math.floor(Math.random() * 1000).toString()}>
                        {i18n.__('no-messages-yet')}
                    </div>
                </div>
            );
        }

        if (this.state.expandPost) {
            return (
                <div className={(this.props.isSilver ? "post-footer-v" : "post-footer-h") }>
                    <div className={"message-area  post-expand-chat-max-height post-scroll-container "} >
                        {showMessages(this)}
                    </div>
                    {getChatFooter(this)}
                </div>
            );
        }
        return (
            <div className="flex-vbox">
                <div className={"chat-header  " + (this.props.isSilver ? " is-silver" : "") } >
                    <div className="flex-container container-center full-100-pct-height">
                        <div className="flex-title-center">{i18n.__('chat-with') + " " + this.props.peerDisplayName}</div>
                    </div>
                </div>
                <div className={"message-area chat-bottom-padding-small " } >
                    {showMessages(this)}
                    <div id="chat-scroll-bottom"></div>
                </div>
                <div className={(this.props.isSilver ? "post-footer-s post-footer-v-height" : "post-footer post-footer-norm") + " post-line-small-height"}>
                    <div className="flex-hbox-no-margin post-footer-buttons-chat">
                                <textarea className="post-line post-line-small" rows="1" placeholder={i18n.__('chat-with') + " " + this.props.peerDisplayName}
                                          onClick={(e)=>this.expandPost(e)}
                                >
                                </textarea>

                        <button type="button" className="btn btn-submit btn-chat-back"
                                onClick={(e) => {this.gotoList(e)}}>{i18n.__('button-back')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

Peer2PeerShow.propTypes = {
    peerDisplayName: React.PropTypes.string,
    userId: React.PropTypes.string,
    teem: React.PropTypes.string,
    p2pMemberUserId: React.PropTypes.string,
    conversation: React.PropTypes.array
};

export default Peer2PeerShowContainer = createContainer(({userId, peerDisplayName, team, p2pMemberUserId}) => {
    const props = {team: team, limit: 1000, viewName:'latestTeamPosts'};
    const postsHandle = Meteor.subscribe('posts', props);
    const loading = !postsHandle.ready();
    const conversation = Posts.find({deleted: false}, {sort: {createdAt: 1}});
    const listExists = !loading && !!conversation;

    return {
        peerDisplayName,
        userId,
        team,
        p2pMemberUserId,
        isSilver: Meteor.settings.public.IS_SILVER,
        keyboardOpen: Session.get('keyboard-open') === 'true',
        conversation: listExists ? conversation.fetch() : [],
        keyboardJustClosed: Session.get('keyboard-just-closed') === 'true',
    };
}, Peer2PeerShow);


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
