import {date, now} from 'meteor/remcoder:chronos';
import {Accounts} from 'meteor/accounts-base';
import {Posts} from '/lib/api/posts/posts';
var AWS = require('aws-sdk');var AWS = require('aws-sdk');

export const PostImageHelpers = {
    'postToImageService': postToImageService,
};

/**
 *  Create the base file name/directory to insert or a POST image
 */
createFilenameForImage = function(postObj, imgSize) {
    var fileBase = "F" + new Date().getTime() + 'Y' + Math.floor(Math.random() * 1000);
    var fileName = postObj.topic.replace("@", "-") + "/" + imgSize + "/" + fileBase;
    return fileName;
};


/**
 *  POST an image to the S3 server, and put its location into the POST object.
 *  postObj - post object in question
 *  fName - filename of post origin (to get the extent)
 *  imgSize - to indicate a full size or icon siae ('icon' or 'image')
 *  img - the base64 rnvofrf image.
 */
function postToImageService(postObj, imgSize, img) {
    let myConfig = new AWS.Config({
        accessKeyId: Meteor.settings.private.S3_ID, secretAccessKey: Meteor.settings.private.S3_SECRET, region: 'us-west-2'
    });
    let s3 = new AWS.S3(myConfig);

    var buf = Buffer.from(img.substr("data:image/png;base64,".length), 'base64');
    let uploadName = createFilenameForImage(postObj, imgSize);
    let imgUrl = Meteor.settings.private.S3_BASEURL + uploadName;
    let appImgUrl =
        Meteor.settings.private.IMAGE_API_SERVICE +
        Meteor.settings.private.IMAGE_API_PREFIX +
        Meteor.settings.private.IMAGE_API_TOKEN +
        "/" +
        Meteor.settings.private.S3_BUCKET +
        "/" +
        uploadName;

    let imgType = "image/png";


    params = {Bucket: Meteor.settings.private.S3_BUCKET, Key: uploadName, Body: buf, ContentType: imgType};

    s3.putObject(params, Meteor.bindEnvironment(function (err, data) {
        if (err) {
            console.log(err);
            return '';
        } else {
            Posts.updatePostImages(postObj._id, [appImgUrl], imgSize == 'image' ? 'images' : 'icons');
        }
    }));
}

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
