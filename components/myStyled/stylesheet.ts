import React from "react";

export type CSSRule = {
    cssText: string;
    selectorText: string;
}

export type OtherRule = {
    cssText: string;
    cssRules?: CSSRule[];
}

export type AnyRule = CSSRule | OtherRule;
export type AnyRules = AnyRule[];

export interface StylesheetPartial<T> {
    rules: T;
    deleteRule: (index: number) => void;
    insertRule: (cssText: string, index?: number) => number;
}

export interface ClientServerStylesheet<T> {
    hashes: string[];
    collectHash: (hash: string) => number;
    sheet: StylesheetPartial<T>;
}

export const StyleContext = React.createContext<ClientServerStylesheet<AnyRules> | undefined>(undefined);

const AnyRule = (cssText: string): AnyRule => {
    if (cssText.substr(0, 1) === "@") {
        const match = cssText.match(/.*?\{(?<selectorText>.*)/);

        return {
            cssText,
            cssRules: match && match.groups && match.groups.selectorText.slice(0, -1).split("}").map(rule => rule && AnyRule(rule + "}")).filter(rule => rule)
        } as OtherRule;
    } else {
        const match = cssText.match(/(?<selectorText>.*?)\{/);

        const selectorText = match && match.groups && match.groups.selectorText.trim();

        return {
            cssText,
            selectorText
        } as CSSRule;
    }
};

const StylesheetPartial = (): StylesheetPartial<AnyRules> => {
    const rules: AnyRules = [];

    const deleteRule = (index: number) => {
        rules.splice(index, 1);
    };

    const insertRule = (cssText: string, index?: number) => {
        rules.splice(index || rules.length - 1, 0, AnyRule(cssText));
        return index || rules.length - 1;
    };

    return {
        rules,
        deleteRule,
        insertRule,
    };
};

export const ServerStylesheet = (): ClientServerStylesheet<AnyRules> => {
    const hashes: string[] = [];

    const collectHash = (hash: string) => hashes.push(hash);

    return {
        sheet: StylesheetPartial(),
        hashes,
        collectHash
    };
};

const ClientStylesheet = (sheet: StylesheetPartial<CSSRuleList>, hashes: string[] = []): ClientServerStylesheet<CSSRuleList> => {
    const collectHash = (hash: string) => hashes.push(hash);

    return {
        sheet,
        hashes,
        collectHash
    };
};

export const createStylesheet = (): ClientServerStylesheet<CSSRuleList> | undefined => {
    if (typeof document !== "undefined") {
        const myStyles = document.querySelectorAll<HTMLStyleElement>("style[data-my-styled]");

        if (myStyles.length > 0) {
            let hashes: string[] = [];

            myStyles.forEach(style => {
                if (!style.parentElement || style.parentElement.tagName.toUpperCase() !== "HEAD") {
                    document.getElementsByTagName("head")[0].appendChild(style);
                }
                const styleHashes = style.getAttribute("data-my-styled");
                styleHashes && (hashes = hashes.concat(styleHashes.split(" ")));
            });

            const sheet = myStyles[myStyles.length - 1].sheet;

            if (sheet) {
                return ClientStylesheet(
                    // TODO: fix unknown - cast...
                    sheet as unknown as CSSStyleSheet,
                    hashes
                );
            }
        }

        const style = document.createElement("style");
        style.setAttribute("data-my-styled", "");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        document.head.appendChild(style);

        return ClientStylesheet(
            // TODO: fix unknown - cast...
            style.sheet as unknown as CSSStyleSheet
        );
    }
};
