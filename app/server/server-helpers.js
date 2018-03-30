/**
 * Created by lnelson on 7/26/16.
 */
/** HELPERS FOR USE IN SERVER OPERATION **/
import '../lib/collections';
import {Participants} from '../lib/api/participants/participants';
import {Questions} from '../lib/api/questions/questions';
import {Scheduledmessages} from '../lib/api/scheduledmessages/scheduledmessages';
import {Tasks} from '../lib/api/tasks/tasks';
import {Roles} from 'meteor/alanning:roles';
import {Activities} from '../lib/api/activities/activities';
import {Accounts} from 'meteor/accounts-base';
import {Configuration} from './studyConfiguration';
import {Agents} from '/lib/api/agents/agents';
import {Meteor} from 'meteor/meteor';


const startUpCollectionConfiguration = [
    {
        collection: Activities,
        //size: 271,
        jsonFile: Meteor.settings.private.ACTIVITIES_PATH //'activities.json'
    },
    {
        collection: Participants
        //size: 0
    },
    {
        collection: Questions
        //size: 0
    },
    {
        collection: Scheduledmessages
        //size: 0
    },
    {
        collection: Tasks
        //size: 0
    },
    {
        collection: Agents,
        //size: 2
        jsonFile: Meteor.settings.private.AGENTS_PATH //'agents.json'
    }
];

/**
 * Export dictionary
 */

export const ServerHelpers = {
    // Old code from earlier prototyping
    'legacyStartUp': function () {
        /*
        process.env.TWILIO_ACCOUNT_SID = 'AC6004cebcb9719c3b96a109fbf18c7475';
        process.env.TWILIO_AUTH_TOKEN = '7614fbd297dc50e120c8ddd3f684fbbf';
        process.env.TWILIO_NUMBER = '+12013080988';
        */

        /**
         * API calls should use the token
         * Generations (on OSX): uuidgen -hdr
         * 064F94D4-0BE1-42B0-8682-C362A17E9621
         * #warning Change the macro name MYUUID below to something useful!
         * #define MYUUID CFUUIDGetConstantUUIDWithBytes(kCFAllocatorSystemDefault, 0x06, 0x4F, 0x94, 0xD4, 0x0B, 0xE1, 0x42, 0xB0, 0x86, 0x82, 0xC3, 0x62, 0xA1, 0x7E, 0x96, 0x21)
         * @type {string}
         */
        //SERVER_API_TOKENS = ['ACTUAL_TOKEN_GOES_HERE', 'ACTUAL_TOKEN_GOES_HERE'];
        /**
         * @return {boolean}
         * @return {boolean}
         */
        //API_REQUEST_IS_VALID = function (request_token) {
        //    for (let ix = 0; ix < SERVER_API_TOKENS.length; ix++) {
        //        if (request_token === SERVER_API_TOKENS[ix])
        //            return true
        //    }
        //    return false
        //}
    },
    // code to be run on Server Start
    'startUp': function (testing) {
        //Check configuration
        if (Configuration) {
            console.log('Server starting for ' + Configuration.getName());
            Configuration.insertInDbIfNotThere()
        } else {
            console.log('Server exiting due to missing configuration data');
            if (!testing)
                process.exit()
        }

        // Check the database
        if (initializeDatabaseCollections(startUpCollectionConfiguration)) {
            console.log('Server started ');
        } else {
            console.log('Server exiting due to invalid collection initialization');
            if (!testing)
                process.exit();
        }

        configureEmailTemplates();
    },
    'collectionExists': collectionExists,
    'checkDatabaseField': checkDatabaseField,
    "checkPublicFileExists": function (relativeFilePath) {
        let fs = Npm.require('fs');
        // Get abolute path of project and work from there
        let base = process.env.PWD;
        let publicFilePath = base + '/public' + relativeFilePath;
        return fs.existsSync(publicFilePath);
    },
    'isAdmin': isAdmin
};

