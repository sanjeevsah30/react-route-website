import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    tabsLoading: false,
    tabLoading: true,
    graphLoading: true,
    tabs: [],
    tabData: null,
    graphData: null,
    isAddingPhrase: false,
    snippetsInitialLoad: false,
    snippets: [],
    nextSnippetsUrl: null,
    phraseStats: {
        loading: true,
        data: {},
    },
};

export const getCITabs = createAsyncThunk(
    "CI/getTabs",
    async (payload = {}, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/customer_intelligence/tabs/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCITabById = createAsyncThunk(
    "CI/getTabById",
    async ({ payload = {}, id }, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/customer_intelligence/tabs/${id}/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createCITab = createAsyncThunk(
    "CI/createTab",
    async (payload = {}, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/customer_intelligence/tabs/create/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const removeCITab = createAsyncThunk(
    "CI/removeTab",
    async (id, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.delete(
                `/customer_intelligence/customer_intelligence/tabs/${id}/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const addCIPhrase = createAsyncThunk(
    "CI/addCIPhrase",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/search_phrase/v2/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const removeCIPhrase = createAsyncThunk(
    "CI/removeCIPhrase",
    async (id, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.delete(
                `/customer_intelligence/search_phrase/${id}/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getGraphByTabId = createAsyncThunk(
    "CI/getGraphByTabId",
    async ({ payload = {}, id }, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/customer_intelligence/tabs/${id}/graph/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCITrackingPhraseSnippets = createAsyncThunk(
    "CI/getCITrackingPhraseSnippets",
    async (
        { payload, is_processed, id, tabId },
        { rejectWithValue, getState }
    ) => {
        try {
            const res = await axiosInstance.post(
                is_processed
                    ? `/customer_intelligence/search_phrase/${id}/snippets/`
                    : "search/search/",
                payload
            );

            return {
                id,
                tabId,
                res: res.data,
            };
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCITrackingSnippets = createAsyncThunk(
    "CI/getCITrackingSnippets",
    async (
        { next, payload, is_processed, id },
        { rejectWithValue, getState }
    ) => {
        try {
            const res = await axiosInstance.post(
                next ||
                    (is_processed
                        ? `/customer_intelligence/search_phrase/${id}/snippets/`
                        : "search/search/"),
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCISnippetsPhraseDetails = createAsyncThunk(
    "CI/getCISnippetsPhraseSnippets",
    async (
        { next, payload, type, stat, id },
        { rejectWithValue, getState }
    ) => {
        try {
            const noneCheck =
                stat?.toString()?.toLowerCase() === "none" ? 0 : stat;

            const res = await axiosInstance.post(
                next ||
                    `/customer_intelligence/stats_snippets/search_phrase/${id}/${type}/${noneCheck}/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIPhraseStats = createAsyncThunk(
    "CI/getCIInsightStats",
    async ({ id, payload }, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/search_phrase_stats/${id}/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const CISlice = createSlice({
    name: "CISlice",
    initialState,
    reducers: {
        setCITrackingSnippetsInitialLoad(state, action) {
            state.snippetsInitialLoad = action;
        },
        clearCITrackingSnippets(state, action) {
            state.snippets = [];
            state.nextSnippetsUrl = null;
        },
        setCITabs(state, { payload }) {
            state.tabs = payload;
        },
    },
    extraReducers: {
        [getCITabs.pending]: (state, { payload }) => {
            state.tabsLoading = true;
        },
        [getCITabs.fulfilled]: (state, { payload }) => {
            state.tabsLoading = false;
            state.tabs = payload;
        },
        [getCITabs.rejected]: (state, { payload }) => {
            state.tabsLoading = false;

            openNotification("error", "Error", payload?.message);
        },

        [getCITabById.pending]: (state, { payload }) => {
            state.tabLoading = true;
        },

        [getCITabById.fulfilled]: (state, { payload }) => {
            state.tabLoading = false;
            state.tabData = payload;
        },
        [getCITabById.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.tabLoading = false;
            state.tabData = null;
            openNotification("error", "Error", payload?.message);
        },
        [getGraphByTabId.pending]: (state, { payload }) => {
            state.graphLoading = true;
        },

        [getGraphByTabId.fulfilled]: (state, { payload }) => {
            state.graphLoading = false;
            state.graphData = payload;
        },
        [getGraphByTabId.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.graphLoading = false;
            state.graphData = null;

            openNotification("error", "Error", payload?.message);
        },
        [createCITab.pending]: (state, { payload }) => {
            state.tabsLoading = true;
        },

        [createCITab.fulfilled]: (state, { payload }) => {
            state.tabsLoading = false;
            state.tabs = [...state.tabs, payload];
        },
        [createCITab.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.tabsLoading = false;
            openNotification("error", "Error", payload?.message);
        },
        [removeCITab.pending]: (state, { payload }) => {},

        [removeCITab.fulfilled]: (state, { payload }) => {
            state.tabs = state.tabs.filter(({ id }) => id !== payload.id);
        },
        [removeCITab.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.tabLoading = false;

            openNotification("error", "Error", payload?.message);
        },
        [addCIPhrase.pending]: (state, { payload }) => {
            state.isAddingPhrase = true;
            state.tabsLoading = true;
        },

        [addCIPhrase.fulfilled]: (state, { payload }) => {
            state.isAddingPhrase = false;
            state.tabsLoading = false;
            state.tabData = payload;
        },
        [addCIPhrase.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.tabsLoading = false;
            state.isAddingPhrase = false;

            openNotification("error", "Error", payload?.message);
        },

        [removeCIPhrase.pending]: (state, { payload }) => {
            state.isAddingPhrase = true;
            state.tabsLoading = true;
        },

        [removeCIPhrase.fulfilled]: (state, { payload }) => {
            state.isAddingPhrase = false;
            state.tabsLoading = false;
            state.tabData = {
                ...state.tabData,
                search_phrases: state?.tabData?.search_phrases?.filter?.(
                    (e) => e.id !== payload.id
                ),
            };
        },
        [removeCIPhrase.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.tabsLoading = false;
            state.isAddingPhrase = false;

            openNotification("error", "Error", payload?.message);
        },
        [getCITrackingPhraseSnippets.pending]: () => {},
        [getCITrackingPhraseSnippets.fulfilled]: (state, { payload }) => {
            const { tabId, id, res } = payload;
            const existingTabs = [...state.tabs];
            const idx = existingTabs.findIndex((tab) => tab.id === tabId);
            const phrases = existingTabs[idx].search_phrases.map((phrase) => {
                if (phrase.id === id) {
                    if (phrase.snippets) {
                        return {
                            ...phrase,
                            snippets: [...phrase.snippets, ...res.results],
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
            });
            existingTabs[idx] = {
                ...existingTabs[idx],
                search_phrases: [...phrases],
            };

            state.tabs = existingTabs;
        },
        [getCITrackingPhraseSnippets.rejected]: () => {},
        [getCITrackingSnippets.pending]: (state, { payload }) => {},
        [getCITrackingSnippets.fulfilled]: (state, { payload }) => {
            state.snippetsInitialLoad = false;
            state.snippets = [...state.snippets, ...payload.results];
            state.nextSnippetsUrl = payload.next;
        },
        [getCITrackingSnippets.rejected]: (state, { payload }) => {
            state.snippetsInitialLoad = false;
            openNotification("error", "Error", payload?.message);
        },
        [getCISnippetsPhraseDetails.pending]: (state, { payload }) => {},
        [getCISnippetsPhraseDetails.fulfilled]: (state, { payload }) => {
            state.snippetsInitialLoad = false;
            state.snippets = [...state.snippets, ...payload.results];
            state.nextSnippetsUrl = payload.next;
        },
        [getCISnippetsPhraseDetails.rejected]: (state, { payload }) => {
            state.snippetsInitialLoad = false;
            openNotification("error", "Error", payload?.message);
        },
        [getCIPhraseStats.pending]: (state, { payload }) => {
            state.phraseStats.loading = true;
            state.phraseStats.data = {};
        },
        [getCIPhraseStats.fulfilled]: (state, { payload }) => {
            state.phraseStats.loading = false;
            state.phraseStats.data = payload;
        },
        [getCIPhraseStats.rejected]: (state, { payload }) => {
            state.phraseStats.loading = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});
export const {
    setCITrackingSnippetsInitialLoad,
    clearCITrackingSnippets,
    setCITabs,
} = CISlice.actions;
export default CISlice.reducer;
