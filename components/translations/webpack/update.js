const path = require("path");

function ReactIntlPlugin(options) {
    this.options = Object.assign({}, {
        filename: "./reactIntlMessages.json"
    }, options);
}

const {getLangMessages, getManifest} = require("../utils");

const environment = process.env.NODE_ENV || "production";

ReactIntlPlugin.prototype.apply = function (compiler) {
    const {translationsPath, filename} = this.options;
    const entry = path.resolve(compiler.options.context, (Array.isArray(compiler.options.entry) && compiler.options.entry[0]) || compiler.options.entry);

    const manifest = getManifest(translationsPath);
    const languageFiles = Object.values(manifest.languages).map(({filename}) => filename);

    const sourceDefaultMessages = getLangMessages(translationsPath);

    const messages = {};
    const changedMessages = {};

    let prevChanged;

    compiler.hooks.compilation.tap("ReactIntlPlugin", function(compilation) {
        compilation.hooks.normalModuleLoader.tap("ReactIntlPlugin", function (context, module) {
            context["metadataReactIntlPlugin"] = function (metadata) {
                if (metadata["react-intl"].messages && metadata["react-intl"].messages.length > 0) {
                    messages[module.resource] = metadata["react-intl"].messages;

                    messages[module.resource].forEach(message => {
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

        compilation.hooks.finishModules.tap("ReactIntlPlugin", function(modules) {
            modules.forEach(mod => {
                if (mod.resource && languageFiles.filter(file => mod.resource.indexOf(file) !== -1).length > 0) {
                    // mod._source._value = `module.exports = {a:42}`;

                    console.log(">>>>", mod.resource);
                }

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

                        prevChanged = messages;
                    }
                }
            });
        });
    });

    compiler.hooks.emit.tapAsync("ReactIntlPlugin", function (compilation, callback) {
        const jsonMessages = [];
        const idIndex = {};
        Object.keys(messages).map(function (e) {
            messages[e].map(function (m) {
                if (!idIndex[m.id]) {
                    idIndex[m.id] = e;
                    jsonMessages.push(m);
                } else {
                    compilation.errors.push("ReactIntlPlugin -> duplicate id: '" + m.id + "'.Found in '" + idIndex[m.id] + "' and '" + e + "'.");
                }
            });
        });

        // order jsonString based on id (since files are under version control this makes changes easier visible)
        jsonMessages.sort(function (a, b){
            return ( a.id < b.id ) ? -1 : ( a.id > b.id ? 1 : 0 );
        });

        const jsonString = JSON.stringify(jsonMessages, undefined, 2);

        // // Insert this list into the Webpack build as a new file asset:
        compilation.assets[filename] = {
            source: function () {
                return jsonString;
            },
            size: function () {
                return jsonString.length;
            }
        };

        const filenameParts = path.parse(filename);
        const jsonChangedMessages = JSON.stringify(changedMessages);
        compilation.assets[`${filenameParts.name}_changed${filenameParts.ext}`] = {
            source: function () {
                return jsonChangedMessages;
            },
            size: function () {
                return jsonChangedMessages.length;
            }
        };

        callback();
    });
};

module.exports = ReactIntlPlugin;
module.exports.metadataContextFunctionName = "metadataReactIntlPlugin";
