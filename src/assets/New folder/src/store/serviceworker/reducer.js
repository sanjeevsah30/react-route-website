import { SW_INIT, SW_UPDATE, SW_SHOW_NOTIFICATION } from "./types";
import initialState from "../initialState";

export default function serviceWorkerReducer(
    state = initialState.serviceWorker,
    action
) {
    switch (action.type) {
        case SW_INIT:
            return {
                ...state,
                serviceWorkerInitialized: !state.serviceWorkerInitialized,
            };
        case SW_UPDATE:
            return {
                ...state,
                serviceWorkerUpdated: !state.serviceWorkerUpdated,
                serviceWorkerRegistration: action.payload,
            };
        case SW_SHOW_NOTIFICATION:
            return {
                ...state,
                serviceWorkerUpdated: action.show,
            };
        default:
            return state;
    }
}
