#!/bin/bash
echo "Copy over KPH Dev settings & mobil-config for KPH"
cp ./shell/settings.kph.altdev.txt  ./settings.json
cp ./shell/mobile-config-kph.txt  ./mobile-config.js
echo "Remember to delete the '.meteor/local' directory"
echo "change the AndroidManifest after build & rebuild too"
echo 'change android:windowSoftInputMode="adjustResize"'
echo ' to '
echo 'change android:windowSoftInputMode="adjustPan"'