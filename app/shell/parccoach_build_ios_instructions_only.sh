#!/bin/bash
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