import Prism from "prismjs";
import components from "prismjs/components.json";

import DEFAULT_ALIAS, {ALIAS} from "./alias";

type Language = {
    alias?: string | string[];
    require?: string | string[];
    path?: string;
    noCSS?: boolean;
    examplesPath?: string;
    addCheckAll?: boolean;
    title?: string;
    option?: string;
    peerDependencies?: string | string[];
}

type Languages = {
    [key: string]: Language;
}

const languages: Languages = components.languages;

const ALIAS_LANGUAGE = Object.assign(
    Object.entries(languages)
        .reduce((aliases, [lang, def]) => {
            def.alias && (Array.isArray(def.alias) ? def.alias : [def.alias]).map(alias => aliases[alias] = lang);

            return aliases;
        }, {} as ALIAS),
    DEFAULT_ALIAS
);

const getLangDeps = (deps: string | string[] = ""): string[] => {
    let requires: string[] = [];

    (Array.isArray(deps) ? deps : [deps]).map(dep => {
        requires.unshift(dep);

        if (languages[dep].require) {
            requires = getLangDeps(languages[dep].require).concat(requires);
        }
    });

    return requires;
};

const loadLang = (lang: string): Promise<string> => {
    const highlightLang = ALIAS_LANGUAGE[lang] || lang;
    const language = languages[highlightLang];

    if (language && !Prism.languages[highlightLang]) {
        return getLangDeps(language.require || []).concat([highlightLang])
            .reduce((promise, dep) => {
                return promise.then(() => {
                    if (!Prism.languages[dep]) {
                        const lang = /* #__LOADABLE__ */ () => import("prismjs/components/prism-" + dep)
                        return (lang as any).requireAsync();
                    }
                });
            }, Promise.resolve())
            .then(() => highlightLang);
    }

    return Promise.resolve((language && highlightLang) || "");
};

export {loadLang};
