import ProgressSvg from "@presentational/reusables/ProgressSvg";

import React from "react";
import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import ReportPercentage from "../../Audit Report/ReportPercentage";

function CallOverviewStats({
    percentage,
    color,
    stroke,
    type,
    text,
    onClick,
    change,
}) {
    return (
        <div
            onClick={onClick}
            className="attr_card progress_container padding24 curPoint"
        >
            <div className="flex alignCenter">
                <ProgressSvg
                    percentage={percentage}
                    color={color}
                    stroke={stroke}
                    strokeWidth={12}
                    circleSize={140}
                />
                <div className="flex1 text-center bold700 mine_shaft_cl font16">
                    {type}
                </div>
            </div>
            <div className="marginT14 flex">
                <div className="font14 maxWidth16 dove_gray_cl">{text}</div>

                <div className="right_arrow flex alignCenter justifyCenter stats">
                    <ChevronRightSvg
                        style={{
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    />
                </div>
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                }}
            >
                <ReportPercentage change={change} />
            </div>
        </div>
    );
}

export default CallOverviewStats;
