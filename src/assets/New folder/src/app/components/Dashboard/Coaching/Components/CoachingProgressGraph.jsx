import Icon from "@presentational/reusables/Icon";
import { getCompletionGraph } from "@store/coaching/coaching.store";
import { Select, Skeleton } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyDataState from "app/components/AnalyticsDashboard/Components/EmptyDataState";
import LineGraph from "../../../AnalyticsDashboard/Components/LineGraph";

const { Option } = Select;
const CoachingProgressGraph = ({
    custom_width = 0,
    custom_height,
    height,
    payload,
}) => {
    const line_rest = { generate_color: false };
    const [defaultFreq, setDefaultFreq] = useState("default");

    const graph_loading = false;

    const dispatch = useDispatch();

    const {
        coaching_dashboard: { completionGraph_data, completionGraph_loading },
        common: { filterDates, filterTeams, filterReps },
    } = useSelector((state) => state);

    useEffect(() => {
        payload.freq =
            defaultFreq.toUpperCase() === "DEFAULT"
                ? null
                : defaultFreq.toUpperCase() === "DAILY"
                ? "1D"
                : defaultFreq.toUpperCase() === "WEEKLY"
                ? "1W"
                : defaultFreq.toUpperCase() === "MONTHLY"
                ? "1M"
                : "";
        dispatch(getCompletionGraph(payload));
    }, [
        defaultFreq,
        filterDates.active,
        filterTeams.active,
        filterReps.active,
    ]);

    return (
        <div
            className="graph_container"
            style={{
                height: `${height}px`,
                flex: "6",
            }}
        >
            {completionGraph_loading ? (
                <Skeleton active paragraph={{ rows: 10 }} title={false} />
            ) : (
                <div className="height100p flex column">
                    <div className="flex alignCneter justifySpaceBetween">
                        <div className="bold600 font16">Coaching Progress</div>
                        <div className="select_container">
                            <Select
                                value={defaultFreq}
                                className="graph__dropdown bold400 font12 marginL10"
                                suffixIcon={
                                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                                }
                                dropdownRender={(menu) => (
                                    <div className="mine_shaft_cl">{menu}</div>
                                )}
                                dropdownClassName="freq_lable"
                                onChange={(value) => {
                                    setDefaultFreq(value);
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
                    {completionGraph_data?.length ? (
                        <div
                            style={{
                                height: "100%",
                                paddingTop: "10px",
                            }}
                            className="flex1"
                        >
                            <LineGraph
                                data={completionGraph_data}
                                {...line_rest}
                                type="Completion Rate"
                            />
                        </div>
                    ) : (
                        <EmptyDataState />
                    )}
                </div>
            )}
        </div>
    );
};

export default CoachingProgressGraph;
