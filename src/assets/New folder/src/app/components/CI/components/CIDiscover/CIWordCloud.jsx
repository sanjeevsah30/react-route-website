import { Switch } from "antd";
import React, { useMemo } from "react";
import { useCallback } from "react";

import ReactWordcloud from "react-wordcloud";
import BubbleChart from "./BubbleChart/BubbleChart";

import words from "./words";

const data = [
    { id: 1, name: "React", size: 350, fillColor: "#D3D3D3" },
    { id: 2, name: "TypeScript", size: 100, fillColor: "#9d9a9f" },
    { id: 3, name: "SCSS", size: 75, fillColor: "#605f62" },
    { id: 4, name: "Recoil", size: 150, fillColor: "#D3D3D3" },
    { id: 5, name: "Redux", size: 150, fillColor: "#D3D3D3" },
    { id: 6, name: "Material-UI", size: 125, fillColor: "#c6c5c6" },
    { id: 7, name: "Router", size: 230, fillColor: "#808080" },
    { id: 8, name: "Jest", size: 70, fillColor: "#C0C0C0" },
    { id: 9, name: "Enzym", size: 70, fillColor: "#C0C0C0" },
    { id: 10, name: "Sinon", size: 70, fillColor: "#C0C0C0" },
    { id: 11, name: "Puppeteer", size: 70, fillColor: "#C0C0C0" },
    { id: 12, name: "ESLint", size: 50, fillColor: "#A9A9A9" },
    { id: 13, name: "Prettier", size: 60, fillColor: "#A9A9A9" },
    { id: 14, name: "Lodash", size: 70, fillColor: "#DCDCDC" },
    { id: 15, name: "Moment", size: 80, fillColor: "#DCDCDC" },
    { id: 16, name: "Classnames", size: 90, fillColor: "#DCDCDC" },
    { id: 17, name: "Serve", size: 100, fillColor: "#DCDCDC" },
    { id: 18, name: "Snap", size: 150, fillColor: "#DCDCDC" },
    { id: 19, name: "Helmet", size: 150, fillColor: "#DCDCDC" },
];

const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "impact",
    fontSizes: [20, 100],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000,
};

export default React.memo(
    function CIWordCloud() {
        const selectedKeyHandler = useCallback((key) => {
            // eslint-disable-next-line no-alert
            alert(key);
        }, []);

        return (
            <>
                <div className="font18 bold600">Top 30 phrases</div>
                <div className="flex1">
                    {/* <BubbleChart
                        bubblesData={data}
                        minValue={1}
                        maxValue={150}
                        selectedCircle={selectedKeyHandler}
                    /> */}
                    {/* <ReactWordcloud
                        className="ciWordClod"
                        class
                        options={options}
                        words={words}
                    /> */}
                </div>

                <div className="switch__container">
                    <div className="switch__and__label">
                        <Switch />
                        <span className="switch_label">High Trend</span>
                    </div>
                    <div className="switch__and__label">
                        <Switch />
                        <span className="switch_label">High Trend</span>
                    </div>
                    <div className="switch__and__label">
                        <Switch />
                        <span className="switch_label">High Trend</span>
                    </div>
                    <div className="switch__and__label">
                        <Switch />
                        <span className="switch_label">High Trend</span>
                    </div>
                </div>
            </>
        );
    },
    () => true
);
