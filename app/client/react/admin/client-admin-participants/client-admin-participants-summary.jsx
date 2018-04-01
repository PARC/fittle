/**
 * Created by lnelson on 3/22/2017.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import moment from 'moment-timezone';
import {Meteor} from 'meteor/meteor';
import {Participants} from '/lib/api/participants/participants';

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
    console.log('INFO Loading ' + file_input_id + ' to ' + method_name);
    var incoming_data = document.getElementById(file_input_id);
    // the file is the first element in the files property
    var file = incoming_data.files[0];
    readSingleJSONFile(file, method_name, callback)
}


class AdminParticipantsSummary extends React.Component {
    constructor() {
        super();
        this.state = {
            feedback: ""
        };
    }

    //Access Methods for Collection attributes

    getCondition(item) {
        return item.condition
    }

    getNumberInCondition(item) {
        return item.numberInCondition
    }

    getNumberRegistered(item) {
        return item.numberRegistered
    }

    // Process the upload form
    getFeedback() {
        return this.state.feedback
    }


    // Form event processing
    submission(event) {
        event.preventDefault();

        var incoming_data = document.getElementById('fileInput3');
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
                    'uploadParticipantJSON',
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
                feedback: "Failed to upload file Participant file "
            });
            console.log("ERROR: Failed to load file to " + method_name);
        }
    }

    render() {
        return (

            <div className="subcontainer">
                <table className="admin-table">
                    <tbody>

                    <tr>
                        <th>Condition</th>
                        <th>Count</th>
                        <th>Registered</th>
                    </tr>

                    {this.props.items.map((item, index) =>
                        <tr key={10*index+0}>
                            <td key={10*index+1}>{this.getCondition(item)}</td>
                            <td key={10*index+2}>{this.getNumberInCondition(item)}</td>
                            <td key={10*index+3}>{this.getNumberRegistered(item)}</td>
                        </tr>
                    )}

                    </tbody>
                </table>

                <h3>Upload a JSON file</h3>

                <form className="new-upload"
                      onSubmit={(e) => this.submission(e)}>
                    <label className="control-label" htmlFor="fileInput3">File: </label>
                    <input className="input-file" id="fileInput3" type="file" name="files[]"/>
                    <input type="submit" className="btn btn-primary" id="read_json" value="Import"/>
                </form>
                <span>{this.getFeedback()}</span>

            </div>

        );
    }
}

AdminParticipantsSummary.propTypes = {
    items: React.PropTypes.array
};

export default AdminParticipantsSummaryContainer = createContainer(({}) => {

    let allParticipants = Participants.find().fetch();
    let summary = {};
    let registeredByCondition = {};
    for (let ix = 0; ix < allParticipants.length; ix++) {
        let condition = allParticipants[ix] && allParticipants[ix].condition ? allParticipants[ix].condition : null;
        if (condition) {
            if (!summary[condition])
                summary[condition] = 0;
            summary[condition]++;
            if (!registeredByCondition[condition])
                registeredByCondition[condition] = 0;
            if (Meteor.users.findOne({username: allParticipants[ix].emailAddress}))
                registeredByCondition[condition]++
        }
    }
    let items = [];
    let keys = Object.keys(summary).sort();
    let totalParticipants = 0;
    let totalRegistered = 0;
    for (let ixr = 0; ixr < keys.length; ixr++) {
        items.push({
            condition: keys[ixr],
            numberInCondition: summary[keys[ixr]],
            numberRegistered: registeredByCondition[keys[ixr]]
        });
        totalParticipants += summary[keys[ixr]];
        totalRegistered += registeredByCondition[keys[ixr]];
    }
    items.push({condition: "TOTAL", numberInCondition: totalParticipants, numberRegistered: totalRegistered});

    return {
        items
    };
}, AdminParticipantsSummary);

