#!/bin/csh -f

echo "Copy over KPH settings.json and mobile-config"
./shell/setForKPHProduction.sh

set OUTPUT_PATH = '../build/debug'
set APK_PATH = $OUTPUT_PATH/android
set DEST_PATH = '../apks'

echo 'Building Android Release'
echo 'Shell ' $SHELL
echo 'Output Directory ' $OUTPUT_PATH
echo 'APK path ' $APK_PATH
echo 'DEST APK path ' $DEST_PATH

meteor build $OUTPUT_PATH --server=https://fittle-hawaii.meteorapp.com --debug
echo "Done building DEBUG android Production KPH"