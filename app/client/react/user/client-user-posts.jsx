/**
 * Created by krivacic on 3/22/2017.
 */
import React, { Component } from 'react';
import ReactDom from "react-dom";
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import UserPostsShowContainer from './client-user-posts-show.jsx';
import UserPostShowContainer from './client-user-post-show.jsx';
import {Posts} from '/lib/api/posts/posts';
import {PostHelper} from '/client/lib/client.post.helpers';
import {Log} from '/client/log';
import Badges from '/lib/api/badges/badges.js';
import {BADGE_POST} from '/lib/api/badges/badges';

let readSingleImageAndInsert = PostHelper.readSingleImageAndInsert;

var FileUpload = React.createClass({

    handleFile: function(e) {
        var reader = new FileReader();
        var file = e.target.files[0];

        if (!file) return;

        reader.onload = function(img) {
            ReactDom.findDOMNode(this.refs.in).value = '';
            this.props.handleFileChange(img.target.result);
        }.bind(this);
        reader.readAsDataURL(file);
    },

    render: function() {
        return (
            <input className="profile-file-chooser" ref="in" type="file" accept="image/*" onChange={this.handleFile} />
        );
    }
});

function updateTeamInfo(teamSelectName) {
    if (!teamSelectName || teamSelectName=='none') {
        // **** TODO:  this is debug stuff to get going without a team.
        teamSelectName = 'lobby';
    }
    Session.set('team', teamSelectName);

    return teamSelectName;
};

function getPostsCount(team) {
    Meteor.call('postsCount', team, function (err, data) {
        if (err) {
        } else {
            if (Session.get('postsSize') !== data) {
                // Only set if it changed or get reactive loop
                Session.set('postsSize', data);
            }
        }
    });
}

class UserPosts extends React.Component {
    constructor() {
        super();
        this.state = {postEnable: false, expandPost: false, fileEnable: true, commentingPost:{}, images:[]};
        this.images = [];
        this.postString = "";
        this.commentString = "";
    }

    addImage(imageUri) {
        this.images.push(imageUri);
        const listItems = this.images.map((img, inx) =>
            <img className="flex-item"
                 width="auto"
                 height="50"
                 key={inx.toString()}
                 src={img}
            >
            </img>
        );
        this.setState({images: listItems});
        this.enableCheck();
    }

    processImage(myThis, imageUri) {
        // Do something
        myThis.imageUri = "data:image/jpeg;base64," + imageUri;
        myThis.addImage(myThis.imageUri);
    }

    handleFileChange(imageUri) {
        this.imageUri = imageUri;
        this.addImage(imageUri);
    }

    submitPost(event) {
        event.preventDefault();

        if (!this.state.postEnable) {
            return;
        }

        const target = event.currentTarget;
        const text = this.postString;
        let imageUri = undefined;
        if (this.images && this.images.length > 0) {imageUri = this.images[0];}
        readSingleImageAndInsert(imageUri, this.props.senderEmailAddress, this.props.userId, text, this.props.team);
        Log.logAction(Log.LOGACTION_SUBMIT_POST, {text: event.target.value, team: this.props.team, where: Log.LOGWHERE_POST});
        Meteor.call('createBadgeNotifications', this.props.userId, this.props.userId, Badges.BADGE_POST, this.props.team, {}, _.noop);
        this.postString = "";
        this.images = [];
        this.textArea.value = '';
        this.setState({postEnable: false, expandPost: false, images:[], fileEnable: true});
    }

    cancelPost(event) {
        if (event) event.preventDefault();

        Log.logAction(Log.LOGACTION_POST_CANCEL, {where: Log.LOGWHERE_POST});
        this.postString = "";
        this.images = [];
        this.commentString = "";
        if (this.commentArea) {this.commentArea.value = '';}
        if (this.textArea) {this.textArea.value = '';}
        this.setState({postEnable: false, expandPost: false, images:[], fileEnable: true, commentEnable: false, commenting: false, commentingPost: {}});
    }

    setOptions(srcType) {
        var options = {
            // Some common settings are 20, 50, and 100
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            //destinationType: Camera.DestinationType.IMAGE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true  //Corrects Android orientation quirks
        }
        return options;
    }

