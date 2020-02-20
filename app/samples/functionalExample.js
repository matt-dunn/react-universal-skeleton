const fs = require("fs");
const path = require("path");


const pipe = (...fns) => (...x) => fns.reduce((y, f) => Array.isArray(y) ? f(...y) : f(y), x);

const next = (...fns) => (...args) => fns.reduce((y, f) => y || f(...args), undefined);

const map = fn => (...i) => i.map(fn);




const getImports = (content) => {
    const matcher = RegExp("#import\\s[\"']?(?<file>.*?)[\"' ;\\n]","gi");
    const files = [];

    let match;

    while ((match = matcher.exec(content)) !== null) {
        files.push(match.groups.file);
    }

    return files;
};




const getRelative = (importFilename, importedFilename) => {
    return path.resolve(path.dirname(importFilename), importedFilename);
};

const getDefault = defaultPath => (importFilename, importedFilename) => {
    return path.join((defaultPath), importedFilename);
};

const getAlias = (alias, resolvedAlias) => (importFilename, importedFilename) => {
    const parts = importedFilename.split(/[\\/]/g);

    if (parts[0] === alias) {
        return parts.map((part, index) => index === 0 && part === alias ? resolvedAlias : part).join("/");
    }
};




const resolveExtension = extension => filename => {
    return filename && `${filename}.${extension}`;
};

const resolveIndex = filename => {
    return filename && path.join(filename, "index");
};

const resolvePackage = filename => {
    if (filename) {
        const packageFilename = path.join(filename, "package.json");

        if (fs.existsSync(packageFilename)) {
            const packageData = JSON.parse(fs.readFileSync(packageFilename).toString());
            // console.error("!!!",path.join(filename, packageData.main))
            return path.join(filename, packageData.main);
        }
    }
};

const fileExists = filename => {
    return (filename && fs.existsSync(filename) && fs.lstatSync(filename).isFile() && filename) || undefined;
};

const exists = filename => {
    return (filename && fs.existsSync(filename) && filename) || undefined;
};




const resolveExtensions = extensions => next(
    ...extensions.map(extension => pipe(
        resolveExtension(extension),
        fileExists
    ))
);


const getDefaults = defaults => next(
    ...defaults.map(path => pipe(
        getDefault(path),
        exists
    ))
);

const getAliases = aliases => next(
    ...Object.keys(aliases).map(alias => pipe(
        getAlias(alias, aliases[alias]),
    ))
);



const resolveModuleRelative = ({extensions}) => next(
    pipe(
        getRelative,
        fileExists
    ),
    pipe(
        getRelative,
        resolveExtensions(extensions),
        fileExists
    ),
    pipe(
        getRelative,
        resolvePackage,
        fileExists
    ),
    pipe(
        getRelative,
        resolveIndex,
        resolveExtensions(extensions),
        fileExists
    ),
);

const resolveModuleLibrary = ({extensions, defaults}) => next(
    pipe(
        getDefaults(defaults),
        fileExists
    ),
    pipe(
        getDefaults(defaults),
        resolveExtensions(extensions),
        fileExists
    ),
    pipe(
        getDefaults(defaults),
        resolvePackage,
        fileExists
    ),
    pipe(
        getDefaults(defaults),
        resolveIndex,
        resolveExtensions(extensions),
        fileExists
    ),
);

const resolveModuleAlias = ({extensions, alias}) => next(
    pipe(
        getAliases(alias),
        fileExists
    ),
    pipe(
        getAliases(alias),
        resolveExtensions(extensions),
        fileExists
    ),
    pipe(
        getAliases(alias),
        resolvePackage,
        fileExists
    ),
    pipe(
        getAliases(alias),
        resolveIndex,
        resolveExtensions(extensions),
        fileExists
    ),
);



const getResolvedImports = config => next(
    resolveModuleRelative(config),
    resolveModuleLibrary(config),
    resolveModuleAlias(config),
);



const getContent = filename => fs.readFileSync(filename).toString();





const config = {
    extensions: [
        "ts",
        "jsx",
        "tsx",
        "css",
        "sass",
        "js",
    ],
    alias: {
        "app": path.join(__dirname, "..", "..", "app"),
        "components": path.join(__dirname, "..", "..", "components")
    },
    "defaults": [
        path.join(__dirname, "..", "..", "node_modules"),
        "someother/path",
    ]
};





const moduleResolver = getResolvedImports(config);

const importFilename = path.resolve(__dirname, "..", "store.ts");


const res = pipe(
    getContent,
    getImports,
    map(filename => ({filename, resolved: moduleResolver(importFilename, filename)}))
);

console.error(res(importFilename));

