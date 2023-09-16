import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    loading: false,
    clips: [],
    verifyingClip: {},
    next: null,
    count: 0,
    nextLoading: false,
    thread: null,
    thread_status: {},
};

export const getTreaad = createAsyncThunk(
    "getThread",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `coachings/internal_coaching/`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const getInternalCochingThread = createAsyncThunk(
    "internalCochingThread",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `coachings/internal_coaching/`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const getInternalCoachingClips = createAsyncThunk(
    "internalCoachingClips/clips",
    async ({ id, status }, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(
                status && status?.toLowerCase() !== "all"
                    ? `coachings/internal_clip/?question_id=${id}&status=${status}`
                    : `coachings/internal_clip/?question_id=${id}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const getNextInternalCoachingClips = createAsyncThunk(
    "internalCoachingClips/nextClips",
    async (next, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(next);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteInternalCoachingClip = createAsyncThunk(
    "internalCoachingClips/delete",
    async (id, { rejectWithValue, getState, dispatch }) => {
        try {
            dispatch(setClipVerifying(id));

            const res = await axiosInstance.delete(
                `coachings/internal_clip/${id}/`
            );
            dispatch(deleteClipVerifying(id));
            return id;
        } catch (err) {
            dispatch(deleteClipVerifying(id));
            return rejectWithValue(getError(err));
        }
    }
);

export const verifyInternalCoachingClip = createAsyncThunk(
    "internalCoachingClips/verify",
    async ({ id, payload }, { rejectWithValue, getState, dispatch }) => {
        try {
            dispatch(setClipVerifying(id));

            const res = await axiosInstance.patch(
                `coachings/internal_clip/${id}/`,
                payload
            );
            dispatch(deleteClipVerifying(id));
            return res.data;
        } catch (err) {
            dispatch(deleteClipVerifying(id));
            return rejectWithValue(getError(err));
        }
    }
);

const internalCoachingSlice = createSlice({
    name: "internalCoachingSlice",
    initialState,
    reducers: {
        setClipVerifying(state, action) {
            state.verifyingClip = {
                ...state.verifyingClip,
                [action.payload]: true,
            };
        },
        deleteClipVerifying(state, action) {
            state.verifyingClip = {
                ...state.verifyingClip,
                [action.payload]: false,
            };
        },
    },
    extraReducers: {
        [getInternalCoachingClips.pending]: (state) => {
            state.loading = true;
        },
        [getInternalCoachingClips.fulfilled]: (state, { payload }) => {
            state.loading = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.clips = payload.results;
            state.next = payload.next;
            state.count = payload.count;
        },
        [getInternalCoachingClips.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getNextInternalCoachingClips.pending]: (state) => {
            state.nextLoading = true;
        },
        [getNextInternalCoachingClips.fulfilled]: (state, { payload }) => {
            state.nextLoading = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.clips = [...state.clips, ...payload.results];
            state.next = payload.next;
            state.count = payload.count;
        },
        [getNextInternalCoachingClips.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.nextLoading = false;
            openNotification("error", "Error", payload?.message);
        },

        [deleteInternalCoachingClip.fulfilled]: (state, { payload }) => {
            state.clips = state.clips.filter((clip) => clip.id !== payload);
        },
        [deleteInternalCoachingClip.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [verifyInternalCoachingClip.fulfilled]: (state, { payload }) => {
            state.loading = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.clips = state.clips.map((clip) =>
                clip.id === payload.id ? payload : clip
            );
        },
        [verifyInternalCoachingClip.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getInternalCochingThread.pending]: (state) => {
            state.loading = true;
        },
        [getInternalCochingThread.fulfilled]: (state, { payload }) => {
            state.loading = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.thread = payload;
        },
        [getInternalCochingThread.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getTreaad.pending]: (state) => {
            state.loading = true;
        },
        [getTreaad.fulfilled]: (state, { payload }) => {
            state.loading = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.thread_status = payload;
        },
        [getTreaad.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

export const { setClipVerifying, deleteClipVerifying } =
    internalCoachingSlice.actions;
export default internalCoachingSlice.reducer;
