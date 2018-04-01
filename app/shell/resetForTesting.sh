#!/bin/bash
# This script clears the I2 Study database collections and resets them for testing
# First clear all the relevant collections, including users (needs the super secret token to permit)
curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/serviceapi/resetAllForTesting/superWoof
# Then add all the defaults back

curl -H "Content-Type: application/json" -X POST -d @./data/json/onboarding.silver.json http://localhost:3000/serviceapi/participants/add/woof
#curl -H "Content-Type: application/json" -X POST -d @./data/json/LocusOfControl.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/GetDisplayName.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
#curl -H "Content-Type: application/json" -X POST -d @./data/json/ExampleMultiChoice.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
#curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsGoalTypeSelect.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
#curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsI2Select.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
#curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsSpecificGoalSelect.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @./data/json/I2QuestionsReporting.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
#curl -H "Content-Type: application/json" -X POST -d @./data/json/exampleRescheduling.json http://localhost:3000/serviceapi/scheduledmessages/add/woof
# Finally print out what we have now
#curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/scheduledmessages/woof
#curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/participants/woof
#curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/questions/woof
#curl -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/tasks/woof
