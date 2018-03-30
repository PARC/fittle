# Protected Health Information Requirements
This document describes what we will need to do for securing Protected Health Information (PHI) in the parccoach App (client, server, and coach agents). This includes both data "at rest" in the client, server, and any coach agents, as well as "in motion" between any of the components.

## PHI Items

* Email Addresses

## Requirements

* In general do not store PHI in Meteor clients (e.g., emailAddress in Meteor.users().profile  [Client should not store PHI of anyone other than the logged in user, and that only as absolutely needed]

* It is OK to pass PHI during the login/registration process as long as the client-server connection is secure (i.e., https).

* All data passed between any app related services should use https, and included a sufficiently complex security token (e.g., uuid)

* We do not currently plan to persistently store PHI on the client, but if we did, we would need some way of encrypting the client persistent data.

* Is deployment to Amazon HIPAA complieat?  Reference: https://aws.amazon.com/compliance/hipaa-compliance/




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