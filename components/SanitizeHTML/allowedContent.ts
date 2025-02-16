/**!
 *
 * All rights reserved. Copyright (c) Needle Search Ltd 2016
 *
 * @author Matt Dunn
 *
 */

/**
 * @module Rendition
 */

import sanitize, {IOptions} from "sanitize-html";

export const DEFAULT_ALLOWED_CONTENT: IOptions = {
    allowedTags: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "a",
        "em",
        "i",
        "strong",
        "b",
        "p",
        "div",
        "span",
        "article",
        "aside",
        "details",
        "figcaption",
        "figure",
        "footer",
        "header",
        "main",
        "mark",
        "nav",
        "section",
        "summary",
        "time",
        "ul",
        "ol",
        "li",
        "dl",
        "dd",
        "dt",
        "img",
        "style",
        "pre",
        "code",
        "table",
        "thead",
        "tbody",
        "tfoot",
        "tr",
        "th",
        "td",
        "cite",
        "abbr",
        "address",
        "del",
        "ins",
        "legend",
        "q",
        "blockquote",
        "sub",
        "sup",
        "svg",
        "var",
        "wbr",
        "hr",
        "input",
        "label"
    ],
    allowedSchemes: [
        "data",
        "http",
        "https"
    ],
    allowedAttributes: {
        "*": [
            "class",
            "style",
            "id"
        ],
        "a": [
            "title",
            "href"
        ],
        "img": [
            "src",
            "title",
            "alt",
            "onError"
        ],
        "style": [
            "type"
        ],
        "input": [
            "checked",
            "disabled",
            "type",
            "name",
            "id"
        ],
        "label": [
            "for"
        ],
        "th": [
            "align"
        ],
        "td": [
            "align"
        ]
    },
    transformTags: {
        img: sanitize.simpleTransform("img", {onError: "this.remove()"})
    }
};
