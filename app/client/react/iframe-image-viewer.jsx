

import {Meteor} from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ModalBoxContainer from './modal-box';

// App component - represents the whole app
class IFrameImageViewer extends React.Component {

    render() {

        function xgetIFrame(url) {
            return (<iframe src={url}
                            width="100%"
                            height="100%"/>
            );
        }
        function getIFrame(url) {
            return (
                <div className="flex-container  iframe-img2">
                    <img className="media-img2"
                        src={url}
                    />
                </div>
            );
        }
        function showIt(modalName) {
            return Session.get(modalName);
        }

        return (
            <div className="container flex-container">
                <ModalBoxContainer showModal={this.props.showing}
                                   modalComponent={getIFrame(this.props.url)}
                                   width="100%"
                                   height="97%"
                                   closeFn={(e) => this.props.closeFn(e)}/>
            </div>
        );

    }

};

IFrameImageViewer.propTypes = {
        showing: React.PropTypes.bool,
        url: React.PropTypes.string,
        sessionName: React.PropTypes.string,
};

export default IFrameImageViewerContainer = createContainer(({showing, sessionName, url, closeFn}) => {
    return {showing, sessionName, url, closeFn};
}, IFrameImageViewer);

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
