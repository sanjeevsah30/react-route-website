import React, {
    createContext,
    createElement,
    useCallback,
    useContext,
    useMemo,
} from "react";
// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { Tooltip } from "antd";
import {
    capitalizeFirstLetter,
    formatFloat,
    StringToColor,
} from "@tools/helpers";
import DisplayTrend from "./DisplayTrend";
import { useTooltip } from "@nivo/tooltip";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import useGetBarGraphManipulateFunctions from "../Hooks/useGetBarGraphManipulateFunctions";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const BarContext = createContext();
const HorizontalStackedBarGraph = ({
    data,
    colors,
    keys = [],
    mode = "horizontal",
    default_keys,
    show_all = false,
    type,
    widthMd,
    onClick,
    cursor_pointer,
    first_key,
    onLabelClick,
    barClick = () => {},
}) => {
    const { get_dashboard_label } = useContext(HomeDashboardContext);

    const { getTopFive, showAllData } = useGetBarGraphManipulateFunctions();
    //widthMd if card size is less than 500 then it will be true else it will be false. We use the resizeobserever to get width of the card
    return (
        <BarContext.Provider
            value={{
                onClick,
                cursor_pointer,
                first_key,
                barClick,
                onLabelClick,
                length: data.length,
                show_all,
            }}
        >
            <ResponsiveBar
                data={
                    show_all
                        ? showAllData({ data })
                        : getTopFive({ data, keys: default_keys })
                }
                xScale={{
                    type: "linear",
                    min: 0,
                    max: 100,
                }}
                keys={keys}
                colors={colors}
                indexBy="id"
                padding={0.3}
                layout={mode}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                margin={
                    widthMd
                        ? { top: 16, right: 12, bottom: 58, left: 10 }
                        : { top: 28, right: 12, bottom: 43, left: 10 }
                }
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
                // axisLeft={{
                //     tickSize: 0,
                //     tickPadding: 8,
                //     tickRotation: 0,

                //     legendPosition: 'middle',
                //     legendOffset: -40,

                //     format: (value) => {
                //         const team = data.find(({ id }) => id === value) || {};
                //         const { name, hide } = team;
                //         return hide ? (
                //             <></>
                //         ) : (
                //             <Tooltip title={name}>
                //                 <tspan className="curPoint">
                //                     {' '}
                //                     {name?.length > 5
                //                         ? name?.substring(0, 5) + '..'
                //                         : name}
                //                 </tspan>
                //             </Tooltip>
                //         );
                //     },
                // }}
                axisLeft={null}
                labelTextColor="#ffffff"
                label={(d) =>
                    d.value >= 15 ? `${formatFloat(d.value, 2)}%` : <></>
                }
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
                    const { data, id } = props;
                    const trend = id + "_change";

                    return (
                        <div className="graph__tooltip mine_shaft_cl">
                            <div className="top__section flex alignCenter">
                                <span className="bold600 font12">
                                    {formatFloat(data?.[id], 2)}%
                                </span>
                                {typeof data[trend] === "number" && (
                                    <DisplayTrend trend={data?.[trend]} />
                                )}
                            </div>
                            <div
                                className="font10 dove_gray_cl"
                                style={{
                                    height: "14px",
                                }}
                            >
                                {id.includes("<")
                                    ? capitalizeFirstLetter(id.split("<")?.[0])
                                    : id?.toLowerCase() === "bad"
                                    ? "Need Attention"
                                    : capitalizeFirstLetter(id)}{" "}
                                {type || get_dashboard_label()}
                            </div>
                            <div className="tail"></div>
                        </div>
                    );
                }}
                animate={false}
                barComponent={BarComponent}
            />
        </BarContext.Provider>
    );
};

HorizontalStackedBarGraph.defaultProps = {
    colors: ["#76B95C", "#ECA51D", " #FF6365"],
};

export default React.memo(
    HorizontalStackedBarGraph,
    (prev, next) => prev.data === next.data
);

const BarComponent = React.memo(
    (props) => {
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
            onClick: barClick = () => {},
            cursor_pointer,
            first_key,
            onLabelClick = () => {},
            length,
            show_all,
        } = useContext(BarContext);

        const bg =
            data.id === "remmaining"
                ? "#f5f5f5"
                : props?.bar?.data?.data?.color || "#e5e5e5";
        // const textColor = props?.bar?.data?.data?.color ? '#ffffff' : '#666666';

        const { showTooltipFromEvent, showTooltipAt, hideTooltip } =
            useTooltip();

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
            showTooltipAt(renderTooltip(), [
                bar.absX + bar.width / 2,
                bar.absY,
            ]);
        }, [showTooltipAt, renderTooltip, bar]);
        const handleBlur = useCallback(() => {
            hideTooltip();
        }, [hideTooltip]);

        const height = 18;
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
                        first_key
                            ? StringToColor?.next(data.id.split("<")?.[0])
                            : props?.bar?.color
                    }
                />

                {(data.id === "good" ||
                    data.id === "hot" ||
                    data.id === first_key) &&
                    !data?.data?.hide &&
                    data?.data?.name && (
                        <text
                            x={5}
                            y={-8}
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
                                    className="curPoint hover_text"
                                    onClick={() =>
                                        onLabelClick({
                                            id: data?.data?.id,
                                            name: data?.data?.name,
                                            checked: data?.data?.option_id,
                                            question_type:
                                                data?.data?.question_type,
                                        })
                                    }
                                >
                                    {" "}
                                    {data?.data?.name?.length > 40
                                        ? data?.data?.name?.substring(0, 40) +
                                          "..."
                                        : data?.data?.name}
                                </tspan>
                            </Tooltip>
                        </text>
                    )}

                <></>
            </g>
        );
    },
    (prev, next) => false
);
