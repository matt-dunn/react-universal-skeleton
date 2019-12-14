import React from "react";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

import summary from "app/i18n/summary.json";

console.log(summary);

const {languages} = summary;

const summaryData = languages.map(({summary, timestamp}) => {
    return summary.languages.reduce((data: any, language) => {
        data[language.lang] = language.untranslated;

        return data;
    }, {
        timestamp
    });
}) as any[];

console.log("####!!!", summaryData);

const StatsI18n = () => {
    return (
        <>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <LineChart
                        width={500}
                        height={300}
                        data={summaryData}
                        margin={{
                            top: 10, right: 30, left: 20, bottom: 0,
                        }}
                    >
                        {/*<CartesianGrid strokeDasharray="3 3" />*/}
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="de" stroke="#0084d8" strokeWidth={2} dot={{ r:2 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="fr" stroke="#8884d8" strokeWidth={2} dot={{ r:2 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="en-GB" stroke="#82ca9d" strokeWidth={2} dot={{ r:2 }} activeDot={{ r: 5 }}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default StatsI18n;
