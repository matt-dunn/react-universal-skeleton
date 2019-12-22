const path = require("path");

const {translations} = require("../index");

function ReactIntlPlugin(options) {
    this.options = Object.assign({}, {
        filename: "./reactIntlMessages.json"
    }, options);
}

/*

TODO

* Update default lang as per langs
* Handle no langs - should output defaultMessage in code

 */

const {getLangMessages, getManifest, getLanguages, transformHash} = require("../utils");

const environment = process.env.NODE_ENV || "production";

ReactIntlPlugin.prototype.apply = function(compiler) {
    const {translationsPath, messagesPath, reportsPath, filename, version, failOnIncompleteTranslations} = this.options;
    const entry = path.resolve(compiler.options.context, (Array.isArray(compiler.options.entry) && compiler.options.entry[0]) || compiler.options.entry);

    const manifest = getManifest(translationsPath);
    const languageFiles = Object.values(manifest.languages).map(({filename}) => filename);

    const sourceDefaultMessages = getLangMessages(translationsPath);

    const messages = {};
    const defaultMessages = {};
    const changedMessages = {};

    let prevChanged;

    const languages = getLanguages(translationsPath);

    const manageTranslations = translations({
        messagesPath,
        translationsPath,
        languages,
        version,
        reportsPath
    }).manage({
        emmit: false
    });

    let translationsSealed;
    let translationsDone;

    compiler.hooks.done.tap("ReactIntlPlugin", () => {
        translationsDone.printSummary();

        if (reportsPath) {
            translationsDone
                .saveReport()
                .generateTranslations();
        }
    });

    compiler.hooks.afterCompile.tap("ReactIntlPlugin", () => {
        translationsSealed = manageTranslations.seal({defaultMessages});
    });

    compiler.hooks.afterEmit.tap("ReactIntlPlugin", compilation => {
        translationsDone = translationsSealed.done();

        if (failOnIncompleteTranslations && !translationsDone.isComplete()) {
            const summary = translationsDone.getSummary();
            compilation.errors.push(new Error(`There ${summary.totalUntranslatedCount} are outstanding translations. See '${translationsDone.getReportPath()}'`));
        }
    });

    compiler.hooks.compilation.tap("ReactIntlPlugin", compilation => {
        compilation.hooks.normalModuleLoader.tap("ReactIntlPlugin", (context, module) => {
            context["metadataReactIntlPlugin"] = metadata => {
                if (metadata["react-intl"].messages && metadata["react-intl"].messages.length > 0) {
                    messages[module.resource] = metadata["react-intl"].messages;

                    messages[module.resource].forEach(message => {
                        defaultMessages[message.id] = message;

                        if (sourceDefaultMessages[message.id] && message.defaultMessage !== sourceDefaultMessages[message.id].defaultMessage) {
                            if (changedMessages[message.id] === sourceDefaultMessages[message.id].defaultMessage) {
                                delete changedMessages[message.id];
                            } else {
                                changedMessages[message.id] = message;
                            }
                        } else if (changedMessages[message.id]) {
                            delete changedMessages[message.id];
                        }
                    });
                }
            };
        });

        compilation.hooks.finishModules.tap("ReactIntlPlugin", modules => {
            modules.forEach(mod => {
                if (mod.resource && languageFiles.filter(file => mod.resource.indexOf(file) !== -1).length > 0) {
                    const lang = path.parse(mod.resource).name;

                    const messages = translationsSealed.processLanguage(lang);

                    mod._source._value = `module.exports = ${JSON.stringify(transformHash(messages))}`;
                }
                // TODO: else if default lang update default lang module with messages var

                if (environment === "development" && mod.resource && mod.resource.indexOf(entry) !== -1) {
                    const messages = Object.values(changedMessages).reduce((messages, message) => {
                        messages[message.id] = message.defaultMessage;
                        return messages;
                    }, {});

                    const jsonMessages = JSON.stringify(messages);

                    if (jsonMessages !== prevChanged) {
                        console.log(`Setting changed i18n messages: ${Object.keys(messages).length}`);

                        mod.addVariable(
                            "i18nChanged",
                            `
                            (function(){
                                // ${Date.now()}
                                if (typeof window !== "undefined") {
                                    window.I18N_CHANGED = ${jsonMessages}
                                } else if (typeof process !== "undefined") {
                                    process.I18N_CHANGED = ${jsonMessages}
                                }
                            })()
                            `
                        );

                        prevChanged = jsonMessages;
                    }
                }
            });
        });
    });

    compiler.hooks.emit.tapAsync("ReactIntlPlugin", (compilation, callback) => {
        const jsonMessages = [];
        const idIndex = {};
        Object.keys(messages).map(e => {
            messages[e].map(m => {
                if (!idIndex[m.id]) {
                    idIndex[m.id] = e;
                    jsonMessages.push(m);
                } else {
                    compilation.errors.push("ReactIntlPlugin -> duplicate id: '" + m.id + "'.Found in '" + idIndex[m.id] + "' and '" + e + "'.");
                }
            });
        });

        // order jsonString based on id (since files are under version control this makes changes easier visible)
        jsonMessages.sort((a, b) => ( a.id < b.id ) ? -1 : ( a.id > b.id ? 1 : 0 ));

        const jsonString = JSON.stringify(jsonMessages, undefined, 2);

        // // Insert this list into the Webpack build as a new file asset:
        compilation.assets[filename] = {
            source: () => jsonString,
            size: () => jsonString.length
        };

        const filenameParts = path.parse(filename);
        const jsonChangedMessages = JSON.stringify(changedMessages);
        compilation.assets[`${filenameParts.name}_changed${filenameParts.ext}`] = {
            source: () => jsonChangedMessages,
            size: () => jsonChangedMessages.length
        };

        callback();
    });
};

module.exports = ReactIntlPlugin;
module.exports.metadataContextFunctionName = "metadataReactIntlPlugin";
