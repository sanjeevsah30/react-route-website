import Loader from "@presentational/reusables/Loader";
import React, { useContext, useEffect, useRef, useState } from "react";
import BarSvg from "app/static/svg/BarSvg";
import LineSvg from "app/static/svg/LineSvg";
import EmptyDataState from "./EmptyDataState";
import { Tooltip, Select } from "antd";
import Icon from "@presentational/reusables/Icon";
import InfoCircleSvg from "../../../static/svg/InfoCircleSvg";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import RenderLabels from "./RenderLabels";
import useGetBarGraphManipulateFunctions from "../Hooks/useGetBarGraphManipulateFunctions";
const { Option } = Select;
//const buttonWidth = 45;

const GraphCard = React.memo(
    ({
        heading,
        itext,
        labels = [],
        type,
        is_switch,
        is_select,
        is_info,

        Component,
        LineComponent,
        lineData,
        line_loading = false,
        barData,
        rest = {},
        loading = false,
        SelectComponent = <></>,
        line_rest = {},
        onFreqClick = () => {},
        freqData = [],
        downloadGraph,
    }) => {
        const [isLine, setIsLine] = useState(false);
        // const [defaultFreq, setDefaultFreq] = useState(false)
        // const [freqD, setFreqD] = useState(false)
        // const [freqW, setFreqW] = useState(false)
        // const [freqM, setFreqM] = useState(false)

        const ref = useRef();
        const [widthMd, setWidthMd] = useState(false);
        const { lineGraphAddColor } = useGetBarGraphManipulateFunctions();
        const line_graph_labels = lineGraphAddColor({
            data: lineData,
            ...line_rest,
        });

        useEffect(() => {
            if (ref.current) {
                const observer = new ResizeObserver((entries) => {
                    if (entries[0]?.contentRect?.width <= 500) {
                        return setWidthMd(true);
                    }
                    setWidthMd(false);
                });
                observer.observe(ref.current);
            }
        }, []);

        return (
            <Loader loading={isLine ? line_loading : loading}>
                <div ref={downloadGraph}>
                    <div
                        style={{
                            height: "400px",
                            flex: 1,
                            position: "relative",
                        }}
                        className="padding20 custom__card flex column"
                        ref={ref}
                    >
                        <div
                            className="flex alignCenter justifySpaceBetween"
                            style={{
                                marginTop: "-8px",
                            }}
                        >
                            {is_select ? (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <SelectComponent />
                                </div>
                            ) : (
                                <div className="bold600 font12">
                                    <span className="flex alignCenter">
                                        {heading}
                                        {is_info ? (
                                            <Tooltip
                                                placement="top"
                                                title={itext}
                                            >
                                                <InfoCircleSvg
                                                    style={{
                                                        transform: "scale(0.8)",
                                                        marginBottom: "2px",
                                                        marginLeft: "8px",
                                                    }}
                                                />
                                            </Tooltip>
                                        ) : (
                                            <></>
                                        )}
                                    </span>
                                </div>
                            )}
                            {is_switch &&
                                !widthMd &&
                                !!line_graph_labels?.length &&
                                isLine && (
                                    <RenderLabels
                                        labels={line_graph_labels}
                                        type={type}
                                        MAX_COUNT={is_select ? 1 : 1}
                                    />
                                )}
                            {is_switch ? (
                                <div className="flex alignCenter justifySpaceBetween">
                                    {isLine && (
                                        // <div
                                        //     className="graph__switch"
                                        //     style={{ marginRight: '10px' }}
                                        // >
                                        // </div>

                                        <Select
                                            defaultValue="Default"
                                            className="graph__dropdown bold400 font12 marginR10"
                                            suffixIcon={
                                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                                            }
                                            dropdownRender={(menu) => (
                                                <div className="mine_shaft_cl">
                                                    {/* <span
                                                    className={
                                                        'freq_label dove_gray_cl width100p font12 bold400 paddingTB9 paddingLR6'
                                                    }
                                                >
                                                    {'Select Options'}
                                                </span> */}
                                                    {menu}
                                                </div>
                                            )}
                                            dropdownClassName="freq_dropdown"
                                            // dropdownStyle={{display: "none"}}
                                            onChange={(value) =>
                                                onFreqClick(
                                                    value.toUpperCase() ===
                                                        "DEFAULT"
                                                        ? ""
                                                        : value.toUpperCase() ===
                                                          "DAILY"
                                                        ? "1D"
                                                        : value.toUpperCase() ===
                                                          "WEEKLY"
                                                        ? "1W"
                                                        : value.toUpperCase() ===
                                                          "MONTHLY"
                                                        ? "1M"
                                                        : ""
                                                )
                                            }
                                        >
                                            <Option
                                                value="default"
                                                className="option__container bold400 font12"
                                            >
                                                {" "}
                                                Default{" "}
                                            </Option>
                                            <Option
                                                value="daily"
                                                className="option__container bold400 font12"
                                            >
                                                {" "}
                                                Daily{" "}
                                            </Option>
                                            <Option
                                                value="weekly"
                                                className="option__container bold400 font12"
                                            >
                                                {" "}
                                                Weekly{" "}
                                            </Option>
                                            <Option
                                                value="monthly"
                                                className="option__container bold400 font12"
                                            >
                                                {" "}
                                                Monthly{" "}
                                            </Option>
                                        </Select>
                                    )}

                                    <div className="graph__switch">
                                        <button
                                            className={`graph__switch--btn ${
                                                !isLine ? "selected" : ""
                                            }`}
                                            onClick={() => {
                                                setIsLine(false);
                                            }}
                                        >
                                            <BarSvg />
                                        </button>
                                        <button
                                            className={`graph__switch--btn ${
                                                isLine ? "selected" : ""
                                            }`}
                                            onClick={() => {
                                                setIsLine(true);
                                            }}
                                        >
                                            <LineSvg />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                !widthMd && (
                                    <RenderLabels
                                        labels={labels}
                                        type={type}
                                        MAX_COUNT={1}
                                    />
                                )
                                // <></>
                            )}
                        </div>

                        {!(isLine ? line_loading : loading) ? (
                            isLine ? (
                                lineData?.length ? (
                                    !line_loading && (
                                        <LineComponent
                                            data={lineData}
                                            {...line_rest}
                                        />
                                    )
                                ) : (
                                    <EmptyDataState />
                                )
                            ) : barData?.length ? (
                                !loading && (
                                    <Component
                                        data={barData}
                                        type={type}
                                        {...rest}
                                        widthMd={widthMd}
                                    />
                                )
                            ) : (
                                <EmptyDataState />
                            )
                        ) : (
                            <></>
                        )}
                        {isLine ? (
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "10px",
                                }}
                                className="flex  alignCenter justifyCenter width100p"
                            >
                                <RenderLabels
                                    labels={line_graph_labels}
                                    type={type}
                                    MAX_COUNT={2}
                                    className={is_select ? "marginT6" : ""}
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </Loader>
        );
    },
    (prev, next) =>
        prev.barData === next.barData &&
        prev.loading === next.loading &&
        prev.SelectComponent === next.SelectComponent &&
        prev.line_loading === next.line_loading &&
        prev.lineData === next.lineData
);

export default GraphCard;
