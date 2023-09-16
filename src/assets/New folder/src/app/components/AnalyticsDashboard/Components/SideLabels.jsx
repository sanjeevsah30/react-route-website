import { formatFloat, numFormatter } from "@tools/helpers";
import React, { useContext } from "react";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";

const SideLabels = React.memo(
    ({ data, showTrend = false, onClick = () => {} }) => {
        const { get_dashboard_label } = useContext(HomeDashboardContext);

        return (
            <>
                {data.map(({ label, value, trend, count, color }) => (
                    <div
                        onClick={() => onClick({ id: label })}
                        key={label}
                        className={`call__summary  marginB20 ${
                            !showTrend ? "curPoint" : ""
                        }`}
                    >
                        <div
                            className="label_type"
                            style={{
                                background: color,
                            }}
                        />
                        <div className="font12 dove_gray_cl capitalize">
                            {label === "bad" ? "Need Attention" : label}{" "}
                            {!showTrend &&
                                typeof trend === "number" &&
                                trend !== 0 && (
                                    <span className="font12 dove_gray_cl">
                                        {trend >= 0 ? (
                                            <span
                                                className="bold600 marginR4"
                                                style={{ color: "#52C41A" }}
                                            >
                                                &nbsp;&nbsp;&#9650;
                                            </span>
                                        ) : (
                                            <span
                                                className="bold600 marginR4"
                                                style={{ color: "#fd586b" }}
                                            >
                                                &nbsp;&nbsp;&#9660;
                                            </span>
                                        )}
                                        <span>
                                            {Math.abs(formatFloat(trend, 2))}%
                                        </span>
                                    </span>
                                )}
                        </div>
                        <div className="flex alignCenter">
                            <span className="font16 bold600">
                                {value || 0}%
                            </span>

                            <>
                                <span className="bold600 dove_gray_cl font18 marginLR4">
                                    |
                                </span>
                                {!showTrend ? (
                                    <span>
                                        <span className="font16 bold600">
                                            {numFormatter(count)}{" "}
                                        </span>
                                        <span className="font12 bold400 dove_gray_cl">
                                            {get_dashboard_label()}
                                        </span>
                                    </span>
                                ) : (
                                    typeof trend === "number" &&
                                    trend !== 0 && (
                                        <span className="font12 dove_gray_cl">
                                            {trend > 0 ? (
                                                <span
                                                    className="bold600 marginR4"
                                                    style={{ color: "#52C41A" }}
                                                >
                                                    &nbsp;&nbsp;&#9650;
                                                </span>
                                            ) : (
                                                <span
                                                    className="bold600 marginR4"
                                                    style={{ color: "#fd586b" }}
                                                >
                                                    &nbsp;&nbsp;&#9660;
                                                </span>
                                            )}
                                            <span>
                                                {Math.abs(
                                                    formatFloat(trend, 2)
                                                )}
                                                %
                                            </span>
                                        </span>
                                    )
                                )}
                            </>
                        </div>
                    </div>
                ))}
            </>
        );
    },
    (prev, next) => prev.data === next.data
);
export default SideLabels;
