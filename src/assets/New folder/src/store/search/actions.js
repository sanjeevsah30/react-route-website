import * as types from "./types";
import apiErrors from "@apis/common/errors";
import {
    setLoader,
    openNotification,
    changeActiveTeam,
    setActiveRep,
} from "../common/actions";
import * as searchApis from "@apis/search";
import { prepareSearchData } from "./utils";
import {
    createTracker,
    getAllTrackers,
    deleteTracker,
    editTrackerDetails,
    getTrackerByIdApi,
    getFilterByShareIdApi,
} from "@apis/calls/index";
import { getCallMedia } from "@apis/individual/index";
import {
    createSearchViewApi,
    deleteSearchViewApi,
    getConfToolsAjx,
    getDeafultSearchViewApi,
    getSearchViewsApi,
    updateSearchViewApi,
} from "@apis/search/index";
import { setFetching } from "@store/callListSlice/callListSlice";
import { getSamplingRulesApi } from "../../app/ApiUtils/settings/index";
import { getError } from "../../app/ApiUtils/common/index";

function storeSearchMediaUrls(urls) {
    return {
        type: types.STORE_SEARCH_URL,
        urls,
    };
}

export function storeFields(fields) {
    return {
        type: types.STORE_FIELDS,
        fields,
    };
}

export function storeSearchCalls(calls) {
    return {
        type: types.STORE_CALLS,
        calls,
    };
}

function storeNextUrl(next_url) {
    return {
        type: types.STORE_NEXT_URL,
        next_url,
    };
}

function storeCount(count) {
    return {
        type: types.STORE_COUNT,
        count,
    };
}

function storeTrackers(trackers) {
    return {
        type: types.STORE_TRACKERS,
        trackers,
    };
}

function storeConfTools(confTools) {
    return {
        type: types.STORE_CONF_TOOLS,
        confTools,
    };
}

export function setActiveSearchView(payload) {
    return {
        type: types.SET_ACTIVE_SEARCH_VIEW,
        payload,
    };
}

export function setSearchViews(payload, handleDuplicates = true) {
    return {
        type: types.SET_SEARCH_VIEWS,
        payload: {
            views: payload,
            handleDuplicates,
        },
    };
}

export function setSearchFilters(payload) {
    return {
        type: types.SET_SEARCH_FILTERS,
        payload,
    };
}

export function setActiveSearchFilters(payload) {
    return {
        type: types.SET_ACTIVE_SEARCH_FILTERS,
        payload,
    };
}

export function clearSearchFilters() {
    return {
        type: types.CLEAR_SEARCH_FILTERS,
    };
}

export function setDefaultSearchFilters(payload) {
    return {
        type: types.SET_DEFAULT_SEARCH_FILTERS,
        payload,
    };
}

export function getSearchFields(data, params) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        searchApis.getFields(getState().common.domain).then((res) => {
            dispatch(setLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeFields(res));
                if (!params.tracker) {
                    dispatch(searchCalls(res, data, true));
                }
            }
        });
    };
}

export function searchCalls(fields, searchData, doEncode) {
    return (dispatch, getState) => {
        dispatch(setFetching(true));
        let data = {};
        if (searchData) {
            data = doEncode
                ? prepareSearchData(
                      fields,
                      searchData,
                      null,
                      getState()?.common?.versionData?.stats_threshold
                  )
                : searchData;
        }
        const { sortKey } = getState().search.searchFilters;
        return searchApis
            .getSearchResults({
                domain: getState().common.domain,
                data,
                sortKey,
            })
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(storeSearchCalls(res.results));
                    dispatch(storeNextUrl(res.next));
                    dispatch(storeCount(res.count));
                }
                dispatch(setFetching(false));
            });
    };
}

export function getNextCalls(fields, searchData, scrolling = false) {
    return (dispatch, getState) => {
        if (!scrolling) dispatch(setFetching(true));
        if (Object.keys(searchData).length) {
            searchData = prepareSearchData(
                fields,
                searchData,
                null,
                getState()?.common?.versionData?.stats_threshold
            );
        }
        const { sortKey } = getState().search.searchFilters;
        let { next_url } = getState().search;

        // next_url = sortKey ? next_url + `&order_by=${sortKey}` : next_url;

        searchApis.getNextSearchCalls(next_url, searchData)?.then((res) => {
            dispatch(setFetching(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                dispatch(storeNextUrl(""));
            } else {
                dispatch(
                    storeSearchCalls([
                        ...getState().search.calls,
                        ...res.results,
                    ])
                );
                dispatch(storeNextUrl(res.next));
            }
            if (!scrolling) dispatch(setFetching(false));
        });
    };
}

export function getTrackers(next) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        return getAllTrackers(getState().common.domain, next).then((res) => {
            dispatch(setLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(
                    storeTrackers(
                        next
                            ? {
                                  ...getState().search.trackers,
                                  results: [
                                      ...getState().search.trackers.results,
                                      ...res,
                                  ],
                              }
                            : res
                    )
                );
            }
            return res;
        });
    };
}

