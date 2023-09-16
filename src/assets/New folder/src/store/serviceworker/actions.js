import { SW_UPDATE, SW_SHOW_NOTIFICATION } from "./types";

export function updateServiceWorker(payload) {
    return {
        type: SW_UPDATE,
        payload,
    };
}

export function showUpdateNotification(show) {
    return {
        type: SW_SHOW_NOTIFICATION,
        show,
    };
}
