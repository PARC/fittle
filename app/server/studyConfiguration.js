/**
 * Created by lnelson on 9/8/16.
 */
/**
 * Access methods for study specific data, selected by study name
 */
import {Studies} from '../lib/api/studies/studies';

function readConfigurations(studyName) {
    try {
        let configurations = JSON.parse(Assets.getText("studyConfigurations.json"));
        if (configurations && configurations[studyName])
            return configurations[studyName];
        return null
    } catch (err) {
        console.log("Error reading configuration file " + err.message)
    }
}

export class StudyConfigurationData {

    /**
     * Access stored study configuration data
     * @param studyName
     */
    constructor(studyName) {
        this.data = readConfigurations(studyName);
        this.name = studyName;

    }

    /**
     * Get study name
     * @returns {*}
     */
    getName() {
        return this.name
    }

    /**
     * Get stored configuration data
     * @returns {*}
     */
    getData() {
        return this.data
    }

    insertInDbIfNotThere() {
        return Studies.insertIfNotThere(
            this.name,
            this.data.studyLength,
            this.data.adminName,
            this.data.adminPhone,
            this.data.adminEmail
        )
    }

}

/**
 * Get stored configuration data keys
 * @returns {*}
 */
StudyConfigurationData.getStudyNames = function () {
    return Object.keys(this.configuration)
};


// Only loading assignments, contact info, and reminder logic for CurrentStudy an Environment Variable
export const CurrentStudy = Meteor.settings.public.STUDY_NAME ? Meteor.settings.public.STUDY_NAME : "I2";
export const Configuration = new StudyConfigurationData(CurrentStudy);


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
