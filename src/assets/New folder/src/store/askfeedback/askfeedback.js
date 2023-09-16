import { axiosInstance } from "@apis/axiosInstance";
import apiConfigs from "@apis/common/commonApiConfig";
import { getError } from "@apis/common/index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { openNotification } from "@store/common/actions";

const initialState = {
    status: {
        emailStatus: "",
        loading: false,
        isSuccess: false,
    },
};

export const sendFeedback = createAsyncThunk(
    "askfeedback/sendFeedback",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `${apiConfigs.HTTPS}${getState().common.domain}.${
                    apiConfigs.BASEURL
                }/meeting/meeting/feedback/request/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const askfeedbackSlice = createSlice({
    name: "askfeedback",
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendFeedback.pending, (state, action) => {
                state.status.loading = true;
            })
            .addCase(sendFeedback.fulfilled, (state, action) => {
                state.status.loading = false;
                state.status.emailStatus = action.payload;
                state.status.isSuccess = true;
                openNotification(
                    "success",
                    "Success",
                    "Email sent successfully"
                );
            })
            .addCase(sendFeedback.rejected, (state, action) => {
                state.status.loading = false;
                state.status.isSuccess = true;
                openNotification("error", "Error", action.payload?.message);
            });
    },
});

export const { reset } = askfeedbackSlice.actions;
export default askfeedbackSlice.reducer;