    openCamera(e, selection) {
        var srcType = Camera.PictureSourceType.CAMERA;
        var options = this.setOptions(srcType);
        var myThis = this;

        Log.logAction(Log.LOGACTION_CAMERA_OPEN, {where: Log.LOGWHERE_POST});
        navigator.camera.getPicture(function cameraSuccess(imageUri) {
            myThis.processImage(myThis, imageUri);
            Log.logAction(Log.LOGACTION_CAMERA_DONE, {where: Log.LOGWHERE_POST});
        }, function cameraError(error) {
            Log.logAction(Log.LOGACTION_CAMERA_CANCEL, {where: Log.LOGWHERE_POST});
        }, options);
    }

    openFilePicker(e, selection) {
        var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        var options = this.setOptions(srcType);
        var myThis = this;

        Log.logAction(Log.LOGACTION_FILE_OPEN, {where: Log.LOGWHERE_POST});
        navigator.camera.getPicture(function cameraSuccess(imageUri) {
            myThis.processImage(myThis, imageUri);
            Log.logAction(Log.LOGACTION_FILE_CLOSE, {where: Log.LOGWHERE_POST});
        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
            Log.logAction(Log.LOGACTION_FILE_CANCEL, {where: Log.LOGWHERE_POST});
        }, options);
    }

    inputPressed(d) {
        if (!this.state.expandPost) {
            Session.set('keyboard-just-closed', 'false');
            this.setState({expandPost: true});
            Log.logAction(Log.LOGACTION_POST_EXPAND, {where: Log.LOGWHERE_POST});
        }
    }

    enableCheck() {
        const newPostEnable = this.postString.length > 0 || this.images.length > 0;
        const newCommentEnable = this.commentString.length > 0;
        const newFileEnable = this.images && this.images.length < 1;
        let newState = {};
        let changeMade = false;
        newState.expandPost = this.state.expandPost;

        if (this.state.postEnable != newPostEnable)  {
            newState.postEnable = newPostEnable;
            changeMade = true;
        }
        if (this.state.commentEnable != newCommentEnable) {
            newState.commentEnable = newCommentEnable;
            changeMade = true;
        }
        if (this.state.fileEnable != newFileEnable) {
            newState.fileEnable = newFileEnable;
            changeMade = true;
        }
        if (changeMade) {
            this.setState(newState);
        }
    }

    inputCheck(e) {
        this.postString = e.target.value;
        this.enableCheck();
    }

    inputCommentCheck(e) {
        console.log("len: " + this.commentString.length + ", max: " + Posts.textLimits.comments);
        if (Posts.textLimits.comments <= e.target.value.length) {
            e.target.value = e.target.value.substring(0, Posts.textLimits.comments);
        }
        this.commentString = e.target.value;
        this.enableCheck();
    }

    setCommentPost(post) {
        if (post != undefined)
        {
            Log.logAction(Log.LOGACTION_POST_COMMENT_EXPAND, {postId: post.postId, where: Log.LOGWHERE_POST});
            this.setState({commenting: post != undefined, commentingPost: post, needKbdShow: true});
        }
    }

    submitComment(event) {
        event.preventDefault();
        const text = this.commentArea.value;
        Meteor.call('addCommentToPost', this.state.commentingPost._id, PostHelper.createComment(text), _.noop);
        Log.logAction(Log.LOGACTION_POST_COMMENT_SUBMIT, {postId:  this.state.commentingPost._id, where: Log.LOGWHERE_POST, text: text});
        this.commentString = "";
        this.commentArea.value = '';
        this.setState({postEnable: false, expandPost: false, commentEnable: false, commenting: false, commentingPost: {}});
    }

    testElementVisible(el) {
        let win = $("#post-scroll-container");
        var docViewTop = win.scrollTop(),
            docViewBottom = docViewTop + win.clientHeight - docViewTop,
            elemTop = el.offset().top,
            elemBottom = elemTop + el.height();

        docViewBottom = document.body.offsetHeight - docViewTop;
        console.log("dvt: " + docViewTop + ", dvb: " + docViewBottom + ", elmTop: " + elemTop + ", elmB: " + elemBottom + ", elht: " + el.height());
        return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
        && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
    }

