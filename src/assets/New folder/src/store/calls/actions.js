import * as types from "./types";
import apiErrors from "@apis/common/errors";
import { openNotification } from "../common/actions";
import { storeSearchCalls } from "../search/actions";
import * as callApis from "@apis/calls/index";
import * as searchApis from "@apis/search";
import { prepareCallData } from "./utils";
import { cloneDeep } from "lodash";
import callsConfig from "@constants/MyCalls/index";
import commonConfig from "@constants/common/index";
import { checkBot, getTeamReps, joinCall } from "@apis/topbar/index";
import { setFetching, storeCalls } from "@store/callListSlice/callListSlice";

function storeCompletedCalls(calls) {
    return {
        type: types.STORE_COMPLETED_CALLS,
        calls,
    };
}

function storeUpcomingCalls(calls) {
    return {
        type: types.STORE_UPCOMING_CALLS,
        calls,
    };
}

function storeSidebar(data) {
    return {
        type: types.STORE_SIDEBAR,
        data,
    };
}

function setLoader(status) {
    return {
        type: types.SET_LOADER,
        status,
    };
}

function setUpdatingCall(status) {
    return {
        type: types.SET_UPDATING_CALL,
        status,
    };
}

function setUpdatingTags(status) {
    return {
        type: types.SET_UPDATING_TAGS,
        status,
    };
}

export function setUpdatingSidebar(status) {
    return {
        type: types.SET_UPDATING_SIDEBAR,
        status,
    };
}

function storeCompletedNextUrl(url) {
    return {
        type: types.STORE_COMPLETED_NEXT_URL,
        url,
    };
}

export function getCallById(id) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        return callApis
            .getCallByIdAjx(getState().common.domain, id)
            .then((res) => {
                dispatch(setLoader(false));
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                }
                return res;
            });
    };
}

export function getCompletedCalls(data) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        dispatch(setUpdatingSidebar(true));
        return searchApis
            .getSearchResults({
                domain: getState().common.domain,
                data: prepareCallData(data),
            })
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(storeCompletedCalls(res.results));
                    dispatch(storeCompletedNextUrl(res.next));
                }
                dispatch(setLoader(false));
                dispatch(setUpdatingSidebar(false));
                return res;
            });
    };
}

export function getUpcomingCalls(data, next) {
    return (dispatch, getState) => {
        next || dispatch(setLoader(true));
        dispatch(setUpdatingSidebar(true));
        return callApis
            .getUpcomingCallsApi(getState().common.domain, data, next)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(
                        storeUpcomingCalls(
                            next
                                ? {
                                      ...res,
                                      results: [
                                          ...getState().calls.upcomingCalls
                                              .results,
                                          ...res.results,
                                      ],
                                  }
                                : res
                        )
                    );
                }
                dispatch(setLoader(false));
                dispatch(setUpdatingSidebar(false));
                return res;
            });
    };
}

export function changeCompletedCallType(callId, call_types) {
    // call_type: +callTypeId

    return (dispatch, getState) => {
        dispatch(setUpdatingCall(true));
        let prevexistingCalls = cloneDeep(getState().search.calls);
        let existingCalls = cloneDeep(getState().search.calls);
        let callToUpdate = existingCalls.findIndex(
            (call) => call.id === callId
        );

        existingCalls[callToUpdate] = {
            ...existingCalls[callToUpdate],
            call_types: { id: call_types },
        };
        dispatch(storeSearchCalls(existingCalls));
        return callApis
            .changeCompletedCallType(
                getState().common.domain,
                callId,
                call_types
            )
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(storeSearchCalls(prevexistingCalls));
                } else {
                }
                dispatch(setUpdatingCall(false));
            });
    };
}

