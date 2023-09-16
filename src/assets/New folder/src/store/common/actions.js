import React from "react";
import * as types from "./types";
import { message, notification } from "antd";
import apiErrors from "@apis/common/errors";
import { updateMeeting } from "../library/actions";
import * as callApis from "@apis/calls/index";
import { getAllTopics } from "@apis/topics";
import { getFields } from "@apis/search";
import { getUsers } from "@apis/authentication";
import { getTeamReps, getTeams } from "@apis/topbar/index";
import callsConfig from "@constants/MyCalls/index";
import { cloneDeep } from "lodash";
import { CloseCircleOutlined } from "@ant-design/icons";

import {
    changeCompletedCallType,
    changeUpcomingCallType,
    updateMeetingTags,
} from "@store/calls/actions";
import {
    getDomain,
    getDomainMappingName,
    getIdLabelArray,
} from "@tools/helpers";
import TopbarConfig from "@constants/Topbar/index";
import { setUserProperties } from "@tools/freshChat";
import {
    setReportActiveAgent,
    storeReportAgents,
    storeReportTeams,
} from "@store/audit_report/actions";
import { setAccountsRep, setAccountsTeams } from "@store/accounts/actions";
import { setUpcomingCallsFilters } from "@store/calls/actions";
import {
    setTeamsLoadingForTeamManager,
    storeTeamsForTeamManager,
} from "@store/team_manager/team_manager";

export function storeTags(tags) {
    return {
        type: types.STORE_TAGS,
        tags,
    };
}

function storeCallTypes(call_types) {
    return {
        type: types.STORE_CALL_TYPES,
        call_types,
    };
}

function storeCallDurations(options) {
    return {
        type: types.STORE_CALL_DURATION,
        options,
    };
}

export function storeClients(clients) {
    return {
        type: types.STORE_ALL_CLIENTS,
        clients,
    };
}

export function storeTopics(topics) {
    return {
        type: types.STORE_ALL_TOPICS,
        topics,
    };
}

export function storeFields(fields) {
    return {
        type: types.STORE_SEARCH_FIELDS,
        fields,
    };
}

export function storeUsers(users) {
    return {
        type: types.STORE_ALL_USERS,
        users,
    };
}

export function storeTeams(teams) {
    return {
        type: types.STORE_TEAMS,
        teams,
    };
}

export function storeSalesTasks(salesTasks) {
    return {
        type: types.STORE_SALES_TASKS,
        salesTasks,
    };
}

export function setActiveCallTags(payload) {
    return {
        type: types.SET_ACTIVE_CALLTAG,
        payload,
    };
}

export function openNotification(type, title, msg) {
    notification[type]({
        message: title,
        description:
            typeof msg === "string"
                ? msg
                : Array.isArray(msg)
                ? typeof msg?.[0] === Object
                    ? Object.values(msg?.[0] || {})?.[0] || ""
                    : msg?.[0] || ""
                : typeof msg === Object
                ? Object.values(msg)?.[0] || ""
                : "",
    });
}

export function setLoader(status) {
    return { type: types.SETLOADER, status };
}

function setSalesTaskQueryLoad(loading) {
    return {
        type: types.SALES_TASK_QUERY_LOADING,
        loading,
    };
}

function setSalesTaskNextLoad(loading) {
    return {
        type: types.SALES_TASK_NEXT_LOADING,
        loading,
    };
}

function setFilterTeams(teams) {
    // const mappedTeams = getIdLabelArray(teams, 'name');
    return {
        type: types.SET_FILTER_TEAMS,
        teams: [{ id: 0, name: "All Teams" }, ...teams],
    };
}

export function setActiveTeam(active) {
    return {
        type: types.SET_ACTIVE_TEAM,
        active,
    };
}

function setFilterReps(reps) {
    return {
        type: types.SET_FILTER_REPS,
        reps,
    };
}

export function storeActiveRep(active) {
    return {
        type: types.SET_ACTIVE_REP,
        active,
    };
}

export function setActiveRep(active) {
    return (dispatch) => {
        //check active does not contain id = 0, so filtering if it exists
        const temp_active = active?.filter((item) => item !== 0);
        dispatch(storeActiveRep(temp_active));
        dispatch(didFilterChange());
    };
}

export function setFilterCallTypes(callTypes) {
    return {
        type: types.SET_FILTER_CALL_TYPES,
        callTypes,
    };
}

export function setActiveCallType(active) {
    return {
        type: types.SET_ACTIVE_CALL_TYPE,
        active,
    };
}

export function setCustomFilterDuration(values) {
    return {
        type: types.SET_FILTER_CALL_DURATION,
        values,
    };
}

export function storeActiveCallDuration(active) {
    return {
        type: types.SET_ACTIVE_CALL_DURATION,
        active,
    };
}

export function setActiveCallDuration(active) {
    return (dispatch) => {
        dispatch(storeActiveCallDuration(active));
        dispatch(didFilterChange());
    };
}

