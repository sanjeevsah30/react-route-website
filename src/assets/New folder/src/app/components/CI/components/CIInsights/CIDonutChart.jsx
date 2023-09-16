import React, { useContext } from "react";

import { ResponsivePie } from "@nivo/pie";
import { format } from "d3";
import { formatFloat } from "@tools/helpers";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";

const alpha = [
    "",
    "dd",
    "cc",
    "bb",
    "aa",
    "99",
    "88",
    "77",
    "66",
    "55",
    "44",
    "33",
    "22",
    "11",
];
// const data = [
//     {
//         id: 'a',
//         label: 'a',
//         value: 35,
//         count: 7,
//         trend: -18.34,
//         color: '#1a62f2',
//     },
//     {
//         id: 'b',
//         label: 'b',
//         value: 50,
//         count: 10,
//         trend: 16.66,
//         color: '#1a62f2dd',
//     },
//     {
//         id: 'c',
//         label: 'c',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f2bb',
//     },
//     {
//         id: 'd',
//         label: 'd',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f2aa',
//     },
//     {
//         id: 'e',
//         label: 'e',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f2bb',
//     },
//     {
//         id: 'f',
//         label: 'f',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f299',
//     },
//     {
//         id: 'g',
//         label: 'g',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f288',
//     },
//     {
//         id: 'h',
//         label: 'h',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f277',
//     },
//     {
//         id: 'i',
//         label: 'i',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f266',
//     },
//     {
//         id: 'j',
//         label: 'j',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f255',
//     },
//     {
//         id: 'k',
//         label: 'k',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f244',
//     },
//     {
//         id: 'l',
//         label: 'l',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f233',
//     },
//     {
//         id: 'm',
//         label: 'm',
//         value: 15,
//         count: 3,
//         trend: 4.97,
//         color: '#1a62f222',
//     },
// ];

const CustomLayerComponent = (myProps) => (layerProps) => {
    const { centerX, centerY } = layerProps;

    return (
        <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
                fontSize: "52px",
                fontWeight: "600",
            }}
        >
            {myProps}
        </text>
    );
};

export default function CIDonutChart({ data = [], title, total_occ = 0 }) {
    const { meetingType } = useContext(HomeContext);
    return (
        <div className="height100p width100p posRel">
            <ResponsivePie
                margin={{ top: 20, right: 5, bottom: 20, left: 5 }}
                data={data}
                innerRadius={0.7}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={0}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                colors={({ id, data }) => data?.color}
                enableArcLabels={false}
                enableArcLinkLabels={false}
                tooltip={({ datum }) => {
                    return (
                        <div className="donut__tooltip mine_shaft_cl">
                            {title === "Competition" ? (
                                <div>
                                    <div className="bold600 marginB16">
                                        {datum?.data?.label}
                                    </div>
                                    <div>
                                        {datum?.data?.sub_insights?.map(
                                            ({
                                                insight_name,
                                                id,
                                                sentiment,
                                            }) => (
                                                <div
                                                    className="flex alignCenter justifySpaceBetween marginB10"
                                                    key={id}
                                                >
                                                    <span className="marginR10">
                                                        {insight_name}
                                                    </span>
                                                    {sentiment !== 0 ? (
                                                        <span
                                                            className={`ci_tag ${
                                                                datum?.data
                                                                    ?.sentiment >
                                                                0
                                                                    ? "positive"
                                                                    : "negative"
                                                            }`}
                                                        >
                                                            {datum?.data
                                                                ?.sentiment > 0
                                                                ? "Positive"
                                                                : "Negative"}
                                                        </span>
                                                    ) : (
                                                        <span className="neutral">
                                                            Neutral
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="dove_gray_cl font12 bold600">
                                        {datum?.data?.label}
                                    </div>
                                    <div>
                                        <span className="bold600 marginR16">
                                            {formatFloat(datum?.value)}%
                                        </span>
                                        {datum?.data?.sentiment !== 0 && (
                                            <span
                                                className={`ci_tag ${
                                                    datum?.data?.sentiment > 0
                                                        ? "positive"
                                                        : "negative"
                                                }`}
                                            >
                                                {datum?.data?.sentiment > 0
                                                    ? "Positive"
                                                    : "Negative"}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                }}
            />
            <div
                className="posAbs text-center"
                style={{
                    transform: "translate(-50%,-50%)",
                    left: "50%",
                    top: "50%",
                }}
            >
                <div className="font20 bold700">{total_occ}</div>
                <div className="font12 dove_gray_cl">
                    {" "}
                    {meetingType === MeetingTypeConst.chat
                        ? "Chats"
                        : meetingType === MeetingTypeConst.email
                        ? "Emails"
                        : "Calls"}
                </div>
            </div>
        </div>
    );
}
