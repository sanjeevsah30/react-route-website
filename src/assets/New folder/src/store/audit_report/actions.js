import * as types from "./types";
import { setLoader, openNotification } from "../common/actions";
import apiErrors from "@apis/common/errors";
import {
    getAgentPerformanceDetails,
    getAgentWiseList,
    getAudiorCallWiseListApi,
    getAudiorGraph,
    getAuditorList,
    getAuditorPerformance,
    getCallWiseList,
    getCategoryInsights,
    getTeamList,
    getTeamPerformanceDetails,
    getTopInsights,
} from "@apis/audit_report/index";

const setAuditorPerformanceDetails = (details) => {
    return {
        type: types.SET_AUDIT_PERFORMANCE_DETAILS,
        details,
    };
};

export function setReportFilterDates(dates) {
    return {
        type: types.SET_REPORT_FILTER_DATES,
        dates,
    };
}

export function setReportActiveTeam(active) {
    return {
        type: types.SET_REPORT_ACTIVE_TEAM,
        active,
    };
}

export function setReportActiveAgent(active) {
    return {
        type: types.SET_REPORT_ACTIVE_AGENT,
        active,
    };
}
export function setReportActiveFilterDate(active) {
    return {
        type: types.SET_REPORT_ACTIVE_FILTER_DATE,
        active,
    };
}

const setAditorListData = (details) => {
    return {
        type: types.SET_AUDITOR_LIST_DATA,
        details,
    };
};

const setTeamPerformanceDetails = (details) => {
    return {
        type: types.SET_TEAM_PERFORMANCE_DETAILS,
        details,
    };
};

const setAgentPerformanceDetails = (details) => {
    return {
        type: types.SET_AGENT_PERFORMANCE_DETAILS,
        details,
    };
};

const setTeamListData = (details) => {
    return {
        type: types.SET_TEAM_LIST_DATA,
        details,
    };
};

const setAgentListData = (details) => {
    return {
        type: types.SET_AGENT_LIST_DATA,
        details,
    };
};

export const storeReportTeams = (teams) => {
    return {
        type: types.SET_REPORT_ALL_TEAMS,
        teams,
    };
};

export const storeReportAgents = (agents) => {
    return {
        type: types.SET_REPORT_AGENT,
        agents,
    };
};

export const storeTopInsights = (data) => {
    return {
        type: types.STORE_TOP_INSIGHTS,
        data,
    };
};

export const storeCategoryInsights = (data) => {
    return {
        type: types.STORE_CATEGORY_INSIGHTS,
        data,
    };
};

export const storeCallWiseDetails = (data) => {
    return {
        type: types.STORE_CALL_WISE_LIST_DATA,
        data,
    };
};

const setAuditorGraphData = (data) => {
    return {
        type: types.SET_AUDITOR_GRAPH_DATA,
        data,
    };
};

const setCardsLoading = (flag) => {
    return {
        type: types.SET_CARD_LOADER,
        flag,
    };
};

const setTopInsightsLoading = (flag) => {
    return {
        type: types.SET_TOP_INSIGHT_LOADER,
        flag,
    };
};

const setCategoryInsightsLoading = (flag) => {
    return {
        type: types.SET_CATEGORY_INSIGHT_LOADER,
        flag,
    };
};

export const getAuditorPerformanceRequest =
    (payload) => (dispatch, getState) => {
        dispatch(setCardsLoading(true));
        dispatch(setLoader(true));
        return getAuditorPerformance(payload).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(setAuditorPerformanceDetails(res));
            }
            dispatch(setCardsLoading(false));
            dispatch(setLoader(false));
        });
    };

export const getAuditorListRequest =
    (payload, params) => (dispatch, getState) => {
        // dispatch(setLoader(true));
        dispatch(setTableLoading(true));
        return getAuditorList(payload, params).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(setAditorListData(res));
            }
            // dispatch(setLoader(false));
            dispatch(setTableLoading(false));
        });
    };

export const getTeamPerformanceDetailsRequest =
    (payload, id) => (dispatch, getState) => {
        dispatch(setCardsLoading(true));
        dispatch(setLoader(true));
        return getTeamPerformanceDetails(
            getState().common.domain,
            payload,
            id
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(setTeamPerformanceDetails(res));
            }
            dispatch(setCardsLoading(false));
            dispatch(setLoader(false));
        });
    };
