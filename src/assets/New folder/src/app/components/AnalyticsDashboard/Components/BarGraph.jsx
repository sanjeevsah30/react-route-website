import React, {
    createContext,
    createElement,
    useCallback,
    useContext,
    useMemo,
} from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Tooltip } from "antd";
import { useTooltip } from "@nivo/tooltip";
import { formatFloat } from "@tools/helpers";
import DisplayTrend from "./DisplayTrend";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import useGetBarGraphManipulateFunctions from "../Hooks/useGetBarGraphManipulateFunctions";
const BarContext = createContext();

function BarGraph({
    data = [],
    tooltip_label_key = "",
    margin = {},
    is_top_five = true,
    default_keys,
    show_console,
    show_all = false,
    onClick = () => {},
    cursor_pointer,
    activeId,
    onLabelClick,
    use_color,
    hideTooltip = false,
    color_on_performance = false,
    useSuffix,
}) {
    const { getTopFive, getBottomFive, showAllData } =
        useGetBarGraphManipulateFunctions();
    return (
        <BarContext.Provider
            value={{
                onClick,
                cursor_pointer,
                show_all,
                activeId,
                onLabelClick,
                length: data.length,
                ...(useSuffix && {
                    suffix: data[0]?.suffix || "",
                }),
            }}
        >
            <ResponsiveBar
                data={
                    show_all
                        ? showAllData({ data, color_on_performance })
                        : data.length
                        ? is_top_five
                            ? getTopFive({
                                  data,
                                  keys: default_keys,
                                  use_color,
                              })
                            : getBottomFive({ data, use_color })
                        : []
                }
                keys={["average", "remmaining"]}
                colors={["#1a62f2,#f9f9f9"]}
                indexBy="id"
                margin={{ top: 28, right: 12, bottom: 43, left: 10, ...margin }}
                padding={0.2}
                s
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                layout="horizontal"
                enableGridX={true}
                enableGridY={false}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 18,
                    tickRotation: 0,
                    format: (value) =>
                        `${Number(value).toLocaleString("ru-RU", {
                            minimumFractionDigits: 0,
                        })}%`,
                    legendPosition: "middle",
                    legendOffset: 32,
                }}
                axisLeft={null}
                labelTextColor="#ffffff"
                label={(d) => {
                    return `${d.id}: ${d.value}`;
                }}
                barComponent={BarComponent}
                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fill: "#666666",
                                fontSize: "10px",
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
                    const { data } = props;

                    return hideTooltip ? (
                        <></>
                    ) : (
                        <div className="graph__tooltip mine_shaft_cl">
                            <div className="top__section flex alignCenter">
                                <span className="bold600 font12">
                                    {formatFloat(data?.average, 2)}%
                                </span>
                                {!!Number(data.change) && (
                                    <DisplayTrend trend={data.change} />
                                )}
                            </div>
                            {tooltip_label_key && (
                                <div
                                    className="font10 dove_gray_cl capitalize"
                                    style={{
                                        height: "14px",
                                    }}
                                >
                                    {data?.[tooltip_label_key].toLowerCase() ===
                                    "bad"
                                        ? "Need Attention"
                                        : data?.[tooltip_label_key]}
                                </div>
                            )}

                            <div className="tail"></div>
                        </div>
                    );
                }}
                animate={false}
            />
        </BarContext.Provider>
    );
}

