import initialState from "../initialState";
import * as types from "./types";

export default function userReducer(state = initialState.auth, action) {
    switch (action.type) {
        case types.STOREUSER:
            return {
                ...state,
                ...action.userData,
            };
        case types.ISAUTHENTICATED:
            return {
                ...state,
                isAuthenticated: action.isAuthenticated,
                isChecking: false,
            };
        case types.ISCHECKING:
            return {
                ...state,
                isChecking: action.isChecking,
            };
        case types.LOGOUTUSER:
            return {
                ...state,
                isAuthenticated: false,
                isChecking: false,
            };
        case types.SETFORMERROR:
            return {
                ...state,
                formError: action.error,
            };
        case types.IS_SIGNUP:
            return {
                ...state,
                isSignUp: action.isSignUp,
            };
        case types.IS_SIGNUP_CONFLICT:
            return {
                ...state,
                hasConflict: action.hasConflict,
            };
        default:
            return state;
    }
}
