const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const hp = require("handpipe");

const metadata = require("../../app/webpack/metadata");

const {target, targetRelativeClient, targetRelativeServer} = metadata();

const ROOT = process.cwd();

const packageJSON = require(path.join(ROOT, "package.json"));

const outputFilename = path.join(target, `${packageJSON.name}.${packageJSON.version}.tar.gz`);

const output = fs.createWriteStream(outputFilename);

const archive = archiver("tar", {
    gzip: true
});

output.on("close", () => {
    console.log(chalk`📦 Package archive created {yellow '${outputFilename}'} (${archive.pointer()} total bytes)`);
});

archive.on("error", err => {
    throw err;
});

archive.pipe(output);

archive.directory(path.join(ROOT, targetRelativeClient), targetRelativeClient);
archive.directory(path.join(ROOT, targetRelativeServer), targetRelativeServer);

archive.file(path.join(ROOT, "package.json"), { name: "package.json" });
archive.file(path.join(ROOT, "yarn.lock"), { name: "yarn.lock" });

const compiler = hp({
    package: packageJSON
});

archive.append(fs.createReadStream(path.join(__dirname, "package.README.md")).pipe(compiler), { name: "README.md" });

archive.finalize();
