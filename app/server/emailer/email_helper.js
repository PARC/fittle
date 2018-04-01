/*
 * created 7/19/17 by krivacic
 * Helper to send email messages in text and html formats
 */
import {Email} from 'meteor/email';

//let nodemailer = require('nodemailer');

/*
 * transporter is set to use a gmail account created for this
 */
const coachLocation = Meteor.settings.private.COACH_LOCATIONS[Meteor.settings.private.CURRENT_LOCATION];
console.log("INFO email_helper: Meteor.settings.private.CURRENT_LOCATION=" + Meteor.settings.private.CURRENT_LOCATION);
console.log("INFO email_helper: Meteor.settings.private.SEND_EMAIL_REMINDERS=" + JSON.stringify(Meteor.settings.private.SEND_EMAIL_REMINDERS));
console.log("INFO email_helper: Meteor.settings.private.COACH_LOCATIONS=");
console.log(coachLocation);
let transporterParams = {
    service: 'gmail',
    auth: {
        user: coachLocation.FROM_EMAIL_ADDRESS,
        pass: coachLocation.FROM_EMAIL_PS
    }
};

//let transporter = nodemailer.createTransport(transporterParams);

exports.sendTextAndHtmlEmail = function (emailAddress, subject, content, htmlContent, resultFn) {
    var options = {
        from: Meteor.settings.private.FROM_EMAIL_ADDRESS,
        to: emailAddress,
        subject
    };
    if (content) {
        options.text = content;
    }
    if (htmlContent) {
        options.html = htmlContent;
    }

    //transporter.sendMail(options, resultFn);
    // Directly use meteor's Email function, which does not have a callback capability
    // Instread manually invoke the callback by catching any exceptions thrown on the Email.send
    // But don't confuse this with exceptions casued by the callback itself.
    try {
        Email.send(options);
        try {
            resultFn(undefined, undefined);
        }
        catch (e) {
            console.log("ERROR: email_helper.sendTextAndHtmlEmail: " + e.msg)
        }
    } catch (err) {
        resultFn(err, undefined);

    }
};

/**
 * Send an email message to the given email address.
 */
exports.sendHtmlEmail = function (emailAddress, subject, htmlContent, resultFn) {
    sendTextAndHtmlEmail(emailAddress, subject, null, htmlContent, resultFn);
};

/**
 * Send an email message to the given email address.
 */
exports.sendTextEmail = function (emailAddress, subject, content, resultFn) {
    sendTextAndHtmlEmail(emailAddress, subject, content, null, resultFn);
};