#!/bin/bash
echo "Copy over settings settings.kph.production.txt & mobile-config mobile-config-kph.txt"
cp ./shell/settings.kph.production.txt  ./settings.json
cp ./shell/mobile-config-kph.txt  ./mobile-config.js
echo "Remember to delete the '.meteor/local' directory"
echo "change the AndroidManifest after build & rebuild too"
echo 'change android:windowSoftInputMode="adjustResize"'
echo ' to '
echo 'change android:windowSoftInputMode="adjustPan"'