import initialState from "../initialState";
import * as types from "./types";

export default function libraryReducer(state = initialState.library, action) {
    switch (action.type) {
        case types.STORE_CATEGORIES:
            return {
                ...state,
                categories: action.categories,
            };
        case types.STORE_SUBCATEGORIES:
            return {
                ...state,
                subcategories: action.subcategories,
            };
        case types.SET_ACTIVE_SUBFOLDER:
            return {
                ...state,
                activeSubCategory: action.id,
            };
        case types.SELECT_FOLDER:
            return {
                ...state,
                selectedFolder: action.id,
            };
        case types.SET_MEETINGS:
            return {
                ...state,
                meetings: action.meetings,
            };
        case types.SET_IS_SAMPLE:
            return {
                ...state,
                sample: action.status,
            };
        default:
            return state;
    }
}
