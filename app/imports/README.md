# Fittle Testing Helpers

This folder provides the Meteor Test software helper code

## Repository Structure

|File |Purpose  |
|----|:----|
|`test-helpers.js` |Definitions used in test harnesses.|
|`lib` |Client helper code|
|`react` |React User Interface implementation that replaced the older Meteor Blaze UI|
|`styles` |Cascading Style Sheets (CSS) used in Client interface|
|`log.js` |Helper code for event logging|


## Implementation Notes

* When we migrated to Meteor 1.6 the test implementation used below broke and we did not migrate these tests as they
were no longer immediately necessary for the final Fittle deployments.
** You can try uncommenting the test dependencies (app/.meteor/packages) and run the following to see the breakage:
```
meteor test --driver-package practicalmeteor:mocha --port 3100 --settings settings.json
```


## Now deprecated test infrastructure

```
#----------------------
# Package for testing
#----------------------
#practicalmeteor:mocha       # Test runner
#practicalmeteor:faker       # Generates fake contextual data
#xolvio:cleaner              # Gives you methods to clear your Mongo database and collections for testing purposes
#dburles:factory             # Factories for Meteor
#practicalmeteor:chai
#practicalmeteor:sinon       # Standalone test spies, stubs and mocks for JavaScript.

```


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