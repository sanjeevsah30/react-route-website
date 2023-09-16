/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";
import dashboardConfig from "@constants/Dashboard/index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";
import { formatFloat, months } from "@tools/helpers";
import {
    getBarData,
    getLineData,
    getMultiLineData,
    getMultiLineLeadScoreData,
    getMultiLineViolationsData,
    getPieData,
} from "./formatDashboardData";

import auditConfig from "@constants/Audit/index";
import {
    getAccLevelStage,
    getAccountAuditTopbarFilters,
    getCallLevelStage,
    getTopbarFilters,
} from "@tools/searchFactory";
import { getCallTagId } from "tools/searchFactory";

const api = {
    team_average: "/analytics/team/average/",
    team_composition: "/analytics/team/composition/",
    team_comparison: "/analytics/team/comparison/",
    rep_average: "/analytics/rep/average/",
    rep_details: "/analytics/rep/detail/",
    lead_score_compositon: "/analytics/lead_score/compostion/",
    lead_score_average_performing: "/analytics/lead_score/distribution/",
    violations_average: "/analytics/violations/average/",
    violations_composition: "/analytics/violations/composition/",
    violations_distribution: "/analytics/violations/distribution/",
    violation_id_data: "/analytics/violations/detail/",
    leadscore_id_data: "/analytics/lead_score/detail/",
    audit_graph_data: "/analytics/audit_report/graph/",
    audit_overall_data: "/analytics/audit_report/overall/",
    parameter_trend_graph: "/audit/question/detail_graph/",
};

const initialState = {
    loaders: {
        template_loading: true,

        overall_data_pie_loading: true,
        overall_data_graph_loading: true,

        violations_data_average_loading: true,
        violations_data_average_graph_loading: true,
        violations_data_composition_loading: true,
        violations_graph_data_composition_loading: true,
        violation_id_data_loading: false,
        violation_id_graph_data_loading: false,
        violation_distribution_loading: true,

        team_average_loading: true,
        team_average_graph_loading: true,
        team_composition_loading: true,
        team_composition_graph_loading: true,

        team_comparison_loading: true,
        team_comparison_graph_loading: true,

        parameter_average_loading: true,
        parameter_average_graph_loading: true,
        parameter_id_data_loading: false,
        parameter_id_graph_data_loading: false,

        rep_average_loading: true,
        rep_average_graph_loading: true,

        lead_score_average_loading: true,
        lead_score_average_graph_loading: true,

        lead_scroe_id_data_loading: false,
        lead_scroe_id_graph_data_loading: false,

        lead_score_composition_graph_loading: false,
        lead_score_composition_loading: false,

        rep_details_graph_loading: false,

        audit_details_graph_loading: false,
        audit_details_overall_loading: false,

        parameter_trend_loading: false,
    },
    templates_data: {
        loading: true,
        templates: null,
        template_active: undefined,
    },
    // remove conflict
    overall_data: {
        pie_loading: true,
        graph_loading: true,
        pie_data: getPieData({}),
        graph_data: [],
        overall_average: null,
        freq_gd: null, // gd means graph_data
        calls_data: {},
        freq_pd: null,
    },
    team_data: {
        team_avg_data: [],
        team_avg_graph_data: [],
        team_composition_data: [],
        team_composition_graph_data: [],
        team_comparison_data: [],
        team_comparison_graph_data: [],
        team_freq_avg_gd: null,
        team_freq_composition_gd: null,
        team_freq_comparison_gd: null,
    },
    rep_data: {
        rep_avg_data: [],
        rep_avg_graph_data: [],
        can_be_best_avg_data: [],
        can_be_best_avg_graph_data: [],
        rep_freq_avg_gd: null,
        rep_freq_best_avg_gd: null,
        rep_details_data: [],
        rep_details_data_err: "",
    },
    parameter_data: {
        parameter_avg_data: [],
        parameter_avg_graph_data: [],
        parameter_id_data: [],
        parameter_id_graph_data: [],
        para_freq_avg_gd: null,
        para_freq_id_gd: null,
        parameter_trend_graph: [],
    },
    leadscore_data: {
        leadscore_avg_data: [],
        leadscore_avg_graph_data: [],
        loading: false,

        composition_data: [],
        composition_graph_data: [],

        composition_loading: true,
        average_performing: getPieData({}),
        average_performing_loading: true,
        leadscore_id_data: [],
        leadscore_id_graph_data: [],

        lead_freq_composition_gd: null,
        lead_freq_avg_gd: null,
        lead_freq_id_gd: null,
    },
    parameters: {
        data: [],
        loading: true,
    },
    violations: {
        data: [],
        loading: true,
    },
    violations_data: {
        average_data: [],
        average_graph_data: [],
        composition_data: [],
        composition_graph_data: [],
        id_data: [],
        id_graph_data: [],
        violation_distribution_data: getPieData({}),
        viol_freq_average_gd: null,
        viol_freq_composition_gd: null,
        viol_freq_id_gd: null,
    },
    audit_data_overall: [],
    audit_data_graph: {},
    see_details_data: {},
    reports: {
        data: {},
        // data: [],
        // loading: false,
    },
    active_dashbord_filters: [],
    dashboard_filters: {
        audit_filter: {
            audit_type: null,
            auditors: [],
            manualAuditDateRange: [null, null],
            call_tags: [],
        },
        call_tags: [],
        acc_tags: [],
        stage: null,
    },
    callAuditOverallDetails: {},
    accountAuditOverallDetails: {},
    auditOverallDetailsLoading: false,
};

