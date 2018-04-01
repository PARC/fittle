#!/bin/csh -f

echo "Copy over KPH settings.json and mobile-config"
./shell/setForKPHAltDev.sh

set OUTPUT_PATH = '../build'
set APK_PATH = $OUTPUT_PATH/android
set DEST_PATH = '../apks'

echo 'Building Android Release'
echo 'Shell ' $SHELL
echo 'Output Directory ' $OUTPUT_PATH
echo 'APK path ' $APK_PATH
echo 'DEST APK path ' $DEST_PATH

meteor build $OUTPUT_PATH --server=https://parccoach-altdev.meteorapp.com

cp $APK_PATH/release-unsigned.apk $APK_PATH/app.apk
echo "Sign it"
# parc333 keystore pw
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore $APK_PATH/app.apk alias_name
echo "Done"
#/Users/krivacic/Library/Android/sdk/build-tools/23.0.2/zipalign -f -v 4 $APK_PATH/app.apk $APK_PATH/app-aligned.apk
#/Users/lnelson/Library/Android/sdk/build-tools/24.0.1/zipalign -f -v 4 $APK_PATH/app.apk $APK_PATH/app-aligned.apk
/Users/lnelson/Library/Android/sdk/build-tools/26.0.2/zipalign -f -v 4 $APK_PATH/app.apk $APK_PATH/app-aligned.apk
echo "Copy to server"
mv $APK_PATH/app-aligned.apk $APK_PATH/parccoach-altdev.apk
cp -f $APK_PATH/parccoach-altdev.apk $DEST_PATH/parccoach-kph.apk
echo "Done building android ALTDEV KPH"