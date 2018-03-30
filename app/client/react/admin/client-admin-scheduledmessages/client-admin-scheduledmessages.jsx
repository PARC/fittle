/**
 * Created by lnelson on 3/22/2017.
 */

import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
//import AdminScheduledMessageSummaryContainer from './client-admin-ScheduledMessage-summary.jsx';
import TempContainer from './client-admin-scheduledmessages-show';
import {Scheduledmessages} from '/lib/api/scheduledmessages/scheduledmessages';

/**
 * My utility function
 * @param needle
 * @param haystack
 * @returns {boolean}
 */
function isNotIn(needle, haystack) {
    for (var ix = 0; ix < haystack.length; ix++) {
        if (needle === haystack[ix])
            return false;
    }
    return true;
}

function safeTrim(str) {
    try {
        return str.trim()
    } catch (err) {
        console.log('Error in trimming string ' + str + ' ' + err.message);
        return str
    }
}


function readSingleJSONFile(f, method_name, callback) {
    //Retrieve the first (and only!) File from the FileList object
    if (f) {
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            Meteor.call(method_name, reader.result, callback)
        }, false);
        reader.readAsText(f);

    } else {
        console.log("ERROR: Failed to load file to " + method_name);
    }
}

var uploadJSON = function (file_input_id, method_name, callback) {
    console.log('Loading ' + file_input_id + ' to ' + method_name);
    var incoming_data = document.getElementById(file_input_id);
    // the file is the first element in the files property
    var file = incoming_data.files[0];
    readSingleJSONFile(file, method_name, callback)
}



class AdminScheduledMessages extends React.Component {
    constructor() {
        super();
        this.state = {
            tagFilter: "",
            feedback: ""
        };
    }

    changeFilter(item, event) {
        let selection = event.target.value ? event.target.value : "";
        if (item == 'tag')
            this.setState({tagFilter: selection});
        //else if (item == 'name')
        //    this.setState({nameFilter: selection})
    }

    getItems(iname) {
        let iFind = this.props.items;
        let item;
        let itemset = [];
        for (var ix = 0; ix < iFind.length; ix++) {
            item = iFind[ix];
            if (item && item.hasOwnProperty(iname) && item[iname]) {
                let thisItem = safeTrim(item[iname]);
                if (isNotIn(thisItem, itemset)) {
                    if (thisItem)
                        itemset.push(thisItem)
                }
            }
        }
        itemset.sort();
        return itemset
    }

    // Process the upload form
    getFeedback() {
        return this.state.feedback
    }


    // Form event processing
    submission(event) {
        event.preventDefault();

        var incoming_data = document.getElementById('fileInput2');
        // the file is the first element in the files property
        var f = incoming_data.files[0];
        this.setState({
            feedback: "Uploading file: " + f.name + " [" + f.size + "] bytes"
        });
        //Retrieve the first (and only!) File from the FileList object
        if (f) {
            var reader = new FileReader();
            reader.addEventListener("load", () => {
                Meteor.call(
                    'uploadScheduledMessagesJSON',
                    reader.result,
                    (error, result) => {
                        if (error) {
                            this.setState({
                                feedback: "Error in upload: " + error.message
                            })
                        }
                        if (result) {
                            this.setState({
                                feedback: "Upload processed: " + result
                            })
                        }
                    })
            }, false);
            reader.readAsText(f);

        } else {
            this.setState({
                feedback: "Failed to upload Scheduledmessages file "
            });
            console.log("ERROR: Failed to load file to " + method_name);
        }
    }


    render() {

         return (
            <div className="subcontainer admin-page-style">
                <h2>Scheduledmessage Administration</h2>
                <h3>Test Notification</h3>
                <hr/>
                <h3>Upload a JSON file</h3>
                <form className="new-upload"
                      onSubmit={(e) => this.submission(e)}>
                    <label className="control-label" htmlFor="fileInput2">File: </label>
                    <input className="input-file" id="fileInput2" type="file" name="files[]"/>
                    <input type="submit" className="btn btn-primary" id="read_jsonS" value="Import"/>
                </form>
                <span>{this.getFeedback()}</span>

                <hr/>
                <h3>ScheduledMessage</h3>
                <label htmlFor="tagFilter">Filter by Message Tag: </label>
                <select
                    onChange={(e) => this.changeFilter('tag', e)}
                    id="tagFilter">
                    <option value="">All</option>
                    {this.getItems('tag').map((item, index) =>
                        <option key={index}>{item}</option>
                    )}
                </select>
                <TempContainer tagFilter={this.state.tagFilter} />
            </div>
        );
    }
}

AdminScheduledMessages.propTypes = {
    conditions: React.PropTypes.array,
    plistExists: React.PropTypes.bool,
};

export default AdminScheduledMessagesContainer = createContainer(() => {
    // Get users
    const allMessages = Scheduledmessages.find({});
    const mlistExists = !!allMessages;

    return {
        items: mlistExists ? allMessages.fetch() : [],
        mlistExists
    };
}, AdminScheduledMessages);

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
 