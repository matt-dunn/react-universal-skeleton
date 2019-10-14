import {isFunction} from "lodash";

export const createStylesheet = () => {
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

export const getFirstStyleIndex = (sheet, selectorText) => {
    const rules = sheet.rules || sheet.cssRules;
    const selectorTextLength = selectorText.length;

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.selectorText && rule.selectorText.substr(0, selectorTextLength) === selectorText) {
            return i;
        } else if (rule.rules || rule.cssRules) {
            const subRules = rule.rules || rule.cssRules;
            for(let ii = 0; ii < subRules.length; ii++) {
                if (subRules[ii].selectorText.substr(0, selectorTextLength) === selectorText) {
                    return i;
                }
            }
        }
    }

    return -1;
};

export const parsedRule = (strings, args, props) => strings.reduce((rule, part, index) => {
    rule.push(part);

    const arg = args[index];
    const value = arg && isFunction(arg) ? arg(props) : arg;
    value && rule.push(value);

    return rule;
}, []).join("");
