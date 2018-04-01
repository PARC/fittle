/**
 * Created by krivacic on 3/22/2017.
 */

/*
 * Component to show one post in a list of posts
 */

import React, { Component } from 'react';
import ReactDom from "react-dom";
import { createContainer } from 'meteor/react-meteor-data';
import {ProfileHelper} from '/client/lib/client.user.profile.helpers';
import {NavigationHelper} from '/client/lib/client.navigation.helpers';
import {ImageHelper} from '/client/lib/client.image.helpers';
import {Log} from '/client/log';
import P2PHelpers from '/lib/p2p.helpers';
import {Posts} from '/lib/api/posts/posts';

var FileUpload = React.createClass({

    handleFile: function(e) {
        Log.logAction(Log.LOGACTION_FILE_OPEN, {where: Log.LOGWHERE_PROFILE});
        var reader = new FileReader();
        var file = e.target.files[0];

        if (!file) {
            Log.logAction(Log.LOGACTION_FILE_CANCEL, {where: Log.LOGWHERE_PROFILE});
            return;
        }

        Log.logAction(Log.LOGACTION_FILE_CLOSE, {where: Log.LOGWHERE_PROFILE});
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

class UserProfileShow extends React.Component {

    resetObj() {
        return {
            editing: false,
            changesMade:false,
            displayNameChanged: false,
            bioChanged: false,
            profilePicChanged: false,
            fileEnable: true,
            profilePic: undefined
        };
    }
    constructor() {
        super();
        this.state = {};
        this.state = this.resetObj();
    }

    getMyDisplayName() {
        return  this.displayName || ProfileHelper.getDisplayName();
    }

    getMyBio() {
         return ProfileHelper.getBio();
    }

    setMyProfilePicture() {
        let pic = ProfileHelper.getPicture();
        if (!this.state.profilePic) {
            this.state.profilePic = pic;
        }
    }

   getDisplayImage() {
        return this.image || this.props.bio.bioImage || ProfileHelper.getPicture();
    }

    getDisplayName() {
        return  this.displayName || this.props.bio.displayName || '';
    }

    getBioText() {
        return this.bioText || this.props.bio.bioText || '' ;
    }

    editClick(e) {
        this.setState(this.resetObj());
        this.setState({editing: true});
        Log.logAction(Log.LOGACTION_EDIT_PROFILE, {userId: this.props.userId, where: Log.LOGWHERE_PROFILE});
    }

    updateClick(e) {
        if (this.state.displayNameChanged) {
            ProfileHelper.setDisplayName(this.displayNameArea.value);
            this.displayName = this.displayNameArea.value;
            Log.logAction(Log.LOGACTION_UPDATE_PROFILE, {userId: this.props.userId, text: this.displayNameArea.value, what: Log.LOGUPDATE_PROFILE_DISPLAYNAME, where: Log.LOGWHERE_PROFILE});
        }
        if (this.state.bioChanged) {
            ProfileHelper.setBioText(this.bioArea.value);
            this.bioText = this.bioArea.value;
            Log.logAction(Log.LOGACTION_UPDATE_PROFILE, {userId: this.props.userId, text: this.bioArea.value, what: Log.LOGUPDATE_PROFILE_BIO, where: Log.LOGWHERE_PROFILE});
        }
        if (this.state.profilePicChanged) {
            ProfileHelper.setPicture(this.state.profilePic);
            Log.logAction(Log.LOGACTION_UPDATE_PROFILE, {userId: this.props.userId, what: Log.LOGUPDATE_PROFILE_PIC, where: Log.LOGWHERE_PROFILE});
        }
        this.setState(this.resetObj());
    }

    selectTextInput(e) {
        if (Posts.textLimits.bio <= e.target.value.length) {
            e.target.value = e.target.value.substring(0, Posts.textLimits.bio);
        }
        this.setState({bioChanged: true, changesMade: true});
        Log.logAction(Log.LOGACTION_PROFILE_BIO_TEXT, {userId: this.props.userId, text: e.target.value, where: Log.LOGWHERE_PROFILE});
    }

    selectDisplayNameInput(e) {
        if (Posts.textLimits.displayName <= e.target.value.length) {
            e.target.value = e.target.value.substring(0, Posts.textLimits.displayName);
        }
        this.setState({displayNameChanged: true, changesMade: true});
        if (e.target.value.length > 99) {
            e.target.value = e.target.value.substring(0, 99);
        }
        Log.logAction(Log.LOGACTION_PROFILE_DISPLAYNAME_TEXT, {userId: this.props.userId, text: e.target.value, where: Log.LOGWHERE_PROFILE});
    }

    handleCrop(dataURI) {
            this.setState({
                img: null,
                profilePicChanged: true,
                changesMade: true,
                profilePic: dataURI,
            });
    }

    resizeImage(imageUri) {
        let myThis = this;
        this.image = ImageHelper.resizeImageUri(imageUri, Meteor.settings.public.PROFILE_PIC_PIX, Meteor.settings.public.PROFILE_PIC_PIX, true, function(img){
            myThis.image = img;
            myThis.setState({profilePic: img, profilePicChanged: true, changesMade: true});
        });
    }

    handleFileChange(imageUri) {
        this.image = imageUri;
        myThis.resizeImage(this.image);
    }

    chatClick(e, groupName, p2pDisplayName,  p2pMemberId) {
        e.preventDefault();
        Session.set('show-profile', false);
        Session.set('profile-bio', '');
        Session.set('profile-userid', '');
        NavigationHelper.chatWith(groupName, this.props.userId, p2pDisplayName, p2pMemberId, "profile-view");
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

    processImage(myThis, imageUri) {
        myThis.image = "data:image/jpeg;base64," + imageUri;
        myThis.resizeImage(myThis.image);
    }

    openCamera(e) {
        var srcType = Camera.PictureSourceType.CAMERA;
        var options = this.setOptions(srcType);
        var myThis = this;

        Log.logAction(Log.LOGACTION_CAMERA_OPEN, {where: Log.LOGWHERE_PROFILE});
        navigator.camera.getPicture(function cameraSuccess(imageUri) {
            myThis.processImage(myThis, imageUri);
            Log.logAction(Log.LOGACTION_CAMERA_CLOSE, {where: Log.LOGWHERE_PROFILE});
        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
            Log.logAction(Log.LOGACTION_CAMERA_CANCEL, {where: Log.LOGWHERE_PROFILE});
        }, options);
    }

    openFilePicker(e) {
        var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        var options = this.setOptions(srcType);
        var myThis = this;

        Log.logAction(Log.LOGACTION_FILE_OPEN, {where: Log.LOGWHERE_PROFILE});
        navigator.camera.getPicture(function cameraSuccess(imageUri) {
            myThis.processImage(myThis, imageUri);
            Log.logAction(Log.LOGACTION_FILE_CLOSE, {where: Log.LOGWHERE_PROFILE});
        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
            Log.logAction(Log.LOGACTION_FILE_CANCEL, {where: Log.LOGWHERE_PROFILE});
        }, options);
    }

    render() {
        let myThis = this;
        if (this.props.userId == this.props.bio.userId) {
            this.setMyProfilePicture();
            this.bio = this.getMyBio();
            this.image = this.image || this.bio.bioImage;
            this.displayName = this.displayName  || this.bio.displayName;
            this.bioText = this.bioText || this.bio.bioText;
        }

        let contents = null;

        /*
         <div className="flex-hbox  margin-left-off">
         <a className="pull-left" target="_blank">
         <div className="media-box">
         <img className="media-img" src={this.getDisplayImage()} >
         </img>
         </div>
         </a>
         <div className="media-head">
         <div>
         <div className="author-title">
         {this.getMyDisplayName()}
         </div>
         </div>
         </div>
         </div>
         */

        if (this.state.editing) {
            contents =
                <div className="flex-vbox">
                    <div className="profile-body">
                    <div className="media-body">
                        <label>
                            {i18n.__("profile-display-name")}
                        </label>
                        <div className="border-me">
                        <input className="form-control"  type="text"
                               placeholder={i18n.__('display-name')}
                               defaultValue={this.getMyDisplayName()}
                               onChange={(e) => this.selectDisplayNameInput(e)}
                               ref={el => this.displayNameArea = el}
                        />
                        </div>
                    </div>

                    <div className="media-body">
                        <label>
                            {i18n.__('profile-bio')}
                        </label>
                        <textarea className="bio-form-control border-me" rows="3"
                               placeholder={i18n.__('profile-bio-text-here')}
                               defaultValue={this.getMyBio().bioText}
                               onChange={(e) => this.selectTextInput(e)}
                               ref={el => this.bioArea = el}
                        />
                    </div>
                    <div className="flex-hbox">
                        <label>
                            {i18n.__('profile-picture')} &nbsp;&nbsp;
                        </label>
                        <div className="media-box">
                        <img className="media-img" src={this.state.profilePic} />
                        </div>
                    </div>
                        {Meteor.isCordova
                            ?
                            <div className="flex-hbox profile-file-choice-buttons">
                                <img className="flex-item" src="social-media-icons/camera-outline.svg"
                                     onClick={(e) => myThis.openCamera(e)}/>
                                < img className = "flex-item" src="social-media-icons/folder-outline.svg" onClick={(e)=>myThis.openFilePicker(e)} />
                            </div>
                            :
                            <div className="flex-hbox profile-file-choice-buttons">
                                <FileUpload handleFileChange={(e) => this.handleFileChange(e)} />
                            </div>
                        }
                    </div>
                </div>;
        } else {
            contents =
                <div className="flex-vbox">
                    <div className="flex-hbox margin-left-off">
                        <a className="pull-left" target="_blank">
                            <div className="media-box">
                                <img className="media-img" src={this.getDisplayImage()} >
                                </img>
                            </div>
                        </a>
                        <div className="media-head">
                            <div>
                                <div className="author-title">
                                    {this.getDisplayName()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile-body">
                        {this.getBioText() }
                    </div>
                </div>;
        }

        function getProfileFooter(myThis) {

            let buttonLine = undefined;

            if (myThis.props.userId != myThis.props.bio.userId) {
                buttonLine =
                    <button type="button" className="btn btn-submit" onClick={(e) => myThis.chatClick(e, P2PHelpers.makeP2pTeamname(myThis.props.userId, myThis.props.bio.userId), myThis.props.bio.displayName, myThis.props.bio.userId)}>
                        {i18n.__('chat-goto-button')}
                    </button>;
            } else if (myThis.state.editing) {
                buttonLine =
                    <button type="button" className="btn btn-submit" onClick={(e) => myThis.updateClick(e)}  disabled={!myThis.state.changesMade}>
                        {i18n.__("button-update")}
                    </button>;
            } else {
                buttonLine =
                    <button type="button" className="btn btn-submit "
                        onClick={(e) => {
                            myThis.editClick(e)
                        }}>{i18n.__('edit-button')}
                    </button>
            }

            return (
                <div className="flex-footer profile-footer">
                    <div className="flex-hbox profile-footer-buttons">
                        <div className={"flex-item post-item-right" + ((myThis.props.userId == myThis.props.bio.userId && !myThis.state.editing) ? " profile-button-image" : "")} >
                            {buttonLine}
                        </div>
                    </div>
                </div>
            );
        }

            return (

            <div className="social-feed-element">
                {contents}
                {getProfileFooter(this)}
             </div>
        );
    }
}

UserProfileShow.propTypes = {
    bio: React.PropTypes.object,
    userId: React.PropTypes.string,
    exitFn: React.PropTypes.func
};

export default UserProfileShowContainer = createContainer(({bio, userId,exitFn}) => {
    let profileBioText = bio.bioText;
    return {
        bio,
        profileBioText,
        userId,
        exitFn,
        showCropModal: Session.get('showingCropModal') === 'true'
    };
}, UserProfileShow);