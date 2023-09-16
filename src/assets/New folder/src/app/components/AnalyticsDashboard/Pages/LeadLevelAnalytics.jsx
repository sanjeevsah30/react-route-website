import dashboardConfig from "@constants/Dashboard/index";
import Icon from "@presentational/reusables/Icon";
import {
    clearReports,
    getLeadScoreAvgPerforming,
    getLeadScoreComposition,
    getLeadScoreData,
    getLeadScoreIdData,
} from "@store/dashboard/dashboard";
import {
    clearDefaultReports,
    getDefaultReports,
} from "@store/scheduledReports/scheduledReports";
import { Select, Tabs } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import exportAsImage from "utils/exportAsImage";
import BarGraph from "../Components/BarGraph";
import BarLineGraph from "../Components/BarLineGraph";
import GraphCard from "../Components/GraphCard";
import GraphPieCard from "../Components/GraphPieCard";
import HorizontalStackedBarGraph from "../Components/HorizontalStackedBarGraph";
import LineGraph from "../Components/LineGraph";
import OverallLeadAnalysis from "../Components/OverallLeadAnalysis";
import OverallPieLineAnalitics from "../Components/OverallPieLineAnalitics";
import PieLineGraph from "../Components/PieLineGraph";
import SectionHeader from "../Components/SectionHeader";
import TemporaryComp from "../Components/TemporaryComp";
import {
    dashboardRoutes,
    report_types,
} from "../Constants/dashboard.constants";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import useGetDashboardPayload from "../Hooks/useGetDashboardPayload";

const { TabPane } = Tabs;

const { Option } = Select;

