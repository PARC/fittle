/**
 * Created by krivacic on 3/22/2017.
 */
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import UserPostShow from './client-user-post-show.jsx';
import {Posts} from '/lib/api/posts/posts';
import _ from 'lodash';
import {DateHelper} from '/lib/helpers';
import {PostHelper} from '/client/lib/client.post.helpers';
import {Log} from '/client/log';

class UserPostsShow extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    getSender(post) {
        console.log("post sender: " + this.props.senderEmailAddress);
        return this.props.senderEmailAddress;
    }

    setCommentPost(post) {
        console.log("Set comment post to: ");
        this.props.setCommentPost(post);
    }

    seeMore(e) {
        e.preventDefault();
        Session.set('showSize', Session.get('showSize') + PostHelper.DEFAULT_POST_SCROLL);
        Session.set("scroll-to-bottom", true);
        Log.logAction(Log.LOGACTION_POST_MORE, {team: this.props.team, where: Log.LOGWHERE_POST});
    }

    render() {
        const myThis = this;
        console.log("List posts, commenting: " + this.props.commentingPost);
        if (this.props.commentPost) {console.log(", post: " + this.props.commentingPost._id);}

        let moreButton = null;
        if (Session.get('showSize') < this.props.postsSize) {
            if (this.state.commenting) {
                // no more when commenting
            } else {
                let hasMore = this.props.posts.length < this.props.postsSize;
                if (hasMore) {
                    moreButton =
                        <li className="alternate">
                            <div className="flex-vbox social-feed-element" onClick={(evt)=>this.seeMore(evt)} type="button">
                                <button className="btn btn-submit flex-center" id="scroll-bottom">
                                    {i18n.__('post-paging-showing') + " " +
                                    this.props.posts.length + " " +
                                    i18n.__('post-paging-of') + " " +
                                    this.props.postsSize + ", " +
                                    i18n.__('button-see-more')
                                    }
                                </button>
                            </div>
                        </li>;
                } else {
                    moreButton =
                        <li className="alternate">
                            <div className="flex-vbox social-feed-element">
                                <div className="flex-center" id="scroll-bottom">
                                    {i18n.__('post-paging-end')}
                                </div>
                            </div>
                        </li>;

                }
            }
        }

        return (
            <div className="flex-vbox">
                <div className={"chat-header" + (this.props.isSilver ? " is-silver" : "") } >
                    <div className="flex-container container-center full-100-pct-height">
                        <div className="flex-title-center">{this.props.dayOfWeek}, {this.props.currentDate}</div>
                    </div>
                </div>
                <ul className={"social-feed-list " + (this.props.isSilver ? "" : "social-feed-nav-padding") + " social-feed-header-padding social-feed-post-line-padding"} >
                    {_.filter(this.props.posts, function (post) {
                        return (myThis.props.commentingPost._id == undefined || (myThis.props.commentingPost._id == post._id))
                    }).map(function(post) {
                        return (
                                <li className="alternate"
                                    key={JSON.stringify(post) + Math.floor(Math.random() * 1000).toString()}>
                                    <UserPostShow post={post} userId={myThis.props.userId}
                                                  senderEmailAddress={myThis.getSender()}
                                                  chooseComment={(p) => myThis.setCommentPost(p)}
                                                  commenting={myThis.props.commentingPost._id == post._id}
                                    />
                                </li>
                        )
                        })
                    }
                    {moreButton}
                </ul>
            </div>
        );
    }
}

UserPostsShow.propTypes = {
    posts: React.PropTypes.array,
    loading: React.PropTypes.bool,
    listExists: React.PropTypes.bool,
    userId: React.PropTypes.string,
    commentingPost: React.PropTypes.object
};

export default UserPostsShowContainer = createContainer(({userId, team, limit, setCommentPost, commentingPost}) => {
    console.log(">>> Create PostsShowContainer" + " <<<");
    const props = {team, limit, viewName:'latestTeamPosts'};
    console.log("Props:" + JSON.stringify(props));
    const postsHandle = Meteor.subscribe('posts', props);
    const loading = !postsHandle.ready();
    const myPosts = Posts.find({deleted: false}, {sort: {createdAt: -1}})
    console.log("Subscribed, loading :" + loading.toString());
    const listExists = !loading && !!myPosts;
    return {
        loading,
        posts: listExists ? myPosts.fetch() : [],
        listExists,
        userId,
        setCommentPost,
        commentingPost,
        dayOfWeek: DateHelper.localizedNowWithFormat('dddd'),
        currentDate: DateHelper.localizedNowWithFormat('DD MMM YYYY'),
        isSilver: Meteor.settings.public.IS_SILVER,
        team,
    };
}, UserPostsShow);