#!/bin/bash
# This script clears the I2 Study database collections and resets them for testing
# First clear all the relevant collections, including users (needs the super secret token to permit)
curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/resetAllForTesting/ACTUAL_TOKEN_GOES_HERE
# Then add all the defaults back

curl -H "Content-Type: application/json" -X POST -d @./data/json/onboarding.ACTUAL_VALUE_HERE.json http://localhost:3000/serviceapi/participants/add/ACTUAL_TOKEN_GOES_HERE
#Add this back in when fully tested:
curl -H "Content-Type: application/json" -X POST -d @./data/json/LocusOfControl.json http://localhost:3000/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/GetDisplayName.json http://localhost:3000/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsReporting.json http://localhost:3000/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
curl -H "Content-Type: application/json" -X POST -d @./data/json/exampleJITAI.json http://localhost:3000/serviceapi/scheduledmessages/add/ACTUAL_TOKEN_GOES_HERE
# Finally print out what we have now
#curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/scheduledmessages/ACTUAL_TOKEN_GOES_HERE
#curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/participants/ACTUAL_TOKEN_GOES_HERE
#curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/questions/ACTUAL_TOKEN_GOES_HERE
#curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/tasks/ACTUAL_TOKEN_GOES_HERE
