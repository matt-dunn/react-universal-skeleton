const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const hp = require("handpipe");

const ROOT = process.cwd();
const TARGET = process.env.TARGET || "dist";

if (!process.env.TARGET) {
    console.warn(chalk.yellow(`Using default target '${TARGET}'`));
}

const packageJSON = require(path.resolve(ROOT, "package.json"));

const outputFilename = path.resolve(ROOT, TARGET, `${packageJSON.name}.${packageJSON.version}.tar.gz`);

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

archive.directory(path.resolve(ROOT, TARGET, "client"), `${TARGET}/client`);
archive.directory(path.resolve(ROOT, TARGET, "server"), `${TARGET}/server`);

archive.file(path.resolve(ROOT, "package.json"), { name: "package.json" });
archive.file(path.resolve(ROOT, "yarn.lock"), { name: "yarn.lock" });

const compiler = hp({
    package: packageJSON
});

archive.append(fs.createReadStream(path.resolve(__dirname, "package.README.md")).pipe(compiler), { name: "README.md" });

archive.finalize();
