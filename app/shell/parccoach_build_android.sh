#!/bin/bash
echo
echo
echo "###################################################################################"
echo "#                                                                                 #"
echo "#  Android Build                                                                  #"
echo "#                                                                                 #"
echo "###################################################################################"
echo
echo
echo meteor build . --server=parccoach-dev-kph.meteorapp.com
meteor build latestBuild --server=parccoach-dev-kph.meteorapp.com
