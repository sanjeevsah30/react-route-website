import initialState from "../initialState";
import {
    STORE_AVAILABLE_SUBSCRIPTION,
    STORE_DESIGNATIONS,
    STORE_INVITED_USERS,
    STORE_CRM_SHEETS,
    STORE_THIRD_PARTY_INTEGRATIONS,
    SET_DEFAULT_CRM_SHEET,
} from "./types";

export default function settingsReducer(state = initialState.settings, action) {
    switch (action.type) {
        case STORE_DESIGNATIONS:
            return {
                ...state,
                designations: action.designations,
            };
        case STORE_INVITED_USERS:
            return {
                ...state,
                invited: action.invited,
            };
        case STORE_AVAILABLE_SUBSCRIPTION:
            return {
                ...state,
                available_subscriptions: action.payload,
            };
        case STORE_CRM_SHEETS:
            return {
                ...state,
                crm_sheets: action.payload,
            };
        case STORE_THIRD_PARTY_INTEGRATIONS:
            return {
                ...state,
                third_party_integrations: action.payload,
            };
        case SET_DEFAULT_CRM_SHEET:
            return {
                ...state,
                default_crm_sheet: action.payload,
            };

        default:
            return state;
    }
}
