import apiErrors from "@apis/common/errors";
import { setLoader, openNotification, storeTeams } from "../common/actions";
import * as teamsApi from "@apis/teams";
import {
    changeDesignation,
    changeUserActiveAjx,
    changeUserManagerAjx,
    getAvailableCrmSheetsApi,
    getAvailableSubscriptionsApi,
    getDesignations,
    setDefaultCrmSheetApi,
    updateTeam,
    updateUserApi,
    updateUserType,
    getVoicePrintCsvApi,
    uploadVoicePrintCsvApi,
    getVoicePrintUploadStatusApi,
} from "@apis/settings/index";
import {
    SET_DEFAULT_CRM_SHEET,
    STORE_AVAILABLE_SUBSCRIPTION,
    STORE_CRM_SHEETS,
    STORE_DESIGNATIONS,
    STORE_INVITED_USERS,
    STORE_THIRD_PARTY_INTEGRATIONS,
} from "./types";
import {
    getInvitedUsersAjx,
    inviteUser,
    isTpIntegrated,
    sendInvitedReminder,
} from "@apis/authentication/index";
import { storeUsers } from "@store/common/actions";
import { updateUserMangerList } from "@store/userManagerSlice/userManagerSlice";

function storeDesignations(designations) {
    return {
        type: STORE_DESIGNATIONS,
        designations,
    };
}
function storeInvitedUsers(invited) {
    return {
        type: STORE_INVITED_USERS,
        invited,
    };
}

export function deleteTeamById(teamId) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        return teamsApi
            .deleteTeam(getState().common.domain, teamId)
            .then((res) => {
                dispatch(setLoader(false));
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    let existingTeams = JSON.parse(
                        JSON.stringify(getState().common.teams)
                    );
                    let teamToRemove = existingTeams.findIndex(
                        (team) => team.id === teamId
                    );
                    existingTeams.splice(teamToRemove, 1);
                    dispatch(storeTeams(existingTeams));
                }
                return res;
            });
    };
}

export function allDesignation() {
    return (dispatch, getState) => {
        getDesignations(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeDesignations(res));
            }
        });
    };
}

export function createNewUser(values) {
    return (dispatch, getState) => {
        let data = new FormData();
        data.append("email", values.email);
        data.append("role", values.role);
        data.append("designation", values.role);
        data.append("team", values.team);
        data.append("user_type", values.user_type);
        values.user_type && data.append("subscription", values.subscription);
        return inviteUser(getState().common.domain, data).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                openNotification(
                    "success",
                    "Success",
                    "Invitation mail sent to email id"
                );
                let existingUsers = JSON.parse(
                    JSON.stringify(getState().settings.invited)
                );
                dispatch(storeInvitedUsers([res, ...existingUsers]));
            }
            return res;
        });
    };
}

export function changeRole(userId, newRole) {
    return (dispatch, getState) => {
        return changeDesignation(
            getState().common.domain,
            userId,
            newRole
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                let existingUsers = JSON.parse(
                    JSON.stringify(getState().common.users)
                );
                let currentUserIdx = existingUsers.findIndex(
                    (user) => user.id === userId
                );
                existingUsers[currentUserIdx].role = newRole;
                openNotification(
                    "success",
                    "Success",
                    "Changes Saved Successfully!"
                );
                dispatch(storeUsers(existingUsers));
            }
            return res;
        });
    };
}

export function changeUserActive(userId, isActive) {
    return (dispatch, getState) => {
        return changeUserActiveAjx(
            getState().common.domain,
            userId,
            isActive
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                let existingUsers = JSON.parse(
                    JSON.stringify(getState().common.users)
                );
                let currentUserIdx = existingUsers.findIndex(
                    (user) => user.id === userId
                );
                existingUsers[currentUserIdx].is_active = isActive;
                openNotification(
                    "success",
                    "Success",
                    "Changes Saved Successfully!"
                );
                dispatch(storeUsers(existingUsers));
            }
            return res;
        });
    };
}
export function changeUserManager(userId, managerId) {
    return (dispatch, getState) => {
        return changeUserManagerAjx(
            getState().common.domain,
            userId,
            managerId
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                let existingUsers = JSON.parse(
                    JSON.stringify(getState().common.users)
                );
                let currentUserIdx = existingUsers.findIndex(
                    (user) => user.id === userId
                );

                existingUsers[currentUserIdx].manager = existingUsers.find(
                    (user) => user.id === managerId
                );
                openNotification(
                    "success",
                    "Success",
                    "Changes Saved Successfully!"
                );
                dispatch(storeUsers(existingUsers));
            }
            return res;
        });
    };
}
export function changeUserTeam(userId, teamId) {
    return (dispatch, getState) => {
        return updateTeam(getState().common.domain, userId, teamId).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    let existingUsers = JSON.parse(
                        JSON.stringify(getState().common.users)
                    );
                    let currentUserIdx = existingUsers.findIndex(
                        (user) => user.id === userId
                    );
                    // find team in existingUsers according to teamID
                    let existingTeams = JSON.parse(
                        JSON.stringify(getState().common.teams)
                    );
                    existingUsers[currentUserIdx].team =
                        existingTeams.find((team) => team.id === teamId) !==
                        undefined
                            ? existingTeams.find((team) => team.id === teamId)
                            : existingTeams.map((el) =>
                                  el?.subteams?.find((x) => x.id === teamId)
                              )[0];

                    openNotification(
                        "success",
                        "Success",
                        "Changes Saved Successfully!"
                    );
                    dispatch(storeUsers(existingUsers));
                }
                return res;
            }
        );
    };
}