export function changeUpcomingCallType(callId, call_types) {
    return (dispatch, getState) => {
        dispatch(setUpdatingCall(true));
        return callApis
            .changeUpcomingCallType(
                getState().common.domain,
                callId,
                call_types
            )
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    let existingCalls = cloneDeep(
                        getState().calls.upcomingCalls.results
                    );
                    let callToUpdate = existingCalls.findIndex(
                        (call) => call.id === callId
                    );
                    existingCalls[callToUpdate] = res;
                    dispatch(
                        storeUpcomingCalls({
                            ...getState().calls.upcomingCalls,
                            results: [...existingCalls],
                        })
                    );
                }
                dispatch(setUpdatingCall(false));
            });
    };
}

export function getNextCalls(type, data) {
    return (dispatch, getState) => {
        const url =
            type === callsConfig.COMPLETED_TYPE
                ? getState().calls.completedNextUrl
                : getState().calls.upcomingNextUrl;
        return callApis
            .getNextCalls(url, type, prepareCallData(data))
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    let existingCalls = cloneDeep(getState().calls.completed);
                    dispatch(
                        storeCompletedCalls([...existingCalls, ...res.results])
                    );
                    dispatch(storeCompletedNextUrl(res.next));
                }
                return res;
            });
    };
}

export function updateMeetingTags(tag, id, type, operation) {
    return (dispatch, getState) => {
        tag = tag?.value ? { ...tag, tag_name: tag.value } : tag;
        const domain = getState().common.domain;
        let ajaxData = {
            tags: [],
        };
        if (type === callsConfig.COMPLETED_TYPE) {
            let existingCalls = cloneDeep(getState().search.calls);
            let callToUpdate = existingCalls.findIndex(
                (call) => call.id === id
            );
            let tags = existingCalls[callToUpdate]?.tags || [];
            if (operation === "add") {
                ajaxData.tags = tags.length ? [...tags, tag] : [tag];
            } else {
                let filterdTags = tags.filter((t) => t.tag_name !== tag);

                ajaxData.tags = [...filterdTags];
            }

            existingCalls[callToUpdate].tags = ajaxData.tags;
            ajaxData.tags = ajaxData.tags.map((tag) => tag.id);
            dispatch(storeSearchCalls(cloneDeep(existingCalls)));
            callApis.updateCompletedTags(domain, id, ajaxData).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    existingCalls[callToUpdate].tags = tags;
                    dispatch(storeSearchCalls(existingCalls));
                } else {
                    dispatch(updateSidebarData(res, type, false));
                }
                dispatch(setUpdatingTags(false));
            });
        } else if (type === callsConfig.UPCOMING_TYPE) {
            let existingCalls = cloneDeep(getState().calls.upcoming);
            let callToUpdate = existingCalls.findIndex(
                (call) => call.id === id
            );
            let tags = existingCalls[callToUpdate].tags;
            if (operation === "add") {
                ajaxData.tags = tag.value || tag.tag_name;
                callApis.addUpcomingTags(domain, id, ajaxData).then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    } else {
                        existingCalls[callToUpdate].tags = res.tags;
                        dispatch(storeUpcomingCalls(existingCalls));
                        dispatch(
                            updateSidebarData(
                                existingCalls[callToUpdate],
                                type,
                                false
                            )
                        );
                    }
                    // dispatch(setUpdatingTags(false));
                });
            } else {
                let tagToRemove = tags.find((t) => t.tag_name === tag);
                callApis
                    .deleteUpcomingTags(domain, id, tagToRemove.id)
                    .then((res) => {
                        if (res.status === apiErrors.AXIOSERRORSTATUS) {
                            openNotification("error", "Error", res.message);
                        } else {
                            existingCalls[callToUpdate].tags = res.tags;
                            dispatch(storeUpcomingCalls(existingCalls));
                            dispatch(
                                updateSidebarData(
                                    existingCalls[callToUpdate],
                                    type,
                                    false
                                )
                            );
                            openNotification(
                                "success",
                                "Success",
                                "Call uploaded successfully"
                            );
                        }
                        // dispatch(setUpdatingTags(false));
                    });
            }
        }
    };
}

