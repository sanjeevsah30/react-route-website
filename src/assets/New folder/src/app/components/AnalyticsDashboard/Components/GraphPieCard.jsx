import Loader from "@presentational/reusables/Loader";
import React from "react";
import DonutChart from "./DonutChart";
import EmptyDataState from "./EmptyDataState";
import SideLabels from "./SideLabels";

const GraphPieCard = React.memo(
    ({
        heading,
        labels = [],
        type,
        is_switch,
        is_select,
        Component,
        LineComponent,
        data,
        rest = {},
        loading = false,
        select_data,
        selectAction = () => {},
        selectVal,
        downloadGraph,
    }) => {
        return (
            <Loader loading={loading}>
                {!loading && (
                    <div
                        style={{
                            height: "400px",
                            flex: 1,
                        }}
                        className="padding20 custom__card flex column posRel"
                        ref={downloadGraph}
                    >
                        <div className="flex alignCenter justifySpaceBetween flexShrink ">
                            <div className="bold600 font12">{heading}</div>
                        </div>
                        {isDonutDataEmpty(data, ["hot", "warm", "cold"]) ? (
                            <EmptyDataState />
                        ) : (
                            <div className="flex1 flex row">
                                <div
                                    style={{
                                        height: "260px",
                                    }}
                                    className="flex1 flex alignCenter justifySpaceBetween marginT20"
                                >
                                    <DonutChart data={data} />
                                </div>
                                <div className="flex column justifyCenter">
                                    <SideLabels data={data} showTrend={true} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Loader>
        );
    },
    (prev, next) => prev.data === next.data && prev.loading === next.loading
);

const isDonutDataEmpty = (data = [], keys = []) => {
    for (let { value } of data) {
        if (value) {
            return false;
        }
    }
    return true;
};

export default GraphPieCard;
