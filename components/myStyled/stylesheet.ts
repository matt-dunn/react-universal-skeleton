import React, {ComponentType} from 'react'

export type CSSRule = {
    cssText: string;
    cssRules: CSSRule[];
}

export type ParentRule = {
    cssText: string;
    selectorText: string;
}

export type Rules = (CSSRule | ParentRule)[];

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

export const StyleContext = React.createContext<ClientServerStylesheet<Rules> | undefined>(undefined);

const Rule = (cssText: string): CSSRule | ParentRule => {
    if (cssText.substr(0, 1) === "@") {
        const match = cssText.match(/.*?\{(?<selectorText>.*)/);

        return {
            cssText,
            cssRules: match && match.groups && match.groups.selectorText.slice(0, -1).split("}").map(rule => rule && Rule(rule + "}")).filter(rule => rule)
        } as CSSRule
    } else {
        const match = cssText.match(/(?<selectorText>.*?)\{/);

        const selectorText = match && match.groups && match.groups.selectorText.trim();

        return {
            cssText,
            selectorText
        } as ParentRule;
    }
};

const StylesheetPartial = (): StylesheetPartial<Rules> => {
    const rules: Rules = [];

    const deleteRule = (index: number) => {
        rules.splice(index, 1);
    };

    const insertRule = (cssText: string, index?: number) => {
        rules.splice(index || rules.length - 1, 0, Rule(cssText));
        return index || rules.length - 1;
    };

    return {
        rules,
        deleteRule,
        insertRule,
    };
};

const ServerStylesheet = (): ClientServerStylesheet<Rules> => {
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
    if (typeof document !== 'undefined') {
        const myStyle = document.querySelector<HTMLStyleElement>("style[data-my-styled]");

        if (myStyle) {
            const hashes = myStyle.getAttribute("data-my-styled");

            if (myStyle.sheet) {
                return ClientStylesheet(
                    // TODO: fix unknown - cast...
                    myStyle.sheet as unknown as CSSStyleSheet,
                    (hashes && hashes.split(" ")) || undefined
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

export default () => {
    const stylesheet = ServerStylesheet();

    const collectStyles = (app: ComponentType) => React.createElement(
        StyleContext.Provider,
        {value: stylesheet},
        app
    );

    const getStyles = () =>
        (stylesheet.sheet.rules.length > 0 && `<style data-my-styled="${stylesheet.hashes.join(" ")}" data-ssr="true">${stylesheet.sheet.rules.map(rule => rule.cssText).join("")}</style>`) || "";

    return {
        collectStyles,
        rules: stylesheet.sheet.rules,
        getStyles
    };
}
