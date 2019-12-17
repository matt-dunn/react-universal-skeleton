// const fs = require("fs");

// module.exports = class MyExampleWebpackPlugin {
//     // Define `apply` as its prototype method which is supplied with compiler as its argument
//     apply(compiler) {
//         // Specify the event hook to attach to
//         compiler.hooks.emit.tapAsync(
//             'MyExampleWebpackPlugin',
//             (compilation, callback) => {
//                 console.log('This is an example plugin!');
//                 console.log('Here’s the `compilation` object which represents a single build of assets:', compilation.chunks.length);
//                 // console.log("@@@", JSON.stringify(compilation.chunks[0]))
//
//                 // fs.writeFileSync(__dirname + "/xx.json", JSON.stringify(compilation))
//
//                 compilation.chunks.map(chunk => {
//                     console.log("@@@@@@@@@CHUNK", chunk.name)
//                     // if (JSON.stringify(chunk).indexOf("Complex") !== -1) {
//                     //     console.log(">>>", JSON.stringify(chunk))
//                     chunk.getModules().forEach(module => {
//                         console.log("@@@@@@@@@MODULE", module.id)
//                         module.buildInfo && module.buildInfo.fileDependencies && module.buildInfo.fileDependencies.forEach(filepath => {
//                             // we've learned a lot about the source structure now...
//                             if (filepath.indexOf("app/") !== -1)
//                             console.log(">>>", filepath)
//                         });
//                     });
//
//                     // }
//                 })
//
//                 // Manipulate the build using the plugin API provided by webpack
//                 // compilation.addModule(/* ... */);
//
//                 // console.log(oops)
//                 callback();
//             }
//         );
//     }
// }

/**
 * Notes rapides
 * Eviter d'utiliser les chemins relatifs. Préférer les arobases avec un resolve dans la conf (webpack.base.conf)
 *    ou opter pour les identifiants de modules
 */
const path = require("path");
const fs = require("fs");
const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");

/**
 * really really simple file sanitizer
 * @param {string} file
 * @return {string}
 */
function sanitize(file) {
    return file.replace(/[/\\]/g, "_");
}


module.exports = class {
    constructor(opts = {}) {
        this.modules = opts.modules || [];
        this.tmpEntriesPath = opts.tmpEntriesPath || path.join(process.cwd(), "./webpack-i18n-entries");
        this.jsonpChunksCallback = opts.jsonpChunksCallback || "webpackI18NChunks";
        this.jsonpManifestCallback = opts.jsonpManifestCallback || "webpackI18NManifest";
        if (!fs.existsSync(this.tmpEntriesPath)) { fs.mkdirSync(this.tmpEntriesPath); }
    }
    makeTmpSourcesFiles(i18nChunks) {
        for (const [fileName, chunksList] of Object.entries(i18nChunks)) {
            // Generating modules here

            // TODO: generic i18nLib after ?
            let moduleContent = `${this.jsonpChunksCallback}.add('${chunksList.langId}'`;
            for (const chunkPath of chunksList) { moduleContent += `, require('${chunkPath}')`; }
            moduleContent += ")";

            fs.writeFileSync(path.join(this.tmpEntriesPath, `${sanitize(fileName)}.js`), moduleContent);
        }
    }
    startChildCompilation(compilation, filename) {
        return new Promise((done, failed) => {
            const outputOptions = {
                filename,
                publicPath: compilation.outputOptions.publicPath,
            };
            const childCompiler = compilation.createChildCompiler(`i18n-compiler${sanitize(filename)}`, outputOptions);
            childCompiler.context = compilation.compiler.context;
            childCompiler.apply(
                new SingleEntryPlugin(
                    compilation.compiler.context,
                    path.join(this.tmpEntriesPath, sanitize(filename)),
                ),
                // new LoaderTargetPlugin('web')
            );

            childCompiler.runAsChild((err, entries, childCompilation) => {
                // console.log('ChildCompilerDone', entries[0] ? entries[0].files : 'NO FILE ?!!!');
                if (err) { return failed(err, entries, childCompilation); }
                done(entries, childCompilation);
            });
        });
    }
    apply(compiler) {
        // console.log('start plugin');
        const { modules } = this;
        /* compiler.plugin('emit', function(compilation, callback){
         console.log('context', this.context);
         callback();
         });*/
        compiler.plugin("emit", (compilation, callback) => {
            // console.log('emit');

            // Getting output directory. We didn't keep the first ./
            const outputDirname
                = `${path.dirname(compilation.outputOptions.chunkFilename)}/`
                .replace(/^\.?\//, "");


            /** Parcours des components chargés et génération d'un squelette de résultat
             *
             * Il devrait ressembler à:
             * {
             *   "chunkId-fr-fr": {
             *     "path/to/i18n/fr-fr.ext": true
             *   }
             * }
             *
             */
            const i18nChunks = {};
            const { chunkFilename } = compilation.outputOptions;
            for (const chunk of compilation.chunks) {
                const chunkId = chunkFilename
                    .replace(/\.js$/i, "")
                    .replace(/\[id]/g, chunk.id)
                    .replace(/\[chunkhash]/g, chunk.renderedHash)
                ;

                // let i18nChunksFiles = [];
                for (const normalModule of chunk.getModules()) {
                    for (const { rule, languagesFiles } of modules) {
                        if (rule.test(normalModule.portableId) || true) {
                            // On ajoute les fichiers de langue au chunk donné:

                            // Parcour des langues pour les ajouter:
                            for (const [langId, langPath] of Object.entries(languagesFiles)) {
                                const chunkI18NIdentifier = chunk.entryModule ? `${outputDirname + (chunk.name || "entry")}-${langId}` : `${chunkId}-${langId}`;

                                if (typeof i18nChunks[chunkI18NIdentifier] === "undefined") {
                                    const arr = [];
                                    arr.chunkId = chunkId;
                                    arr.langId = langId;
                                    i18nChunks[chunkI18NIdentifier] = arr;
                                }
                                /* eslint no-bitwise: ["error", { "allow": ["~"] }] */
                                if (!~i18nChunks[chunkI18NIdentifier].indexOf(langPath)) { i18nChunks[chunkI18NIdentifier].push(langPath); }
                            }
                        }
                    }
                }
            }
            this.makeTmpSourcesFiles(i18nChunks);
            Promise.all(
                Object
                    .keys(i18nChunks)
                    .map(filename => this.startChildCompilation(compilation, `${filename}.js`)),
            )
                .then((entries) => {
                    const manifest = {
                        path: outputDirname,
                        filesList: entries
                            .reduce((acc, arr) => acc.concat(arr), [])
                            .map(chunk => chunk.files)
                            .reduce((acc, arr) => acc.concat(arr), []),
                    };

                    // TODO: Par la suite, ajouter tout autre info importantes dans ce manifest
                    const source = `${this.jsonpManifestCallback}(${JSON.stringify(manifest)});`;
                    const { assets } = compilation;
                    assets["webpack-i18n-manifest.js"] = {
                        source() {
                            return source;
                        },
                        size() {
                            return source.length;
                        },
                    };
                    callback();
                });
        });
    }
};
