/**
 * Created by krivacic on 4/3/2017.
 */
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Questions} from '/lib/api/questions/questions.js';
import {Participants} from '../../../lib/api/participants/participants';
import ReportPageScheduledActivityHeaderContainer from './report-page-scheduled-activity-header.jsx';
import {Log} from '/client/log';
import Datetime from 'react-datetime';
import {BADGE_REPORT} from '/lib/api/badges/badges';
import {DateHelper} from '/lib/helpers';

class QuestionsPage extends React.Component {

    getDefaultTime() {
        return {hour: "7", minute: "00", amPm: "AM", tzOffset: "-420"};
    }

    constructor() {
        super();
        this.state = {
            submitEnabled: false,
            radioSelected: false,
            textSelected: false,
            timeSelected: false,
            multiSelected: false,
            timeProps: this.getDefaultTime(),
            selected: [],
            multiSelectList: [],
        };
        this.radioButtons = [null, null, null, null, null, null, null, null, null, null, null];
        this.multiButtons = [null, null, null, null, null, null, null, null, null, null, null];
        this.textArea = '';
        this.singleOk = false;
    }

    submitEnableCheck() {
        let env = this;
        if (this.props.question) {
            _.defer(function () {
                let newState = env.state.radioSelected ||
                    env.state.textSelected ||
                    (env.props.question && (env.props.question.responseFormat === 'time')) ||
                    env.state.timeSelected ||
                    env.state.multiSelected;
                if (newState != env.state.submitEnabled) {
                    env.setState({submitEnabled: newState});
                }
            });
        }
    }

    selectTextInput(e) {
        let maxLen = this.props.question.props.maxLength || 99;
        if (e.target.value.length > maxLen) {
            e.target.value = e.target.value.substring(0, maxLen);
        }
        if (this.props.question && this.props.question.props && this.props.question.props.startWithChar) {
            if (e.target.value && e.target.value.length > 0 && !e.target.value.match(/^[a-z,A-Z]/)) {
                e.target.value = '';
            }
        }
        txt = e.target.value;
        this.setState({selectValue: txt});
        this.setState({textSelected: txt.length >= (this.props.question && this.props.question.props && this.props.question.props.minLength ? this.props.question.props.minLength : 0)});
        this.submitEnableCheck();
    }

    selectRadioButton(e, index) {
        let selected = [];
        selected[index] = true;
        this.setState({
            selectValue: this.props.question.choices[index],
            radioSelected: true,
            selected: selected
        });

        Log.logAction(Log.LOGACTION_QUESTION_RESPONSE,
            {
                type: 'radio',
                question: this.props.question,
                index, index, where: Log.LOGWHERE_QUESTION
            });

        this.state.selected = selected;
        this.submitEnableCheck();
        if (this.singleOk) {
            this.submitAnswer(e);
        }
        //this.forceUpdate();
    }

    checkSelectRadioButton(e, index) {
        let r = _.indexOf(this.state.selected, index);
        return r >= 0;
    }

    invertMultiButton(e, index) {
        e.preventDefault();
        let selectedOne = false;
        let selected = this.state.multiSelectList;
        if (!selected) {
            selected = [];
        }
        selected[index] = !selected[index];
        this.multiButtons[index].checked = selected[index];


        if (this.props.question.allowNone && index == this.props.question.choices.length && selected[index]) {
            // clear out all when none is selected
            _.forEach(selected, (choice, inx) => {
                if (inx != index) {
                    selected[inx] = false;
                    this.multiButtons[inx].checked = false;
                }
            });
        }

        if (this.props.question.allowNone && index != this.props.question.choices.length) {
            // clear out the none button
            selected[this.props.question.choices.length] = false;
            this.multiButtons[this.props.question.choices.length].checked = false;
        }

        _.forEach(selected, (choice, inx) => {
            if (choice) {
                selectedOne = true;
            }
        });

        Log.logAction(Log.LOGACTION_QUESTION_RESPONSE,
            {
                type: 'mutiple-choice',
                question: this.props.question,
                value: selected[index],
                index, index, where: Log.LOGWHERE_QUESTION
            });

        this.setState({multiSelectList: selected, multiSelected: selectedOne});
        this.submitEnableCheck();
        //this.forceUpdate();
    }

