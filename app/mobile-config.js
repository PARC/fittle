App.info({
   id: 'com.parc.fittle.ACTUAL_NAME_GOES_HERE',
   name: 'ACTUAL_APP_NAME_GOES_HERE',
   description: 'ACTUAL_DESCRIPTION_GOES_HERE',
   author: 'ACTUAL_NAME_GOES_HEREC',
   email: 'ACTUAL_ADDRESS_GOES_HERE',
   version: "0.2.7"
});


// Universal prefrences
App.setPreference('Orientation', 'portrait');
App.setPreference('Fullscreen', 'false');
App.setPreference('windowSoftInputMode', 'adjustPan');
App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#558A27');
App.setPreference('StatusBarStyle', 'default');

App.setPreference('SplashScreenDelay', '0');
App.setPreference('FadeSplashScreenDuration', '250');
App.setPreference('ShowSplashScreenSpinner','true');

// iOS specific preferences
App.setPreference('deployment-target', 8.0, 'ios');
App.setPreference('Orientation', 'portrait', 'ios');
App.setPreference('target-device', 'handset', 'ios'); // iPhone only
App.setPreference('SuppressesLongPressGesture', 'true', 'ios');
App.setPreference('BackupWebStorage', 'none');

//App.setPreference("WebAppStartupTimeout", 200000);
//App.setPreference("CordovaWebViewEngine", "CDVUIWebViewEngine")

App.accessRule('*', {type:'navigation'});
App.accessRule('maps:*', {type:'intent'});
App.accessRule("http://meteor.local/*");

App.icons({
   
   // iOS Launch Icons
   'iphone_2x' : 'resources/ios-icons/icon-60@2x.png',  // (120x120)
   'iphone_3x' : 'resources/ios-icons/icon-60@3x.png',  // (180x180)
   'ipad' : 'resources/ios-icons/Icon-76.png',           // (76x76)
   'ipad_2x' : 'resources/ios-icons/icon-76@2x.png',      // (152x152)
   'ipad_pro' : 'resources/ios-icons/icon-83.5@2x.png',  // (167x167)

    // iOS App Store
    'app_store' : 'resources/ios-icons/appstore-1024x1024.png',

   // iOS Settings Icons
   'ios_settings' : 'resources/ios-icons/icon-small.png',    // (29x29)
   'ios_settings_2x' : 'resources/ios-icons/icon-small@2x.png', // (58x58)
   'ios_settings_3x' : 'resources/ios-icons/icon-small@3x.png', // (87x87)

   // iOS Spotlight Icons
   'ios_spotlight' : 'resources/ios-icons/icon-40.png',  // (40x40)
   'ios_spotlight_2x' : 'resources/ios-icons/icon-40@2x.png',// (80x80)

    // Legacy icons
    'iphone_legacy': 'resources/ios-icons/Icon-57.png', //(57x57)
    'iphone_legacy_2x': 'resources/ios-icons/Icon-57@2x.png', //(114x114)
    'ios_notification_2x': 'resources/ios-icons/Icon-20@2x.png', //(40x40)
    'ios_notification_3x': 'resources/ios-icons/Icon-20@3x.png', //(60x60)
    'ios_spotlight': 'resources/ios-icons/icon-40.png', //(40x40)
    'ipad_spotlight_legacy': 'resources/ios-icons/icon-50.png', //(50x50)
    'ipad_spotlight_legacy_2x': 'resources/ios-icons/icon-50@2x.png', //(100x100)
    'ipad_app_legacy': 'resources/ios-icons/icon-72@2x.png', //(72x72)
    'ipad_app_legacy_2x': 'resources/ios-icons/icon-72@2x.png', //(144x144)

   // Android Icons
   'android_mdpi' : 'resources/android-icons/android_mdpi_48x48.png', // (48x48)
   'android_hdpi' : 'resources/android-icons/android_hdpi_72x72.png', // (72x72)
   'android_xhdpi' : 'resources/android-icons/android_xhdpi_96x96.png', // (96x96)
   'android_xxhdpi' : 'resources/android-icons/android_xxhdpi_144x144.png', // (144x144)
   'android_xxxhdpi' : 'resources/android-icons/android_xxxhdpi_192x192.png' //(192x192)

});


App.launchScreens({
   // iPhone Launch Screens
   'iphone_2x' : 'resources/ios-splash/iphone-640x960.png',             // (640x960)
   'iphone5' : 'resources/ios-splash/iphone-640x1136.png',              // (640x1136)
   'iphone6' : 'resources/ios-splash/iphone-750x1334.png',              // (750x1334)
   'iphone6p_portrait' : 'resources/ios-splash/iphone-1242x2208.png',   // (1242x2208)

   // iPad Launch Screens
   'ipad_portrait' : 'resources/ios-splash/ipad-768x1024.png',       // (768x1024)
   'ipad_portrait_2x' : 'resources/ios-splash/ipad-1536x2048.png',   // (1536x2048)

   // Android launch screens
   'android_mdpi_portrait' : 'resources/android-splash/android-mdpi-320x470.png',       // (320x470)
   'android_hdpi_portrait' : 'resources/android-splash/android-hdpi-480x640.png',       // (480x640)
   'android_xhdpi_portrait' : 'resources/android-splash/android-xhdpi-720x960.png',     // (720x960)
   'android_xxhdpi_portrait' : 'resources/android-splash/android-xxhdpi-1080x1440.png', // (1080x1440)

   'android_mdpi_landscape' : 'resources/android-splash/android-land-mdpi-470x320.png',      // (320x470)
   'android_hdpi_landscape' : 'resources/android-splash/android-land-hdpi-640x480.png',      // (480x640)
   'android_xhdpi_landscape' : 'resources/android-splash/android-land-xhdpi-960x720.png',    // (720x960)
   'android_xxhdpi_landscape' : 'resources/android-splash/android-land-xxhdpi-1440x1080.png' // (1080x1440)

});


App.configurePlugin('phonegap-plugin-push', {
    SENDER_ID: 455365303431
});

App.appendToConfig(`<platform name="ios">
    <config-file platform="ios" target="*-Info.plist" parent="NSPhotoLibraryUsageDescription">
      <string>Fittle PHOTOS PERMISSION is needed</string>
    </config-file>
    <config-file platform="ios" target="*-Info.plist" parent="NSCameraUsageDescription">
      <string>Fittle CAMERA PERMISSION is needed</string>
    </config-file>
		   </platform>`);



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
