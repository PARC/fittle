/**
 * Created by krivacic on 3/22/2017.
 */

/*
 * Component to show one post in a list of posts
 */

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Log} from '/client/log';
import {NavigationHelper} from '/client/lib/client.navigation.helpers';
import {PrivacyHelpers} from '/client/lib/client.privacy.helper';
import {StaticContent} from '/lib/staticContent'
import {SocialHelpers} from '/client/lib/social.helper';

import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip'


class UserCommentShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getDisplayName() {
        return this.props.comment.source.displayName;

    }

    getDisplayImage() {
        return this.props.comment.source.bioImage || StaticContent.defaultProfilePictureThumbnail();
    }

    iLike(likers) {
        if (!likers) {return false;}
        if (!likers instanceof Array) {likers = [likers];}
        //see if the current user is one of them
        let q = _.find(likers, (x) => x.userId == this.props.userId);
        //need to disallow same user that liked to like again
        return q && (q.userId == this.props.userId);
    }

    doILikeIt() {
        let likers = this.props.comment.likers;
        if (!likers) {return false;}
        if (!likers instanceof Array) {likers = [likers];}
        //see if the current user is one of them
        let q = _.find(likers, (x) => x.userId == this.props.userId);
        //need to disallow same user that liked to like again
        return q && (q.userId == this.props.userId);
    }

    applaudText() {
        let iLike = this.doILikeIt();
        let likeCount = this.props.comment.likers.length;
        let myText = "";
        let likedBy = "";
        if (likeCount > 0) {
            myText = likeCount;

            likedBy = i18n.__("applauded-by")  + ": <div class='tooltip-names'>";
            let br = "";
            _.forEach(this.props.comment.likers, (value, key) => {
                if (value.userId !== this.props.userId) {
                    likedBy += br + value.displayName;
                    console.log("Liker:" + JSON.stringify(value));
                } else {
                    likedBy += br + i18n.__("post-you");
                }
                br = "<br/>";
            });
            likedBy += "</div>"
        }

        if (likeCount > 0) {
            myText = likeCount + " " + i18n.__('post-applauded');
        }
        this.likedBy = likedBy;
        return myText;
    }

    likeCheck(event) {
        event.preventDefault();
        //get this posts array of likers
        let res = this.props.comment.likers;
        if (!res) {res = [];}
        //see if the current user is one of them
        let q = _.find(res, (x) => x.userId == this.props.userId);
        //need to disallow same user that liked to like again
        if (q && q .userId == this.props.userId) {
            Meteor.call('removeLikerFromComment', this.props.post._id, this.props.comment._id, this.props.userId);
            Log.logAction(Log.LOGACTION_UNLIKE_COMMENT, {postId: this.props.post._id, commentId: this.props.comment._id, where: Log.LOGWHERE_POST_COMMENT});
        } else {
            let liker = {userId: this.props.userId, displayName: PrivacyHelpers.getDisplayNameForLoggedInUser()};
            Meteor.call('addLikerToComment', this.props.post._id, this.props.comment._id, liker);
            Log.logAction(Log.LOGACTION_LIKE_COMMENT, {postId: this.props.post._id, commentId: this.props.comment._id, where: Log.LOGWHERE_POST_COMMENT});
        }
    }

    showProfile(event) {
        event.preventDefault();
        if (!this.props.hideApplause) {
            NavigationHelper.showProfile(this.props.comment.source, this.props.userId, Log.LOGWHERE_POST_COMMENT);
        }
    }

    render() {

        let iLikeName = "post-like";
        if (this.iLike(this.props.comment.likers)) {
            iLikeName = "post-unlike";
        }

        let applaudText = this.applaudText();

        function genToolTip(likedList) {
            let res =
                "<div>" +
                '<div class="modal-exit-check">' +
                '<img  src="/navigation-icons/close-button-big.svg" >' +
                '</img>' +
                '</div>' +
                "<div  class='tooltip-font'>" +
                likedList +
                "</div>" +
                "</div>";
            return res;
        }

        return (

            <div className="social-feed-comment-element">
                <div className="flex-hbox">
                    <a className="media-box" target="_blank" onClick={(e) => this.showProfile(e)}>
                        <img className="media-img" src={this.getDisplayImage()}>
                        </img>
                    </a>
                    <div className="media-head">
                        <div className="flex-hbox flex-align-items-center">
                            <div className="author-title">
                                {this.getDisplayName()}
                            </div>
                            <div className="pull-right post-comment-applaud-div">
                                <div className="post-comment-applaud"
                                     data-tip={genToolTip(this.likedBy)}  data-html={true} >
                                    {applaudText}
                                </div>
                            </div>
                        </div>
                        <div className="muted pull-left  social-feed-comment-text">
                            {SocialHelpers.fixTextCr(this.props.comment.comment)}
                        </div>
                    </div>
                    <div className="flex-hbox icons">
                        { (!this.props.hideApplause) &&
                            <img className="media-object"
                                 src={this.iLike(this.props.comment.likers) ? "social-media-icons/applaud.svg" : "social-media-icons/un-applaud.svg"}
                                 onClick={(e) => this.likeCheck(e)}>
                            </img>
                        }
                    </div>
                </div>
                <ReactTooltip effect={'solid'}/>
            </div>
        );
    }
}

UserCommentShow.propTypes = {
    post: React.PropTypes.object,
    comment: React.PropTypes.object,
    hideApplause: React.PropTypes.bool,
    userId: React.PropTypes.string,
};

export default UserCommentShowContainer = createContainer(({post, comment, userId, hideApplause}) => {
    return {
        post,
        comment,
        userId,
        hideApplause,
    };
}, UserCommentShow);