    submitAnswer(e) {
        // Prevent default browser form submit
        e.preventDefault();

        if (!this.state.submitEnabled) {
            return
        }

        const responseFormat = this.props.question.responseFormat;
        const choices = this.props.question.choices;
        var answer = '';

        if (responseFormat === 'text') {
            answer = this.state.selectValue;
            this.textArea.value = '';
        }
        else if (responseFormat === 'time') {
            let time = this.timeSelected;
            answer =
                time.hour +
                ":" + time.minute;
            Meteor.call('setClientTimezone', time.tzOffset);
        }
        else if (responseFormat === 'list-choose-multiple') {
            answer = [];
            _.forEach(this.state.multiSelectList, (ans, inx) => {
                if (ans) {
                    answer.push(inx);
                }
            });
            //_.forEach(this.multiButtons, (b)=>{if (b) {b.checked=false;}})
            answer = answer.join(',');
            for (let i = 0; i < this.state.multiSelectList.length; i++) {
                this.state.multiSelectList[i] = null
            }
        }
        else if (responseFormat === 'list-choose-one') {
            //_.forEach(this.radioButtons, (b)=>{if (b) {b.checked=false;}})
            answer = this.state.selectValue;
        }
        console.log("INFO Answer: " + answer);
        // Update a queston with an answer
        Meteor.call("answerQuestion", this.props.question._id, answer);

        Log.logAction(Log.LOGACTION_QUESTION_RESPONSE,
            {
                type: 'final-answer',
                question: this.props.question,
                answer
            });
        this.setState({
            selected: {},
            submitEnabled: false,
            radioSelected: false,
            textSelected: false,
            timeSelected: false,
            multiSelected: false
        });
    }

    toDig(val, len) {
        let res = val.toString();
        while (res.length < len) {
            res = '0' + res;
        }
        return res;
    }

    timeChange(timeMoment) {
        let hrs = this.toDig(timeMoment.hours(), 2);
        let mins = this.toDig(timeMoment.minutes(), 2);
        this.timeSelected = {
            hour: hrs.toString(),
            minute: mins.toString(),
            tzOffset: timeMoment.utcOffset().toString()
        };
        Log.logAction(Log.LOGACTION_QUESTION_RESPONSE,
            {
                type: 'time-picker',
                question: this.props.question,
                value: this.timeSelected, where: Log.LOGWHERE_QUESTION
            });
    }

    setDateHours(timeObj) {
        let dateObj = new Date();
        dateObj.setHours(parseInt(timeObj.hour));
        dateObj.setMinutes(parseInt(timeObj.minute));
        this.timeSelected = timeObj;
        return dateObj;
    }


    render() {
        this.singleOk = false;

        function chooseOneItem(parent, choice, key) {
            return (
                <label key={key}
                       className={"flex-question-item btn btn-default report-question-button" + (parent.state.selected[key] ? " btn-checked" : "") }>
                    <input name="questionAnswerRadio" className="report-question-radio" type="radio"
                           value={choice} required onClick={(e) => parent.selectRadioButton(e, key)}
                           aria-required="true"
                           ref={el => parent.radioButtons[key] = el}
                    >
                    </input>
                    {choice}
                </label>
            );
        }

        function chooseMultipleItems(parent, choice, key) {
            return (
                <label key={key}
                       className={"flex-question-item btn btn-default report-question-button" + (parent.state.multiSelectList[key] ? " btn-checked" : "") }>
                    <input name="questionAnswerCheckbox" className="report-question-checkbox" type="checkbox"
                           value={choice} required onClick={(e) => parent.invertMultiButton(e, key)}
                           aria-required="true"
                           ref={el => parent.multiButtons[key] = el}
                    >
                    </input>
                    {choice}
                </label>

            );
        }

        function chooseTextItem(parent, question) {
            return (
                <label className={"flex-item btn btn-default btn-block btn-black-text"}>
                    <div
                        className="question-center-label">{question.props.textLabel || i18n.__('your-answer')}: &nbsp;&nbsp;</div>
                    <form onSubmit={(e) => parent.submitAnswer(e)}>
                        <input className="questionTextInputWidth" type="text"
                               placeholder={question.props.textPlaceholder || i18n.__('answer-goes-here')}
                               onChange={(e) => parent.selectTextInput(e)}
                               ref={el => parent.textArea = el}
                        />
                    </form>
                </label>
            );
        }

        function chooseTimeItem(parent) {
            let timeObj = parent.state.timeSelected ? parent.state.timeSelected : parent.getDefaultTime();
            let date = parent.setDateHours(timeObj);

            return (
                <div>
                    <Datetime dateFormat={false} defaultValue={date} onChange={(e) => parent.timeChange(e)}/>
                </div>
            );
        }

        function getQuestionBody(parent, question) {
            if (question.responseFormat === 'text') {
                return chooseTextItem(parent, question);
            } else if (question.responseFormat === 'time') {
                return chooseTimeItem(parent);
            } else {
                let answerList = [];
                if (question.responseFormat === 'list-choose-multiple') {
                    question.allowNone = true;
                }

                if (question.responseFormat === 'list-choose-one' && question.choices.length === 1) {
                    parent.singleOk = true;
                }
                _.forEach(question.choices, (choice, index) => {
                    if (question.responseFormat === 'list-choose-one') {
                        answerList.push(chooseOneItem(parent, choice, index))
                    } else if (question.responseFormat === 'list-choose-multiple') {
                        answerList.push(chooseMultipleItems(parent, choice, index))
                    }
                });
                if (question.allowNone) {
                    answerList.push(chooseMultipleItems(parent, "None of the above", question.choices.length));
                }
                return answerList;
            }
            return (<span></span>);
        }

        function getAfterword(question) {
            if (question.afterword)
                return <p className="report-question-text multiline">{question.afterword}</p>;
            return (<span></span>);
        }

        function getModalFrame(parent, question) {
            if (question) {
                return (
                    <div className="flex-row-container" id="report-questions-area">
                        <label className="report-question-text multiline">{question.text}</label>
                        <div className="flex-question-container">
                            {getQuestionBody(parent, question)}
                        </div>

                        <div className="flex-item coach-full">

                            <div className="coachLeft">
                                {parent.singleOk ? undefined :
                                    <button type="button"
                                            className="btn btn-primary btn-submit coach-submit-button"
                                            disabled={!parent.state.submitEnabled}
                                            onClick={(e) => {
                                                parent.submitAnswer(e)
                                            }}>
                                        {i18n.__('button-submit')}
                                    </button>
                                }
                            </div>
                            <div className="coachCenter">{getAfterword(question)}</div>

                        </div>
                        <div className="coach-background">
                            <img className="coach-image" src="parccoach.svg"/>
                        </div>
                    </div>
                );
            } else {
                return <span></span>;
            }
        }

        function getModalFooter(parent, question) {
            return <span></span>;
            /*
             if (question) {
             return (<div className="coach-background">
             <img className="coach-image" src="parccoach.svg"/>
             </div>);
             } else {
             return <span></span>;
             }
             */
        }

        this.submitEnableCheck();

        if (this.props.question) {
            Log.logEvent(Log.LOGEVENT_QUESTION_SHOW, {question: this.props.question, where: Log.LOGWHERE_QUESTION})
        }

        if (this.props.holdOff && this.props.question) {
            // create a badge if in a holdoff
            console.log("INFO Create a badge notification");
            Meteor.call('createBadgeNotifications', Meteor.userId(), Meteor.userId(), BADGE_REPORT, '', {});
        } else if (this.props.question) {
            Meteor.call('clearMyBadgeNotifications', BADGE_REPORT, '');
        }


        return (
            <ModalBoxContainer showModal={this.props.question ? !this.props.holdOff : false}
                               title={''}
                               modalComponent={getModalFrame(this, this.props.question)}
                               modalFooter={getModalFooter(this, this.props.question)}
                               noExitCheck="true"
                               closeFn={(e) => this.onCloseFn(e)}/>
        );

    }
}


