import {Participants} from '../lib/api/participants/participants';
import {Questions} from '../lib/api/questions/questions';
import {Scheduledmessages} from '../lib/api/scheduledmessages/scheduledmessages';
import {Tasks} from '../lib/api/tasks/tasks';
// TODO: Make these access priveleges more constrained
/*
Messages.allow({
    'insert': function (userId, doc) {
        return true;
    }
});
Teams.allow({
    'insert': function (userId, doc) {
        return true;
    }
});
*/
Questions.allow({
    'insert': function (userId, doc) {
        /* user and doc checks ,
         return true to allow insert */
        return true;
    },
    'update': function (userId, doc) {
        /* user and doc checks ,
         return true to allow insert */
        return true;
    }
});


Participants.allow({
    'insert': function (userId, doc) {
        /* user and doc checks ,
         return true to allow insert */
        return true;
    },
    'update': function (userId, doc) {
        /* user and doc checks ,
         return true to allow insert */
        return true;
    }
});
Scheduledmessages.allow({
    'insert': function (userId, doc) {
        /* user and doc checks ,
         return true to allow insert */
        return true;
    },
    'update': function (userId, doc) {
        /* user and doc checks ,
         return true to allow insert */
        return true;
    }
});
Tasks.allow({
    'insert': function (userId, doc) {
        /* user and doc checks ,
         return true to allow insert */
        return true;
    },
    'update': function (userId, doc) {
        /* user and doc checks ,
         return true to allow insert */
        return true;
    }
});
