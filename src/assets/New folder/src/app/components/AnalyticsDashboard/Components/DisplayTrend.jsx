import { formatFloat } from "@tools/helpers";
import React from "react";

function DisplayTrend({ trend, style = {}, color }) {
    return (
        <span className="font10 mine_shaft_cl" style={style}>
            {trend >= 0 ? (
                <span className="bold600 marginR4" style={{ color: "#52C41A" }}>
                    &nbsp;&nbsp;&#9650;
                </span>
            ) : (
                <span className="bold600 marginR4" style={{ color: "#fd586b" }}>
                    &nbsp;&nbsp;&#9660;
                </span>
            )}
            <span
                style={
                    color
                        ? {
                              color: trend >= 0 ? "#52c41a" : "#fd585b",
                          }
                        : {}
                }
            >
                {Math.abs(formatFloat(trend, 2))}%
            </span>
        </span>
    );
}

export default DisplayTrend;
