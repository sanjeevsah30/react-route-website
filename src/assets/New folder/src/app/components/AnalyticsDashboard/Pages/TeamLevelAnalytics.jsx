import Statistics from "@container/Statistics/Statistics";
import { clearReports, getRepAverageData } from "@store/dashboard/dashboard";
import {
    clearDefaultReports,
    getDefaultReports,
} from "@store/scheduledReports/scheduledReports";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BarGraph from "../Components/BarGraph";
import BarLineGraph from "../Components/BarLineGraph";
import LineGraph from "../Components/LineGraph";
import OverallParameterAnalytics from "../Components/OverallParameterAnalytics";
import OverallPieLineAnalitics from "../Components/OverallPieLineAnalitics";
import OverallRepLevelAnalytics from "../Components/OverallRepLevelAnalytics";
import OverallTeamLevelAnalytics from "../Components/OverallTeamLevelAnalytics";
import OverallViolationAnalytics from "../Components/OverallViolationAnalytics";
import SectionHeader from "../Components/SectionHeader";
import TemporaryComp from "../Components/TemporaryComp";
import { report_types } from "../Constants/dashboard.constants";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import useGetDashboardPayload from "../Hooks/useGetDashboardPayload";

export default function TeamLevelAnalytics() {
    const dispatch = useDispatch();
    const [isMount, setIsMount] = useState(true);
    const { getDashboardPayload } = useGetDashboardPayload();
    const {
        common: { filterReps, teams },
        dashboard: {
            loaders,

            rep_data: { rep_avg_data, rep_avg_graph_data },
            templates_data: { template_active },
        },
        scheduled_reports: { default_reports },
    } = useSelector((state) => state);

    const { get_dashboard_label, filtersVisible } =
        useContext(HomeDashboardContext);

    useEffect(() => {
        // let payload = { dashboard: 'multi_team_analysis' }
        let payload = { dashboard: "team_analysis" };
        dispatch(getDefaultReports(payload));
        setIsMount(true);
        return () => {
            dispatch(clearDefaultReports());
            dispatch(clearReports());
            setIsMount(false);
        };
    }, []);

    useEffect(() => {
        if (filtersVisible) {
            return;
        }
        if (template_active === undefined || !teams.length) return;

        const payload = getDashboardPayload();
        let api8, api9;
        api8 = dispatch(getRepAverageData(payload));
        api9 = dispatch(getRepAverageData({ ...payload, is_line_graph: true }));

        return () => {
            api8?.abort();
            api9?.abort();
        };
    }, [getDashboardPayload, template_active, teams]);

    return (
        <div className="team_level analysis__dashboard">
            <div className="overall__analysis__section posRel">
                <OverallPieLineAnalitics />
                <div className="team__level__analytics marginTB16">
                    <SectionHeader
                        title="Statistics"
                        showSeeDetails={false}
                        report_type={report_types.statistics}
                    />
                    <Statistics />
                </div>
                <OverallTeamLevelAnalytics />
                {filterReps.active.length ? (
                    <></>
                ) : (
                    <OverallRepLevelAnalytics showSeeDetails={false} />
                )}
                <OverallViolationAnalytics />
                <OverallParameterAnalytics />
                <div className="see_deetails_section">
                    <SectionHeader
                        title="Detailed Analysis"
                        defaultHeader={false}
                        showSeeDetails={false}
                    />
                    <BarLineGraph
                        type={get_dashboard_label()}
                        Component={BarGraph}
                        LineComponent={LineGraph}
                        is_switch={true}
                        barData={rep_avg_data}
                        lineData={rep_avg_graph_data}
                        loading={loaders.rep_average_loading}
                        line_loading={loaders.rep_average_graph_loading}
                        rest={{
                            show_all: true,
                            tooltip_label_key: "team",
                            color_on_performance: true,
                        }}
                        heading="Rep Level Analysis"
                        select_data={filterReps.reps}
                        select_placeholder="Select Owner"
                        select_type="owner"
                        line_rest={{
                            color_on_performance: true,
                            generate_color: false,
                        }}
                        add_primary={false}
                    />
                    {/* <div
                        style={{
                            height: '420px',
                            overflowY: 'scroll',
                            backgroud: 'white',
                        }}
                        className="custom__card overall__analysis__card padding16 marginTB20"
                    >
                        <Loader loading={loaders.rep_details_graph_loading}>
                            {loaders.rep_details_graph_loading || (
                                <HorizontalStackedGroupGraph />
                            )}
                        </Loader>
                    </div> */}
                </div>
                {isMount && !!default_reports?.data?.length && (
                    <div>
                        <SectionHeader title="Reports" defaultHeader={false} />
                        {
                            default_reports?.data?.map((item, index) => (
                                <TemporaryComp
                                    item={item}
                                    index={index}
                                    key={index}
                                />
                            ))
                            // <ReportDashboard activeReportType={'agent_report'} />
                        }
                        {/* <ReportDashboard /> */}
                    </div>
                )}
            </div>
        </div>
    );
}
