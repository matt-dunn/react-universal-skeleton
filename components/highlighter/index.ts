import {Prism, language} from "./prismjs";

import "./sass/_theme.scss";

const wrap = (code: string, lang: string): string => `<pre class="highlighter"><div${lang && ` class="language-${lang}"` || ""}>${code}</div></pre>`;

export const highlightCode = (code: string, lang: string): Promise<string> => language.loadLang(lang)
    .then((highlightLang) => wrap(Prism.highlight(code, Prism.languages[highlightLang], highlightLang), highlightLang));
