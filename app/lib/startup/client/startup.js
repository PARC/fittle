/**
 * File contains work to be done on the client whenever the app starts.
 */

import {Roles} from 'meteor/alanning:roles';
import {EVENTS} from '/lib/api/studyevents/studyevents';
import {ConnectionHelpers} from '/client/lib/connectionHelper';
import {LanguageHelpers} from '/client/lib/languageHelper';
import {Meteor} from 'meteor/meteor';
import {Log} from '/client/log';
import ReactBasePageContainer from '/client/react/react-base-page.jsx'
import React from 'react';
import { render } from 'react-dom';
import moment from 'moment-timezone';
import {NavigationHelper} from '/client/lib/client.navigation.helpers';


function secs() {
    return Math.floor(new Date().getTime() / 1000);
}

Meteor.startup(function () {

    console.log("Client is starting... " + secs());

    Push.Configure({
        android: {
            senderID: 455365303431,
            alert: true,
            badge: true,
            sound: true,
            vibrate: true,
            clearNotifications: true
            // icon: '',
            // iconColor: ''
        },
        ios: {
            alert: true,
            badge: true,
            sound: true
        }
    });

    console.log('DEBUG Add Push Listeners');
    // Internal events
    Push.addListener('token', function(token) {
        // Token is { apn: 'xxxx' } or { gcm: 'xxxx' }
        console.log("INFO Push event token " + JSON.stringify(token))
    });

    Push.debug = true;

    Push.addListener('error', function(err) {
        if (err.type == 'apn.cordova') {
            console.log("INFO Push Notification Error " + err.error);
        }
    });

    Push.addListener('register', function(evt) {
        // Platform specific event - not really used
        console.log("INFO Push event register " + JSON.stringify(evt))
    });

    Push.addListener('alert', function(notification) {
        // Called when message got a message in forground
        console.log("INFO Push event alert " + JSON.stringify(notification))
    });

    Push.addListener('sound', function(notification) {
        // Called when message got a sound
        console.log("INFO Push event sound " + JSON.stringify(notification))
    });

    Push.addListener('badge', function(notification) {
        // Called when message got a badge
        console.log("INFO Push event badge " + JSON.stringify(notification))
    });

    Push.addListener('startup', function(notification) {
        // Called when message recieved on startup (cold+warm)
        console.log("INFO Push event startup " + JSON.stringify(notification))
    });

    Push.addListener('message', function(notification) {
        // Called on every message
        console.log("INFO Push event message " + JSON.stringify(notification))
    });

    console.log('INFO Added Push Listeners');

    Log.logEvent(Log.LOGEVENT_APP_START, {});

    // bring in from client.js
    Session.set('registrationFeedback', '');
    Session.set('loginFeedback', '');
    let defaultLogin = Session.get('defaultLogin');
    if (defaultLogin) {
        console.log("**** Got defaultLogin " + defaultLogin);
        Session.defaultLogin = defaultLogin;
    }

    console.log("**** Got user " + Meteor.user());
    if (Meteor.user()) {JSON.stringify(console.log(Meteor.user()));}
    console.log("**** Logging in: " + Meteor.loggingIn());
    console.log("**** Been registered " + Session.get('hasRegistered'));

    console.log("userLanguage: " + window.navigator.userLanguage);
    //console.log("other: " + window.navigator.languag);

    if(typeof navigator.globalization !== "undefined") {
        // get language from cordova plugin
        let myLanguage = window.navigator.userLanguage || window.navigator.language;
        console.log("*** language: " + myLanguage);
        if (myLanguage) {
            Session.set('phoneLanguage', myLanguage.split("-")[0]);
        }
    }
    LanguageHelpers.setLanguage();
    Session.set('connection', Meteor.status().status);

    // Essentially registering a listener so this given method executes whenever
    // <code>Roles.subscription</code> changes.
    Tracker.autorun(function () {
        //--------------------
        // Init routes
        //--------------------
        if (ConnectionHelpers.isConnected() || ConnectionHelpers.isWaiting()) {
            console.log("Connection is connected = " + ConnectionHelpers.isConnected() + ", waiting = " + ConnectionHelpers.isWaiting())
            if (ConnectionHelpers.isConnected()) {
                Session.set('connection', Meteor.status().status);
                if (Meteor.user()) {
                    console.log("httpSendToAllAgents");
                    Meteor.call("httpSendToAllAgents", 'ClientStart', EVENTS.START, Meteor.user().username, {event: 'startup'});
                    if (Meteor.userId()) {Meteor.call("setClientTimezone", moment().utcOffset().toString());}
                }
            } else {
                console.log("Connection waitForConnectionBeforeInitingRoutes");
                waitForConnectionBeforeInitingRoutes();
            }
        }
        else if (ConnectionHelpers.isOffline()) {
            waitForConnectionBeforeInitingRoutes();
        }
    });

    /* Set up to allow informing any listening coaches of App start/stop events
     * How to get cordova events:
     * https://cordova.apache.org/docs/en/latest/cordova/events/events.html#pause
     * https://forums.meteor.com/t/cordova-onresume-event/5463
     *
     * The deviceready event fires when Cordova is fully loaded.
     * The resume event fires when the native platform pulls the application out from the background.
     * The pause event fires when the native platform puts the application into the background
     *
     */
    console.log("Rendering ReactBasePage into app");

    Session.set('page','home');
    render(<ReactBasePageContainer />, document.getElementById('app'));

});

