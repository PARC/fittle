# PARC Coach Specification Files for Daily Ti[s

This describes documents how to generate daily tips.

NOTE: This scripting can be greatly improved, but is expedient for present purposes

## Repository Structure

|File |Purpose  |
|----|:----|
|`createTipSchedule.js` |Generator script|
|`*.json` |Generated JSON files|
|`README.md` |This file|


## HOW TO GENERATE

Run the program in Node:

```
node createTipSchedule.js
```

NOTE: The enclosing folder here is named '.json', whose leading '.' in the folder name tells Meteor to ignore this folder.


## HOW TO MODIFY

In createTipSchedule.js:
- Redefine the array tipTextByDay with new texts for whatever days needed. Skipping days is allowed.
- Edit the values in oneTipFormat as needed, but not the keys!!
- Edit variables constrainingAttribute and constrainingValue, or leave them blank for unconstrained messaged (i.e., goes to EVERYONE)

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