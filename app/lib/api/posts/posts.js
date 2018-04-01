/**
 * Created by lnelson on 10/10/16.
 */
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {StaticContent} from '/lib/staticContent';
export const Posts = new Mongo.Collection('posts');

/**
 * Defines all fields of Posts schema.
 *
 * Defining the fields in a dictionary, and then using the dictionary to reference the
 * fields elsewhere aids code management, and allows the IDE to check references to these fields.
 *
 * Use the ES6 syntax [FIELDS.KEY_NAME] to use values from this dictinoary as keys in other
 * dictionaries. See this link for more
 * info: http://stackoverflow.com/questions/2241875/how-to-create-an-object-property-from-a-variable-value-in-javascript
 *
 * @type {{EMAIL: string, GOAL_TEXT: string, CREATED_AT: string}}
 */
const FIELDS = {
    ID: "_id",
    COMMENTS: "comments",
    USERID: "userId",
    SOURCE: "source",
    EMAIL: "emailAddress",
    IMAGES: "images",
    ICONS: "icons",
    LIKERS: "likers",
    LIKES: "likes",
    TEXT: "text",
    TOPIC: "topic",
    DELETED: "deleted",
    CREATED_AT: "createdAt"
};

const COMMENT_FIELDS = {
    ID: "_id",
    SOURCE: "source",
    COMMENT: "comment",
    LIKERS: "likers",
    CREATED_AT: "createdAt"
};

const LIKER_FIELDS = {
    USERID: "userId",
    DISPLAYNAME: "displayName",
    CREATED_AT: "createdAt"
};

const BIO_FIELDS = {
    USERID: "userId",
    DISPLAYNAME: "displayName",
    BIO_IMAGE: "bioImage",
    BIO_TEXT: "bioText"
};


/**
 * Defines public fields of Posts collection. DO NOT list private fields in this data structure.
 * See https://guide.meteor.com/security.html#fields for more info.
 */
Posts.publicFields = {
    [FIELDS.COMMENTS]: 1,
    [FIELDS.USERID]: 1,
    [FIELDS.SOURCE]: 1,
    [FIELDS.EMAIL]: 1,
    [FIELDS.IMAGES]: 1,
    [FIELDS.ICONS]: 1,
    [FIELDS.LIKES]: 1,
    [FIELDS.TEXT]: 1,
    [FIELDS.TOPIC]: 1,
    [FIELDS.DELETED]: 1
};

Posts.textLimits = {
    comments: 100,
    bio: 500,
    userId: 100,
    displayName: 100,
    commentId: 100
}

/**
* Defines the Likers schema.
*/
var LikerSchema = new SimpleSchema({

    [LIKER_FIELDS.USERID]: {
        type: String,
        label: "User Id",
        optional: false,
        max: Posts.textLimits.userId
    },

    [LIKER_FIELDS.DISPLAYNAME]: {
        type: String,
        label: "Display Name",
        optional: false,
        max: Posts.textLimits.displayName
    },
    [LIKER_FIELDS.CREATED_AT]: {
        type: Date,
        label: "Created At",
        optional: true,
        defaultValue: new Date()
}

});
/**
 * Define a commenter Bio schema
 */

var BioSchema = new SimpleSchema({
    [BIO_FIELDS.USERID]: {
        type: String,
        label: "User Id",
        optional: false,
        max: Posts.textLimits.userId
    },
    [BIO_FIELDS.DISPLAYNAME]: {
        type: String,
        label: "Display Name",
        optional: false,
        max: Posts.textLimits.displayName
    },
    [BIO_FIELDS.BIO_IMAGE]: {
        type: String,
        label: "Image",
        optional: true
    },
    [BIO_FIELDS.BIO_TEXT]: {
        type: String,
        label: "Bio",
        optional: true,
        max: Posts.textLimits.bio
    }
});

/**
 * Defines the comment schema.
 */
var CommentSchema = new SimpleSchema({

    [COMMENT_FIELDS.ID]: {
        type: String,
        label: "Comment Id",
        optional: false,
        max: Posts.textLimits.commentId
    },

    [COMMENT_FIELDS.SOURCE]: {
        type: BioSchema,
        label: "Comment Source",
        optional: false
    },

    [COMMENT_FIELDS.COMMENT]: {
        type: String,
        label: "Comment Text",
        optional: false,
        max: Posts.textLimits.comments
    },

    [COMMENT_FIELDS.LIKERS]: {
        type: [LikerSchema],
        label: "Likers",
        optional: false
    },

    [COMMENT_FIELDS.CREATED_AT]: {
        type: Date,
        optional: true,
        defaultValue: new Date()
    }

});

