
# Logging Mechanism
The logging mechanism provides a means to log events on the client into the Meteor system using Meteor calls.

## Logging Methods
These entry points are used to create log entries.  Import log.js to use.

  import {Log} from '/client/log';

Then call one of the functions:

    logDebug,
    logAction,
    logEvent,
    logWarning,
    logError,
    logFatal


## Method Description

    Log.logFatal(fatalMsg)    - log a 'fatal' event with message fatalMsg
    Log.logError(errorMsg)    - log a 'error' event with message errorMsg
    Log.logWarning(warningMsg)- log a 'warning' event with message warningMsg
    Log.logEvent(eventMsg)    - log a 'event' event with message eventMsg   (these are application type events)
    Log.logAction(actionMsg)  - log a 'action' event with message actionMsg (these are user action type events)
    Log.logDebug(logMsg)      - log a 'debug event with message logMsg      (debug messages)
    
## Log Event Constants

These are used with the logEvent type logs, to distinguish different application events

    const LOGEVENT_APP_START = 'appStart';
    const LOGEVENT_APP_RESUME = 'appResume';
    const LOGEVENT_APP_PAUSE = 'appPause';

i.e.:   Log.logEvent(Log.LOGEVENT_APP_START);

## Optional (to be implemented)

  The above log methods have an optional string argument, if when present, will be added to the log entry as the data field in the schema.

## Log Schema

  timestamp:  <timestamp> (GMT ms timestamp)
  userId:     <string>,   (userId of logged in user, 'unknown' if not logged in)
  deviceId:   <string>,   (deviceId of originating device)
  logType:    <string>,   (type of event: 'debug', 'action', 'event', 'warning', 'error', 'fatal')
  message:    <string>,   (message string of the log type)
  logData:    <string>    (optional string of extra data)
  
## Log Levels

Each log type has an associated level.  The set log level indicates which logs will be placed in the log.  
So for a log level of 4, any log type which has a value higher than 4 would be ignored.  The levels are:

    6 logDebug,
    5 logAction,
    4 logEvent,
    3 logWarning,
    2 logError,
    1 logFatal

To set the level, use Log.setLogLevel(level)



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