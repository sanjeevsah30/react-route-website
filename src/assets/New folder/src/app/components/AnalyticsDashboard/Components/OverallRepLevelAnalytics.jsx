import dashboardConfig from "@constants/Dashboard/index";
import { getRepAverageData } from "@store/dashboard/dashboard";
import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import exportAsImage from "utils/exportAsImage";
import {
    dashboardRoutes,
    report_types,
} from "../Constants/dashboard.constants";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import useGetDashboardPayload from "../Hooks/useGetDashboardPayload";
import BarGraph from "./BarGraph";
import GraphCard from "./GraphCard";
import LineGraph from "./LineGraph";
import SectionHeader from "./SectionHeader";

const RATIO = 0.2;

export default React.memo(
    function OverallRepLevelAnalytics({ showSeeDetails = true }) {
        const repLevelAnalytics1 = useRef();
        const repLevelAnalytics2 = useRef();
        const repLevelAnalytics3 = useRef();

        const history = useHistory();

        const dispatch = useDispatch();

        const { getDashboardPayload } = useGetDashboardPayload();

        const { applyRepFilter, filtersVisible } =
            useContext(HomeDashboardContext);

        const {
            common: { teams },
            dashboard: {
                loaders,
                templates_data: { template_active },

                rep_data: {
                    rep_avg_data,
                    rep_avg_graph_data,
                    can_be_best_avg_data,
                    can_be_best_avg_graph_data,
                },
            },
        } = useSelector((state) => state);

        const freqGetRepAverageData = (freq) => {
            const payload = getDashboardPayload();
            const newPayload = freq ? { ...payload, freq: freq } : payload;
            const newPayload1 = { ...newPayload, is_line_graph: true };
            dispatch(getRepAverageData(newPayload1));
        };

        const { colors } = dashboardConfig;

        useEffect(() => {
            if (filtersVisible) return;
            if (template_active === undefined || !teams.length) return;

            const payload = getDashboardPayload();
            let api8, api9;
            api8 = dispatch(getRepAverageData(payload));
            api9 = dispatch(
                getRepAverageData({ ...payload, is_line_graph: true })
            );

            return () => {
                api8?.abort();
                api9?.abort();
            };
        }, [getDashboardPayload, template_active, teams]);

        return (
            <div className="team__level__analytics marginTB16">
                <SectionHeader
                    title="Team Level Analytics"
                    duration="Last 30 days"
                    showSeeDetails={showSeeDetails}
                    report_type={report_types.rep_details}
                    seeDetailsClick={() => history.push(dashboardRoutes.team)}
                    to={dashboardRoutes.team}
                    downloadGraph={() => {
                        exportAsImage(
                            repLevelAnalytics1.current,
                            "rep_level_top_performing"
                        );
                        exportAsImage(
                            repLevelAnalytics2.current,
                            "rep_level_need_attention"
                        );
                        exportAsImage(
                            repLevelAnalytics3.current,
                            "rep_level_can_be_best_performer"
                        );
                    }}
                />
                <div
                    className="cards_container"
                    style={{
                        gap: "16px",
                    }}
                >
                    {/* Top 20% */}

                    <GraphCard
                        heading={"Top Performing"}
                        itext={"Top 20% of all reps"}
                        downloadGraph={repLevelAnalytics1}
                        is_info={true}
                        Component={BarGraph}
                        LineComponent={LineGraph}
                        is_switch={true}
                        barData={rep_avg_data?.slice(
                            0,
                            Math.ceil(rep_avg_data.length * RATIO)
                        )}
                        lineData={rep_avg_graph_data?.slice(
                            0,
                            Math.ceil(rep_avg_data.length * RATIO)
                        )}
                        loading={loaders.rep_average_loading}
                        line_loading={loaders.rep_average_graph_loading}
                        rest={{
                            tooltip_label_key: "team",
                            onLabelClick: applyRepFilter,
                            use_color: colors.good_cl,
                        }}
                        onFreqClick={freqGetRepAverageData}
                        // freqData={[defaultFreqRep, freqDRep, freqWRep, freqMRep]}
                    />

                    <GraphCard
                        heading={"Need Attention"}
                        itext={"Bottom 20% of all reps"}
                        downloadGraph={repLevelAnalytics2}
                        is_info={true}
                        Component={BarGraph}
                        LineComponent={LineGraph}
                        is_switch={true}
                        barData={
                            rep_avg_data.length === 1
                                ? []
                                : rep_avg_data?.slice(
                                      rep_avg_data.length -
                                          Math.ceil(rep_avg_data.length * RATIO)
                                  )
                        }
                        lineData={rep_avg_graph_data?.slice(
                            rep_avg_data.length -
                                Math.ceil(rep_avg_data.length * RATIO)
                        )}
                        loading={loaders.rep_average_loading}
                        line_loading={loaders.rep_average_graph_loading}
                        rest={{
                            is_top_five: false,
                            tooltip_label_key: "team",
                            onLabelClick: applyRepFilter,
                            use_color: colors.bad_cl,
                        }}
                        line_rest={{
                            is_top_five: false,
                        }}
                        onFreqClick={freqGetRepAverageData}
                        // freqData={[defaultFreqRep, freqDRep, freqWRep, freqMRep]}
                    />

                    {/* Remaining 60%*/}

                    <GraphCard
                        heading={"Can be best Performer"}
                        itext={"Remaining 60 % of all reps"}
                        downloadGraph={repLevelAnalytics3}
                        is_info={true}
                        Component={BarGraph}
                        LineComponent={LineGraph}
                        is_switch={true}
                        barData={can_be_best_avg_data}
                        lineData={can_be_best_avg_graph_data}
                        loading={loaders.rep_average_loading}
                        line_loading={loaders.rep_average_graph_loading}
                        rest={{
                            tooltip_label_key: "team",
                            onLabelClick: applyRepFilter,
                            use_color: colors.avg_cl,
                        }}
                        onFreqClick={freqGetRepAverageData}
                    />
                </div>
            </div>
        );
    },
    () => true
);
