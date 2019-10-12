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

function getStyleIndex(sheet, className) {
    const classes = sheet.rules || sheet.cssRules;

    for (let x = 0; x < classes.length; x++) {
        if (classes[x].selectorText === className) {
            return x;
        }
    }

    return -1;
}

const createHash = s => s.split("").reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0);return a & a},0)

const parsedRule = (strings, args, props) => strings.reduce((rule, part, index) => {
    rule.push(part);

    const arg = args[index];
    const value = isFunction(arg) ? arg(props) : arg;
    value && rule.push(value);

    return rule;
}, []).join("");

const sheet = createStylesheet();

export default Component => (strings, ...args) => {
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
}
