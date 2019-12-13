import React from "react";
import { ResponsiveLine, Line } from '@nivo/line'


const data = [
    {
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
    },
    {
        "id": "de",
        "color": "hsl(154, 70%, 50%)",
        "data": [
            {
                "x": "2019-12-11T16:45:29",
                "y": 190
            },
            {
                "x": "2019-12-12T16:45:29",
                "y": 264
            },
            {
                "x": "2019-12-12T18:45:29",
                "y": 213
            },
        ]
    },
]

const StatsI18n = () => {
    return (
        <>
            <div style={{height: "400px"}}>
                <ResponsiveLine
                    animate={false}
                    // width={700}
                    // height={400}
                    data={data}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    // xScale={{ type: 'point' }}
                    xScale={{
                        type: 'time',
                        format: '%Y-%m-%dT%H:%M:%S',
                        precision: 'hour'
                    }}
                    yScale={{ type: 'linear', stacked: true, min: 'auto', max: 'auto' }}
                    axisTop={null}
                    axisRight={null}
                    xFormat="time:%d %b %Y"
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        tickValues: "every 1 days",
                        // tickValues: data.length - 1,
                        format: '%d %b %Y %H',
                        // legend: 'The Transportation',
                        // legendOffset: 40,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'count',
                        legendOffset: -40,
                        legendPosition: 'middle'
                    }}
                    colors={{ scheme: 'nivo' }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabel="y"
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
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
