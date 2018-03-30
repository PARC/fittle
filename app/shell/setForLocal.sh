#!/bin/bash
echo "Copy over settings & mobil-config for ACTUAL_VALUE_HERE"
cp ./shell/settings.ACTUAL_VALUE_HERE.local.txt  ./settings.json
cp ./shell/mobile-config-ACTUAL_VALUE_HERE.txt  ./mobile-config.js
echo "Remember to delete the '.meteor/local' directory"
echo "change the AndroidManifest after build & rebuild too"
echo 'change android:windowSoftInputMode="adjustResize"'
echo ' to '
echo 'change android:windowSoftInputMode="adjustPan"'