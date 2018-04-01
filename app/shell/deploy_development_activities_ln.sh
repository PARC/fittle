#!/bin/bash

#######################################################################################################################
#
# SCRIPT CONFIGURATION: Modify values in section before running the script.
# PURPOSE Only load the Activities collection
#
#######################################################################################################################

#---------------------------------------------------------------
# Filesystem Config
#---------------------------------------------------------------

# Specifies the full path to the Meteor project root.
ROOT=$PWD
if [ ! -f settings.json ]; then
    echo "Path $ROOT has not settings.json file - run this script from the project root directory"
    exit
fi
PROJECT_ROOT=$ROOT
echo "Script $0 starting at $PROJECT_ROOT"


#---------------------------------------------------------------
# Galaxy Config
#---------------------------------------------------------------

# Full path to the settings.json containing environment variables for Galaxy.
# See http://galaxy-guide.meteor.com/environment-variables.html
DEVELOPMENT_GALAXY_SETTINGS_JSON_PATH=$PROJECT_ROOT"/settings.json"
PRODUCTION_GALAXY_SETTINGS_JSON_PATH=$PROJECT_ROOT"/settings.production.json"

# The generic command used for deploying apps to Galaxy
GALAXY_DEPLOYMENT_STRING="DEPLOY_HOSTNAME=us-east-1.galaxy-deploy.meteor.com meteor deploy"

# Used to specify who owns the Galaxy deployment when deployed by a user is a
# member of two or more accounts. If the owner is an organization, then the
# deployment will be visible to everyone in the orginization, which is
# ideal for production and shared development deployments. If the owner is a single
# user account, the deployment will be visible only to that user, which is ideal for
# one-off testing.
# See: http://galaxy-guide.meteor.com/deploy-guide.html#account-selection
GALAXY_OWNER="parci2"

# Names of apps deployed to Galaxy
DEVELOPMENT_GALAXY_HOSTNAME="parccoach-dev-kph"
PRODUCTION_GALAXY_HOSTNAME="parccoach-kph"


#---------------------------------------------------------------
# mLab Database Config
#---------------------------------------------------------------
DEVELOPMENT_DATABASE_HOST="ds115918.mlab.com:15918"
DEVELOPMENT_DATABASE_NAME="parccoach-dev-kph"
DEVELOPMENT_DATABASE_USER="i2ameteorclient"
#DEVELOPMENT_DATABASE_PASS="JLh819#5g136Q#Kv" #Deprecated 12/9/16  LN
DEVELOPMENT_DATABASE_PASS="vKy7G6#t07EI1MIX"

PRODUCTION_DATABASE_HOST="ds115798.mlab.com:15798"
PRODUCTION_DATABASE_NAME="parccoach-kph-preprod"
PRODUCTION_DATABASE_USER="i2ameteorclient"
#PRODUCTION_DATABASE_PASS="JLh819#5g136Q#Kv" #Deprecated 12/9/16  LN
PRODUCTION_DATABASE_PASS="vKy7G6#t07EI1MIX"


#######################################################################################################################
#
# SCRIPT BODY
#
#######################################################################################################################


#------------------------------------------------------------------------------
# Parse argument provided at terminal specifying the script should deploy to
# a production or development environment.
#------------------------------------------------------------------------------
args=("$@")

buildType=${args[0]} #development | production

if [ "$buildType" != "development" ] && [ "$buildType" != "production" ]; then
    echo "Invalid argument. Must specify either development or production"
    exit
fi


#------------------------------------------------------------------------------
# Set the Galaxy hostname based on the type of deployment being performed.
#------------------------------------------------------------------------------
if [ "$buildType" == "development" ]; then
    galaxyTarget=$DEVELOPMENT_GALAXY_HOSTNAME
    DATABASE_HOST=$DEVELOPMENT_DATABASE_HOST
    DATABASE_NAME=$DEVELOPMENT_DATABASE_NAME
    DATABASE_USER=$DEVELOPMENT_DATABASE_USER
    DATABASE_PASS=$DEVELOPMENT_DATABASE_PASS
    GALAXY_SETTINGS_JSON_PATH=$DEVELOPMENT_GALAXY_SETTINGS_JSON_PATH
else
    galaxyTarget=$PRODUCTION_GALAXY_HOSTNAME
    DATABASE_HOST=$PRODUCTION_DATABASE_HOST
    DATABASE_NAME=$PRODUCTION_DATABASE_NAME
    DATABASE_USER=$PRODUCTION_DATABASE_USER
    DATABASE_PASS=$PRODUCTION_DATABASE_PASS
    GALAXY_SETTINGS_JSON_PATH=$PRODUCTION_GALAXY_SETTINGS_JSON_PATH
fi


#------------------------------------------------------------------------------
# Confirm the settings that'll be used during the deployment. This provides
# the user an opportunity to cancel before any real work is performed.
#------------------------------------------------------------------------------
# Extract the MONGO_DB setting string from the Meteor settings.json file.
dbSettings=$(grep -oh mongodb:\/\/i2ameteorclient\:.*mlab.com\:[^\"]* $GALAXY_SETTINGS_JSON_PATH)


echo "Deploy Activities for parccoach to $buildType"
echo
echo "Meteor Database settings:"
echo "  " $dbSettings
echo
echo "Galaxy target hostname:"
echo "  " $galaxyTarget
echo
echo "mLab database settings:"
echo "  " $DATABASE_HOST
echo "  " $DATABASE_NAME
echo

importcommand="mongoimport -h $DATABASE_HOST --db $DATABASE_NAME -u $DATABASE_USER -p $DATABASE_PASS --collection activities --type json --jsonArray --file private/activities.json"
echo "Command to run: "$importcommand


#------------------------------------------------------------------------------
# Give the user a chance to perform any additional work that might be required
# (e.g., importing documents).
#------------------------------------------------------------------------------

# Ask user if Activities documents should be imported.
echo
echo -n "Import Activities documents? (yes|no) :: "
read answerImportActivities
if [ $answerImportActivities != "yes" ]; then
    echo "Quitting."
    echo
    exit
fi

# Import documents
mongoimport -h $DATABASE_HOST --db $DATABASE_NAME -u $DATABASE_USER -p $DATABASE_PASS --collection activities --type json --jsonArray --file private/activities.json


#------------------------------------------------------------------------------
# Done.
#------------------------------------------------------------------------------
echo
echo "Done."
echo

