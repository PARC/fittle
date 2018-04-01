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
