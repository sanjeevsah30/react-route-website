import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";
import { getCoachingSessionList } from "./coaching.store";

const initialState = {
    loading: false,
    is_creating: false,
    libraryModules: [],
    successCreated: true,
};

export const getLibraryModules = createAsyncThunk(
    "createCoachingSlice/getLibraryModules",
    async (id, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(`/library/category_list_view/`);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const createCoaching = createAsyncThunk(
    "createCoachingSlice/createCoaching",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                `/coachings/create_manual_coaching/`,
                payload
            );
            dispatch(setCoachingCreated(true));
            openNotification(
                "success",
                "Success",
                "Session Created successfully"
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createAssesment = createAsyncThunk(
    "createCoachingSlice/createAssesment",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                `/coachings/assessments/create/`,
                payload
            );
            dispatch(setCoachingCreated(true));
            openNotification(
                "success",
                "Success",
                "Session Created successfully"
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const createCoachingSlice = createSlice({
    name: "createCoachingSlice",
    initialState,
    reducers: {
        setCoachingCreated(state, action) {
            state.successCreated = action.payload;
        },
    },
    extraReducers: {
        [getLibraryModules.pending]: (state) => {
            state.loading = true;
        },
        [getLibraryModules.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.libraryModules = payload;
        },
        [getLibraryModules.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [createCoaching.pending]: (state) => {
            state.is_creating = true;
        },
        [createCoaching.fulfilled]: (state, { payload }) => {
            state.is_creating = false;
        },
        [createCoaching.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.is_creating = false;
            openNotification("error", "Error", payload?.message);
        },
        [createAssesment.pending]: (state) => {
            state.is_creating = true;
        },
        [createAssesment.fulfilled]: (state, { payload }) => {
            state.is_creating = false;
        },
        [createAssesment.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.is_creating = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

export const { setCoachingCreated } = createCoachingSlice.actions;

export default createCoachingSlice.reducer;
