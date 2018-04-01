# Fittle Meteor Server

This folder provides the Meteor Server implemenation

## Repository Structure

|File |Purpose  |
|----|:----|
|`emailer` |Email notification service|
|`methods` |Meteor methods and support helper code|
|`notifications` |Android and iOS (APN) push notification using the third party Meteor package, https://github.com/raix/push|
|`service_api` |Fittle Web Services API (RESTful)|
|`post_image_helpers.js` |Helpers for handling images uploaded in user social feed posts|
|`publications.js` |Part of the Meteor publish/subscribe database access, https://docs.meteor.com/api/pubsub.html|
|`security.js` |Part of the Meteor publish/subscribe database access, https://docs.meteor.com/api/pubsub.html|
|`server-helpers.js` |Server helper functions|
|`server.accounts.js` |Deprecated|
|`server.js` |Meteor Server start up functions|
|`server.publication.posts.js` |Part of the Meteor publish/subscribe database access, https://docs.meteor.com/api/pubsub.html|
|`server.security.posts.js` |Part of the Meteor publish/subscribe database access, https://docs.meteor.com/api/pubsub.html|
|`studyConfiguration.js` |Handle study specific settings not handled in settings.json. This is quite old code now and due to be refactored|



## Implementation Notes

* Any file '*.test.js' is a practicalmeteor/mocha test driven development code. It is currently deprecated since the upgrade to Meteor 1.6, and would require some investigation to update and refurbish.

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