# Fittle Meteor Client

This folder provides the Meteor Client User Interface implemenation

## Repository Structure

|File |Purpose  |
|----|:----|
|`legacy` |Older Meteor syntax still needed with React UI implementation|
|`lib` |Client helper code|
|`react` |React User Interface implementation that replaced the older Meteor Blaze UI|
|`styles` |Cascading Style Sheets (CSS) used in Client interface|
|`log.js` |Helper code for event logging|


## Implementation Notes

* We replaced the older Meteor Blaze implementation with React

 * https://reactjs.org

 * https://www.meteor.com/tutorials/react/creating-an-app

* Both CSS and LESS (http://lesscss.org) syntax are used for styling. We primarily rely on LESS defintiions now.

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
