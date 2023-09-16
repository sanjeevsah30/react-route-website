import initialState from "../initialState";
import * as types from "./types";

export default function statsReducer(state = initialState.stats, action) {
    switch (action.type) {
        case types.STORE_IDEAL_RANGES:
            return {
                ...state,
                idealRanges: action.idealRanges,
            };
        case types.STORE_TOPIC_DURATION:
            return {
                ...state,
                topicDuration: { ...action.data },
            };
        case types.TOPIC_SNIPPETS_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
}
