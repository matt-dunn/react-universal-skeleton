import React from "react";
import {ResponsiveLine, Line, Serie} from "@nivo/line";

import summary from "app/translations/locales/summary.json";

console.log(summary);

const {languages} = summary;

const summaryData = Object.values(languages.reduce((data: any, {summary, timestamp}) => {
    const {totalTranslationsCount} = summary;

    // data["default"] = data["default"] || {
    //     id: "default",
    //     data: []
    // }
    //
    // console.log(timestamp, new Date(timestamp))
    //
    // data["default"].data.push({
    //     x: timestamp,
    //     y: totalTranslationsCount
    // })

    summary.languages.forEach(language => {
        data[language.lang] = data[language.lang] || {
            id: language.lang,
            data: []
        };
        data[language.lang].data.push({
            x: timestamp,
            y: language.untranslated
        });
    });

    return data;
}, {})) as Serie[];

console.log("####!!!", summaryData);

languages.map(language => {
    return {
        "id": "default",
        "color": "hsl(140, 70%, 50%)",
        "data": [
            {
                "x": "2019-12-11T16:45:29",
                "y": 87
            },
            {
                "x": "2019-12-12T16:45:29",
                "y": 21
            },
            {
                "x": "2019-12-12T18:45:29",
                "y": 23
            },
        ]
    };
});

const data = [
    {
        "id": "default",
        "color": "hsl(140, 70%, 50%)",
        "data": [
            {
                "x": "2019-12-11T16:45:29.498Z",
                "y": 87
            },
        ]
    },
    {
        "id": "de",
        "color": "hsl(154, 70%, 50%)",
        "data": [
            {
                "x": "2019-12-11T16:45:29.498Z",
                "y": 190
            },
        ]
    },
];

const StatsI18n = () => {
    return (
        <>
            <div style={{height: "400px"}}>
                <ResponsiveLine
                    animate={false}
                    // width={700}
                    // height={400}
                    data={summaryData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    // xScale={{ type: 'point' }}
                    xScale={{
                        // type: "linear"
                        type: "time",
                        format: "%Y-%m-%dT%H:%M:%S.%f%Z",
                        precision: "second"
                    }}
                    curve="linear"
                    yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
                    axisTop={null}
                    axisRight={null}
                    xFormat="time:%d %b %Y %H:%M"
                    // yFormat={value => parseInt(value, 10)}
                    axisBottom={{
                        orient: "bottom",
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        // tickValues: "every 1 hours",
                        // tickValues: data.length - 1,
                        format: "%d %b %Y %H:%M",
                        // legend: 'The Transportation',
                        // legendOffset: 40,
                        legendPosition: "middle"
                    }}
                    axisLeft={{
                        orient: "left",
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Untranslated",
                        legendOffset: -40,
                        legendPosition: "middle"
                    }}
                    colors={{ scheme: "nivo" }}
                    pointSize={10}
                    pointColor={{ theme: "background" }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "serieColor" }}
                    pointLabel="y"
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: "bottom-right",
                            direction: "column",
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: "left-to-right",
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: "circle",
                            symbolBorderColor: "rgba(0, 0, 0, .5)",
                            effects: [
                                {
                                    on: "hover",
                                    style: {
                                        itemBackground: "rgba(0, 0, 0, .03)",
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>
        </>
    );
};

export default StatsI18n;
