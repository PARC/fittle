/**
 * Created by krivacic on 7/5/17.
 */
import {Meteor} from 'meteor/meteor'
import i18n from 'meteor/universe:i18n';

export const LanguageHelpers = {
    setLanguage,
};

export function setLanguage() {
    let defaultLanguage = 'en';
    let phoneLanguage = Session.get('phoneLanguage');
    let systemLanguage = Session.get('systemLanguage');

    console.log("System: " + systemLanguage + ", Phone: " + phoneLanguage + ", default: " + defaultLanguage);

    if (systemLanguage && systemLanguage !== "phone" && systemLanguage.length > 0) {
        lang = systemLanguage;
    } else if (phoneLanguage) {
        lang = phoneLanguage;
    } else {
        lang = defaultLanguage;
    }

    if (lang) {
        Session.set('defaultLanguage', lang);
        Session.set('currentLanguage', lang);
        console.log("*** Set language to " + lang);
        i18n.setLocale(lang);
    }
};


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