export function reInitSidebar(type) {
    return (dispatch) => {
        dispatch(
            storeSidebar({
                callId: 0,
                note: "",
                isReadOnly: false,
                noteDate: "",
                [callsConfig.UPCOMING_TYPE]: false,
                [callsConfig.COMPLETED_TYPE]: false,
                [callsConfig.ONGOING_TYPE]: false,
                showAddTag: false,
                showMoreComments: false,
                comments: [],
                tags: [],
                [type]: true,
            })
        );
    };
}

export function updateSidebarData(call, type, showLoader = true) {
    return (dispatch, getState) => {
        dispatch(setUpdatingSidebar(showLoader));
        let user = getState().auth;
        let existingSidebar = {
            callId: call.id,
            [callsConfig.UPCOMING_TYPE]: false,
            [callsConfig.COMPLETED_TYPE]: false,
            [callsConfig.ONGOING_TYPE]: false,
            note: call.note,
            isReadOnly:
                user.id === call.owner?.id ||
                user.designation === commonConfig.ADMIN
                    ? false
                    : true,
            showAddTag:
                user.id === call.owner?.id ||
                user.designation === commonConfig.ADMIN
                    ? true
                    : false,
            comments: [],
            showMoreComments: false,
            [type]: true,
            tags: call.tags,
        };
        if (type === callsConfig.UPCOMING_TYPE) {
            callApis
                .getUpcomingComments(getState().common.domain, call.id)
                .then((res) => {
                    existingSidebar = {
                        ...existingSidebar,
                        comments: res.results,
                    };
                    dispatch(storeSidebar(existingSidebar));
                    dispatch(setUpdatingSidebar(false));
                });
        } else if (type === callsConfig.COMPLETED_TYPE) {
            callApis
                .getCompletedComments(getState().common.domain, call.id)
                .then((res) => {
                    existingSidebar = {
                        ...existingSidebar,
                        comments: res.results,
                    };
                    dispatch(storeSidebar(existingSidebar));
                    dispatch(setUpdatingSidebar(false));
                });
        }
    };
}

export function updateSidebarNote(note, type) {
    return (dispatch, getState) => {
        const domain = getState().common.domain;
        if (type === callsConfig.UPCOMING_TYPE) {
            return callApis
                .addUpcomingNotes(domain, getState().calls.sidebar.callId, note)
                .then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    } else {
                        let existingCalls = cloneDeep(
                            getState().calls.upcoming
                        );
                        let callToUpdate = existingCalls.findIndex(
                            (call) =>
                                call.id === getState().calls.sidebar.callId
                        );
                        existingCalls[callToUpdate].note = note;
                        dispatch(storeUpcomingCalls(existingCalls));
                    }
                    return res;
                });
        } else {
            return callApis
                .addCompletedNotes(
                    domain,
                    getState().calls.sidebar.callId,
                    note
                )
                .then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    } else {
                        let existingCalls = cloneDeep(
                            getState().calls.completed
                        );
                        let callToUpdate = existingCalls.findIndex(
                            (call) =>
                                call.id === getState().calls.sidebar.callId
                        );
                        existingCalls[callToUpdate].note = note;
                        dispatch(storeCompletedCalls(existingCalls));
                    }
                    return res;
                });
        }
    };
}

export function updateMeetingComments(type, data) {
    return (dispatch, getState) => {
        const domain = getState().common.domain;

        if (type === callsConfig.UPCOMING_TYPE) {
            return callApis
                .addUpcomingComments(
                    domain,
                    getState().calls.sidebar.callId,
                    data
                )
                .then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    } else {
                        let existingSidebar = cloneDeep(
                            getState().calls.sidebar
                        );
                        existingSidebar.comments = res.comments;
                        dispatch(storeSidebar(existingSidebar));
                    }
                    return res;
                });
        } else if (type === callsConfig.COMPLETED_TYPE) {
            return callApis
                .addCompletedComments(
                    domain,
                    getState().calls.sidebar.callId,
                    data
                )
                .then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    } else {
                        let existingSidebar = cloneDeep(
                            getState().calls.sidebar
                        );
                        existingSidebar.comments = res.comments;
                        dispatch(storeSidebar(existingSidebar));
                    }
                    return res;
                });
        }
    };
}

