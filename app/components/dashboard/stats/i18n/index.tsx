import React from "react";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import {useIntl} from "react-intl";

import summary from "app/i18n/summary.json";

console.log(summary);

const {languages} = summary;

const summaryData = languages.reduce((data: any, {summary, timestamp}: {summary: {languages: any[]}; timestamp: string}) => {
    data.set.push(summary.languages.reduce((set: any, language: {lang: string; untranslated: any}) => {
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
}) as {set: any[]; lang: any};

const COLORS = [
    "#0084d8",
    "#82ca9d",
    "#82009d",
    "#ffc658"
];

const StatsI18n = () => {
    const intl = useIntl();

    const formatDate = (value: string | number): string => {
        return intl.formatDate(value, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        });
    };

    return (
        <>
            <div style={{ width: "100%", height: 300, fontSize: "1.3rem" }}>
                <ResponsiveContainer>
                    <LineChart
                        width={500}
                        height={300}
                        data={summaryData.set}
                        margin={{
                            top: 10, right: 0, left: 0, bottom: 0,
                        }}
                    >
                        {/*<CartesianGrid strokeDasharray="3 none" color="red" stroke="red" />*/}
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatDate}
                            // scale="time"
                            // scale={2}
                            // stroke="red"
                            // tick={{fontSize: 14}}
                        />
                        <YAxis domain={["dataMin", "dataMax"]} minTickGap={1} interval={0} allowDecimals={false} />
                        <Tooltip labelFormatter={formatDate}/>
                        <Legend />
                        {Object.keys(summaryData.lang).map((lang, index) => (
                            <Line key={lang} type="monotone" dataKey={lang} stroke={COLORS[index % COLORS.length]} strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 5 }} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default StatsI18n;
