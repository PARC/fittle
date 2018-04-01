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
                        <div className="flex-title-center"> {this.props.dayOfWeek}, {this.props.currentDate} {Session.get('currentDay')}</div>
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
