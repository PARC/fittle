# S3 Hosting Service Notes

## Why an Amazon S3 service

Fittle uses an external S3 service to serve up some of its content.  This content includes the terms-and-conditions and privacy-policy web pages, and images exchanged via Fittle's social media channels.

While Fittle can still operated on a limited basis without them for testing purposes, it is advisable to connect to an S3 service to achieve full functionality.

## Get an external Amazon S3

An Amazon S3 service is used to host several services required by Fittle.  The system administrator should get an S3 file resource from amazon aws services.   Going to 'https://s3.console.aws.amazon.com' should redirect you to an amazon sign-in / sign-up page to acquire the service.

The amazon service is used to host the following:

 - The terms-and-conditions.html web page
 - The privacy-policy.html web page
 - Images sent via Fittle's social media channels
 
Once an account is acquired, you need to setup the Fittle directories.  Pick a directory name to represent your domain, like your-domain.fittle.your-study-name.   Inside the main directory, you need to create a 'docs' directory, which in it, has a subdirectory for your language (like 'en' for english).  

Inside the language specific directory is where you put the 'privacy-policy.html' and 'terms-of-use.html' files.  These files should be marked as public.

You should mark your top level directory for encryption, using the properties tab in the S3 service console.  This insures extra protection for the private data (the images sent via Fittle's social feed) being shared by Fittle users.

When images are sent via Fittle's social media feed, they are hosted on the S3 site.  Images are arranged by the team they are sent to, so for each team in the study, a new directory is created for the team.  These directories have an image and icon directory to hold the full images and icon images respectively.

## Setting up Fittle to point to the Amazon S3 Services

In order to use the S3 service, the Fittle server must know how to access the service, and have the proper permissions.  This is done through the settings.json source file at the top level of the application directory.

Under the "public" settings, the S3_FETCHURL indicates the top-level of your amazon directory.  This is used to find the privacy-policy & terms-of-use html files.  An example with the S3 top level directory of 'your-domain.your-name.rev' would be:

"S3_FETCHURL": "https://s3-us-west-1.amazonaws.com/your-domain.your-name.rev/",

Note that the example is using the us-west-1 amazon service.  The html files would be found by adding the 'docs/en' to the directory (when english is the language).

For the Fittle server to write to the S3 service, it must know the S3 identity, passwords, etc.  You get these access codes by going to your IAM console, choosing users, and creating a user to access your S3 services.  There you generate the access codes by clicking the programmatic access for access type.  You need these to add them to the private section of the settings.json file as show below:

"S3_ID": "your-user-id-goes here",  
"S3_SECRET":  "your-secret-goes-here",  
"S3_BUCKET": "your-top-level-bucket-name",  
"S3_BASEURL": "https://s3-us-west-1.amazonaws.com/your-top-level-bucket-name/",

Once you have the S3 service running and the settings.json pointing to it, you should be up and running, hosting the terms & privacy web pages along with the social media images.

## What happens if you don't setup an S3 service

Basic Fittle services will still operate if you do not setup an S3 service.  If the S3 services are missing, you will get errors when you try and get to the terms-of-service and privacy-policies sites.   Also, errors will occur if someone attempts to use images with the social media feeds. 

Other than that, the rest of Fittle will continue to operate without any problems.


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

