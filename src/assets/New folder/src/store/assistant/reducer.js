import initialState from "../initialState";
import * as types from "./types";

export default function assistantReducer(
    state = initialState.assistant,
    action
) {
    switch (action.type) {
        case types.STORE_BOT_SETTINGS:
            return {
                ...state,
                bot: action.bot,
            };
        case types.STORE_RECORDER_SETTINGS:
            return {
                ...state,
                recorder: action.recorder,
            };
        default:
            return state;
    }
}
