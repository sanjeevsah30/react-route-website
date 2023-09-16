import React from "react";
import { Tooltip } from "antd";

const ProgressBar = (props) => {
    return (
        <div className={`progress-bar ${props.prgClass || ""}`}>
            {props.traceActive && (
                <Tooltip
                    destroyTooltipOnHide
                    placement="right"
                    title={props.traceValue}
                >
                    <div
                        className="team-trace"
                        style={{ left: `${props.traceWidth}%` }}
                    ></div>
                </Tooltip>
            )}
            <div
                className={`filler ${props.fillerClass}`}
                style={{
                    width: `${props.percentage}%`,
                    backgroundColor: `${props.color}`,
                }}
            />
        </div>
    );
};

export default ProgressBar;