    handleScroll(e) {
        return;

        let sb = $("#scroll-bottom");
        let atBottom = this.testElementVisible(sb);

        e.preventDefault();
        const justScrolledToBottom =  Session.get("justScrolledToBottom");
        if (justScrolledToBottom && ((justScrolledToBottom + 2000) > new Date().getTime())) {
            console.log("handleScroll Skip scroll");
            return;
        }

        if (atBottom) {
            const showSize = Session.get('showSize');
            const postSize = this.props.postsSize;
            if (postSize > showSize) {
                Session.set("justScrolledToBottom", new Date().getTime());
                Session.set("scroll-to-bottom", true);
                Session.set('showSize', Session.get('showSize') + PostHelper.DEFAULT_POST_SCROLL);
                console.log("handleScroll START Scroll");
            }
        }
    }

    componentDidMount() {
        if (Session.get("scroll-to-bottom")) {
            this.gotoBottom();
        }
        Session.set("scroll-to-bottom", false);
    }

    componentDidUpdate() {
        if (Session.get("scroll-to-bottom")) {
            setTimeout(() => {this.gotoBottom()}, 100);
        }
    }

    gotoBottom(){
        const justScrolledToBottom =  Session.get("justScrolledToBottom");
        Session.set("scroll-to-bottom", false);
        var element = document.getElementById("scroll-bottom");
        $("#scroll-bottom-pre")[0].scrollIntoView();
        Session.set("justScrolledToBottom", new Date().getTime());
    }

