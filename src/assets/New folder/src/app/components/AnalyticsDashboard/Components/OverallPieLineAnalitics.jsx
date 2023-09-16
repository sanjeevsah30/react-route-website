import {
    getOverallGraphData,
    getOverallPieData,
} from "@store/dashboard/dashboard";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import exportAsImage from "utils/exportAsImage";
import { report_types } from "../Constants/dashboard.constants";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import useGetDashboardPayload from "../Hooks/useGetDashboardPayload";
import useSetAiFiltersForDashboard from "../Hooks/useSetAiFiltersForDashboard";
import PieLineGraph from "./PieLineGraph";
import SectionHeader from "./SectionHeader";

export default React.memo(
    function OverallPieLineAnalitics() {
        const overAllGraph = useRef();
        const trendGraph = useRef();

        const {
            dashboard: {
                loaders,
                overall_data: {
                    pie_data,
                    graph_data,
                    overall_average,
                    calls_data,
                },
                templates_data: { template_active },
            },
            common: { teams },
        } = useSelector((state) => state);

        const dispatch = useDispatch();

        const { getDashboardPayload } = useGetDashboardPayload();
        const { applyAiFilter } = useSetAiFiltersForDashboard();
        const { get_dashboard_label, labelsBasedOnThreshold, filtersVisible } =
            useContext(HomeDashboardContext);

        const freqGetOverallGraphData = useCallback(
            (freq) => {
                const payload = getDashboardPayload();
                const tempPayload = freq ? { ...payload, freq: freq } : payload;
                const newPayload = { ...tempPayload, is_line_graph: true };
                dispatch(getOverallGraphData(newPayload));
            },
            [getDashboardPayload]
        );

        useEffect(() => {
            if (filtersVisible) {
                return;
            }
            let api1;
            let api2;
            const payload = getDashboardPayload();
            if (template_active !== undefined && teams.length) {
                api1 = dispatch(getOverallPieData(payload));
                api2 = dispatch(getOverallGraphData(payload));
            }
            return () => {
                api1?.abort();
                api2?.abort();
            };
        }, [template_active, getDashboardPayload, teams]);

        return (
            <>
                <SectionHeader
                    title="Overall Analytics"
                    report_type={report_types.default}
                    downloadGraph={() => {
                        exportAsImage(overAllGraph?.current, "Overall_Graph");
                        exportAsImage(
                            trendGraph.current,
                            "Overall_Trend_Graph"
                        );
                    }}
                />
                <div>
                    <PieLineGraph
                        overAllGraph={overAllGraph}
                        trendGraph={trendGraph}
                        pie_data={pie_data}
                        calls_data={calls_data}
                        graph_loading={loaders.overall_data_graph_loading}
                        pie_loading={loaders.overall_data_pie_loading}
                        graph_data={graph_data}
                        type={get_dashboard_label()}
                        labels={labelsBasedOnThreshold}
                        line_rest={{
                            generate_color: false,
                        }}
                        hideSummary={typeof overall_average !== "number"}
                        showTrend={false}
                        overall_average={overall_average}
                        onPieClick={applyAiFilter}
                        onFreqClick={freqGetOverallGraphData}
                    />
                </div>
            </>
        );
    },
    () => true
);