const BarComponent = (props) => {
    const {
        bar: { data, ...bar },

        isInteractive,
        onClick,
        onMouseEnter,
        onMouseLeave,

        tooltip,

        isFocusable,
    } = props;

    const {
        onClick: barClick,
        cursor_pointer,
        activeId,
        onLabelClick = () => {},
        length,
        show_all,
        suffix,
    } = useContext(BarContext);
    const bg =
        data.id === "remmaining"
            ? "#f5f5f5"
            : props?.bar?.data?.data?.color || "#e5e5e5";
    // const textColor = props?.bar?.data?.data?.color ? '#ffffff' : '#666666';
    const { showTooltipFromEvent, showTooltipAt, hideTooltip } = useTooltip();

    const renderTooltip = useMemo(
        () => () => createElement(tooltip, { ...bar, ...data }),
        [tooltip, bar, data]
    );

    const handleClick = useCallback(
        (event) => {
            onClick?.({ color: bar.color, ...data }, event);
        },
        [bar, data, onClick]
    );
    const handleTooltip = useCallback(
        (event) => showTooltipFromEvent(renderTooltip(), event),
        [showTooltipFromEvent, renderTooltip]
    );
    const handleMouseEnter = useCallback(
        (event) => {
            onMouseEnter?.(data, event);
            showTooltipFromEvent(renderTooltip(), event);
        },
        [data, onMouseEnter, showTooltipFromEvent, renderTooltip]
    );
    const handleMouseLeave = useCallback(
        (event) => {
            onMouseLeave?.(data, event);
            hideTooltip();
        },
        [data, hideTooltip, onMouseLeave]
    );

    // extra handlers to allow keyboard navigation
    const handleFocus = useCallback(() => {
        showTooltipAt(renderTooltip(), [bar.absX + bar.width / 2, bar.absY]);
    }, [showTooltipAt, renderTooltip, bar]);
    const handleBlur = useCallback(() => {
        hideTooltip();
    }, [hideTooltip]);

    const height = 18;
    const width = props?.bar?.width;
    const ydisp =
        show_all && length > 5
            ? (length - props.bar.data.index - 1) * 50
            : props.bar.y + height / 2;

    return (
        <g
            transform={`translate(${props.bar.x},${ydisp})`}
            onClick={() => barClick(data?.data?.id)}
            style={
                cursor_pointer
                    ? {
                          cursor: "pointer",
                      }
                    : {}
            }
        >
            <rect
                onMouseEnter={
                    isInteractive && data.id !== "remmaining"
                        ? handleMouseEnter
                        : undefined
                }
                onMouseMove={
                    isInteractive && data.id !== "remmaining"
                        ? handleTooltip
                        : undefined
                }
                onMouseLeave={
                    isInteractive && data.id !== "remmaining"
                        ? handleMouseLeave
                        : undefined
                }
                onClick={
                    isInteractive && data.id !== "remmaining"
                        ? handleClick
                        : undefined
                }
                onFocus={
                    isInteractive && data.id !== "remmaining" && isFocusable
                        ? handleFocus
                        : undefined
                }
                onBlur={
                    isInteractive && data.id !== "remmaining" && isFocusable
                        ? handleBlur
                        : undefined
                }
                width={props?.bar?.width}
                height={height / 2}
                fill={
                    activeId === data?.data?.id && data.id !== "remmaining"
                        ? "#A8C5FF"
                        : bg
                }
                y={8}
            />

            {data.id === "average" && data?.data?.average === 100 && (
                <text
                    x={width}
                    y={0}
                    dominantBaseline="start"
                    textAnchor="end"
                    fill={"#333333"}
                    style={{
                        fontWeight: 400,
                        fontSize: 12,
                    }}
                >
                    {typeof data?.data?.change === "number" && (
                        <DisplayTrendSvg trend={data?.data?.change} />
                    )}
                    <tspan>{formatFloat(data?.data?.average, 2)}%</tspan>
                </text>
            )}
            {data.id === "average" && !data?.data?.hide && data?.data?.name && (
                <text
                    x={5}
                    y={0}
                    dominantBaseline="start"
                    textAnchor="start"
                    fill={"#333333"}
                    style={{
                        fontWeight: 400,
                        fontSize: 12,
                    }}
                >
                    <Tooltip title={data?.data?.name}>
                        <tspan
                            onClick={() => {
                                onLabelClick({
                                    id: data?.data?.id,
                                    name: data?.data?.name,
                                    checked: data?.data?.option_id,
                                    question_type: data?.data?.question_type,
                                });
                            }}
                            className="curPoint hover_text"
                        >
                            {" "}
                            {data?.data?.name?.length > 40
                                ? data?.data?.name?.substring(0, 40) + "..."
                                : data?.data?.name}
                        </tspan>
                    </Tooltip>
                </text>
            )}

            {data.id === "remmaining" && data?.data?.average !== 100 && (
                <text
                    x={width}
                    y={0}
                    dominantBaseline="start"
                    textAnchor="end"
                    fill={"#333333"}
                    style={{
                        fontWeight: 400,
                        fontSize: 12,
                    }}
                >
                    {/* {formatFloat(data?.value, 2)}% */}
                    {/* <text>Hello</text>
                        <text>Hello</text> */}
                    {typeof data?.data?.change === "number" && (
                        <DisplayTrendSvg trend={data?.data?.change} />
                    )}
                    <tspan>
                        {formatFloat(data?.data?.average, 2)}
                        {typeof suffix === "string" ? suffix : ""}
                    </tspan>
                </text>
            )}

            <></>
        </g>
    );
};

const DisplayTrendSvg = ({ trend }) => {
    return (
        <>
            {trend >= 0 ? (
                <tspan className="bold600" fill={"#52C41A"}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&#9650;
                </tspan>
            ) : (
                <tspan className="bold600" fill="#fd586b">
                    &nbsp;&nbsp;&nbsp;&nbsp;&#9660;
                </tspan>
            )}
            <tspan>
                &nbsp;{Math.abs(formatFloat(trend, 2))}%&nbsp;&nbsp;&nbsp;&nbsp;
            </tspan>
        </>
    );
};

export default React.memo(
    BarGraph,
    (prev, next) => prev.data === next.data && prev.activeId === next.activeId
);
