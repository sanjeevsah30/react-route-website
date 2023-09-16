import * as types from "./types";
import * as ciApi from "@apis/customer_intelligence/index";
import { setLoader, openNotification } from "../common/actions";
import apiErrors from "@apis/common/errors";
import {
    mockMeetingCount,
    mockOccurenceData,
    mockOccurenceFeature,
    mockPercentageData,
    mockPercentageFeature,
    mockSearchPhrases,
    mockSearchPhrasesFeatures,
} from "app/components/CustomerIntelligence/mockData";
import { getSearchResults } from "@apis/search/index";
import { prepareCIData } from "./utils";

export const setCiLoading = (loading) => {
    return {
        type: types.SET_CI_LOADING,
        loading,
    };
};
export const storeTabs = (tabs) => {
    return {
        type: types.STORE_TABS,
        tabs,
    };
};

export const fetchGetTabsRequest =
    (domain, topBarFilter, filters) => (dispatch, getState) => {
        dispatch({
            type: types.SET_LOADING_TABS_CI,
            flag: true,
        });
        ciApi.getTabs(domain, topBarFilter, filters).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                dispatch(setLoader(false));
            } else {
                dispatch(setLoader(false));
                const tabs = res.map((tab) => ({
                    ...tab,
                    saidByFilter: {
                        saidByOwner: true,
                        saidByClient: true,
                    },
                }));
                dispatch(storeTabs([...tabs]));
                dispatch({
                    type: types.SET_LOADING_TABS_CI,
                    flag: false,
                });
            }
        });
    };

export const fetchSingleTabData =
    ({ domain, id, saidByFilter, topBarFilter, exclude, filters }) =>
    (dispatch, getState) => {
        dispatch({
            type: types.SET_LOADING_PHRASES_CI,
            flag: true,
        });
        dispatch(
            getGraphData({
                domain,
                id,
                saidByFilter,
                topBarFilter,
                exclude,
                filters,
            })
        );
        ciApi
            .getSingleTab({
                domain,
                saidByFilter,
                id,
                topBarFilter,
                exclude,
                filters,
            })
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    if (!res.search_phrases.length && !res.is_removable) {
                        const isFeaturesTab = res.slug === "features";
                        res.search_phrases = isFeaturesTab
                            ? mockSearchPhrasesFeatures
                            : mockSearchPhrases;
                        res.percentage_graph_data = isFeaturesTab
                            ? mockPercentageFeature
                            : mockPercentageData;
                        res.occurance_graph_data = isFeaturesTab
                            ? mockOccurenceFeature
                            : mockOccurenceData;
                        res.total_meetings_count =
                            res.total_meetings_count || mockMeetingCount;
                        res.isSample = true;
                    } else {
                        res.isSample = false;
                    }
                    const existingTabs = [...getState().ci.tabs];
                    const idx = existingTabs.findIndex((tab) => tab.id === id);
                    existingTabs[idx] = {
                        ...existingTabs[idx],
                        ...res,
                    };
                    dispatch(storeTabs(existingTabs));
                }
                dispatch({
                    type: types.SET_LOADING_PHRASES_CI,
                    flag: false,
                });
            });
    };

export const addTabsRequest =
    ({ domain, title, history }) =>
    (dispatch, getState) => {
        dispatch({
            type: types.SET_LOADING_TABS_CI,
            flag: true,
        });
        ciApi.createTab({ domain, title }).then((res) => {
            dispatch({
                type: types.SET_LOADING_TABS_CI,
                flag: false,
            });
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                const newTab = {
                    ...res,
                    index: getState().ci.tabs.length,
                    saidByFilter: {
                        saidByOwner: true,
                        saidByClient: true,
                    },
                    search_phrases: [],
                };
                dispatch(storeTabs([...getState().ci.tabs, newTab]));

                // history?.push(`${res.slug}`);
            }
        });
    };

export const deleteTab = ({ domain, id }) => {
    return (dispatch, getState) => {
        ciApi.removeTab({ domain, id }).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(
                    storeTabs(getState().ci.tabs.filter((tab) => tab.id !== id))
                );
            }
        });
    };
};

export const addTabKeyWord = ({
    domain,
    id,
    newKeyword,
    saidByFilter,
    topBarFilter,
    exclude,
    filters,
}) => {
    return (dispatch, getState) => {
        dispatch({
            type: types.SET_LOADING_EDITING_CI,
            flag: true,
        });
        ciApi
            .createKeyWord({
                domain,
                id,
                newKeyword,
                saidByFilter,
                topBarFilter,
                filters,
            })
            .then((res) => {
                dispatch({
                    type: types.SET_LOADING_EDITING_CI,
                    flag: false,
                });
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    const existingTabs = [...getState().ci.tabs];
                    const idx = existingTabs.findIndex((tab) => tab.id === id);
                    existingTabs[idx] = {
                        ...existingTabs[idx],
                        ...res,
                        isSample: false,
                    };
                    dispatch(storeTabs(existingTabs));

                    openNotification(
                        "success",
                        `${newKeyword} is added successfully`
                    );
                    dispatch(
                        getGraphData({
                            domain,
                            id,
                            saidByFilter,
                            topBarFilter,
                            exclude,
                            filters,
                        })
                    );
                }
            });
    };
};

