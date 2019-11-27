const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const ROOT = process.cwd();

const package = require(path.resolve(ROOT, "package.json"));

const outputZipFilename = path.resolve(ROOT, "dist", `dist.${package.version}.zip`);

const output = fs.createWriteStream(outputZipFilename);
const archive = archiver("zip");

output.on("close", function () {
    console.log(`Package archive created '${outputZipFilename}'. ${archive.pointer()} total bytes`);
});

archive.on("error", function(err){
    throw err;
});

archive.pipe(output);

archive.directory(path.resolve(ROOT, "dist"), "dist");

archive.file(path.resolve(ROOT, "package.json"), { name: "package.json" });
archive.file(path.resolve(ROOT, "yarn.lock"), { name: "yarn.lock" });
archive.file(path.resolve(__dirname, "package.README.md"), { name: "README.md" });

archive.finalize();
