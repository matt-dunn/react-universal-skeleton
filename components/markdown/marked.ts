import marked, {MarkedOptions} from "marked";
import isPromise from "is-promise";

type AdditionOptions = {
    highlightRaw?: boolean;
}

type MarkedAsync = {
    (src: Promise<string> | string, options?: MarkedOptions & AdditionOptions): Promise<string>;
};

const escape = (html: string, encode: boolean) => {
    return html
        .replace(encode ? /&/g : /&(?!#?\w+;)/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

// Override for adding classes to task list item
marked.Renderer.prototype.listitem = function(this: any, text) {
    const isTask = text.indexOf("checkbox") !== -1;
    return `<li${isTask && ' class="task-list-item"' || ""}>${text}</li>\n`;
};

// Override to allow code blocks to be output raw (without wrapping <pre><code/></pre>) when deferred to highlighter
marked.Renderer.prototype.code = function(code, lang, escaped) {
    const options: MarkedOptions & AdditionOptions = this.options as MarkedOptions & AdditionOptions;

    if (options.highlight) {
        const out = options.highlight(code, lang || "");
        if (out != null && out !== code) {
            escaped = true;
            code = out;
        }
    }

    if (!lang) {
        return "<pre><code>"
            + (escaped ? code : escape(code, true))
            + "\n</code></pre>";
    }

    if (options.highlightRaw) {
        return (escaped ? code : escape(code, true));
    }

    return '<pre><code class="'
        + options.langPrefix
        + escape(lang, true)
        + '">'
        + (escaped ? code : escape(code, true))
        + "\n</code></pre>\n";
};

type Module = {
    default?: string;
}

function isModule(arg: any): arg is Module {
    return Boolean(arg.default);
}

const getContentValue = (content: string | Module): string => {
    return (isModule(content) ? content.default : content) || "";
};

const asyncMarked: MarkedAsync = (content, options) => {
    return new Promise((resolve, reject) => {
        ((isPromise(content) ? content : Promise.resolve(content)) as Promise<Module | string>).then(resolvedContent => {
            marked(getContentValue(resolvedContent), options,(error, content) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(content);
                }
            });
        });
    });
};

export default asyncMarked as MarkedAsync;
