import dashboardConfig from "@constants/Dashboard/index";
import Icon from "@presentational/reusables/Icon";
import {
    getDashboardParameters,
    getParameterAverageData,
    getParameterIdData,
} from "@store/dashboard/dashboard";
import { Select } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import useSetAiFiltersForDashboard from "../Hooks/useSetAiFiltersForDashboard";
import BarGraph from "./BarGraph";
import GraphCard from "./GraphCard";
import LineGraph from "./LineGraph";
import SectionHeader from "./SectionHeader";

const { Option } = Select;

export default React.memo(
    function OverallParameterAnalytics({ showSeeDetails = true }) {
        const history = useHistory();
        const dispatch = useDispatch();
        const parameterLevelAnalytics1 = useRef();
        const parameterLevelAnalytics2 = useRef();
        const parameterLevelAnalytics3 = useRef();

        const { applyRepFilter, applyTeamFilter, filtersVisible } =
            useContext(HomeDashboardContext);
        const { getDashboardPayload } = useGetDashboardPayload();
        const { applyAiFilter } = useSetAiFiltersForDashboard();
        const { colors } = dashboardConfig;

        const [questionId, setQuestionId] = useState(null);

        const {
            common: { teams, filterTeams },
            dashboard: {
                loaders,
                templates_data: { template_active },
                parameter_data: {
                    parameter_avg_data,

                    parameter_avg_graph_data,
                    parameter_id_data,
                    parameter_id_graph_data,
                },
                parameters,
            },
        } = useSelector((state) => state);

        const freqGetParameterIdData = (freq) => {
            const payload = getDashboardPayload();
            const tempPayload = freq ? { ...payload, freq: freq } : payload;
            const newPayload = { ...tempPayload, is_line_graph: true };
            if (questionId) {
                dispatch(
                    getParameterIdData({
                        ...newPayload,
                        question_id: questionId,
                    })
                );
                dispatch(
                    getParameterIdData({
                        ...newPayload,
                        question_id: questionId,
                        is_line_graph: true,
                    })
                );
            }
            // dispatch(getParameterIdData(newPayload))
        };

        const freqGetParameterAverageData = (freq) => {
            const payload = getDashboardPayload();
            const tempPayload = freq ? { ...payload, freq: freq } : payload;
            const newPayload = { ...tempPayload, is_line_graph: true };
            dispatch(getParameterAverageData(newPayload));
        };

        const ParameterSelect = () => {
            return (
                <Select
                    className="custom__select"
                    value={questionId}
                    onChange={(val) => {
                        setQuestionId(val);
                    }}
                    dropdownRender={(menu) => (
                        <div>
                            <span className={"topbar-label"}>
                                Select Parameter
                            </span>
                            {menu}
                        </div>
                    )}
                    placeholder={"Select Parameter"}
                    suffixIcon={
                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                    }
                    style={{
                        height: "36px",
                        width: "192px",
                    }}
                    dropdownClassName={
                        "account_select_dropdown parameter_select_dropdown"
                    }
                    optionFilterProp="children"
                    showSearch
                >
                    {parameters.data.map((item) => (
                        <Option value={item.id} key={item.id}>
                            {item.question_text}
                        </Option>
                    ))}
                </Select>
            );
        };

        useEffect(() => {
            if (filtersVisible) {
                return;
            }
            if (template_active === undefined || !teams.length) return;
            let api10, api11, api12, api21, api22;
            const payload = getDashboardPayload();

            api10 = dispatch(getParameterAverageData(payload));
            api11 = dispatch(
                getParameterAverageData({ ...payload, is_line_graph: true })
            );

            if (template_active)
                api12 = dispatch(getDashboardParameters(template_active));

            if (questionId) {
                api21 = dispatch(
                    getParameterIdData({
                        ...payload,
                        question_id: questionId,
                    })
                );
                api22 = dispatch(
                    getParameterIdData({
                        ...payload,
                        question_id: questionId,
                        is_line_graph: true,
                    })
                );
            }
            return () => {
                api10?.abort();
                api11?.abort();
                api12?.abort();
                api21?.abort();
                api22?.abort();
            };
        }, [getDashboardPayload, template_active, teams]);

        useEffect(() => {
            if (questionId) {
                const payload = getDashboardPayload();

                dispatch(
                    getParameterIdData({
                        ...payload,
                        question_id: questionId,
                    })
                );
                dispatch(
                    getParameterIdData({
                        ...payload,
                        question_id: questionId,
                        is_line_graph: true,
                    })
                );
            }
        }, [questionId]);

        useEffect(() => {
            if (template_active !== undefined && questionId) {
                setQuestionId(null);
            }
        }, [template_active]);

        /* If parameters changes and default question is not set in 
    the parameter analysis sections third card then set the parameter
     to the first parameter in the parameters data array */
        useEffect(() => {
            if (parameters.data.length && !questionId) {
                setQuestionId(parameters.data[0]?.id);
            }
        }, [parameters.data]);

        return (
            <div className="team__level__analytics">
                <SectionHeader
                    title="Parameter Level Analytics"
                    showSeeDetails={showSeeDetails}
                    seeDetailsClick={() =>
                        history.push(dashboardRoutes.parameter)
                    }
                    to={dashboardRoutes.parameter}
                    report_type={report_types.parameters}
                    downloadGraph={() => {
                        exportAsImage(
                            parameterLevelAnalytics1.current,
                            "parameter_level_top_performing"
                        );
                        exportAsImage(
                            parameterLevelAnalytics2.current,
                            "parameter_level_need_attention"
                        );
                        exportAsImage(
                            parameterLevelAnalytics3.current,
                            "parameter_level_can_be_best_performer"
                        );
                    }}
                />
                <div
                    className="cards_container"
                    style={{
                        gap: "16px",
                    }}
                >
                    <GraphCard
                        heading={"Top Performing Parameters"}
                        downloadGraph={parameterLevelAnalytics1}
                        itext={"Top 5 parameters"}
                        is_info={true}
                        Component={BarGraph}
                        LineComponent={LineGraph}
                        is_switch={true}
                        barData={parameter_avg_data?.filter(
                            ({ average }, idx) =>
                                idx < parameter_avg_data.length / 2
                        )}
                        lineData={parameter_avg_graph_data?.filter(
                            ({ overall_average }, idx) =>
                                idx < parameter_avg_graph_data.length / 2
                        )}
                        loading={loaders.parameter_average_loading}
                        line_loading={loaders.parameter_average_graph_loading}
                        rest={{
                            onLabelClick: applyAiFilter,
                            use_color: colors.good_cl,
                        }}
                        onFreqClick={freqGetParameterAverageData}
                    />

                    <GraphCard
                        heading={"Need Attention Parameters"}
                        itext={"Bottom 5 parameters"}
                        downloadGraph={parameterLevelAnalytics2}
                        is_info={true}
                        Component={BarGraph}
                        LineComponent={LineGraph}
                        is_switch={true}
                        barData={parameter_avg_data?.filter(
                            ({ average }, idx) =>
                                idx >= parameter_avg_data.length / 2
                        )}
                        lineData={parameter_avg_graph_data?.filter(
                            ({ overall_average }, idx) =>
                                idx >= parameter_avg_graph_data.length / 2
                        )}
                        loading={loaders.parameter_average_loading}
                        line_loading={loaders.parameter_average_graph_loading}
                        rest={{
                            is_top_five: false,
                            show_all: false,
                            onLabelClick: applyAiFilter,
                            use_color: colors.bad_cl,
                        }}
                        line_rest={{
                            is_top_five: false,
                        }}
                        onFreqClick={freqGetParameterAverageData}
                    />

                    <GraphCard
                        heading={""}
                        downloadGraph={parameterLevelAnalytics3}
                        Component={BarGraph}
                        LineComponent={LineGraph}
                        is_select={true}
                        is_switch={true}
                        barData={parameter_id_data}
                        lineData={parameter_id_graph_data}
                        rest={{
                            margin: {
                                top: 10,
                                bottom: 60,
                            },
                            onLabelClick: filterTeams?.active.length
                                ? applyRepFilter
                                : applyTeamFilter,
                        }}
                        loading={loaders.parameter_id_data_loading}
                        line_rest={{
                            margin: {
                                top: 10,
                                bottom: 80,
                            },
                        }}
                        SelectComponent={ParameterSelect}
                        line_loading={loaders.parameter_id_graph_data_loading}
                        onFreqClick={freqGetParameterIdData}
                    />
                </div>
            </div>
        );
    },
    () => true
);
