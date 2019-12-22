const fs = require("fs");
const path = require("path");
const {isEqual, sortBy} = require("lodash");
const {Table} = require("console-table-printer");
const chalk = require("chalk");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");

const {
    formatNumber,
    stringifyMessages
} = require("../utils");

const phaseComplete = (config, report) => {
    const {translationsPath, reportsPath, version} = config;

    const ret = {
        getReport: () => report,
        getReportPath: () => path.join(reportsPath, "i18l-status.json"),
        saveReport: () => {
            if (!reportsPath) {
                console.error(chalk.red("'reportsPath' not supplied"));
                process.exit(1);
            }

            mkdirp(reportsPath);
            fs.writeFileSync(ret.getReportPath(), stringifyMessages(report));

            return ret;
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
            const summary = ret.getSummary();

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

            return ret;
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

            return ret;
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
            if (!ret.isComplete()) {
                console.error(chalk.red(`Build failed because translations have not completed. ${report.summary.totalUntranslatedCount} total translations outstanding.`));
                process.exit(3);
            }
        },
        isComplete: () => report.summary.totalUntranslatedCount === 0
    };

    return ret;
};

module.exports = phaseComplete;
