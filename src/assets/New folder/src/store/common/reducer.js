import initialState from "../initialState";
import * as types from "./types";
import { uid } from "@helpers";
import TopbarConfig from "@constants/Topbar/index";
export default function commonReducer(state = initialState.common, action) {
    switch (action.type) {
        case types.SETLOADER:
            return {
                ...state,
                showLoader: action.status,
            };
        case types.SETDOMAIN:
            return {
                ...state,
                domain: action.domain,
            };
        case types.STORE_TAGS:
            return {
                ...state,
                tags: action.tags,
            };
        case types.STORE_CALL_TYPES:
            return {
                ...state,
                call_types: action.call_types,
            };
        case types.STORE_CALL_DURATION:
            return {
                ...state,
                options: action.options,
            };
        case types.STORE_ALL_CLIENTS:
            return {
                ...state,
                clients: [...action.clients?.results],
                nextClientsUrl: action.clients?.next,
            };
        case types.STORE_ALL_TOPICS:
            return {
                ...state,
                topics: action.topics,
            };
        case types.STORE_SEARCH_FIELDS:
            return {
                ...state,
                fields: action.fields,
            };
        case types.STORE_ALL_USERS:
            return {
                ...state,
                users: action.users,
            };
        case types.STORE_TEAMS:
            return {
                ...state,
                teams: action.teams,
            };
        case types.STORE_SALES_TASKS:
            return {
                ...state,
                salesTasks: [...action.salesTasks?.results],
                nextSalesTaskUrl: action.salesTasks?.next,
            };
        case types.CLEAR_FILTERS:
            return {
                ...state,
                filterTeams: {
                    ...state.filterTeams,
                    active: [],
                },
                filterReps: {
                    ...state.filterReps,
                    active: [],
                },
                filterCallTypes: {
                    ...state.filterCallTypes,
                    active: 0,
                },
                filterCallDuration: {
                    ...state.filterCallDuration,
                    active: TopbarConfig.defaultDuration,
                },
                filterDates: initialState.common.filterDates,
                filterAuditTemplates: {
                    templates: state.filterAuditTemplates.templates,
                    active: null,
                },
            };

        case types.SET_FILTER_TEAMS:
            return {
                ...state,
                filterTeams: {
                    teams: action.teams,
                    active: state.filterTeams.active,
                },
            };
        case types.SET_ACTIVE_TEAM:
            // console.log(action.active)
            return {
                ...state,
                filterTeams: {
                    teams: state.filterTeams.teams,
                    active: action.active,
                },
            };
        case types.SET_FILTER_REPS:
            return {
                ...state,
                filterReps: {
                    reps: action.reps.reps,
                    active: action.reps.active,
                },
            };
        case types.SET_ACTIVE_REP:
            return {
                ...state,
                filterReps: {
                    ...state.filterReps,
                    active: action.active,
                },
            };
        case types.SET_FILTER_CALL_TYPES:
            return {
                ...state,
                filterCallTypes: {
                    callTypes: action.callTypes,
                    active: state.filterCallTypes.active,
                },
            };
        case types.SET_ACTIVE_CALL_TYPE:
            return {
                ...state,
                filterCallTypes: {
                    active: action.active.toString(),
                    callTypes: state.filterCallTypes.callTypes,
                },
            };
        case types.SET_FILTER_CALL_DURATION:
            let id = uid();

            return {
                ...state,
                filterCallDuration: {
                    options: {
                        ...initialState.common.filterCallDuration.options,
                        [id]: {
                            value: action.values,
                            text:
                                action?.values?.[0] >= 0 &&
                                action?.values?.[0] !== null &&
                                action?.values?.[1] >= 0 &&
                                action?.values?.[1] !== null
                                    ? `Between ${action.values[0] || 0} - ${
                                          action.values[1] || 0
                                      } min `
                                    : action?.values?.[0] >= 0 &&
                                      action?.values?.[0] !== null
                                    ? `Above ${action.values[0] || 0} min`
                                    : action?.values?.[1] >= 0 &&
                                      action?.values?.[1] !== null
                                    ? `Below ${action.values[1] || 0} min`
                                    : ``,
                        },
                    },
                    active: id,
                },
            };
        case types.SET_ACTIVE_CALL_DURATION:
            return {
                ...state,
                filterCallDuration: {
                    active: action.active,
                    options: state.filterCallDuration.options,
                },
            };
        case types.SET_ACTIVE_FILTER_DATE:
            return {
                ...state,
                filterDates: {
                    active: action.active,
                    dates: state.filterDates.dates,
                },
            };
        case types.SET_FILTER_DATES:
            return {
                ...state,
                filterDates: {
                    active: state.filterDates.active,
                    dates: action.dates,
                },
            };
        case types.SET_GS_TEXT:
            return {
                ...state,
                gsText: action.text,
            };
        case types.SALES_TASK_QUERY_LOADING:
            return {
                ...state,
                salesTaskQueryLoading: action.loading,
            };
        case types.SALES_TASK_NEXT_LOADING:
            return {
                ...state,
                salesTaskNextLoading: action.loading,
            };
        case types.SET_FILTER_AUDIT_TEMPLATES:
            return {
                ...state,
                filterAuditTemplates: {
                    templates: action.res,
                    active: state.filterAuditTemplates.active,
                },
            };
        case types.SET_ACTIVE_TEMPLATE:
            return {
                ...state,
                filterAuditTemplates: {
                    templates: state.filterAuditTemplates.templates,
                    active: action.active,
                },
            };
        case types.SET_DID_FILTER_CHANGE:
            return {
                ...state,
                didFiltersChange: action.status,
            };
        case types.STORE_VERSION_DATA:
            return {
                ...state,
                versionData: action.data,
            };
        case types.SET_ACTIVE_REPORT_TYPE:
            return {
                ...state,
                activeReportType: action.payload,
            };
        case types.SET_FETCHING_REPS:
            return {
                ...state,
                filterReps: {
                    ...state.filterReps,
                    loading: action.payload,
                },
            };
        case types.SET_ACTIVE_CALLTAG:
            return {
                ...state,
                activeCallTag: action.payload,
            };
        default:
            return state;
    }
}
