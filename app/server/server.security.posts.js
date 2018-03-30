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

/*************************************************************************
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
