import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    violations: {
        loading: false,
        creating_violation_loader: false,
        data: [],
    },
};

export const getViolations = createAsyncThunk(
    "violation_manager/getViolations",
    async (_, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(`/audit/violation/list_all/`);

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createViolation = createAsyncThunk(
    "violation_manager/createViolation",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/audit/violation/create/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const updateViolation = createAsyncThunk(
    "violation_manager/updateViolation",
    async ({ payload, id }, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.patch(
                `/audit/violation/${id}/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteViolation = createAsyncThunk(
    "violation_manager/deleteViolation",
    async (id, { rejectWithValue, getState }) => {
        try {
            await axiosInstance.delete(`/audit/violation/${id}/`);

            return id;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const violationsManagerSlice = createSlice({
    name: "violation_manager",
    initialState,
    reducers: {},
    extraReducers: {
        [getViolations.pending]: (state) => {
            state.violations.loading = true;
        },
        [getViolations.fulfilled]: (state, { payload }) => {
            state.violations.loading = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.violations.data = [...payload];
        },
        [getViolations.rejected]: (state, { payload }) => {
            state.violations.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [createViolation.pending]: (state) => {
            state.violations.creating_violation_loader = true;
        },
        [createViolation.fulfilled]: (state, { payload }) => {
            state.violations.creating_violation_loader = false;
            state.violations.data = [...state.violations.data, payload];
        },
        [createViolation.rejected]: (state, { payload }) => {
            state.violations.creating_violation_loader = false;
            openNotification("error", "Error", payload?.message);
        },
        [updateViolation.pending]: (state) => {
            state.violations.creating_violation_loader = true;
        },
        [updateViolation.fulfilled]: (state, { payload }) => {
            state.violations.creating_violation_loader = false;
            state.violations.data = state.violations.data.map((item) =>
                +item.id === +payload.id ? payload : item
            );
        },
        [updateViolation.rejected]: (state, { payload }) => {
            state.violations.creating_violation_loader = false;
            openNotification("error", "Error", payload?.message);
        },
        [deleteViolation.pending]: (state) => {
            state.violations.creating_violation_loader = true;
        },
        [deleteViolation.fulfilled]: (state, { payload }) => {
            state.violations.creating_violation_loader = false;
            state.violations.data = state.violations.data.filter(
                (item) => +item.id !== +payload
            );
        },
        [deleteViolation.rejected]: (state, { payload }) => {
            state.violations.creating_violation_loader = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

// export const {} = violationsManagerSlice.actions;
export default violationsManagerSlice.reducer;
