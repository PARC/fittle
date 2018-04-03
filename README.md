# Fittle

Fittle is a mobile app and cloud-based server for running health behavior change studies.
Studies challenge participants to do different healthy activities over some number of days and weeks.
For more information see doc/FittleIntro.pdf.

## Github Public Release

We are releasing Fittle using github.com.  There are two main branches of this code.

|Branch |Purpose  |
|----|:----|
|`master` | Main branch of the Fittle Source Code to be used on smartphones|
|`silver` | A variant designed with a slightly different user interface to be used on tablets by an older population|


## Repository Structure

|Folder |Purpose  |
|----|:----|
|`app/` | Meteor app. All files needed to run the app must be stored within this folder.|
|`artwork/` | Source files for Fittle artwork (e.g., icons, splashscreens). |
|`keys/` | Original keys and certificates used throughout the project for push notifications, self-signing Android releases, etc.  Additional copies can be made and stored elsewhere as appropriate (e.g., for push notifications). |
|`release/` | Current Google Play and App Store assets, including the current native Android (APK) and iOS (IPA) production releases and screenshots. |
|`tools/` | Automation tools (e.g., script for creating native builds, deploying to Galaxy). |


## Further Documentation

|File |Purpose  |
|----|:----|
|'README.md'|Introducing Fittle|
|`app/README.md`|Overview of the Fittle App|
|`app/client/README.md`||
|`app/client/legacy/README.md`||
|`app/data/.json/README.md`||
|`app/data/README.md`||
|`app/data/json/README.md`||
|`app/i18n/README.md`|Node Internationalization data|
|`app/IMPLEMENTATION_NOTES.md`||
|`app/imports/README.md`|Third-party meteor software and helpers |
|`app/lib/README.md`|Shared Meteor Client/Server components|
|`app/packages/README.md`|Meteor package repository, not currently used|
|`app/private/README.md`|Meteor Server-specfic data|
|`app/public/README.md`|Meteor Web content accessible to Meteor Client|
|`app/resources/README.md`|Meteor App deployment assets|
|`app/server/README.md`|Fittle Server overview|
|`app/server/methods/README.md`|Meteor Methods overview|
|`app/server/notifications/README.md`|Notes about Push Notifications|
|`app/server/service_api/README.md`|Notes about Coaching agent Application Programming Interface|
|`app/shell/README.md`|Study specific management tools|
|`artwork/README.md`|Artifacts used in deployments to App stores|
|`design/README.md`|Miscellaneous design artifacts|
|`design/challenges/README.md`|Notes about early challenge designs|
|`design/coaching_README.md`|Notes about possible coach agent designs|
|`developed_packages/README.md`|Study specific Meteor package requirements - Deprecated|
|`doc/README.md`|Documentation about Fittle|
|`doc/COPYRIGHT_FOR_CODE.md`|Notes about copyright used|
|`doc/Content_README.md`|Notes about Fittle Content development|
|`doc/DEPRECATIONS_README.md`|Notes about deprecations|
|`doc/LICENSE_DEPENDENCIES.md`|Notes about |
|`doc/PHI.requirements.md`|Notes about private information handling|
|`doc/S3_Service_Notes.md`|Notes about Amazon S3 service use|
|`doc/agent_README.md`|Notes about app/private/agents.json usage|
|`doc/deployment_notes.md`|Notes about specific deployment issues|
|`doc/logging.md`|Notes about event logging|
|`doc/notes.md`|Miscellaneous notes about Fittle|
|`keys/README.md`|Security keys/certificates used in deployments|
|`release/README.md`|Release artifacts such as App store items|
|`tools/README.md`|Tools used in Fittle development and deployment|


## Installation

For localhost installation:

```
meteor npm install
meteor run --settings=settings.json
```

and follow the instructions given during the installation (e.g., meteor add <i>\<package-name\></i>)

## Usage

See the various other README.md files to explain aspects of configuring the system.



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

## LICENSES

_Source Code, Non-Commercial Use Permitted under the following conditions_

This software is licensed under the [Aladdin Free Public License](https://github.com/PARC/fittle/blob/master/LICENSE-AFPL.md). A [quick summary](https://tldrlegal.com/license/aladdin-free-public-license#summary) of this license is that you CAN Modify and Distribute, you CANNOT Hold Liable, Sublicense, Place Warranty, or Use Comercially, and you MUST Include License, Include Original Code, and State Your Changes.

_Content, not code, Non-Commercial Use Permitted under the following conditions_

The non-code content in this repository is licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://github.com/PARC/fittle/blob/master/CONTENT_LICENSE-CC-BY-NC-SA-4.md) (CC BY-NC-SA 4.0). A [quick summary](https://creativecommons.org/licenses/by-nc-sa/4.0/) of this license is that you ARE FREE to Share and Adapt PROVIDED that you Provide Attribution, Use Non-Commercially, and Share Alike.

_For those interested in Commercial Use, please contact PARC, Inc. by email at engage@parc.com_

