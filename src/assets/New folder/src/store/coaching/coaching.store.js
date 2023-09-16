import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";
import { months, yearlyCoachingSessions } from "@tools/helpers";
import { fetchModule } from "../../store/coaching/action";
import { useSelector } from "react-redux";

const initialState = {
    coaching_loading: false,

    coaching_sessions: [],
    error: "",
    session: {
        loading: false,
        data: {},
        error: "",
    },
    oneModule: {
        module_loading: false,
        module_data: {},
        error: "",
    },
    clip: {
        clip_loading: false,
        clip_data_: {},
        error: "",
    },

    activeCoachingFilters: [], // these filters are formated coachingFilters to display on dashboard UI prupose
    coachingFilters: {
        session_type: "all",
        session_progress: "all",
    },
    defaultCoachingFilters: {
        session_type: "all",
        session_progress: "all",
    },

    tiles_loading: false,
    manager_tiles_data: [],
    manager_individual_tiles_data: {},
    rep_tiles_data: [],

    individual_team_tiles_data: [],

    rep_leaderboard_loading: false,
    rep_leaderboard: [],

    completionGraph_loading: false,
    completionGraph_data: [],

    leaderboard_table_loading: [],
    leaderboard_table: [],

    session_list_loading: false,
    coaching_session_list: [],

    assesments: [],

    verifying_assessment: false,
};

export const getCoachingSessionList = createAsyncThunk(
    "coaching/getSessionList",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                "/coachings/assigned_coaching/",
                payload
            );

            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const getRepTiles = createAsyncThunk(
    "coaching/getRepTiles",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                "/coachings/rep/tile/",
                payload
            );

            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const getManagerTiles = createAsyncThunk(
    "coaching/getMangerTiles",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                "/coachings/manager/tile/",
                payload
            );

            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const getManagerIndividualTiles = createAsyncThunk(
    "coaching/getMangerIndividualTiles",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                "/coachings/manager/individual_team_tiles/",
                payload
            );

            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);
export const getRepLeaderboard = createAsyncThunk(
    "coaching/getRepLeaderboard",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                "/coachings/rep/leaderboard/",
                payload
            );

            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteCoaching = createAsyncThunk(
    "createCoachingSlice/deleteCoaching",
    async (id, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.delete(`/coachings/destroy/${id}/`);
            return id;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getLeaderboardTable = createAsyncThunk(
    "coaching/getLeaderboardTable",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                "coachings/manager/leaderboard/",
                payload
            );

            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);
export const getCompletionGraph = createAsyncThunk(
    "coaching/getCompletionGraph",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                "/coachings/completion_graph/",
                payload
            );

            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);
export const getCoachingSessions = createAsyncThunk(
    "coaching/getCoachingSessions",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                "/coachings/coaching_session/",
                payload
            );

            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);