QuestionsPage.propTypes = {
    question: React.PropTypes.object,
    holdOff: React.PropTypes.bool,
    keyboardOpen: React.PropTypes.bool,
};


/**
 * Make a string replacement using Participant data into the reminderText
 * @param participant
 * @param content
 * @returns {format}
 */
function format(participant, content) {
    if (participant && participant.preferences) {
        let attributeList = Object.keys(participant.preferences);
        for (let i = 0; i < attributeList.length; i++) {
            content = content.replace(
                '{{' + attributeList[i] + '}}',
                participant.preferences[attributeList[i]]);
        }
    }
    return content;
}


export default QuestionsPageContainer = createContainer(({userName, holdOff}) => {
    const props = {username: userName, answered: false};
    const questionHandle = Meteor.subscribe('questions', props);
    //const pprops = {emailAddress: userName};
    const participantHandle = Meteor.subscribe('participants');
    const participantIsReady = participantHandle.ready();
    const now = new Date().getTime();

    let participant = Participants.findOne();

    let timeTravelInDays = 0;
    if (participant) {
        timeTravelInDays = DateHelper.daysDiff(participant.challengeStartUTC, participant.studyStartUTC);
    }
    //const askDatetime = new Date(now - timeTravelInDays * 24 * 60 * 60 * 1000);
    //const expireDatetime = new Date(now - timeTravelInDays * 24 * 60 * 60 * 1000);
    const askDatetime = new Date(now);
    const expireDatetime = new Date(now);


    let q = null;
    if (participant) {
        if (!userName || userName.length < 1) {
            Session.set('questionReady', false);
        }
        q = Questions.findOne(
            {
                username: userName,
                askDatetime: {$lte: askDatetime},
                expireDatetime: {$gte: expireDatetime},
                answered: false
            },
            {sort: {sequence: 1}}
        );
        if (q) {
            q.text = format(participant, q.text);
        }
        Session.set('questionReady', _.isObject(q));
    } else {
        Session.set('questionReady', false);
    }

    return {
        question: q,
        holdOff,
        keyboardOpen: Session.get('keyboard-open') === 'true'
    };
}, QuestionsPage);
