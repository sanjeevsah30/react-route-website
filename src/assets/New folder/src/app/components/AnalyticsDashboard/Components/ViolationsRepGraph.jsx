import Loader from "@presentational/reusables/Loader";
import React from "react";
import BarGraph from "./BarGraph";
import EmptyDataState from "./EmptyDataState";
import LineGraph from "./LineGraph";

const ViolationsRepGraph = React.memo(
    ({
        pie_data,
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
        barData,
        loading,
        rest = {},
    }) => {
        return (
            <div className="custom__card overall__analysis__card">
                <div className="donut__chart__container">
                    <Loader loading={loading}>
                        {!pie_loading && (
                            <div className="flex column justifySpaceBetween height100p">
                                <div className="card_heading">
                                    Violation Occurrence
                                </div>
                                {barData.length ? (
                                    <BarGraph data={barData} {...rest} />
                                ) : (
                                    <>
                                        <EmptyDataState />
                                    </>
                                )}
                            </div>
                        )}
                    </Loader>
                </div>

                <div className="line__graph__container">
                    <Loader loading={graph_loading}>
                        {!graph_loading && (
                            <div className="height100p flex column">
                                <div className="flex justifySpaceBetween">
                                    <div className="card_heading marginL16">
                                        Trend
                                    </div>
                                    {/* <RenderLabels type={type} labels={labels} /> */}
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
                                        />
                                    </div>
                                ) : (
                                    <EmptyDataState />
                                )}
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

export default ViolationsRepGraph;
