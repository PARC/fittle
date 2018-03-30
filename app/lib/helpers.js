import {date, now} from 'meteor/remcoder:chronos';
import {Accounts} from 'meteor/accounts-base';

// Import npm 'moment-timezone' package, and bind to a more desirable name.
import moment from 'moment-timezone';
const Moment = moment;


//======================================================================================================================
// Date Helpers
//======================================================================================================================

/** String describing the standard date format used in the backend. */
const STND_DATE_FORMAT = 'YYYY-MM-DD';
const STND_DATE_NO_YEAR_FORMAT = 'MM/DD';

const STND_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const STND_TIMEZONE_OFFSET = -5; // Hours


/**
 * Check the given string represents a date in the [standard format]{@link helpers#STND_DATE_FORMAT}.
 * @private
 * @version 27 Oct. 2016
 * @param {string} dateString - Represents a date.
 * @returns {boolean}
 */
export function __isDateStringInStandardFormat(dateString) {
    // Check a valid argument is provided, otherwise we'll have unexpected behavior.
    if (dateString === null){
        throw TypeError("Expected non-null value.");
    }
    return Moment(dateString, STND_DATE_FORMAT).isValid();
}

/**
 * Generates a string representation of the given date-time in the specified timezone.
 * @version 28 Oct 2016
 * @param {Date} datetime - UTC datetime.
 * @param {string} timezoneOffset - Valid timezone offset. See [Wikipedia]{@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones}
 * for list of valid timezone names.
 * @return {Date}
 */
export function convertDateTimeStringToStandardFormat(datetime, timezoneOffset) {
    // Check a valid argument is provided, otherwise we'll have unexpected behavior.
    if (datetime === null){
        throw TypeError("Expected non-null Date object.");
    }
    const tzo = parseInt(timezoneOffset);
    // Confirm the timezone name is valid, otherwise we'll have unexpected behavior.
    if (isNaN(parseInt(tzo))) {
        throw TypeError("Invalid timezone offset provided.");
    }
    const momentObj = moment.utc(datetime).utcOffset(tzo);
    return momentObj.format(STND_DATETIME_FORMAT);
}

/**
 * Generates a Date object by interpreting the given string as a date in the given timezone.
 * @version 1 Nov 2016
 * @param {string} datetimeString
 * @param {string} timezoneOffset - Valid timezone offset. See [Wikipedia]{@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones}
 * for list of valid timezone names.
 * @return {Date}
 */
export function convertStringToDate(datetimeString, timezoneOffset) {
    const parseInStrictMode = true;
    if (moment(datetimeString, STND_DATETIME_FORMAT, parseInStrictMode).isValid() === false){
        throw TypeError("Must provide a valid time string.");
    }
    const tzo = parseInt(timezoneOffset);
    // Confirm the timezone name is valid, otherwise we'll have unexpected behavior.
    if (isNaN(parseInt(tzo))) {
        throw TypeError("Invalid timezone offset provided.");
    }

    return moment.utc(datetimeString).utcOffset(tzo, true).toDate();
}


/**
 * Convert given date  into the app's standard datetime string format.
 * @return {string}
 */
export function convertDateToStandardDatetimeFormat(datetime) {
    //TODO: in a rush, need to fix this to proper formatting
    return datetime._d;
}


/**
 * @param {string} dateString -
 * @param {string} format -
 * @return {string}
 * @author Michael Silva
 */
export function getLocalDateWithFormat(dateString, format, timezoneOffset) {
    let momentObj = Moment.utc(dateString, 'MM-DD-YYYY');
    let date = momentObj.toDate();
    return midnightOnDate(date, timezoneOffset.toString());
}



/**
 * @param {Date} date -
 * @param {string} format -
 * @return {string}
 * @author Michael Silva
 */
export function localizedDateWithFormat(date, format) {
    return Moment(date).format(format);
}


/**
 * @param {Date} date -
 * @param {string} format -
 * @return {string}
 * @author Michael Silva
 */
export function localizedDateMidnightWithFormat(date, format) {
    return Moment(date).utc().startOf('day').format(format);
}

