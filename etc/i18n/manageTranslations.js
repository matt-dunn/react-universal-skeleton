import fs from "fs";
import path from "path";
import stringify from "json-stable-stringify";
import { parse } from "intl-messageformat-parser";
import chalk from "chalk";
import {Table} from "console-table-printer";
import {isEqual} from "lodash";

import metadata from "app/webpack/metadata";

const {availableLocales, i18nMessagesPath, i18nLocalePath, reportsPath} = metadata();

const getDefaultMessages = (messagesPath) => JSON.parse(fs.readFileSync(path.join(process.cwd(), messagesPath, "defaultMessages.json")).toString());

const getLangMessages = (translationsPath, lang = "default") => {
    const filename = path.join(translationsPath, `_${lang}.json`);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || [];
};

const saveLangMessages = (translationsPath, messages, lang = "default") => {
    const filename = path.join(translationsPath, `_${lang}.json`);
    fs.writeFileSync(filename, stringify(messages, {
        space: 2,
        trailingNewline: false
    }));
};

const hashMessages = messages => messages.reduce((hash, message) => {
    hash[message.id] = message;
    return hash;
}, {});

const normalize = o => {
    return o.map(({type, value, options}) => {
        if (type === 0) {
            return value.replace(/[^a-zA-Z\s]+/ig, "").trim();
        } else if (options) {
            return Object.keys(options).map(key => normalize(options[key].value)).join(" ");
        }
    }).filter(w => w && w.trim() !== "").join(" ").split(/\b/).filter(word => word.trim() !== "");
};

const countWords = messages => messages.reduce((wordCount, {defaultMessage}) => wordCount + normalize(parse(defaultMessage)).length, 0);

const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const convertHashToArray = messages => Object.values(messages);

const getDelta = (sourceDefaultMessages, defaultLangMessages, messages) => {
    const messagesHash = hashMessages(messages);
    const defaultLangMessagesHash = hashMessages(defaultLangMessages);
    const defaultMessagesHash = hashMessages(sourceDefaultMessages);

    const delta = sourceDefaultMessages.reduce((delta, message) => {
        const {id} = message;

        if (!messagesHash[id]) {
            delta.added[id] = message;
            delta.untranslated[id] = message;
        } else if (defaultLangMessagesHash[id] && defaultMessagesHash[id].defaultMessage !== defaultLangMessagesHash[id].defaultMessage) {
            delta.updated[id] = message;
            delta.untranslated[id] = message;
        } else if (messagesHash[id] && !defaultMessagesHash[id]) {
            delta.removed[id] = message;
        }

        return delta;
    }, {
        added: {},
        removed: {},
        updated: {},
        untranslated: {}
    });

    Object.keys(messagesHash).reduce((delta, id) => {
        if (!defaultMessagesHash[id]) {
            delta.removed[id] = messagesHash[id];
        } else if (messagesHash[id].defaultMessage === defaultMessagesHash[id].defaultMessage) {
            delta.untranslated[id] = messagesHash[id];
        }

        return delta;
    }, delta);

    return delta;
};

const applyDelta = (messages, {added, removed, updated}) => {
    return messages
        .map(message => {
            const {id} = message;
            if (removed[id]) {
                return undefined;
            } else if (updated[id]) {
                return updated[id];
            } else {
                return message;
            }
        })
        .filter(message => message)
        .concat(Object.keys(added).map(key => added[key]));
};

const translations = ({messagesPath, translationsPath, reportsPath, languages}) => {
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

const managedTranslations = translations({
    messagesPath: i18nMessagesPath,
    translationsPath: i18nLocalePath,
    languages: availableLocales,
    reportsPath
}).manage({
    update: true
});

managedTranslations
    .printSummary()
    .saveReport()
    .updateSummary();

// console.log(managedTranslations.getReport())
// console.log("SUMMARY",managedTranslations.getSummary())
