/**
 * Created by lnelson on 3/22/2017.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import AdminQuestionShow from './client-admin-question-show.jsx';
import {Questions} from '/lib/api/questions/questions';


class AdminQuestionsShow extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (

            <div className="subcontainer">
                <table className="admin-table">
                    <tbody>

                    <tr>
                        <th>User</th>
                        <th>Question</th>
                        <th>Tag</th>
                        <th>Ask Datetime</th>
                        <th>Expire Datetime</th>
                        <th>Answer</th>
                        <th>Date</th>
                        <th>Sequence Name</th>
                        <th>Sequence</th>
                    </tr>

                    {this.props.questions.map((question, index) =>
                        <AdminQuestionShow key={index} question={question}/>
                    )}

                    </tbody>
                </table>
            </div>
        );
    }
}

AdminQuestionsShow.propTypes = {
    questions: React.PropTypes.array,
    loading: React.PropTypes.bool,
    listExists: React.PropTypes.bool
};

export default AdminQuestionsShowContainer = createContainer(({showForUser}) => {
    // Get Questions
    const questionsHandle = Meteor.subscribe('questions');
    const loading = !questionsHandle.ready();
    const props = {showForUser};
    let myQuestions = null;
    if (props.showForUser) {
        myQuestions = Questions.find({username: props.showForUser}, {sort: {createdAt: -1}});
    } else {
        myQuestions = Questions.find({}, {sort: {createdAt: -1}});
    }
    const count = myQuestions.count();
    console.log("Subscribed, loading " + count + " questions: " + loading.toString());
    const listExists = !loading && !!myQuestions;

    return {
        loading,
        questions: listExists ? myQuestions.fetch() : [],
        listExists,
    };
}, AdminQuestionsShow);

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
 