/**
 * Returns a Date object set to midnight UTC.
 * <p><b>Attention</b> The returned object is set to midnight UTC, not midnight local time.</p>
 * @version 09 November 2016
 *
 * @example
 * // If called on Thur, 3 Nov 2016 @ 7:10:19 PM (PDT)
 * // date.toString() is "Wed Nov 02 2016 17:00:00 GMT-0700 (PDT)"
 * // date.toUTCString() is "Thu, 03 Nov 2016 00:00:00 GMT"
 * const date = utcDateLastMidnight();
 *
 * @returns {Date}
 */
export function utcDateLastMidnight() {
    const dateObj = new Date();
    dateObj.setUTCHours(0, 0, 0, 0);
    return dateObj;
}

/**
 * Returns a <tt>Date</tt> representing midnight in the given timezone.
 *
 * @example
 * // If called on Thur, 3 Nov 2016 @ 7:10:19 PM (PDT)
 * // date.toString() is "Thu Nov 03 2016 00:00:00 GMT-0700 (PDT)"
 * // date.toUTCString() is "Thu, 03 Nov 2016 07:00:00 GMT"
 * const date = midnight("US/Pacific");
 *
 * @param {String} timezoneName
 * @return {Date}
 */
export function midnight(timezoneOffset){
    const tzo = parseInt(timezoneOffset);
    // Confirm the timezone name is valid, otherwise we'll have unexpected behavior.
    if (isNaN(parseInt(tzo))) {
        throw TypeError("Invalid timezone offset provided.");
    }

    const momentObj = moment.utcOffset(tzo);
    momentObj.hours(0).minutes(0).seconds(0).milliseconds(0);
    return momentObj.toDate();
}


/**
 * Create a date object set to midnight on the given day in the given timezone.
 *
 * The function works by first interpreting the date argument as a specific point in time
 * in the given timezone. Then its year, month, and day information is copied into a new date
 * object. The new date object is then set to midnight in the given timezone, and returned.
 *
 * @version 09 Nov 2016
 *
 * @param {Date} date
 * @param {String} timezoneOffset - Valid timezone offset in minutes.
 * @return {Date} - New Date object set to midnight in the specified timezone.
 * @throws {TypeError} if an argument is invalid.
 */
export function midnightOnDate(thisdate, timezoneOffset) {
    // Confirm the date argument was provided, otherwise we'll have unexpected behavior.
    if (thisdate === null){
        throw TypeError("Invalid date provided.");
    }

    // Get timezone offset for client timezone
    const tzo = parseInt(timezoneOffset);
    // Get timezone offset in this context (could be server, could be client)
    let d = new Date();
    let this_tzo = d.getTimezoneOffset();

    // Confirm the timezone name is valid, otherwise we'll have unexpected behavior.
    if (isNaN(parseInt(tzo))) {
        throw TypeError("Invalid timezone offset provided.");
    }

    let dobj = new Date(thisdate.getTime());
    // Convert to UTC
    let d_utc = new Date(dobj.getTime() + 60*1000*this_tzo);

    let date = d_utc.getDate();
    let month = d_utc.getMonth();
    let year = d_utc.getFullYear();
    let utc_midnight = Date.UTC(year, month, date,0,0,0);
    let date_midnight = new Date(utc_midnight-60*1000*tzo);

    return date_midnight;

    //const momentObj = moment(date).utcOffset(tzo);
    //momentObj.hours(0).minutes(0).seconds(0).milliseconds(0);
    //return momentObj.toDate();
}


/**
 * Useful for querying from collections.
 * @param {string} format - Desired date format (e.g., "YYYY-MM-DD")
 * @return {string} Formatted date string
 * @author Michael Silva
 */
export function localizedNowWithFormat(format) {
    return localizedDateWithFormat(new Date(), format);
}


/**
 * @return {Date} Date and time according to system settings.
 * @author Michael Silva
 */
export function localizedNow() {
    return new Date();
}

/**
 * @return {Date} Date and time according to system settings and default timezone.
 * @author Michael Silva
 */
export function standardTimezoneDate(date) {
    //This computation should put things in US Central time regardless of what timezone the server is in
    var d = new Date()
    var n = d.getTimezoneOffset();
    return Moment(date).utc().subtract(STND_TIMEZONE_OFFSET, 'hours').subtract(n, 'minutes').utc().toDate();
}


/**
 *
 * @param dateString {string}
 * @param numDaysToAdd {Number}
 * @return {string} representing the date with number of days added. Date format is not changed.
 */
