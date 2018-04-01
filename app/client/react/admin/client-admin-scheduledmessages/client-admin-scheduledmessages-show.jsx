/**
 * Created by lnelson on 3/22/2017.
 *
 */


import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Scheduledmessages} from '/lib/api/scheduledmessages/scheduledmessages';


class AdminScheduledMessagesShow extends React.Component {
    constructor() {
        super();
        this.state = { };
    }

     getAttr(item, attr) {
        let value = item[attr] ? item[attr] : "";
        return value;
    }

    render() {
        return (

            <div className="subcontainer">
                <table className="admin-table">
                    <tbody>

                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Expiration Date</th>
                        <th>Expiration Time</th>
                        <th>Sequence</th>
                        <th>Message</th>
                        <th>Tag</th>
                        <th>Scheduled</th>
                    </tr>

                    {this.props.items.map((item, index) =>
                        <tr key={10*index+0}>
                            <td key={10*index+1}>{this.getAttr(item, 'askDate')}</td>
                            <td key={10*index+2}>{this.getAttr(item, 'askTime')}</td>
                            <td key={10*index+3}>{this.getAttr(item, 'expireDate')}</td>
                            <td key={10*index+4}>{this.getAttr(item, 'expireTime')}</td>
                            <td key={10*index+5}>{this.getAttr(item, 'sequence')}</td>
                            <td key={10*index+6}>{this.getAttr(item, 'condition')}</td>
                            <td key={10*index+7}>{this.getAttr(item, 'text')}</td>
                            <td key={10*index+8}>{this.getAttr(item, 'tag')}</td>
                            <td key={10*index+9}>{this.getAttr(item, 'scheduled')}</td>
                        </tr>
                    )}



                    </tbody>
                </table>
            </div>
        );
    }
}

AdminScheduledMessagesShow.propTypes = {
    items: React.PropTypes.array,
    mlistExists: React.PropTypes.bool
};


function getScheduledMessagesQuery (props) {
    let query = {};
    if (props.tagFilter) {
        query['tag'] = props.tagFilter;
    }
    return query
}

//TODO: Renaming this container causes no end of grief for no good reason
export default TempContainer = createContainer(({tagFilter}) => {
    const props = {tagFilter}
    const allMessages = Scheduledmessages.find(getScheduledMessagesQuery(props));
    const count = allMessages.count();
    const mlistExists = !!allMessages;
    console.log("Subscribed, loading " + count + " scheduledmessages: " + mlistExists.toString());

    return {
        items: mlistExists ? allMessages.fetch() : [],
        mlistExists
    };
}, AdminScheduledMessagesShow);
