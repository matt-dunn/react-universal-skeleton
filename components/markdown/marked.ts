import marked, {MarkedOptions, Slugger} from "marked";
import isPromise from "is-promise";

type AdditionOptions = {
    highlightRaw?: boolean;
}

type Options = MarkedOptions & AdditionOptions;

type MarkedAsync = {
    (src: Promise<string> | string, options?: Options): Promise<string>;
};

const escape = (html: string, encode: boolean) => html
    .replace(encode ? /&/g : /&(?!#?\w+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Override for adding classes to task list item
marked.Renderer.prototype.listitem = function(this: any, text) {
    const isTask = text.indexOf("checkbox") !== -1;
    return `<li${isTask && ' class="task-list-item"' || ""}>${isTask ? `<label>${text}</label>` : text}</li>\n`;
};

// Patch for adding internal links headers
marked.Renderer.prototype.heading = function(this: any, text: string, level: 1 | 2 | 3 | 4 | 5 | 6, raw: string, slugger: Slugger): string {
    if (this.options.headerIds) {
        const id = `${this.options.headerPrefix}${slugger.slug(raw)}`;
        return `<h${level} id="${id}">${text} <a aria-hidden="true" class="header-link" href="#${id}">🔗</a></h${level}>\n`;
    }
    // ignore IDs
    return `<h${level}>${text}</h${level}>\n`;
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

const processAsync = (content: string, options?: Options) =>
    new Promise<string>((resolve, reject) => {
        marked(content, options, (error, content) => {
            if (error) {
                reject(error);
            } else {
                resolve(content);
            }
        });
    });

type Module = {
    default?: string;
}

function isModule(arg: any): arg is Module {
    return Boolean(arg.default);
}

const getContentValue = (content: string | Module) =>
    (isModule(content) ? content.default : content) || "";

const wrappedPromise = (content: Promise<string> | string) =>
    (isPromise(content) ? content : Promise.resolve(content)) as Promise<Module | string>;

const asyncMarked: MarkedAsync = async (content, options) =>
    processAsync(
        getContentValue(await wrappedPromise(content)),
        options
    );

export default asyncMarked;
