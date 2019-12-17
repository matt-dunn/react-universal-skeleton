import path from "path";
import fs from "fs";
import {Table} from "console-table-printer";
import chalk from "chalk";

import {
    formatNumber,
    hashMessages,
    getLangMessages,
    saveLangMessages,
    getLangWhitelist,
    saveWhitelist
} from "./utils";

export const apply = ({languages, translationsPath}) => (languageFilename, language = undefined) => {
    if (!translationsPath) {
        console.error(chalk.red("'translationsPath' not supplied"));
        process.exit(1);
    }

    if (!languages) {
        console.error(chalk.red("'languages' not supplied"));
        process.exit(1);
    } else if (!Array.isArray(languages)) {
        console.error(chalk.red("'languages' must be an array"));
        process.exit(1);
    }

    try {
        const lang = language || path.parse(languageFilename).name.split("_")[1];

        if (languages.indexOf(lang) === -1) {
            console.error(chalk.red(`Language not found. Available languages are [${languages}]. Try --lang <lang>`));
            process.exit(1);
        }

        const report = {
            summary: {
                updatedCount: 0,
                totalTranslationsCount: 0,
                whiteListCount: 0
            }
        };

        const sourceMessages = JSON.parse(fs.readFileSync(languageFilename).toString());
        const sourceMessagesHash = hashMessages(sourceMessages);

        const targetMessages = getLangMessages(translationsPath, lang);
        const targetMessagesHash = hashMessages(targetMessages);

        const defaultMessages = getLangMessages(translationsPath);

        const whitelist = getLangWhitelist(translationsPath, lang);

        const updatedMessages = defaultMessages.map(message => {
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

                if (targetMessagesHash[id].defaultMessage !== sourceMessagesHash[id].defaultMessage) {
                    report.summary.updatedCount++;
                }

                return {
                    ...message,
                    defaultMessage: sourceMessagesHash[id].defaultMessage
                };
            }

            return {
                ...message,
                defaultMessage: (targetMessagesHash[id] && targetMessagesHash[id].defaultMessage) || defaultMessage
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