export function getTrackerById(id) {
    return (dispatch, getState) => {
        // dispatch(setLoader(true));
        return getTrackerByIdApi(getState().common.domain, id).then((res) => {
            // dispatch(setLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
            }
            return res;
        });
    };
}

export function getFilterByShareId(shareId) {
    return (dispatch, getState) => {
        return getFilterByShareIdApi(getState().common.domain, shareId).then(
            (res) => {
                return res;
            }
        );
    };
}

export function createNewTracker(data) {
    return (dispatch, getState) => {
        // dispatch(setLoader(true));

        const {
            common,
            search: { searchFilters },
        } = getState();
        data.search_json = prepareSearchData(
            getState().search.fields,
            data.search_json,
            {
                client: searchFilters.client
                    ? common.salesTasks.find(
                          ({ id }) => +searchFilters.client.value === id
                      ) || {
                          ...searchFilters.client,
                          name: searchFilters.client.label,
                          id: searchFilters.client.id,
                      }
                    : null,
                topics:
                    common.topics.find(
                        ({ id }) => id === searchFilters.topic
                    ) || null,
                tags: common.tags.filter(({ id }) => {
                    for (let tag of searchFilters.call_tags) {
                        if (+tag === id) return true;
                    }
                    return false;
                }),
                owner:
                    common.filterReps?.reps?.find(
                        ({ id }) => id === common.filterReps.active
                    ) || null,
                team:
                    common.filterTeams?.teams?.find(
                        ({ id }) => id === common.filterTeams.active
                    ) || null,
                questions: Object.keys(searchFilters.activeQuestions).length
                    ? searchFilters.activeQuestions
                    : null,
                template: Object.keys(searchFilters.activeQuestions).length
                    ? searchFilters.template || null
                    : null,
                keywords: searchFilters.keywords,
            },
            getState()?.common?.versionData?.stats_threshold
        );

        createTracker(getState().common.domain, data).then((res) => {
            dispatch(setLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(
                    storeTrackers({
                        ...getState().search.trackers,
                        count: getState().search.trackers.count + 1,
                        results: [res, ...getState().search.trackers.results],
                    })
                );
                openNotification(
                    "success",
                    "Success",
                    "Alert created successfully!"
                );
            }
        });
    };
}

export function removeTracker(id) {
    return (dispatch, getState) => {
        // dispatch(setLoader(true));
        deleteTracker(getState().common.domain, id).then((res) => {
            dispatch(setLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                let existingTrackers = getState().search.trackers;
                let updated = existingTrackers.results.filter(
                    (tracker) => tracker.id !== id
                );
                dispatch(
                    storeTrackers({
                        ...getState().search.trackers,
                        count: getState().search.trackers.count - 1,
                        results: updated,
                    })
                );
            }
        });
    };
}

export function editTracker(data, id) {
    return (dispatch, getState) => {
        // dispatch(setLoader(true));
        editTrackerDetails(getState().common.domain, data, id).then((res) => {
            dispatch(setLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                openNotification(
                    "success",
                    "Success",
                    "Tracker successfully update"
                );
                let existingTrackers = getState().search.trackers;

                let updated = existingTrackers.results.map((tracker) => {
                    if (tracker.id === id) {
                        return res;
                    }
                    return tracker;
                });
                dispatch(
                    storeTrackers({
                        ...getState().search.trackers,
                        results: updated,
                    })
                );
            }
        });
    };
}

export function fetchCallMedia(id) {
    return (dispatch, getState) => {
        return getCallMedia(getState().common.domain, id).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                let existingUrls = JSON.parse(
                    JSON.stringify(getState().search.searchUrls)
                );
                existingUrls = { [id]: res.location, ...existingUrls };
                dispatch(storeSearchMediaUrls(existingUrls));
            }
            return res;
        });
    };
}
export function getConfTools() {
    return (dispatch, getState) => {
        return getConfToolsAjx(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeConfTools(res));
            }
            return res;
        });
    };
}

export function getSearchViews() {
    return (dispatch, getState) => {
        // dispatch(setLoader(true));
        return getSearchViewsApi(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(setSearchViews(res));
            }
            return res;
        });
    };
}

export function createSearchView(payload) {
    return (dispatch, getState) => {
        // dispatch(setLoader(true));
        return createSearchViewApi(getState().common.domain, payload).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(setSearchViews([res]));
                    openNotification(
                        "success",
                        "Success",
                        "View created successfully!"
                    );
                }
                return res;
            }
        );
    };
}

const updateSearchViewinStore = (payload) => {
    return {
        type: types.UPDATE_SEARCH_VIEWS,
        payload,
    };
};

