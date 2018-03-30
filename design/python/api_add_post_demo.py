# -*- coding: utf-8 -*-
"""Example PARC Coach API calls in Python

This module demonstrates some ways to call the PARC Coach API

Command Line Help:
    python api_add_post_demo.py --help

Example:
    Running against PARC Coach Server hosted on localhost:
        $ python api_add_post_demo.py
    Running against PARC Coach Server hosted on Galaxy Dev Server:
        $ python api_add_post_demo.py --host ACTUAL_HOSTNAME_GOES_HERE.meteorapp.com

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
    parser.add_argument('--postinguser',
                        help='email address to add post from',
                        default='parccoach@parc.com',
                        nargs='?')
    parser.add_argument('--topic',
                        help='topic for post',
                        default='Breakfast Club',
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
    pretty(json_data)
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
answer = raw_input("Do you want to clear the database for testing. ? [Y N]")
if answer == 'Y':
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
        'emailAddress': args.postinguser,
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
# Add an post for Participant after waiting
# for user to be registered and logged in
#################################################
print "Creating a post for Team %s. Please do the following now:" % args.topic
print " Start a browser at %s, Log in as admin@parc.com at" % api_host
print " Navigate to Posts, and select team %s" % args.topic
print " Start another browser at %s, Log in as %s at" % (api_host, args.postinguser)
print " Navigate to Profile, and select a team %s" % args.topic
raw_input("When these steps are done, press Enter to continue...")
json_dict = {
	"emailAddress" : args.postinguser,
	"text" : "Take an additional 5 minutes to have breakfast",
	"topic" : args.topic
}
# convert json_dict to formatted JSON string and send request
json_data = json.dumps(json_dict)
pretty(json_data)
pretty (post_request('posts/add', json_data, api_token))


#################################################
# GET Example: Show all Posts
#################################################
print "Show all Post records"
all_participants = get_request('posts', api_token)
pretty (get_request('posts', api_token))