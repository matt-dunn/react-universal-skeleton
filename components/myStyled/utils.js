import {isFunction} from "lodash";
import Stylis from "stylis";

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

// Use a fixed class prefix to simplify client/server class names
// const generateClassName = (Component, hash) => `${Component.displayName || Component.name || Component.type || Component}__${hash}`;
export const generateClassName = (Component, hash) => `ms__${hash}`;

export const updateSheetRule = (sheet, className, prevClassName, rule) => {
    const DEBUG = [];

    const stylis = new Stylis({
        global: false
    });

    // See https://github.com/thysultan/stylis.js#plugins for plugin details
    stylis.use((context, content, selectors, parent) => {
        // Remove and additional specificity...
        const normalizedSelector = `.${className}${selectors[0].toString().replace(new RegExp(`\.${className}`, "g"), "")}`;

        // Do not include any global styles... Should be handled... globally!
        if ((context === 2 || context === 3) && normalizedSelector !== parent[0] && selectors[0].toLocaleLowerCase().indexOf(":global") === -1) {
            sheet.insertRule(
                `${selectors} {${content}}`,
            );

            DEBUG.push(`${selectors} {\n    ${content}\n  }`);
        }
    });

    stylis(`.${className}`, rule);

    console.log(`UPDATE(${sheet.rules.length} rules)\n `,DEBUG.join('\n  '))

    return className;
};
