#!/bin/bash

# Specifies the full path to the Meteor project root.
ROOT=$PWD
if [ ! -f settings.json ]; then
    echo "You are not at the Meteor project $ROOT. Try from Meteor app folder: ./shell/rmbranch.sh name-of-branch-to-delete"
    exit
fi
PROJECT_ROOT=$ROOT
echo "Script $0 starting at $PROJECT_ROOT"

REMOTE_NAME="origin"

#######################################################################################################################
#
# SCRIPT BODY
#
#######################################################################################################################

if [ -z "$1" ]
  then
    echo "No argument supplied. Usage: ./shell/rmbranch.sh name-of-branch-to-delete"
    exit
fi


#------------------------------------------------------------------------------
# Parse argument provided at terminal specifying the script should deploy to
# a production or development environment.
#------------------------------------------------------------------------------
args=("$@")

branch_name=${args[0]}

echo "OK to delete branch $branch_name locally and on remote $REMOTE_NAME? (yes|no) :: "
read answerBegin
if [ $answerBegin != "yes" ]; then
     echo "Quitting."
     echo
     exit
fi

git push -d $REMOTE_NAME $branch_name
git branch -d $branch_name
git branch -a
