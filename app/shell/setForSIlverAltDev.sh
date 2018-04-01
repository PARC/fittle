#!/bin/bash
echo "Copy over Alt Dev settings & mobil-config for Silver"
cp ./shell/settings.silver.altdev.txt  ./settings.json
cp ./shell/mobile-config-silver.txt  ./mobile-config.js
echo "Remember to delete the '.meteor/local' directory"
echo "change the AndroidManifest after build & rebuild too"
echo 'change android:windowSoftInputMode="adjustResize"'
echo ' to '
echo 'change android:windowSoftInputMode="adjustPan"'