export function setActiveFilterDate(active) {
    return (dispatch) => {
        dispatch(storeActiveFilterDate(active));
        dispatch(didFilterChange());
    };
}

export function storeActiveFilterDate(active) {
    return {
        type: types.SET_ACTIVE_FILTER_DATE,
        active,
    };
}

export function setFilterDates(dates) {
    return {
        type: types.SET_FILTER_DATES,
        dates,
    };
}

export function setActiveReportType(payload) {
    return {
        type: types.SET_ACTIVE_REPORT_TYPE,
        payload,
    };
}

export function clearFilters() {
    return { type: types.CLEAR_FILTERS };
}
export function setGSText(text) {
    return { type: types.SET_GS_TEXT, text };
}
export function setDidFiltersChange(status) {
    return { type: types.SET_DID_FILTER_CHANGE, status };
}
export function setDomain(host) {
    let domain = getDomainMappingName(getDomain(host));
    setUserProperties({ domain: domain });
    localStorage.setItem("convin_org", domain);
    return { type: types.SETDOMAIN, domain };
}

export function getTags() {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        callApis.getAllTags(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeTags(res));
            }
            dispatch(setLoader(false));
        });
    };
}

export function createNewTag(tag, meetingId, context, meetingType) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        return callApis.createTag(getState().common.domain, tag).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                const existingTags = JSON.parse(
                    JSON.stringify(getState().common.tags)
                );
                const tags = [...existingTags, res];
                dispatch(storeTags(tags));

                if (context === "library") {
                    dispatch(updateMeeting(res, meetingId, "tags", "add"));
                } else if (context === "calls") {
                    dispatch(
                        updateMeetingTags(res, meetingId, meetingType, "add")
                    );
                }
            }
            dispatch(setLoader(false));
            return res;
        });
    };
}

export function getAllCallTypes() {
    return (dispatch, getState) => {
        callApis.getAllCallTypes(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeCallTypes(res));
                const mappedTypes = getIdLabelArray(res, "type");
                dispatch(
                    setFilterCallTypes([
                        { 0: TopbarConfig.ALL },
                        ...mappedTypes,
                    ])
                );
            }
        });
    };
}

export function changeCallType(type, meetingId, context, meetingType) {
    return (dispatch) => {
        if (context === "library") {
            dispatch(updateMeeting(type, meetingId, "call_type"));
        } else {
            if (meetingType === callsConfig.COMPLETED_TYPE) {
                dispatch(changeCompletedCallType(meetingId, type));
            } else if (meetingType === callsConfig.UPCOMING_TYPE) {
                dispatch(changeUpcomingCallType(meetingId, type));
            }
        }
    };
}

export function getClients({ query, next_url }) {
    return (dispatch, getState) => {
        if (next_url) {
            //used to show loading when the user scolls down in the select box
            dispatch(setSalesTaskNextLoad(true));
        }
        callApis
            .getClients(getState().common.domain, query, next_url)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    if (next_url) {
                        dispatch(
                            storeClients({
                                ...res,
                                results: [
                                    ...getState().common.clients,
                                    ...res.results,
                                ],
                            })
                        );
                    } else dispatch(storeClients(res));
                }
                dispatch(setSalesTaskNextLoad(false));
            });
    };
}

export function getSalesTasks({ query, next_url }) {
    return (dispatch, getState) => {
        if (next_url) {
            dispatch(setSalesTaskNextLoad(true));
        }
        callApis
            .getSalesTask(getState().common.domain, query, next_url)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    if (next_url) {
                        dispatch(
                            storeSalesTasks({
                                ...res,
                                results: [
                                    ...getState().common.salesTasks,
                                    ...res.results,
                                ],
                            })
                        );
                    } else dispatch(storeSalesTasks(res));
                }
                dispatch(setSalesTaskNextLoad(false));
            });
    };
}

export function createClient(clientData) {
    return (dispatch, getState) => {
        return callApis
            .createClient(getState().common.domain, clientData)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    let existingClients = cloneDeep(getState().common.clients);
                    let { nextClientsUrl } = getState().common;
                    dispatch(
                        storeClients({
                            results: [...existingClients, res],
                            next: nextClientsUrl,
                        })
                    );
                }

                return res;
            });
    };
}

export function getTopics() {
    return (dispatch, getState) => {
        return getAllTopics(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeTopics(res));
            }
            return res;
        });
    };
}

export function getSearchFields() {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        getFields(getState().common.domain).then((res) => {
            dispatch(setLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeFields(res));
            }
        });
    };
}

export function getAllUsers() {
    return (dispatch, getState) => {
        getUsers(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeUsers(res));

                let mappedReps = res.map((rep, index) => {
                    return {
                        ...rep,
                        name:
                            rep.first_name && rep?.last_name
                                ? `${rep.first_name} ${rep?.last_name}`
                                : rep.first_name
                                ? rep.first_name
                                : rep.email
                                ? rep.email
                                : `Rep ${index + 1}`,
                    };
                });

                const updatedReps = [
                    { id: 0, name: TopbarConfig.ALL },
                    ...mappedReps,
                ];
                const { active } = getState().common.filterReps;

                dispatch(
                    setFilterReps({
                        reps: updatedReps,
                        active: updatedReps.find(({ id }) => id === +active)
                            ? active
                            : [],
                    })
                );
            }
        });
    };
}

