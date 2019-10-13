import React, {useContext} from 'react'
import {isFunction} from "lodash";

import {createHash} from "./hash";

export const StyleContext = React.createContext(undefined);

const createStylesheet = () => {
    if (typeof document !== 'undefined') {
        const myStyle = document.getElementById("myStyled");

        if (myStyle) {
            return myStyle.sheet
        }

        const style = document.createElement("style");
        style.setAttribute("id", "myStyled");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        document.head.appendChild(style);

        return style.sheet;
    }
};

const getStyleIndex = (sheet, className) => {
    const rules = sheet.rules || sheet.cssRules;

    for (let i = 0; i < rules.length; i++) {
        if (rules[i].selectorText === className) {
            return i;
        }
    }

    return -1;
};

const parsedRule = (strings, args, props) => strings.reduce((rule, part, index) => {
    rule.push(part);

    const arg = args[index];
    const value = arg && isFunction(arg) ? arg(props) : arg;
    value && rule.push(value);

    return rule;
}, []).join("").replace(/\n/g, "");

const sheet = createStylesheet();

const myStyled = Component => (strings, ...args) => {
    let prevClassName;

    const updateRule = (props, serverSheet) => {
        if (prevClassName && args.length === 0) {
            return prevClassName;
        }

        const rule = parsedRule(strings, args, props);

        // const className = `${Component.displayName || Component.name || Component.type || Component}__${createHash(rule)}`;
        const className = `ms__${createHash(rule)}`;

        if (serverSheet) {
            const index = getStyleIndex(serverSheet, `.${className}`);
            index !== -1 && serverSheet.deleteRule(index);

            serverSheet.insertRule(
                `.${className} {${rule}}`
            );

            console.log("INSERT", className, rule, serverSheet.rules.length);

            return className;
        } else if (sheet) {
            if (className === prevClassName) {
                return prevClassName;
            }

            const oldIndex = getStyleIndex(sheet, `.${prevClassName || className}`);
            if (oldIndex !== -1 && !prevClassName) {
                return prevClassName = className
            }
            oldIndex !== -1 && sheet.deleteRule(oldIndex);

            sheet.insertRule(
                `.${className} {${rule}}`,
                oldIndex === -1 ? 0 : oldIndex
            );

            console.log("UPDATE", oldIndex, className, rule, sheet.rules.length);

            prevClassName = className;

            return className;
        }

        return "";
    };

    return ({children, ...props}) => React.createElement(Component, {...props, className: updateRule(props, useContext(StyleContext))}, children);
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
