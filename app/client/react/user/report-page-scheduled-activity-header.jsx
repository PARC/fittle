/**
 * Created by krivacic on 4/3/2017.
 */
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Tasks} from '/lib/api/tasks/tasks.js';
import {DateHelper} from '/lib/helpers';

class ReportPageScheduledActivityHeader extends React.Component {
    constructor() {
        super();
        console.log(">>> Create ReportPageScheduledActivityHeader <<<");
        this.state = {};
    }

    render() {
        return (
                <div className="report-header">
                    <div className="flex-container container-center full-100-pct-height">
                        <div className="flex-title-center"> {this.props.dayOfWeek}, {this.props.currentDate} </div>
                    </div>
                </div>
        );
    }
};

ReportPageScheduledActivityHeader.propTypes = {
    dayOfWeek: React.PropTypes.string,
    currentDate: React.PropTypes.string
};

export default ReportPageScheduledActivityHeaderContainer = createContainer(() => {
    return {
        dayOfWeek: DateHelper.reactiveLocalizedNowWithFormat('dddd'),
        currentDate: DateHelper.reactiveLocalizedNowWithFormat('DD MMM YYYY'),
    };
}, ReportPageScheduledActivityHeader);


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
