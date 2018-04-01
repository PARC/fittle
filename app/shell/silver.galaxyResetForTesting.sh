#!/bin/bash
# This script clears the I2 Study database collections and resets them for testing
# References:
# For command line argument assignment: https://unix.stackexchange.com/questions/122845/using-a-b-for-variable-assignment-in-scripts
host=${1:-parccoach-prod.meteorapp.com}
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
curl -H "Content-Type: application/json" -X DELETE https://$host/serviceapi/resetAllForTesting/682888C665E545FAB52A18003728F61A

# Then add all the defaults back for Silver running on the indicated server
curl -H "Content-Type: application/json" -X POST -d @./data/json/onboarding.silver.json https://$host/serviceapi/participants/add/41C54596DF364B5F9D9426D680A16D14
curl -H "Content-Type: application/json" -X POST -d @./data/json/GetDisplayName.json https://$host/serviceapi/scheduledmessages/add/41C54596DF364B5F9D9426D680A16D14
curl -H "Content-Type: application/json" -X POST -d @./data/json/silverReporting28DaysAfterword.json https://$host/serviceapi/scheduledmessages/add/41C54596DF364B5F9D9426D680A16D14
