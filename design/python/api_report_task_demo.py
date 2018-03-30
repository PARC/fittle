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
# GET all Task records
#################################################
print "Show all Task records"
all_tasks = get_request('tasks', api_token)
pretty (all_tasks)
# Find first reported task
reported = None
for task in all_tasks['results']:
    tid = task['_id']
    results = get_request('tasks/%s'%tid, api_token)['results']
    # Check for reported result
    if results and results['emailAddress'] == args.newuser and 'goalMet' in results:
        reported = results

#################################################
# GET all Question records
#################################################
def print_questions():
    print "Show all Question records"
    all_qs = get_request('questions', api_token)
    pretty (all_qs)
    for q in all_qs['results']:
        qid = q['_id']
        results = get_request('questions/%s'%qid, api_token)['results']
        pretty(q)


#################################################
# Ask a question if reported
#################################################
if reported is None:
    print "No report yet, try again later"
else:
    print "Reporting"
    print pretty(reported)
    print 'Asking a question:'
    json_dict = {
      "sequences": [
        {
          "name": "goalTypeSelect",
          "constraints": [
           {
            "attribute": "preferences.goalType",
            "value": ""
           }
          ],
          "askDate": "-1",
          "askTime": "07:00",
          "expireDate": "28",
          "expireTime": "23:59",
          "sequenceBase": 10,
          "questions": [
            {
              "tag": "goalType",
              "text": "Was that fun?",
              "responseFormat": "list-choose-one",
              "choices": {
                "yes": "Yes",
                "no": "No",
              },
              "preferenceToSet": ""
            }
          ]
        }
      ]
    }
    json_data = json.dumps(json_dict)
    pretty (post_request('scheduledmessages/add', json_data, api_token))
    # Now wait for the answer
    print "Go back to your browser and answer the question if it appears (it is should be there)"
    raw_input("Press Enter to continue...")
    # Show the answer
    print_questions()

