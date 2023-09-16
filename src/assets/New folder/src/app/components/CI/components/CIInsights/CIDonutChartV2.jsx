import React from "react";

import { ResponsivePie } from "@nivo/pie";

const data = [
    {
        id: "good",
        label: "good",
        value: 35,
        count: 7,
        trend: -18.34,
        color: "#76b95c",
    },
    {
        id: "average",
        label: "average",
        value: 50,
        count: 10,
        trend: 16.66,
        color: "#eca51d",
    },
    {
        id: "bad",
        label: "bad",
        value: 15,
        count: 3,
        trend: 4.97,
        color: "#ff6365",
    },
];

export default function CIDonutChartV2({ data = [] }) {
    return (
        <ResponsivePie
            data={data}
            // margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            margin={{ top: 5, right: 10, bottom: 10, left: 10 }}
            innerRadius={0.75}
            activeOuterRadiusOffset={8}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            colors={({ id, data }) => data?.color}
            enableArcLabels={false}
            enableArcLinkLabels={false}
        />
    );
}
