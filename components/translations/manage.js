import fs from "fs";
import path from "path";
import stringify from "json-stable-stringify";
import chalk from "chalk";
import {Table} from "console-table-printer";
import {isEqual} from "lodash";

import {
    applyDelta,
    convertHashToArray,
    countWords,
    getDefaultMessages,
    getDelta,
    getLangMessages,
    saveLangMessages,
    formatNumber,
    getLangWhitelist,
    saveWhitelist,
    hashMessages
} from "./utils";

export const translations = ({messagesPath, translationsPath, reportsPath, languages}) => {
    return {
        apply: (languageFilename) => {
            try {
                const report = {
                    summary: {
                        updatedCount: 0,
                        totalTranslationsCount: 0,
                        whiteListCount: 0
                    }
                };

                const sourceDefaultMessages = getDefaultMessages(messagesPath);
                const sourceDefaultMessagesHash = hashMessages(sourceDefaultMessages);

                const translationCount = sourceDefaultMessages.length;

                report.summary.totalTranslationsCount = translationCount;

                const lang = path.parse(languageFilename).name;
                const sourceMessages = JSON.parse(fs.readFileSync(languageFilename).toString());
                const sourceMessagesHash = hashMessages(sourceMessages);
                const whitelist = getLangWhitelist(translationsPath, lang);

                const updatedMessages = sourceMessages.map((message) => {
                    const {id} = message;

                    if (sourceMessagesHash[id]) {
                        report.summary.updatedCount++;

                        if (sourceDefaultMessagesHash[id].defaultMessage === sourceMessagesHash[id].defaultMessage && whitelist.ids.indexOf(id) === -1) {
                            whitelist.ids.push(id);
                            report.summary.whiteListCount++;
                        }

                        return sourceMessagesHash[id];
                    }

                    return message;
                });

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
                            "Updated Messages": report.summary.updatedCount,
                            "Translations": report.summary.totalTranslationsCount
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
        },
        manage: ({update} = {update: true}) => {
            const report = {
                updated: false,
                timestamp: undefined,
                summary: {
                    totalLanguagesCount: languages.length,
                    totalTranslationsCount: 0,
                    totalUntranslatedCount: 0,
                    totalWordCount: 0,
                },
                languages: []
            };

            try {
                const sourceDefaultMessages = getDefaultMessages(messagesPath);
                const defaultLangMessages = getLangMessages(translationsPath);

                const translationCount = sourceDefaultMessages.length;

                report.summary.totalTranslationsCount = translationCount;

                languages.forEach(lang => {
                    const messages = getLangMessages(translationsPath, lang);
                    const whitelist = getLangWhitelist(translationsPath, lang);
                    const delta = getDelta(sourceDefaultMessages, defaultLangMessages, messages, whitelist);

                    const untranslatedCount = Object.keys(delta.untranslated).length;
                    const wordCount = countWords(convertHashToArray(delta.untranslated));

                    report.summary.totalUntranslatedCount += untranslatedCount;
                    report.summary.totalWordCount += wordCount;

                    report.languages.push({
                        lang,
                        wordCount,
                        untranslated: untranslatedCount,
                        added: Object.keys(delta.added).length,
                        updated: Object.keys(delta.updated).length,
                        removed: Object.keys(delta.removed).length,
                        delta
                    });

                    if (update) {
                        const updatedMessages = applyDelta(messages, delta);
                        saveLangMessages(translationsPath, updatedMessages, lang);
                        saveWhitelist(translationsPath, whitelist, lang);
                    }
                });

                update && saveLangMessages(translationsPath, sourceDefaultMessages);

                report.updated = update && new Date().toISOString();
                report.timestamp = new Date().toISOString();

                const managed = {
                    getReport: () => report,
                    saveReport: () => {
                        fs.writeFileSync(path.join(reportsPath, "i18l-untranslated.json"), stringify(report, {
                            space: 2,
                            trailingNewline: false
                        }));

                        return managed;
                    },
                    getSummary: () => {
                        return {
                            ...report.summary,
                            translationLanguages: languages,
                            languages: report.languages.map(language => {
                                const {delta, ...rest} = language;  // eslint-disable-line no-unused-vars
                                return rest;
                            })
                        };
                    },
                    updateSummary: () => {
                        const {timestamp} = report;
                        const summary = managed.getSummary();

                        const filename = path.join(translationsPath, "summary.json");
                        const summaryReport = (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || {
                            languages: []
                        };

                        const lastSummary = summaryReport.languages[summaryReport.languages.length - 1];

                        if (!lastSummary || !isEqual(lastSummary.summary, summary)) {
                            summaryReport.languages.push({timestamp, summary});

                            fs.writeFileSync(filename, stringify(summaryReport, {
                                space: 2,
                                trailingNewline: false
                            }));
                        }

                        return managed;
                    },
                    printSummary: () => {
                        const t = new Table({
                            columns: [
                                {name: "Language", alignment: "left"},
                                {name: "Status", alignment: "left"},
                                {name: "Translations", alignment: "right"},
                                {name: "Outstanding", alignment: "right"},
                                {name: "Added", alignment: "right"},
                                {name: "Removed", alignment: "right"},
                                {name: "Updated", alignment: "right"},
                                {name: "% Complete", alignment: "right"},
                                {name: "≈ Outstanding Words", alignment: "right"},
                            ],
                        });

                        report.languages.forEach(({lang, untranslated, wordCount, delta}) => {
                            let color = "";
                            let status = "In Progress";

                            if (untranslated === 0) {
                                color = "green";
                                status = "Complete";
                            } else if (untranslated === translationCount) {
                                color = "yellow";
                                status = "Not started";
                            }

                            t.addRow({
                                "Language": lang,
                                "Status": status,
                                "Translations": formatNumber(translationCount),
                                "Outstanding": formatNumber(untranslated),
                                "Added": formatNumber(Object.keys(delta.added).length),
                                "Removed": formatNumber(Object.keys(delta.removed).length),
                                "Updated": formatNumber(Object.keys(delta.updated).length),
                                "% Complete": `${Math.round((100 - ((untranslated / translationCount) * 100)) * 100) / 100}%`,
                                "≈ Outstanding Words": formatNumber(wordCount)
                            }, {color});
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
        }
    };
};
