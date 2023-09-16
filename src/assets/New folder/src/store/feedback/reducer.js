import initialState from "../initialState";
import * as types from "./types";

export default function feedBackReducer(state = initialState.feedback, action) {
    switch (action.type) {
        case types.STOREQUESTION:
            return {
                ...state,
                questions: action.questions,
            };
        case types.STOREALLFEEDBACKS:
            return {
                ...state,
                all_feedbacks: action.feedbacks,
            };
        case types.STOREUSERFEEDBACKS:
            return {
                ...state,
                user_feedbacks: action.feedbacks,
            };
        case types.STOREALLNOTES:
            return {
                ...state,
                all_notes: action.feedbacks,
            };
        case types.STORE_ALL_FB_CATEGORIES:
            return {
                ...state,
                all_categories: action.categories,
            };
        case types.SET_ACTIVE_FB_CATEGORY:
            return {
                ...state,
                all_feedbacks: [],
                user_feedbacks: {},
                active_category: action.active,
                active_category_name:
                    state?.all_categories.find(
                        (cat) => cat.id === action.active
                    )?.name || "",
            };
        case types.SET_FB_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        case types.SET_NOTES_LOADING: {
            return {
                ...state,
                isNotesLoading: action.loading,
            };
        }
        default:
            return state;
    }
}
