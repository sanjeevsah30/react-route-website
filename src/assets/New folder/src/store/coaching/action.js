import * as types from "./types";
import apiErrors from "@apis/common/errors";
import { openNotification } from "../common/actions";
import * as coachingApis from "@apis/coaching/index";
import { months, yearlyCoachingSessions } from "../../tools/helpers";
import { setCoachingSession } from "./coaching.store";

// const createCards = (response) => {

//     const cards = {}
//     response?.results?.length && response?.results?.forEach((item, index) => {
//         // console.log(item)
//         // console.log(cards)
//         const date = new Date(`${item.created_at}`);
//         const tempMonth = date.getMonth() // ( january gives 0 )

//         if (months[tempMonth] && !cards[months[tempMonth]]) {
//             cards[months[tempMonth]] = [];
//             cards[months[tempMonth]].push(item);
//             // console.log(cards)
//         }
//         else if (cards[months[tempMonth]]) {
//             cards[months[tempMonth]].push(item);
//         }
//     })
//     return cards;
// }

function fetchCoachingSessionRequest() {
    return {
        type: types.FETCH_COACHING_SESSION_REQUEST,
    };
}

export function fetchCoachingSessionSuccess(coachingSessions) {
    // console.log('coachingSessions', coachingSessions)
    return {
        type: types.FETCH_COACHING_SESSION_SUCCESS,
        payload: coachingSessions,
    };
}

function fetchCoachingSessionFaliure(error) {
    return {
        type: types.FETCH_COACHING_SESSION_FALIURE,
        payload: error,
    };
}

function fetchOneSessionRequest() {
    return {
        type: types.FETCH_ONE_SESSION_REQUEST,
    };
}

export function fetchOneSessionSuccess(session) {
    console.log(session);
    return {
        type: types.FETCH_ONE_SESSION_SUCCESS,
        payload: session,
    };
}

function fetchOneSessionFaliure(error) {
    return {
        type: types.FETCH_ONE_SESSION_FALIURE,
        payload: error,
    };
}

function fetchModuleRequest() {
    return {
        type: types.FETCH_MODULE_REQUEST,
    };
}

function fetchModuleSuccess(mediaData) {
    return {
        type: types.FETCH_MODULE_SUCCESS,
        payload: mediaData,
    };
}

function fetchModuleFaliure(error) {
    return {
        type: types.FETCH_MODULE_FALIURE,
        payload: error,
    };
}

function fetchClipRequest() {
    return {
        type: types.FETCH_CLIP_REQUEST,
    };
}

function fetchClipSuccess(mediaData) {
    return {
        type: types.FETCH_CLIP_SUCCESS,
        payload: mediaData,
    };
}

function fetchClipFaliure(error) {
    return {
        type: types.FETCH_CLIP_FALIURE,
        payload: error,
    };
}

const fetchClip = (payload) => {
    return function (dispatch, getState) {
        dispatch(fetchClipRequest());
        coachingApis.getClip(getState().common.domain, payload).then((res) => {
            // console.log(res)
            dispatch(fetchClipSuccess(res));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                fetchClipFaliure(res.message);
                openNotification("error", "Error", res.message);
            }
            return res;
        });
    };
};
const fetchModule = (payload) => {
    return function (dispatch, getState) {
        dispatch(fetchModuleRequest());
        coachingApis
            .getModule(getState().common.domain, payload)
            .then((res) => {
                dispatch(fetchModuleSuccess(res));
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    fetchModuleFaliure(res.message);
                    openNotification("error", "Error", res.message);
                }
                return res;
            });
    };
};

const fetchOneSession = (params) => {
    return function (dispatch, getState) {
        dispatch(fetchOneSessionRequest());
        coachingApis
            .getOneSession(getState().common.domain, params)
            .then((res) => {
                dispatch(fetchModule(res?.module?.[0]?.id));
                console.log(res);
                dispatch(fetchOneSessionSuccess(res));
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    fetchOneSessionFaliure(res.message);
                    openNotification("error", "Error", res.message);
                }
                return res;
            });
    };
};

const fetchCoaching = () => {
    return function (dispatch, getState) {
        dispatch(fetchCoachingSessionRequest());
        coachingApis
            .getCoachingSessions(getState().common.domain)
            .then((res) => {
                // const cards = createCards(res)

                dispatch(fetchCoachingSessionSuccess({ ...res, results: res }));
                // dispatch(fetchCoachingSessionSuccess(cards));
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    fetchCoachingSessionFaliure(res.message);
                    openNotification("error", "Error", res.message);
                }
                return res;
            });
    };
};

const fetchClipStatus = (payload, id) => {
    return function (dispatch, getState) {
        coachingApis
            .setClipStatus(getState().common.domain, payload, id)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    fetchCoachingSessionFaliure(res.message);
                    openNotification("error", "Error", res.message);
                } else {
                    // console.log(res)
                    dispatch(fetchModuleSuccess(res.module));
                    // dispatch(fetchOneSessionSuccess(res.session));
                    dispatch(setCoachingSession(res.session));
                }
            });
    };
};

export {
    fetchCoaching,
    fetchOneSession,
    fetchModule,
    fetchClip,
    fetchClipStatus,
};
