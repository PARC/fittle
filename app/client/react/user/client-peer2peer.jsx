/**
 * Created by krivacic on 3/22/2017.
 */
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import SelectUserInTeamContainer from '/client/react/peer-2-peer/select-user-in-team.jsx';
import Peer2PeerShowContainer from '/client/react/peer-2-peer/peer-2-peer-show.jsx';


class Peer2Peer extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        function pickView(myThis) {
            if (myThis.props.p2pTeam && myThis.props.p2pMemberDisplayName) {
                return <Peer2PeerShowContainer userId={myThis.props.userId} team={myThis.props.p2pTeam} p2pMemberUserId={myThis.props.p2pMemberUserId} peerDisplayName={myThis.props.p2pMemberDisplayName} />
            } else {
                return <SelectUserInTeamContainer userId={myThis.props.userId} teamName="lobby" />
            }
        }
        return (
            <div className="">
                {pickView(this)}
            </div>
        );
    }
};

Peer2Peer.propTypes = {
    userId: React.PropTypes.string,
    p2pTeam: React.PropTypes.string,
    p2pMemberDisplayName: React.PropTypes.string,
    p2pMemberUserId: React.PropTypes.string,
};

export default Peer2PeerContainer = createContainer(() => {
    let userId = Meteor.userId();
    return {
        userId,
        p2pTeam: Session.get('p2pView'),
        p2pMemberDisplayName: Session.get('p2pMember'),
        p2pMemberUserId: Session.get('p2pMemberId')
    };
}, Peer2Peer);


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
