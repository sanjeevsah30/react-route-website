// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/pie
import { ResponsivePie } from "@nivo/pie";
import { formatFloat } from "@tools/helpers";
import * as React from "react";

import DisplayTrend from "./DisplayTrend";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export default React.memo(
    function MyResponsivePie({ data = [], handleClick = () => {} }) {
        return (
            <ResponsivePie
                data={data}
                margin={{ top: 10, right: 0, bottom: 5 }}
                startAngle={-205}
                innerRadius={0.6}
                activeOuterRadiusOffset={4}
                enableArcLinkLabels={false}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", "2.1"]],
                }}
                className="test"
                colors={({ id, data }) => data?.color}
                enableArcLabels={false}
                arcLinkLabelsOffset={2}
                tooltip={({ datum }) => {
                    return (
                        <div className="graph__tooltip mine_shaft_cl">
                            <div className="dove_gray_cl font10 capitalize">
                                {datum.label?.toLowerCase() === "bad"
                                    ? "Need Attention"
                                    : datum.label}
                            </div>
                            <div className="top__section flex alignCenter">
                                <span className="bold600 font10">
                                    {formatFloat(datum?.value, 2)}%
                                </span>
                                {typeof datum?.data?.trend === "number" &&
                                    !!Number(datum?.data?.trend) && (
                                        <DisplayTrend
                                            trend={datum?.data?.trend}
                                        />
                                    )}
                            </div>
                        </div>
                    );
                }}
                animate={false}
                onClick={handleClick}
            />
        );
    },
    (prev, next) => prev.data === next.data
);
