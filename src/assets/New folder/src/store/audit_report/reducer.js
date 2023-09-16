import initialState from "@store/initialState";
import { uid } from "@tools/helpers";
import * as types from "./types";
export default function auditReport(state = initialState.auditReport, action) {
    switch (action.type) {
        case types.SET_AUDIT_PERFORMANCE_DETAILS:
            return {
                ...state,
                auditPerformanceDetails: action.details,
            };
        case types.SET_REPORT_FILTER_DATES:
            return {
                ...state,
                filterDates: {
                    active: state.filterDates.active,
                    dates: action.dates,
                },
            };
        case types.SET_REPORT_ACTIVE_FILTER_DATE:
            return {
                ...state,
                filterDates: {
                    active: action.active,
                    dates: state.filterDates.dates,
                },
            };
        case types.SET_AUDITOR_LIST_DATA:
            return {
                ...state,
                auditorList: action.details,
            };
        case types.SET_AUDITOR_GRAPH_DATA:
            return {
                ...state,
                graphData: action.data,
            };
        case types.SET_TEAM_PERFORMANCE_DETAILS:
            return {
                ...state,
                teamPerformanceDetails: action.details,
            };
        case types.SET_AGENT_PERFORMANCE_DETAILS:
            return {
                ...state,
                agentPerformanceDetails: action.details,
            };
        case types.SET_TEAM_LIST_DATA:
            return {
                ...state,
                teamList: [...action.details],
            };
        case types.SET_AGENT_LIST_DATA:
            return {
                ...state,
                agentList: action.details,
            };
        case types.SET_REPORT_ALL_TEAMS:
            return {
                ...state,
                filterTeams: {
                    ...state.filterTeams,
                    teams: [...state.filterTeams.teams, ...action.teams],
                },
            };
        case types.SET_REPORT_ACTIVE_TEAM:
            return {
                ...state,
                filterTeams: {
                    ...state.filterTeams,
                    active: action.active,
                },
            };
        case types.SET_REPORT_ACTIVE_AGENT:
            return {
                ...state,
                filterAgents: {
                    ...state.filterAgents,
                    active: action.active,
                },
            };
        case types.SET_REPORT_AGENT:
            return {
                ...state,
                filterAgents: {
                    agents: action.agents,
                    active: 0,
                },
            };
        case types.STORE_TOP_INSIGHTS:
            return {
                ...state,
                top_insights: action.data,
            };
        case types.STORE_CATEGORY_INSIGHTS:
            return {
                ...state,
                category_insights: action.data,
            };
        case types.STORE_CALL_WISE_LIST_DATA:
            return {
                ...state,
                callWiseData: action.data,
            };
        case types.SET_CARD_LOADER:
            return {
                ...state,
                cardsLoading: action.flag,
            };
        case types.SET_TOP_INSIGHT_LOADER:
            return {
                ...state,
                topInsightsLoading: action.flag,
            };
        case types.SET_CATEGORY_INSIGHT_LOADER:
            return {
                ...state,
                categoryInsightsLoading: action.flag,
            };
        case types.SET_TABLE_LOADING:
            return {
                ...state,
                tableLoading: action.flag,
            };
        case types.SET_REPORT_CALL_DURATION:
            return {
                ...state,
                filterCallDuration: {
                    active: action.active,
                    options: state.filterCallDuration.options,
                },
            };
        case types.SET_REPORT_FILTER_CALL_DURATION:
            let id = uid();

            return {
                ...state,
                filterCallDuration: {
                    options: {
                        ...initialState.common.filterCallDuration.options,
                        [id]: {
                            value: action.values,
                            text: `${action.values.join("-")} min`,
                        },
                    },
                    active: id,
                },
            };
        case types.SET_AUDITOR_CALL_WISE_LIST:
            return {
                ...state,
                auditorCallWiseData: {
                    ...state.auditorCallWiseData,
                    ...action.payload,
                },
            };
        default:
            return state;
    }
}
