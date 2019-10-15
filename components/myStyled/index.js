import React, {useContext} from 'react'
import PropTypes from "prop-types";

import {createHash} from "./hash";
import {createStylesheet, parsedRule, generateClassName, updateSheetRule} from "./utils";

export const StyleContext = React.createContext(undefined);

const {sheet, hashes} = createStylesheet() || {};

const myStyled = Component => (strings, ...args) => {
    let prevClassName;

    const updateRule = (props, serverSheet) => {
        if (prevClassName && args.length === 0) {   // Static template
            return prevClassName;
        }

        const rule = parsedRule(strings, args, props);
        const hash = createHash(rule);
        const className = generateClassName(Component, hash);

        if (serverSheet) {
            serverSheet.collectHash(hash);
            return updateSheetRule(serverSheet, className, className, rule);
        } else if (sheet) {
            if (className === prevClassName || (hashes && hashes.indexOf(hash) !== -1)) {
                return className;
            }

            return prevClassName = updateSheetRule(sheet, className, prevClassName, rule);
        }

        return "";
    };

    const MyStyled = ({children, ...props}) => React.createElement(Component, {...props, className: [props.className, updateRule(props, useContext(StyleContext))].join(" ")}, children);
    MyStyled.displayName = Component.displayName || Component.name || Component.type || Component;
    MyStyled.propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        className: PropTypes.string
    };
    return MyStyled;
};

const domElements = [
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr',

    // SVG
    'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'marker', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'
];

domElements.forEach(element => {
    myStyled[element] = myStyled(element);
});

export default myStyled;

export { default as ServerStylesheet } from "./stylesheet";
