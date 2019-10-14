import React, {useContext} from 'react'
import PropTypes from "prop-types";
import Stylis from "stylis";

import {createHash} from "./hash";
import {createStylesheet, parsedRule, getFirstStyleIndex} from "./utils";

export const StyleContext = React.createContext(undefined);

const sheet = createStylesheet();

const updateSheetRule = (oldIndex, sheet, className, prevClassName, rule) => {
    if (oldIndex !== -1) {
        const rules = sheet.rules || sheet.cssRules;
        const prevSelectorName = `.${prevClassName}`;
        const prevSelectorNameLength = prevSelectorName.length;

        for (let i = oldIndex; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.selectorText && rule.selectorText.substr(0, prevSelectorNameLength) === prevSelectorName) {
                sheet.deleteRule(i);
                i--;
            } else if (rule.rules || rule.cssRules) {
                const subRules = rule.rules || rule.cssRules;
                for(let ii = 0; ii < subRules.length; ii++) {
                    if (subRules[ii].selectorText.substr(0, prevSelectorNameLength) === prevSelectorName) {
                        sheet.deleteRule(i);
                        i--;
                        break;
                    }
                }
            }
        }
    }

    const stylis = new Stylis({
        global: false
    });

    let index = oldIndex === -1 ? 0 : oldIndex;

    const DEBUG = [];

    // See https://github.com/thysultan/stylis.js#plugins for plugin details
    stylis.use((context, content, selectors, parent) => {
        // Remove and additional specificity...
        const normalizedSelector = `.${className}${selectors[0].toString().replace(new RegExp(`\.${className}`, "g"), "")}`;

        // Do not include any global styles... Should be handled... globally!
        if ((context === 2 || context === 3) && normalizedSelector !== parent[0] && selectors[0].toLocaleLowerCase().indexOf(":global") === -1) {
            sheet.insertRule(
                `${selectors} {${content}}`,
                index++
            );

            DEBUG.push(`${selectors} {\n    ${content}\n  }`);
        }
    });

    stylis(`.${className}`, rule);

    console.log(`${oldIndex === -1 ? "INSERT" : "UPDATE"}(${sheet.rules.length} rules)\n `,DEBUG.join('\n  '))

    return className;
};

const myStyled = Component => (strings, ...args) => {
    let prevClassName;

    const updateRule = (props, serverSheet) => {
        if (prevClassName && args.length === 0) {   // Static template
            return prevClassName;
        }

        const rule = parsedRule(strings, args, props);

        // const className = `${Component.displayName || Component.name || Component.type || Component}__${createHash(rule)}`;
        const className = `ms__${createHash(rule)}`;    // Use a fixed class prefix to simplify client/server class names

        if (serverSheet) {
            return updateSheetRule(getFirstStyleIndex(serverSheet, `.${className}`), serverSheet, className, className, rule);
        } else if (sheet) {
            if (className === prevClassName) {
                return prevClassName;
            }

            const oldIndex = getFirstStyleIndex(sheet, `.${prevClassName || className}`);
            if (oldIndex !== -1 && !prevClassName) {
                return prevClassName = className;
            }

            return prevClassName = updateSheetRule(oldIndex, sheet, className, prevClassName, rule);
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

import ServerStylesheet from "./stylesheet";

export {ServerStylesheet};
