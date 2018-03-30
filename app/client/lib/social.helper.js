/**
 * Created by krivacic on 12/11/17.
 */
import React, { Component } from 'react';

export const SocialHelpers = {
    fixTextCr,
};

/**
 * fixTextCr
 * return an object which replaces the line feeds in it with html breaks.
 * ALSO, emojify the text
 *
 *  */

export function fixTextCr(txt) {
    if (txt) {
        let lines = [];
        let inx = 0;
        _.each(txt.split('\n'), (l) => {
            if (inx !== 0) {lines.push( <br key={'b_'+inx} />)};
            lines.push(<span key={'k_'+inx++}>{Emojis.parse(l)}</span>);
        });
        return lines;
    }
    return '';
}

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
