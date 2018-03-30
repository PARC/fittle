# Possible Deprecations

There is some older parts of the code that could use some attention.

## Study data

app/lib/api/studies is probably no longer needed. Along with app/private/studyConfigurations.json, and
app/server/studyConfiguration.js./

All this should probably be moved into settings.json (and all the app/shell/*.txt settings file templates used to
generate the currently active settings.json file).


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