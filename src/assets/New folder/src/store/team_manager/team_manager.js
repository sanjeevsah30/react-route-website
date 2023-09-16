import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllTeams,
    getAllUsers,
    openNotification,
} from "@store/common/actions";

const initialState = {
    loading: false,
    teams: [],
};

export const handleSubteamDelete = (id, domain) => {
    return axiosInstance.delete(`/person/team/edit/${id}`);
};

export const createTeam = createAsyncThunk(
    "team_manager/createTeam",
    async (
        { payload, closeDrawer = () => {} },
        { rejectWithValue, getState, dispatch }
    ) => {
        try {
            const res = await axiosInstance.post(
                `/person/team/create/`,
                payload
            );
            closeDrawer();
            dispatch(getAllUsers());
            dispatch(getAllTeams());
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const updateTeam = createAsyncThunk(
    "team_manager/updateTeam",
    async (
        { payload, closeDrawer = () => {} },
        { rejectWithValue, getState, dispatch }
    ) => {
        try {
            const res = await axiosInstance.patch(
                `/person/team/edit/${payload.id}`,
                payload
            );
            dispatch(getAllUsers());
            closeDrawer();
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteTeam = createAsyncThunk(
    "team_manager/deleteTeam",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.delete(
                `/person/team/edit/${payload}`
            );
            dispatch(getAllUsers());

            return payload;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const teamManagerSlice = createSlice({
    name: "team_manager",
    initialState,
    reducers: {
        storeTeamsForTeamManager(state, action) {
            state.teams = action.payload;
        },

        setTeamsLoadingForTeamManager(state, action) {
            state.loading = action.payload;
        },
    },
    extraReducers: {
        [createTeam.pending]: (state) => {
            state.loading = true;
        },
        [createTeam.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.teams = [...state.teams, payload];
        },
        [createTeam.rejected]: (state, { payload }) => {
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [updateTeam.pending]: (state) => {
            state.loading = true;
        },
        [updateTeam.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.teams = state.teams.map((e) => {
                if (e.id === payload.id) return payload;
                return e;
            });
        },
        [updateTeam.rejected]: (state, { payload }) => {
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [deleteTeam.pending]: (state) => {
            state.loading = true;
        },
        [deleteTeam.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.teams = state.teams.filter((e) => {
                return e.id !== payload;
            });
        },
        [deleteTeam.rejected]: (state, { payload }) => {
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

export const { storeTeamsForTeamManager, setTeamsLoadingForTeamManager } =
    teamManagerSlice.actions;
export default teamManagerSlice.reducer;
