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
import {NavigationHelper} from '/client/lib/client.navigation.helpers';
import {Log} from '/client/log';
import Modal from 'react-modal';
import _ from 'lodash';
import {ProfileHelper} from '/client/lib/client.user.profile.helpers';
import {PostHelper} from '/client/lib/client.post.helpers';
import {BADGE_P2P} from '/lib/api/badges/badges';

class SelectUserInTeam extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.chatMember = {bio: {}};
    }

    getFromNow(lastTime) {
        return moment(lastTime).fromNow();
    }

    showProfile(event, m) {
        event.preventDefault();
        NavigationHelper.showProfile(m.bio, this.props.userId, Log.LOGWHERE_P2P_LIST);
    }

    chooseMember(e, groupName, member) {
        e.preventDefault();
        NavigationHelper.chatWith(groupName, this.props.userId, member.bio.displayName, member.bio.userId,  Log.LOGWHERE_P2P_LIST) ;
    }

    render() {
        const myThis = this;
        const myUserId = Meteor.userId();
        const myLogin = Session.get('defaultLogin');
        let badgeCounts = {};

        // count # badges per conversation.
        _.forEach(this.props.badges, (badge) => {
            if (badge.type == BADGE_P2P) {
                badgeCounts[badge.subType] = 1 + (badgeCounts[badge.subType] ? badgeCounts[badge.subType] : 0);
            }
        });

        function addMember(myThis, m) {
            let groupName = [m.userId, myUserId].sort().join('-');
            let displayName = m.bio.displayName;
            let profilePicture = m.bio.bioImage;

            function getInfoStr(myThis, m) {
                let lastMessage = m.lastMessage || '';
                let lastTime = m.lastMessageTime || moment.now;

                if (lastMessage.length < 1) {return ''}

                if (lastMessage.length > 27) {
                    lastMessage = lastMessage.substr(0, 24) + "...";
                }

                return myThis.getFromNow(lastTime) + ", " + lastMessage;
            }

            function getBadges(team) {
                const badgeCount = badgeCounts[team];
                if (badgeCount && badgeCount > 0) {
                    return (
                        <div className="flex-container">
                            <span className="numberCircle">
                                {badgeCount}
                            </span>
                        </div>
                    );
                }
                return <span></span>;
            }

            return(
            <li className="alternate" key={"team_members_" + (Math.random()*1000).toString()} >
                <div className="social-feed-element">
                    <div className="flex-hbox">
                        <a className="pull-left media-object" target="_blank" onClick={(e) => myThis.showProfile(e, m)}>
                            <img className="media-object" src={profilePicture}>
                            </img>
                        </a>
                        <div className="flex-vbox p2p-select-head-margin full-vw" onClick={(e) => myThis.chooseMember(e, groupName, m)}>
                                <div className="author-title">
                                    {i18n.__('team-member') + ": " + displayName}
                                </div>
                            <div className="muted" >
                                {getInfoStr(myThis, m)}
                            </div>
                        </div>
                        {getBadges(groupName)}
                    </div>
                </div>
            </li>
            );
        }

        function getMembers(myThis, teamList) {
            let members = [];
            if (teamList && teamList.length > 0) {
                _.each(teamList, (member) => {
                    if (member !== myLogin) {
                        members.push(addMember(myThis, member));
                    }
                });
                return members;
            }
            return (
                <div className={'message-list no-teamates-1'}>
                    <div className={'message message-center' + (myThis.props.isSilver ? " is-silver" : "") + " no-teamates-2"}
                         key={Math.floor(Math.random() * 1000).toString()}>
                        {i18n.__('no-teamates-yet')}
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-vbox">
                <div className={"chat-header" + (this.props.isSilver ? " is-silver" : "") } >
                    <div className="flex-container container-center full-100-pct-height">
                        <div className="flex-title-center">{i18n.__('choose-chat') }</div>
                    </div>
                </div>
                <div className="chat-select-list">
                    <ul className="social-feed-list">
                        {getMembers(this, this.props.teamList)}
                    </ul>
                </div>
            </div>
        );
    }
}

SelectUserInTeam.propTypes = {
    userId: React.PropTypes.string,
    teamName: React.PropTypes.string,
    teamList: React.PropTypes.array,
    badges: React.PropTypes.array
};

export default SelectUserInTeamContainer = createContainer(({userId, teamName}) => {
    console.log("Need to fetch team members in: " + teamName)


    Meteor.call("getTeamMembersInfo", userId, teamName, function(err, data) {Session.set('teamList', data); console.log("Set team list: " + JSON.stringify(data))});
    return {
        userId,
        teamName,
        badges: JSON.parse(Session.get('badges')),
        teamList: Session.get('teamList'),
        isSilver: Meteor.settings.public.IS_SILVER,
    };
}, SelectUserInTeam);
