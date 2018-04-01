

import React, { Component } from 'react';
import i18n from 'meteor/universe:i18n';

// App component - represents the whole app
export default class PageAbout extends React.Component {

    getAboutHeader() {
        return "PARC Header";
    }

    getTermsAndConditions() {
        return "Terms and Conditions";
    }

    getPrivacyPolicy() {
        return "Privacy Policy";
    }

    getHereLink() {
        return "here";
    }

    render() {
        return (
            <div className="container flex-container" id="react-div">
              <h2>{i18n.__('about-header')}</h2>
                <div className="flex-container container-center">
                    <div>
                        <h4>
                            {i18n.__('about-header')} (<a href="http://www.parc.com">PARC</a>)
                        </h4>
                    </div>
                </div>
                <p></p>
                <div className="flex-container container-center">
                    <div className="list-container space-items">
                        <div>{i18n.__('about-terms-conditions')}<a href="/terms"> {this.getHereLink()}</a>.</div>
                        <div>{this.getPrivacyPolicy()}<a href="/showPrivacy"> {this.getHereLink()}</a>.</div>
                        <div><a href="/debug"> Debug link </a></div>
                    </div>
                </div>
            </div>
        );
    }

};

