/**
 * Created by krivacic on 3/22/2017.
 */
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import UserPostShow from './client-user-post-show.jsx';
import {Posts} from '/lib/api/posts/posts';

class UserPostCommentsShow extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        let comments = this.props.comments || [];
        console.log("Render comments: " + comments);
        return (
            <div className="social-feed-comments">
                <ul className="social-feed-comment-list">
                    {_.map(comments, (comment, index) =>
                        <li key={index}>
                            <UserCommentShowContainer post={this.props.post} comment={comment} userId={this.props.userId} hideApplause={this.props.hideApplause}/>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

UserPostCommentsShow.propTypes = {
    post: React.PropTypes.object,
    comments: React.PropTypes.array,
    commentsLikes: React.PropTypes.array,
    hideApplause: React.PropTypes.bool,
    userId: React.PropTypes.string
};

export default UserPostCommentsShowContainer = createContainer(({post, userId, hideApplause}) => {
    console.log(">>> Create UserPostsCommentsShowContainer" + " <<<");
    console.log("   comments: " + post.comments);
    return {
        post,
        comments: post.comments,
        commentsLikes: post.commentsLikes,
        hideApplause,
        userId
    };
}, UserPostCommentsShow);

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
