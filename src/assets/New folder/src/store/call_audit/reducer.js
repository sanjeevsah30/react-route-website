import initialState from "@store/initialState";
import * as types from "./types";
export default function callAuditReducer(
    state = initialState.callAudit,
    action
) {
    switch (action.type) {
        case types.NEW_CALL_CREATED:
            return {
                ...state,
                newCallObjId: action.id,
            };
        case types.SET_AI_LOADING:
            return {
                ...state,
                aiAuditLoading: action.status,
            };
        case types.STORE_TEMPLATES_FOR_AUDIT:
            return {
                ...state,
                templates: action.templates,
            };
        case types.STORE_AVAILABLE_TEAMS_FOR_AUDIT:
            return {
                ...state,
                availableTeams: action.teams,
            };
        case types.STORE_NON_AVAILABLE_TEAMS_FOR_AUDIT:
            return {
                ...state,
                nonAvailableTeams: action.teams,
            };
        case types.STORE_CATEGORIES:
            return {
                ...state,
                categories: action.categories,
            };
        case types.STORE_QUESTIONS:
            return {
                ...state,
                questions: action.questions,
            };
        case types.DISABLE_LOADING:
            return {
                ...state,
                disableLoading: action.loading,
            };
        case types.STORE_SCORE_DETAILS:
            return {
                ...state,
                scoreDetails: action.scoreDetails,
            };
        case types.STORE_AUDIT_TEMPLATE:
            return {
                ...state,
                auditTemplate: action.template,
            };
        case types.STORE_ALL_AUDIT_TEMPLATE:
            return {
                ...state,
                allAuditTemplate: action.allTemplates,
            };
        case types.SAVING_NOTE:
            return {
                ...state,
                saving: {
                    ...state.saving,
                    ...action.saving,
                },
            };
        case types.AUDIT_DONE:
            return {
                ...state,
                auditDone: action.status,
            };
        case types.SHOW_AUDIT_INCOMPLETE:
            return {
                ...state,
                showAuditIncomplete: action.flag,
            };
        case types.SET_IS_MANUAL_LEVEL:
            return {
                ...state,
                isManual: action.flag,
                audit_filter: {
                    ...state.audit_filter,
                    ...action.data,
                },
            };
        case types.RESET_CALL_AUDIT:
            return {
                ...state,
                templates: [],
                availableTeams: {},
                nonAvailableTeams: {},
                categories: [],
                questions: [],
                disableLoading: false,
                auditTemplate: null,
                scoreDetails: [],
                savingNote: {
                    saving: false,
                    question_id: null,
                },
                auditDone: {
                    status: false,
                },
                showAuditIncomplete: false,
            };
        case types.CALL_AUDIT_OVERALL_DETAILS:
            return {
                ...state,
                callAuditOverallDetails: action.data,
            };
        case types.ACCOUNT_AUDIT_OVERALL_DETAILS:
            return {
                ...state,
                accountAuditOverallDetails: action.data,
            };
        case types.STORE_FILTER:
            return {
                ...state,
                filter: action.data,
            };
        case types.STORE_DELETED_FILTER:
            return {
                ...state,
                deletedFilters: action.data,
            };
        case types.STORE_CATEGORY_QUESTION_OBJ:
            return {
                ...state,
                questionList: { ...action.data },
            };
        case types.STORE_GLOBAL_EXPRESSIONS:
            return {
                ...state,
                globalExpressions: action.data,
            };
        case types.LOADING:
            return {
                ...state,
                loading: action.flag,
            };
        case types.STORE_AI_AUDIT_SCORE:
            return {
                ...state,
                aiAuditScore: action.data,
            };
        case types.SET_SEARCH_AUDIT_TEMPLATE:
            return {
                ...state,
                searchAuditTemplate: action.data,
            };
        case types.SET_LEAD_SCORE_FOR_TEMPLATE:
            return {
                ...state,
                leadScore: action.data,
            };
        case types.STORE_FILTER_SEETINGS_TEMPLATE:
            return {
                ...state,
                filtersSettings: { ...state.filtersSettings, ...action.data },
            };
        case types.SET_IS_ACCOUNT_LEVEL:
            return {
                ...state,
                isAccountLevel: action.flag,
            };
        case types.SET_RUN_COMMAND_LOADING:
            return {
                ...state,
                runCommandLoading: action.flag,
            };
        case types.SET_PARAMETERS_LOADING:
            return {
                ...state,
                parametersLoading: action.flag,
            };
        case types.STORE_WORD_CLOUD:
            return {
                ...state,
                word_cloud: action.data,
            };
        case types.SET_SCORE_DETAILS_LOADING:
            return {
                ...state,
                scoreDetailsLoading: action.payload,
            };

        default:
            return state;
    }
}
