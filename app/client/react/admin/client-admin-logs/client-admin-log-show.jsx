/**
 * Created by lnelson on 3/22/2017.
 */

/*
 * Component to show one post in a list of posts
 */


import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import moment from 'moment-timezone';


function localizedDateAndTimeFromUnix(value) {
    if (value) {
        var dateString = moment(value).format("MM/DD/YYYY HH:mm:ss");
        return dateString;
    }
    return value;
}

class AdminLogShow extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    getUser() {
        return this.props.item.emailAddress;
    }

    render() {

        return (

            <tr>
                <td>
                    {localizedDateAndTimeFromUnix(this.props.item.timeStamp)}
                </td>
                <td>
                    {this.props.item.userId}
                </td>
                <td>
                    {this.props.item.logType}
                </td>
                <td>
                    {this.props.item.message}
                </td>
                <td>
                    {JSON.stringify(this.props.item.logData)}
                </td>
            </tr>
        );
    }
}

AdminLogShow.propTypes = {
    question: React.PropTypes.object,
    userId: React.PropTypes.string,
    isRegistered: React.PropTypes.string,
};

export default AdminLogShowContainer = createContainer(({item, userId}) => {
    return {
        item,
        userId
    };
}, AdminLogShow);


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