function initializeDatabaseCollections(startUpCollectionConfiguration) {
    let OK_start = true;
    for (let i = 0; i < startUpCollectionConfiguration.length; i++) {
        let collection = startUpCollectionConfiguration[i].collection;
        //var size = startUpCollectionConfiguration[i].size;
        let jsonFileSpecs = startUpCollectionConfiguration[i].jsonFile;
        if (jsonFileSpecs) {
            if (typeof jsonFileSpecs === 'string') {
                jsonFileSpecs = [jsonFileSpecs]
            }
            collection.remove({});
            let size = 0;  // Update: Find the actual number of objects from the JSON file
            for (let ixs = 0; ixs < jsonFileSpecs.length; ixs++) {
                let jsonFile = jsonFileSpecs[ixs];
                try {
                    size += jsonFile ? getJsonData(jsonFile).length : 0;
                } catch (err) {
                    console.log("WARNING: JSON file " + jsonFile + " size not computed: " + err.message)
                }
                if (!collectionExists(collection, size)) {
                    OK_start = OK_start && initializeCollection(collection, size, jsonFile);
                }
                console.log("INFO Initialize " + collection._name + " with " + jsonFile + " " + (OK_start ? "OK" : "fail"));
            }
        }
    }
    return OK_start;
}

function checkDatabaseField(collection, query, fieldToCheck, isValid) {
    let found = collection.find(query).fetch();
    let OK = true;
    for (let i = 0; i < found.length; i++) {
        let objToCheck = found[i];
        if (objToCheck && objToCheck[fieldToCheck]) {
            OK = OK && isValid(objToCheck[fieldToCheck]);
        }
    }
    return OK;
}

/**
 * Check if a collection exists and check its size if a size is given
 * @param collection
 * @param size
 * @returns {boolean}
 */
function collectionExists(collection, size) {
    try {
        if (size) {
            return collection.find().count() === size;
        }
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Read json data from a fixture file
 * @param jsonFile
 * @returns {null}
 */
function getJsonData(jsonFile) {
    try {
        let text = Assets.getText(jsonFile);
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}


/**
 * Initialize a collection from a startup fixture
 * @param collection
 * @param size
 * @param jsonFile
 * @returns {boolean}
 */
function initializeCollection(collection, size, jsonFile) {
    let jsonArray = getJsonData(jsonFile);
    if (jsonArray) {
        try {
            for (let i = 0; i < jsonArray.length; i++) {
                collection.insert(jsonArray[i]);
            }
        } catch (err) {
            console.log('Could not initialize collection' + collection._name + ' with ' + jsonFile + ': ' + err.message);
            return false
        }
    }
    return collectionExists(collection, size)
}


/**
 * Configures email templates used by server.
 * <b>@note</b> Tried placing this in /lib/api/accounts/account.js but it wouldn't work when place in a source that is
 * accessible to the client.
 */
function configureEmailTemplates() {

    /**
     * Note: To use email services when running the server outside of Galaxy, you must manually configure the
     * MAIL_URL variable. For example:
     *
     *  process.env.MAIL_URL = "smtp://...";
     *
     * The settings used when the app is deployed to Galaxy (production or development) are in settings.json.
     */
    Accounts.emailTemplates.siteName = "PARC Coach";
    Accounts.emailTemplates.from = "do-not-reply@appdda327cf091e47db98627bbb74a4bd80.mailgun.org";


    // Configure details of password reset email
    Accounts.emailTemplates.resetPassword = {
        subject(user) {
            return "PARC Coach password reset";
        },
        text(user, url)
        {
            // Token timeout was found here: https://github.com/meteor/meteor/pull/7534

            return `Hi!

You recently requested to reset the password for your PARC Coach
account. Click the link below to reset it.

${url}

If you did not request a password reset, please ignore this email.
This password reset is valid for only the next 72 hours.

Thanks,
The PARC Coach Team
PARC, a Xerox Company
`;
        },

    };

}


/**
 * Check if user is admin by id
 * @param id
 * @returns {boolean}
 */
export function isAdmin(userId) {
    if (!userId) {
        return false;
    }
    return Roles.userIsInRole(userId, 'admin');
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