export const getAgentPerformanceDetailsRequest =
    (payload, id) => (dispatch, getState) => {
        dispatch(setLoader(true));
        dispatch(setCardsLoading(true));
        return getAgentPerformanceDetails(
            getState().common.domain,
            payload,
            id
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(setAgentPerformanceDetails(res));
            }
            dispatch(setCardsLoading(false));
            dispatch(setLoader(false));
        });
    };

export const getTeamListRequest = (payload) => (dispatch, getState) => {
    // dispatch(setLoader(true));
    dispatch(setTableLoading(true));
    return getTeamList(getState().common.domain, payload).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
        } else {
            dispatch(setTeamListData(res));
        }
        // dispatch(setLoader(false));
        dispatch(setTableLoading(false));
    });
};

export const getTopInsightsRequest = (payload, id) => (dispatch, getState) => {
    dispatch(setTopInsightsLoading(true));
    return getTopInsights(getState().common.domain, payload, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
        } else {
            const sortedData = res.sort(
                (a, b) =>
                    b.manual_audit_score.score - a.manual_audit_score.score ||
                    b.ai_audit_score.score - a.ai_audit_score.score
            );
            if (sortedData.length > 5) {
                const mid = Math.floor(sortedData.length / 2);
                dispatch(
                    storeTopInsights({
                        best_performance: sortedData.slice(0, mid),
                        worst_performance: sortedData.slice(mid),
                    })
                );
            } else {
                dispatch(
                    storeTopInsights({
                        best_performance: sortedData,
                        worst_performance: [],
                    })
                );
            }
        }
        dispatch(setTopInsightsLoading(false));
    });
};

export const getCategoryInsightsRequest =
    (payload, id) => (dispatch, getState) => {
        dispatch(setCategoryInsightsLoading(true));
        return getCategoryInsights(getState().common.domain, payload, id).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(storeCategoryInsights(res));
                }
                dispatch(setCategoryInsightsLoading(false));
            }
        );
    };

export const getAgentWiseListRequest =
    (payload, id, page) => (dispatch, getState) => {
        // dispatch(setLoader(true));
        dispatch(setTableLoading(true));
        return getAgentWiseList(
            getState().common.domain,
            payload,
            id,
            page
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(setAgentListData(res));
            }
            // dispatch(setLoader(false));
            dispatch(setTableLoading(false));
        });
    };

export const getCallWiseListRequest =
    (payload, id, page) => (dispatch, getState) => {
        // dispatch(setLoader(true));
        dispatch(setTableLoading(true));
        return getCallWiseList(
            getState().common.domain,
            payload,
            id,
            page
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                for (let i = 0; i < res.results.length; i++) {
                    for (
                        let j = 0;
                        j < res.results[i].question_score.length;
                        j++
                    ) {
                        res.results[i][
                            res.results[i].question_score[j].question_text
                        ] = res.results[i].question_score[j].score;
                    }
                }
                dispatch(storeCallWiseDetails(res));
            }
            // dispatch(setLoader(false));
            dispatch(setTableLoading(false));
        });
    };

export const getAudiorGraphRequest = (payload, id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    return getAudiorGraph(payload, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
        } else {
            dispatch(setAuditorGraphData(res));
        }
        dispatch(setLoader(false));
    });
};

export const setTableLoading = (flag) => {
    return {
        type: types.SET_TABLE_LOADING,
        flag,
    };
};

export const setReportCallDuration = (active) => {
    return {
        type: types.SET_REPORT_CALL_DURATION,
        active,
    };
};

export const setReportFilterCallDuration = (values) => {
    return {
        type: types.SET_REPORT_FILTER_CALL_DURATION,
        values,
    };
};
export const setAuditorCallWiseList = (payload) => {
    return {
        type: types.SET_AUDITOR_CALL_WISE_LIST,
        payload,
    };
};

export const getAudiorCallWiseList =
    (payload, id, page) => (dispatch, getState) => {
        dispatch(
            setAuditorCallWiseList({
                loading: true,
            })
        );
        return getAudiorCallWiseListApi(
            getState().common.domain,
            payload,
            id,
            page
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                for (let i = 0; i < res.results.length; i++) {
                    for (
                        let j = 0;
                        j < res.results[i].question_score.length;
                        j++
                    ) {
                        res.results[i][
                            res.results[i].question_score[j].question_text
                        ] = res.results[i].question_score[j].score;
                    }
                }
                dispatch(
                    setAuditorCallWiseList({
                        data: res,
                    })
                );
            }
            dispatch(
                setAuditorCallWiseList({
                    loading: false,
                })
            );
        });
    };
