Saving this here so will not have to go looking for it elsewhere... LN

## Coaching Interventions

A Domain Expert may influence the Coaching provided by the Fittle App by working through _coachin use cases_ with a Coach Designer. This involves a conversation that may be started using the following
information. We assume here that there is a coaching need for addressing the case of a user who has not reported on a daily activity in 3 days.

```
{
    "interventionName": "Unresponsive Participant",
    "uses": [
        {
	    "name": "whenLastGoalMet",
	    "kind": "value",
	    "description": "Value for the date and time of the last time a Participant reported on an activity"
	},
        {
	    "name": "now",
	    "kind": "value",
	    "description": "Value for the date and time now"
	},
        {
	    "name": "lastGoalMetDateAndTime",
	    "kind": "function",
	    "description": "Calculate the difference in days between two times"
	},
        {
	    "name": "engage",
	    "kind": "message",
	    "source": "https://en.wikipedia.org/wiki/Motivational_interviewing",
	    "description": "Involve the participant in talking about issues, concerns and hopes, and to establish a trusting relationship with the coach"
	},
        {
	    "name": "focus",
	    "kind": "message",
	    "source": "https://en.wikipedia.org/wiki/Motivational_interviewing",
	    "description": "Narrow the conversation to habits or patterns that participants want to change"
	},
        {
	    "name": "evoke",
	    "kind": "message",
	    "source": "https://en.wikipedia.org/wiki/Motivational_interviewing",
	    "description": "Elicit participant motivation for change by increasing participants' sense of the importance of change, their confidence about change, and their readiness to change."
	},
        {
	    "name": "plan",
	    "kind": "message",
	    "source": "https://en.wikipedia.org/wiki/Motivational_interviewing",
	    "description": "Develop the practical steps clients want to use to implement the changes they desire."
	}
    ],
    "condition": "differenceInDays(lastGoalMetDateAndTime,nowDateAndTime) >= 3",
    "condition": "differenceInDays(lastGoalMetDateAndTime,nowDateAndTime) <  5",
    "action": [
        {
	    "kind": "engage",
	    "text": "We haven't heard from you in several days. We hope you are doing."
	    "responseFormat": "list-choose-one",
	    "choices": { "OK"},
	    "preferenceToSet": "amOk"

	},
        {
	    "kind": "plan",
	    "text": "Can we set a reminder for you to check in with us tomorrow?"
	    "responseFormat": "list-choose-one",
	    "choices": { "Yes", "No"},
	},
        {
	    "kind": "plan",
	    "constraints": [
                {
                    "attribute": "preferences.setReminder",
                    "value": "No"
                }
            ],
	    "text": "OK, we hope to hear from you tomorrow."
	    "responseFormat": "list-choose-one",
	    "choices": { "OK"},
	},
        {
	    "kind": "plan",
	    "constraints": [
                {
                    "attribute": "preferences.setReminder",
                    "value": "Yes"
                }
            ],
	    "text": "OK, a reminder has been set."
	    "responseFormat": "list-choose-one",
	    "choices": { "OK"},
	}
    ]
}
```
