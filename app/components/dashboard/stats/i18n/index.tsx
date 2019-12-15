import React from "react";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

import summary from "app/i18n/summary.json";

console.log(summary);

const {languages} = summary;

const summaryData = languages.reduce((data: any, {summary, timestamp}) => {
    data.set.push(summary.languages.reduce((set: any, language) => {
        set[language.lang] = language.untranslated;
        data.lang[language.lang] = true;

        return set;
    }, {
        timestamp
    }));


    return data;
}, {
    set: [] as any[],
    lang: {}
}) as {set: any[], lang: any};

const COLORS = [
    "#0084d8",
    "#82ca9d",
    "#82009d"
];

console.log("####!!!", summaryData);

const StatsI18n = () => {
    return (
        <>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <LineChart
                        width={500}
                        height={300}
                        data={summaryData.set}
                        margin={{
                            top: 10, right: 30, left: 20, bottom: 0,
                        }}
                    >
                        {/*<CartesianGrid strokeDasharray="3 3" />*/}
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Object.keys(summaryData.lang).map((lang, index) => (
                            <Line key={lang} type="monotone" dataKey={lang} stroke={COLORS[index % COLORS.length]} strokeWidth={2} dot={{ r:2 }} activeDot={{ r: 5 }} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default StatsI18n;
