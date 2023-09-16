import initialState from "../initialState";
import * as types from "./types";

export default function callsReducer(state = initialState.calls, action) {
    switch (action.type) {
        case types.SET_LOADER:
            return {
                ...state,
                loading: action.status,
            };
        case types.SET_UPDATING_CALL:
            return {
                ...state,
                updatingCall: action.status,
            };
        case types.SET_UPDATING_SIDEBAR:
            return {
                ...state,
                updatingSidebar: action.status,
            };
        case types.SET_UPDATING_TAGS:
            return {
                ...state,
                updatingTags: action.status,
            };
        case types.STORE_SIDEBAR:
            return {
                ...state,
                sidebar: action.data,
            };
        case types.STORE_COMPLETED_CALLS:
            return {
                ...state,
                completed: action.calls,
            };
        case types.STORE_SEARCH_FIELDS:
            return {
                ...state,
                fields: action.fields,
            };
        case types.STORE_UPCOMING_CALLS:
            return {
                ...state,
                upcomingCalls: action.calls,
            };
        case types.STORE_COMPLETED_NEXT_URL:
            return {
                ...state,
                completedNextUrl: action.url,
            };
        case types.SET_UPCOMMING_CALLS_FILTERS:
            return {
                ...state,
                upcomingCallsFilters: {
                    ...state.upcomingCallsFilters,
                    ...action.payload,
                },
            };
        case types.SET_UPCOMMING_CALLS_ACTIVE_TEAM_FILTER:
            return {
                ...state,
                upcomingCallsFilters: {
                    ...state.upcomingCallsFilters,
                    filterTeams: {
                        teams: [
                            ...state.upcomingCallsFilters.filterTeams.teams,
                        ],
                        active: action.payload,
                    },
                },
            };
        case types.SET_UPCOMMING_CALLS_PARTICIPANTS_FILTERS:
            return {
                ...state,
                upcomingCallsFilters: {
                    ...state.upcomingCallsFilters,
                    filterReps: {
                        reps: [...state.upcomingCallsFilters.filterReps.reps],
                        active: action.payload,
                    },
                },
            };
        default:
            return state;
    }
}
