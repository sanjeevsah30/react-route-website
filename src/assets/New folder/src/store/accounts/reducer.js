import initialState from "@store/initialState";
import { uid } from "@tools/helpers";
import * as types from "./types";

export default function reducer(state = initialState.accounts, action) {
    switch (action.type) {
        case types.SET_ACCOUNTS_LOADER:
            return {
                ...state,
                loaders: {
                    ...state.loaders,
                    ...action.data,
                },
            };
        case types.SET_ACCOUNTS_LIST:
            return {
                ...state,
                accountsList: action.data,
            };
        case types.SET_ACCOUNTS_TEAMS:
            return state?.filterTeams?.teams?.length === 1
                ? {
                      ...state,
                      filterTeams: {
                          ...state.filterTeams,
                          teams: [...state.filterTeams.teams, ...action.data],
                      },
                  }
                : { ...state };
        case types.SET_ACTIVE_TEAM_FOR_ACCOUNTS:
            return {
                ...state,
                filterTeams: {
                    ...state.filterTeams,
                    active: action.value,
                },
            };
        case types.SET_ACCOUNTS_REPS:
            return {
                ...state,
                filterReps: {
                    ...state.filterReps,
                    reps: action.data,
                },
            };
        case types.SET_ACTIVE_REP_FOR_ACCOUNTS:
            return {
                ...state,
                filterReps: {
                    ...state.filterReps,
                    active: action.value,
                },
            };
        case types.SET_ACCOUNT_FILTER_DATES:
            return {
                ...state,
                filterDates: {
                    active: state.filterDates.active,
                    dates: action.value,
                },
            };
        case types.SET_ACCOUNT_ACTIVE_FILTER_DATES:
            return {
                ...state,
                filterDates: {
                    active: action.value,
                    dates: state.filterDates.dates,
                },
            };
        case types.SET_ACCOUNT_DETAILS:
            return {
                ...state,
                accountDetails: action.data,
            };
        case types.SET_ACCOUNT_CALLS:
            return {
                ...state,
                accountCalls: action.data,
            };
        case types.SET_ACCOUNT_GRAPH:
            return {
                ...state,
                graph: action.data,
            };
        case types.SET_ACCOUNT_COMMENTS:
            return {
                ...state,
                comments: action.data,
            };
        case types.SET_ACCOUNT_COMMENT_TO_REPLY:
            return {
                ...state,
                activeComment: {
                    ...state.activeComment,
                    ...action.data,
                },
            };
        case types.SET_ACCOUNT_SEARCH_FILTER:
            return {
                ...state,
                searchFilters: {
                    ...state.searchFilters,
                    ...action.data,
                },
            };
        case types.SET_ACCOUNT_AI_DATA:
            return {
                ...state,
                aiData: action.data,
            };
        case types.SET_ACCOUNT_CALL_DURATION:
            return {
                ...state,
                filterCallDuration: {
                    active: action.active,
                    options: state.filterCallDuration.options,
                },
            };
        case types.SET_ACCOUNT_FILTER_CALL_DURATION:
            let id = uid();

            return {
                ...state,
                filterCallDuration: {
                    options: {
                        ...initialState.accounts.filterCallDuration.options,
                        [id]: {
                            value: action.values,
                            text: `Above ${action.values[0]} min`,
                        },
                    },
                    active: id,
                },
            };
        case types.SET_ACCOUNT_LIST_SEARCH_TEXT:
            return {
                ...state,
                searchText: action.values,
            };
        case types.SET_SORT_KEY_ACCOUNTS:
            return {
                ...state,
                sortKey: action.values,
            };
        case types.SET_AUDIT_TEMPLATES:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    templates: action.data,
                },
            };
        case types.SET_ACTIVE_AUDIT_TEMPLATE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    activeTemplate: action.data,
                },
            };
        case types.SET_ACTIVE_LEAD_SCORE_TEMPLATE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    activeLeadScoreTemplate: action.data,
                },
            };
        case types.SET_AUDIT_TEMPLATE_QUESTIONS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    questions: [...state.filters.questions, ...action.data],
                },
            };
        case types.SET_LEAD_SCORE_OBJECTS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    leadScoreObjects: [...action.data],
                },
            };
        case types.SET_ACTIVE_STAGE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    activeStage: action.data,
                },
            };
        case types.SET_ACCOUNT_TAGS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    accountTags: action.data,
                },
            };

        case types.SET_ACTIVE_INTERACTIONS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    activeInteractions: action.data,
                },
            };
        case types.SET_ACTIVE_DEAL_SIZE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    dealSize: action.data,
                },
            };
        case types.SET_ACTIVE_CLOSE_DATE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    closeDate: action.data,
                },
            };
        case types.SET_ACTIVE_LAST_CONTACT:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    lastContacted: action.data,
                },
            };
        case types.SET_STAGE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    stage: action.data,
                },
            };
        case types.SET_ACTIVE_FILTER_QUESTIONS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    activeQuestions: {
                        ...action.data,
                    },
                },
            };
        case types.SET_ACTIVE_LEAD_SCORE_QUESTIONS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    activeLeadScoreQuestions: {
                        ...action.data,
                    },
                },
            };
        case types.SET_ACTIVE_AUDIT_TYPE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    audit_filter: {
                        ...state.filters.audit_filter,
                        ...action.data,
                    },
                },
            };
        case types.SET_ACTIVE_FILTERS:
            return {
                ...state,
                activeFilters: action.data,
            };
        case types.RESET_ACCOUNT_LIST_FILTERS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    activeQuestions: {},
                    activeLeadScoreQuestions: {},
                    activeStage: null,
                    activeInteractions: null,
                    lastContacted: [null, null],
                    closeDate: [null, null],
                    dealSize: [null, null],
                    activeLeadScorePercent: null,
                    audit_filter: {
                        audit_type: null,
                        auditors: [],
                    },
                    activeAccountTags: [],
                },
                activeFilters: [],
            };
        case types.SET_LEAD_SCORE_FOR_ACCOUNTS:
            return {
                ...state,
                leadScoreData: action.data,
            };
        case types.SET_FILTER_DATES_FOR_ACCOUNTS:
            return {
                ...state,
                filterDates: action.data,
            };
        case types.SET_ACTIVE_LEAD_SCORE_PERCENT:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    activeLeadScorePercent: action.data,
                },
            };
        case types.SET_ACTIVE_ACCOUNT_TAGS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    activeAccountTags: [...action.data],
                },
            };
        default:
            return state;
    }
}
