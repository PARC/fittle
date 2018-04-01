/**
 * Created by lnelson on 3/22/2017.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import moment from 'moment-timezone';
import {Meteor} from 'meteor/meteor';
import {Tasks} from '/lib/api/tasks/tasks';
import {Activities} from '/lib/api/activities/activities';

/**
 * My utility function
 * @param needle
 * @param haystack
 * @returns {boolean}
 */


function isNotIn(needle, haystack) {
    for (var ix = 0; ix < haystack.length; ix++) {
        if (needle === haystack[ix])
            return false;
    }
    return true;
}

function safeTrim(str) {
    try {
        return str.trim()
    } catch (err) {
        console.log('Error in trimming string ' + str + ' ' + err.message);
        return str
    }
}

class AdminTaskNew extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    //Access Methods for Collection attributes

    getOption(user) {
        return user.username
    }
    getActivity(activity) {
        return activity.activity
    }

    localizedToday() {
        return moment(new Date()).format('l');
    }

    getTaskTitles() {
        let qFind = this.props.items;
        let q;
        let qset = [];
        for (var ix = 0; ix < qFind.length; ix++) {
            q = qFind[ix];
            if (q && q.hasOwnProperty('title') && isNotIn(q.title, qset)) {
                let qToPush = safeTrim(q.title);
                if (qToPush)
                    qset.push(q.title)
            }
        }
        qset.sort();
        return qset
    }


    // Event processing
    submission(event) {
        event.preventDefault();

        // Get value from form element
        let activityTitle = event.target.activityTitle.value;
        let pretext = event.target.pretext.value;
        let taskText = activityTitle ? activityTitle : pretext;
        let when = event.target.when.value;
        let username = event.target.username.value;
        let contentLink = event.target.contentLink.value;

        // Insert a task into the collection
        Meteor.call("addTask", taskText, when, username, contentLink);

        // Clear form
        event.target.activityTitle.value = "";

    }


    render() {
        return (
            <div className="subcontainer">
                <form className="new-question"
                      onSubmit={(e) => this.submission(e)}>
                    <label htmlFor="activityTitle">Describe the activity (if more description needed): </label>
                    <input type="text"
                           id="activityTitle"
                           name="activityTitle"
                           placeholder="Select an activity or type one in here"/>
                    <select name="pretext" id="pretext">
                        <option value=""></option>
                        {this.getTaskTitles().map((txt, index) =>
                            <option key={index}>{txt}</option>
                        )}
                    </select>
                    <br/>
                    <label htmlFor="when">When to do: </label>
                    <input type="date" id="when" name="when" defaultValue="28" />
                    <br/>
                    <label htmlFor="username">For Who: </label>
                    <select name="username">
                        <option value="">Select a user</option>
                        {this.props.users.map((user, index) =>
                            <option key={index}>{this.getOption(user)}</option>
                        )}
                    </select>
                    <br/>
                    <label htmlFor="scontent">What content: </label>
                    <select id="scontent" name="contentLink">
                        <option value="">Select from an activity</option>
                        {this.props.activities.map((activity, index) =>
                            <option key={index}>{this.getActivity(activity)}</option>
                        )}
                    </select>

                    <br/>
                    <input type="submit" value="Add Task"/>
                </form>
            </div>
        );
    }
}

AdminTaskNew.propTypes = {
    questions: React.PropTypes.array,
    loading: React.PropTypes.bool,
    listExists: React.PropTypes.bool
};

export default AdminTaskNewContainer = createContainer(({users}) => {
    // Get Tasks
    const questionsHandle = Meteor.subscribe('questions');
    const loading = !questionsHandle.ready();
    let myTasks = Tasks.find({}, {sort: {createdAt: -1}});
    const count = myTasks.count();
    console.log("Subscribed, loading " + count + " questions: " + loading.toString());
    const listExists = !loading && !!myTasks;

    const activitiesHandle = Meteor.subscribe('activities');
    const aloading = !activitiesHandle.ready();
    let myActivities = Activities.find({});
    const acount = myActivities.count();
    console.log("Subscribed, loading " + acount + " activities: " + aloading.toString());
    const alistExists = !aloading && !!myActivities;

    return {
        loading,
        items: listExists ? myTasks.fetch() : [],
        listExists,
        aloading,
        activities: alistExists ? myActivities.fetch() : [],
        alistExists,
    };
}, AdminTaskNew);

/* */