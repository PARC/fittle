/**
 * Created by lnelson on 3/08/2017.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Cards} from '../../../../lib/api/cards/cards';
import {Participants} from '../../../../lib/api/participants/participants.js';
import {DateHelper} from '../../../../lib/helpers.js';
import IFrameViewerContainer from '../../iframe-viewer.jsx';
import ReportPageScheduledActivityHeaderContainer from '../report-page-scheduled-activity-header.jsx';


function getStartDate(props) {
    let startDate = null;
    if (props.participant && (props.participant.challengeStartUTC || props.participant.studyStartUTC)) {
        startDate = props.participant.challengeStartUTC ? props.participant.challengeStartUTC : props.participant.studyStartUTC
    }
    return startDate
}


function getParticipantStartDate(participant) {
    let startDate = null;
    if (participant && (participant.challengeStartUTC || participant.studyStartUTC)) {
        startDate = participant.challengeStartUTC ? participant.challengeStartUTC : participant.studyStartUTC
    }
    return startDate
}


function getDayInStudy(props) {
    let startDate = null;
    if (props.participant && (props.participant.challengeStartUTC || props.participant.studyStartUTC)) {
        startDate = props.participant.challengeStartUTC ? props.participant.challengeStartUTC : props.participant.studyStartUTC
    }
    let timezone = props.userData.profile && props.userData.profile.timezone ? props.userData.profile.timezone : "0";
    timezone = parseInt(timezone);
    timezone = timezone === NaN ? 0 : timezone;
    return DateHelper.daysDiffInTimezone(startDate, timezone);
}


class Library extends React.Component {
    constructor() {
        super();
        this.state = {
            weekInStudy: null,
            dayInStudy: null,
            showInfoModal: false,
            card: null
        };
    }

    getDate(startDate) {
        const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        if (startDate) {
            return months[startDate.getMonth()] + ' ' + startDate.getDate();
        }
        return ""
    }

    // Where is this Participant in the challenge activities
    getDayInStudy(startDate) {
        let timezone = this.props.userData.profile && this.props.userData.profile.timezone ? this.props.userData.profile.timezone : "0";
        timezone = parseInt(timezone);
        timezone = timezone === NaN ? 0 : timezone;

        if (startDate) {
            this.state.dayInStudy = DateHelper.daysDiffUTC(startDate);
            this.state.weekInStudy = Math.floor(this.state.dayInStudy / 7) + 1;
        }

        return <p>&nbsp;{i18n.__("week-in-study")} {this.state.weekInStudy}</p>
    }

    getRow(cardRow, pinx) {
        console.log("getRow " + pinx);
        if (cardRow) {
            let rowList = [];
            let cinx = 0
            cardRow.forEach((card) => {
                console.log("getCard " + cinx);
                /*
                 <div className="rTableCell rTableRight" key={"CTCELL_" + pinx + "_" + (cinx++) }>
                        <div className="btn btn-history"
                             onClick={(e) => this.openModal(e, card)}
                        >
                            {card.name}
                        </div>
                    </div>
                */
                rowList.push(
                    <td
                        key={"CTCELL_" + pinx + "_" + (cinx++)}
                        style={{padding: 3 + 'vw'}}>
                        <div className="btn btn-history btn-library"
                             onClick={(e) => this.openModal(e, card)}>
                            {card.name}
                        </div>
                    </td>
                )
            });
            console.log(rowList);
            return (rowList)
        }
        return (<span></span>)

    }


    getCards(cards) {
        let listItems = [];
        let pinx = 1;

        const itemsPerRow = 4;
        let thisRow = 0;
        let itemsInThisRow = 0;

        let cardTable = [];
        let cardRow = [];
        let rowIndex = 0;
        let item = 0;

        cards.map((card) => {
            item++;
            console.log("Working on row " + rowIndex);
            console.log("Iteration " + item + ": Card " + card.name);
            itemsInThisRow++;
            if (card) {
                if (itemsInThisRow > itemsPerRow) {
                    console.log("Pushing Row " + (itemsInThisRow - 1));
                    cardTable.push(cardRow.slice());
                    itemsInThisRow = 1;
                    cardRow = [];
                    rowIndex++;
                    console.log("Pushing Item " + (itemsInThisRow - 1) + " of Row " + rowIndex);
                    cardRow.push(card);
                } else {
                    console.log("Pushing Item " + (itemsInThisRow - 1) + " of Row " + rowIndex);
                    cardRow.push(card);
                }
            }
        });
        if (itemsInThisRow > 0) {
            console.log("Pushing Row " + (itemsInThisRow - 1));
            cardTable.push(cardRow.slice());
        }

        console.log(cardTable);

        try {
            return (
                <table>
                    {cardTable.map((cardRow) => {
                        console.log("Computing row " + pinx);
                        /*
                         <div className="rTableRow" key={"CTCELL_" + pinx} >
                                {this.getRow(cardRow, pinx++)}
                            </div>
                        */
                        return (
                            <tr key={"CTCELL_" + pinx}>
                                {this.getRow(cardRow, pinx++)}
                            </tr>
                        )
                    })
                    }
                </table>
            )
        } catch (row_error) {
            console.log("ERROR: LibraryComponent " + row_error.message)
        }


        cards.forEach((card) => {
            if (card) {
                listItems.push(
                    <div className="rTableRow" key={"LROW_" + pinx++}>
                        <div className="rTableCell rTableRight">
                            <div className="btn btn-history"
                                 onClick={(e) => this.openModal(e, card)}
                            >
                                {card.name}
                            </div>
                        </div>
                    </div>
                );
            }
        });


        return (listItems);


    }


    openModal(e, card) {
        e.preventDefault();
        let url = (card && card.contentLink ? card.contentLink : "");
        if (url && url.length > 0) {
            this.setState({card: card});
            this.setState({url: url});
            this.setState({showInfoModal: true});
        }
    }

    onRequestClose() {
        this.setState({showInfoModal: false});
    }


    render() {
        //console.log("Tasks: " + JSON.stringify(this.props.tasks));

        let url = "";

        return (
            <div className="flex-vbox">
                <div className="history-text">
                    {this.getDayInStudy(this.props.startDate)}
                </div>
                <div className="history-text">
                    {this.getCards(this.props.cards)}
                </div>
                <IFrameViewerContainer showing={this.state.showInfoModal}
                                       sessionName='library-modal'
                                       url={this.state.url}
                                       title={''}
                                       closeFn={(e) => this.onRequestClose(e)}/>
            </div>
        );
    }
}


Library.propTypes = {
    userData: React.PropTypes.object,
    cards: React.PropTypes.array,
    participant: React.PropTypes.object,
    loading: React.PropTypes.bool,
    ploading: React.PropTypes.bool,
    startDate: React.PropTypes.instanceOf(Date)
};

export default LibraryContainer = createContainer(() => {
    let user = Meteor.user();
    let userId = user._id;
    console.log(">>> Create LibraryContainer" + " <<<");
    console.log("*** userId: " + userId);
    const collectionHandle = Meteor.subscribe('cards');
    const loading = !collectionHandle.ready();
    const pcollectionHandle = Meteor.subscribe('participants');
    const ploading = !pcollectionHandle.ready();

    let myCards = Cards.find();
    const count = myCards.count();
    console.log("Subscribed, loading " + count + " cards: ");
    const listExists = !loading && !!myCards;

    const participant = Participants.findOne({emailAddress: user.username});
    const startDate = getParticipantStartDate(participant);

    const userData = {
        profile: user.profile,
        username: user.username
    };

    return {
        userData,
        cards: listExists ? myCards.fetch() : [],
        participant,
        loading,
        ploading,
        startDate
    };
}, Library);