export function addDaysToDate(dateString, numDaysToAdd) {

    if (__isDateStringInStandardFormat(dateString) === false) {
        throw "The date string \"%s\" is in an invalid format. Please convert to standard format: %s";
    }
    return Moment(dateString).add(numDaysToAdd, 'days');
}



/**
 *
 * @param dateString {string}
 * @param numHoursToAdd {Number}
 * @return {string} representing the date with number of hours added. Date format is not changed.
 */
export function addHoursToDate(dateString, numHoursToAdd) {

    if (__isDateStringInStandardFormat(dateString) === false) {
        throw "The date string \"%s\" is in an invalid format. Please convert to standard format: %s";
    }
    return Moment(dateString).add(numHoursToAdd, 'hours');
}


/**
 *
 * @param dateString {string}
 * @param numMinutesToAdd {Number}
 * @return {string} representing the date with number of hours added. Date format is not changed.
 */
export function addMinutesToDate(dateString, numMinutesToAdd) {

    if (__isDateStringInStandardFormat(dateString) === false) {
        throw "The date string \"%s\" is in an invalid format. Please convert to standard format: %s";
    }
    return Moment(dateString).add(numMinutesToAdd, 'minutes');
}


/**
 *
 * @param dateString {string}
 * @param timeString {Number}
 * @return {string} representing the date with number of hours added. Date format is not changed.
 */
export function addHoursAndMinutesToDate(dateString, timeString) {

    if (__isDateStringInStandardFormat(dateString) === false) {
        throw "The date string \"%s\" is in an invalid format. Please convert to standard format: %s";
    }
    try {
        var hours = 0;
        var minutes = 0;
        if (timeString) {
            var hours_minutes = timeString.split(':');
            if (hours_minutes.length === 2) {
                hours = Number(hours_minutes[0]);
                minutes = Number(hours_minutes[1]);
            }
        }
        var adjusted = Moment(dateString).add(minutes, 'minutes');
        adjusted = adjusted.add(hours, 'hours');
        return adjusted;
    } catch (err) {
        console.log('Warn: addHoursAndMinutesToDate ' + err.message)
        return Moment(dateString)
    }
}


/**
 * Adds hours and minutes to a date.
 *
 *
 * @examples
 * addHoursAndMinutesToDateObject(new Date(), "1:0");
 * addHoursAndMinutesToDateObject(new Date(), "1000:0");
 * addHoursAndMinutesToDateObject(new Date(), "0:1000");
 * addHoursAndMinutesToDateObject(new Date(), "10:00001");
 *
 * @version 28 Oct 2016
 * @param {Date} dateObject - Value to which hours and minutes will be added.
 * @param {string} timeString - String representing the number of hours and minutes to be added (separated by a colon).
 * @return {Date}
 */
