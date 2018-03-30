# -*- coding: utf-8 -*-
"""api_demo.py  Example PARC Coach API calls in Python

This module demonstrates some ways to call the PARC Coach API

Command Line Help:
    python api_demo.py --help

Example:
    Running against PARC Coach Server hosted on localhost:
        $ python api_demo.py
    Running against PARC Coach Server hosted on Galaxy Dev Server:
        $ python api_demo.py --host YOUR_HOSTNAME_HERE.meteorapp.com

Todo:
    * There is very little error protection and processing in the API currently

"""
import json
import requests  #Requires running sudo pip install requests
import pprint
import argparse

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
# GET Example: Get help
#################################################
raw_input("Press Enter to continue...")
print "GET Example: Get help"
pretty (get_request('help', api_token))

#################################################
# DELETE Example: Clear database for testing
#################################################
raw_input("Press Enter to continue...")
print "DELETE Example: Clear database for testing"
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
      'name': 'Les',
      'gender': 'robot',
      'age': '105',
      'location': 'Here',
      'selfEfficacy': 'high',
      'implementationIntention': 'yes',
      'reminders': 'yes',
      'reminderDistribution': 'masked',
      'reminderCount': '7'
}
json_dict = {
    'emailAddress': 'lnelson.test1@parc.com',
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
raw_input("Press Enter to continue...")
print "GET Example: Show all Participant records"
all_participants = get_request('participants', api_token)
pretty (get_request('participants', api_token))

#################################################
# GET Example: Show first Participant returned
#################################################
if (len(all_participants['results'])):
    print "GET Example: Show first Participant returned: %s" % all_participants['results'][0]['emailAddress']
    first_id = all_participants['results'][0]['_id']
    pretty (get_request('participants/%s'%first_id, api_token))

#################################################
# JSON File Example: Load schedulemessages JSON file
#################################################
def loadJsonSpec(route,filename):
    """
    Given a PARC Coach loading route (participants/add, scheduledmessages/add), run the route
    using the JSON in the indicated file
    """
    print "JSON File Example: Load schedulemessages JSON file"
    json_data = readJson(filename)
    pretty (post_request(route, json.dumps(json_data), api_token))

raw_input("Press Enter to continue...")
loadJsonSpec('participants/add','/Users/lnelson/meteor_home/positivedayI2/data/json/onboardingI2.json')
loadJsonSpec('scheduledmessages/add','/Users/lnelson/meteor_home/positivedayI2/data/json/I2QuestionsGoalTypeSelect.json')
loadJsonSpec('scheduledmessages/add','/Users/lnelson/meteor_home/positivedayI2/data/json/I2QuestionsI2Select.json')
loadJsonSpec('scheduledmessages/add','/Users/lnelson/meteor_home/positivedayI2/data/json/I2QuestionsSpecificGoalSelect.json')