export default function LeadLevelAnalytics() {
    const dispatch = useDispatch();
    const [isMount, setIsMount] = useState(true);

    const default_reports = useSelector(
        (state) => state.scheduled_reports.default_reports
    );
    const {
        common: {
            versionData: { stats_threshold },
            filterReps,
            filterTeams,
        },
        dashboard: { leadscore_data, loaders },
    } = useSelector((state) => state);

    const { lead_labels } = dashboardConfig;
    const { get_dashboard_label, filtersVisible } =
        useContext(HomeDashboardContext);

    const { labelsFunc } = dashboardConfig;
    const labels = labelsFunc(stats_threshold);

    useEffect(() => {
        let payload = { dashboard: "lead_analysis" };
        dispatch(getDefaultReports(payload));
        setIsMount(true);
        return () => {
            dispatch(clearReports());
            dispatch(clearDefaultReports());
            setIsMount(false);
        };
    }, []);

    const history = useHistory();

    const {
        common: { versionData, teams },
        callAudit: { isAccountLevel },
        dashboard: {
            templates_data: { template_active },
        },
    } = useSelector((state) => state);

    const leadAnalytics1 = useRef();
    const leadAnalytics2 = useRef();
    const leadAnalytics3 = useRef();

    const { labelsBasedOnThreshold, applyRepFilter, applyTeamFilter } =
        useContext(HomeDashboardContext);

    const [leadScoreId, setLeadScoreId] = useState("hot");

    const { getDashboardPayload } = useGetDashboardPayload();

    const freqGetLeadScoreData = (freq) => {
        const payload = getDashboardPayload();
        const tempPayload = freq ? { ...payload, freq: freq } : payload;
        const newPayload = { ...tempPayload, is_line_graph: true };
        dispatch(getLeadScoreData(newPayload));
    };

    const freqGetLeadScoreComposition = (freq) => {
        const payload = getDashboardPayload();
        const tempPayload = freq ? { ...payload, freq: freq } : payload;
        const newPayload = { ...tempPayload, is_line_graph: true };
        dispatch(getLeadScoreComposition(newPayload));
    };

    const freqGetLeadScoreIdData = (freq) => {
        const payload = getDashboardPayload();
        const tempPayload = freq ? { ...payload, freq: freq } : payload;
        const newPayload = { ...tempPayload, is_line_graph: true };
        if (leadScoreId) {
            dispatch(
                getLeadScoreIdData({
                    payload: { ...newPayload },
                    stage: leadScoreId,
                })
            );
            dispatch(
                getLeadScoreIdData({
                    payload: { ...newPayload, is_line_graph: true },
                    stage: leadScoreId,
                })
            );
        }
    };

    const LeadScoreSelect = () => {
        return (
            <Select
                className="custom__select"
                value={leadScoreId}
                onChange={(val) => {
                    dispatch(
                        getLeadScoreIdData({
                            payload: { ...getDashboardPayload() },
                            stage: val,
                        })
                    );
                    dispatch(
                        getLeadScoreIdData({
                            payload: {
                                ...getDashboardPayload(),
                                is_line_graph: true,
                            },
                            stage: val,
                        })
                    );
                    setLeadScoreId(val);
                }}
                dropdownRender={(menu) => (
                    <div>
                        <span className={"topbar-label"}>Select LeadScore</span>
                        {menu}
                    </div>
                )}
                placeholder={"Select Leadscore"}
                suffixIcon={
                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                }
                style={{
                    height: "36px",
                    width: "192px",
                }}
                dropdownClassName={"account_select_dropdown"}
            >
                <Option value={"hot"}>Hot</Option>
                <Option value={"warm"}>Warm</Option>
                <Option value={"cold"}>Cold</Option>
            </Select>
        );
    };

    useEffect(() => {
        if (filtersVisible) {
            return;
        }
        if (template_active === undefined || !teams.length) {
            return;
        }

        let api13, api14, api15, api16, api17, api18, api19;
        if (versionData?.feature_access?.lead_score && isAccountLevel) {
            const payload = getDashboardPayload();
            api13 = dispatch(getLeadScoreComposition(payload));
            api14 = dispatch(
                getLeadScoreComposition({ ...payload, is_line_graph: true })
            );
            api15 = dispatch(getLeadScoreAvgPerforming(payload));
            api16 = dispatch(getLeadScoreData(payload));
            api17 = dispatch(
                getLeadScoreData({ ...payload, is_line_graph: true })
            );

            if (leadScoreId) {
                api18 = dispatch(
                    getLeadScoreIdData({
                        payload,
                        stage: leadScoreId,
                    })
                );
                api19 = dispatch(
                    getLeadScoreIdData({
                        payload: { ...payload, is_line_graph: true },
                        stage: leadScoreId,
                    })
                );
            }
        }

        return () => {
            api13 && api13?.abort();
            api14 && api14?.abort();
            api15 && api15?.abort();
            api16 && api16?.abort();
            api17 && api17?.abort();
            api18 && api18?.abort();
            api19 && api19?.abort();
        };
    }, [getDashboardPayload, template_active, teams]);

    return (
        <div className="lead_score_detail analysis__dashboard">
            <OverallPieLineAnalitics />
            <div className="team__level__analytics marginTB16;">
                <SectionHeader
                    title="Lead Analysis"
                    showSeeDetails={false}
                    seeDetailsClick={() => history.push(dashboardRoutes.lead)}
                    to={dashboardRoutes.lead}
                    report_type={report_types.leadscore_details}
                    downloadGraph={() => {
                        exportAsImage(
                            leadAnalytics1.current,
                            "Lead Score Analysis1"
                        );
                        exportAsImage(
                            leadAnalytics2.current,
                            "Lead Score Analysis2"
                        );
                        exportAsImage(
                            leadAnalytics3.current,
                            "Lead Score Analysis3"
                        );
                    }}
                />
                {filterReps.active.length ? (
                    <PieLineGraph
                        pie_data={leadscore_data.average_performing}
                        graph_loading={
                            loaders.lead_score_composition_graph_loading
                        }
                        pie_loading={leadscore_data.average_performing_loading}
                        graph_data={
                            leadscore_data?.composition_graph_data?.[0]?.data
                        }
                        type={""}
                        labels={lead_labels}
                        showTrend={true}
                    />
                ) : (
                    <div
                        className="cards_container"
                        style={{
                            gap: "16px",
                        }}
                    >
                        {filterTeams.active?.length ? (
                            <GraphPieCard
                                downloadGraph={leadAnalytics1}
                                heading={"Lead Distribution"}
                                data={leadscore_data.average_performing}
                                loading={
                                    leadscore_data.average_performing_loading
                                }
                            />
                        ) : (
                            <GraphCard
                                heading={"Average Team Score"}
                                type={"Calls"}
                                Component={BarGraph}
                                LineComponent={LineGraph}
                                is_switch={true}
                                barData={leadscore_data?.leadscore_avg_data}
                                lineData={
                                    leadscore_data?.leadscore_avg_graph_data
                                }
                                loading={loaders?.lead_score_average_loading}
                                line_loading={
                                    loaders?.lead_score_average_graph_loading
                                }
                                rest={{
                                    onLabelClick: applyTeamFilter,
                                }}
                                onFreqClick={freqGetLeadScoreData}
                            />
                        )}

                        <GraphCard
                            heading={
                                filterTeams.active?.length
                                    ? "Top Lead Generators"
                                    : "Average Lead Composition"
                            }
                            downloadGraph={leadAnalytics2}
                            labels={lead_labels}
                            Component={HorizontalStackedBarGraph}
                            barData={leadscore_data?.composition_data}
                            rest={{
                                colors: lead_labels.map(({ color }) => color),
                                keys: ["hot", "warm", "cold"],
                                default_keys: {
                                    hot: 0,
                                    warm: 0,
                                    cold: 0,
                                },
                                onLabelClick: filterTeams.active?.length
                                    ? applyRepFilter
                                    : applyTeamFilter,
                            }}
                            loading={loaders?.lead_score_composition_loading}
                            LineComponent={LineGraph}
                            onFreqClick={freqGetLeadScoreComposition}
                        />

                        <GraphCard
                            downloadGraph={leadAnalytics3}
                            heading={""}
                            type={""}
                            Component={BarGraph}
                            labels={labelsBasedOnThreshold}
                            barData={leadscore_data.leadscore_id_data}
                            lineData={leadscore_data.leadscore_id_graph_data}
                            is_select={true}
                            SelectComponent={LeadScoreSelect}
                            is_switch={true}
                            loading={loaders.lead_scroe_id_data_loading}
                            line_loading={
                                loaders.lead_scroe_id_graph_data_loading
                            }
                            rest={{
                                margin: {
                                    top: 10,
                                    bottom: 60,
                                },
                                onLabelClick: filterTeams.active?.length
                                    ? applyRepFilter
                                    : applyTeamFilter,
                            }}
                            LineComponent={LineGraph}
                            onFreqClick={freqGetLeadScoreIdData}
                        />
                    </div>
                )}
            </div>
            <div className="see_deetails_section">
                <SectionHeader
                    title="Detailed Analysis"
                    defaultHeader={false}
                />
                <Tabs defaultActiveKey="1" onChange={() => {}}>
                    {filterTeams.active?.length || (
                        <TabPane tab="Average Team Score" key="1">
                            <BarLineGraph
                                type={get_dashboard_label()}
                                Component={BarGraph}
                                LineComponent={LineGraph}
                                is_switch={true}
                                rest={{
                                    show_all: true,
                                }}
                                select_data={filterTeams.teams}
                                barData={leadscore_data?.leadscore_avg_data}
                                lineData={
                                    leadscore_data?.leadscore_avg_graph_data
                                }
                                loading={loaders?.lead_score_average_loading}
                                line_loading={
                                    loaders?.lead_score_average_graph_loading
                                }
                                heading="Average Team Score"
                            />
                        </TabPane>
                    )}

                    <TabPane
                        tab={
                            filterTeams.active?.length
                                ? "Top Lead Generators"
                                : "Average Team Composition"
                        }
                        key="2"
                    >
                        <BarLineGraph
                            type={get_dashboard_label()}
                            Component={HorizontalStackedBarGraph}
                            LineComponent={LineGraph}
                            is_switch={true}
                            lineData={leadscore_data?.composition_graph_data}
                            barData={leadscore_data?.composition_data}
                            line_loading={
                                loaders.lead_score_composition_graph_loading
                            }
                            rest={{
                                colors: lead_labels.map(({ color }) => color),
                                keys: ["hot", "warm", "cold"],
                                dummy_keys: {
                                    hot: 0,
                                    warm: 0,
                                    cold: 0,
                                },
                                show_all: true,
                            }}
                            line_rest={{
                                show_all: true,
                                generate_color: false,
                            }}
                            select_data={
                                filterTeams.active?.length
                                    ? filterReps.reps
                                    : filterTeams.teams
                            }
                            multiline={true}
                            labels={lead_labels}
                            loading={loaders?.lead_score_composition_loading}
                            select_placeholder={
                                filterTeams.active?.length
                                    ? "Select Owner"
                                    : "Select Team"
                            }
                            select_type={
                                filterTeams.active?.length ? "owner" : "team"
                            }
                            heading={
                                filterTeams.active?.length
                                    ? "Top Lead Generators"
                                    : "Average Team Composition"
                            }
                        />
                    </TabPane>
                    {filterTeams.active?.length && (
                        <TabPane
                            tab={
                                filterTeams.active?.length
                                    ? "Agent Wise Score"
                                    : "Team Wise Score"
                            }
                            key="3"
                        >
                            <BarLineGraph
                                type={""}
                                Component={BarGraph}
                                labels={labels}
                                barData={leadscore_data.leadscore_id_data}
                                lineData={
                                    leadscore_data.leadscore_id_graph_data
                                }
                                is_select={true}
                                SelectComponent={() => {}}
                                is_switch={true}
                                loading={loaders.lead_scroe_id_data_loading}
                                line_loading={
                                    loaders.lead_scroe_id_graph_data_loading
                                }
                                rest={{
                                    margin: {
                                        top: 10,
                                        bottom: 60,
                                    },
                                    show_all: true,
                                }}
                                LineComponent={LineGraph}
                                select_data={filterReps.reps}
                                select_placeholder="Select Owner"
                                select_type="Owner"
                                heading={
                                    filterTeams.active?.length
                                        ? "Agent Wise Score"
                                        : "Team Wise Score"
                                }
                                line_rest={{
                                    generate_color: false,
                                }}
                            />
                        </TabPane>
                    )}
                </Tabs>
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
    );
}
