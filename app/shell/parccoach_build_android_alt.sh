#!/bin/csh -f

set OUTPUT_PATH = '../build'
set APK_PATH = $OUTPUT_PATH/android
set DEST_PATH = '/Users/lnelson/builds'

echo 'Building Android Release'
echo 'Shell ' $SHELL
echo 'Output Directory ' $OUTPUT_PATH
echo 'APK path ' $APK_PATH
echo 'DEST APK path ' $DEST_PATH

meteor build $OUTPUT_PATH --server=parccoach-dev-kph.meteorapp.com

cp $APK_PATH/release-unsigned.apk $APK_PATH/app.apk
echo "Sign it"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore $APK_PATH/app.apk alias_name
echo "Done"
#/Users/lnelson/Library/Android/sdk/build-tools/24.0.1/zipalign -f -v 4 $APK_PATH/app.apk $APK_PATH/app-aligned.apk
/Users/lnelson/Library/Android/sdk/build-tools/26.0.2/zipalign -f -v 4 $APK_PATH/app.apk $APK_PATH/app-aligned.apk
echo "Copy to server"
mv $APK_PATH/app-aligned.apk $APK_PATH/parccoach.apk
cp -f $APK_PATH/parccoach.apk $DEST_PATH/parccoach.apk
echo "Done building android RELEASE"