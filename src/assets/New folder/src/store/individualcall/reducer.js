import initialState from "../initialState";
import * as types from "./types";

export default function individualCallReducer(
    state = initialState.individualcall,
    action
) {
    switch (action.type) {
        case types.STORE_ACTION_ITEMS:
            return {
                ...state,
                actionItems: action.actionItems,
            };
        case types.STORE_ACTUAL_TRANSCRIPT:
            return {
                ...state,
                actualTranscript: action.actualTranscript,
            };
        case types.STORE_CLUBBED_TRANSCRIPT:
            return {
                ...state,
                clubbedTranscript: action.clubbedTranscript,
            };
        case types.STORE_CALL_DETAILS:
            return {
                ...state,
                callDetails: action.callDetails,
            };
        case types.STORE_CALL_ID:
            return {
                ...state,
                callId: action.callId,
            };
        case types.STORE_MOMENTS:
            return {
                ...state,
                moments: action.moments,
            };
        case types.STORE_QUESTIONS:
            return {
                ...state,
                questions: action.questions,
            };
        case types.STORE_TOPICS:
            return {
                ...state,
                topics: action.topics,
            };
        case types.STORE_MONOLOGUE_TOPICS:
            return {
                ...state,
                monologueTopics: action.monologueTopics,
            };
        case types.STORE_MONOLOGUES:
            return {
                ...state,
                monologues: action.monologues,
            };
        case types.STORE_INDIVIDUAL_CALLS:
            return {
                ...state,
                ...action.data,
            };
        case types.SET_CALL_COMMENTS:
            return {
                ...state,
                callComments: {
                    ...state.callComments,
                    comments: action.data,
                },
            };
        case types.SET_CALL_COMMENT_TO_REPLY:
            return {
                ...state,
                callComments: {
                    ...state.callComments,
                    activeComment: {
                        ...state.callComments.activeComment,
                        ...action.data,
                    },
                },
            };
        case types.SET_CALL_COMMENTS_LOADER:
            return {
                ...state,
                callComments: {
                    ...state.callComments,
                    loading: action.flag,
                },
            };
        case types.STORE_SNIPPETS:
            return {
                ...state,
                snippets: { ...state.snippets, ...action.data },
            };
        case types.SET_SNIPPET_TO_UPDATE:
            return {
                ...state,
                snippetToUpdate: action.data,
            };
        default:
            return state;
    }
}