Posts.commentScema = CommentSchema;

/**
 * Defines the Participants schema.
 */
Posts.schema = new SimpleSchema({

    [FIELDS.EMAIL]: {
        type: String,
        label: "Email address",
        regEx: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))$/,
        optional: false,
        max: 100
    },

    [FIELDS.USERID]: {
        type: String,
        label: "UserID",
        optional: false
    },


    [FIELDS.SOURCE]: {
        type: BioSchema,
        label: "Post Source",
        optional: false
    },

    [FIELDS.COMMENTS]: {
        type: [CommentSchema],
        label: "Comments",
        optional: true
    },

    [FIELDS.IMAGES]: {
        type: [String],
        label: "Images",
        optional: true
    },

    [FIELDS.ICONS]: {
        type: [String],
        label: "Icons",
        optional: true
    },

    [FIELDS.LIKERS]: {
        type: [LikerSchema],
        label: "Likers",
        optional: true
    },

    [FIELDS.LIKES]: {
        type: Number,
        label: "Likes",
        optional: true,
        defaultValue: 0,
        min: 0
    },

    [FIELDS.TEXT]: {
        type: String,
        label: "Text",
        optional: true
    },

    [FIELDS.TOPIC]: {
        type: String,
        label: "Topic",
        optional: false,
        max: 100
    },

    [FIELDS.DELETED]: {
        type: Boolean,
        label: "Deleted",
        optional: false,
        defaultValue: false
    },

    [FIELDS.CREATED_AT]: {
        type: Date,
        optional: true,
        defaultValue: new Date()
    }

});

Posts.createId = function() {
    return (new Date().getTime()).toString() + "-" + Math.floor((Math.random()*1000)).toString();
}

/**
 * Attaches schema definition to the collection. Now, all mutators called on this collection
 * (insert/update/upsert) will first be validated.
 */
Posts.attachSchema(Posts.schema);

/**
 * Returns a dictionary--constructed using the given arguments--that can be used to insert
 * a new document into the collection. This is purely a helper. It reduces the need of
 * other classes to know the key-value structure used to create a new Participants document.
 * @author M. Silva
 */
Posts.create = function (emailAddress, userId, source, text, topic, images, icons) {
    if (!text && (!images || !images.length) && (!icons || !icons.length))
        return null;
    images = images ? images : [];
    icons = icons ? icons : [];
    text = text ? text : "";
    topic = topic ? topic : "";

    const values = {
        [FIELDS.ID]: Posts.createId(),
        [FIELDS.USERID]: userId,
        [FIELDS.EMAIL]: emailAddress,
        [FIELDS.SOURCE]: source,
        [FIELDS.COMMENTS]: [],
        [FIELDS.IMAGES]: images,
        [FIELDS.ICONS]: icons,
        [FIELDS.LIKERS]: [],
        [FIELDS.LIKES]: 0,
        [FIELDS.TEXT]: text,
        [FIELDS.TOPIC]: topic,
        [FIELDS.CREATED_AT]: new Date()
    };
    return values;
};

Posts.createBio = function (userId, displayName, bioText, bioImage) {

    if (!bioText || bioText.length < 1) {
        bioText = "Bio for " + displayName;
    }
    const bio = {
        [BIO_FIELDS.USERID]: userId,
        [BIO_FIELDS.DISPLAYNAME]: displayName,
        [BIO_FIELDS.BIO_TEXT]: bioText,
        [BIO_FIELDS.BIO_IMAGE]: bioImage
    }
    return bio;
}

/**
 * Get all the teams that have posts
 */
Posts.getTeams = function () {
    let posts = Posts.find({}).fetch();
    let teams = {};
    for (let ix = 0; ix < posts.length; ix++) {
        // Only return REAL teams, not Peer2Peer teams
        if (posts[ix].topic.indexOf('@') < 0) {
            teams[posts[ix].topic] = true;
        }
    }
    return Object.keys(teams).sort().join(', ')
};

/**
 * Get a particular POST for a team & sender
 */
Posts.getPost = function (team, senderEmail, dateCreated) {
    return Posts.find({[FIELDS.TOPIC]: team, [FIELDS.DELETED]: false, [FIELDS.EMAIL]: senderEmail, [FIELDS.CREATED_AT]: dateCreated}).fetch();
};