export function changeUserType(userId, user_type) {
    return (dispatch, getState) => {
        return updateUserType(getState().common.domain, userId, user_type).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    let existingUsers = JSON.parse(
                        JSON.stringify(getState().common.users)
                    );
                    let currentUserIdx = existingUsers.findIndex(
                        (user) => user.id === userId
                    );
                    existingUsers[currentUserIdx].user_type = user_type;
                    openNotification(
                        "success",
                        "Success",
                        "Changes Saved Successfully!"
                    );
                    dispatch(storeUsers(existingUsers));
                    dispatch(getAvailableSubscription());
                }
                return res;
            }
        );
    };
}

export function updateUserRequest(userId, payload, callBack) {
    return (dispatch, getState) => {
        return updateUserApi(getState().common.domain, userId, payload).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification(
                        "error",
                        "Error",
                        payload.primary_phone ? res.message?.[0] : res.message
                    );
                } else {
                    let existingUsers = JSON.parse(
                        JSON.stringify(getState().userManagerSlice.allUsers)
                    );
                    let currentUserIdx = existingUsers.findIndex(
                        (user) => user.id === userId
                    );
                    existingUsers[currentUserIdx] = { ...res };
                    openNotification(
                        "success",
                        "Success",
                        "Changes Saved Successfully!"
                    );
                    if (typeof callBack === "function") callBack();
                    dispatch(storeUsers(existingUsers));
                    dispatch(updateUserMangerList(existingUsers));
                    dispatch(getAvailableSubscription());
                }
                return res;
            }
        );
    };
}

export function getInvitedUsers() {
    return (dispatch, getState) => {
        return getInvitedUsersAjx(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeInvitedUsers(res.results || []));
            }
            return res;
        });
    };
}
export function sendReminder(inviteId) {
    return (dispatch, getState) => {
        return sendInvitedReminder(getState().common.domain, inviteId).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    openNotification(
                        "success",
                        "Success",
                        "Reminder mail sent"
                    );
                }
                return res;
            }
        );
    };
}

export function getAvailableSubscription() {
    return (dispatch, getState) => {
        return getAvailableSubscriptionsApi(getState().common.domain).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch({
                        type: STORE_AVAILABLE_SUBSCRIPTION,
                        payload: res,
                    });
                }
                return res;
            }
        );
    };
}

export function getAvailableCrmSheets() {
    return (dispatch, getState) => {
        return getAvailableCrmSheetsApi(getState().common.domain).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch({
                        type: STORE_CRM_SHEETS,
                        payload: res,
                    });
                }
                return res;
            }
        );
    };
}

export function getThirdPartyIntegrations() {
    return (dispatch, getState) => {
        return isTpIntegrated(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                const find = res.find(
                    (party) => party.provider === "crm_sheet"
                );
                find && dispatch(getAvailableCrmSheets());
                dispatch({
                    type: STORE_THIRD_PARTY_INTEGRATIONS,
                    payload: res,
                });
                find &&
                    dispatch({
                        type: SET_DEFAULT_CRM_SHEET,
                        payload: find,
                    });
            }
            return res;
        });
    };
}

export function setDefaultCrmSheet(payload) {
    return (dispatch, getState) => {
        const previous = getState().settings.default_crm_sheet;
        dispatch({
            type: SET_DEFAULT_CRM_SHEET,
            payload,
        });
        return setDefaultCrmSheetApi(getState().common.domain, payload).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    dispatch({
                        type: SET_DEFAULT_CRM_SHEET,
                        payload: previous,
                    });
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch({
                        type: SET_DEFAULT_CRM_SHEET,
                        payload: res,
                    });
                }
                return res;
            }
        );
    };
}

export function getVoicePrintCsv(payload) {
    return (dispatch, getState) => {
        return getVoicePrintCsvApi(getState().common.domain, payload).then(
            (res) => {
                return res;
            }
        );
    };
}

export function uploadVoicePrintCsv(payload) {
    return (dispatch, getState) => {
        return uploadVoicePrintCsvApi(getState().common.domain, payload).then(
            (res) => {
                return res;
            }
        );
    };
}

export function getVoicePrintUploadStatus(threadId) {
    return (dispatch, getState) => {
        return getVoicePrintUploadStatusApi(getState().common.domain, {
            params: { thread_id: threadId },
        }).then((res) => {
            return res;
        });
    };
}
