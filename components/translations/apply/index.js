const path = require("path");
const fs = require("fs");
const {Table} = require("console-table-printer");
const chalk = require("chalk");

const {
    getConfig,
    cleanTranslationsFiles,
    getLangMessageFilename,
    getManifest,
    getRelativePath,
    getWhitelistFilename,
    saveManifest,
    formatNumber,
    hashMessages,
    getLangMessages,
    saveLangMessages,
    getLangWhitelist,
    saveWhitelist
} = require("./utils");

module.exports.apply = ({translationsPath}) => (languageFilename, language = undefined) => {
    if (!translationsPath) {
        console.error(chalk.red("'translationsPath' not supplied"));
        process.exit(1);
    }

    try {
        const config = getConfig();

        const {languages} = config;
        const lang = language || path.parse(languageFilename).name.split("_")[1];

        if (languages.indexOf(lang) === -1) {
            console.error(chalk.red(`Language not found. Available languages are [${languages}]. Try --lang <lang>`));
            process.exit(1);
        }

        const manifest = getManifest(translationsPath);

        const report = {
            languages: Object.values(manifest.languages),
            summary: {
                updatedCount: 0,
                totalTranslationsCount: 0,
                whiteListCount: 0
            }
        };

        cleanTranslationsFiles(translationsPath, languages);

        const sourceMessages = JSON.parse(fs.readFileSync(languageFilename).toString());
        const sourceMessagesHash = hashMessages(sourceMessages);

        const targetMessages = getLangMessages(translationsPath, lang);

        const defaultMessages = getLangMessages(translationsPath);

        const whitelist = getLangWhitelist(translationsPath, lang);

        const updatedMessages = hashMessages(Object.values(defaultMessages).map(message => {
            const {id, defaultMessage} = message;

            if (sourceMessagesHash[id]) {
                if (sourceMessagesHash[id].defaultMessage === defaultMessage) {
                    if (whitelist.ids.indexOf(id) === -1) {
                        whitelist.ids.push(id);
                        report.summary.whiteListCount++;
                    }
                } else {
                    const index = whitelist.ids.indexOf(id);
                    if (index !== -1) {
                        whitelist.ids.splice(index, 1);
                        report.summary.whiteListCount--;
                    }
                }

                if (!targetMessages[id] || targetMessages[id].defaultMessage !== sourceMessagesHash[id].defaultMessage) {
                    report.summary.updatedCount++;
                }

                return {
                    ...message,
                    defaultMessage: sourceMessagesHash[id].defaultMessage
                };
            }

            return {
                ...message,
                defaultMessage: (targetMessages[id] && targetMessages[id].defaultMessage) || defaultMessage
            };
        }));

        report.summary.totalTranslationsCount = Object.keys(defaultMessages).length;

        saveLangMessages(translationsPath, updatedMessages, lang);
        saveWhitelist(translationsPath, whitelist, lang);

        const filename = getRelativePath(getLangMessageFilename(translationsPath, lang));
        const whitelistFilename = getRelativePath(getWhitelistFilename(translationsPath, lang));

        report.languages.push({
            lang,
            filename,
            whitelistFilename
        });

        saveManifest(translationsPath, report);

        const managed = {
            getReport: () => report,
            printSummary: () => {
                const t = new Table({
                    columns: [
                        {name: "Language", alignment: "left"},
                        {name: "Updated Messages", alignment: "right"},
                        {name: "Whitelist Diff", alignment: "right"},
                        {name: "Translations", alignment: "right"}
                    ],
                });

                t.addRow({
                    "Language": lang,
                    "Updated Messages": formatNumber(report.summary.updatedCount),
                    "Whitelist Diff": formatNumber(report.summary.whiteListCount),
                    "Translations": formatNumber(report.summary.totalTranslationsCount)
                });

                t.printTable();

                return managed;
            }
        };

        return managed;
    } catch (ex) {
        console.error(chalk.red(ex.message));
        process.exit(1);
    }
};