let timeouts = 0;

/**
 * Handle case where app isn't connected to the server but isn't offline. Waits a set period of time for the server
 * to become reachable. If the server becomes reachable, initialize the routes. If timeout is reached, do something
 * else.
 */
function waitForConnectionBeforeInitingRoutes() {

    // Time to wait for a connection before giving up
    const ROUTE_INIT_TIMEOUT = 3000;

    Meteor.setTimeout(function () {
        console.log("Timeout: " + timeouts + ", connection: " + Meteor.status().status);
        if (ConnectionHelpers.isWaiting()) {
            if (timeouts < 10) {timeouts = timeouts + 1;}
            if (timeouts > 3 && Session.get('connection') !== 'waiting') {
                Session.set('connection', 'waiting');
            }
        } else {
            if (ConnectionHelpers.isConnected()) {timeouts = 0;}
            Session.set('connection', Meteor.status().status);
        }
        if (!ConnectionHelpers.isConnected()) {
            Meteor.setTimeout(waitForConnectionBeforeInitingRoutes, ROUTE_INIT_TIMEOUT*10);
        }
        // else => we assume everything is good.
    }, ROUTE_INIT_TIMEOUT);

}

/**
 *  get handle on Android back button, to close modal windows or just disable it
 */
console.log("Adding backbutton event listener");

function clearAllModals() {
    if (Session.get('show-error-modal')) {
        NavigationHelper.closeLocalModalError(Log.LOGWHERE_BACK);
    } else if (Session.get('show-iframe')) {
        NavigationHelper.closeIFrame(Log.LOGWHERE_BACK);
    } else if (Session.get('show-profile')) {
        NavigationHelper.closeProfile(Log.LOGWHERE_BACK);
    } else if (Session.get('show-iframe-image')) {
        NavigationHelper.closeIFrameImage(Log.LOGWHERE_BACK);
    } else {
        Log.logAction(Log.LOGACTION_CATCH_BACK_BUTTON, {});
    }
    if (Session.get('wait-mode') === 'true') {
        Session.set('wait-mode', 'false');
    }
}

function onBackButtonDown(event) {
    console.log("Got the back button event");
    event.preventDefault();
    event.stopPropagation();
    // For now, we can close all modals controlled by 'Session'
    clearAllModals();
    console.log("Cleared session info 2");
}

function onPause() {
    Log.logEvent(Log.LOGEVENT_APP_PAUSE, {});
}

function onResume() {
    Log.logEvent(Log.LOGEVENT_APP_RESUME, {});
}

clearAllModals();

Session.set('keyboard-open', 'false');

function onKeyboardHide() {
    console.log('onKeyboardHide');
    Session.set('keyboard-just-closed', 'true');
    Session.set('keyboard-open', 'false');
}

function onKeyboardShow() {
    console.log('onKeyboardShow');
    Session.set('keyboard-just-closed', 'false');
    Session.set('keyboard-open', 'true');
}

if (Meteor.isCordova) {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("backbutton", onBackButtonDown, false);
    window.addEventListener('native.keyboardhide', onKeyboardHide);
    window.addEventListener('native.keyboardshow', onKeyboardShow);
}
