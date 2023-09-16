import initialState from "@store/initialState";
import * as types from "./types";
export default function ciReducer(state = initialState.ci, action) {
    switch (action.type) {
        case types.SET_CI_LOADING:
            return {
                ...state,
                isLoading: action.loading,
            };
        case types.SET_GRAPH_LOADER:
            return {
                ...state,
                graphLoading: action.loading,
            };
        case types.SET_SNIPPET_LOADER:
            return {
                ...state,
                snippetLoading: action.loading,
            };
        case types.STORE_TABS:
            return {
                ...state,
                tabs: action.tabs,
            };
        case types.SET_GRAPH_DATA:
            return {
                ...state,
                graphData: action.graphData,
            };
        case types.SET_LOADING_EDITING_CI:
            return {
                ...state,

                loading_editing_phrase: action.flag,
            };
        case types.SET_LOADING_PHRASES_CI:
            return {
                ...state,

                loading_phrases: action.flag,
            };
        case types.SET_LOADING_TABS_CI:
            return {
                ...state,

                loading_tabs: action.flag,
            };
        default:
            return state;
    }
}
