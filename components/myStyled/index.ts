import React, {ComponentType, ReactNode, useContext} from 'react'

import {createHash} from "./hash";
import {createStylesheet, parseRule, generateClassName, updateSheetRule} from "./utils";
import {Stylesheet} from "./stylesheet";

export interface MyStyledComponentProps {
    className?: string;
    children?: ReactNode | null;
}

export type MyStyledComponent<P extends MyStyledComponentProps> = ComponentType<P> | string;

export interface MyStyled<P, T> {
    (string: TemplateStringsArray, ...args: T[]): ComponentType<P & MyStyledComponentProps>;
}

type MyStyledTemplate<P> = {
    (props: P): string | false | number | undefined;
} | string | number | undefined;

export const StyleContext = React.createContext<Stylesheet | undefined>(undefined);

const {sheet, hashes} = createStylesheet() || {};

function isComponent(arg: any): arg is ComponentType {
    return React.isValidElement(arg);
}

const myStyled = <P>(Component: MyStyledComponent<P & MyStyledComponentProps>): MyStyled<P, MyStyledTemplate<P>> => (strings, ...args) => {
    let prevClassName: string;

    const updateRule = (props: any, serverSheet?: Stylesheet) => {
        if (prevClassName && args.length === 0) {   // Static template
            return prevClassName;
        }

        const rule = parseRule(strings, args, props);
        const hash = createHash(rule);
        const className = generateClassName(Component, hash);

        if (serverSheet) {
            serverSheet.collectHash(hash);
            return updateSheetRule(serverSheet, className, rule);
        } else if (sheet) {
            if (className === prevClassName || (hashes && hashes.indexOf(hash) !== -1)) {
                return className;
            }

            return prevClassName = updateSheetRule(sheet, className, rule);
        }

        return "";
    };

    const MyStyled = ({children, ...props}: MyStyledComponentProps) => React.createElement<any>(Component, {...props, className: [props.className, updateRule(props, useContext(StyleContext))].join(" ")}, children);
    if (isComponent(Component)) {
        MyStyled.displayName = Component.displayName || Component.name;
    }
    return MyStyled;
};



const domElements = [
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr',

    // SVG
    'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'marker', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'
];

domElements.forEach(element => {
    myStyled[element] = myStyled(element);
});

export default myStyled;

export { default as ServerStylesheet } from "./stylesheet";