export function updateSearchView(idToUpdate, payload) {
    return (dispatch, getState) => {
        // dispatch(setLoader(true));

        if (idToUpdate === 0) {
            if (payload.is_default) {
                const oldData = getState().search.views;
                const findPrevDefault = oldData.find(
                    ({ is_default }) => is_default
                );
                if (findPrevDefault) {
                    return updateSearchViewApi(
                        getState().common.domain,
                        findPrevDefault.id,
                        {
                            ...findPrevDefault,
                            is_default: false,
                        }
                    ).then((res) => {
                        if (res.status === apiErrors.AXIOSERRORSTATUS) {
                            openNotification("error", "Error", res.message);
                        } else {
                            const newData = oldData.map((data) => {
                                if (res.id === data.id) {
                                    return {
                                        ...res,
                                    };
                                } else if (data.id === 0) {
                                    return {
                                        ...payload,
                                    };
                                } else return data;
                            });

                            dispatch(setSearchViews(newData, false));
                            // openNotification(
                            //     'Success',
                            //     'View created successfully!'
                            // );
                        }
                        return res;
                    });
                }
            }
            const [first, ...rest] = getState().search.views;
            return dispatch(setSearchViews([{ ...payload }, ...rest], false));
        }
        return updateSearchViewApi(
            getState().common.domain,
            idToUpdate,
            payload
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                const oldData = getState().search.views;
                const newData = oldData.map((data) => {
                    if (res.id === data.id) {
                        return {
                            ...res,
                        };
                    } else {
                        if (res.is_default && data.is_default) {
                            return {
                                ...data,
                                is_default: false,
                            };
                        } else return data;
                    }
                });

                dispatch(setSearchViews(newData, false));
                // openNotification(
                //     'success',
                //     'Success',
                //     'View created successfully!'
                // );
            }
            return res;
        });
    };
}

export function deleteSearchView(toDeleteId) {
    return (dispatch, getState) => {
        // dispatch(setLoader(true));
        const oldData = getState().search.views;
        const newData = oldData.filter(({ id }) => +id !== +toDeleteId);

        dispatch(setSearchViews(newData, false));

        return deleteSearchViewApi(getState().common.domain, toDeleteId).then(
            (res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setSearchViews(oldData, false));
                } else {
                    // openNotification(
                    //     'success',
                    //     'Success',
                    //     'View created successfully!'
                    // );
                }
                return res;
            }
        );
    };
}

export const setCompletedCallsAsDefault = (payload) => {
    return {
        type: types.SET_COMPLETED_CALLS_AS_DEFAULT,
        payload,
    };
};

export function getDeafultSearchView(noParamPresent, tracker) {
    return (dispatch, getState) => {
        dispatch(setFetching(true));
        return getDeafultSearchViewApi(getState().common.domain).then((res) => {
            const { auth } = getState();
            if (tracker) {
                // dispatch(setActiveSearchView(0));
                // dispatch(setCompletedCallsAsDefault(true));
                return;
            }
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                dispatch(setActiveSearchView(0));
                noParamPresent &&
                    auth?.team &&
                    dispatch(
                        changeActiveTeam(
                            auth?.role?.id === 1 ? [] : [auth.team]
                        )
                    );
                return dispatch(setFetching(false));
            }

            //Means that there are no url params so safley set the default view
            if (res.id && noParamPresent) {
                dispatch(setSearchViews([res]));
                dispatch(setActiveSearchView(res.id));
                return;
            }

            //Url params are present so set it to completed calls i.e 0 indicates completed calls

            dispatch(setCompletedCallsAsDefault(true));
            if (noParamPresent) {
                auth?.team &&
                    dispatch(
                        changeActiveTeam(
                            auth?.role?.id === 1 ? [] : [auth.team]
                        )
                    );

                if (+auth?.role?.id === 2) {
                    dispatch(setActiveRep([auth.id]));
                }
            }

            dispatch(setActiveSearchView(0));

            dispatch(
                setSearchFilters({
                    ...getState().search.defaultSearchFilters,
                    audit_filter: {
                        ...getState().search.searchFilters.audit_filter,
                    },
                })
            );
        });
    };
}

export const getSamplingRules = () => (dispatch, getState) => {
    dispatch(setSamplingRulesLoading(true));
    getSamplingRulesApi(getState().common.domain)
        .then((res) => {
            dispatch(setSamplingRulesLoading(false));
            dispatch(setSamplingRules(res.results));
        })
        .catch((err) => {
            openNotification("error", "Error", getError(err)?.message);
        });
};

export const setSamplingRules = (payload) => {
    return {
        type: types.SET_SAMPLING_RULES,
        payload,
    };
};

export const setActiveSamplingRule = (payload) => {
    return {
        type: types.SET_ACTIVE_SAMPLING_RULE,
        payload,
    };
};

export const setSamplingRulesLoading = (payload) => {
    return {
        type: types.SET_SAMPLING_RULES_LOADING,
        payload,
    };
};
