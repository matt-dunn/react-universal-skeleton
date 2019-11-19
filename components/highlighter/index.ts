import he from "he";
import {Prism, language, PrismJS} from "./prismjs";

type Options = {
    maxLength?: number;
    truncated?: boolean;
    raw?: boolean;
}

const wrap = (code: string, lang: string, options: Options): Element => {
    const textLength = code.length;
    const maxLength = (options && options.maxLength) || textLength;
    const lastLinebreakIndex = (options && options.maxLength) && code.lastIndexOf("\n", maxLength) || 0;

    const markup = he.encode(code.substr(0, lastLinebreakIndex > 0 ? lastLinebreakIndex : maxLength));

    const element = document.createElement("div");
    element.innerHTML = `<div><pre class="highlighter"><code${lang && ` class="language-${lang}"` || ""}>${markup}</code></pre>${((textLength > maxLength && (options.truncated || "\n…")) || "")}</div>`;
    return element;
};

const toString = (element: Element, options: Options): string => {
    if (options && options.raw) {
        const codeElement = element.querySelector("code");
        return (codeElement && codeElement.innerHTML) || "";
    } else {
        return element.innerHTML;
    }
};

const highlightCodeBlock = (Prism: PrismJS, code: string, lang: string, options: Options): string => {
    const element = wrap(code, lang, options);

    const codeElement = element.querySelector("code");
    codeElement && Prism.highlightElement(codeElement);

    return toString(element, options);
};

const highlightCode = (code: string, lang: string, options: Options = {}): Promise<string> => {
    if (!(window as any).Prism) {
        (window as any).Prism = {manual: true};
    }

    return language.loadLang(lang)
        .then((highlightLang) => highlightCodeBlock(Prism, code, highlightLang, options));
};

export {highlightCode};