export function addHoursAndMinutesToDateObject(dateObject, timeString) {
    // Throw an error if missing time string argument.
    if (timeString === null){
        throw TypeError("Must provide a non-null time string.");
    }

    // Check the time string format is valid. Prevents unexpected behavior
    const stringNotFound = -1;
    if (timeString.search(/^\d{1,4}:\d{1,4}$/) === stringNotFound){
        throw TypeError("Invalid time string.");
    }

    // Try parsing the time string
    let hours = 0, minutes = 0;
    try {
        var hours_minutes = timeString.split(':');
        if (hours_minutes.length === 2) {
            hours = Number(hours_minutes[0]);
            minutes = Number(hours_minutes[1]);
        }
    } catch (err) {
        // Log then rethrow the error
        console.log('Error: addHoursAndMinutesToDateObject ' + err.message);
        throw err;
    }

    // Perform the date arithmetic
    const adjustedDateObj = new Date(dateObject.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
    //adjustedDateObj.setMinutes( adjustedDateObj.getMinutes() + minutes );
    //adjustedDateObj.setHours( adjustedDateObj.getHours() + hours);
    return adjustedDateObj;
}


/**
 * Calculate the number of <i><b>complete</b></i> days between the given date and now.
 * <p><b>Note:</b> Calculations are performed using UTC values.</p>
 * @todo Add unit tests.
 * @version 1 Nov 2016
 * @param {Date} previousDate - A date in the past.
 * @return {number}
 */
export function daysSince(previousDate) {
    // Throw an error if missing argument to prevent unexpected behavior.
    if (previousDate === null){
        throw TypeError("Must provide a previous date argument.");
    }
    if (previousDate instanceof Date === false){
        throw TypeError("Expected argument to be a Date object.");
    }
    // Perform the calculation, ignoring fractions of days.
    const parseInStrictMode = false;
    const now = moment.tz("Universal");
    return now.diff(previousDate, 'days', parseInStrictMode);
}


/**
 * A reactive version of daysSince. Updating automatically how many days
 * since a previous date
 * @param previousDate
 */
export function reactiveDaysSince(previousDate) {
    return Chronos.moment().startOf('day').diff(Chronos.moment(previousDate).startOf('day'), 'days');
}

/**
 * A reactive version of localized now. Updating automatically
 */
export function reactiveLocalizedNowWithFormat(format) {
    return Chronos.moment().format(format);
}

export function timeBefore(timeString, minutesBefore) {
    return new Moment(timeString, 'hh:mm A').subtract({minutes: parseInt(minutesBefore)}).format('HH:mm');
}

/**
 * Retrieve given user's preferred timezone. Assumes an account with the given email address already exists.
 * @public
 * @version 08 Nov 2016
 * @param {String} emailAddress - Email address associated with an existing account.
 * @return {String} Name of user's preferred timezone.
 * @throws Will throw an error if a user account cannot be found for the given email address.
 * @throws {Error} If no timezone preference is set.
 */
export function preferredTimezoneForUser(emailAddress){
    const user = Accounts.findUserByEmail(emailAddress);
    if (user.profile.timezone === null){ // Will throw error if user is null
        throw Error("No timezone preference is set for user with email address '" + emailAddress + "'");
    }
    return user.profile.timezone;
}


/**
 * Dictionary providing access to date related helpers.
 * Although this dictionary is unnecessary (because most functions and variables are also individually exported
 * via the 'export' statement), this convention makes clearer elsewhere in the code (i.e., in other files)
 * where the helper comes from. For example, the code will read DateHelper.localizedNow() provides more info
 * than localizedNow().
 */
export const DateHelper = {
    'STND_DATE_NO_YEAR_FORMAT': STND_DATE_NO_YEAR_FORMAT,
    'STND_DATE_FORMAT': STND_DATE_FORMAT,
    'STND_DATETIME_FORMAT': STND_DATETIME_FORMAT,
    'STND_TIMEZONE_OFFSET': STND_TIMEZONE_OFFSET,
    'localizedDateWithFormat': localizedDateWithFormat,
    'localizedDateMidnightWithFormat': localizedDateMidnightWithFormat,
    'utcDateLastMidnight': utcDateLastMidnight,
    'localizedNowWithFormat': localizedNowWithFormat,
    'localizedNow': localizedNow,
    'addDaysToDate': addDaysToDate,
    'addHoursToDate': addHoursToDate,
    'addMinutesToDate': addMinutesToDate,
    'addHoursAndMinutesToDate': addHoursAndMinutesToDate,
    'addHoursAndMinutesToDateObject': addHoursAndMinutesToDateObject,
    'convertStringToDate': convertStringToDate,
    'convertDateTimeStringToStandardFormat': convertDateTimeStringToStandardFormat,
    'standardTimezoneDate': standardTimezoneDate,
    'daysSince': daysSince,
    'reactiveDaysSince': reactiveDaysSince,
    'reactiveLocalizedNowWithFormat': reactiveLocalizedNowWithFormat,
    'timeBefore': timeBefore,
    'midnight' : midnight,
    'midnightOnDate' : midnightOnDate,
    'preferredTimezoneForUser':preferredTimezoneForUser,
    'daysDiffInTimezone': daysDiffInTimezone,
    'daysDiff': daysDiff,
    'getLocalDateWithFormat': getLocalDateWithFormat,
    'daysDiffUTC': daysDiffUTC
};




//======================================================================================================================
// Meteor Server Helpers -- Helpers to be used by the client to communicate with the server
//======================================================================================================================

export const MeteorServerHelpers = {
    'isUserAllowedToRegisterNewAccount': isUserAllowedToRegisterNewAccount,
    'createNewAccountAndLogin': createNewAccountAndLogin
};


//function callServer(functionName /*, arguments */){
//    Meteor.call.apply(this, arguments);
//}   

/**
 * Contacts server to create a new account using the given arguments. If successful, logs in as new user. Throws
 * an Error if unable to create the account.
 * Note: Email address is converted to lowercase.
 * @locus {client}
 */
function createNewAccountAndLogin(email, password, callback) {
    // Important! When an error is returned, the Meteor Accounts package places the explanation in Error.reason,
    // rather than Error.message. (http://docs.meteor.com/api/passwords.html#Accounts-createUser)
    const lowerCaseEmail = email.toLowerCase();
    Accounts.createUser({email: lowerCaseEmail, password: password}, callback);
}

/**
 * @param {function} callback -- Expected signature: callback(error, result)
 */
function isUserAllowedToRegisterNewAccount(email, callback) {
    Meteor.call("isUserAllowedToRegisterNewAccount", email, callback);
}

/**
 * Sort function for sorting array of objects by property
 * @param property
 * @returns {Function}
 */
export function dynamicSort(property) {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

/**
 * Find if an object is not in an array of objects
 * @param needle
 * @param haystack
 * @returns {boolean}
 */
export function isNotIn(needle, haystack) {
    for (var ix = 0; ix < haystack.length; ix++) {
        if (needle === haystack[ix])
            return false;
    }
    return true;
}


/**
 * Propagate keys not already handled by the collection.create methods. This is probably an error, but we should
 * propagate the error to the Study Administrator so that it can be fixed.
 * @param sourceObject
 * @param destinationObject
 */
export function propagateKeys(sourceObject, destinationObject) {
    var sourceKeys = Object.keys(sourceObject);
    var destinationKeys = Object.keys(destinationObject);
    for (let ix = 0; ix < sourceKeys.length; ix++) {
        var skey = sourceKeys[ix];
        if (isNotIn(skey, destinationKeys)) {
            destinationObject[skey] = sourceObject[skey];
        }
    }
}

/**
 * Straight JS calculation of days into a challenge for a participant in a specific timezone
 * @param dateFormerUTC
 * @returns {number}
 */
export function daysDiffInTimezone(dateFormerUTC, withThisTimezoneOffset) {
    if (typeof withThisTimezoneOffset !== 'number') return -1;
    var localOffset = typeof withThisTimezoneOffset === 'undefined' ? 0 : withThisTimezoneOffset;
    var validDate = typeof dateFormerUTC === 'object' && typeof dateFormerUTC.getTimezoneOffset === 'function';
    if (!validDate) return -1;

    var dateFormerLocalMidnight = new Date(dateFormerUTC.getTime() + 60000 * localOffset);
    dateFormerLocalMidnight.setHours(0,0,0,0);

    var dateNow =  new Date();
    var offset = dateNow.getTimezoneOffset();
    var dateNowUTC = new Date(dateNow.getTime() + 60000 * offset);
    var dateNowMidnightLocal = new Date(dateNowUTC.getTime() + 60000 * localOffset);
    dateNowMidnightLocal.setHours(0,0,0,0);
    return Math.floor((dateNowMidnightLocal.getTime()-dateFormerLocalMidnight.getTime()) / (24*60*60*1000))
}

/**
 * Straight JS calculation of days into a challenge for a participant in a specific timezone
 * @param dateFormerUTC
 * @returns {number}
 */
export function daysDiffUTC(dateFormerUTC) {
    let now = new Date().getTime();
    return Math.floor((now-dateFormerUTC.getTime()) / (24*60*60*1000))
    /*
    var localOffset = typeof withThisTimezoneOffset === 'undefined' ? 0 : withThisTimezoneOffset;
    var validDate = typeof dateFormerUTC === 'object' && typeof dateFormerUTC.getTimezoneOffset === 'function';
    if (!validDate) return -1;
    var dateFormerLocalMidnight = new Date(dateFormerUTC.getTime());
    dateFormerLocalMidnight.setHours(0,0,0,0);
    var dateNow =  new Date();
    var dateNowMidnightLocal = new Date(dateNow.getTime());
    dateNowMidnightLocal.setHours(0,0,0,0);
    return Math.floor((dateNowMidnightLocal.getTime()-dateFormerLocalMidnight.getTime()) / (24*60*60*1000))
    */
}


/**
 * Day difference
 * @param a
 * @param b
 * @returns {number}
 */
export function daysDiff(a, b) {
    if (typeof a === 'undefined' || typeof b === 'undefined') return 0;
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    let days = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    return days;
}

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