    render() {


        if (this.state.commenting || this.state.expandPost) {
            if (Meteor.isCordova) {
                if (!this.props.keyboardOpen) {
                    //cordova.plugins.Keyboard.show();
                }
            }
        }

        if (this.props.keyboardJustClosed) {Session.set('keyboard-just-closed', 'false');}

        // clear out badges for this team
        Meteor.call('clearMyBadgeNotifications', BADGE_POST, this.props.team, _.noop);

        function getPostFooter(myThis) {
            let useSmall = ' post-line-small ';
            let buttonHeight = '';
            let fontHeight = '';

            if (myThis.state.commenting) {
                return (
                    <div className={(myThis.props.isSilver ? "post-footer-v" : "post-footer-h") }>

                        <div className="post-scroll-container post-expand-comment-max-height"
                             id="post-scroll-container"
                        >
                            <UserPostShowContainer post={myThis.state.commentingPost} userId={myThis.props.userId}
                                          senderEmailAddress={''}
                                          chooseComment={(p) => _.noop}
                                          commenting={true}
                            />

                        </div>

                        <div className="flex-hbox-no-margin post-footer-big post-footer-post">
                            <textarea className={"post-line-c"} rows={(myThis.props.isSilver ? 2 : 4)} placeholder={i18n.__('comment-on-post') }
                               autoFocus
                               onChange={(e)=>myThis.inputCommentCheck(e)}
                               ref={textArea => myThis.commentArea = textArea}
                            >
                            </textarea>
                            <div className="flex-item">
                                <button type="button" className={"btn btn-submit btn-cancel-margin post-comment-button-width"}
                                        onClick={(e) => {myThis.cancelPost(e)}}>{i18n.__('button-cancel')}
                                </button>
                            </div>
                            <div className="flex-item post-item-right">
                                <button type="button" className={"btn btn-primary btn-submit  btn-cancel-margin post-comment-button-width"} disabled={!myThis.state.commentEnable}
                                    onClick={(e) => {myThis.submitComment(e)}}>{i18n.__('comment')}
                                </button>
                            </div>
                        </div>
                        <div className="tap-message">
                            Tap text area to get back keyboard.
                        </div>
                    </div>
                );
            } else if (myThis.state.expandPost) {
                let line1, line2, line3, line4;
                if (Meteor.isCordova && myThis.state.fileEnable) {
                    line1 = <img className={"flex-item post-image-button-cam " + buttonHeight} src="social-media-icons/camera.svg" onClick={(e) => myThis.openCamera(e)}/>
                }
                if (Meteor.isCordova && myThis.state.fileEnable) {
                    line2 = <img className={"flex-item post-image-button-file "  + buttonHeight} src="social-media-icons/folder.svg" onClick={(e)=>myThis.openFilePicker(e)} />
                }
                if (!Meteor.isCordova && myThis.state.fileEnable) {
                    line1 = <img className="flex-item post-image-button-cam" src="social-media-icons/camera.svg" onClick={(e) => myThis.openCamera(e)}/>
                    line2 = <img className="flex-item post-image-button-file" src="social-media-icons/folder.svg" onClick={(e)=>myThis.openFilePicker(e)} />
                    line3= <FileUpload handleFileChange={(e) => myThis.handleFileChange(e)} />
                }
                if (myThis.state.images && myThis.state.images.length > 0) {
                    line4 = myThis.state.images;
                }
                return (
                <div className={(myThis.props.isSilver ? "post-footer-v" : "post-footer-h")}>
                    <form onSubmit={(e) => myThis.inputCheck(e)}>
                    <div className={"flex-hbox-no-margin post-footer-big"}  >
                       <textarea className={"post-line "  } rows={(myThis.props.isSilver ? 4 : 6)} placeholder={i18n.__('post-to-the-team')}
                              autoFocus
                              onChange={(e)=>myThis.inputCheck(e)}
                              ref={textArea => myThis.textArea = textArea}
                        >
                        </textarea>
                    </div>
                    </form>
                    <div className="flex-hbox post-footer-buttons">
                        {line1}
                        {line2}
                        {line3}
                        {line4}
                        <button type="button" className={"btn btn-submit btn-cancel-margin " + fontHeight}
                                onClick={(e) => {myThis.cancelPost(e)}}>{i18n.__('button-cancel')}
                        </button>
                        <button type="button" className={"btn btn-primary btn-submit "  + fontHeight} disabled={!myThis.state.postEnable}
                                onClick={(e) => {myThis.submitPost(e)}}>{i18n.__('post-button')}
                        </button>
                    </div>
                    <div className="tap-message">
                        Tap text area to get back keyboard.
                    </div>
                </div>
                );
            } else {
                return (
                    <div className={ (myThis.props.isSilver ? "post-footer-s post-footer-v-height" : "post-footer post-footer-norm") + " post-line-small-height" }>
                        <div className="flex-hbox-no-margin post-footer-buttons-chat">
                                <textarea className="post-line post-line-small" rows="1" placeholder={i18n.__('post-to-the-team')}
                                  onClick={(e)=>myThis.inputPressed(e)}
                                >
                                </textarea>
                        </div>
                    </div>
                );
            }
        }


        const myThis = this;


        return (
            <div id="post-container">
                <div className="post-scroll-container"
                     id="post-scroll-container"
                     ref={container => this.scrollContainer = container}
                     onScroll={(e) => myThis.handleScroll(e)}
                >
                    <UserPostsShowContainer
                        userId={this.props.userId}
                        viewName="latestTeamPosts"
                        team={this.props.team}
                        limit={Session.get('showSize')}
                        postsSize={this.props.postsSize}
                        senderEmailAddress={this.props.senderEmailAddress}
                        setCommentPost={(p) => this.setCommentPost(p)}
                        commentingPost={this.state.commentingPost}
                    />
                    <div id="scroll-bottom-pre"></div>
                </div>

                {getPostFooter(this)}

            </div>


        );
    }
};

UserPosts.propTypes = {
    postsSize: React.PropTypes.number,
    team: React.PropTypes.string,
    senderEmailAddress: React.PropTypes.string,
    userId: React.PropTypes.string,
};

export default UserPostsContainer = createContainer(() => {
    if (!Session.get('showSize')) {
        Session.set('postsSize', PostHelper.DEFAULT_POST_LIMIT);
        Session.set('showSize', PostHelper.DEFAULT_POST_LIMIT);
    }
    const team = updateTeamInfo(PostHelper.getTeam());
    getPostsCount(team);

    return {
        postsSize: Session.get('postsSize'),
        team,
        senderEmailAddress: PostHelper.getUsername(),
        userId: Meteor.userId(),
        isSilver: Meteor.settings.public.IS_SILVER,
        keyboardOpen: Session.get('keyboard-open') === 'true',
        keyboardJustClosed: Session.get('keyboard-just-closed') === 'true',
        showCropModal: Session.get('showingCropModal') === 'true'
};
}, UserPosts);


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
