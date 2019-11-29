const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const ROOT = process.cwd();

const package = require(path.resolve(ROOT, "package.json"));

const outputFilename = path.resolve(ROOT, "dist", `dist.${package.version}.tar.gz`);

const output = fs.createWriteStream(outputFilename);
const archive = archiver("tar", {
    gzip: true
});

output.on("close", function () {
    console.log(`Package archive created '${outputFilename}'. ${archive.pointer()} total bytes`);
});

archive.on("error", function(err){
    throw err;
});

archive.pipe(output);

archive.directory(path.resolve(ROOT, "dist", "client"), "dist/client");
archive.directory(path.resolve(ROOT, "dist", "server"), "dist/server");

archive.file(path.resolve(ROOT, "package.json"), { name: "package.json" });
archive.file(path.resolve(ROOT, "yarn.lock"), { name: "yarn.lock" });
archive.file(path.resolve(__dirname, "package.README.md"), { name: "README.md" });

archive.finalize();
