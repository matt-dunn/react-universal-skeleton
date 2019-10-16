import React, {ComponentType} from 'react'
import {StyleContext} from "./index";

export type CSSRule = {
    cssText: string;
    cssRules: CSSRule[];
}

export type ParentRule = {
    cssText: string;
    selectorText: string;
}

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

export interface Stylesheet {
    rules: (CSSRule | ParentRule)[];
    hashes: string[];
    deleteRule: (index: number) => void;
    insertRule: (cssText: string, index?: number) => number;
    collectHash: (hash: string) => number;
}

const Stylesheet = (): Stylesheet => {
    const rules: (CSSRule | ParentRule)[] = [];
    const hashes: string[] = [];

    const deleteRule = (index: number) => {
        rules.splice(index, 1);
    };

    const insertRule = (cssText: string, index?: number) => {
        rules.splice(index || rules.length - 1, 0, Rule(cssText));
        return index || rules.length - 1;
    };

    const collectHash = (hash: string) => hashes.push(hash);

    return {
        rules,
        hashes,
        deleteRule,
        insertRule,
        collectHash
    };
};

export default () => {
    const stylesheet = Stylesheet();

    const collectStyles = (app: ComponentType) => {
        return React.createElement(
            StyleContext.Provider,
            {value: stylesheet},
            app
        );
    };

    const getStyles = () => {
        return (stylesheet.rules.length > 0 && `<style data-my-styled="${stylesheet.hashes.join(" ")}" data-ssr="true">${stylesheet.rules.map(rule => rule.cssText).join("")}</style>`) || "";
    };

    return {
        collectStyles,
        rules: stylesheet.rules,
        getStyles
    };
}
