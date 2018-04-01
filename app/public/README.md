# Fittle Web Content

Content used in showing Fittle health and behavior change information to users via the Meteor Client interface.

NOTE: Regarding management of content for Fittle studies, see also doc/Content_README.md

## Repository Structure

|Folder |Purpose  |
|----|:----|
|`analytics-images/` | Images used in Analytics Client views.|
|`content/` | HTML and Images used in Fittle 'Card' (i.e., descriptions of Fittle Challenge activities that instruct Study Participants in what they need to do for the study.|
|`jquery-mobile/` | Javascript package used in selected content pages describing exercises. In particular, the 'accordion' interface of collapsible div elements has been used in various studies. |
|`navigation-icons/` | Images used in Client App navigation between views/pages in the App (e.g., Activity reporting, social chat, analytics, etc). |
|`reporting-images/` | Images used in Client App reporting interface (i.e., used to report yes or no to a Participant doing a scheduled activity of a Study. |
|`social-media-icons/` | Images used in social chat views of the Client App. |
|`test_files/` |JSON files used in early testing of Task scheduling, now deprecated. |
|`utility_javascript/` | Javascript helper functions used during early development, now deprecated. |


## Implementation Notes

* Card content in app/public/content needs to be linked up to the App data structures via JSON files in app/private/content

* For example:

 * the JSON files, app/private/content/prechallenge/activitySchedulePreChallengeSet.json and
app/private/content/prechallenge/activitySchedulePreChallenge.json, specifies which days the activity
in app/private/content/prechallenge/activitiesPreChallenge.json should be scheduled;

 * and this last file defines the links to the Fittle content:
```
 "content": "content/prechallenge/prechallenge.html"
```

 * and these in turn are initially defined in the Meteor settings file, app/settings.json;

 * and the settings.json file is in turn properly set via running a script prior to deployment such as app/shell/setForSilverLocal.sh.


```
*************************************************************************
*
*  © [2018] PARC Inc., A Xerox Company
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Xerox Corporation.
* The intellectual and technical concepts contained
* herein are proprietary to PARC Inc. and Xerox Corp.,
* and may be covered by U.S. and Foreign Patents,
* patents in process, and may be protected by copyright law.
* This file is subject to the terms and conditions defined in
* file 'LICENSE.md', which is part of this source code package.
*
**************************************************************************/
```