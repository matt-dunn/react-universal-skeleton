import React, {ComponentType, ReactNode, useContext, useRef} from 'react'

import {createHash} from "./hash";
import {parseRule, generateClassName, updateSheetRule} from "./utils";
import {ClientServerStylesheet, createStylesheet, StyleContext, AnyRules} from "./stylesheet";

export interface MyStyledComponentProps {
    className?: string;
    children?: ReactNode | null;
}

export type MyStyledComponent<P extends MyStyledComponentProps> = ComponentType<P> | keyof JSX.IntrinsicElements;

export interface MyStyled<P, T> {
    (string: TemplateStringsArray, ...args: T[]): MyStyledComponent<P>;
}

type MyStyledTemplate<P> = {
    (props: P): string | false | number | undefined;
} | string | false | number | undefined;

function isComponent(arg: any): arg is ComponentType {
    return React.isValidElement(arg);
}

const stylesheet = createStylesheet();

const myStyled = <P>(Component: MyStyledComponent<P & MyStyledComponentProps>): MyStyled<P, MyStyledTemplate<P>> => (strings, ...args) => {
    const updateRule = (prevClassName: string | undefined, props: any, stylesheet?: ClientServerStylesheet<CSSRuleList | AnyRules>) => {
        if (stylesheet) {
            const rule = args.length === 0 && strings.join("") || parseRule(strings, args, props);
            const hash = createHash(rule);
            const className = generateClassName(Component, hash);

            if (className === prevClassName || (stylesheet.hashes && stylesheet.hashes.indexOf(hash) !== -1)) {
                return className;
            }

            stylesheet.collectHash(hash);

            return updateSheetRule(stylesheet.sheet, className, rule);
        }

        return "";
    };

    const MyStyled = ({children, ...props}: MyStyledComponentProps) => {
        const prevClassName = useRef<string | undefined>(undefined);
        const className = prevClassName.current = updateRule(prevClassName.current, props, useContext(StyleContext) || stylesheet);

        return React.createElement<any>(Component, {...props, className: [props.className, className].join(" ")}, children);
    };

    if (isComponent(Component)) {
        MyStyled.displayName = Component.displayName || Component.name;
    }

    return MyStyled;
};



// TODO: type this...!
// const domElements = [
//     'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr',
//
//     // SVG
//     'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'marker', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'
// ];
//
// domElements.forEach(element => {
//     myStyled[element] = myStyled(element);
// });

export default myStyled;

export { default as ServerStylesheet } from "./stylesheet";
