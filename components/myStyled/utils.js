import {isFunction} from "lodash";

export const createStylesheet = () => {
    if (typeof document !== 'undefined') {
        const myStyle = document.querySelector("style[data-my-styled]");

        if (myStyle) {
            return {
                sheet: myStyle.sheet,
                hashes: myStyle.getAttribute("data-my-styled").split(" ")
            };
        }

        const style = document.createElement("style");
        style.setAttribute("data-my-styled", "");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        document.head.appendChild(style);

        return {
            sheet: style.sheet
        };
    }
};

export const parsedRule = (strings, args, props) => strings.reduce((rule, part, index) => {
    rule.push(part);

    const arg = args[index];
    const value = arg && isFunction(arg) ? arg(props) : arg;
    value && rule.push(value);

    return rule;
}, []).join("");
