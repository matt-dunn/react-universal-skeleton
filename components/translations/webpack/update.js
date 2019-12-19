const fs = require("fs");
const path = require("path");

function ReactIntlPlugin(options) {
    this.options = Object.assign({}, {
        filename: "./reactIntlMessages.json"
    }, options);
}

const getLangMessageFilename = (translationsPath, lang = "default") => path.join(translationsPath, `${lang}.json`);

// const getDefaultMessages = messagesPath => JSON.parse(fs.readFileSync(path.join(process.cwd(), messagesPath, "defaultMessages.json")).toString());

const getLangMessages = (translationsPath, lang = "default") => {
    const filename = getLangMessageFilename(translationsPath, lang);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || [];
};

const hashMessages = messages => messages.reduce((hash, message) => {
    hash[message.id] = message;
    return hash;
}, {});

const environment = process.env.NODE_ENV || "production";


ReactIntlPlugin.prototype.apply = function (compiler) {
    const messages = {};
    const options = this.options;

    const sourceDefaultMessages = getLangMessages(options.translationsPath);
    const sourceMessagesHash = hashMessages(sourceDefaultMessages);

    const changedMessages = {};
    let prevChanged;

    compiler.hooks.compilation.tap("ReactIntlPlugin", function(compilation) {
        compilation.hooks.normalModuleLoader.tap("ReactIntlPlugin", function (context, module) {
            context["metadataReactIntlPlugin"] = function (metadata) {
                if (metadata["react-intl"].messages && metadata["react-intl"].messages.length > 0) {
                    messages[module.resource] = metadata["react-intl"].messages;

                    messages[module.resource].forEach(message => {
                        // if (!sourceMessagesHash[message.id] || message.defaultMessage !== sourceMessagesHash[message.id].defaultMessage || (changedMessages[message.id] && changedMessages[message.id].defaultMessage !== message.defaultMessage)) {
                        if (sourceMessagesHash[message.id] && message.defaultMessage !== sourceMessagesHash[message.id].defaultMessage) {
                            if (changedMessages[message.id] === sourceMessagesHash[message.id].defaultMessage) {
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

        compilation.hooks.optimizeModules.tap("ReactIntlPlugin", function(modules) {
            modules.forEach(mod => {
                if (mod.resource && mod.resource.indexOf("App.js") !== -1) {
                    if (environment === "development") {
                        const messages = JSON.stringify(Object.values(changedMessages).reduce((messages, message) => {
                            messages[message.id] = message.defaultMessage;
                            return messages;
                        }, {}));

                        if (messages !== prevChanged) {
                            mod.addVariable(
                                "i18nChanged",
                                `
                                (function(){
                                    // ${Date.now()}
                                    if (typeof window !== "undefined") {
                                        window.I18N_CHANGED = ${messages}
                                    } else if (typeof process !== "undefined") {
                                        process.I18N_CHANGED = ${messages}
                                    }
                                })()
                                `
                            );

                            prevChanged = messages;
                        }
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
        // console.log("jsonString:",jsonString);

        // // Insert this list into the Webpack build as a new file asset:
        compilation.assets[options.filename] = {
            source: function () {
                return jsonString;
            },
            size: function () {
                return jsonString.length;
            }
        };

        const filenameParts = path.parse(options.filename);
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
