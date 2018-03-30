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

buildType="production"

#---------------------------------------------------------------
# Setup config files for Silver on altdev
#---------------------------------------------------------------

echo "Copy over production settings & mobil-config for ACTUAL_VALUE_HERE"
./shell/setForACTUAL_VALUE_HEREProduction.sh

#---------------------------------------------------------------
# Galaxy Config
#---------------------------------------------------------------

# Full path to the settings.json containing environment variables for Galaxy.
# See http://galaxy-guide.meteor.com/environment-variables.html
# The following used to be severl links that became the same due to how the copying of settings now works
PRODUCTION_GALAXY_SETTINGS_JSON_PATH=$PROJECT_ROOT"/settings.json"

# The generic command used for deploying apps to Galaxy
GALAXY_DEPLOYMENT_STRING="DEPLOY_HOSTNAME=us-east-1.galaxy-deploy.meteor.com meteor deploy"

# Used to specify who owns the Galaxy deployment when deployed by a user is a
# member of two or more accounts. If the owner is an organization, then the
# deployment will be visible to everyone in the orginization, which is
# ideal for production and shared development deployments. If the owner is a single
# user account, the deployment will be visible only to that user, which is ideal for
# one-off testing.
# See: http://galaxy-guide.meteor.com/deploy-guide.html#account-selection
GALAXY_OWNER="YOUR_OWNER_HERE"

# Names of apps deployed to Galaxy
PRODUCTION_GALAXY_HOSTNAME="YOUR_HOSTNAME_HERE"


#######################################################################################################################
#
# SCRIPT BODY
#
#######################################################################################################################


#------------------------------------------------------------------------------
# Set the Galaxy hostname based on the type of deployment being performed.
#------------------------------------------------------------------------------
galaxyTarget=$PRODUCTION_GALAXY_HOSTNAME
GALAXY_SETTINGS_JSON_PATH=$PRODUCTION_GALAXY_SETTINGS_JSON_PATH


echo "Deploy Activities for parccoach to $buildType"
echo
echo "Galaxy target hostname:"
echo "  " $galaxyTarget
echo
echo




#------------------------------------------------------------------------------
# Begin deployment to Galaxy.
#------------------------------------------------------------------------------
# Store reference to current directory so we can navigate back to it later.
STARTING_DIR=${PWD}

# Need to move into the project directory so the meteor command can be run.
cd $PROJECT_ROOT

# Execute the command for deploying to Galaxy.
deploymentCommand=$GALAXY_DEPLOYMENT_STRING" "$galaxyTarget" --settings "$GALAXY_SETTINGS_JSON_PATH" --owner "$GALAXY_OWNER

echo "Deploying $deploymentCommand"
echo -n "Begin" $buildType "deployment? (yes|no) :: "
read answerBegin
if [ $answerBegin != "yes" ]; then
    echo "Quitting."
    echo
    exit
fi
eval $deploymentCommand

#------------------------------------------------------------------------------
# Give the user a chance to perform any additional work that might be required
# (e.g., importing documents).
#------------------------------------------------------------------------------




#------------------------------------------------------------------------------
# Done.
#------------------------------------------------------------------------------
echo
echo "Done."
echo

