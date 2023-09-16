import { axiosInstance } from "@apis/axiosInstance";

import { getError } from "@apis/common/index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification, setActiveReportType } from "@store/common/actions";

const initialState = {
    reports: {
        loading: false,
        data: {
            count: 0,
            next: null,
            prev: null,
            results: [],
        },
    },
    default_reports: {
        loading: true,
        data: [],
    },
    all_reports: {
        loading: true,
        data: [],
    },
    updating_report: false,
};

export const getDefaultReports = createAsyncThunk(
    "scheduled_reports/getDefaultReports",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            // dispatch(clearDefaultReports())
            // const res = await axiosInstance.get(`/analytics/dashboard/reports/list/`, { body: { ...payload } });
            const res = await axiosInstance.post(
                `/analytics/dashboard/reports/list/`,
                payload
            );
            if (res.data.length) {
                // dispatch(setActiveReportType(res?.data[0]?.type));
            }
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getAllReports = createAsyncThunk(
    "scheduled_reports/getAllReports",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(`/analytics/reports/list/`);

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createScheduleReport = createAsyncThunk(
    "scheduled_reports/createScheduleReport",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/analytics/reports/create/`,
                payload
            );

            openNotification("success", "Success", "Report Scheduled");

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const updateScheduleReport = createAsyncThunk(
    "scheduled_reports/updateScheduleReport",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.patch(
                `/analytics/schedule_reports/${payload.id}/`,
                payload.data
            );

            // openNotification('success', 'Success', 'Report Scheduled');

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteScheduleReport = createAsyncThunk(
    "scheduled_reports/deleteScheduleReport",
    async (payload, { rejectWithValue, getState }) => {
        try {
            await axiosInstance.delete(
                `/analytics/schedule_reports/${payload.id}/`
            );

            return payload;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getScheduledReports = createAsyncThunk(
    "scheduled_reports/getScheduledReports",
    async (next, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(
                next || `/analytics/schedule_reports/list_all/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const schSlice = createSlice({
    name: "scheduled_reports",
    initialState,
    reducers: {
        clearDefaultReports(state, action) {
            state.default_reports.loading = true;
            state.default_reports.data = [];
        },
    },
    extraReducers: {
        [getScheduledReports.pending]: (state) => {
            state.reports.loading = true;
        },
        [getScheduledReports.fulfilled]: (state, { payload }) => {
            state.reports.loading = false;
            state.reports.data = { ...payload };
        },
        [getScheduledReports.rejected]: (state, { payload }) => {
            state.reports.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getAllReports.pending]: (state) => {
            state.all_reports.loading = true;
        },
        [getAllReports.fulfilled]: (state, { payload }) => {
            state.all_reports.loading = false;

            state.all_reports.data = [...payload];
        },
        [getAllReports.rejected]: (state, { payload }) => {
            state.all_reports.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getDefaultReports.pending]: (state) => {
            state.default_reports.loading = true;
        },
        [getDefaultReports.fulfilled]: (state, { payload }) => {
            state.default_reports.loading = false;

            state.default_reports.data = [...payload];
        },
        [getDefaultReports.rejected]: (state, { payload }) => {
            state.default_reports.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [createScheduleReport.pending]: (state) => {
            state.updating_report = true;
        },
        [createScheduleReport.fulfilled]: (state, { payload }) => {
            state.updating_report = false;
            // state.default_reports.data = [...payload];
        },
        [createScheduleReport.rejected]: (state, { payload }) => {
            state.updating_report = false;
            openNotification("error", "Error", payload?.message);
        },
        [updateScheduleReport.pending]: (state) => {
            state.updating_report = true;
        },
        [updateScheduleReport.fulfilled]: (state, { payload }) => {
            state.updating_report = false;

            const temp = state.reports.data.results.map((item) =>
                item.id === payload.id ? payload : item
            );
            state.reports.data.results = temp;
        },
        [updateScheduleReport.rejected]: (state, { payload }) => {
            state.updating_report = false;
            openNotification("error", "Error", payload?.message);
        },
        [deleteScheduleReport.pending]: (state) => {
            state.updating_report = true;
        },
        [deleteScheduleReport.fulfilled]: (state, { payload }) => {
            state.updating_report = false;

            const temp = state.reports.data.results.filter(
                (item) => item.id !== payload.id
            );
            state.reports.data.results = temp;
        },
        [deleteScheduleReport.rejected]: (state, { payload }) => {
            state.updating_report = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

export const { clearDefaultReports } = schSlice.actions;
export default schSlice.reducer;
