

import {Meteor} from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// App component - represents the whole app
class IFrameViewer extends React.Component {

    render() {

        function getIFrame(url) {
            return (<iframe src={url}
                            width="100%"
                            height="100%"/>
            );
        }
        function showIt(modalName) {
            return Session.get(modalName);
        }

        return (
            <div className="container flex-container">
                <ModalBoxContainer showModal={this.props.showing}
                                   title={this.props.title}
                                   modalComponent={getIFrame(this.props.url)}
                                   width="100%"
                                   height="97%"
                                   closeFn={(e) => this.props.closeFn(e)}/>
            </div>
        );

    }

};

IFrameViewer.propTypes = {
        showing: React.PropTypes.bool,
        url: React.PropTypes.string,
        title: React.PropTypes.string,
        sessionName: React.PropTypes.string,
};

export default IFrameViewerContainer = createContainer(({showing, sessionName, url, title, closeFn}) => {
    return {showing, sessionName, url, title, closeFn};
}, IFrameViewer);