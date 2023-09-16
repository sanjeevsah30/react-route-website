import * as types from "./types";
import apiErrors from "@apis/common/errors";
import { setLoader, openNotification } from "../common/actions";
import * as libraryapi from "@apis/library";
import {
    LibCategories,
    LibMeetings,
} from "app/components/Library/__mock__/mockData";

function storeCategories(categories) {
    return {
        type: types.STORE_CATEGORIES,
        categories,
    };
}

export function cleanupSubcategories() {
    let subcategories = [];
    return {
        type: types.STORE_SUBCATEGORIES,
        subcategories,
    };
}

export function setSelectedFolder(id) {
    return {
        type: types.SELECT_FOLDER,
        id,
    };
}

export function storeMeetings(meetings) {
    return {
        type: types.SET_MEETINGS,
        meetings,
    };
}

export function setActiveSubCategory(id) {
    return {
        type: types.SET_ACTIVE_SUBFOLDER,
        id,
    };
}

export function setIsSample(status) {
    return {
        type: types.SET_IS_SAMPLE,
        status,
    };
}

export function getCategories() {
    return (dispatch, getState) => {
        dispatch(setLoader(true));

        libraryapi.getCategoriesAjx(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                if (res.results.length) {
                    dispatch(storeCategories(res.results));
                } else {
                    dispatch(setIsSample(true));
                    dispatch(storeCategories(LibCategories));
                }
                // if (res.results.length) {
                //     dispatch(setSelectedFolder(res.results[0].id));
                // }
            }
            dispatch(setLoader(false));
        });
    };
}

export function createCategory(category) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        const data = {
            name: category,
        };
        return libraryapi
            .createCategoryAjx(getState().common.domain, data)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    openNotification(
                        "success",
                        "Success",
                        "Folder created successfully!"
                    );
                    const existingCategories = getState().library.categories;
                    res.total_subcategories = 1;
                    const categories =
                        !getState().library.sample && existingCategories.length
                            ? [...existingCategories, res]
                            : [res];
                    dispatch(storeCategories(categories));
                    dispatch(setSelectedFolder(res.id));
                    dispatch(setIsSample(false));
                }
                dispatch(setLoader(false));
                return res;
            });
    };
}

export function addNewMeeting(playerData, formData, callData) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        const data = {
            note: formData.Note.value,
            category: formData.Folder.value,
            start_time: playerData.startTime,
            end_time: playerData.stopAt,
            meeting: callData.id,
        };
        libraryapi
            .addNewMeetingAjx(getState().common.domain, data)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    openNotification(
                        "success",
                        "Success",
                        "Snippet has been added to library successfully"
                    );
                }
                dispatch(setLoader(false));
            });
    };
}

export function getMeetings(selectedFolder) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        libraryapi
            .getMeetingsAjx(getState().common.domain, selectedFolder)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    if (!res?.results?.length && getState().library.sample) {
                        dispatch(storeMeetings(LibMeetings));
                    } else {
                        dispatch(storeMeetings(res.results));
                    }
                }
                dispatch(setLoader(false));
            });
    };
}

export function updateMeeting(data, id, property, operation) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        let libMeetings = JSON.parse(
            JSON.stringify(getState().library.meetings)
        );
        let currentMeetingIdx = libMeetings.findIndex(
            (libMeeting) => libMeeting.id === id
        );
        let currentMeeting = libMeetings[currentMeetingIdx];
        let ajxData = {};

        if (property === "tags") {
            let tags = currentMeeting[property];
            if (operation === "add") {
                let dataToUpdate = tags.length ? [...tags, data] : [data];
                ajxData = {
                    [property]: dataToUpdate.map((it) => it.id),
                };
            } else if (operation === "remove") {
                let tagToRemove = tags.findIndex((tag) => tag.id === data.id);
                tags.splice(tagToRemove, 1);
                ajxData = {
                    [property]: tags.map((tag) => tag.id),
                };
            }
        }

        if (property === "call_types") {
            ajxData = {
                call_types: data.id,
            };
        }

        libraryapi
            .updateMeetingAjx(getState().common.domain, ajxData, id)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    libMeetings[currentMeetingIdx] = res;
                    dispatch(storeMeetings(libMeetings));
                }
                dispatch(setLoader(false));
            });
    };
}

export function deleteMeeting(id) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        libraryapi
            .deleteMeetingAjx(getState().common.domain, id)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    openNotification(
                        "success",
                        "Success",
                        "Meeting deleted successfully"
                    );
                    let libMeetings = JSON.parse(
                        JSON.stringify(getState().library.meetings)
                    );
                    let currentMeetingIdx = libMeetings.findIndex(
                        (libMeeting) => libMeeting.id === id
                    );
                    libMeetings.splice(currentMeetingIdx, 1);
                    dispatch(storeMeetings(libMeetings));
                }
                dispatch(setLoader(false));
            });
    };
}

export function shareFolder(id, share_with) {
    return (dispatch, getState) => {
        return libraryapi
            .shareFolderAjx(getState().common.domain, {
                id: id,
                share_with: share_with.map((user) => user.id),
            })
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    openNotification(
                        "success",
                        "Success",
                        "Users watching this folder updated successfully"
                    );
                    let existingCategories = JSON.parse(
                        JSON.stringify(getState().library.categories)
                    );
                    let currentCategoryIdx = existingCategories.findIndex(
                        (category) => category.id === id
                    );
                    existingCategories[currentCategoryIdx].shared_with =
                        share_with;
                    dispatch(storeCategories(existingCategories));
                }
                return res;
            });
    };
}
