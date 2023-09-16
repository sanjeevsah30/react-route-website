import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    allUsers: [],
    loading: true,
    auditors: [],
};

export const getUserMangerList = createAsyncThunk(
    "userMangaer/getUserMangerList",
    async (_, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(`/person/person/list_all/`);

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getAuditors = createAsyncThunk(
    "userMangaer/getAuditors",
    async (_, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(`/person/list_auditor/`);

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const userManagerSlice = createSlice({
    name: "user_manager",
    initialState,
    reducers: {
        updateUserMangerList(state, { payload }) {
            state.allUsers = payload;
        },
    },
    extraReducers: {
        [getUserMangerList.pending]: (state) => {
            state.loading = true;
        },
        [getUserMangerList.fulfilled]: (state, { payload }) => {
            state.loading = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.allUsers = [...payload];
        },
        [getUserMangerList.rejected]: (state, { payload }) => {
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getAuditors.pending]: (state) => {
            state.loading = true;
        },
        [getAuditors.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.auditors = [...payload];
        },
        [getAuditors.rejected]: (state, { payload }) => {
            state.loading = false;
            // openNotification('error', 'Error', payload?.message);
        },
    },
});

export const { updateUserMangerList } = userManagerSlice.actions;
export default userManagerSlice.reducer;
