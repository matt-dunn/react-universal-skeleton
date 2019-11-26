import fs from "fs";
import path from "path";

export const htmlPath = path.join(process.cwd(), "dist", "client", "index.html");

export const rawHTML = fs.readFileSync(htmlPath).toString();

const parts = rawHTML.match(/(?<open>.*)(?<openApp><\/head>.*?<div.*?data-app-root.*?>)\n*(?<closeApp>.*?<\/div>)(?<close>.*)/ims);

if (!parts) {
    throw new Error("Invalid template. Check the app has <div data-app-root>");
}

export const getHTMLFragments = () => {
    return parts.groups;
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
