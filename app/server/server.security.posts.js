/**
 * Created by lnelson on 10/12/16.
 */
import {Posts} from '/lib/api/posts/posts';

Posts.allow({
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