export function getAllTeams() {
    return (dispatch, getState) => {
        dispatch(setTeamsLoadingForTeamManager(true));
        getTeams(getState().common.domain).then((res) => {
            dispatch(setTeamsLoadingForTeamManager(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeTeams(res));
                dispatch(storeTeamsForTeamManager(res));
                dispatch(setFilterTeams(res));
                dispatch(
                    setUpcomingCallsFilters({
                        filterTeams: {
                            teams: [{ id: 0, name: "All Teams" }, ...res],
                            active: 0,
                        },
                    })
                );
            }
        });
    };
}

export function changeActiveTeam(teamId, skipDidFilterChange, resetRep = true) {
    return (dispatch, getState) => {
        dispatch(setActiveTeam(teamId));
        if (!skipDidFilterChange) {
            dispatch(didFilterChange());
        }
        // return dispatch(getRepByTeam(teamId, resetRep));
    };
}

export function getRepByTeam(teamId, resetRep) {
    return (dispatch, getState) => {
        dispatch({
            type: types.SET_FETCHING_REPS,
            payload: true,
        });

        return getTeamReps(getState().common.domain, teamId).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                let mappedReps = res.results.map((rep, index) => {
                    return {
                        id: rep.id,
                        name:
                            rep.first_name && rep?.last_name
                                ? `${rep.first_name} ${rep?.last_name}`
                                : rep.first_name
                                ? rep.first_name
                                : rep.email
                                ? rep.email
                                : `Rep ${index + 1}`,
                    };
                });
                const updatedReps = [
                    { id: 0, name: TopbarConfig.ALL },
                    ...mappedReps,
                ];
                const { active } = getState().common.filterReps;
                if (window.location.pathname.includes("agent_report")) {
                    dispatch(
                        setFilterReps({
                            reps: updatedReps,
                            // active: mappedReps?.[0]?.id || null,
                            active: [mappedReps?.[0]?.id] || [],
                        })
                    );
                } else
                    dispatch(
                        setFilterReps({
                            reps: updatedReps,
                            active: updatedReps.find(({ id }) => id === +active)
                                ? active
                                : [],
                        })
                    );

                dispatch({
                    type: types.SET_FETCHING_REPS,
                    payload: false,
                });

                //If you reload the page on agents tab will require the first agent id

                return updatedReps;
            }

            return [{ id: 0, name: TopbarConfig.ALL }];
        });
    };
}

export const setFilterAuditTemplates = (res) => {
    return {
        type: types.SET_FILTER_AUDIT_TEMPLATES,
        res,
    };
};

export const setActiveTemplateForFilters = (active) => {
    return {
        type: types.SET_ACTIVE_TEMPLATE,
        active,
    };
};

export const successSnackBar = (content) => {
    message.success({
        content,
        className: "success__msg",
        duration: 3,
        icon: (
            <div>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="10" cy="10" r="10" fill="white" />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.8062 8.49372C15.1479 8.15201 15.1479 7.59799 14.8062 7.25628C14.4645 6.91457 13.9105 6.91457 13.5688 7.25628L8.9375 11.8876L6.49372 9.44378C6.15201 9.10207 5.59799 9.10207 5.25628 9.44378C4.91457 9.78549 4.91457 10.3395 5.25628 10.6812L8.31823 13.7432C8.31842 13.7434 8.3186 13.7435 8.31878 13.7437C8.66049 14.0854 9.21451 14.0854 9.55622 13.7437L14.8062 8.49372Z"
                        fill="#32A65D"
                    />
                </svg>
            </div>
        ),
    });
};

export const ErrorSnackBar = (content, duration = 3) => {
    message.success({
        content,
        className: "error__msg",
        duration,
        key: "err_snackbar",
        icon: (
            <CloseCircleOutlined
                style={{
                    color: "white",
                    cursor: "pointer",
                }}
                onClick={() => message.destroy("err_snackbar")}
            />
        ),
    });
};
export function didFilterChange() {
    return (dispatch, getState) => {
        const { filterTeams, filterDates, filterCallDuration, filterReps } =
            getState().common;
        if (
            +filterTeams.active === 0 &&
            +filterReps.active === 0 &&
            +filterCallDuration.active === TopbarConfig.defaultDuration &&
            filterDates.active === TopbarConfig.defaultDate
        ) {
            dispatch(setDidFiltersChange(false));
        } else {
            dispatch(setDidFiltersChange(true));
        }
    };
}

export const showError = ({ message }) => {
    openNotification("error", "Error", message);
};

export const storeVersionData = (data) => {
    return {
        type: types.STORE_VERSION_DATA,
        data,
    };
};
