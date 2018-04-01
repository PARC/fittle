# Fittle Study-specfic Tools

Scripts used for setting up testing and deployments of the Meteor Client and Server.

# Implemenation Notes

* Scripts starting with/containing:

 * 'deploy' pushes the current Meteor configuration to the indicated Galaxy host server

 * 'build' creates the indicated Cordova app (Android and iOS)

 * 'reset' uses the Fittle Web Services API to set the database to a known state (i.e., via curl calls to the API)

 * 'setFor' sets the mobile-config.js and settings.json for a specific study configuration

 * '*settings*.txt' are templates for settings.json values for a specfic study

 * '*.txt' is a template file that gets copied by another script

 * '*.sh' is an executable script file (usually bash shell of OSX/unix) that makes the configuration settings



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
