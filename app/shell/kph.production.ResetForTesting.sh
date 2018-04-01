#!/bin/bash
# This script clears the KPH Study database collections and resets them for testing
#
# Apple Demo account creation
# curl -H "Content-Type: application/json" -X POST -d @./data/json/onboarding.apple.demo.json https://fittle-hawaii.meteorapp.com/serviceapi/participants/add/woof


host=${1:-fittle-hawaii.meteorapp.com}
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
curl -H "Content-Type: application/json" -X DELETE https://$host/serviceapi/resetAllForTesting/superWoof
# Then add all the defaults back for Silver running on the indicated server
curl -H "Content-Type: application/json" -X POST -d @./data/json/onboarding.kph.json https://$host/serviceapi/participants/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/onboarding.apple.demo.json https://$host/serviceapi/participants/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/GetDisplayName.json https://$host/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsReporting.json https://$host/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/KPHReportingDays29To99.json https://$host/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/KPHDailyTipsAll.json https://$host/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/LocusOfControl.json https://$host/serviceapi/scheduledmessages/add/woof
#end of script

