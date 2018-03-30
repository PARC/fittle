#!/bin/bash
echo "Copy over settings settings.ACTUAL_VALUE_HERE.production.txt & mobile-config mobile-config-ACTUAL_VALUE_HERE.txt"
cp ./shell/settings.ACTUAL_VALUE_HERE.production.txt  ./settings.json
cp ./shell/mobile-config-ACTUAL_VALUE_HERE.txt  ./mobile-config.js
echo "Remember to delete the '.meteor/local' directory"
echo "change the AndroidManifest after build & rebuild too"
echo 'change android:windowSoftInputMode="adjustResize"'
echo ' to '
echo 'change android:windowSoftInputMode="adjustPan"'