import Prism, {highlightElement} from "prismjs";
import * as language from "./language";

import "./sass/_theme.scss";

export type PrismJS = {
    highlightElement: typeof highlightElement;
}

Prism.languages.css.selector = {
    pattern: /[^{}\s][^{}]*(?=\s*\{)/,
    inside: {
        "pseudo-element": /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
        "pseudo-class": /:[-\w]+(?:\(.*\))?/,
        "class": /\.[-:.\w]+/,
        "id": /#[-:.\w]+/,
        "attribute": /\[[^\]]+\]/
    }
};

// Need to cast to any as the type definition incorrectly does not allow the last param to be optional
(Prism.languages.insertBefore as any)(
    "css",
    "function",
    {
        "hexcode": /#[\da-f]{3,8}/i,
        "rgb": /rgba?\(.*?\)/i,
        "color": /(transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)(?=[\s;,)])/i
    }
);

Prism.hooks.add("wrap", env => {
    if (env.type === "hexcode" || env.type === "color" || env.type === "rgb") {
        env.content = `<span><span style="margin-left:2px;background-color:${env.content};border-radius:1em;border:1px solid #f0f0f0;width:0.75em;height:0.75em;position:relative;top:0.125em;display:inline-block;margin-right:2px;"></span>${env.content}</span>`;
    }
});

const x: PrismJS = Prism;

export {x as Prism, language}
export * from "prismjs";
