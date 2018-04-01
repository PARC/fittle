#!/bin/csh -f


echo "Copy over Prod Silver settings.production.json and mobile-config"
./shell/setForSilverProd.sh

set OUTPUT_PATH = '../build'
set APK_PATH = $OUTPUT_PATH/android
set DEST_PATH = '../apks'

echo 'Building Android Release'
echo 'Shell ' $SHELL
echo 'Output Directory ' $OUTPUT_PATH
echo 'APK path ' $APK_PATH
echo 'DEST APK path ' $DEST_PATH

meteor build $OUTPUT_PATH --server=https://parccoach-prod.meteorapp.com --mobile-settings=settings.production.json

cp $APK_PATH/release-unsigned.apk $APK_PATH/app.apk
echo "Sign it"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore $APK_PATH/app.apk alias_name
echo "Done"
$HOME/Library/Android/sdk/build-tools/26.0.2/zipalign -f -v 4 $APK_PATH/app.apk $APK_PATH/app-aligned.apk
echo "Copy to server"
cp $APK_PATH/app-aligned.apk $APK_PATH/parccoach-prod.apk
cp -f $APK_PATH/parccoach-prod.apk $DEST_PATH/parccoach-silver.apk
echo "Done building android PROD SILVER"