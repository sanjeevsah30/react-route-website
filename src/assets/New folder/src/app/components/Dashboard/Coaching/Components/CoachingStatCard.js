import { capitalizeFirstLetter, formatFloat } from "@tools/helpers";
import { Skeleton, Tooltip } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import InfoSvg from "app/static/svg/InfoSvg";
import CompletedSvg from "../Svg/CompletedSvg";

export default function CoachingStatCard({
    Svg,
    color,
    heading,
    info_text,
    value,
    tooltip_text = "",
    suffixIcon = "",
}) {
    const {
        coaching_dashboard: { tiles_loading },
    } = useSelector((state) => state);

    return (
        <div
            style={{ color }}
            className="coach__stat--card min_width_0_flex_child"
        >
            {tiles_loading ? (
                <Skeleton active paragraph={{ rows: 3 }} title={false} />
            ) : (
                <>
                    {" "}
                    <Svg />
                    <div className="min_width_0_flex_child flex column">
                        <div className="flex alignCenter justifySpaceBetween">
                            <div className="stat__heading elipse_text marginR5 ">
                                {heading}
                            </div>
                            <Tooltip
                                title={
                                    <div className="capitalize">
                                        {capitalizeFirstLetter(tooltip_text)}
                                    </div>
                                }
                            >
                                <span className="curPoint flex alignCenter">
                                    <InfoSvg />
                                </span>
                            </Tooltip>
                        </div>
                        <div
                            style={{
                                height: "34px",
                                color,
                            }}
                            className="font34 bold600 flex alignCenter"
                        >
                            <span>{`${formatFloat(
                                value,
                                2
                            )}${suffixIcon}`}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
