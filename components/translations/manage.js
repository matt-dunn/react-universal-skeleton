const fs = require("fs");
const path = require("path");
const {isEqual, sortBy} = require("lodash");
const {Table} = require("console-table-printer");
const chalk = require("chalk");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");

const {
    applyDelta,
    applyWhitelistDelta,
    cleanTranslationsFiles,
    convertHashToArray,
    countWords,
    formatNumber,
    getDefaultMessages,
    getDelta,
    getLangMessageFilename,
    getLangMessages,
    getLangWhitelist,
    getRelativePath,
    getWhitelistFilename,
    saveLangMessages,
    saveManifest,
    saveWhitelist,
    stringifyMessages
} = require("./utils");

module.exports.manage = ({messagesPath, translationsPath, reportsPath, languages, version}) => options => {
    const {emmit, defaultMessages, updatedMessagesCallback} = Object.assign({}, {emmit: false, defaultMessages: undefined, updatedMessagesCallback: undefined}, options);

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

    if (!languages) {
        console.error(chalk.red("'languages' not supplied"));
        process.exit(1);
    } else if (!Array.isArray(languages)) {
        console.error(chalk.red("'languages' must be an array"));
        process.exit(1);
    }

    const report = {
        version,
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
        cleanTranslationsFiles(translationsPath, languages);

        const sourceDefaultMessages = defaultMessages || getDefaultMessages(messagesPath);
        const defaultLangMessages = getLangMessages(translationsPath);

        const translationCount = Object.keys(sourceDefaultMessages).length;

        report.summary.totalTranslationsCount = translationCount;

        languages.forEach(lang => {
            const messages = getLangMessages(translationsPath, lang);
            const whitelist = getLangWhitelist(translationsPath, lang);
            const delta = getDelta(sourceDefaultMessages, defaultLangMessages, messages, whitelist);

            const untranslatedCount = Object.keys(delta.untranslated).length;
            const wordCount = countWords(convertHashToArray(delta.untranslated));

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

            if (emmit) {
                saveLangMessages(translationsPath, updatedMessages, lang);
                saveWhitelist(translationsPath, applyWhitelistDelta(whitelist, delta), lang);
            }
        });

        report.timestamp = new Date().toISOString();

        if (emmit) {
            report.updated = new Date().toISOString();

            saveLangMessages(translationsPath, sourceDefaultMessages);
            saveManifest(translationsPath, report);
        }

        const managed = {
            getReport: () => report,
            getReportPath: () => path.join(reportsPath, "i18l-status.json"),
            saveReport: () => {
                if (!reportsPath) {
                    console.error(chalk.red("'reportsPath' not supplied"));
                    process.exit(1);
                }

                mkdirp(reportsPath);
                fs.writeFileSync(managed.getReportPath(), stringifyMessages(report));

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
                const {timestamp, version} = report;
                const summary = managed.getSummary();

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
                        "% Complete": `${translationCount && (Math.round((100 - ((untranslated / translationCount) * 100)) * 100) / 100) || 0}%`,
                        "≈ Outstanding Words": formatNumber(wordCount)
                    }, {color});
                });

                t.printTable();

                return managed;
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
                if (!managed.isComplete()) {
                    console.error(chalk.red(`Build failed because translations have not completed. ${report.summary.totalUntranslatedCount} total translations outstanding.`));
                    process.exit(3);
                }
            },
            isComplete: () => report.summary.totalUntranslatedCount === 0
        };

        return managed;
    } catch (ex) {
        console.error(chalk.red(ex.message));
        process.exit(1);
    }
};
