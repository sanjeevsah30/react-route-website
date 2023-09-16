import dashboardConfig from "@constants/Dashboard/index";
import {
    clearReports,
    getTeamAverageData,
    getTeamComparisonData,
    getTeamCompositionData,
} from "@store/dashboard/dashboard";
import {
    clearDefaultReports,
    getDefaultReports,
} from "@store/scheduledReports/scheduledReports";
import { Tabs } from "antd";
import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BarGraph from "../Components/BarGraph";
import BarLineGraph from "../Components/BarLineGraph";
import HorizontalStackedBarGraph from "../Components/HorizontalStackedBarGraph";
import LineGraph from "../Components/LineGraph";
import SectionHeader from "../Components/SectionHeader";
import TemporaryComp from "../Components/TemporaryComp";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import useGetDashboardPayload from "../Hooks/useGetDashboardPayload";

const { TabPane } = Tabs;

function MultiTeamLevelAnalytics() {
    const dispatch = useDispatch();

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
                team_composition_graph_data,
                team_comparison_graph_data,
            },
        },
    } = useSelector((state) => state);

    const { stats_threshold } = useSelector(
        (state) => state.common.versionData
    );

    const default_reports = useSelector(
        (state) => state.scheduled_reports.default_reports
    );

    const { labelsFunc } = dashboardConfig;
    const labels = labelsFunc(stats_threshold);

    const { get_dashboard_label, filtersVisible } =
        React.useContext(HomeDashboardContext);

    const { getDashboardPayload } = useGetDashboardPayload();

    useEffect(() => {
        let payload = { dashboard: "multi_team_analysis" };
        dispatch(getDefaultReports(payload));
        return () => {
            dispatch(clearDefaultReports());
            dispatch(clearReports());
        };
    }, []);

    useEffect(() => {
        if (filtersVisible) {
            return;
        }
        if (template_active === undefined || !teams.length) return;
        let api3, api4, api5, api6, api7, api8;
        if (!filterTeams.active?.length && !filterReps.active.length) {
            const payload = getDashboardPayload();
            api3 = dispatch(getTeamAverageData(payload));
            api4 = dispatch(
                getTeamAverageData({ ...payload, is_line_graph: true })
            );

            api5 = dispatch(getTeamCompositionData(payload));

            api6 = dispatch(getTeamComparisonData(payload));

            api7 = dispatch(
                getTeamCompositionData({ ...payload, is_line_graph: true })
            );

            api8 = dispatch(
                getTeamComparisonData({ ...payload, is_line_graph: true })
            );
        }
        return () => {
            api3?.abort();
            api4?.abort();
            api5?.abort();
            api6?.abort();
            api7?.abort();
            api8?.abort();
        };
    }, [getDashboardPayload, template_active, teams]);

    return (
        <div className="analysis__dashboard">
            <div className="see_deetails_section">
                <SectionHeader
                    title="Detailed Analysis"
                    defaultHeader={false}
                />
                <Tabs
                    defaultActiveKey="1"
                    onChange={() => {}}
                    style={{ minHeight: "87%" }}
                >
                    <TabPane tab="Average Score" key="1">
                        <BarLineGraph
                            type={get_dashboard_label()}
                            Component={BarGraph}
                            LineComponent={LineGraph}
                            is_switch={true}
                            barData={team_avg_data}
                            lineData={team_avg_graph_data}
                            loading={loaders.team_average_loading}
                            line_loading={loaders.team_average_graph_loading}
                            rest={{
                                show_console: true,
                                show_all: true,
                            }}
                            select_data={filterTeams.teams}
                            select_type="team"
                            line_rest={{
                                generate_color: false,
                            }}
                        />
                    </TabPane>
                    <TabPane
                        tab={
                            isAccountLevel
                                ? "Acc. Composition"
                                : "Call Composition"
                        }
                        key="2"
                    >
                        <BarLineGraph
                            type={get_dashboard_label()}
                            Component={HorizontalStackedBarGraph}
                            LineComponent={LineGraph}
                            is_switch={true}
                            lineData={team_composition_graph_data}
                            loading={loaders.team_composition_loading}
                            line_loading={
                                loaders.team_composition_graph_loading
                            }
                            labels={labels}
                            barData={team_composition_data}
                            rest={{
                                keys: ["good", "average", "bad"],
                                dummy_keys: {
                                    good: 0,
                                    average: 0,
                                    bad: 0,
                                },
                                show_all: true,
                            }}
                            line_rest={{
                                show_all: true,
                                generate_color: false,
                            }}
                            select_data={filterTeams.teams}
                            select_type="team"
                            multiline={true}
                            heading={"All Team Analysis"}
                        />
                    </TabPane>
                    <TabPane tab="Rep Composition" key="3">
                        <BarLineGraph
                            type={"Rep"}
                            Component={HorizontalStackedBarGraph}
                            LineComponent={LineGraph}
                            is_switch={true}
                            lineData={team_comparison_graph_data}
                            loading={loaders.team_comparison_loading}
                            line_loading={loaders.team_comparison_graph_loading}
                            labels={labels}
                            barData={team_comparison_data}
                            rest={{
                                keys: ["good", "average", "bad"],
                                dummy_keys: {
                                    good: 0,
                                    average: 0,
                                    bad: 0,
                                },
                                show_all: true,
                            }}
                            select_data={filterTeams.teams}
                            select_type="team"
                            line_rest={{
                                show_all: true,
                                generate_color: false,
                                type: "Reps",
                            }}
                            multiline={true}
                            heading={"All Team Analysis"}
                        />
                    </TabPane>
                </Tabs>
            </div>
            {!!default_reports?.data?.length && (
                <div>
                    <SectionHeader title="Reports" defaultHeader={false} />
                    {
                        // default_reports?.data?.map((item, index) => <ReportDashboard activeReportType={item.type} idx={index} key={index} />)
                        default_reports?.data?.map((item, index) => (
                            <TemporaryComp
                                item={item}
                                index={index}
                                key={index}
                            />
                        ))
                    }
                    {/* <ReportDashboard /> */}
                </div>
            )}
        </div>
    );
}

export default React.memo(MultiTeamLevelAnalytics);
