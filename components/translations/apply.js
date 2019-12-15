import path from "path";
import fs from "fs";
import {Table} from "console-table-printer";
import chalk from "chalk";

import {
    formatNumber,
    getLangMessages,
    getLangWhitelist,
    hashMessages,
    saveLangMessages,
    saveWhitelist
} from "./utils";

export const apply = ({languages, translationsPath}) => (languageFilename, language = undefined) => {
    try {
        const report = {
            summary: {
                updatedCount: 0,
                totalTranslationsCount: 0,
                whiteListCount: 0
            }
        };

        const lang = language || path.parse(languageFilename).name.split("_")[1];

        if (languages.indexOf(lang) === -1) {
            console.error(chalk.red(`Language not found. Available languages are [${languages}]. Try --lang <lang>`));
            process.exit(1);
        }

        const sourceMessages = JSON.parse(fs.readFileSync(languageFilename).toString());
        const sourceMessagesHash = hashMessages(sourceMessages);

        const targetMessages = getLangMessages(translationsPath, lang);
        const targetMessagesHash = hashMessages(targetMessages);

        const defaultMessages = getLangMessages(translationsPath);
        const defaultMessagesHash = hashMessages(defaultMessages);

        const whitelist = getLangWhitelist(translationsPath, lang);

        const updatedMessages = defaultMessages.map(({id, defaultMessage}) => {
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

                if (targetMessagesHash[id].defaultMessage !== sourceMessagesHash[id].defaultMessage) {
                    report.summary.updatedCount++;
                }

                return {
                    ...defaultMessagesHash[id],
                    defaultMessage: sourceMessagesHash[id].defaultMessage
                };
            }

            return {
                ...defaultMessagesHash[id],
                defaultMessage
            };
        });

        report.summary.totalTranslationsCount = defaultMessages.length;

        saveLangMessages(translationsPath, updatedMessages, lang);
        saveWhitelist(translationsPath, whitelist, lang);

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
