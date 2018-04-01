#!/bin/bash
# This script clears the I2 Study database collections and resets them for testing

# First clear all the relevant collections, including users (needs the super secret token to permit)
curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/resetAllForTesting/ACTUAL_TOKEN_GOES_HERE

# Then add all the defaults back
curl -H "Content-Type: application/json" -X POST -d @./data/json/onboarding.silver.json http://localhost:3000/serviceapi/participants/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/GetDisplayName.json http://localhost:3000/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/silverReporting28Days.json http://localhost:3000/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
