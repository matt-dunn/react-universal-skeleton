import React from 'react'
import {isFunction} from "lodash";

const createStylesheet = () => {
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

const createHash = s => s.split("").reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0);return a & a},0);

const parsedRule = (strings, args, props) => strings.reduce((rule, part, index) => {
    rule.push(part);

    const arg = args[index];
    const value = arg && isFunction(arg) ? arg(props) : arg;
    value && rule.push(value);

    return rule;
}, []).join("");

const sheet = createStylesheet();

const myStyled = Component => (strings, ...args) => {
    let prevClassName;
    let prevHash;

    const updateRule = props => {
        const rule = parsedRule(strings, args, props);
        const hash = createHash(rule);

        if (hash === prevHash) {
            return prevClassName;
        }

        let oldIndex = getStyleIndex(sheet, `.${prevClassName}`);
        oldIndex !== -1 && sheet.deleteRule(oldIndex);

        const className = `${Component.displayName || Component.name || Component.type || Component}__${hash}`;

        sheet.insertRule(
            `.${className} {${rule}}`,
            oldIndex === -1 ? 0 : oldIndex
        );

        console.log("UPDATE", className, rule);

        prevClassName = className;
        prevHash = hash;

        return className;
    };

    return ({children, ...props}) => React.createElement(Component, {...props, className: updateRule(props)}, children);
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
