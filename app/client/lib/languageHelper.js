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
