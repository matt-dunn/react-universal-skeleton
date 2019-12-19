const fs = require("fs");
const path = require("path");

function ReactIntlPlugin(options) {
    this.options = Object.assign({}, {
        filename: "./reactIntlMessages.json"
    }, options);
}

const getLangMessageFilename = (translationsPath, lang = "default") => path.join(translationsPath, `${lang}.json`);

const getDefaultMessages = messagesPath => JSON.parse(fs.readFileSync(path.join(process.cwd(), messagesPath, "defaultMessages.json")).toString());

const getLangMessages = (translationsPath, lang = "default") => {
    const filename = getLangMessageFilename(translationsPath, lang);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || [];
};

const hashMessages = messages => messages.reduce((hash, message) => {
    hash[message.id] = message;
    return hash;
}, {});

const VirtualModulesPlugin = require('webpack-virtual-modules');

const Dependency = require('webpack/lib/Dependency');

class MyDependency extends Dependency {
    // Use the constructor to save any information you need for later
    constructor(module) {
        super();
        this.module = module;
        // console.log(">>>>>>>", module.length, module.size(), module.id)
        this.userRequest = {
            length: module.size()
        }
    }
}

MyDependency.Template = class MyDependencyTemplate {
    apply(dep, source) {
        // dep is the MyDependency instance, so the module is dep.module
        source.insert(0, 'console.log("Hello, plugin world!");');
    }
};

ReactIntlPlugin.prototype.apply = function (compiler) {

    // console.log("£££££££££",compiler.options.plugins)
    const messages = {};
    const options = this.options;


    const virtualModules = new VirtualModulesPlugin();
    virtualModules.apply(compiler);

    const sourceDefaultMessages = getLangMessages(options.translationsPath);
    let sourceMessagesHash = hashMessages(sourceDefaultMessages);

    let changedMessages = {x: 123};

    compiler.hooks.compilation.tap("ReactIntlPlugin", function(compilation) {
        console.log("COMPILATION@@@")

        // compilation.dependencyTemplates.set(
        //     MyDependency,
        //     new MyDependency.Template()
        // );
        // compilation.hooks.buildModule.tap('ReactIntlPlugin', module => {
        //     console.log("@@@@@@",changedMessages)
        //     module.addDependency(new MyDependency(module));
        // });


        compilation.hooks.normalModuleLoader.tap("ReactIntlPlugin", function (context, module) {
            context["metadataReactIntlPlugin"] = function (metadata) {
                if (metadata["react-intl"].messages && metadata["react-intl"].messages.length > 0) {
                    messages[module.resource] = metadata["react-intl"].messages;

                    messages[module.resource].forEach(message => {
                        if (!sourceMessagesHash[message.id] || message.defaultMessage !== sourceMessagesHash[message.id].defaultMessage) {
                            // console.log("@@@@",module)
                            changedMessages[message.id] = message;
                            // console.log(">>>CHANGE", message, module.resource)
                        } else if (changedMessages[message.id]) {
                            delete changedMessages[message.id];
                        }
                    });
                }
                // if (Object.keys(changedMessages).length > 0) {
                //     console.log("&&&&&&&&&&&&", changedMessages)
                // }
                // virtualModules.writeModule('node_modules/module-foobar.json', JSON.stringify(changedMessages));
            };
        });


        // virtualModules.writeModule("defaultMessages_changed.json", {a:23});
        // virtualModules.writeModule('node_modules/module-foobar.json', JSON.stringify({a: 43}));

        compilation.hooks.optimizeModules.tap("ReactIntlPlugin", function(modules) {
            console.log("!!!!!!!!!!!DONE*******", changedMessages)
            modules.forEach(mod => {
                if (mod.resource && mod.resource.indexOf('App.js') !== -1) {
                    console.log("!!!!MOD", mod.resource)
                    mod.addVariable(
                        "global",
                        `
                        (function(){
                            if (typeof window !== "undefined") {
                                window.CHANGED = ${JSON.stringify(changedMessages)}
                            }
                            console.log(${JSON.stringify(changedMessages)})
                        })()
                        `
                    )
                }
            });
            // const xx = JSON.stringify(changedMessages);
            // compilation.updateAsset(
            //     'node_modules/module-foobar.json',
            //     () => xx,
            //
            // )
            // virtualModules.writeModule('node_modules/module-foobar.json', JSON.stringify({a: 43}));
        })
        // virtualModules.writeModule('node_modules/module-foobar.json', JSON.stringify({a: 43}));
    });

    // compiler.waitForBuildingFinished

    // compiler.hooks.make.tapAsync("ReactIntlPlugin", (compilation, callback) => {
    //     console.log("&&&&MAKE", changedMessages)
    //     virtualModules.writeModule('node_modules/module-foobar.json', JSON.stringify({a: 43}));
    //     callback()
    // });


    compiler.hooks.emit.tapAsync("ReactIntlPlugin", function (compilation, callback) {
        // virtualModules.writeModule('node_modules/module-foobar.js', 'console.log("HELLO!!");');
        // console.log("EMIT@@@CHANGES", changedMessages)
        // virtualModules.writeModule('node_modules/module-foobar.js', 'console.log("HELLO!!");');

        // compilation.hooks.normalModuleLoader.tap("ReactIntlPlugin", function (context, module) {
        //     if (module.resource.indexOf("i18n") !== -1) {
        //         console.log("*******", module.resource, changedMessages)
        //     }
        // });

        // console.log(">>>ASSETS", compilation.files)

        // fs.writeFileSync(path.join(__dirname, "..", "..", "..", "xx.json"), JSON.stringify(compilation.modules))

        console.log("###‹", compilation.findModule("app/i18n/fr.json"))
        // console.log(compilation.assets)
        // console.log(xxx)
        // for (var basename in compilation.assets) {
        //     if (basename === "1.js") {
        //         console.log("*********", Object.keys(compilation.assets[basename]))
        //
        //         var asset = compilation.assets[basename];
        //         const xx = JSON.stringify({moose: "loose"});
        //         asset.source = () => xx;
        //         asset.size = () => xx.length;
        //     }
        // }

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
        console.log(">>>>",compilation.assets["defaultMessages_changed.json"])
        console.log("@@@@@ADDED ASSET", `${filenameParts.name}_changed${filenameParts.ext}`)
        compilation.assets[`${filenameParts.name}_changed${filenameParts.ext}`] = {
            source: function () {
                return jsonChangedMessages;
            },
            size: function () {
                return jsonChangedMessages.length;
            }
        };

        // console.log(xxxxx)

        // changedMessages = {};

        callback();
    });
};

module.exports = ReactIntlPlugin;
module.exports.metadataContextFunctionName = "metadataReactIntlPlugin";
