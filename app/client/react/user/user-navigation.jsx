/**
 * Created by krivacic on 3/22/2017.
 */
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Log} from '/client/log';
import {Badges} from '/lib/api/badges/badges';
import {Participants} from '/lib/api/participants/participants';
import {ProfileHelper} from '/client/lib/client.user.profile.helpers';


//NOTE:  These must match the badge strings
const HISTORY = 'history';
const ANALYTICS = 'analytics';
const REPORT = 'report';
const POST = 'posts';
const P2P = 'peer2peer';

const HOLD_OFF_QUESTIONS = [POST, P2P];

class UserNavigation extends React.Component {

    constructor() {
        super();
        this.state = {};
    }

    pressed(where) {
        console.log("GoTo " + where);
        let info = {to: where, how: 'navbar'};
        if (Session.get('keyboard-open') !== 'false') {Session.set('keyboard-open', 'false');}


        // special precessing for peer2peer
        // (Go to the select user list when pressed from inside peer2peer)

        if (where == P2P) {
            if (Session.get('page') == P2P || !Session.get('p2pMember')) {
                Session.set('p2pMember', undefined);
                Session.set('p2pView', undefined);
                info.to = where + "-list";
            } else {
                info.to = where + "-chat";
                info.userId = Meteor.userId();
                info.memberId = Session.get('p2pMemberId');
                info.member = Session.get('p2pMember');
                info.team = Session.get('p2pView');
            }
        }
        Log.logAction(Log.LOGACTION_NAVIGATE, info);
        Session.set('page', where);
    }

