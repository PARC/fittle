#!/bin/bash
#
#   A script for creating iOS and Android Cordova builds of a Meteor app.
#


#######################################################################################################################
#
# SCRIPT CONFIGURATION: Modify values in section before running the script.
#
#######################################################################################################################

#------------------------------------------------------------------------------
# App Globals
#------------------------------------------------------------------------------
# App name used when naming output files (e.g., the Android APK).
APP_NAME="parccoach"

# Version number used when naming output files (e.g., the Android APK).
APP_VERSION="0.1.0"


#------------------------------------------------------------------------------
# Meteor Project Location
#------------------------------------------------------------------------------
# Full-path to folder containing the Meteor project.
PROJECT_ROOT="/Users/lnelson/meteor_home/parccoach/app"

# Path to folder containing Meteor project's Cordova build cache. There
# should likely be no reason to change this setting.
METEOR_BUILD_CACHE_FOLDER=$PROJECT_ROOT"/.meteor/local/cordova-build"


#------------------------------------------------------------------------------
# Galaxy Server URL Settings
#
#   The client app must know with which remote server to communicate.
#   Different servers are used for development and production environments.
#------------------------------------------------------------------------------
# URL of Galaxy development server. Used when building for dev environment.
DEVELOPMENT_SERVER_URL="http://parccoach-altdev.meteorapp.com:80"

# URL of Galaxy production server. Used building for production environment.
PRODUCTION_SERVER_URL="http://parccoach-kph.meteorapp.com:80"


#------------------------------------------------------------------------------
# Java Keystore Settings
#
#   A Java keystore is used for managing the various PrivateKeyEntry entries
#   used for self-signing Android APKs distributed via Google Play. The same
#   PrivateKeyEntry must used when signing each new version of the app 
#   available on Google Play. (Note: Development builds do not need to be
#   signed.)
#
#   This script must be configured with info about where to find the keystore.
#   The script will prompt the user for information required to read the 
#   keystore (e.g., keystore password).
#
#   For more info: 
#       https://docs.oracle.com/javase/7/docs/api/java/security/KeyStore.html
#------------------------------------------------------------------------------
# Full-path to folder containing the keystore.
ANDROID_KEYSTORE_FOLDER="/Users/lnelson/meteor_home/parccoach/app/"

# Filename of the keystore
ANDROID_KEYSTORE_NAME="PARCCoachAndroidKeystore.jks" 

#ANDROID_KEYSTORE_PASSWORD="AugmentedSocialCognition"
#ANDROID_KEY_PASSWORD="3e38ksZBd#E#Z49w"


#------------------------------------------------------------------------------
# Android Tools Settings
#
#   The Android SDK and some Android tools (all of which some with Android
#   Studio) are required to build a native Android client.
#------------------------------------------------------------------------------
# Full-path to folder containing Android SDK.
ANDROID_SDK_PATH="/Users/lnelson/Library/Android/sdk"

# Relative path of Android zipalign tool. 
# For info: https://developer.android.com/studio/command-line/zipalign.html
ANDROID_ZIPALIGN_PATH=$ANDROID_SDK_PATH"/build-tools/26.0.2/zipalign"





#######################################################################################################################
#
# SCRIPT BODY
#
#######################################################################################################################

#------------------------------------------------------------------------------
# Print instructions about pre-requistites (e.g., having Android SDK, certs, 
# etc.)
#------------------------------------------------------------------------------
echo
echo "########################################################################################################################"
echo "#                                                                                                                      #"
echo "# PARC Coach Meteor Cordova Build script                                                                               #"
echo "#                                                                                                                      #"
echo "########################################################################################################################"
echo
echo "This script will walk you through the process of building a native iOS and Android Cordova builds of"
echo "your Meteor app. This process requires you've the following installed on your system:"
echo
echo "  (1) Java SDK."
echo "  (2) Android SDK (see: https://developer.android.com/studio/index.html)." 
echo "  (3) Certificates for signing the Android APK "
echo "      (see https://developer.android.com/studio/publish/app-signing.html#signing-manually)."
echo "  (4) Xcode for generating an iOS archive (see the Apple App Store)."
echo
echo "And because the author was lazy, the script must be directly edited to include some configuration" 
echo "values and the paths for accessing these tools."
echo
echo "You can find additional instructions on building Meteor apps by visiting the Meteor website: "
echo
echo "  https://guide.meteor.com/mobile.html#building-and-submitting"
echo 
echo -n "Would you like to begin the build process? (yes|no) :: "
read x
if  [ $x != "yes" ]; then
    echo "Quitting build process."
    echo
    exit
