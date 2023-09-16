// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/line
import { ResponsiveLine } from "@nivo/line";
import { formatFloat } from "@tools/helpers";
import { useContext } from "react";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import useGetBarGraphManipulateFunctions from "../Hooks/useGetBarGraphManipulateFunctions";
import DisplayTrend from "./DisplayTrend";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export default function LineGraph({
    data = [],
    show_all,
    is_top_five,
    generate_color = true,
    margin = {},
    color_on_performance,
    type = "",
}) {
    const { get_dashboard_label } = useContext(HomeDashboardContext);
    const { lineGraphAddColor } = useGetBarGraphManipulateFunctions();
    return (
        <ResponsiveLine
            yScale={{ type: "linear", min: 0, max: 100 }}
            xScale={{
                type: "point",
                // format: '%Y-%m-%d %H:%M',
            }}
            useMesh={true}
            axisBottom={{
                // format: '%b %d',
                tickRotation: 90,
                tickSize: 0,
                tickPadding: 8,
            }}
            data={
                generate_color
                    ? lineGraphAddColor({
                          data,
                          show_all,
                          is_top_five,
                      })
                    : data
            }
            margin={{ top: 26, right: 12, bottom: 80, left: 40, ...margin }}
            padding={0.3}
            curve={"monotoneX"}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            layout="horizontal"
            enableGridX={true}
            enableGridY={true}
            axisTop={null}
            axisRight={null}
            colors={{ datum: "color" }}
            axisLeft={{
                tickSize: 0,
                tickPadding: 8,
                tickRotation: 0,

                format: (value) =>
                    `${Number(value).toLocaleString("ru-RU", {
                        minimumFractionDigits: 0,
                    })}%`,
            }}
            labelTextColor="#ffffff"
            label={(d) => `${d.value}%`}
            theme={{
                axis: {
                    ticks: {
                        text: {
                            fill: "#666666",
                            fontSize: "10px",
                            fontWeight: "400",
                        },
                    },
                    domain: {
                        line: {
                            stroke: "#99999933",
                            strokeWidth: 1,
                        },
                    },
                },
                grid: {
                    line: {
                        stroke: "#99999933",
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                    },
                },
            }}
            tooltip={(props) => {
                const { data, serieId } = props.point;

                return (
                    <div className="graph__tooltip mine_shaft_cl">
                        <div className="top__section flex alignCenter">
                            <span className="bold600 font12">
                                {formatFloat(data?.y, 2)}%
                            </span>
                            {typeof data?.trend === "number" &&
                                !!Number(data?.trend) && (
                                    <DisplayTrend trend={data.trend} />
                                )}
                        </div>

                        <div
                            className="font10 dove_gray_cl capitalize"
                            style={{
                                height: "auto",
                            }}
                        >
                            {typeof serieId === "number" ? (
                                data?.name
                            ) : (
                                <>
                                    {serieId === "bad"
                                        ? "Need Attention"
                                        : serieId}{" "}
                                    {type || get_dashboard_label()}
                                </>
                            )}
                        </div>

                        <div className="tail"></div>
                    </div>
                );
            }}
            animate={false}
        />
    );
}
