import React from 'react'
import {StyleContext} from "./index";

const Rule = cssText => {
    const match = cssText.match(/(?<selectorText>.*?)\{/);

    const selectorText = match && match.groups.selectorText.trim();

    return {
        cssText,
        selectorText
    };
};

const Stylesheet = () => {
    const rules = [];

    const deleteRule = index => {
        rules.splice(index, 1);
    };

    const insertRule = (cssText, index) => {
        rules.splice(index || rules.length - 1, 0, Rule(cssText));
        return index || rules.length - 1;
    };

    return {
        rules,
        deleteRule,
        insertRule
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
        return (stylesheet.rules.length > 0 && `<style id="myStyled">${stylesheet.rules.map(rule => rule.cssText).join("")}</style>`) || "";
    };

    return {
        collectStyles,
        rules: stylesheet.rules,
        getStyles
    };
}