export const getActiveCoachingSession = createAsyncThunk(
    "coaching/getActiveCoachingSession",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                `/coachings/coaching_session/${payload.id}/`,
                { reps_id: payload.reps_id }
            );
            if (res?.data?.module_stats?.length)
                dispatch(
                    fetchModule({
                        module_id: res?.data?.module_stats?.[0]?.module,
                        reps_id: [res?.data?.rep],
                    })
                );
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const getCoachingAssesment = createAsyncThunk(
    "coaching/getCoachingAssesment",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(`/coachings/assessments/`);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getStatusAssesment = createAsyncThunk(
    "coaching/getStatusAssesment",
    async (id, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(
                `/coachings/assessments/status/${id}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const coachingSlice = createSlice({
    name: "coaching",
    initialState,
    reducers: {
        setCoachingFilter(state, action) {
            state.coachingFilters = {
                ...state.coachingFilters,
                ...action.payload,
            };
        },
        setActiveCoachingFilter(state, { payload }) {
            state.activeCoachingFilters = payload;
        },
        setCoachingSession(state, { payload }) {
            state.session.data = payload;
        },

        storeCoachingSessions(state, { payload }) {
            state.coaching_sessions = payload;
        },
    },
    extraReducers: {
        [getRepTiles.pending]: (state, { payload }) => {
            state.tiles_loading = true;
        },
        [getRepTiles.fulfilled]: (state, { payload }) => {
            state.tiles_loading = false;
            state.rep_tiles_data = payload;
        },
        [getRepTiles.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.tiles_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getManagerTiles.pending]: (state, { payload }) => {
            state.tiles_loading = true;
        },
        [getManagerTiles.fulfilled]: (state, { payload }) => {
            state.tiles_loading = false;
            state.manager_tiles_data = payload;
        },
        [getManagerTiles.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.tiles_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getManagerIndividualTiles.pending]: (state, { payload }) => {
            state.tiles_loading = true;
        },
        [getManagerIndividualTiles.fulfilled]: (state, { payload }) => {
            state.tiles_loading = false;
            state.manager_individual_tiles_data = payload;
        },
        [getManagerIndividualTiles.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.tiles_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getRepLeaderboard.pending]: (state, { payload }) => {
            state.rep_leaderboard_loading = true;
        },
        [getRepLeaderboard.fulfilled]: (state, { payload }) => {
            state.rep_leaderboard_loading = false;
            state.rep_leaderboard = payload;
        },
        [getRepLeaderboard.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.rep_leaderboard_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getLeaderboardTable.pending]: (state, { payload }) => {
            state.leaderboard_table_loading = true;
        },
        [getLeaderboardTable.fulfilled]: (state, { payload }) => {
            state.leaderboard_table_loading = false;
            state.leaderboard_table = payload;
        },
        [getLeaderboardTable.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.leaderboard_table_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getCompletionGraph.pending]: (state, { payload }) => {
            state.completionGraph_loading = true;
        },
        [getCompletionGraph.fulfilled]: (state, { payload }) => {
            state.completionGraph_loading = false;

            state.completionGraph_data = [
                {
                    id: "Completion",
                    label: "Completion",
                    name: "Completion",
                    color: "#1a62f2",

                    data: payload.map(({ epoch, percentage }) => {
                        return {
                            x: `${new Date(epoch).getDate()} ${
                                months[new Date(epoch).getMonth()]
                            }`,
                            y: percentage,
                            trend: null,
                        };
                    }),
                },
            ];
        },
        [getCompletionGraph.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.completionGraph_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getCoachingSessions.pending]: (state, { payload }) => {
            state.coaching_loading = true;
        },
        [getCoachingSessions.fulfilled]: (state, { payload }) => {
            state.coaching_loading = false;
            state.coaching_sessions = payload;
        },
        [getCoachingSessions.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.coaching_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getActiveCoachingSession.pending]: (state, { payload }) => {
            state.session.loading = true;
        },
        [getActiveCoachingSession.fulfilled]: (state, { payload }) => {
            state.session.loading = false;
            state.session.data = payload;
        },
        [getActiveCoachingSession.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.session.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getCoachingSessionList.pending]: (state, { payload }) => {
            state.session_list_loading = true;
        },
        [getCoachingSessionList.fulfilled]: (state, { payload }) => {
            state.session_list_loading = false;
            state.coaching_session_list = payload;
        },
        [getCoachingSessionList.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.session_list_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [deleteCoaching.pending]: (state) => {},
        [deleteCoaching.fulfilled]: (state, { payload }) => {
            state.coaching_session_list = state.coaching_session_list?.filter(
                ({ id }) => {
                    return id !== payload;
                }
            );
        },
        [deleteCoaching.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            openNotification("error", "Error", payload?.message);
        },
        [getCoachingAssesment.pending]: (state) => {},
        [getCoachingAssesment.fulfilled]: (state, { payload }) => {
            state.assesments = [...payload];
        },
        [getCoachingAssesment.rejected]: (state, { payload }) => {
            openNotification("error", "Error", payload?.message);
        },
        [getStatusAssesment.pending]: (state) => {
            state.verifying_assessment = true;
        },
        [getStatusAssesment.fulfilled]: (state, { payload }) => {
            state.verifying_assessment = false;
        },
        [getStatusAssesment.rejected]: (state, { payload }) => {
            state.verifying_assessment = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

export const {
    setCoachingFilter,
    setActiveCoachingFilter,
    setCoachingSession,
    storeCoachingSessions,
} = coachingSlice.actions;
export default coachingSlice.reducer;
