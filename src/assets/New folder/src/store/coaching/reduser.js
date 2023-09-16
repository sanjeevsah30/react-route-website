import * as types from "./types";

const initialState = {
    coaching: {
        coaching_loading: false,
        coaching_sessions: [],
        error: "",
        session: {
            session_loading: false,
            session_data: {},
            error: "",
        },
        oneModule: {
            module_loading: false,
            module_data: {},
            error: "",
        },
        clip: {
            clip_loading: false,
            clip_data_: {},
            error: "",
        },
    },
};
function coachingReduser(state = initialState.coaching, action) {
    switch (action.type) {
        case types.FETCH_COACHING_SESSION_REQUEST:
            return {
                ...state,
                coaching_loading: true,
            };
        case types.FETCH_COACHING_SESSION_SUCCESS:
            return {
                ...state,
                coaching_loading: false,
                coaching_sessions: action.payload,
            };
        case types.FETCH_COACHING_SESSION_FALIURE:
            return {
                ...state,
                coaching_loading: false,
                coaching_sessions: [],
                error: action.payload,
            };
        case types.FETCH_ONE_SESSION_REQUEST:
            return {
                ...state,
                session: {
                    session_loading: true,
                },
            };
        case types.FETCH_ONE_SESSION_SUCCESS:
            return {
                ...state,
                session: {
                    session_loading: false,
                    session_data: action.payload,
                },
            };
        case types.FETCH_ONE_SESSION_FALIURE:
            return {
                ...state,
                session: {
                    session_loading: false,
                    session_data: {},
                    error: action.payload,
                },
            };
        case types.FETCH_MODULE_REQUEST:
            return {
                ...state,
                oneModule: {
                    module_loading: true,
                },
            };
        case types.FETCH_MODULE_SUCCESS:
            return {
                ...state,
                oneModule: {
                    module_loading: false,
                    module_data: action.payload,
                },
            };
        case types.FETCH_MODULE_FALIURE:
            return {
                ...state,
                oneModule: {
                    module_loading: false,
                    module_data: {},
                    error: action.payload,
                },
            };
        case types.FETCH_CLIP_REQUEST:
            return {
                ...state,
                clip: {
                    clip_loading: true,
                },
            };
        case types.FETCH_CLIP_SUCCESS:
            return {
                ...state,
                clip: {
                    clip_loading: false,
                    clip_data: action.payload,
                },
            };
        case types.FETCH_CLIP_FALIURE:
            return {
                ...state,
                clip: {
                    clip_loading: false,
                    clip_data: {},
                    error: action.payload,
                },
            };
        default:
            return state;
    }
}

export default coachingReduser;
