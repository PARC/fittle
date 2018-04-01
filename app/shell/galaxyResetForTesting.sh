#!/bin/bash
# This script clears the I2 Study database collections and resets them for testing
# References:
# For command line argument assignment: https://unix.stackexchange.com/questions/122845/using-a-b-for-variable-assignment-in-scripts
host=${1:-parccoach-altdev.meteorapp.com}
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
# Then add all the defaults back
curl -H "Content-Type: application/json" -X POST -d @./data/json/onboardingKPH.json https://$host/serviceapi/participants/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/LocusOfControl.json https://$host/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/GetDisplayName.json https://$host/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/exampleJITAI.json https://$host/serviceapi/scheduledmessages/add/woof
#curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsGoalTypeSelect.json https://$host/serviceapi/scheduledmessages/add/woof
#curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsI2Select.json https://$host/serviceapi/scheduledmessages/add/woof
#curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsSpecificGoalSelect.json https://$host/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsReporting.json https://$host/serviceapi/scheduledmessages/add/woof
# Finally print out what we have now
#curl -H "Content-Type: application/json" -X GET https://$host/serviceapi/scheduledmessages/woof
#curl -H "Content-Type: application/json" -X GET https://$host/serviceapi/participants/woof
#curl -H "Content-Type: application/json" -X GET https://$host/serviceapi/questions/woof
#curl -H "Content-Type: application/json" -X GET https://$host/serviceapi/tasks/woof