fi


echo
echo
echo "###################################################################################"
echo "#                                                                                 #"
echo "#  Beginning build process                                                        #"
echo "#                                                                                 #"
echo "###################################################################################"
echo


#------------------------------------------------------------------------------
# Ask what type of build we'll create
#------------------------------------------------------------------------------
echo -n "Is this build for development or production? (development|production) :: "
read buildType    
if [ "$buildType" != "development" ] && [ "$buildType" != "production" ]; then
    echo "Invalid argument. Must specify either development or production"
    exit
fi
echo

#------------------------------------------------------------------------------
# Ask for the output directory. No error checking.
#------------------------------------------------------------------------------
echo -n "Enter path to where you want to build to be stored. :: "
read outputFolder # path to folder where Cordova build will be created

# Expand tidle if needed.
# See: http://stackoverflow.com/questions/3963716/how-to-manually-expand-a-special-variable-ex-tilde-in-bash/27485157#27485157
outputFolder=${outputFolder/#\~/$HOME}

if [ -z ${outputFolder} ]; then
    echo "Must provide an output directory."
    exit
fi
echo
echo "A" $buildType "build will be created and stored in" $outputFolder
sleep 3


#------------------------------------------------------------------------------
# Check if the appropriate Java keystore exists.
#------------------------------------------------------------------------------
echo
echo
echo "###################################################################################"
echo "#                                                                                 #"
echo "#  Java Keystore                                                                  #"
echo "#                                                                                 #"
echo "###################################################################################"
echo

expectedKeystoreEntry=$APP_NAME"_"$buildType
keystorePath=$ANDROID_KEYSTORE_FOLDER$ANDROID_KEYSTORE_NAME

echo "Before starting, we need to check the Java keystore for key that will be used to sign"
echo "the Android APK this script will generate. Based on the configuration provided at the"
echo "top of this script (i.e., the .sh file), the expected location of the keystore is:"
echo 
echo "  " $keystorePath
echo
echo "Within the keystore, the following PrivateKeyEntry is expected::"
echo
echo "  " $expectedKeystoreEntry
echo
echo "If this information looks wrong, cancel the current execution, and modify the script."
echo
echo "For more info about signing the Android APK, see the \"Sign Your App Manually\""
echo "section of https://developer.android.com/studio/publish/app-signing.html#signing-manually"
echo

# Check that the keystore exists. 
if [ ! -f $keystorePath ]; then 
    
    # Ask if user wants to create the keystore.
    echo -n "Could not find the keystore. Do you want to create one? It's required to sign the APK. (yes|no) :: "
    read answerCreateKeystore
    if [ $answerCreateKeystore != "yes" ]; then
        echo "Exiting."
        echo
        exit
    fi

    # Print message explaining what's going to happen
    echo "The Java keytool will walk you through (1) creating a new keystore and (2) creating a"
    echo "new PrivateKeyEntry for signing the Android APK. You'll first need to set a password for"
    echo "the new keystore, then provide information used for creating the keys. Finally, you'll"
    echo "set a password for the new PrivateKeyEntry; choose something secure and don't forget it."
    echo
    echo "The Java keytool will walk you through (1) creating a new keystore and (2) creating a new"
    echo "PrivateKeyEntry for signing the Android APK. More specifically, you'll first need to set"
    echo "a password for the new keystore being created. You'll then be walked through providing a"
    echo "Distinguished Name. Finally, you'll be asked to set a password for the new PrivateKeyEntry."
    echo "This generates a keystore called" $ANDROID_KEYSTORE_NAME "that contains a single key,"
    echo "which is valid for 10,000 days."
    echo
    echo "Note: The Java keystore being generated will be stored in the same folder from where this"
    echo "build script is being run."
    echo

    # Generate the keystore
    keytool -genkey -alias $expectedKeystoreEntry -keyalg RSA -keysize 2048 -validity 10000 -keystore $keystorePath

    # Keystore file exists. Ask for its password.
    echo -n "Please enter the keystore's password. (It's needed for reading the keystore.) :: "
    read -s keystorePassword
    echo

else # TODO: Move into own function.

    # Keystore file exists. Ask for its password.
    echo -n "Please enter the keystore's password. (It's needed for reading the keystore.) :: "
    read -s keystorePassword
    echo

    # Check the PrivateKeyEntry we want to use for signing is actually in the keystore. 
    # This is done by using keytool to list keystores, and grepping the results to find the keystore we need.
    if [ $(keytool -list -storepass $keystorePassword -keystore $ANDROID_KEYSTORE_NAME | grep $expectedKeystoreEntry -c) == 0 ]; then
        echo
        echo "Could not find PrivateKeyEntry:" $expectedKeystoreEntry
        echo "You can create one now. If you choose to, you'll be asked to set a password"
        echo "for the new PrivateKeyEntry (used to sign the Android app). Choose a secure password."
        echo
        echo -n "Would you like to create one? (yes|no) :: "
        read answerCreateKeystoreEntry
        if [ $answerCreateKeystoreEntry != "yes" ]; then
            echo "Exiting."
            echo
            exit
        fi
        echo

        # Generate PrivateKeyEntry
        keytool -genkey -alias $expectedKeystoreEntry -keyalg RSA -keysize 2048 -validity 10000 -keystore $keystorePath

    else
        echo
        echo "Found existing PrivateKeyEntry:" $expectedKeystoreEntry
        echo
        sleep 2
    fi
fi

# Double-check the key entry exists. 
# TODO: SOMETHING MAY CAUSE A FAILURE HERE IF A NEW KEYSTORE WAS JUST CREATED
if [ $(keytool -list -storepass $keystorePassword -keystore $ANDROID_KEYSTORE_NAME | grep $expectedKeystoreEntry -c) == 0 ]; then
    echo
    echo "ERROR. Something may have gone wrong while creating key store/entry. Quitting."
    echo
    exit
fi

echo 
echo -n "Please enter the password for the PrivateKeyEntry" $expectedKeystoreEntry ":: "
read -s keyEntryPassword


#------------------------------------------------------------------------------
# Store reference to current directory so we can navigate back to it later. 
#------------------------------------------------------------------------------
STARTING_DIR=${PWD}


echo
echo
echo "###################################################################################"
echo "#                                                                                 #"
echo "#  Cordova Build                                                                  #"
echo "#                                                                                 #"
echo "###################################################################################"
echo

#------------------------------------------------------------------------------
# Set the Galaxy server URL based on the type of build being created.
#------------------------------------------------------------------------------
if [ "$buildType" == "development" ]; then
    galaxyServerUrl=$DEVELOPMENT_SERVER_URL
else 
    galaxyServerUrl=$PRODUCTION_SERVER_URL
fi
echo "Build will use Galaxy server located at:" $galaxyServerUrl
echo
sleep 2


#------------------------------------------------------------------------------
# Delete Cordova build cache. Minimal error checking.
#------------------------------------------------------------------------------
if [ -d "$METEOR_BUILD_CACHE_FOLDER" ]; then
    rm -rf ${METEOR_BUILD_CACHE_FOLDER}
fi
if [ -d "$METEOR_BUILD_CACHE_FOLDER" ]; then
    echo "ERROR. Failed to delete Cordova build cache. Exiting."
    exit
else 
    echo "Deleted previous Cordova build cache."
fi
 

#------------------------------------------------------------------------------
# Create the Cordova build
#------------------------------------------------------------------------------
echo "Begin creating Cordova builds..."
cd $PROJECT_ROOT
meteor build $outputFolder --server=$galaxyServerUrl
if [ -d "$outputFolder" ]; then
    echo
    echo "...successfully created Cordova builds."
    echo
else
    echo "ERROR. Failed to create Cordova builds. Exiting."
    exit
fi


echo
echo
echo "###################################################################################"
echo "#                                                                                 #"
echo "#  Signing and Optimizing Android Build                                           #"
echo "#                                                                                 #"
echo "###################################################################################"
echo

#------------------------------------------------------------------------------
# Sign the Android APK (Assumes private key was already generated)
# https://guide.meteor.com/mobile.html#submitting-android
#------------------------------------------------------------------------------
unsignedAPKPath=$outputFolder"/android/release-unsigned.apk"
echo "Attempting to sign Android APK located at:" $unsignedAPKPath
echo
jarsigner -sigalg SHA1withRSA -digestalg SHA1 $unsignedAPKPath $expectedKeystoreEntry -storepass $keystorePassword -keypass $keyEntryPassword -keystore $keystorePath
echo


#------------------------------------------------------------------------------
# Optimize the APK
#------------------------------------------------------------------------------
signedAPKPath=$outputFolder"/android/"$APP_NAME"_"$APP_VERSION"_"$buildType".apk"
$ANDROID_ZIPALIGN_PATH 4 $unsignedAPKPath $signedAPKPath
if [ -f $signedAPKPath ]; then
    echo "Created and optimized Android APK for release."
    echo "APK is located at:" $signedAPKPath
else
    echo "ERROR. Problem occurred while optimizing and signing APK. Existing."
    exit
fi


echo
echo
echo "###################################################################################"
echo "#                                                                                 #"
echo "#  Completed Automated Build Process                                              #"
echo "#                                                                                 #"
echo "###################################################################################"
echo
echo "Done creating Cordova builds. All output is located at:"
echo "   " $outputFolder
echo
echo "An Android APK for production has been built. However, addition work is "
echo "needed to prepare the iOS build. Would you like to view instructions?"
echo

echo -n "Show instructions [yes|no] :: "
read x1
if  [ $x1 != "yes" ]; then
    echo "Exiting"
    exit
fi


echo
echo
echo "###################################################################################"
echo "#                                                                                 #"
echo "#  iOS Build Instructions                                                         #"
echo "#                                                                                 #"
echo "###################################################################################"
echo
echo "(1) Open the Xcode proejct located at" $outputFolder"/iOS/"
echo
echo "(2) You might be prompted to convert the project to Swift 3 if the project was created"
echo "    using an outdated version of Meteor. Convert the project if you receive this prompt."
echo
echo "(3) Open the PARC Coach target settings."
echo
echo "(4) Under the \"General\" tab:"
echo
echo "  (*) Set build number."
echo "  (*) Configure signing settings."
#echo "  (*) Update the \"Development Target\" as needed."
#echo "  (*) Update \"Devices\" as needed."
echo "  (*) Set device orientation to \"Portait\" only." 
echo "  (*) Uncheck option \"Requires full screen\"."
echo "  (*) Uncheck option \"Hide status bar\"."
#echo "  (*) Set status bar style to \"Default\""
echo
echo "(5) Under the \"Capabilities\" tab:"
echo
echo "  (*) Enable \"Push Notifications\"."
echo
echo "(6) Ensure app icons and launch images are properly set."
echo 
echo 
echo "From this point on, the process for building the app archive and submitting it to"
echo "the App Store is the same as it would be for any other iOS app. Please refer to Apple’s"
echo "documentation for further details."
echo
echo

# Return to directory where script was started
cd $STARTING_DIR
