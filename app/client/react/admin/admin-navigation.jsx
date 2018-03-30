/**
 * Created by krivacic on 3/22/2017.
 */
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';



class AdminNavigation extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    pressed(where) {
        console.log("GoTo " + where);
        Session.set('page', where);
    }

    render() {

        function getSelected(currentTab, tab) {
            console.log("Check tab " + tab + ', current: ' + currentTab);
            if (tab == currentTab) {
                console.log("Fount tab " + tab);
                return "admin-selected";
            }
            return "";
        }
        
        return (
            <div className="container full-vw">
                <div className="flex-container">
                    <div className={getSelected(this.props.currentPage, 'admin-schedule')} onClick={(e)=>this.pressed('admin-schedule')}>
                        Schedule
                    </div>
                    <div className={getSelected(this.props.currentPage, 'admin-participants')} onClick={(e)=>this.pressed('admin-participants')}>
                        Participants
                    </div>
                    <div className={getSelected(this.props.currentPage, 'admin-questions')} onClick={(e)=>this.pressed('admin-questions')}>
                        Questions
                    </div>
                    <div className={getSelected(this.props.currentPage, 'admin-tasks')} onClick={(e)=>this.pressed('admin-tasks')}>
                        Tasks
                    </div>
                    <div className={getSelected(this.props.currentPage, 'admin-teams')} onClick={(e)=>this.pressed('admin-teams')}>
                        Teams
                    </div>
                    <div className={getSelected(this.props.currentPage, 'admin-logs')} onClick={(e)=>this.pressed('admin-logs')}>
                        Logs
                    </div>
                </div>
            </div>
        );
    }
};

AdminNavigation.propTypes = {
    loggedIn: React.PropTypes.bool,
    currentPage: React.PropTypes.string,
};

export default AdminNavigationContainer = createContainer(() => {
    console.log(">>> Create AdminNavigationContainer" + " <<<");

    return {
        loggedIn: true,
        currentPage: Session.get('page'),
    };
}, AdminNavigation);


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
