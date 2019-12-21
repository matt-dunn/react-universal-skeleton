const fs = require("fs");
const path = require("path");
const {isEqual, sortBy} = require("lodash");
const {Table} = require("console-table-printer");
const chalk = require("chalk");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");

const {
    getConfig,
    applyDelta,
    convertHashToArray,
    countWords,
    formatNumber,
    getDelta,
    getLangMessageFilename,
    getLangMessages,
    getLangWhitelist,
    getRelativePath,
    getWhitelistFilename,
    stringifyMessages,
    saveLangMessages,
    getDefaultMessages
} = require("./utils");

module.exports.manage = ({messagesPath, translationsPath, reportsPath, version}) => options => {
    const {updatedMessagesCallback, emmit} = Object.assign({}, {emmit: true, defaultMessages: undefined, updatedMessagesCallback: undefined}, options);

    if (!messagesPath) {
        console.error(chalk.red("'messagesPath' not supplied"));
        process.exit(1);
    }

    if (!translationsPath) {
        console.error(chalk.red("'translationsPath' not supplied"));
        process.exit(1);
    }

    if (!version) {
        console.error(chalk.red("'version' not supplied"));
        process.exit(1);
    }

    try {
        const config = getConfig();

        const {languages} = config;

        const report = {
            version,
            updated: false,
            timestamp: undefined,
            summary: {
                sourceLanguages: languages,
                totalLanguagesCount: languages.length,
                totalTranslationsCount: 0,
                totalUntranslatedCount: 0,
                totalWordCount: 0,
            },
            languages: []
        };

        let sourceDefaultMessages;

        const phaseComplete = {
            getReport: () => report,
            getReportPath: () => path.join(reportsPath, "i18l-status.json"),
            saveReport: () => {
                if (!reportsPath) {
                    console.error(chalk.red("'reportsPath' not supplied"));
                    process.exit(1);
                }

                mkdirp(reportsPath);
                fs.writeFileSync(phaseComplete.getReportPath(), stringifyMessages(report));

                return phaseComplete;
            },
            getSummary: () => {
                return {
                    ...report.summary,
                    languages: report.languages.map(language => {
                        const {delta, ...rest} = language;  // eslint-disable-line no-unused-vars
                        return rest;
                    })
                };
            },
            updateSummary: () => {
                const {timestamp, version} = report;
                const summary = phaseComplete.getSummary();

                const filename = path.join(translationsPath, "summary.json");
                const summaryReport = (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || {
                    languages: []
                };

                const lastSummary = summaryReport.languages[summaryReport.languages.length - 1];

                if (!lastSummary || !isEqual(lastSummary.summary, summary)) {
                    summaryReport.languages.push({timestamp, version, summary});

                    mkdirp(translationsPath);
                    fs.writeFileSync(filename, stringifyMessages(summaryReport));
                }

                return phaseComplete;
            },
            printSummary: () => {
                const translationCount = report.summary.totalTranslationsCount;

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

                sortBy(report.languages, ({untranslated}) => untranslated).reverse().forEach(({lang, untranslated, wordCount, delta}) => {
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
                        "% Complete": `${translationCount && (Math.round((100 - ((untranslated / translationCount) * 100)) * 100) / 100) || 0}%`,
                        "≈ Outstanding Words": formatNumber(wordCount)
                    }, {color});
                });

                t.printTable();

                return phaseComplete;
            },
            generateTranslations: () => {
                if (!reportsPath) {
                    console.error(chalk.red("'reportsPath' not supplied"));
                    process.exit(1);
                }

                const langPath = path.join(reportsPath, "languages");
                if (fs.existsSync(langPath)) {
                    rimraf.sync(path.join(langPath, `${version}_*.json`));
                }

                const translations = report.languages.map(({lang, untranslated, delta}) => {
                    if (untranslated > 0) {
                        return {
                            lang,
                            count: untranslated,
                            untranslated: Object.values(delta.untranslated)
                        };
                    }
                }).filter(translations => translations);

                if (translations.length > 0) {
                    mkdirp(langPath);

                    console.log(chalk`Creating {yellow ${translations.length}} translation files:`);

                    translations.forEach(({lang, count, untranslated}) => {
                        const langFilename = path.join(langPath, `${version}_${lang}.json`);
                        fs.writeFileSync(langFilename, stringifyMessages(sortBy(untranslated, o => o.id)));
                        console.log(chalk`  {yellow ${lang}} (${count} outstanding translations): '${langFilename}'`);
                    });
                }
            },
            checkStatus: () => {
                if (!phaseComplete.isComplete()) {
                    console.error(chalk.red(`Build failed because translations have not completed. ${report.summary.totalUntranslatedCount} total translations outstanding.`));
                    process.exit(3);
                }
            },
            isComplete: () => report.summary.totalUntranslatedCount === 0
        };

        const phaseManage = {
            processLanguage: (lang) => {
                const defaultLangMessages = getLangMessages(translationsPath);

                const translationCount = Object.keys(sourceDefaultMessages).length;
                const messages = getLangMessages(translationsPath, lang);
                const whitelist = getLangWhitelist(translationsPath, lang);
                const delta = getDelta(sourceDefaultMessages, defaultLangMessages, messages, whitelist);

                const untranslatedCount = Object.keys(delta.untranslated).length;
                const wordCount = countWords(convertHashToArray(delta.untranslated));

                report.summary.totalTranslationsCount = translationCount;
                report.summary.totalUntranslatedCount += untranslatedCount;
                report.summary.totalWordCount += wordCount;

                const filename = getRelativePath(getLangMessageFilename(translationsPath, lang));
                const whitelistFilename = getRelativePath(getWhitelistFilename(translationsPath, lang));

                report.languages.push({
                    lang,
                    filename,
                    whitelistFilename,
                    wordCount,
                    untranslated: untranslatedCount,
                    added: Object.keys(delta.added).length,
                    updated: Object.keys(delta.updated).length,
                    removed: Object.keys(delta.removed).length,
                    delta
                });

                const updatedMessages = applyDelta(sourceDefaultMessages, messages, delta);

                updatedMessagesCallback && updatedMessagesCallback(lang, updatedMessages, {filename, whitelistFilename});

                return updatedMessages;
            },
            done: () => {
                const reportLanguages = Object.values(report.languages).map(({lang}) => lang);

                // Add any missing languages to report
                languages.forEach(lang => {
                    if (reportLanguages.indexOf(lang) === -1) {
                        phaseManage.processLanguage(lang, sourceDefaultMessages);
                    }
                });

                report.timestamp = new Date().toISOString();

                if (emmit) {
                    sourceDefaultMessages && saveLangMessages(translationsPath, sourceDefaultMessages);
                }

                return phaseComplete;
            }
        };

        const phaseBegin = {
            processLanguages: () => {
                // const done = phaseBegin.seal(getLangMessages(translationsPath));
                const done = phaseBegin.seal(getDefaultMessages(messagesPath));

                languages.forEach(lang => {
                    done.processLanguage(lang, );
                });

                return done.done();
            },
            seal: (defaultMessages) => {
                sourceDefaultMessages = defaultMessages;

                return phaseManage;
            }
        };

        return phaseBegin;
    } catch (ex) {
        console.error(chalk.red(ex.message));
        process.exit(1);
    }
};