const setSnippetLoader = (loading) => {
    return {
        type: types.SET_SNIPPET_LOADER,
        loading,
    };
};

export const deleteTabKeyWord = ({
    domain,
    id,
    tabId,
    saidByFilter,
    topBarFilter,
    exclude,
    filters,
}) => {
    return (dispatch, getState) => {
        dispatch({
            type: types.SET_LOADING_EDITING_CI,
            flag: true,
        });
        ciApi.removeKeyWord({ domain, id }).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                const existingTabs = [...getState().ci.tabs];
                const idx = existingTabs.findIndex((tab) => tab.id === tabId);
                const searchPhrases = existingTabs[idx].search_phrases.filter(
                    (keyword) => keyword.id !== id
                );
                existingTabs[idx] = {
                    ...existingTabs[idx],
                    search_phrases: [...searchPhrases],
                };
                dispatch(storeTabs(existingTabs));
                dispatch({
                    type: types.SET_LOADING_EDITING_CI,
                    flag: false,
                });
                dispatch(
                    getGraphData({
                        domain,
                        id: tabId,
                        saidByFilter,
                        topBarFilter,
                        exclude,
                        filters,
                    })
                );
            }
        });
    };
};

export const getPhraseSnippets = ({
    domain,
    id,
    tabId,
    nextSnippetsUrl,
    saidByFilter,
    topBarFilter,
    is_processed,
    phrase,
    filters,
}) => {
    return (dispatch, getState) => {
        dispatch(setSnippetLoader(true));

        (is_processed
            ? ciApi.fetchSnippets({
                  domain,
                  id,
                  nextSnippetsUrl,
                  saidByFilter,
                  topBarFilter,
                  is_processed,
                  filters,
              })
            : getSearchResults({
                  domain: getState().common.domain,
                  data: prepareCIData({
                      saidByFilter,
                      topBarFilter,
                      phrase,
                      filters,
                  })?.search_data,
                  next: nextSnippetsUrl,
              })
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                dispatch(setSnippetLoader(false));
            } else {
                const existingTabs = [...getState().ci.tabs];
                const idx = existingTabs.findIndex((tab) => tab.id === tabId);

                const phrases = existingTabs[idx].search_phrases.map(
                    (phrase) => {
                        if (phrase.id === id) {
                            if (phrase.snippets) {
                                return {
                                    ...phrase,
                                    snippets: [
                                        ...phrase.snippets,
                                        ...res.results,
                                    ],
                                    nextSnippetsUrl: res.next,
                                };
                            } else {
                                return {
                                    ...phrase,
                                    snippets: [...res.results],
                                    nextSnippetsUrl: res.next,
                                };
                            }
                        }

                        return phrase;
                    }
                );

                existingTabs[idx] = {
                    ...existingTabs[idx],
                    search_phrases: [...phrases],
                };

                dispatch(storeTabs(existingTabs));
                dispatch(setSnippetLoader(false));
            }
        });
    };
};

const setGraphLoader = (loading) => {
    return {
        type: types.SET_GRAPH_LOADER,
        loading,
    };
};

const setGraphData = (graphData) => {
    return {
        type: types.SET_GRAPH_DATA,
        graphData,
    };
};

export const getGraphData = ({
    domain,
    id,
    saidByFilter,
    topBarFilter,
    exclude,
    filters,
}) => {
    return (dispatch, getState) => {
        dispatch(setGraphLoader(true));
        ciApi
            .fetchGraphs({
                domain,
                id,
                saidByFilter,
                topBarFilter,
                exclude,
                filters,
            })
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setGraphLoader(false));
                } else {
                    const existingTabs = [...getState().ci.tabs];
                    const idx = existingTabs.findIndex((tab) => tab.id === id);
                    existingTabs[idx] = {
                        ...existingTabs[idx],
                        percentage_graph_data: res?.distinct_meetings_graph_data
                            ?.length
                            ? res.distinct_meetings_graph_data
                            : existingTabs[idx].percentage_graph_data || [],
                        occurance_graph_data: res?.sentences_count_graph_data
                            ?.length
                            ? res.sentences_count_graph_data
                            : existingTabs[idx].occurance_graph_data || [],
                    };
                    dispatch(storeTabs(existingTabs));
                    dispatch(setGraphLoader(false));
                }
            });
    };
};

export const setSaidByFilter =
    ({ saidByFilter, id, domain, topBarFilter, filters }) =>
    (dispatch, getState) => {
        const existingTabs = [...getState().ci.tabs];
        const idx = existingTabs.findIndex((tab) => tab.id === id);
        existingTabs[idx] = {
            ...existingTabs[idx],
            saidByFilter,
        };
        dispatch(storeTabs(existingTabs));
        dispatch(
            fetchSingleTabData({
                domain,
                saidByFilter,
                id,
                topBarFilter,
                filters,
            })
        );
    };
