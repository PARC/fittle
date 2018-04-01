#!/bin/bash
# This script clears the I2 Study database collections on Heroku and resets them for testing
# First clear all the relevant collections, including users (needs the super secret token to permit)
curl -H "Content-Type: application/json" -X DELETE http://parc-positive-day.herokuapp.com/serviceapi/resetAllForTesting/superWoof
# Then add all the defaults back
curl -H "Content-Type: application/json" -X POST -d @/Users/lnelson/meteor_home/positivedayI2/shell/herokuTestOnboarding.json http://parc-positive-day.herokuapp.com/serviceapi/participants/add/woof
curl -H "Content-Type: application/json" -X POST -d @/Users/lnelson/meteor_home/positivedayI2/data/json/I2QuestionsGoalTypeSelect.json http://parc-positive-day.herokuapp.com/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @/Users/lnelson/meteor_home/positivedayI2/data/json/I2QuestionsI2Select.json http://parc-positive-day.herokuapp.com/serviceapi/scheduledmessages/add/woof
curl -H "Content-Type: application/json" -X POST -d @/Users/lnelson/meteor_home/positivedayI2/data/json/I2QuestionsSpecificGoalSelect.json http://parc-positive-day.herokuapp.com/serviceapi/scheduledmessages/add/woof
# Finally print out what we have now
curl -H "Content-Type: application/json" -X GET http://parc-positive-day.herokuapp.com/serviceapi/scheduledmessages/woof
curl -H "Content-Type: application/json" -X GET http://parc-positive-day.herokuapp.com/serviceapi/participants/woof
curl -H "Content-Type: application/json" -X GET http://parc-positive-day.herokuapp.com/serviceapi/questions/woof
curl -H "Content-Type: application/json" -X GET http://parc-positive-day.herokuapp.com/serviceapi/tasks/woof
