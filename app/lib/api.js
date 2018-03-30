// /**
//  Server routes
//  this.params — Any parameters passed in the route itself.
//  this.request.query — Any query parameters passed in the request.
//  this.request.body — Any body data passed in the request.
//  */
// Router.map(function () {
//     this.route('apiShow', {
//         path: '/api/show',
//         where: 'server',
//         action: function () {
//             var json = {};
//             if (typeof this.params.query.when !== 'undefined') {
//                 json = Tasks.find({when: this.params.query.when}).fetch()
//             } else {
//                 json = Tasks.find().fetch();
//             }
//             this.response.setHeader('Content-Type', 'application/json');
//             this.response.end(JSON.stringify(json));
//         }
//     });
// });
// Router.map(function () {
//     this.route('apiQuestionAdd', {
//         path: '/api/question/add/:token',
//         where: 'server',
//         action: function () {
//             function check_response_format(responseFormat) {
//                 /* responseFormat is one of:
//                  // <option value="text" selected>Enter a text value</option>
//                  <option value="list-choose-one">Choose one from a list</option>
//                  <option value="list-choose-multiple">Choose any from a list</option>
//                  */
//                 return responseFormat === 'text' || responseFormat === 'list-choose-one' || responseFormat === 'list-choose-multiple'
//             }
//
//             function check_username(username) {
//                 if (username) {
//                     var users = Meteor.users.find({}).fetch();
//                     for (var ix = 0; ix < users.length; ix++) {
//                         if (users[ix].username === username)
//                             return true
//                     }
//                 }
//                 return false
//             }
//
//             var json = {
//                 status: 'NOT AUTHORIZED'
//             };
//             try {
//                 if (API_REQUEST_IS_VALID(this.params.token)) {
//                     json = {
//                         request_token: this.params.token,
//                         body: this.request.body,
//                         status: 'AUTHORIZED'
//                     };
//                     var name = Questions.find().count();
//
//                     var text = this.request.body.text ? this.request.body.text : '';
//                     var responseFormat = this.request.body.responseFormat ? this.request.body.responseFormat : '';
//                     var choice_string = this.request.body.choices ? this.request.body.choices : '';
//                     var username = this.request.body.username ? this.request.body.username : '';
//                     var choices = choice_string ? choice_string.split(',') : [];
//
//                     if (text && check_response_format(responseFormat) && choices && check_username(username)) {
//                         var withChoices = choices ? 'with choices ' + choices.toString() : '';
//                         Questions.insert({
//                             questionText: text,
//                             name: name.toString(),
//                             responseFormat: responseFormat,
//                             choices: choices,
//                             createdAt: new Date(),
//                             answer: '',
//                             answered: false,
//                             username: username
//                         }, function (error, result) {
//                             if (error) console.log(error); //info about what went wrong
//                             if (result) {
//                                 var doc = Questions.findOne(result);
//                                 console.log('Added Question ' + JSON.stringify(doc));
//                             } //the _id of new object if successful
//                         });
//                     }
//                 }
//             } catch (error) {
//                 json = {
//                     status: 'REQUEST DID NOT PROCESS'
//                 };
//             }
//
//             this.response.setHeader('Content-Type', 'application/json');
//             this.response.end(JSON.stringify(json));
//         }
//     });
// });
// Router.map(function () {
//     this.route('apiSet', {
//         path: '/api/set',
//         where: 'server',
//         action: function () {
//             var json = {
//                 success: false,
//                 reason: 'Nothing to set'
//             };
//             if (typeof this.params.query.text !== 'undefined' &&
//                 typeof this.params.query.when !== 'undefined' &&
//                 typeof this.params.query.username !== 'undefined') {
//                 var text = this.params.query.text;
//                 var basetext = this.params.query.basetext ? this.params.query.basetext : text;
//                 var href = this.params.query.href;
//                 var when = this.params.query.when;
//                 var username = this.params.query.username;
//                 var rationale = this.params.query.rationale;
//
//                 /*
//                  var found = Activities.find(
//                  {activity:
//                  { $regex: new RegExp("^" + text + "$", "i") } }
//                  ).fetch();
//                  var contentRef = found && found.length > 0 ? found[0].content : '';
//                  */
//                 var insertion = {
//                     text: text,
//                     basetext: basetext,
//                     href: href,
//                     when: when,
//                     username: username,
//                     rationale: rationale,
//                     createdAt: Date.now(),
//                     owner: "ckNmoDbRcd8CLEFTa",
//                     checkedYes: false,
//                     checkedAlmost: false,
//                     checkedNo: false,
//                     value: "",
//                     checked: false
//                 };
//                 Tasks.insert(insertion);
//                 json = {
//                     success: true,
//                     text: text,
//                     when: when,
//                     username: username
//                 };
//             }
//
//             this.response.setHeader('Content-Type', 'application/json');
//             this.response.end(JSON.stringify(json));
//         }
//     });
// });



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





