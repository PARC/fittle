/**
 * Created by lnelson on 5/16/17.
 */

/** HELPERS FOR USE IN SERVER OPERATION **/
import {Participants} from '/lib/api/participants/participants';
import {Posts} from '/lib/api/posts/posts';
import {Logs} from '/lib/api/logs/logs';
import {DateHelper} from '/lib/helpers';

/**
 * Make a Report about Posts, including how many visits to the post page and posts made and what activity a user made on any posts
 */
export class PostReportBuilder {

    /**
     * Initialize all report structures and data needed for this user
     * @param userId
     */
    constructor(userId) {
        this.userId = userId;
        this.participant = null;
        let user = Meteor.users.findOne({_id: userId});
        if (user)
            this.participant = Participants.findOne({emailAddress: user.username});
        this.myPosts = Posts.find({userId: userId}).fetch();
        this.allPosts = Posts.find().fetch();
        this.visits = Logs.find({userId: userId, message: "posts-visit"}).fetch();
        this.postsByDay = [];
        this.visitsByDay = [];
        this.likesByDay = [];
        this.commentsByDay = []
    }

    /**
     * Attribute Getter
     * @returns {*}
     */
    getUserId() {
        return this.userId
    }

    /**
     * Attribute Getter
     * @returns {*}
     */
    getParticipant() {
        return this.participant
    }


    /**
     * Getter for Challenge Start Date
     * @returns {*}
     */
    getStartDate() {
        let startDate = null;
        let participant = this.getParticipant();
        if (participant && (participant.challengeStartUTC || participant.studyStartUTC)) {
            startDate = participant.challengeStartUTC ? participant.challengeStartUTC : participant.studyStartUTC
        }
        return startDate
    }

    getEventDay(eventDate) {
        let startDate = this.getStartDate();
        return DateHelper.daysSince(startDate) - DateHelper.daysSince(eventDate);
    }

    /**
     * Attribute Getter
     * @returns {*}
     */
    getVisits() {
        return this.visits
    }

    /**
     * Attribute Getter
     * @returns {*}
     */
    getMyPosts() {
        return this.myPosts
    }

    /**
     * Attribute Getter
     * @returns {*}
     */
    getAllPosts() {
        return this.allPosts
    }

    /**
     * Getter
     * @returns {*}
     */
    setPostsByDay() {
        this.postsByDay = [];
        let posts = this.getMyPosts();
        let maxDay = 0;
        this.postsByDay = [];
        for (let ix = 0; ix < posts.length; ix++) {
            let post = posts[ix];
            let postDate = new Date(post.createdAt);
            let day = this.getEventDay(postDate);
            maxDay = day > maxDay ? day : maxDay;
            this.postsByDay[day] = typeof this.postsByDay[day] === 'undefined' ? 1 : this.postsByDay[day] + 1;
        }
        return maxDay
    }

    /**
     * Getter for if the social feed was visited on a given day
     * @returns {*}
     */
    setVisitsByDay() {
        this.visitsByDay = [];
        let logs = this.getVisits();
        let maxDay = 0;
        for (let ix = 0; ix < logs.length; ix++) {
            let log = logs[ix];
            let logDate = new Date(log.timestamp);
            let day = this.getEventDay(logDate);
            maxDay = day > maxDay ? day : maxDay;
            this.visitsByDay[day] = typeof this.visitsByDay[day] === 'undefined' ? 1 : this.visitsByDay[day] + 1;
        }
        return maxDay
    }

    /**
     * Getter for likes made by day in the social feed
     * @returns {*}
     */
    setCommentsAndLikesByDay() {
        let id = this.getUserId();
        let posts = this.getAllPosts();
        this.likesByDay = [];
        this.commentsByDay = [];
        let maxDay = 0;
        // For all Posts
        for (let ip = 0; ip < posts.length; ip++) {
            let post = posts[ip];
            // Count up my likes on this Post
            if (post && post.likers) {
                for (let ipl = 0; ipl < post.likers.length; ipl++) {
                    let like = post.likers[ipl];
                    if (like.userId === id) {
                        let lCreatedAt = typeof like.createdAt === 'undefined' ? post.createdAt : like.createdAt;
                        let lday = this.getEventDay(lCreatedAt);
                        if (lday > 0) {
                            maxDay = lday > maxDay ? lday : maxDay;
                            this.likesByDay[lday] = typeof this.likesByDay[lday] === 'undefined' ? 1 : this.likesByDay[lday] + 1
                        }
                    }
                }
            }
            // Count up my comments on this post
            for (let ic = 0; ic < post.comments.length; ic++) {
                let comment = post.comments[ic];
                if (comment) {
                    let cCreatedAt = typeof comment.createdAt === 'undefined' ? comment.createdAt : post.createdAt;
                    if (comment.source && comment.source.userId === id) {
                        if (cCreatedAt) {
                            let cday = this.getEventDay(cCreatedAt);
                            if (cday > 0) {
                                maxDay = cday > maxDay ? cday : maxDay;
                                this.commentsByDay[cday] = typeof this.commentsByDay[cday] === 'undefined' ? 1 : this.commentsByDay[cday] + 1
                            }
                        }
                    }
                    // Count up my likes on this comment
                    if (comment.likers) {
                        for (let il = 0; il < comment.likers.length; il++) {
                            let like = comment.likers[il];
                            if (like.userId === id) {
                                let lCreatedAt = typeof like.createdAt === 'undefined' ? cCreatedAt : like.createdAt;
                                let lday = this.getEventDay(lCreatedAt);
                                if (lday > 0) {
                                    maxDay = lday > maxDay ? lday : maxDay;
                                    this.likesByDay[lday] = typeof this.likesByDay[lday] === 'undefined' ? 1 : this.likesByDay[lday] + 1
                                }
                            }
                        }
                    }
                }
            }
        }
        return maxDay
    }

    getReport() {
        let maxDay = 0;
        let thesedays = this.setPostsByDay();
        // Run the Post Analytics
        maxDay = thesedays > maxDay ? thesedays : maxDay;
        thesedays = this.setVisitsByDay();
        maxDay = thesedays > maxDay ? thesedays : maxDay;
        thesedays = this.setCommentsAndLikesByDay();
        maxDay = thesedays > maxDay ? thesedays : maxDay;
        // Build the report
        for (let iday = 0; iday < maxDay; iday++) {
            if (typeof this.postsByDay[iday] === 'undefined') {
                this.postsByDay[iday] = 0
            }
            if (typeof this.visitsByDay[iday] === 'undefined') {
                this.visitsByDay[iday] = 0
            }
            if (typeof this.commentsByDay[iday] === 'undefined') {
                this.commentsByDay[iday] = 0
            }
            if (typeof this.likesByDay[iday] === 'undefined') {
                this.likesByDay[iday] = 0
            }
        }

        // Make the report
        return {
            title: "Post Report",
            posts: this.postsByDay,
            visits: this.visitsByDay,
            comments: this.commentsByDay,
            likes: this.likesByDay,
            daysReported: maxDay
        }
    }
}