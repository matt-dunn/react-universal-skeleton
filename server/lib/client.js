import fs from "fs";
import path from "path";

export const htmlPath = path.join(process.cwd(), "dist", "client", "index.html");

export const rawHTML = fs.readFileSync(htmlPath).toString();

const headString = "<head>";
const appString = '<div id="app">';
const splitter = "###SPLIT###";

const [
    startingRawHTMLFragment,
    endingRawHTMLFragment
] = rawHTML
    .replace(appString, `${appString}${splitter}`)
    .split(splitter);

const [openHead, closeHead] = startingRawHTMLFragment
    .replace(headString, `${headString}${splitter}`)
    .split(splitter);

export const getHTMLFragments = () => {
    return [openHead, closeHead, endingRawHTMLFragment];
};

export const parseHelmetTemplate = helmet => (template, ...vars) => {
    const matcher = /{(\w*)}/g;

    return (helmet && template && template.map(
        item => item.trim()
            .replace(matcher, (value, prop) => (helmet[prop] && helmet[prop].toString()) || "")
    )
        .reduce((acc, item, i) => {
            acc.push(item);
            vars[i] && acc.push(vars[i]);
            return acc;
        }, [])
        .join("").trim()) || "";
};
