export default (code: string, lang: string, callback?: (error: any | undefined, code: string) => void): string => {
    if (callback) {
        if (lang) {
            import("components/highlighter")
                .then(module => {
                    ((module as any).default || module).highlightCode(code, lang)
                        .then((markup: string) => {
                            callback(null, markup);
                        });
                });
        } else {
            callback(null, code);
        }
    }

    return code;
};
