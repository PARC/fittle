# -*- coding: utf-8 -*-
"""api_demo.py  Example PARC Coach API calls in Python

This module demonstrates some ways to call the PARC Coach API

Command Line Help:
    python api_tasks_demo.py --help

Example:
    Running against PARC Coach Server hosted on localhost:
        $ python api_tasks_demo.py
    Running against PARC Coach Server hosted on Galaxy Dev Server:
        $ python api_tasks_demo.py --host ACTUAL_HOSTNAME_GOES_HERE.meteorapp.com

Todo:
    * There is very little error protection and processing in the API currently

"""
import json
import requests  #Requires running sudo pip install requests
import pprint
import argparse
import sys

#################################################
# Process command line inputs and defaults
#################################################
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Demonstrate PARC Coach API')
    parser.add_argument('--host',
                        help='host name part of URL for PARC Coach server',
                        default='localhost:3000',
                        nargs='?')
    parser.add_argument('--supertoken',
                         help='token part of URL for PARC Coach server',
                         default='ACTUAL_TOKEN_GOES_HERE',
                         nargs='?')
    parser.add_argument('--token',
                        help='token part of URL for PARC Coach server',
                        default='ACTUAL_TOKEN_GOES_HERE',
                        nargs='?')
    parser.add_argument('--prefix',
                        help='super token part of URL for PARC Coach server',
                        default='serviceapi',
                        nargs='?')
    parser.add_argument('--newuser',
                        help='email address to add tasks for',
                        default='example@parc.com',
                        nargs='?')
    parser.set_defaults(verbose=False)
    args = parser.parse_args()

#################################################
# Support functions
#################################################
pp = pprint.PrettyPrinter(indent=4)
def pretty(json):
    """
    Format json for output
    """
    pp.pprint(json)

def readJson(filename):
    """
    read a JSON file and return a JSON object
    """
    with open(filename) as json_data:
        return json.load(json_data)


#################################################
# Set up for each HTTP request
#################################################
api_token = args.token
api_super_token = args.supertoken
api_host = args.host
api_prefix = args.prefix

#################################################
# Make HTTP GET request and return results
#################################################
def get_request( service, token):
    api_url = 'http://%s/%s/%s/%s' % (api_host, api_prefix, service, token)
    print '\nGET %s' % api_url
    return requests.get(api_url).json()

#################################################
# Make HTTP POST request and return results
#################################################
def post_request( service, json_data, token ):
    api_url = 'http://%s/%s/%s/%s' % (api_host, api_prefix, service, token)
    print '\nPOST %s' % api_url
    # convert str to bytes (ensure encoding is OK)
    #post_data = json_data.encode('utf-8')
    #print post_data
    # we should also say the JSON content type header
    headers = {}
    headers['Content-Type'] = 'application/json'
    # now do the request for a url
    return requests.post(api_url, data=json_data, headers=headers).json()

#################################################
# Make HTTP DELETE request and return results
#################################################
def delete_request( service, token):
    """
    Given a service route fragments (e.g., resetAllForTesting, see complete list at
    http://YOUR_HOSTNAME_HERE.meteorapp.com/serviceapi/help/ACTUAL_TOKEN_GOES_HERE), run the delete request
    """
    api_url = 'http://%s/%s/%s/%s' % (api_host, api_prefix, service, token)
    print '\nDELETE %s' % api_url
    return requests.delete(api_url).json()


#################################################
# DELETE Example: Clear database for testing
#################################################
answer = raw_input("This script will clear the database for testing. Do you want to proceed? [Y N]")
if answer != 'Y':
    print "Goodbye"
    sys.exit(0)
pretty (delete_request('resetAllForTesting', api_super_token))



#################################################
#POST Example: Add a Participant
#################################################raw_input("Press Enter to continue...")
print "POST Example: Add a Participant"
# Set up JSON data
preferences_dict = {
      'goalType': '',
      'goalSpecific': '',
      'dailyGoalText': '',
      'difficulty':'',
      'goalContent': '',
      'choice': '',
      'place': '',
      'person': '',
      'eventTime': '',
      'reminderPeriod': '',
      'reminderText': ''
}
settings_dict = {
      'name': '',
      'gender': '',
      'age': '',
      'location': '',
      'selfEfficacy': 'high',
      'implementationIntention': 'yes',
      'reminders': 'yes',
      'reminderDistribution': 'masked',
      'reminderCount': '7'
}
json_dict = {
    'emailAddress': args.newuser,
    'condition': 'I2-10',
    'settings': settings_dict,
    'preferences': preferences_dict
}
json_array = []  #Participants are added in an array of Participant records
json_array.append(json_dict)
# convert json_dict to formatted JSON string
json_data = json.dumps(json_array)
pretty (post_request('participants/add', json_data, api_token))

#################################################
# GET Example: Show all Participant records
#################################################
print "Show all Participant records"
all_participants = get_request('participants', api_token)
pretty (get_request('participants', api_token))


#################################################
# Add an activity for Participant after waiting
# for user to be registered and logged in
#################################################
print "Creating a task for a Participant. Please do the following now:"
print " Start a browser, navigate to " + api_host
print " Register as " + args.newuser
raw_input("When these steps are done, press Enter to continue...")
json_dict = {
	"emailAddress" : args.newuser,
	"title" : "Take an additional 5 minutes to have breakfast",
	"contentLink" : "I2_Eat_Slower",
	"scheduledDay" : 1,
	"schedule" : "relative"
}
# convert json_dict to formatted JSON string and send request
json_data = json.dumps(json_dict)
pretty (post_request('tasks/add', json_data, api_token))

