/**
 * Created by lnelson on 10/12/16.
 */
import {Posts} from '/lib/api/posts/posts'
import {queryConstructor} from '/lib/lib.posts.queryConstructors';
/*
 Meteor.publish('posts', function (team) {
 this.onStop(function () {
 console.log("Server is stopping a Stroies subscription.");
 });


 if (!this.userId) {
 console.log("No Posts will be published for this subscription request.");
 return this.ready();
 }

 let user = Meteor.users.findOne({_id: this.userId});
 if (user) {
 console.log("Posts being published for user: " + user._id + ": " + Posts.find({topic: team}).count());
 return Posts.find({topic: team});
 }
 });
 */


Meteor.publish('posts', function (terms) {
    var parameters = queryConstructor(terms);
    this.onStop(function () {
        console.log("Server is stopping a Posts subscription.");
    });


    if (!this.userId) {
        console.log("No Posts will be published for this subscription request.");
        return this.ready();
    }

    let user = Meteor.users.findOne({_id: this.userId});
    if (user) {
        console.log("Posts being published for user: " + user._id + ": " + Posts.find(parameters.find, parameters.options).count());
        console.log("Post.find: " + JSON.stringify(parameters.find) + ", options: " + JSON.stringify(parameters.options));
        return Posts.find(parameters.find, parameters.options);
    }
    console.log("No Posts will be published for this subscription request.");
    return this.ready();
});

