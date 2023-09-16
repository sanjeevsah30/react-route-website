import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";
import searchConfig from "@apis/search/config";
import apiErrors from "@apis/common/errors";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";
import { prepareSearchData } from "@store/search/utils";
import { getSampledCalls } from "../../app/ApiUtils/settings/index";
import { saveAs } from "file-saver";

const initialState = {
    loading: false,
    fetchingCalls: false,
    calls: [],
    count: 0,
    next_url: "",
    loadingCalls: false,
};

export const getCallList = createAsyncThunk(
    "callList/getCalls",
    async (
        { fields, searchData, next, doEncode, scrolling },
        { rejectWithValue, getState }
    ) => {
        if (getState().search.activeSamplingRule) {
            const res = await getSampledCalls(
                getState().common.domain,
                getState().search.activeSamplingRule
            );
            if (res?.status === apiErrors.AXIOSERRORSTATUS) {
                return openNotification("error", "Error", res.message);
            } else {
                return res;
            }
        }
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
        try {
            let url = next?.split(".ai")?.[1] || `${searchConfig.GETRESULTS}`;

            url = sortKey ? url + `?&order_by=${sortKey}` : url;
            const res = await axiosInstance.post(url, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteCallById = createAsyncThunk(
    "callList/getDeleteCallById",
    async (id, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(
                `meeting/meeting/update/${id}/`
            );
            return id;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);
export const updateCallById = createAsyncThunk(
    "callList/getUpdateCallById",
    async (data, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(
                `meeting/meeting/update/${data.call_id}/`,
                data
            );
            return { call_id: data.call_id, result: res?.data };
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const getNextCallList = createAsyncThunk(
    "callList/getNextCalls",
    async (
        { fields, searchData, next, doEncode },
        { rejectWithValue, getState }
    ) => {
        if (getState().search.activeSamplingRule) {
            const res = await getSampledCalls(
                getState().common.domain,
                getState().search.activeSamplingRule,
                next
            );
            if (res?.status === apiErrors.AXIOSERRORSTATUS) {
                return openNotification("error", "Error", res.message);
            } else {
                return res;
            }
        }
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

        try {
            let url = next?.split(".ai")?.[1] || `${searchConfig.GETRESULTS}`;

            // url = sortKey ? url + `?&order_by=${sortKey}` : url;
            const res = await axiosInstance.post(url, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const dowloadCallList = createAsyncThunk(
    "callList/download",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                `meeting/meeting/dump/download`,
                payload,
                Object.assign({ responseType: "arraybuffer" })
            );
            return res;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

const callListSlice = createSlice({
    name: "callListSlice",
    initialState,
    reducers: {
        setFetching(state, action) {
            state.loading = action.payload;
        },
        storeCalls(state, action) {
            state.calls = action.payload;
        },
    },
    extraReducers: {
        [getCallList.pending]: (state) => {
            state.fetchingCalls = true;
        },
        [getCallList.fulfilled]: (state, { payload }) => {
            state.fetchingCalls = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.calls = [...payload?.results];
            state.next_url = payload.next;
            state.count = payload.count;
        },
        [getNextCallList.fulfilled]: (state, { payload }) => {
            state.fetchingCalls = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.calls = [...state.calls, ...payload?.results];
            state.next_url = payload.next;
            state.count = payload.count;
        },
        [getCallList.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.fetchingCalls = false;
            openNotification("error", "Error", payload?.message);
        },
        [getNextCallList.rejected]: (state, { payload }) => {
            state.fetchingCalls = false;
            openNotification("error", "Error", payload?.message);
        },
        [deleteCallById.fulfilled]: (state, { payload }) => {
            state.fetchingCalls = false;
            const deletedCall = state.calls.find((call) => call.id === payload);
            state.calls = [
                ...state.calls.filter((call) => call.id !== payload),
            ];
            openNotification(
                "success",
                "Success",
                `Meeting with title ${deletedCall.title} has been deleted`
            );
        },
        [deleteCallById.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            openNotification("error", "Error", payload?.message);
        },
        [updateCallById.fulfilled]: (state, { payload }) => {
            state.fetchingCalls = false;
            // let callIndex;
            // const updatedCall = state.calls.find((call, idx) => {
            //     if(call.id === payload.call_id) {
            //         callIndex = idx;
            //         return true;
            //     }
            // });
            state.calls = [
                ...state.calls.map((call, idx) => {
                    if (call.id !== payload.call_id) {
                        return call;
                    } else {
                        state.calls[idx] = payload.result;
                        return state.calls[idx];
                    }
                }),
            ];
            openNotification("success", "Success", `Meeting has been updated`);
        },
        [updateCallById.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            openNotification("error", "Error", payload?.message);
        },
        [dowloadCallList.pending]: (state) => {
            state.loadingCalls = true;
        },
        [dowloadCallList.fulfilled]: (state, { payload }) => {
            state.loadingCalls = false;
            var blob = new Blob([payload.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(
                blob,
                `${
                    payload.headers?.["content-disposition"]
                        .split("filename=")[1]
                        .split(";")[0]
                        .split('"')[1]
                }`
            );
        },
        [dowloadCallList.rejected]: (state, { payload }) => {
            state.loadingCalls = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

export const { setFetching, storeCalls } = callListSlice.actions;

export default callListSlice.reducer;