export function updateCommentsList(isDeleted, id, comment) {
    return (dispatch, getState) => {
        let existingSidebar = cloneDeep(getState().calls.sidebar);
        if (isDeleted) {
            existingSidebar.comments = existingSidebar.comments.filter(
                (t) => t.id !== id
            );
        } else {
            const cmtIdx = existingSidebar.comments.findIndex(
                (c) => c.id === id
            );
            existingSidebar.comments[cmtIdx] = comment;
        }
        dispatch(storeSidebar(existingSidebar));
    };
}

export function uploadNewCall(data, progressCallback) {
    return (dispatch, getState) => {
        return callApis
            .uploadCall(getState().common.domain, data, progressCallback)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    let existingCalls = cloneDeep(getState().calls.completed);
                    dispatch(storeSearchCalls([res, ...existingCalls]));
                }
                return res;
            });
    };
}

export function botJoinCall(url, callName, invitedClients) {
    return (dispatch, getState) => {
        return joinCall(
            getState().common.domain,
            url,
            callName,
            invitedClients
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else return res;
        });
    };
}

export function checkBotActive(url) {
    return (dispatch, getState) => {
        return checkBot(getState().common.domain, url).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else return res;
        });
    };
}

export function updateCallName(callId, title) {
    return (dispatch, getState) => {
        dispatch(setUpdatingCall(true));
        return callApis
            .updateCompletedMeeting(getState().common.domain, callId, {
                title: title,
            })
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    let existingCalls = cloneDeep(getState().calls.completed);
                    let callToUpdate = existingCalls.findIndex(
                        (call) => call.id === callId
                    );
                    existingCalls[callToUpdate] = res;
                    dispatch(storeCompletedCalls(existingCalls));
                }
                dispatch(setUpdatingCall(false));
            })
            .catch((err) => err);
    };
}

export function deleteCallMeeting(callId) {
    return (dispatch, getState) => {
        dispatch(setFetching(true));
        return callApis
            .deleteCompletedMeeting(getState().common.domain, callId)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setFetching(false));
                } else {
                    let title;
                    let newCalls = cloneDeep(
                        getState().callListSlice.calls
                    ).filter((call) => {
                        if (call.id === callId) title = call.title;
                        return call.id !== callId;
                    });
                    openNotification(
                        "success",
                        "Success",
                        `Meeting with title ${title} has been deleted`
                    );
                    dispatch(storeCalls(newCalls));
                }
                dispatch(setFetching(false));
            });
    };
}

export const setUpcomingCallsFilters = (payload) => {
    return {
        type: types.SET_UPCOMMING_CALLS_FILTERS,
        payload,
    };
};

export const setUpcomingCallsParticipantsFilters = (payload) => {
    return {
        type: types.SET_UPCOMMING_CALLS_PARTICIPANTS_FILTERS,
        payload,
    };
};

export const setUpcomingCallsActiveTeamFilter =
    (payload) => (dispatch, getState) => {
        dispatch({
            type: types.SET_UPCOMMING_CALLS_ACTIVE_TEAM_FILTER,
            payload,
        });
        return getTeamReps(getState().common.domain, payload).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                let mappedReps = res.results.map((rep, index) => {
                    return {
                        id: rep.id,
                        name: rep.first_name
                            ? rep.first_name
                            : rep.email
                            ? rep.email
                            : `Rep ${index + 1}`,
                        email: rep.email,
                    };
                });
                const updatedReps = [...mappedReps];
                dispatch(
                    setUpcomingCallsFilters({
                        filterReps: { reps: updatedReps, active: [] },
                    })
                );
            }
        });
    };