/**
 * Count the posts for a team
 */
Posts.postsCount = function (team) {
    return Posts.find({[FIELDS.TOPIC]: team, [FIELDS.DELETED]: false}).count();
};

/**
 * Get a particular POST and update the image field
 */
Posts.updatePostImages = function (postId, newImages, fieldName) {

    if (fieldName === 'icons') {
        return Posts.update({[FIELDS.ID]: postId},
            {$set: {[FIELDS.ICONS]: newImages}},
        );
    }
    return Posts.update({[FIELDS.ID]: postId},
        {$set: {[FIELDS.IMAGES]: newImages}},
    )
};

Posts.ins = function (email, userId, source, msg, team, a1, a2, comments) {
    console.log("Inserting POST: " + JSON.stringify(
            {
                [FIELDS.USERID]: userId,
                [FIELDS.TOPIC]: team,
                [FIELDS.SOURCE]: source,
                [FIELDS.DELETED]: false,
                [FIELDS.TEXT]: msg,
                [FIELDS.EMAIL]: email,
                [FIELDS.COMMENTS]: comments ? comments.length : 0,
                [FIELDS.CREATED_AT]: new Date()
            }
        ));
    Posts.insert({
        [FIELDS.USERID]: userId,
        [FIELDS.TOPIC]: team,
        [FIELDS.SOURCE]: source,
        [FIELDS.DELETED]: false,
        [FIELDS.TEXT]: msg,
        [FIELDS.COMMENTS]: comments ? comments : [],
        [FIELDS.EMAIL]: email,
        [FIELDS.CREATED_AT]: new Date()
    });

}

Posts.addP2PPost = function(email, userId, displayName, msg, team) {
    let source = {
        displayName,
        userId: userId,
        bioImage: "",
        bioText: ""
    }

    Posts.ins(email, userId, source, msg, team, [], []);
}

/*
if (Meteor.isServer) {
    let source1 = {
        userId: "2340923894",
        displayName: "BigFoot",
        bioImage: StaticContent.defaultProfilePictureThumbnail(),
        bioText: "A big harry foot"
    };
    let source2 = {
        userId: "2340923423894",
        displayName: "BiggestFoot",
        bioImage: "data:image/jpeg;base64,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",
        bioText: "A big harry guy with big feet"
    };
    let source3 = {
        userId: "rYPxqiqGXiCtd8uzG",
        displayName: "BK",
        bioText: "A great guy"
    };
    let source4 = {
        userId: "rYPxfdsfXiCtd8uzG",
        displayName: "Joe",
        bioImage: StaticContent.defaultProfilePictureThumbnail(),
        bioText: "A bad guy"
    };

    let comment1 = {_id: Posts.createId(), comment:"Great Job", userId: "nobody", source: source1,
        likers:[{[LIKER_FIELDS.USERID]: "X12323", [LIKER_FIELDS.DISPLAYNAME]: "Joe"}],
        createdAt: new Date().getTime()};
    let comment2 = {_id: Posts.createId(), comment:"Well done", userId: "nobody", source: source2,
        likers:[], createdAt: new Date().getTime()};
    let comment3 = {_id: Posts.createId(), comment:"I agree", userId: "nobody", source: source3,
        likers:[], createdAt: new Date().getTime()};
    let comment4 = {_id: Posts.createId(), comment:"I agree, but I have reservations if it is a long comment with applauds", userId: "nobody", source: source3,
        likers:[{[LIKER_FIELDS.USERID]: "X12323", [LIKER_FIELDS.DISPLAYNAME]: "Joe"}], createdAt: new Date().getTime()};
    Posts.ins("krivacic@parc.com", "nobody", source3, "This is message 1 :-) wc", "lobby", [], [], [comment1]);
    Posts.ins("krivacic@parc.com", "nobody", source3, "This is message 2 :-( wc", "lobby", [], [], [comment1,comment2]);
    Posts.ins("krivacic@parc.com", "nobody", source3, "This is message 3", "lobby", [], [], [comment4, comment1]);
    Posts.ins("bigfoot@parc.com", "nobody", source1, "This is message 4", "lobby", [], []);
    Posts.ins("bigfoot@parc.com", "nobody", source2, "This is message 5", "lobby", [], []);
    Posts.ins("bigfoot@parc.com", "nobody", source4, "This is message 6 wc", "lobby", [], [], [comment1, comment2, comment3]);
    console.log("*** CREATED POSTS ****");
}
*/