# Fittle Documentation

This folder contains various documents explaining aspects of the Fittle design and implementation.

Note also that there are README files spread throughout the Fittle code base regarding each specific folder.

## Important Reading

To better understand Fittle, you should be familiar with the following:

* All *.md files in this repository

* Prerequisite Web resources related to the underlying technology:
 * MeteorJS (https://www.meteor.com/) applications development, including Meteor deployment of Apache Cordova applications ((https://cordova.apache.org/) in Android and iOS devices
 * Managing software development and builds using GitHub (github.com)
 * Deploying web applications to cloud services (e.g., galaxy.meteor.com, mlab.com, aws.amazon.com, docker.com). For example:
   * https://galaxy-guide.meteor.com/deploy-guide.html
 * Using ReactJS (reactjs.org) for user interface construction in Meteor
 * Django/Python application development (www.djangoproject.com). This is required for developing a Python-based Fittle Coaching agent that then communicates with Fittle. See also:
   * doc/agent_README.md
   * app/server/service_api/README.md

* Development environment and related requirements
 * Using Xcode to develop Cordova apps, e.g., https://guide.meteor.com/mobile.html
    * including generating iOS certificates, e.g., https://developer.apple.com/support/code-signing/
 * How to create Push Notifications
    * e.g., for iOS, https://quickblox.com/developers/How_to_create_APNS_certificates
    * e.g., for Android, https://developers.google.com/android/work/play/emm-api/setup-push-server
 * Development environment used in Fittle Development
    * While not strictly necessary, we found it useful to develop using Webstorm, https://www.jetbrains.com/webstorm/



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