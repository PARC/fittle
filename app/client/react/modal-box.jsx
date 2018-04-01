/**
 * Created by krivacic on 4/3/2017.
 */
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Modal from 'react-modal';

class ModalBox extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {

        function exitCheck(myThis) {
            if (myThis.props.noExitCheck) {
                return (<span></span>);
            }
            return (
                <div className="modal-exit-check">
                <img  src="/navigation-icons/home.svg" onClick={myThis.props.closeFn}>
                </img>
                </div>
            );
        }

        function getModalHeader(myThis) {
            if (myThis.props.title && myThis.props.title.length>0) {
                return (
                <div className="modal-header">
                    <span className="modal-title">{myThis.props.title}</span>
                    {exitCheck(myThis)}
                </div>);
            }
            return exitCheck(myThis);
        }

        function getModalFooter(footer) {
            if (footer) {
                return footer;
            }
            return <span></span>
        }

        if (this.props.showModal) {
            return (
                <Modal isOpen={this.props.showModal}
                       contentLabel="Activity Info">
                        <div className={"modal-content " + (this.props.errorModal ? 'modal-error' : '')} >
                            {getModalHeader(this)}
                            <div className="modal-body">
                                {this.props.modalComponent}
                            </div>
                            {getModalFooter(this.props.modalFooter)}
                        </div>
                </Modal>
            );
        }
        return <span></span>
    }
};

ModalBox.propTypes = {
    showModal: React.PropTypes.bool,
    modalComponent: React.PropTypes.object,
    modalFooter: React.PropTypes.object,
    title: React.PropTypes.string
};

export default ModalBoxContainer = createContainer(({showModal, title, modalComponent, modalFooter, closeFn, errorModal, noExitCheck}) => {
    return {
        showModal,
        modalComponent,
        modalFooter,
        title,
        closeFn,
        noExitCheck,
        errorModal
    };
}, ModalBox);
