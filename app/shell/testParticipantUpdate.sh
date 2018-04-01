#!/bin/bash
# This script sets and examines changing a Participant's Study Condition
# Run the test
echo curl -H "Content-Type: application/json" -X POST -d '{"emailAddress":"static@parc.com","attribute":"condition","value":"'${1:-variable}'"}' http://localhost:3000/serviceapi/participants/update/woof
curl -H "Content-Type: application/json" -X POST -d '{"emailAddress":"static@parc.com","attribute":"condition","value":"'${1:-variable}'"}' http://localhost:3000/serviceapi/participants/update/woof
# Print out results
curl --silent -H "Content-Type: application/json" -X GET http://localhost:3000/serviceapi/participants/woof | grep "static@parc.com" -2
