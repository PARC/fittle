/**
 * Created by lnelson on 12/5/16.
 */
import {Posts} from '/lib/api/posts/posts';
import {ProfileHelper} from '/client/lib/client.user.profile.helpers';
import {ImageHelper} from '/client/lib/client.image.helpers';
import {query_constructor} from '/lib/lib.posts.queryConstructors';

export const DEFAULT_POST_LIMIT = 25;
export const DEFAULT_POST_SCROLL = 10;

export const PostHelper = {
    'getUsername': getUsername,
    'getTeam': getTeam,
    'readSingleImageAndInsert': readSingleImageAndInsert,
    'createPostsSubscription' : createPostsSubscription,
    'DEFAULT_POST_LIMIT' : DEFAULT_POST_LIMIT,
    'DEFAULT_POST_SCROLL': DEFAULT_POST_SCROLL,
    createComment
};

//----------------------------------------------------------------------------------------------------------------------
// User and Team functions
//----------------------------------------------------------------------------------------------------------------------

/**
 * Get the current user's name or allow anonymous posting
 * @returns {string}
 */
export function getUsername() {
    return Meteor.user() ? Meteor.user().username : 'anonymous'
}


/**
 * Get a team name from the user profile
 * @returns {*}
 */
export function getTeam() {
    let team = ProfileHelper.getTeam();
    if (!team) {team = 'none';}
    return team;
}

/**
 * Read an image file if necessary and create the post
 * @param f
 * @param who
 * @param text
 * @param topic
 */
export function readSingleImageAndInsert(imgUri, who, userId, text, topic) {
    console.log("readSingleImageAndInsert who: " + who + ", user: " + userId);

    //Retrieve the first (and only!) File from the FileList object
    if (imgUri) {

        ImageHelper.readSingleImageAndProcessResult(imgUri, function (fullImg, smallImg) {
            // push the two images to the s3 service, then save the post
            // with the resulting urls
            let thisPost = Posts.create(who, userId, ProfileHelper.getBio(), text, topic, ["Loading"], [smallImg]);
console.log("*** Post insert the Image");
            Posts.insert(thisPost, function (err, result) {
                if (err)
                    console.log(err.message);
                if (result) {
                    console.log("*** Post Insert result")
                    const now = new Date().getTime();
                    console.log("Insert who: " + who + ", topic: " + topic + ", at " + now);
                    uploadToServer(thisPost._id, smallImg, 0, 'icon');
                    uploadToServer(thisPost._id, fullImg, 0, 'image');

                }
            });
            console.log("*** Post insert AFTER");
        });
    } else {
        let thisPost = Posts.create(who, userId, ProfileHelper.getBio(), text, topic);
        if (text)
            console.log("My post " + JSON.stringify(thisPost));
            Posts.insert(thisPost);
    }
}

/**
 * Creates subscription to Posts collection. Includes callbacks for when subscription is ready and stopped.
 * @param templateInstance
 */
export function createPostsSubscription(templateInstance) {
    var terms = {
        viewName: 'latestTeamPosts',
        topic: templateInstance.getTeam(),
        limit: templateInstance.getLimit()
    };
    // By calling subscribe on a template, rather than on the global Meteor object, the subscription
    // will be automatically stopped without needing do manually do so in Template.onDestroy().
    templateInstance.postsSubHandle = templateInstance.subscribe('posts', terms,
        {
            onReady: function () {
                console.log("Posts subscription (for user " + Meteor.userId() + ") team: " + templateInstance.getTeam() + " limit: " + templateInstance.getLimit() + " on userPosts page is ready. There are "
                    + Posts.find().fetch().length + " posts.");
            },
            onStop: function () {
                console.log("Posts subscription (for user " + Meteor.userId() + ") on userPosts page has been stopped.");
            }
        }
    );
}

export function createComment (comment) {
    const commentObj = {
        _id: Posts.createId(),
        source: ProfileHelper.getBio(),
        comment,
        likers:[],
        createdAt: new Date().getTime()
    };
    return commentObj;
}

//----------------------------------------------------------------------------------------------------------------------
// Helpers to send images to S3 server
//----------------------------------------------------------------------------------------------------------------------

function uploadToServer(postId, img, imgPos, imgSize) {
    var chunkSize = Meteor.settings.public.IMAGE_POST_UPLOAD_CHUNK_SIZE;
    var imgLen = img.length;

    if (imgPos + chunkSize > imgLen) {
        chunkSize = imgLen - imgPos;
    }

    var chunk = img.substring(imgPos, imgPos+chunkSize);

    var newImgPos = imgPos + chunkSize;
    var lastUpload = newImgPos >= imgLen;

    //console.log("Sent chunk to : " + postId + "_" + imgSize + ", newPos: " + newImgPos + ", imgLen: " + imgLen + ", chunksize: " + chunkSize + " clen: " + chunk.length);
    Meteor.call('pushImageChunk', postId, imgSize, chunk, lastUpload, function(err, length) {
        if (!err) {
            //console.log("Get back length:  " + length);
            if (lastUpload) {
                //console.log("LAST chunk");
                //console.log(chunk);
            }
            if (!lastUpload) {
                uploadToServer(postId, img, newImgPos, imgSize);
            }
        }
    });
}
