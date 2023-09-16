import React, { useContext, useEffect, useRef, useState } from "react";
import exportAsImage from "utils/exportAsImage";
import {
    dashboardRoutes,
    report_types,
} from "../Constants/dashboard.constants";
import SectionHeader from "./SectionHeader";
import { useHistory } from "react-router-dom";
import PieLineGraph from "./PieLineGraph";
import GraphCard from "./GraphCard";
import GraphPieCard from "./GraphPieCard";
import BarGraph from "./BarGraph";
import LineGraph from "./LineGraph";
import { useSelector } from "react-redux";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import { useDispatch } from "react-redux";
import {
    getLeadScoreAvgPerforming,
    getLeadScoreComposition,
    getLeadScoreData,
    getLeadScoreIdData,
} from "@store/dashboard/dashboard";
import useGetDashboardPayload from "../Hooks/useGetDashboardPayload";
import dashboardConfig from "@constants/Dashboard/index";
import HorizontalStackedBarGraph from "./HorizontalStackedBarGraph";
import { Select } from "antd";
import Icon from "@presentational/reusables/Icon";

const { Option } = Select;

export default React.memo(
    function OverallLeadAnalysis() {
        const history = useHistory();
        const dispatch = useDispatch();
        const {
            common: { versionData, filterReps, filterTeams, teams },
            callAudit: { isAccountLevel },
            dashboard: {
                leadscore_data,
                loaders,
                templates_data: { template_active },
            },
        } = useSelector((state) => state);

        const leadAnalytics1 = useRef();
        const leadAnalytics2 = useRef();
        const leadAnalytics3 = useRef();

        const {
            labelsBasedOnThreshold,
            applyRepFilter,
            applyTeamFilter,
            filtersVisible,
        } = useContext(HomeDashboardContext);

        const [leadScoreId, setLeadScoreId] = useState("hot");

        const { getDashboardPayload } = useGetDashboardPayload();

        const freqGetLeadScoreData = (freq) => {
            const payload = getDashboardPayload();
            const tempPayload = freq ? { ...payload, freq: freq } : payload;
            const newPayload = { ...tempPayload, is_line_graph: true };
            dispatch(getLeadScoreData(newPayload));
        };

        const { lead_labels } = dashboardConfig;

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
                            <span className={"topbar-label"}>
                                Select LeadScore
                            </span>
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
            if (versionData.feature_access?.lead_score && isAccountLevel) {
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
                            payload: { ...payload },
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

        return versionData?.feature_access?.lead_score && isAccountLevel ? (
            <div className="team__level__analytics marginTB16;">
                <SectionHeader
                    title="Lead Analysis"
                    showSeeDetails={true}
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
        ) : (
            <></>
        );
    },
    () => true
);
