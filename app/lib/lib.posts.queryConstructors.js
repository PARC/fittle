/**
 * Define publication/subscription queries for Posts
 * Defined for client and server
 * Created by lnelson on 12/6/16.
 */

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;
let views = {};

/**
 * Construct queries
 * @param terms
 * @returns {{find: {topic: *}, options: {sort: {createdAt: number}, limit: number}}}
 */
views.latestTeamPosts = function (terms) {
    let termlimit = terms.limit ? terms.limit : DEFAULT_LIMIT;
    termlimit = termlimit <= MAX_LIMIT ? termlimit : MAX_LIMIT;
    let rslt = {
        find: {
            topic: terms.team
        },
        options: {
            sort: {createdAt: -1},
            limit: termlimit
        }
    };
    console.log("** Subscription terms: " + JSON.stringify(rslt));
    return rslt;
};

/**
 * Define query constructor used in publications and susbscriptions
 * Based on: https://www.discovermeteor.com/blog/query-constructors/
 * @param terms
 * @returns {*}
 */
export function queryConstructor(terms) {
    var viewFunction = views[terms.viewName];
    if (terms)
        return viewFunction(terms);
    return {
        find: {},
        options: {
            sort: {createdAt: -1},
            limit: DEFAULT_LIMIT
        }
    };
}

/*

 import {query_constructor} from '/lib/lib.posts.query_constructors';

 //Publications server example:
 Meteor.publish('posts', function(terms) {
 var parameters = queryConstructor(terms);
 return Posts.find(parameters.find, parameters.options);
 });

 //Subscription client example:
 var terms = {
 viewName: 'latestTeamPosts',
 team: this.getTeam(),
 limit: Template.instance().state.get('postsLimit')
 }

 Meteor.subscribe(terms);

 var parameters = queryConstructor(terms);
 var latestPosts = Posts.find(parameters.find, parameters.options);

*/


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
