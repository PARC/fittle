/**
 * Created by lnelson on 8/16/16.
 */
/**
 * Created by lnelson on 7/18/16.
 */
import {DateHelper} from '../../../lib/helpers';
import {Participants, parseParticipantRecords} from '../../../lib/api/participants/participants';
import {Scheduledmessages} from '../../../lib/api/scheduledmessages/scheduledmessages';
import {parseMessageSequence} from './server.methods.scheduledMessagesHelpers';
import {ScheduledMessagesHelper} from './server.methods.scheduledMessagesHelpers'
import {Activities} from '../../../lib/api/activities/activities';

/**
 * Return a valid string, empty or lower-cased
 * @param str
 * @returns {*}
 */
var safe_lower = function (str) {
    try {
        return str.toLowerCase().trim()
    } catch (err) {
        return ''
    }
};


/**
 * @param needle
 * @param haystack
 * @returns {boolean}
 */
function isNotIn(needle, haystack) {
    for (var ix = 0; ix < haystack.length; ix++) {
        if (needle === haystack[ix])
            return false;
    }
    return true;
}

/**
 * Check incoming data for duplication based on a key set
 * @param row_object
 * @param seen_already
 * @returns {boolean}
 */
function isDuplicate(row_object, seen_already) {
    //TODO this is hardcoded spec for unique keys - not generalizable
    //TODO this uses JSON.stringify to 'hash' the constraints when checking for duplicates
    var seen_key = [row_object.scheduleName,
        JSON.stringify(row_object.constraints),
        row_object.askDate,
        row_object.askTime,
        row_object.sequence];

    if (!seen_already[seen_key]) {
        seen_already[seen_key] = true;
        return true
    }
    return false
}

function checkGoalContentValidity(goalContent) {
    var found = Activities.findOne({
        activity: {$regex: new RegExp("^" + safe_lower(goalContent) + "$", "i")}
    });
    if (found) return true;
    return false
}

const HEADER_ADJUSTMENT = 0;
const ZERO_INDEX_ADJUSTMENT = 1;

function formatLineNumber(line) {
    try {
        var line_value = Number(line);
        return (line_value + HEADER_ADJUSTMENT + ZERO_INDEX_ADJUSTMENT).toString()
    } catch (err) {
        console.log('Warning in formatLineNumber: ' + err.message);
        return line
    }
}

function validateFieldsAgainstSchema(collection, row_object) {
    if (collection.schema) {
        var validationContextName = 'studyJsonDataValidation';
        var isValid = collection.schema.namedContext(validationContextName).validate(row_object);
        if (!isValid) {
            var context = collection.schema.namedContext(validationContextName);
            var invalids = '';
            for (var vix = 0; vix < context._invalidKeys.length; vix++) {
                invalids += context._invalidKeys[vix].name + '(' + context._invalidKeys[vix].type + ':' + context._invalidKeys[vix].value + '),'
            }
            return invalids
        }
    }
    return ''
}

/**
 * Read in a csv file and load into a collectin using first header line as the keys and first element like a primary key
 * (e.g., username/email)
 *
 * REALLY IMPORTANT NOTE: when adding a new field to Participant or Schedulemessages schema, make sure to enter them
 * inot the do_not_lowercase list if they are not string fields. Not doing so will cause Schema Validation to fail.
 *
 *
 * @param collection, which collection to write into
 * @param csv_content, file content that is being uploaded (big string)
 * @param overwrite_on_primary_key, indicates to check primary key before insertion
 * @param duplicates_ok, indicates to check full record duplication before insertion
 * @param no_lcase, fields that should not be lowercased
 */
export class StudyJsonData {
    // ..and an (optional) custom class constructor. If one is
    // not supplied, a default constructor is used instead:
    // constructor() { }

    constructor(collection, json_import_content) {
        this.collection = collection;
        this.name = safe_lower(collection._name);
        this.json_content = this.name === 'scheduledmessages' ?
            parseMessageSequence(json_import_content) :
            parseParticipantRecords(json_import_content);
        this.feedback = 'Uploading JSON file ';
        this.seen_already = {};
        this.db_queue = [];
        this.isValid = true;
        this.errorLines = [];
        if (this.name === 'scheduledmessages') {
            //this.overwrite_on_primary_key = undefined;
            this.allow_duplication = false;
            this.do_not_lowercase = [
                'text',
                'afterword',
                'choices',
                'answers',
                'name',
                'constraints',
                'questions',
                'preferenceToSet',
                'noneAllowed',
                'notify',
                'sequence',
                'sequenceBase',
                'linkToActivity',
                'createdAt',
                'props'
            ];

        } else if (this.name === 'participants') {
            this.overwrite_on_primary_key = 'emailAddress';
            //this.allow_duplication = undefined;
            this.do_not_lowercase = ['constraints', 'settings', 'preferences', 'createdAt', 'studyStartUTC', 'challengeStartUTC']

        } else {
            //this.allow_duplication = undefined;
            //this.overwrite_on_primary_key = undefined;
            //this.do_not_lowercase = undefined;
            this.feedback = '<br/>Error: Unrecognized input kind';
            this.isValid = false
        }
    }

