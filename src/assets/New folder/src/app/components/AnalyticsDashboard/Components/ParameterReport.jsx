import React from "react";
import { useState } from "react";

function ParameterReport({ perData: { heading, data, perColor } }) {
    const [sortedData, setSortedData] = useState([...data]);

    const sortHandler = (sort) => {
        const temp = sortedData.sort((item1, item2) =>
            sort === "desc" ? item2[2] - item1[2] : item1[2] - item2[2]
        );

        setSortedData([...temp]);
    };

    return (
        <div className="flex1 parameter-table">
            <span className="mine_shaft_cl font16 bold600">{heading}</span>
            <div className="table-container">
                <div className="header">
                    <div className="head1">Parameters</div>
                    <div className="flex alignCenter justifyCenter">
                        <div className="">Average Score %</div>
                        <div className=" sort_arraow_container ">
                            <div
                                className="arrow"
                                onClick={() => sortHandler("desc")}
                            >
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 0L9.33012 5.82692H0.669873L5 0Z"
                                        fill="#999999"
                                    />
                                </svg>
                            </div>
                            <div
                                className="arrow"
                                onClick={() => sortHandler("asc")}
                            >
                                <svg
                                    width="10"
                                    height="7"
                                    viewBox="0 0 10 7"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 6.625L0.669877 0.798076L9.33013 0.798077L5 6.625Z"
                                        fill="#999999"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="parameterBar-container">
                    {sortedData.map((dataItem, index) => {
                        const newStyle =
                            data.length - 1 === index
                                ? { borderBottom: "none" }
                                : {};
                        return (
                            <ParameterBar
                                style={newStyle}
                                key={index}
                                ParaBarData={{ dataItem, perColor }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const ParameterBar = (props) => (
    <div className="parameterBar" style={props.style}>
        <div className="flex alignCenter justifySpaceBetween">
            <div className="parameter font16">
                {props.ParaBarData.dataItem[1]}
            </div>
            <div
                className="para_percentile"
                style={{ color: `${props.ParaBarData.perColor}` }}
            >
                {`${props.ParaBarData.dataItem[2]}%`}
            </div>
        </div>
        <div className="bar marginT16">
            <div
                className="bar-progress"
                style={{
                    width: `${props.ParaBarData.dataItem[2]}%`,
                }}
            ></div>
        </div>
    </div>
);

export default ParameterReport;