export const getTemplates = createAsyncThunk(
    "dashboard/get_templates",
    async (team_id, { rejectWithValue, getState }) => {
        try {
            const url = +team_id
                ? `/audit/template/list_all/?team_id=${team_id}`
                : "/audit/template/list_all/";
            const res = await axiosInstance.get(`${url}`);
            const getTemplatesOfTeam = res.data.filter(({ teams }) =>
                teams.find(
                    ({ id }) => id === getState().common.filterTeams.active
                )
                    ? true
                    : false
            );

            return {
                data: res.data,
                active:
                    getState().common.filterTeams.active === 0
                        ? res?.data?.[0]?.id
                        : getTemplatesOfTeam?.[0]?.id || null,
            };
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getViolationsForDashboard = createAsyncThunk(
    "dashboard/getViolationsForDashboard",
    async (_, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get("/audit/violation/list_all/");
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getDashboardParameters = createAsyncThunk(
    "dashboard/get_dashboard_parameters",
    async (id, { rejectWithValue, getState }) => {
        try {
            if (id === undefined) return [];
            const res = await axiosInstance.get(
                `/audit/template/retrieve-info/?template_id=${id}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getOverallPieData = createAsyncThunk(
    "dashboard/get_Overall_pie_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            dispatch(
                setDashboardLoader({
                    overall_data_pie_loading: true,
                })
            );
            const res = await axiosInstance.post(
                "/analytics/overall/",
                payload
            );

            // dispatch(
            //     setDashboardLoader({
            //         overall_data_pie_loading: false,
            //     })
            // );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getOverallGraphData = createAsyncThunk(
    "dashboard/get_Overall_graph_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            dispatch(
                setDashboardLoader({
                    overall_data_graph_loading: true,
                })
            );
            const res = await axiosInstance.post(
                "/analytics/overall/graph/",
                payload
            );
            dispatch(
                setOverallFreq({
                    freq_gd: payload.freq ? payload.freq : "-",
                })
            );
            // dispatch(
            //     setDashboardLoader({
            //         overall_data_graph_loading: false,
            //     })
            // );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getTeamAverageData = createAsyncThunk(
    "dashboard/get_team_average_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "team_average_graph_loading"
            : "team_average_loading";
        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                `${api.team_average}`,
                payload
            );
            dispatch(
                setTeamFreq({
                    team_freq_avg_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);

export const getTeamCompositionData = createAsyncThunk(
    "dashboard/get_team_composition_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "team_composition_graph_loading"
            : "team_composition_loading";
        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                `${api.team_composition}`,
                payload
            );
            dispatch(
                setTeamFreq({
                    team_freq_composition_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);
export const getTeamComparisonData = createAsyncThunk(
    "dashboard/get_team_comparison_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "team_comparison_graph_loading"
            : "team_comparison_loading";
        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                `${api.team_comparison}`,
                payload
            );
            dispatch(
                setTeamFreq({
                    team_freq_comparison_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);

export const getRepAverageData = createAsyncThunk(
    "dashboard/get_rep_average_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "rep_average_graph_loading"
            : "rep_average_loading";
        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(`${api.rep_average}`, payload);
            dispatch(
                setRepFreq({
                    rep_freq_avg_gd: payload.freq ? payload.freq : "-",
                    rep_freq_best_avg_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);

export const getRepGraphDetails = createAsyncThunk(
    "dashboard/get_rep_details_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            setDashboardLoader({
                rep_details_graph_loading: true,
            });
            const res = await axiosInstance.post(`${api.rep_details}`, payload);
            return res.data;
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);

export const getParameterAverageData = createAsyncThunk(
    "dashboard/get_parameter_average_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "parameter_average_graph_loading"
            : "parameter_average_loading";

        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                "/analytics/parameter/average/",
                payload
            );
            dispatch(
                setParameterFreq({
                    para_freq_avg_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);

export const getParameterIdData = createAsyncThunk(
    "dashboard/get_parameter_id_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "parameter_id_graph_data_loading"
            : "parameter_id_data_loading";

        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                "/analytics/parameter/average/",
                payload
            );
            dispatch(
                setParameterFreq({
                    para_freq_id_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);

export const getParameterTrendData = createAsyncThunk(
    "dashboard/get_parameter_trend_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                "/audit/question/detail_graph/",
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const getLeadScoreData = createAsyncThunk(
    "dashboard/get_lead_score_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "lead_score_average_graph_loading"
            : "lead_score_average_loading";

        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                "/analytics/lead_score/average/",
                payload
            );
            dispatch(
                setLeadScoreFreq({
                    lead_freq_avg_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);

export const getLeadScoreComposition = createAsyncThunk(
    "dashboard/get_lead_score_composition_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "lead_score_composition_graph_loading"
            : "lead_score_composition_loading";
        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                `${api.lead_score_compositon}`,
                payload
            );
            dispatch(
                setLeadScoreFreq({
                    lead_freq_composition_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);

export const getLeadScoreAvgPerforming = createAsyncThunk(
    "dashboard/get_lead_score_average_performing",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `${api.lead_score_average_performing}`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getViolationDistributionData = createAsyncThunk(
    "dashboard/get_violation_distribution_data",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `${api.violations_distribution}`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getViolationsAverage = createAsyncThunk(
    "dashboard/get_violations_average",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "violations_data_average_graph_loading"
            : "violations_data_average_loading";
        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                `${api.violations_average}`,
                payload
            );
            // dispatch(
            //     setDashboardLoader({
            //         violations_data_average_loading: false,
            //     })
            // );
            dispatch(
                setViolationsFreq({
                    viol_freq_average_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);
export const getViolationsComposition = createAsyncThunk(
    "dashboard/get_violations_composition",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "violations_graph_data_composition_loading"
            : "violations_data_composition_loading";

        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                `${api.violations_composition}`,
                payload
            );
            // dispatch(
            //     setDashboardLoader({
            //         violations_data_composition_loading: false,
            //     })
            // );
            dispatch(
                setViolationsFreq({
                    viol_freq_composition_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);

export const getViolationsIdData = createAsyncThunk(
    "dashboard/get_violations_id_data",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "violation_id_graph_data_loading"
            : "violation_id_data_loading";
        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                `${api.violation_id_data}`,
                payload
            );
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            dispatch(
                setViolationsFreq({
                    viol_freq_id_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            return rejectWithValue(getError(err));
        }
    }
);

export const getLeadScoreIdData = createAsyncThunk(
    "dashboard/get_leadscore_id_data",
    async ({ payload, stage }, { rejectWithValue, getState, dispatch }) => {
        const loading_key = payload.is_line_graph
            ? "lead_scroe_id_graph_data_loading"
            : "lead_scroe_id_data_loading";
        try {
            dispatch(
                setDashboardLoader({
                    [loading_key]: true,
                })
            );
            const res = await axiosInstance.post(
                `${api.leadscore_id_data}?stage=${stage}`,
                payload
            );
            // dispatch(
            //     setDashboardLoader({
            //         [loading_key]: false,
            //     })
            // );
            dispatch(
                setLeadScoreFreq({
                    lead_freq_composition_gd: payload.freq ? payload.freq : "-",
                })
            );
            return {
                data: res.data,
                is_line_graph: payload.is_line_graph,
                loading_key,
            };
        } catch (err) {
            dispatch(
                setDashboardLoader({
                    [loading_key]: false,
                })
            );
            return rejectWithValue(getError(err));
        }
    }
);

export const getReport = createAsyncThunk(
    "report/getReport",
    async (payload: any, { rejectWithValue, getState, dispatch }) => {
        try {
            const { type, id, ...rest } = payload;
            dispatch(
                setReportFile({
                    [type]: {
                        loading: true,
                        report_data: {},
                    },
                })
            );
            const res = await axiosInstance.post("/analytics/reports/", {
                type,
                ...rest,
            });
            return { ...res.data, id };
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getAuditGraphDetails = createAsyncThunk(
    "dashboard/get_audit_details_graph",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            setDashboardLoader({
                audit_details_graph_loading: true,
            });
            const res = await axiosInstance.post(
                `${api.audit_graph_data}`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getAuditOverallDetails = createAsyncThunk(
    "dashboard/get_audit_details_overall",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            setDashboardLoader({
                audit_details_overall_loading: true,
            });
            const res = await axiosInstance.post(
                `${api.audit_overall_data}`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCallAuditOverallDetailsRequest = createAsyncThunk(
    "dashboard/getCallAuditOverallDetails",
    async (
        { search_data, template_id, filters },
        { rejectWithValue, getState }
    ) => {
        try {
            const res = await axiosInstance.post(
                "/audit/template/overall_score/",
                {
                    search_data: [
                        ...getTopbarFilters(search_data),
                        ...getCallLevelStage(filters),
                        ...getCallTagId(filters),
                    ],
                    template_id,
                    status_for:
                        filters.audit_filter.audit_type ===
                        auditConfig.MANUAL_AUDIT_TYPE
                            ? "manual"
                            : "ai",
                }
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getAccountAuditOverallDetailsRequest = createAsyncThunk(
    "dashboard/getAccountAuditOverallDetails",
    async (
        { search_data, template_id, filters },
        { rejectWithValue, getState }
    ) => {
        try {
            const res = await axiosInstance.post("/account/overall_score/", {
                search_data: [
                    ...getAccountAuditTopbarFilters(search_data),
                    ...getAccLevelStage(filters),
                ],
                template_id,
                status_for:
                    filters.audit_filter.audit_type ===
                    auditConfig.MANUAL_AUDIT_TYPE
                        ? "manual"
                        : "ai",
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        clearReportFile(state, { payload }) {
            state.reports.data = payload;
        },
        setReportFile(state, { payload }) {
            state.reports.data = { ...state.reports.data, ...payload };
        },
        clearReports(state, action) {
            state.reports.data = {};
        },
        setActiveTemplate(state, action) {
            state.templates_data.template_active = action.payload;
        },
        setDashboardLoader(state, action) {
            state.loaders = { ...state.loaders, ...action.payload };
        },
        resetPrametersIdData(state) {
            state.parameter_data = {
                ...state.parameter_data,
                parameter_id_data: [],
                parameter_id_graph_data: [],
                freq_id_gd: null,
            };
        },
        setOverallFreq(state, action) {
            state.overall_data = { ...state.overall_data, ...action.payload };
        },
        setRepFreq(state, action) {
            state.rep_data = { ...state.rep_data, ...action.payload };
        },
        setParameterFreq(state, action) {
            state.parameter_data = {
                ...state.parameter_data,
                ...action.payload,
                setActiveDashboardFiltres,
            };
        },
        setTeamFreq(state, action) {
            state.team_data = { ...state.team_data, ...action.payload };
        },
        setViolationsFreq(state, action) {
            state.violations_data = {
                ...state.violations_data,
                ...action.payload,
            };
        },
        setLeadScoreFreq(state, action) {
            state.leadscore_data = {
                ...state.leadscore_data,
                ...action.paylaod,
            };
        },
        setActiveDashboardFiltres(state, action) {
            if (action?.payload?.length) {
                state.active_dashbord_filters = [...action.payload];
            }
        },
        setDashboardFilters(state, action) {
            state.dashboard_filters = {
                ...action.payload,
            };
        },
    },
    extraReducers: {
        [getTemplates.pending]: (state) => {
            state.templates_data.loading = true;
        },
        [getTemplates.fulfilled]: (state, { payload: { data, active } }) => {
            state.templates_data.loading = false;
            state.templates_data.templates = data;
            // state.templates_data.template_active = active || null;
        },
        [getTemplates.rejected]: (state, { payload }) => {
            state.templates_data.loading = false;
            state.templates_data.templates = [];
            openNotification("error", "Error", payload?.message);
        },
        [getOverallPieData.fulfilled]: (state, { payload }) => {
            const {
                colors: { good_cl, bad_cl, avg_cl },
            } = dashboardConfig;
            state.overall_data.pie_data = getPieData(
                payload,
                ["good", "average", "bad"],
                {
                    good: good_cl,
                    bad: bad_cl,
                    average: avg_cl,
                }
            );
            state.overall_data.calls_data = {
                all_calls: payload["All Calls"],
                connected_calls: payload["Connected Calls"],
            };

            state.loaders.overall_data_pie_loading = false;
            state.overall_data.overall_average = payload.overall_average;
        },
        [getOverallPieData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.overall_data_pie_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getOverallGraphData.fulfilled]: (state, { payload }) => {
            const {
                colors: { good_cl, bad_cl, avg_cl, cold },
            } = dashboardConfig;

            const graph_data = [
                {
                    id: "good",
                    label: "good",
                    name: "good",
                    color: good_cl,
                    data: [],
                },
                {
                    id: "average",
                    label: "average",
                    name: "average",
                    color: avg_cl,
                    data: [],
                },
                {
                    id: "bad",
                    label: "bad",
                    name: "bad",
                    color: bad_cl,
                    data: [],
                },
                {
                    id: "Overall Avg Call Score",
                    label: "Overall Avg Call Score",
                    name: "Overall Avg Call Score",
                    color: cold,
                    data: [],
                },
            ];

            for (let i = 0; i < payload?.length; i++) {
                const { epoch, good, bad, average, overall_average } =
                    payload[i];
                if (i === 0) {
                    graph_data[0]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: good,
                        trend: null,
                    });
                    graph_data[1]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: average,
                        trend: null,
                    });
                    graph_data[2]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: bad,
                        trend: null,
                    });
                    graph_data[3]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: overall_average,
                        trend: null,
                    });
                } else {
                    const {
                        good: prev_good,
                        bad: prev_bad,
                        average: prev_average,
                        overall_average: prev_overall_average,
                    } = payload?.[i - 1];
                    graph_data[0]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: good,
                        trend: formatFloat((good - prev_good) / prev_good, 2),
                    });
                    graph_data[1]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: average,
                        trend: formatFloat(
                            (average - prev_average) / prev_average,
                            2
                        ),
                    });
                    graph_data[2]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: bad,
                        trend: formatFloat((bad - prev_bad) / prev_bad, 2),
                    });
                    graph_data[3]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: overall_average,
                        trend: formatFloat(
                            (overall_average - prev_overall_average) /
                                prev_overall_average,
                            2
                        ),
                    });
                }
            }
            state.loaders.overall_data_graph_loading = false;
            state.overall_data.graph_data = payload.length ? graph_data : [];
        },
        [getOverallGraphData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.overall_data_graph_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getTeamAverageData.fulfilled]: (
            state,
            { payload: { data = [], is_line_graph, loading_key } }
        ) => {
            data = Array.isArray(data)
                ? [...data.filter(({ id }) => id !== null)]
                : [];

            if (is_line_graph)
                state.team_data.team_avg_graph_data = data.length
                    ? getLineData(data)
                    : [];
            else state.team_data.team_avg_data = getBarData(data);
            state.loaders[loading_key] = false;
        },
        [getTeamAverageData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.team_average_graph_loading = false;
            state.loaders.team_average_loading = false;
            openNotification("error", "Error", payload?.message);
        },

        [getTeamCompositionData.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            data = Array.isArray(data)
                ? [...data.filter(({ id }) => id !== null)]
                : [];
            if (is_line_graph)
                state.team_data.team_composition_graph_data = data.length
                    ? getMultiLineData(data)
                    : [];
            else
                state.team_data.team_composition_data = data.filter(
                    (item) => item.good || item.bad || item.average
                );
            state.loaders[loading_key] = false;
        },
        [getTeamCompositionData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.team_composition_graph_loading = false;
            state.loaders.team_composition_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getTeamComparisonData.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            data = Array.isArray(data)
                ? [...data.filter(({ id }) => id !== null)]
                : [];
            if (is_line_graph)
                state.team_data.team_comparison_graph_data = data.length
                    ? getMultiLineData(data)
                    : [];
            else
                state.team_data.team_comparison_data = data.filter(
                    (item) => item.good || item.bad || item.average
                );
            state.loaders[loading_key] = false;
        },
        [getTeamComparisonData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.team_comparison_graph_loading = false;
            state.loaders.team_comparison_loading = false;
            openNotification("error", "Error", payload?.message);
        },

        [getRepAverageData.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            data = Array.isArray(data)
                ? [...data.filter(({ id }) => id !== null)]
                : [];

            if (is_line_graph) {
                state.rep_data.rep_avg_graph_data = data.length
                    ? getLineData(data)
                    : [];
                state.rep_data.can_be_best_avg_graph_data = data.length
                    ? getLineData(
                          data?.slice(
                              Math.ceil(data.length * 0.2),
                              data.length - 1 - Math.floor(data.length * 0.2)
                          )
                      )
                    : [];
            } else {
                const newData = getBarData(data);
                state.rep_data.rep_avg_data = newData;

                //Remove top 20% and bottom 20% for can be best performer
                state.rep_data.can_be_best_avg_data = newData.slice(
                    Math.ceil(newData.length * 0.2),
                    newData.length - 1 - Math.floor(newData.length * 0.2)
                );
            }
            state.loaders[loading_key] = false;
            // state.rep_data.freq_avg_gd = '-';
            // state.rep_data.freq_best_avg_gd = '-';
        },
        [getRepAverageData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.rep_average_graph_loading = false;
            state.loaders.rep_average_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getParameterAverageData.pending]: (state) => {
            state.parameter_data.parameter_average_loading = true;
        },
        [getParameterAverageData.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            data = Array.isArray(data)
                ? [...data.filter(({ id }) => id !== null)]
                : [];

            if (is_line_graph)
                state.parameter_data.parameter_avg_graph_data = data.length
                    ? getLineData(data)
                    : [];
            else state.parameter_data.parameter_avg_data = getBarData(data);
            state.loaders[loading_key] = false;
        },
        [getParameterAverageData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.parameter_average_graph_loading = false;
            state.loaders.parameter_average_loading = false;
            state.parameter_data.parameter_average_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getDashboardParameters.pending]: (state) => {
            state.parameters.loading = true;
        },
        [getDashboardParameters.fulfilled]: (state, { payload }) => {
            const data = [];
            payload.categories.forEach(({ questions }) =>
                questions?.forEach((e) => data.push(e))
            );
            state.parameters.data = data.filter(
                (e) => e.question_type !== "none"
            );
            state.parameter_data.parameter_average_loading = false;
        },
        [getDashboardParameters.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.parameters.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getParameterTrendData.pending]: (state) => {
            state.loaders.parameter_trend_loading = true;
        },
        [getParameterTrendData.fulfilled]: (state, { payload }) => {
            state.loaders.parameter_trend_loading = false;
            const {
                colors: { good_cl },
            } = dashboardConfig;
            for (let i = 0; i < payload?.length; i++) {
                const graph_data = [
                    {
                        id: "occurence",
                        label: "occurence",
                        name: "occurence",
                        color: good_cl,
                        data: [],
                    },
                ];
                const { data } = payload[i];
                for (let j = 0; j < data?.length; j++) {
                    const { epoch, count } = data[j];
                    if (j === 0) {
                        graph_data[0]?.data.push({
                            x: `${new Date(epoch).getDate()} ${
                                months[new Date(epoch).getMonth()]
                            }`,
                            y: count,
                            trend: null,
                        });
                    } else {
                        const { count: prev_count } = data?.[j - 1];
                        graph_data[0]?.data.push({
                            x: `${new Date(epoch).getDate()} ${
                                months[new Date(epoch).getMonth()]
                            }`,
                            y: count,
                            trend: formatFloat(
                                (count - prev_count) / prev_count,
                                2
                            ),
                        });
                    }
                }
                payload[i] = { ...payload[i], graph_data };
            }

            state.parameter_data.parameter_trend_graph = payload;
        },
        [getParameterTrendData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.parameter_trend_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getParameterIdData.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            data = Array.isArray(data)
                ? [...data.filter(({ id }) => id !== null)]
                : [];

            if (is_line_graph)
                state.parameter_data.parameter_id_graph_data = data.length
                    ? getLineData(data)
                    : [];
            else state.parameter_data.parameter_id_data = getBarData(data);
            state.loaders[loading_key] = false;
        },
        [getParameterIdData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.parameter_id_graph_data_loading = false;
            state.loaders.parameter_id_data_loading = false;
            state.parameter_data.parameter_team_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getLeadScoreData.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            data = Array.isArray(data)
                ? [...data.filter(({ id }) => id !== null)]
                : [];

            if (is_line_graph)
                state.leadscore_data.leadscore_avg_graph_data = data.length
                    ? getLineData(data)
                    : [];
            else state.leadscore_data.leadscore_avg_data = getBarData(data);
            state.loaders[loading_key] = false;
            // state.leadscore_data.freq_avg_gd = '-';
        },
        [getLeadScoreData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.lead_score_average_graph_loading = false;
            state.loaders.lead_score_average_loading = false;
            openNotification("error", "Error", payload?.message);
        },

        [getLeadScoreComposition.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            data = Array.isArray(data)
                ? [...data.filter(({ id }) => id !== null)]
                : [];

            if (is_line_graph)
                state.leadscore_data.composition_graph_data = data.length
                    ? getMultiLineLeadScoreData(data)
                    : [];
            else state.leadscore_data.composition_data = data;
            state.loaders[loading_key] = false;
            // state.leadscore_data.freq_composition_gd = '-'
        },
        [getLeadScoreComposition.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.lead_score_average_graph_loading = false;
            state.loaders.lead_score_average_loading = false;
            state.leadscore_data.composition_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getLeadScoreAvgPerforming.pending]: (state) => {
            state.leadscore_data.average_performing_loading = true;
        },
        [getLeadScoreAvgPerforming.fulfilled]: (state, { payload }) => {
            const { hot, warm, cold } = dashboardConfig.colors;
            state.leadscore_data.average_performing = getPieData(
                payload,
                ["hot", "warm", "cold"],
                {
                    hot,
                    warm,
                    cold,
                }
            );
            state.leadscore_data.average_performing_loading = false;
        },
        [getLeadScoreAvgPerforming.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.leadscore_data.average_performing_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getViolationsAverage.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            if (is_line_graph)
                state.violations_data.average_graph_data = data.length
                    ? getLineData(data)
                    : [];
            else state.violations_data.average_data = getBarData(data);
            state.loaders[loading_key] = false;
        },
        [getViolationsAverage.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.violations_data_average_graph_loading = false;
            state.loaders.violations_data_average_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getViolationsComposition.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            if (is_line_graph) {
                state.violations_data.composition_graph_data = Array.isArray(
                    data
                )
                    ? getMultiLineViolationsData(data)
                    : [];
            } else {
                state.violations_data.composition_data = data;
            }
            state.loaders[loading_key] = false;
        },
        [getViolationsComposition.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.violations_graph_data_composition_loading = false;
            state.loaders.violations_data_composition_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getViolationsIdData.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            if (is_line_graph)
                state.violations_data.id_graph_data = data.length
                    ? getLineData(data)
                    : [];
            else state.violations_data.id_data = getBarData(data);
            state.loaders[loading_key] = false;
        },
        [getViolationsIdData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.violation_id_graph_data_loading = false;
            state.loaders.violation_id_data_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getLeadScoreIdData.fulfilled]: (
            state,
            { payload: { data, is_line_graph, loading_key } }
        ) => {
            if (is_line_graph)
                state.leadscore_data.leadscore_id_graph_data = data.length
                    ? getLineData(data)
                    : [];
            else state.leadscore_data.leadscore_id_data = getBarData(data);
            state.loaders[loading_key] = false;
            // state.leadscore_data.freq_id_gd = '-'
        },
        [getLeadScoreIdData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.lead_scroe_id_graph_data_loading = false;
            state.loaders.lead_scroe_id_data_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getViolationsForDashboard.pending]: (state) => {
            state.violations.loading = true;
        },
        [getViolationsForDashboard.fulfilled]: (state, { payload }) => {
            state.violations.loading = false;
            const { violation_colors } = dashboardConfig;
            //Need to set colors for violations in order to use them in the dashboard section
            const payloadWithColor = payload.map((item, idx) => ({
                ...item,
                label: item.name,
                color: violation_colors[idx],
            }));

            state.violations.data = [...payloadWithColor];
        },
        [getViolationsForDashboard.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.violations.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getViolationDistributionData.pending]: (state) => {
            state.loaders.violation_distribution_loading = true;
        },
        [getViolationDistributionData.fulfilled]: (state, { payload }) => {
            const { data } = state.violations;

            const keys = data.map(({ name }) => name);

            const colors = {};

            data.forEach(({ name, color }) => {
                colors[name] = color;
            });

            state.violations_data.violation_distribution_data = getPieData(
                payload,
                keys,
                colors
            );
            state.loaders.violation_distribution_loading = false;
        },
        [getViolationDistributionData.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.violation_distribution_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getReport.pending]: (state) => {
            state.reports.loading = true;
        },
        [getReport.fulfilled]: (state, { payload }) => {
            if (!!state.reports.data[payload.report]) {
                if (payload.id) {
                    state.reports.data = {
                        ...state.reports.data,
                        [payload.id]: {
                            report_data: payload,
                            loading: false,
                        },
                    };
                } else {
                    state.reports.data[payload.report].loading = false;
                    state.reports.data[payload.report].report_data = payload;
                }
            }
            // state.reports.loading = false;
            // state.reports.data = [...state.reports.data, payload]
            // state.reports.data = payload;
        },
        [getReport.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.reports.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getRepGraphDetails.pending]: (state) => {
            state.loaders.rep_details_graph_loading = true;
            state.rep_details_data_err = "";
        },
        [getRepGraphDetails.fulfilled]: (state, { payload }) => {
            state.loaders.rep_details_graph_loading = false;
            state.rep_data.rep_details_data = payload;
        },
        [getRepGraphDetails.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.rep_details_graph_loading = false;
            state.rep_data.rep_details_data = [];
            state.rep_details_data_err = payload?.message;
            // openNotification('error', 'Error', payload?.message);
        },
        [getAuditGraphDetails.pending]: (state) => {
            state.loaders.audit_details_graph_loading = true;
        },
        [getAuditGraphDetails.fulfilled]: (state, { payload }) => {
            state.loaders.audit_details_graph_loading = false;
            state.audit_data_graph = payload;
        },
        [getAuditGraphDetails.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.audit_details_graph_loading = false;
            state.audit_data_graph = {
                account: [],
                auditor: [],
                call: [],
                chat: [],
                agent: [],
            };
        },
        [getAuditOverallDetails.pending]: (state) => {
            state.loaders.audit_details_overall_loading = true;
        },
        [getAuditOverallDetails.fulfilled]: (state, { payload }) => {
            state.loaders.audit_details_overall_loading = false;
            state.audit_data_overall = payload;
        },
        [getAuditOverallDetails.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loaders.audit_details_overall_loading = false;
            state.audit_data_overall = [];
        },
        [getCallAuditOverallDetailsRequest.pending]: (state) => {
            state.auditOverallDetailsLoading = true;
        },
        [getCallAuditOverallDetailsRequest.fulfilled]: (state, { payload }) => {
            state.auditOverallDetailsLoading = false;
            state.callAuditOverallDetails = payload;
        },
        [getCallAuditOverallDetailsRequest.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.auditOverallDetailsLoading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getAccountAuditOverallDetailsRequest.pending]: (state) => {
            state.auditOverallDetailsLoading = true;
        },
        [getAccountAuditOverallDetailsRequest.fulfilled]: (
            state,
            { payload }
        ) => {
            state.auditOverallDetailsLoading = false;
            state.accountAuditOverallDetails = payload;
        },
        [getAccountAuditOverallDetailsRequest.rejected]: (
            state,
            { payload }
        ) => {
            if (!payload) {
                return;
            }
            state.auditOverallDetailsLoading = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

export const {
    setReportFile,
    clearReports,
    setActiveTemplate,
    setDashboardLoader,
    resetPrametersIdData,
    setOverallFreq,
    setTeamFreq,
    setRepFreq,
    setViolationsFreq,
    setLeadScoreFreq,
    setParameterFreq,
    setActiveDashboardFiltres,
    setDashboardFilters,
    clearReportFile,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