    _format_content(row_number) {
        var keys = Object.keys(this.json_content[row_number]);
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            if (isNotIn(key, this.do_not_lowercase)) {
                this.json_content[row_number][key] = safe_lower(this.json_content[row_number][key]);
            }
        }
        return this.json_content[row_number]
    };

    /**
     * Getter for returning feedback to the Client
     * @returns {string|string|string|string|*}
     */
    getFeedback() {
        return this.feedback
    }

    /**
     * Getter for returning model schema for this data
     * @returns {string|string|string|string|*}
     */
    getSchema() {
        if (this.collection)
            return this.collection.schema
        return null
    }

    /**
     * Getter for returning validity of data
     * @returns {string|string|string|string|*}
     */
    getIsValid() {
        return this.isValid
    }

    /**
     * Setter for returning validity of data
     * @returns {*}
     */
    setIsValidFalse() {
        this.isValid = false
    }

    /**
     * Getter for returning validity of data
     * @returns {string|string|string|string|*}
     */
    getErrorLines() {
        return this.errorLines.sort(function (a, b) {
            return a - b
        })
    }

    /**
     * Setter for returning validity of data
     * @returns {string|string|string|string|*}
     */
    setErrorLine(line) {
        var setting = !isNaN(line) ? Number(line) + HEADER_ADJUSTMENT : false;
        if (setting)
            this.errorLines.push(setting)
    }

    // Getters for select fields (mostly for testing at this point)
    getName() {
        return this.name
    }

    getOverwriteOnPrimaryKey() {
        return this.overwrite_on_primary_key
    }

    getAllowDuplication() {
        return this.allow_duplication
    }

    getDoNotLowercase() {
        return this.do_not_lowercase
    }

    /** Check fields for validity
     * @returns {boolean}
     */
    validateFields() {
        if (this.isValid) {
            this.feedback += 'Validating Fields<br/>';
            for (var i = 0; i < this.json_content.length; i++) {
                var row_object = this._format_content(i);
                if (this.name === 'participants' &&
                    row_object &&
                    row_object.preferences &&
                    row_object.preferences.goalContent && !checkGoalContentValidity(row_object.preferences.goalContent)) {
                    this.isValid = false;
                    this.feedback += 'Invalid goalContent: Error at object ' + formatLineNumber(i) + '<br/>';
                    this.setErrorLine(i)
                }
            }
        }
    }

    /**
     * Check the importation rules (what happens on duplicates, what happens when primary key overwrite allowed)
     */
    validateImport() {
        if (this.isValid) {
            this.feedback += 'Validating Import File<br/>';

            for (var i = 0; i < this.json_content.length; i++) {
                var row_object = this._format_content(i);
                var primary_key_query = null;
                if (this.overwrite_on_primary_key) {
                    // Allow an update query that looks for an object that matches the primary key, thereby overwriting the
                    // rest of the data using the incoming row
                    primary_key_query = {};
                    primary_key_query[this.overwrite_on_primary_key] = row_object[this.overwrite_on_primary_key];
                }
                // Queue up database updates and inserts according to the options of this import call
                if (primary_key_query && this.collection.findOne(primary_key_query)) {
                    // If we are allowing overwrite of the primary key  that matches something in the database already, then
                    // do a database update
                    this.db_queue.push({
                        update: true,
                        primary_key_query: primary_key_query,
                        row_object: row_object
                    });
                } else if (primary_key_query && !(this.collection.findOne(primary_key_query))) {
                    // If we are allowing overwrite of the primary key that does not match something in the database already, then
                    // do a database insert
                    this.db_queue.push({
                        update: false,
                        primary_key_query: null,
                        row_object: row_object
                    })
                } else {
                    if (this.allow_duplication) {
                        // This is not a primary key query and we are allowing duplicates, insert the record
                        this.db_queue.push({
                            update: false,
                            primary_key_query: null,
                            row_object: row_object
                        })
                    } else {
                        if (isDuplicate(row_object, this.seen_already)) {
                            // This is not a primary key query and we are allowing duplicates, insert the record only if it does
                            // not duplicate something that is already there are already seen in the new CSV data
                            this.db_queue.push({
                                update: false,
                                primary_key_query: null,
                                row_object: row_object
                            });
                        } else {
                            this.feedback += 'Duplicate record in import file:' +
                                JSON.stringify(row_object) +
                                ': Error at object ' +
                                formatLineNumber(i) +
                                '<br/>';
                            this.isValid = false;
                            this.setErrorLine(i)
                        }
                    }
                }
            }
        }
    }

    validateAgainstSchema() {
        if (this.isValid) {
            this.feedback += 'Validating Schema<br/>';
            // Limitation: if the database stops accepting CSV data part way through the processing because of a storage
            // error, there's no way to back out the partially stored CSV records
            for (var ix = 0; ix < this.db_queue.length; ix++) {
                var itemToSave = this.db_queue[ix];
                if (itemToSave && this.isValid) {
                    if (itemToSave.row_object) {
                        // Process db inserts
                        var invalidFields = validateFieldsAgainstSchema(this.collection, itemToSave.row_object);
                        if (invalidFields) {
                            this.setIsValidFalse();
                            this.feedback += 'Error validating against schema at object ' +
                                formatLineNumber(ix) +
                                ': fields ' +
                                invalidFields +
                                '<br/>';
                        }
                    }
                }
            }
        }
    }

    /**
     * Remove any previous question set related scheduled messages data
     */
    guardedRemovePriorScheduledMessagesData() {
        if (this.isValid && this.name === 'scheduledmessages') {
            let this_study_data = this;
            this.db_queue.forEach(function (itemToSave) {
                if (itemToSave && itemToSave.row_object) {
                    this_study_data.feedback += 'Removing prior Scheduled Messages for ' + itemToSave.row_object.name + '<br/>';
                    Scheduledmessages.remove({name: itemToSave.row_object.name})
                }
            })
        }

    }

    /**
     * Save to Database if import is valid
     */
    guardedSaveToDatabase() {
        if (this.isValid) {
            this.feedback += 'Saving imported data to Database<br/>';
            // Limitation: if the database stops accepting CSV data part way through the processing because of a storage
            // error, there's no way to back out the partially stored CSV records
            for (var ix = 0; ix < this.db_queue.length; ix++) {
                var itemToSave = this.db_queue[ix];
                if (itemToSave) {
                    if (itemToSave.update) {
                        // Process db updates
                        if (itemToSave.primary_key_query && itemToSave.row_object) {
                            try {
                                this.collection.update(
                                    itemToSave.primary_key_query,
                                    {$set: itemToSave.row_object}
                                );
                                this.feedback += 'Updated ' +
                                    this.name + ' ' +
                                    JSON.stringify(itemToSave.primary_key_query) +
                                    '<br/>';
                            } catch (update_error) {
                                this.feedback += 'Error at object: ' +
                                    formatLineNumber(ix) + ': ' +
                                    update_error.message + '<br/>';
                                this.setIsValidFalse();
                            }
                        }
                    } else {
                        if (itemToSave.row_object) {
                            // Process db inserts
                            try {
                                var scheduleDescriptor =
                                    this.name === 'scheduledmessages' ?
                                    '.' + itemToSave.row_object.name + '.' + itemToSave.row_object.sequence :
                                        "";
                                var row_descriptor = this.name + scheduleDescriptor;
                                if (!(this.collection.findOne(itemToSave.row_object))) {
                                    this.collection.insert(
                                        itemToSave.row_object
                                    );
                                    this.feedback += 'Added ' + row_descriptor + '<br/>';
                                } else {
                                    this.feedback += 'Retained ' + row_descriptor + '<br/>';
                                }
                            } catch (insert_error) {
                                this.feedback += 'Error at object: ' +
                                    formatLineNumber(ix) + ': ' +
                                    insert_error.message + '<br/>';
                                this.setIsValidFalse();
                            }
                        }
                    }
                }
            }
        }
        if (this.getIsValid()) {
            this.feedback += 'Load complete<br/>'
        }
    }

    /**
     * Push scheduled messages data to users in name affected by the upload
     */
    guardedUpdateQuestions() {
        if (this.isValid && this.name === 'scheduledmessages') {
            this.feedback += 'Update Questions for new schedule of messages<br/>';
            var queue = Scheduledmessages.find({}).fetch();
            // Find all name affected by a ScheduledMessages load
            var namesToUpdate = {};
            // Find all Participants meeting these constraints and push questions to them
            var alreadyPushed = {};
            this.db_queue.forEach(function (itemToSave) {
                var affected = Participants.find({}).fetch();
                for (var ix = 0; ix < affected.length; ix++) {
                    if (itemToSave.row_object &&
                        ScheduledMessagesHelper.participantMeetsConstraint(affected[ix], itemToSave.row_object.constraints)
                    ) {
                        if (!alreadyPushed[affected[ix].emailAddress]) {
                            ScheduledMessagesHelper.pushScheduledMessagesForParticipant(affected[ix].emailAddress);
                            alreadyPushed[affected[ix].emailAddress] = true
                        }
                    }
                }
            });
        }

    }
}
/**
 * Import Scheduledmessages data
 * @param json_content
 * @returns {string|string|string|string|*}
 */
export function importScheduledmessagesJson(json_content) {
    let study_data = new StudyJsonData(Scheduledmessages, json_content);
    study_data.validateFields();
    study_data.validateImport();
    study_data.validateAgainstSchema();
    study_data.guardedRemovePriorScheduledMessagesData();
    study_data.guardedSaveToDatabase();
    study_data.guardedUpdateQuestions();
    return study_data.getFeedback()
}

/**
 * Import Participants data
 * @param json_content
 * @returns {string|string|string|string|*}
 */
export function importParticipantJson(json_content) {
    let study_data = new StudyJsonData(Participants, json_content);
    study_data.validateFields();
    study_data.validateImport();
    study_data.validateAgainstSchema();
    study_data.guardedRemovePriorScheduledMessagesData();
    study_data.guardedSaveToDatabase();
    return study_data.getFeedback()
}