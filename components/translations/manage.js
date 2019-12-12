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
    formatNumber
} from "./utils";

export const translations = ({messagesPath, translationsPath, reportsPath, languages}) => {
    return {
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
                    const delta = getDelta(sourceDefaultMessages, defaultLangMessages, messages);

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
                            t.addRow({
                                "Language": lang,
                                "Translations": formatNumber(translationCount),
                                "Outstanding": formatNumber(untranslated),
                                "Added": formatNumber(Object.keys(delta.added).length),
                                "Removed": formatNumber(Object.keys(delta.removed).length),
                                "Updated": formatNumber(Object.keys(delta.updated).length),
                                "% Complete": `${Math.round((100 - ((untranslated / translationCount) * 100)) * 100) / 100}%`,
                                "≈ Outstanding Words": formatNumber(wordCount)
                            }, {color: untranslated === 0 ? "green" : "yellow"});
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
