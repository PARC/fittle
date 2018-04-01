

import { TestHelpers } from '../imports/test-helpers';
import {__isDateStringInStandardFormat} from './helpers';
import {convertDateTimeStringToStandardFormat} from './helpers';
import {addHoursAndMinutesToDateObject} from './helpers';
import {convertStringToDate} from './helpers';
import {daysSince} from "./helpers";
import {midnightOnDate} from "./helpers";


describe('Date helpers', function () {

    const assert = TestHelpers.assert;
    const catchError = TestHelpers.catch;
    const isErrorWithMessage = TestHelpers.isErrorWithMessage;
    const isNullOrUndefined = TestHelpers.isNullOrUndefined;

    // JavaScript's Date.month is 0 based (i.e., Jan = 0, Dec = 11), so this constant makes test more readable.
    const OCTOBER = 9;

    /**
     * Creates a Date object via its UTC values.
     *
     * @param year {number}
     * @param month {number}
     * @param day {number}
     * @param hour {number}
     * @param minute {number}
     * @param second {number}
     *
     * @example
     * // date.toUTCString() is "Sat, 15 Oct 2016 19:00:00 GMT"
     * // date.toString() is "Sat Oct 15 2016 12:00:00 GMT-0700 (PDT)"
     * const date = createUTCDate(2016,9,15,19,0,0);
     */
    function createUTCDate(year, month, day, hour, minute, second){
        // Think this could also be done via: new Date(Date.UTC(...));
        const date = new Date();
        date.setUTCFullYear(year);
        date.setUTCMonth(month);
        date.setUTCDate(day);
        date.setUTCHours(hour);
        date.setUTCMinutes(minute);
        date.setUTCSeconds(second);
        date.setUTCMilliseconds(0);
        return date;
    }

    /**
     * Creates a Date object via its device values.
     *
     * @param year {number}
     * @param month {number}
     * @param day {number}
     * @param hour {number}
     * @param minute {number}
     * @param second {number}
     *
     * @example
     * // date.toUTCString() is "Sat, 15 Oct 2016 07:00:00 GMT"
     * // date.toString() is "Sat Oct 15 2016 00:00:00 GMT-0700 (PDT)"
     * const date = createLocalDate(2016, 9, 15, 0, 0, 0);
     *
     */
    function createLocalDate(year, month, day, hour, minute, second){
        return new Date(year, month, day, hour, minute, second, 0);
    }


    describe('__isDateStringInStandardFormat', function () {
        it("Returns true if given string is valid. (Ex 1)", function () {
            const wellFormedDateStringOct152016 = "2016-10-05";
            const isValid = __isDateStringInStandardFormat(wellFormedDateStringOct152016);
            assert.isTrue(isValid);
        });

        it("Returns true if given string is valid. (Ex 2)", function () {
            // Notice the similarity between "10-05-2016" and "05-10-2016"
            const wellFormedDateStringMay102016 = "10-05-2016";
            const isValid = __isDateStringInStandardFormat(wellFormedDateStringMay102016);
            assert.isTrue(isValid);
        });

        it("Ignores non-alphanumeric characters.", function () {
            const wellFormedDateString = "2016*10*05";
            const isValid = __isDateStringInStandardFormat(wellFormedDateString);
            assert.isTrue(isValid);
        });

        it("Returns false if given a malformed date string.", function () {
            const malformedDateString = "10-27-2016";
            const isValid = __isDateStringInStandardFormat(malformedDateString);
            assert.isFalse(isValid);
        });

        it("Throws error if null argument is provided.", function(){
            const error = catchError(() => __isDateStringInStandardFormat(null));
            isErrorWithMessage(error, "Expected non-null value.");
        });
    });

    describe('convertDateTimeStringToStandardFormat', function () {
        it("Returns a string if provided a valid Date configured via UTC values and timezone name.", function () {
            // Given a Date object representing 15 Oct 2016 19:00 UTC
            const validDate = createUTCDate(2016, OCTOBER, 15, 19, 0, 0);

            // When a string representation of the Date object is generated for the -300 timezone
            const validTimezone = "-300";
            const dateString = convertDateTimeStringToStandardFormat(validDate, validTimezone);

            // Then the date string should be happy and good.
            const expDateString = "2016-10-15 14:00:00"; // ISO 8601 valid time. 15 Oct 2016 2:00 PM (CDT)
            assert.equal(dateString, expDateString);
        });

        it("Returns a string if provided a valid timezone name and a Date object configured via local values (in -420).", function(){

            // Setup -- This test is designed to run only in the -420 timezone
            const shouldTestBeRun = (Date().indexOf("PDT") >= 0 || Date().indexOf("PST") >= 0);
            if (shouldTestBeRun === false){
                TestHelpers.fail("Failing because this test should not be run. It's designed to work only on devices configured for the -420 timezone.");
                return;
            }

            // Given a Date object representing 15 Oct 2016 12:00 PM (PDT).
            const validDate = createLocalDate(2016, OCTOBER, 15, 12, 0 ,0);
            assert.equal(validDate.getHours(), 12);

            // When a string representation of the Date object is generated for the -240 timezone
            const validTimezone = "-240";
            const dateString = convertDateTimeStringToStandardFormat(validDate, validTimezone);

            // Then the date string should represent the time in EDT...
            const expDateString = "2016-10-15 15:00:00";
            assert.equal(dateString, expDateString);

            // ...but the date object remain unchanged.
            assert.equal(validDate.getHours(), 12);

        });

        it("Throws error if no date is provided.", function(){
            const error = catchError(() => convertDateTimeStringToStandardFormat(null, "-420"));
            isErrorWithMessage(error, "Expected non-null Date object.");
        });

        it("Throws error if unknown timezone name is provided.", function () {
            const error = catchError(() => convertDateTimeStringToStandardFormat(new Date(), "This is not a timezone"));
            isErrorWithMessage(error, "Invalid timezone offset provided.");
        });

        it("Throws error if no timezone name is provided.", function(){
            const error = catchError(() => convertDateTimeStringToStandardFormat(new Date(), null));
            isErrorWithMessage(error, "Invalid timezone offset provided.");
        });

    });

    describe('convertStringToDate', function () {

        it("Returns a Date object.", function () {
            // Given a valid time string and zone name
            const validTimeString = "2016-10-05 12:00:00";
            const universal = "00";

            // When requesting a the string be interpreted as being a UTC time and converted to a Date object
            const dateObj = convertStringToDate(validTimeString, universal);

            // Then the returned object is a Date
            assert.instanceOf(dateObj, Date);
        });

        it("Creates a Date object using a string given in YYYY-MM-DD HH:mm:ss format and a valid timezone name. (Case 1)", function(){
            // Given a valid time string and zone name
            const validTimeString = "2016-10-05 12:00:00";
            const universal = "00";

            // When requesting a the string be interpreted as being a UTC time and converted to a Date object
            const dateObj = convertStringToDate(validTimeString, universal);

            // Then the resulting data object
            const expDate = createUTCDate(2016, OCTOBER, 5, 12, 0, 0);
            assert.equal(dateObj.getTime(), expDate.getTime());
        });

        it("Creates a Date object using a string given in YYYY-MM-DD HH:mm:ss format and a valid timezone name. (Case 2)", function(){
            // Given a valid time string and zone name
            const validTimeString = "2016-10-05 15:00:00";
            const validTimezone = "-420";

            // When requesting a the string be interpreted as being a UTC time and converted to a Date object
            const dateObj = convertStringToDate(validTimeString, validTimezone);

            // Then the resulting data object
            const expDate = createUTCDate(2016, OCTOBER, 5, 22, 0, 0);
            assert.equal(dateObj.getTime(), expDate.getTime());
        });

        it("Throws error if no time string is provided.", function () {
            const error = catchError(() => convertStringToDate(null, "-420"));
            isErrorWithMessage(error, "Must provide a valid time string.");
        });

        it("Throw error if provided a malformed time string.", function(){
            const error = catchError(() => convertStringToDate("5/10/16", "-420"));
            isErrorWithMessage(error, "Must provide a valid time string.");
        });

        it("Throw error if unknown timezone name is provided.", function(){
            const error = catchError(() => convertStringToDate("2016-10-05 12:00:00", "PDT"));
            isErrorWithMessage(error, "Invalid timezone offset provided.");
        });

    });

    describe('addHoursAndMinutesToDateObject', function(){
        it("Returns a date object.", function () {
            const result = addHoursAndMinutesToDateObject(new Date(), "00:00");
            assert.instanceOf(result, Date);
        });

        it("Can add hours to a Date object. (Ex 1)", function(){
            // Given a Date object and string representing hours and minutes
            const timeString = "1:00";
            const dateObj = createLocalDate(2016, OCTOBER, 15, 12, 0 ,0);

            // When the helper is called
            const adjustedDateObj = addHoursAndMinutesToDateObject(dateObj, timeString);

            // Then the original Date object should be unchanged...
            assert.equal(dateObj.getHours(), 12);

            // ...and the returned Date object should be one hour later.
            assert.equal(adjustedDateObj.getHours(), 13);
            assert.equal(adjustedDateObj.getTime(), createLocalDate(2016, OCTOBER, 15, 13, 0 ,0).getTime());
        });

        it("Can add hours to a Date object. (Ex 2)", function(){
            // Given a Date object and string representing hours and minutes
            const timeString = "36:0";
            const dateObj = createLocalDate(2016, OCTOBER, 15, 12, 0 ,0);

            // When the helper is called to add time.
            const adjustedDateObj = addHoursAndMinutesToDateObject(dateObj, timeString);

            // Then the original Date object should be unchanged...
            assert.equal(dateObj.getHours(), 12);

            // ...and the returned Date object should be set to 17 Oct 2016 00:00 local time.
            const expDate = createLocalDate(2016, OCTOBER, 17, 0, 0 ,0);
            assert.equal(adjustedDateObj.getTime(), expDate.getTime());
        });

        it("Can add minutes to a Date object.", function(){
            // Given a Date object and string representing hours and minutes
            const timeString = "0:210";
            const dateObj = createLocalDate(2016, OCTOBER, 15, 12, 0 ,0);

            // When the helper is called to add time.
            const adjustedDateObj = addHoursAndMinutesToDateObject(dateObj, timeString);

            // Then the original Date object should be unchanged...
            assert.equal(dateObj.getTime(), createLocalDate(2016, OCTOBER, 15, 12, 0 ,0).getTime());

            // ...and the returned Date object should be set to 17 Oct 2016 00:00 local time.
            const expDate = createLocalDate(2016, OCTOBER, 15, 15, 30 ,0);
            assert.equal(adjustedDateObj.getTime(), expDate.getTime());
        });

        it("Throws error if time string is null.", function(){
            const error = catchError(() => addHoursAndMinutesToDateObject(new Date(), null));
            isErrorWithMessage(error, "Must provide a non-null time string.");
        });

        it("Throws an error if time string is malformed. (Case 1)", function () {
            const error = catchError(() => addHoursAndMinutesToDateObject(new Date(), "A:1"));
            isErrorWithMessage(error, "Invalid time string.");
        });

        it("Throws an error if time string is malformed. (Case 2)", function () {
            const error = catchError(() => addHoursAndMinutesToDateObject(new Date(), "0:A"));
            isErrorWithMessage(error, "Invalid time string.");
        });

        it("Throws an error if time string is malformed. (Case 3)", function () {
            const error = catchError(() => addHoursAndMinutesToDateObject(new Date(), ":"));
            isErrorWithMessage(error, "Invalid time string.");
        });

        it("Throws an error if time string is malformed. (Case 4)", function () {
            const error = catchError(() => addHoursAndMinutesToDateObject(new Date(), ":"));
            isErrorWithMessage(error, "Invalid time string.");
        });

        it("Throws error if time string has negative hours.", function () {
            const error = catchError(() => addHoursAndMinutesToDateObject(new Date(), "-1:0"));
            isErrorWithMessage(error, "Invalid time string.");
        });

        it("Throws error if time string has negative minutes.", function(){
            const error = catchError(() => addHoursAndMinutesToDateObject(new Date(), "0:-10"));
            isErrorWithMessage(error, "Invalid time string.");
        });

    });

    describe('daysSince', function () {

        /** TODO: Need to implement tests for verifying core functionality. Properly doing this requires stubbing the Javascrpit Date() constructor. */

        it("Returns a number.", function(){
            const validDateObj = new Date();
            const result = daysSince(validDateObj);
            assert.typeOf(result, 'number');
        });

        it("Throws TypeError if missing argument.", function () {
            const error = catchError(() => daysSince(null));
            isErrorWithMessage(error, "Must provide a previous date argument.")
        });
        
        it("Throws error if argument is wrong type.", function () {
            const error = catchError(() => daysSince("2016-10-05"));
            isErrorWithMessage(error, "Expected argument to be a Date object.")
        });

    });

    //midnightOnDate
    describe('midnightOnDate', function () {
        // October 18, 2017 midnight
        const VALID_DATE = new Date(2017,9,18);
        const timezoneOffset = -VALID_DATE.getTimezoneOffset().toString();
        // October 18, 2017 noon
        const VALID_DATE_NOON = new Date(new Date(2017,9,18).getTime() + 12*60*60*1000);

        it("Returns correct midnight, starting a midnight.", function(){
            const validDateObj = new Date(VALID_DATE.getTime());
            const result = midnightOnDate(validDateObj, timezoneOffset);
            assert.equal(VALID_DATE.toString(), result.toString(), "Getting wrong date");
        });

        it("Returns correct midnight, starting at noon.", function(){
            const validDateObj = new Date(VALID_DATE_NOON.getTime());
            const result = midnightOnDate(validDateObj, timezoneOffset);
            assert.equal(VALID_DATE.toString(), result.toString(), "Getting wrong date");
        });


    });


});
