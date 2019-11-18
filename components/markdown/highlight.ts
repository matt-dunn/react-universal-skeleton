export default (code: string, lang: string, callback?: (error: any | undefined, code: string) => void): string => {
    if (callback) {
        if (lang) {
            // highlighter.highlightCode(code, lang)
            //     .then(markup => {
            //         callback(null, markup);
            //     });
            callback(null, code)
        } else {
            callback(null, code);
        }
    }

    return code;
};
