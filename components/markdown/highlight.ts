import {highlightCode} from "components/highlighter";

export default (code: string, lang: string, callback?: (error: any | undefined, code: string) => void): string => {
    if (callback) {
        if (lang) {
            highlightCode(code, lang)
                .then(markup => {
                    callback(null, markup);
                });
        } else {
            callback(null, code);
        }
    }

    return code;
};