    render() {

        let navCounts = [0,0,0,0,0];
        let badgeToInx = {};
        badgeToInx[HISTORY] = 0;
        badgeToInx[ANALYTICS] = 1;
        badgeToInx[REPORT] = 2;
        badgeToInx[POST] = 3;
        badgeToInx[P2P] = 4;

        let navLimits = [];

        console.log("*** Render nav bar");


        let participant = this.props.participant;

        console.log("Participant: " + JSON.stringify(participant));
        if (participant && participant.settings && participant.settings.navLimits) {
            navLimits = participant.settings.navLimits.split(',');
        }

        _.forEach(this.props.badges, (badge) => {
            if (badge.type !== this.props.currentPage) {
                // Only bump badge count if not on the page
                navCounts[badgeToInx[badge.type]] += 1;
            } else if (badge.type == P2P) {
                // P2P requires special care.
                // If looking at the conversation list, the badge count can be incremented.
                // If looking at a conversation, the current conversation badge count can't be incremented.
                if (Session.get('p2pMember')) {
                    // a conversation to a member, don't increment that conversation's badge count
                    if (Session.get('p2pView') !== badge.subType) {
                        // current view is not for this badge, so increment the count
                        navCounts[badgeToInx[badge.type]] += 1;
                    }
                } else {
                    // looking at the p2p list, increment count
                    navCounts[badgeToInx[badge.type]] += 1;

                }
            }
        });
        // save the badge counts so the peer to peer can later use them.
        Session.set('badges', JSON.stringify(this.props.badges));

        Session.set('showSize', 10);

        const tabUrls = {
            analytics: ["/navigation-icons/chart.svg", "/navigation-icons/chart-selected.svg"],
            history:["/navigation-icons/history.svg", "/navigation-icons/history-selected.svg"],
            report: ["/navigation-icons/checkmark-white.svg", "/navigation-icons/checkmark-white-selected.svg"],
            posts: ["/navigation-icons/social.svg", "/navigation-icons/social-selected.svg"],
            peer2peer:["/navigation-icons/chat.svg", "/navigation-icons/chat-selected.svg", "/navigation-icons/chat-selected-chatting.svg"]
        }

        function getTabImage(myThis, currentTab, tab, title) {
            let inx = 0;
            if (tab == currentTab) {
                inx = 1;
                /* *** No longer show the different icon in P2P talk mode
                if (tab == P2P && myThis.props.p2pView) {
                    inx = 2;
                }
                */
            }
            if (tabUrls[tab].length > 0) {
                return (
                    <img className={"navigation-image" + (myThis.props.isSilver ? "-v" : "")} src={tabUrls[tab][inx]}/>
                );
            }
            return <span>{title}</span>
        }

        function getBadge(tab, classNamePostfix) {
            let tabC = navCounts[badgeToInx[tab]];
            if (tabC > 0) {
                return (
                    <span className={"nav-badge" + classNamePostfix + " numberCircle" + classNamePostfix}>{tabC}</span>
                );
            }
            return <span></span>
        }

        function getSilverRowClass(currentPage, thisRow) {
            let cn = "nav-tab-img-v";
            cn = cn + " nav-size-" + navLimits.length;

            if (currentPage === thisRow) {
                cn = cn + " selected";
            }

            if (navLimits.indexOf(thisRow) >= 0) {
                cn = cn + " navHide";
            }
            return cn;
        }

        Session.set('holdOffQuestions', _.indexOf(HOLD_OFF_QUESTIONS, this.props.currentPage) >= 0);
        console.log("*** current hold off: " + Session.get('holdOffQuestions'));

        if (Session.get('wait-mode') === 'true') {
            Session.set('wait-mdde', 'false');
        }

        if (this.props.isSilver) {

            return (
            <div className="flex-vbox navigation-left">
                <div className="nav-tab-top">{_i18n.__('hi')} {this.props.displayName.substring(0, Meteor.settings.public.DISPLAY_NAME_SHOW_MAX)}</div>
                <div className="nav-tab-border"></div>
                <div className={getSilverRowClass(this.props.currentPage, HISTORY)} onClick={(e)=>this.pressed(HISTORY)}>
                    {_i18n.__('nav-history')}
                    <div>
                    {getTabImage(this, this.props.currentPage, HISTORY, 'History')}
                    {getBadge(HISTORY, "-v")}
                    </div>
                </div>
                <div className={"nav-tab-border " + getSilverRowClass(this.props.currentPage, HISTORY)}></div>
                <div className={getSilverRowClass(this.props.currentPage, ANALYTICS)}  onClick={(e)=>this.pressed(ANALYTICS)}>
                    {_i18n.__('nav-progress')}
                    <div>
                    {getTabImage(this, this.props.currentPage, ANALYTICS, 'Analytics')}
                    {getBadge(ANALYTICS, "-v")}
                    </div>
                </div>
                <div className={"nav-tab-border " + getSilverRowClass(this.props.currentPage, ANALYTICS)}></div>
                <div className={getSilverRowClass(this.props.currentPage, REPORT)}  onClick={(e)=>this.pressed(REPORT)}>
                    {_i18n.__('nav-report')}
                    <div>
                        {getTabImage(this, this.props.currentPage, REPORT, 'Report')}
                        {getBadge(REPORT, "-v")}
                    </div>
                </div>
                <div className={"nav-tab-border " + getSilverRowClass(this.props.currentPage, REPORT)}></div>
                <div className={getSilverRowClass(this.props.currentPage, POST)}  onClick={(e)=>this.pressed(POST)}>
                    {_i18n.__('nav-team')}
                    <div>
                    {getTabImage(this, this.props.currentPage, POST, 'Posts')}
                    {getBadge(POST, "-v")}
                    </div>
                </div>
                <div className={"nav-tab-border " + getSilverRowClass(this.props.currentPage, POST)}></div>
                <div className={getSilverRowClass(this.props.currentPage, P2P)}  onClick={(e)=>this.pressed(P2P)}>
                    {_i18n.__('nav-chat')}
                    <div>
                    {getTabImage(this, this.props.currentPage,P2P, 'Peer2Peer')}
                    {getBadge(P2P, "-v")}
                    </div>
                </div>
                <div className={"nav-tab-border " + getSilverRowClass(this.props.currentPage, P2P)}></div>
            </div>);
        }
        return (
            <div className="full-100-pct-height">
                <div className="flex-container navigation-border full-100-pct-height">
                    <div className="nav-tab-img" onClick={(e)=>this.pressed(HISTORY)}>
                        {getTabImage(this, this.props.currentPage, HISTORY, 'History')}
                        {getBadge(HISTORY, "nav-badge")}
                    </div>
                    <div className="nav-tab-img"  onClick={(e)=>this.pressed(ANALYTICS)}>
                        {getTabImage(this, this.props.currentPage, ANALYTICS, 'Analytics')}
                        {getBadge(ANALYTICS, "")}
                    </div>
                    <div className="nav-tab-img"  onClick={(e)=>this.pressed(REPORT)}>
                        {getTabImage(this, this.props.currentPage, REPORT, 'Report')}
                        {getBadge(REPORT, "")}
                    </div>
                    <div className="nav-tab-img"  onClick={(e)=>this.pressed(POST)}>
                        {getTabImage(this, this.props.currentPage, POST, 'Posts')}
                        {getBadge(POST, "")}
                    </div>
                    <div className="nav-tab-img"  onClick={(e)=>this.pressed(P2P)}>
                        {getTabImage(this, this.props.currentPage,P2P, 'Peer2Peer')}
                        {getBadge(P2P, "")}
                    </div>
                </div>
            </div>
        );
    }
};

UserNavigation.propTypes = {
    loggedIn: React.PropTypes.bool,
    currentPage: React.PropTypes.string,
    p2pView: React.PropTypes.string,
    badges: React.PropTypes.array,
    isSilver: React.PropTypes.bool,
};

export default UserNavigationContainer = createContainer(({currentPage, isSilver}) => {
    console.log(">>> Create UserNavigationContainer" + " <<<");
    const props = {};
    const handle = Meteor.subscribe('badges', props);
    console.log("Handle: " + JSON.stringify(handle));
    const loading = !handle.ready();
    const myBadges = Badges.find({});
    const listExists = !loading && !!myBadges;
    let participant = undefined;
/*
    const participantHandle = Meteor.subscribe('participants');
    if (Meteor.user()) {
        participant = Participants.findOne({emailAddress: Meteor.user().username});
    }
    const partExists = !!participant;
*/
    console.log("Badges Subscribed, loading :" + loading.toString() + ", exists: " + listExists);
    return {
        loggedIn: true,
        currentPage,
        p2pView: Session.get('p2pView'),
        badges: listExists ? myBadges.fetch() : [],
        isSilver,
        displayName: (Meteor.user() && Meteor.user().profile && Meteor.user().profile.bio && Meteor.user().profile.bio.displayName) ? Meteor.user().profile.bio.displayName : 'anonymous'
    };
}, UserNavigation);


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
