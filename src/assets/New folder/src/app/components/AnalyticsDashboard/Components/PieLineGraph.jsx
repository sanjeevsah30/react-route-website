import Loader from "@presentational/reusables/Loader";
import { formatFloat } from "@tools/helpers";
import React, { useContext } from "react";
import { Select } from "antd";
import { useSelector } from "react-redux";
import LineGraph from "./LineGraph";
import { useState } from "react";
import Icon from "@presentational/reusables/Icon";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import DonutChart from "./DonutChart";
import EmptyDataState from "./EmptyDataState";
import SideLabels from "./SideLabels";
import RenderLabels from "./RenderLabels";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";
const { Option } = Select;

const PieLineGraph = React.memo(
    ({
        pie_data,
        calls_data,
        graph_loading,
        pie_loading,
        graph_data,
        type,
        labels,
        hideSummary = true,
        showTrend = false,
        line_rest = { generate_color: false },
        summary_text = "",
        onPieClick,
        overall_average,
        onFreqClick,
        overAllGraph,
        trendGraph,
    }) => {
        const { get_dashboard_label } = useContext(HomeDashboardContext);
        const { meetingType } = useContext(HomeContext);
        // merge fixed
        // const [defaultFreq, setDefaultFreq] = useState(false);
        // const [freqD, setFreqD] = useState(false);
        // const [freqW, setFreqW] = useState(false);
        // const [freqM, setFreqM] = useState(false);

        const [defaultFreq, setDefaultFreq] = useState("Default");

        const {
            common: { filterTeams },
            callAudit: { isManual, isAccountLevel },
            dashboard: {
                dashboard_filters: { audit_filter },
            },
        } = useSelector((state) => state);
        function numFormatter(num) {
            if (num > 999 && num < 1000000) {
                return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
            } else if (num > 1000000) {
                return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
            } else if (num < 999) {
                return num; // if value < 1000, nothing to do
            }
        }

        const {
            common: {
                versionData: { stats_threshold },
            },
        } = useSelector((state) => state);

        return (
            <div className="custom__card overall__analysis__card">
                <div className="donut__chart__container" ref={overAllGraph}>
                    <Loader loading={pie_loading} row_count={8}>
                        {!pie_loading && (
                            <div className="flex column justifySpaceBetween height100p">
                                <div className="card_heading">Composition</div>
                                {isDonutDataEmpty(pie_data) ? (
                                    <EmptyDataState />
                                ) : (
                                    <>
                                        {hideSummary || (
                                            <div className="flex alignStart">
                                                {!isAccountLevel &&
                                                    meetingType !==
                                                        MeetingTypeConst.chat && (
                                                        <div className="summary marginT10 marginR10">
                                                            <div className="font12 dove_gray_cl">
                                                                Dialed{" "}
                                                                {get_dashboard_label()}
                                                            </div>
                                                            <div className="bold600 font16 mine_shaft_cl summary_value">
                                                                {numFormatter(
                                                                    calls_data?.all_calls
                                                                )}{" "}
                                                            </div>
                                                        </div>
                                                    )}
                                                {!isAccountLevel && (
                                                    <div className="summary marginT10 marginR10">
                                                        <div className="font12 dove_gray_cl">
                                                            Connected{" "}
                                                            {get_dashboard_label()}
                                                        </div>
                                                        <div className="bold600 font16 mine_shaft_cl summary_value">
                                                            {numFormatter(
                                                                calls_data?.connected_calls
                                                            )}{" "}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="summary marginT10 marginR10">
                                                    <div className="font12 dove_gray_cl">
                                                        {isAccountLevel
                                                            ? "Total Accounts Count"
                                                            : `Analysed ${get_dashboard_label()}`}
                                                    </div>
                                                    <div className="bold600 font16 mine_shaft_cl summary_value">
                                                        {numFormatter(
                                                            pie_data?.reduce(
                                                                (sum, item) =>
                                                                    sum +
                                                                    item.count,
                                                                0
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="summary marginT10 marginR10">
                                                    <div className="font12 dove_gray_cl">
                                                        Overall Summary
                                                    </div>
                                                    <div
                                                        className={`font16 ${
                                                            overall_average >=
                                                            stats_threshold.good
                                                                ? "lima_cl"
                                                                : overall_average >=
                                                                  stats_threshold.average
                                                                ? "average_orng_cl"
                                                                : "bitter_sweet_cl"
                                                        }  bold600 summary_value`}
                                                    >
                                                        {overall_average >=
                                                        stats_threshold.good
                                                            ? "Good"
                                                            : overall_average >=
                                                              stats_threshold.average
                                                            ? "Average"
                                                            : "Need Attention"}
                                                    </div>
                                                </div>
                                                {!!filterTeams.active && (
                                                    <div className="summary marginT10 marginR10">
                                                        <div className="font12 dove_gray_cl">
                                                            {audit_filter?.audit_type ===
                                                            "Manual Audit"
                                                                ? `Manual Score${" "}`
                                                                : `AI Score${" "}`}
                                                        </div>
                                                        <div
                                                            className={`font16 ${
                                                                overall_average >=
                                                                stats_threshold.good
                                                                    ? "lima_cl"
                                                                    : overall_average >=
                                                                      stats_threshold.average
                                                                    ? "average_orng_cl"
                                                                    : "bitter_sweet_cl"
                                                            }  bold600 summary_value`}
                                                        >
                                                            {formatFloat(
                                                                overall_average,
                                                                2
                                                            )}
                                                            %
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div
                                            className={`flex1 flex height100p justifyCenter paddingR30 ${
                                                hideSummary
                                                    ? "alignCenter"
                                                    : "marginT20"
                                            }`}
                                        >
                                            <div className="pie_chart_dimmension">
                                                <DonutChart
                                                    data={pie_data}
                                                    handleClick={onPieClick}
                                                />
                                            </div>
                                            <div className="flex column justifyCenter">
                                                <SideLabels
                                                    data={pie_data}
                                                    showTrend={showTrend}
                                                    onClick={onPieClick}
                                                />
                                            </div>
                                        </div>

                                        {/* {!showTrend && (
                                        <div className="call__summary__container">
                                            <SideLabels
                                                data={pie_data}
                                                showTrend={false}
                                            />
                                        </div>
                                    )} */}
                                    </>
                                )}
                            </div>
                        )}
                    </Loader>
                </div>

                <div className="line__graph__container" ref={trendGraph}>
                    <Loader loading={graph_loading} row_count={8}>
                        {!graph_loading && (
                            <div className="height100p flex column">
                                <div className="flex justifySpaceBetween">
                                    <div className="card_heading marginL16">
                                        Trend
                                    </div>
                                    <div className="flex justifySpaceBetween">
                                        {/* <RenderLabels
                                            type={type}
                                            labels={labels}
                                        /> */}
                                        {/* <div
                                            className="graph__switch"
                                            // style={{ marginLeft: '10px',}}
                                        >
                                        </div> */}
                                        <Select
                                            defaultValue={defaultFreq}
                                            className="graph__dropdown bold400 font12 marginL10"
                                            suffixIcon={
                                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                                            }
                                            // defaultOpen={true}
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
                                            dropdownClassName="freq_lable"
                                            onChange={(value) => {
                                                setDefaultFreq(value);
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
                                                );
                                            }}
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
                                    </div>
                                </div>

                                {graph_data?.length ? (
                                    <div
                                        style={{
                                            height: "386px",
                                        }}
                                        className="flex1 paddingL18"
                                    >
                                        <LineGraph
                                            data={graph_data}
                                            {...line_rest}
                                            type={true}
                                        />
                                    </div>
                                ) : (
                                    <EmptyDataState />
                                )}
                                <div className="flex alignCenter justifyCenter">
                                    <RenderLabels
                                        type={type}
                                        labels={labels}
                                        MAX_COUNT={4}
                                    />
                                    {/* <div
                                            className="graph__switch"
                                            // style={{ marginLeft: '10px',}}
                                        >
                                        </div> */}
                                </div>
                            </div>
                        )}
                    </Loader>
                </div>
            </div>
        );
    },
    (prev, next) => {
        return (
            prev.pie_loading === next.pie_loading &&
            prev.pie_data === next.pie_data &&
            prev.graph_loading === next.graph_loading &&
            prev.graph_data === next.graph_data
        );
    }
);

const isDonutDataEmpty = (data = [], keys = []) => {
    for (let { value } of data) {
        if (value) {
            return false;
        }
    }
    return true;
};

export default PieLineGraph;
