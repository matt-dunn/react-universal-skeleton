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
    saveWhitelist,
    getDefaultMessages
} = require("../utils");

module.exports.apply = ({translationsPath}) => (languageFilename, language = undefined) => {
    if (!translationsPath) {
        console.error(chalk.red("'translationsPath' not supplied"));
        process.exit(1);
    }

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
            removedCount: 0,
            totalTranslationsCount: 0,
            whiteListCount: 0
        }
    };

    cleanTranslationsFiles(translationsPath, languages);

    const sourceMessages = JSON.parse(fs.readFileSync(languageFilename).toString());
    const sourceMessagesHash = hashMessages(sourceMessages);

    const targetMessages = getLangMessages(translationsPath, lang);

    const defaultMessages = getDefaultMessages(translationsPath);

    const whitelist = getLangWhitelist(translationsPath, lang);
    const whiteListCount = whitelist.ids.length;

    const updatedMessages = Object.keys(defaultMessages).reduce((messages, id) => {
        const {defaultMessage} = defaultMessages[id];

        if (sourceMessagesHash[id]) {
            if (sourceMessagesHash[id].defaultMessage === defaultMessage) {
                if (whitelist.ids.indexOf(id) === -1) {
                    whitelist.ids.push(id);
                }
            } else {
                const index = whitelist.ids.indexOf(id);
                if (index !== -1) {
                    whitelist.ids.splice(index, 1);
                }
            }

            if (!targetMessages[id] || targetMessages[id] !== sourceMessagesHash[id].defaultMessage) {
                report.summary.updatedCount++;
            }

            messages[id] = sourceMessagesHash[id].defaultMessage;
        } else {
            messages[id] = targetMessages[id] || defaultMessage;
        }

        return messages;
    }, {});

    whitelist.ids = whitelist.ids.map(id => {
        if (!defaultMessages[id]) {
            return undefined;
        }

        return id;
    }).filter(id => id);

    report.summary.totalTranslationsCount = Object.keys(defaultMessages).length;
    report.summary.removedCount = Object.keys(targetMessages).length - Object.keys(updatedMessages).length;
    report.summary.whiteListCount = whitelist.ids.length - whiteListCount;

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
                    {name: "Translations", alignment: "right"},
                    {name: "Updated Messages", alignment: "right"},
                    {name: "Removed Messages", alignment: "right"},
                    {name: "Whitelist Diff", alignment: "right"}
                ],
            });

            t.addRow({
                "Language": lang,
                "Translations": formatNumber(report.summary.totalTranslationsCount),
                "Updated Messages": formatNumber(report.summary.updatedCount),
                "Removed Messages": formatNumber(report.summary.removedCount),
                "Whitelist Diff": formatNumber(report.summary.whiteListCount)
            });

            t.printTable();

            return managed;
        }
    };

    return managed;
};
