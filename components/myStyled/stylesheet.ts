import React from 'react'
import {StyleContext} from "./index";

const Rule = cssText => {
    if (cssText.substr(0, 1) === "@") {
        const match = cssText.match(/.*?\{(?<selectorText>.*)/);

        return {
            cssText,
            cssRules: match && match.groups.selectorText.slice(0, -1).split("}").map(rule => rule && Rule(rule + "}")).filter(rule => rule)
        }
    } else {
        const match = cssText.match(/(?<selectorText>.*?)\{/);

        const selectorText = match && match.groups.selectorText.trim();

        return {
            cssText,
            selectorText
        };
    }
};

const Stylesheet = () => {
    const rules = [];
    const hashes = [];

    const deleteRule = index => {
        rules.splice(index, 1);
    };

    const insertRule = (cssText, index) => {
        rules.splice(index || rules.length - 1, 0, Rule(cssText));
        return index || rules.length - 1;
    };

    const collectHash = hash => hashes.push(hash);

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

    const collectStyles = app => {
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
