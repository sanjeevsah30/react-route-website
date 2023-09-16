import {
    getTeamAverageData,
    getTeamComparisonData,
    getTeamCompositionData,
} from "@store/dashboard/dashboard";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
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
import HorizontalStackedBarGraph from "./HorizontalStackedBarGraph";
import LineGraph from "./LineGraph";
import SectionHeader from "./SectionHeader";

export default React.memo(
    function OverallTeamLevelAnalytics({ showSeeDetails = true }) {
        const teamLevelAnalytics1 = useRef();
        const teamLevelAnalytics2 = useRef();
        const teamLevelAnalytics3 = useRef();
        const {
            common: { filterTeams, filterReps, teams },
            callAudit: { isAccountLevel },
            dashboard: {
                loaders,
                templates_data: { template_active },

                team_data: {
                    team_avg_data,

                    team_avg_graph_data,

                    team_composition_data,
                    team_comparison_data,
                },
            },
        } = useSelector((state) => state);

        const history = useHistory();
        const dispatch = useDispatch();
        const {
            get_dashboard_label,
            labelsBasedOnThreshold,
            applyTeamFilter,
            filtersVisible,
        } = useContext(HomeDashboardContext);
        const { getDashboardPayload } = useGetDashboardPayload();

        const getNewPayload = (freq) => {
            const payload = getDashboardPayload();
            const tempPayload = freq ? { ...payload, freq: freq } : payload;
            return { ...tempPayload, is_line_graph: true };
        };

        const freqGetTeamCompositionData = useCallback(
            (freq) => {
                dispatch(getTeamCompositionData(getNewPayload()));
            },
            [getDashboardPayload]
        );

        const freqGetTeamAverageData = (freq) => {
            dispatch(getTeamAverageData(getNewPayload()));
        };

        useEffect(() => {
            if (filtersVisible) return;
            if (template_active === undefined || !teams.length) return;
            let api3, api4, api5, api6;

            const payload = getDashboardPayload();
            api3 = dispatch(getTeamAverageData(payload));
            api4 = dispatch(
                getTeamAverageData({ ...payload, is_line_graph: true })
            );

            api5 = dispatch(getTeamCompositionData(payload));

            api6 = dispatch(getTeamComparisonData(payload));

            return () => {
                api3?.abort();
                api4?.abort();
                api5?.abort();
                api6?.abort();
            };
        }, [getDashboardPayload, template_active, teams]);

        return filterTeams.active?.length === 1 || filterReps.active.length ? (
            <></>
        ) : (
            <div className="team__level__analytics marginTB16">
                <SectionHeader
                    title="Multi Team Level Analytics"
                    duration="Last 30 days"
                    showSeeDetails={showSeeDetails}
                    seeDetailsClick={() =>
                        history.push(dashboardRoutes.multiTeam)
                    }
                    to={dashboardRoutes.multiTeam}
                    report_type={report_types.team_details}
                    downloadGraph={() => {
                        exportAsImage(
                            teamLevelAnalytics1.current,
                            "team_level_top_performing"
                        );
                        exportAsImage(
                            teamLevelAnalytics2.current,
                            "team_level_need_attention"
                        );
                        exportAsImage(
                            teamLevelAnalytics3.current,
                            "team_level_can_be_best_performer"
                        );
                    }}
                />
                <div
                    // className="flex alignCenter"

                    className="cards_container"
                >
                    <GraphCard
                        heading={"Average Score"}
                        itext={
                            "Average obtained by each team across selected time range"
                        }
                        downloadGraph={teamLevelAnalytics1}
                        is_info={true}
                        type={get_dashboard_label()}
                        Component={BarGraph}
                        LineComponent={LineGraph}
                        is_switch={true}
                        rest={{
                            onLabelClick: applyTeamFilter,
                        }}
                        barData={team_avg_data}
                        lineData={team_avg_graph_data}
                        loading={loaders.team_average_loading}
                        line_loading={loaders.team_average_graph_loading}
                        onFreqClick={freqGetTeamAverageData}
                        // freqData={[defaultFreqTeam, freqDTeam, freqWTeam, freqMTeam]}
                    />

                    <GraphCard
                        heading={
                            isAccountLevel
                                ? "Acc. Composition"
                                : `${get_dashboard_label()} Composition`
                        }
                        itext={`Distribution of type of ${get_dashboard_label()} in a specific team`}
                        downloadGraph={teamLevelAnalytics2}
                        is_info={true}
                        type={get_dashboard_label()}
                        labels={labelsBasedOnThreshold}
                        Component={HorizontalStackedBarGraph}
                        barData={team_composition_data}
                        loading={loaders.team_composition_loading}
                        rest={{
                            keys: ["good", "average", "bad"],
                            dummy_keys: {
                                good: 0,
                                average: 0,
                                bad: 0,
                            },
                            onLabelClick: applyTeamFilter,
                        }}
                    />
                    <GraphCard
                        heading={"Rep Composition"}
                        itext={`Distribution of type of ${get_dashboard_label()} for reps`}
                        downloadGraph={teamLevelAnalytics3}
                        is_info={true}
                        type={"Rep"}
                        Component={HorizontalStackedBarGraph}
                        barData={team_comparison_data}
                        labels={labelsBasedOnThreshold}
                        loading={loaders.team_comparison_loading}
                        rest={{
                            keys: ["good", "average", "bad"],
                            dummy_keys: {
                                good: 0,
                                average: 0,
                                bad: 0,
                            },
                            onLabelClick: applyTeamFilter,
                        }}
                        onFreqClick={freqGetTeamCompositionData}
                        // freqData={[defaultFreqTeamComp, freqDTeamComp, freqWTeamComp, freqMTeamComp]}
                    />
                </div>
            </div>
        );
    },
    () => true
);
