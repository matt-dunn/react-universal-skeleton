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

export const updateSheetRule = (sheet, className, rule) => {
    const DEBUG = [];

    const stylis = new Stylis({
        global: false
    });

    const selectorName = `.${className}`;

    // See https://github.com/thysultan/stylis.js#plugins for plugin details
    stylis.use((context, content, selectors, parent) => {
        const selector = selectors[0];
        if (selector) {
            // Remove any additional specificity...
            // TODO: a bit hacky... can likely be improved/made more robust. this is intended to ensure child blocks are not inserted without the parent wrapper (e.g. @media rules)
            const normalizedSelector = `${parent[0] || ""}${(parent[0] && selector.toString().replace(new RegExp(parent[0], "g"), "")) || ""}`;

            // Do not include any global styles... Should be handled... globally! 2 = selector block, 3 = @at-rule block
            if (((context === 2 && selector.startsWith(selectorName)) || context === 3) && normalizedSelector !== parent[0] && selector.toLowerCase().indexOf(":global") === -1) {
                const currentSelector = `${selector}${(selector.toLowerCase().startsWith("@keyframes ") && `-${className}`) || ""}`;

                sheet.insertRule(
                    `${currentSelector} {${content}}`,
                );

                DEBUG.push(`${currentSelector} {\n    ${content}\n  }`);
            }
        }
    });

    stylis(selectorName, rule);

    console.log(`UPDATE(${sheet.rules.length} rules)\n `,DEBUG.join('\n  '))

    return className;
};
