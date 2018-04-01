#!/bin/bash
# This script clears the ACTUAL_VALUE_HERE Study database collections and resets them for testing
#
# Apple Demo account creation
# curl -H "Content-Type: application/json" -X POST -d @./data/json/onboarding.apple.demo.json https://ACTUAL_HOSTNAME_GOES_HERE.meteorapp.com/serviceapi/participants/add/ACTUAL_TOKEN_GOES_HERE


host=${1:-ACTUAL_HOSTNAME_GOES_HERE.meteorapp.com}
echo "Resetting Galaxy $host"
echo
echo -n "Would you like to reset this host? (yes|no) :: "
read x
if  [ $x != "yes" ]; then
    echo "Quitting build process."
    echo
    exit
fi
#
# First clear all the relevant collections, including users (needs the super secret token to permit)
curl -H "Content-Type: application/json" -X DELETE https://$host/serviceapi/resetAllForTesting/ACTUAL_TOKEN_GOES_HERE
# Then add all the defaults back for Silver running on the indicated server
curl -H "Content-Type: application/json" -X POST -d @./data/json/onboarding.ACTUAL_VALUE_HERE.json https://$host/serviceapi/participants/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/onboarding.apple.demo.json https://$host/serviceapi/participants/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/GetDisplayName.json https://$host/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsReporting.json https://$host/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/ACTUAL_VALUE_HEREReportingDays29To99.json https://$host/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/ACTUAL_VALUE_HEREDailyTipsAll.json https://$host/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/LocusOfControl.json https://$host/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
#end of script

