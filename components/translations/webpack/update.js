/**
 * Created by ogi on 27.05.16.
 */
function ReactIntlPlugin(options) {
    this.options = Object.assign({}, {
        filename: "./reactIntlMessages.json"
    }, options);
}

ReactIntlPlugin.prototype.apply = function (compiler) {

    const messages = {};
    const options = this.options;
    const messagesHash = {};

    compiler.hooks.compilation.tap("ReactIntlPlugin", function(compilation) {
        // console.log("The compiler is starting a new compilation...");

        compilation.hooks.normalModuleLoader.tap("ReactIntlPlugin", function (context, module) {
            // console.log("registering function: ", __dirname, "in loader context");
            context["metadataReactIntlPlugin"] = function (metadata) {
                // do something with metadata and module
                // if (metadata["react-intl"].messages && metadata["react-intl"].messages.length > 0) {
                //     console.log("module:", module.request, "collecting metadata:", metadata["react-intl"].messages);
                // }
                if (metadata["react-intl"].messages && metadata["react-intl"].messages.length > 0) {
                    messages[module.resource] = metadata["react-intl"].messages;
                    messages[module.resource].reduce((hash, message) => {
                        messagesHash[message.id] = message;
                    }, messagesHash);
                }
            };
        });
    });

    compiler.hooks.emit.tapAsync("ReactIntlPlugin", function (compilation, callback) {
        // console.log("emitting messages");

        // console.log(">>>", messagesHash);
        // check for duplicates and flatten
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

        callback();
    });
};

module.exports = ReactIntlPlugin;
module.exports.metadataContextFunctionName = "metadataReactIntlPlugin";
