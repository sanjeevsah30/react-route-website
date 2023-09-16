import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    insightsLoading: false,
    insights: [],
    insightData: null,
    filter: null,
    saving: false,
};

export const getCIInsightsInternal = createAsyncThunk(
    "CI/getCIInsightInternal",
    async (type = "", { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(
                type
                    ? `/customer_intelligence/ci_insight/?type=${type}`
                    : `/customer_intelligence/ci_insight/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightsInternalById = createAsyncThunk(
    "CI/getCIInsightsInternalById",
    async (id, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(
                `/customer_intelligence/ci_insight/${id}/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightsFilterById = createAsyncThunk(
    "CI/getCIInsightsFilterById",
    async (id, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(`/audit/insight_filter/${id}/`);

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createCIInsightInternal = createAsyncThunk(
    "CI/createCIInsightInternal",
    async (payload = {}, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/ci_insight/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createCIInsightFilter = createAsyncThunk(
    "CI/createCIInsightFilter",
    async ({ payload, id }, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(`/audit/filter/`, payload);

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const updateCIInsightFilter = createAsyncThunk(
    "updateCIInsightFilter",
    async ({ payload, id }, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.patch(
                `/audit/insight_filter/${id}/`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(JSON.stringify(err.data));
        }
    }
);

export const updateCIInsightInternal = createAsyncThunk(
    "CI/updateCIInsightInternal",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.patch(
                `/customer_intelligence/ci_insight/${payload.id}/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(JSON.stringify(err.data));
        }
    }
);

export const deleteCIInsightInternal = createAsyncThunk(
    "CI/deleteCIInsightInternal",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.delete(
                `/customer_intelligence/ci_insight/${payload.id}/`
            );

            return payload;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteCIFilter = createAsyncThunk(
    "CI/deleteCIFilter",
    async (id, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.delete(
                `/audit/insight_filter/destory/${id}/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteCISubFilter = createAsyncThunk(
    "CI/deleteCISubFilter",
    async (id, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.delete(
                `/audit/sub_filter/destory/${id}/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const InternalCiDashboardSlice = createSlice({
    name: "InternalCiDashboardSlice",
    initialState,
    reducers: {
        clearInternalInsightData(state, action) {
            state.insightData = null;
        },
    },
    extraReducers: {
        [getCIInsightsInternal.pending]: (state, { payload }) => {
            state.insightsLoading = true;
        },
        [getCIInsightsInternal.fulfilled]: (state, { payload }) => {
            state.insightsLoading = false;

            state.insights = payload;
        },
        [getCIInsightsInternal.rejected]: (state, { payload }) => {
            state.insightsLoading = false;

            openNotification("error", "Error", payload?.message);
        },

        [getCIInsightsInternalById.pending]: (state, { payload }) => {
            state.insightsLoading = true;
        },

        [getCIInsightsInternalById.fulfilled]: (state, { payload }) => {
            state.insightsLoading = false;
            state.insightData = payload;
        },
        [getCIInsightsInternalById.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.insightsLoading = false;
            state.insightData = null;
            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightsFilterById.pending]: (state, { payload }) => {
            state.insightsLoading = true;
        },

        [getCIInsightsFilterById.fulfilled]: (state, { payload }) => {
            state.insightsLoading = false;
            state.filter = payload;
        },
        [getCIInsightsFilterById.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.insightsLoading = false;
            state.filter = null;
            openNotification("error", "Error", payload?.message);
        },

        [createCIInsightInternal.pending]: (state, { payload }) => {
            state.insightsLoading = true;
        },

        [createCIInsightInternal.fulfilled]: (state, { payload }) => {
            state.insightsLoading = false;
            state.insights = [...state.insights, payload];
        },
        [createCIInsightInternal.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.insightsLoading = false;
            openNotification("error", "Error", payload?.message);
        },
        [updateCIInsightInternal.pending]: (state, { payload }) => {
            state.insightsLoading = true;
        },

        [updateCIInsightInternal.fulfilled]: (state, { payload }) => {
            state.insightsLoading = false;
            state.insightData = payload;
        },
        [updateCIInsightInternal.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.insightsLoading = false;

            openNotification("error", "Error", payload?.message);
        },
        [createCIInsightFilter.pending]: (state, { payload }) => {
            state.insightsLoading = true;
        },

        [createCIInsightFilter.fulfilled]: (state, { payload }) => {
            state.insightsLoading = false;
        },
        [createCIInsightFilter.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.insightsLoading = false;

            openNotification("error", "Error", payload?.message);
        },
        [updateCIInsightFilter.pending]: (state, { payload }) => {
            state.insightsLoading = true;
        },

        [updateCIInsightFilter.fulfilled]: (state, { payload }) => {
            state.insightsLoading = false;
        },
        [updateCIInsightFilter.rejected]: (state, { payload }) => {
            state.insightsLoading = false;
            openNotification("error", "Error", payload);
        },
        [deleteCIInsightInternal.pending]: (state, { payload }) => {},

        [deleteCIInsightInternal.fulfilled]: (state, { payload }) => {
            if (payload.isSub) {
                state.insights = state.insights.map((e) => {
                    if (e.id === payload.insight_id) {
                        return {
                            ...e,
                            sub_insight: e.sub_insight.filter(
                                (i) => i.id !== payload.id
                            ),
                        };
                    } else return e;
                });
            } else {
                state.insights = state.insights.filter(
                    (e) => e.id !== payload.id
                );
            }
        },
        [deleteCIInsightInternal.rejected]: (state, { payload }) => {
            openNotification("error", "Error", payload);
        },
        [deleteCIFilter.pending]: (state, { payload }) => {},

        [deleteCIFilter.fulfilled]: (state, { payload }) => {},
        [deleteCIFilter.rejected]: (state, { payload }) => {
            openNotification("error", "Error", payload);
        },
        [deleteCISubFilter.pending]: (state, { payload }) => {},

        [deleteCISubFilter.fulfilled]: (state, { payload }) => {},
        [deleteCISubFilter.rejected]: (state, { payload }) => {
            openNotification("error", "Error", payload);
        },
    },
});
export const { clearInternalInsightData } = InternalCiDashboardSlice.actions;
export default InternalCiDashboardSlice.reducer;
