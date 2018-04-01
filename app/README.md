# Fittle Meteor Client and Server Application

This folder provides the Meteor Client and Server implementation of Fittle. This is the main folder for development.

It is assumed that this is the folder Fittle is run from (i.e., `meteor run --settings=setting.json`) and that
shell scripts for managing the Fittle configuration are run from (i.e., ``)

## Repository Structure

|File |Purpose  |
|----|:----|
|`.meteor` |Meteor internal configuration and dependency specifications|
|`build` |Folder where built code goes; e.g., from running a build script in app/shell|
|`client` |Meteor Client code for this app|
|`i18n` |Internationalization assets|
|`imports` |Third party resources|
|`lib` |Code shared by Meteor Client and Server|
|`packages` |Place for Meteor custom packages (not currently used)|
|`private` |JSON data used by the Meteor Servdr|
|`public` |Web resources used by the Meteor Client|
|`resources` |App store assets|
|`server` |Meteor Server code for this app|
|`shell` |Scripts for configuring Fittle for a study and its deployments (e.g., production and development deployments)|


## Implementation Notes

### .meteor Folder Usage

It is important to understand the use of the following .meteor assets:

|File |Purpose  |
|----|:----|
|`app/.meteor/local` |This is rebuilt or reused whenever the Meteor app is run or built.  It is not uncommon to delete this folder to get a clean run or build, and have it be rebuilt (e.g., `rm -rf .meteor/local`)|
|`app/.meteor/cordova-plugins` |Specifies which Cordova plugins to use. These version must be matched to the Meteor version. For example, to check the release version of the Cordova plugin, , you would visit the source releases found at https://github.com/dpa99c/cordova-custom-config/releases|
|`app/.meteor/packages` |Meteor packages installed into this Meteor app; e.g., see https://atmospherejs.com/i/installing|
|`app/.meteor/packages` |Meteor device platforms installed into this Meteor app; e.g., see https://www.meteor.com/tutorials/blaze/running-on-mobile|
|'app/.meteor/release`|Meteor version in use (as the result of a `meteor update`)|
|'app/.meteor/versions`|Meteor packages version in use (as the result of a `meteor update --all-packages`)|

### Important meteor files
|File |Purpose  |
|----|:----|
|`app/mobile-config.js` |Configuration for iOS and Android Cordova apps. In Fittle we manage these by scripts in app/shell; e.g., app/shell/setForSilverLocal.sh|
|`app/package.json` |Node package configuration, which we manage by Meteor's Node Package Manager, https://guide.meteor.com/using-npm-packages.html|
|`app/settings.json` |Meteor configuration values. In Fittle we manage these by scripts in app/shell; e.g., app/shell/setForSilverLocal.sh|

```
*************************************************************************
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
```