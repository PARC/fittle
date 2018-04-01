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
import {Log} from '/client/log';
import {NavigationHelper} from '/client/lib/client.navigation.helpers';
import {PrivacyHelpers} from '/client/lib/client.privacy.helper';
import {StaticContent} from '/lib/staticContent';
import {SocialHelpers} from '/client/lib/social.helper';
import ReactTooltip from 'react-tooltip'
import Modal from 'react-modal';

class UserPostShow extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    getDisplayName() {
        return this.props.post.source.displayName;

    }

    getDisplayImage() {
        const defaultImage = StaticContent.defaultProfilePictureThumbnail();
        return this.props.post.source ? (this.props.post.source.bioImage || defaultImage) : defaultImage;
    }

    getFromNow() {
        return moment(this.props.post.createdAt).fromNow();
    }

    iLike(likers) {
        if (!likers) {return false;}
        if (!likers instanceof Array) {likers = [likers];}
        //see if the current user is one of them
        let q = _.find(likers, (x) => x.userId == this.props.userId);
        //need to disallow same user that liked to like again
        return q && (q.userId == this.props.userId);
    }

    likeCheck(event) {
        event.preventDefault();
        //get this posts array of likers
        let res = this.props.post.likers;
        if (!res) {res = [];}
        //see if the current user is one of them
        let q = _.find(res, (x) => x.userId == this.props.userId);
        //need to disallow same user that liked to like again
        if (q && q .userId == this.props.userId) {
            Posts.update({_id: this.props.post._id},
                {$inc: {likes: -1},
                 $pull: {likers: {userId: this.props.userId}}
                });
            Log.logAction(Log.LOGACTION_UNLIKE_POST, {postId: this.props.post._id, where: Log.LOGWHERE_POST});
        } else {
            let liker = {userId: this.props.userId, displayName: PrivacyHelpers.getDisplayNameForLoggedInUser()};
            Posts.update({_id: this.props.post._id}, {$inc: {likes: 1},
                $push: {likers: liker}
            });
            Log.logAction(Log.LOGACTION_LIKE_POST, {postId: this.props.post._id, where: Log.LOGWHERE_POST});
        }
    }

    openComment(event) {
        event.preventDefault();
        this.props.chooseComment(this.props.post);
    }

    commentExpand(e) {
        e.preventDefault();
        let expandComments = Session.get(this.props.post._id+'_expandComments') == this.props.post._id;
        if (expandComments) {
            Session.set(this.props.post._id+'_expandComments', undefined);
            Log.logAction(Log.LOGACTION_HIDE_COMMENTS, {postId: this.props.post._id, where: Log.LOGWHERE_POST});
        } else {
            Session.set(this.props.post._id+'_expandComments', this.props.post._id)
            Log.logAction(Log.LOGACTION_SHOW_COMMENTS, {postId: this.props.post._id, where: Log.LOGWHERE_POST});
        }
        this.setState({ key: Math.random() });
    }

    showProfile(event) {
        event.preventDefault();
        if (!this.props.commenting) {
            NavigationHelper.showProfile(this.props.post.source, this.props.userId, Log.LOGWHERE_POST);
        }
    }

    showImage(event, inx) {
        event.preventDefault();
        let url = this.props.post.images[inx];
        // default to icon if full image not yet available
        if (url && url.length < 10) {
            url = this.props.post.icons[inx]
        }
        NavigationHelper.showImage(this.props.userId, Log.LOGWHERE_POST, url, inx, this.props.post.postId);
    }

    render() {

        function doILikeIt(likers, userId) {
                let q = _.find(likers, (x) => x.userId == userId);
            return q && (q.userId == userId);
        }

        function doICommentIt(comments, userId) {
            return _.find(comments, function (o) {
                return o.source.userId == userId;
            });
        }

        let showImages = <span></span>
        const myThis = this;

        if (this.props.post.images && this.props.post.images.length > 0) {
            showImages =
                <div className="media-image">
                            {this.props.post.icons.map(function (img, inx) {
                                return <div key={(inx +  Math.floor(Math.random() * 1000)).toString()} >
                                    <button type="button" className="btn btn-link show-image"
                                            value={inx}
                                            onClick={(e)=>myThis.showImage(e, inx)}
                                    >
                                        <img src={img} alt="Image still loading ..."/>
                                    </button>
                                </div>
                            })}
                </div>
        }

        let iLikeName = "post-like";
        if (this.iLike(this.props.post.likers)) {
            iLikeName = "post-unlike";
        }

        let footerBar = [];
        let hasLikes = this.props.post.likers && this.props.post.likers.length > 0;
        let hasComments = this.props.post.comments && this.props.post.comments.length > 0;
        let hasCommentsExpanded = (hasComments && Session.get(this.props.post._id + '_expandComments') == this.props.post._id) || this.props.commenting;
        let iComment = false;
        let likedBy = '';
        let commentedBy = '';
        let commentTriangle = '';
        let commentStr = '';
        let likesStr = '';

        function genToolTip(likeStr, commentStr) {
            let res =
                '<div class="flex-hbox tool-tip-hbox"  >' +
                    "<div  class='tooltip-font'>" +
                        likeStr +
                        commentStr +
                    "</div>" +
                    '<div class="modal-exit-check-float">' +
                        '<img  src="/navigation-icons/close-button-big.svg" >' +
                        '</img>' +
                    '</div>' +
                "</div>";
            return res;
        }

        if (hasComments) {
            commentTriangle =
                <div className="flex-item"  onClick={(e) => this.commentExpand(e)}>
                    <img className="post-triangle-img" src={hasCommentsExpanded ? "social-media-icons/triangle-down.svg" : "social-media-icons/triangle-right.svg"}></img>
                    &nbsp;&nbsp;
                </div>;

            commentedBy = i18n.__("commented-by") + ": <div class='tooltip-names'>";

            let commentCount = this.props.post.comments.length;
            let commentInfoStr = commentCount > 1
                ? i18n.__('post-lc-comments')
                : i18n.__('post-lc-comment');
            if (hasLikes) {
                commentInfoStr += ",";
            }
            commentStr =
                <div className="flex-item"  >
                    {commentCount}&nbsp;{commentInfoStr}&nbsp;&nbsp;
                </div>;
            let br = "";
            _.forEach(this.props.post.comments, (value, key) => {
                if (value.source.userId !== this.props.userId) {
                    commentedBy += br + value.source.displayName;
                } else {
                    commentedBy += br + i18n.__("post-you");
                    iComment = true;
                }
                br = "<br/>";
            });

            commentedBy += "</div>";
        }

        if (hasLikes) {
            likedBy = i18n.__("applauded-by") + ": <div class='tooltip-names'>";
            let br = "";
            _.forEach(this.props.post.likers, (value, key) => {
                if (value.userId !== this.props.userId) {
                    likedBy += br + value.displayName;
                } else {
                    likedBy += br + i18n.__("post-you");
                }
                br = "<br/>";
            });
            if (likedBy.length > 0 && commentedBy.length > 0) {
                likedBy += "<br/>";
            }
            let likeCnt = this.props.post.likers.length;
            let likeStr = this.props.post.likers.length.toString();

            likesStr =
                <div className="flex-item"> {likeStr + " " + i18n.__('post-applauded')}
                </div>;
            likedBy += "</div>"
        }

        let expandedView = "";

        if (hasCommentsExpanded) {
            expandedView =
                <UserPostCommentsShowContainer
                    post={this.props.post}
                    comments={this.props.post.comments}
                    commentsLikes={[]}
                    userId={this.props.userId}
                    hideApplause={this.props.commenting}
                >
                </UserPostCommentsShowContainer>
            ;
        }

        let footer = "";

        if (hasLikes || hasComments) {
           footer =
                <div className="media-footer flex-vbox" key="{this.state.key}">
                    <div className="flex-hbox left social-feed-comment-likes-label">
                        {commentTriangle}
                        <div data-tip={genToolTip(likedBy, commentedBy)} data-html={true}>
                            {commentStr}
                            {likesStr}
                        </div>
                    </div>
                    {expandedView}
                </div>;
        }

        return (

            <div className="social-feed-element">
                <div className="flex-hbox">
                    <a className="media-box" target="_blank" onClick={(e) => this.showProfile(e)}>
                        <img className="media-img" src={this.getDisplayImage()}>
                        </img>
                    </a>
                    <div className="media-head">
                        <div>
                            <div className="author-title">
                                {this.getDisplayName()}
                            </div>
                            <div className="muted pull-left social-feed-ago-text">
                                {this.getFromNow()}
                            </div>
                        </div>
                    </div>
                    { (!this.props.commenting) &&
                        <div className="flex-hbox icons">
                            <img className="media-object"
                                 src={iComment ?  "social-media-icons/comment.svg" :  "social-media-icons/comment-no-comment.svg" }
                                 onClick={(e) => this.openComment(e)}>
                            </img>
                            <img className="media-object" src={this.iLike(this.props.post.likers) ? "social-media-icons/applaud.svg" : "social-media-icons/un-applaud.svg"} onClick={(e) => this.likeCheck(e)}>
                            </img>
                        </div>
                    }
                </div>
                <div className="media-body">
                    {SocialHelpers.fixTextCr(this.props.post.text)}
                </div>

                {showImages}

                {footer}

                <ReactTooltip effect={'solid'} />

            </div>
        );
    }
}

UserPostShow.propTypes = {
    post: React.PropTypes.object,
    userId: React.PropTypes.string,
    commenting: React.PropTypes.bool
};

export default UserPostShowContainer = createContainer(({post, userId, commenting}) => {
    return {
        post,
        userId,
        commenting,
    };
}, UserPostShow);
