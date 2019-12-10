import fs from "fs";
import path from "path";
import manageTranslations from "react-intl-translations-manager";
import { parse } from "intl-messageformat-parser";
import chalk from "chalk";
import {Table} from "console-table-printer";

import {header} from "react-intl-translations-manager/dist/printer";
import printResults from "react-intl-translations-manager/dist/printResults";
import stringify from "json-stable-stringify";

import metadata from "app/webpack/metadata";

const {availableLocales, target, i18nMessagesPath, reportsPath} = metadata();
const reportFilename = path.resolve(reportsPath, "i18l-untranslated.json");

const normalize = o => {
    return o.map(({type, value, options}) => {
        if (type === 0) {
            return value.replace(/[^0-9a-zA-Z\s]+/ig, "").trim();
        } else if (options) {
            return Object.keys(options).map(key => normalize(options[key].value)).join(" ");
        }
    }).filter(w => w && w.trim() !== "").join(" ").split(/\b/).filter(word => word.trim() !== "");
};

const countWords = messages => messages.reduce((wordCount, {message}) => wordCount + normalize(parse(message)).length, 0);

const initReport = () => {
    fs.writeFileSync(reportFilename, stringify({languages: []}, {
        space: 2,
        trailingNewline: false
    }));
};

const getReport = () => JSON.parse(fs.readFileSync(reportFilename).toString());

const appendReport = (data) => {
    const report = getReport();
    report.languages.push(data);
    fs.writeFileSync(reportFilename, stringify(report, {
        space: 2,
        trailingNewline: false
    }));
};

const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

manageTranslations({
    messagesDirectory: path.resolve(target, i18nMessagesPath),
    translationsDirectory: "app/translations/locales/",
    languages: availableLocales,
    overrideCoreMethods: {
        beforeReporting: () => {
            initReport();
        },
        afterReporting: () => {
            const report = getReport();

            const t = new Table({
                columns: [
                    { name: "Language", alignment: "left" }, //with alignment
                    { name: "Translations", alignment: "right" },
                    { name: "Outstanding", alignment: "right" },
                    { name: "% Complete", alignment: "right" },
                    { name: "≈ Outstanding Words", alignment: "right" },
                ],
            });

            report.languages.sort((a, b) => (a.lang > b.lang) ? 1 : -1).forEach(({lang, translationCount, untranslatedCount, wordCount}) => {
                t.addRow({
                    "Language": lang,
                    "Translations": formatNumber(translationCount),
                    "Outstanding": formatNumber(untranslatedCount),
                    "% Complete": `${Math.round((100 - ((untranslatedCount / translationCount) * 100)) * 100) / 100}%`,
                    "≈ Outstanding Words": formatNumber(wordCount)
                }, {color: untranslatedCount === 0 ? "green" : "yellow"});
            });

            t.printTable();
        },
    },
    overridePrinters: {
        printLanguageReport: langResults => {
            const {lang, languageFilename, report, languageFilepath} = langResults;

            if (lang !== "en") {    // Not the default language
                header("Maintaining " + chalk.yellow(languageFilename) + ":");
                printResults(Object.assign({}, report, {sortKeys: true}));

                const wordCountAdded = countWords(report.added);
                const wordCountUntranslated = countWords(report.untranslated);

                const model = {
                    lang,
                    languageFilepath,
                    translationCount: Object.keys(report.fileOutput).length,
                    untranslatedCount: report.added.length + report.untranslated.length,
                    wordCount: wordCountAdded + wordCountUntranslated,
                    added: {
                        messageCount: report.added.length,
                        wordCount: wordCountAdded,
                        messages: report.added
                    },
                    existingUntranslated: {
                        messageCount: report.untranslated.length,
                        wordCount: wordCountUntranslated,
                        messages: report.untranslated
                    }
                };

                appendReport(model);
            }
        }
    }
});
