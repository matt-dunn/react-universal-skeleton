import path from "path";
import fs from "fs";
import {Table} from "console-table-printer";
import chalk from "chalk";

import {
    formatNumber,
    getDefaultMessages,
    getLangMessages,
    getLangWhitelist,
    hashMessages,
    saveLangMessages,
    saveWhitelist
} from "./utils";

export const apply = ({messagesPath, translationsPath}) => languageFilename => {
    try {
        const report = {
            summary: {
                updatedCount: 0,
                totalTranslationsCount: 0,
                whiteListCount: 0
            }
        };

        const lang = path.parse(languageFilename).name;

        const sourceDefaultMessages = getDefaultMessages(messagesPath);
        const sourceDefaultMessagesHash = hashMessages(sourceDefaultMessages);
        const messages = getLangMessages(translationsPath, lang);

        const sourceMessages = JSON.parse(fs.readFileSync(languageFilename).toString());
        const sourceMessagesHash = hashMessages(sourceMessages);

        const whitelist = getLangWhitelist(translationsPath, lang);

        const updatedMessages = messages.map(message => {
            const {id, defaultMessage} = message;

            if (sourceMessagesHash[id]) {
                if (sourceMessagesHash[id].defaultMessage !== defaultMessage) {
                    report.summary.updatedCount++;
                } else if (whitelist.ids.indexOf(id) === -1 && sourceDefaultMessagesHash[id].defaultMessage === defaultMessage) {
                    whitelist.ids.push(id);
                    report.summary.whiteListCount++;
                }

                return {
                    ...sourceDefaultMessagesHash[id],
                    defaultMessage: sourceMessagesHash[id].defaultMessage
                };
            }

            return {
                ...sourceDefaultMessagesHash[id],
                defaultMessage: message.defaultMessage
            };
        });

        report.summary.totalTranslationsCount = messages.length;

        saveLangMessages(translationsPath, updatedMessages, lang);
        saveWhitelist(translationsPath, whitelist, lang);

        const managed = {
            getReport: () => report,
            printSummary: () => {
                const t = new Table({
                    columns: [
                        {name: "Language", alignment: "left"},
                        {name: "Updated Messages", alignment: "right"},
                        {name: "Translations", alignment: "right"}
                    ],
                });

                t.addRow({
                    "Language": lang,
                    "Updated Messages": formatNumber(report.summary.updatedCount),
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
