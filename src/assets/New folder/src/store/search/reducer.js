import initialState from "../initialState";
import * as types from "./types";

export default function callsReducer(state = initialState.search, action) {
    switch (action.type) {
        case types.STORE_FIELDS:
            return {
                ...state,
                fields: action.fields,
            };
        case types.STORE_CALLS:
            return {
                ...state,
                calls: action.calls,
            };
        case types.STORE_COUNT:
            return {
                ...state,
                count: action.count,
            };
        case types.STORE_NEXT_URL:
            return {
                ...state,
                next_url: action.next_url,
            };
        case types.STORE_TRACKERS:
            return {
                ...state,
                trackers: action.trackers,
            };
        case types.SET_FETCHING:
            return {
                ...state,
                fetchingCalls: action.status,
            };
        case types.STORE_SEARCH_URL:
            return {
                ...state,
                searchUrls: action.urls,
            };
        case types.STORE_CONF_TOOLS:
            return {
                ...state,
                confTools: action.confTools,
            };
        case types.SET_ACTIVE_SEARCH_VIEW:
            return {
                ...state,
                defaultView: action.payload,
            };
        case types.SET_SEARCH_FILTERS:
            return {
                ...state,
                searchFilters: {
                    ...state.searchFilters,
                    ...action.payload,
                },
            };
        case types.SET_ACTIVE_SEARCH_FILTERS:
            return {
                ...state,
                activeFilters: [...action.payload],
            };
        case types.SET_COMPLETED_CALLS_AS_DEFAULT:
            if (action.payload) {
                const [first, ...rest] = state.views;
                return {
                    ...state,
                    views: [{ ...first, is_default: true }, ...rest],
                };
            }

            return { ...state };

        case types.SET_SEARCH_VIEWS:
            const results = action.payload.handleDuplicates
                ? [...state.views, ...action.payload.views]
                : [...action.payload.views];
            const jsonObject = results.map(JSON.stringify);

            const uniqueSet = new Set(jsonObject);
            const uniqueArray = Array.from(uniqueSet).map(JSON.parse);
            return {
                ...state,
                views: [...uniqueArray],
            };
        case types.UPDATE_SEARCH_VIEWS:
            return {
                ...state,
                views: [...action.payload],
            };
        case types.CLEAR_SEARCH_FILTERS:
            return {
                ...state,
                searchFilters: {
                    ...state.defaultSearchFilters,
                },
            };
        case types.SET_DEFAULT_SEARCH_FILTERS:
            return {
                ...state,
                defaultSearchFilters: {
                    ...state.defaultSearchFilters,
                    ...action.payload,
                },
            };
        case types.SET_SAMPLING_RULES:
            return {
                ...state,
                samplingRules: [...action.payload],
                samplingRulesLoading: false,
            };
        case types.SET_ACTIVE_SAMPLING_RULE:
            return {
                ...state,
                activeSamplingRule: action.payload,
            };
        case types.SET_SAMPLING_RULES_LOADING:
            return { ...state, samplingRulesLoading: action.payload };
        default:
            return state;
    }
}
