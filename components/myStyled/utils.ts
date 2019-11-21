import {isFunction} from "lodash";
import Stylis from "stylis";

import {MyStyledComponent} from "./index";
import {AnyRules, StylesheetPartial} from "./stylesheet";

export const parseRule = <T>(strings: TemplateStringsArray, args: T[], props: any): string => strings.reduce((rule: string[], part: string, index: number) => {
    rule.push(part);

    const arg = args[index];
    const value = arg && isFunction(arg) ? arg(props) : arg;
    value && rule.push(value);

    return rule;
}, []).join("");

// Use a fixed class prefix to simplify client/server class names
// const generateClassName = (Component, hash) => `${Component.displayName || Component.name || Component.type || Component}__${hash}`;
export const generateClassName = (Component: MyStyledComponent<any>, hash: string): string => `ms__${hash}`;

export const updateSheetRule = (sheet: StylesheetPartial<CSSRuleList | AnyRules>, className: string, rule: string) => {
    const DEBUG: string[] = [];

    const selectorText = `.${className}`;

    const stylis = new Stylis({
        global: false
    });

    // See https://github.com/thysultan/stylis.js#plugins for plugin details
    stylis.use((context, content, selectors, parent) => {
        const selector = selectors[0];
        if (selector) {
            // Remove any additional specificity...
            // TODO: a bit hacky... can likely be improved/made more robust. this is intended to ensure child blocks are not inserted without the parent wrapper (e.g. @media rules)
            const normalizedSelector = `${parent[0] || ""}${(parent[0] && selector.toString().replace(new RegExp(parent[0], "g"), "")) || ""}`;

            // Do not include any global styles... Should be handled... globally! 2 = selector block, 3 = @at-rule block
            if (((context === 2 && selector.startsWith(selectorText)) || context === 3) && normalizedSelector !== parent[0] && selector.toLowerCase().indexOf(":global") === -1) {
                // Add class postfix to localise animation name if required
                const currentSelector = `${selector}${(selector.toLowerCase().startsWith("@keyframes ") && `-${className}`) || ""}`;
                // Set the correct content if font-face
                const currentContent = (selector.toLowerCase().startsWith("@font-face") && content.substr(1, content.length - 2)) || content;

                sheet.insertRule(`${currentSelector} {${currentContent}}`);

                DEBUG.push(`${currentSelector} {\n    ${content}\n  }`);
            }
        }
    });

    stylis(selectorText, rule);

    console.log(`UPDATE(${sheet.rules.length} rules)\n `,DEBUG.join("\n  "));

    return className;
};
