# Things to remember during deployment

## Sites needing those passwords

host: mlab.com
username: i2aadmin

host: galaxy.meteor.com/YOUR_OWNER_HERE
username: lnelson


## Dealing with Cordova plugins

* To change meteor version: meteor update --release 1.6.0.1 --all-packages
* Get the plugins straight with the meteor build version by looking at error messages and docs
* But you also need to clear EVERYTHING to build, especially when changing meteor versions
```
rm -rf .meteor/local
rm -rf ~/.cordova
meteor remove-platform ios
meteor remove-platform android
meteor add-platform ios
meteor add-platform android
meteor reset
```

## Final Steps in building Cordova iOS app

1. Open the Xcode project located at designated output folder for iOS (e.g., app/build/ios)

2. You might be prompted to convert the project to Swift if the project was created. This sometimes works, but can also
introduce more Xcode warnings depending on how Cordova for Meteor has been kept up to date for the current Meteor release.
Trial and error are likely needed here.

3. Open the PARC Coach target settings.

4. Under the "General" tab:

   * Set build number.

   * Configure signing settings.

   * Update the "Development Target" as needed.

   * Update "Devices" as needed.

   * Set device orientation to "Portait" only.

   * Uncheck option "Requires full screen".

   * Uncheck option "Hide status bar".

   * Set status bar style to "Default"

5. Under the "Capabilities" tab:
    * Enable "Push Notifications".

6. Ensure app icons and launch images are properly set.

From this point on, the process for building the app archive and submitting it to
the App Store is the same as it would be for any other iOS app. Please refer to Apple’s
documentation for further details.



## How to Change Admin Password (using mlab/mongo interface)
* Now run the build script again with these changes to the manifest

Follow these steps:

* Update BUILTIN_ADMIN_PASSWORD in the settings file (settings.*.txt)
* Delete the mongo user object from the relevant database (e.g., using mlab's web interface)
* Redeploy the app. On the next start up it will create a new admin account with the same email and new pw

# Stupid iOS error and workaround

Error: Code Signing Error: FittleACTUAL_VALUE_HERE has conflicting provisioning settings. FittleACTUAL_VALUE_HERE is automatically signed for development, but a conflicting code signing identity iPhone Distribution has been manually specified. Set the code signing identity value to "iPhone Developer" in the build settings editor, or switch to manual signing in the project editor.
Solution: https://stackoverflow.com/questions/40824727/i-get-conflicting-provisioning-settings-error-when-i-try-to-archive-to-submit-an



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