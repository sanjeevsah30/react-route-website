import apiConfigs from "@apis/common/commonApiConfig";
import { getAuthHeader, getError } from "@apis/common/index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    ErrorSnackBar,
    openNotification,
    successSnackBar,
} from "@store/common/actions";

import axios from "axios";

const initialState = {
    loading: false,
    error: null,
    data: null,
    momentCreate: {
        isCreated: false,
        isError: false,
    },
    momentDelete: {
        isDeleted: false,
        isDeleteError: false,
    },
    momentUpdate: {
        isUpdated: false,
        isUpdateError: false,
    },
    channel: null,
    orderUpdate: {
        isUpdate: false,
        isUpdateError: false,
    },
};

export const getMoments = createAsyncThunk(
    "momentSettings/getMoments",
    async (_, { getState, rejectWithValue }) => {
        try {
            const res = await axios.get(
                `${apiConfigs.HTTPS}${getState().common.domain}.${
                    apiConfigs.BASEURL
                }/meeting/moments-list/`,
                getAuthHeader()
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

// create a new moment
export const createMoment = createAsyncThunk(
    "momentSettings/createMoment",
    async (data, { getState, rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${apiConfigs.HTTPS}${getState().common.domain}.${
                    apiConfigs.BASEURL
                }/meeting/moments-create/`,
                {
                    ...data,
                    order: 1,
                },
                getAuthHeader()
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

// delete a moment
export const deleteMoment = createAsyncThunk(
    "momentSettings/deleteMoment",
    async (id, { getState, rejectWithValue }) => {
        try {
            const res = await axios.delete(
                `${apiConfigs.HTTPS}${getState().common.domain}.${
                    apiConfigs.BASEURL
                }/meeting/moments/${id}/`,
                getAuthHeader()
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

// patch a moment
export const updateMoment = createAsyncThunk(
    "momentSettings/updateMoment",
    async (data, { getState, rejectWithValue }) => {
        try {
            const res = await axios.patch(
                `${apiConfigs.HTTPS}${getState().common.domain}.${
                    apiConfigs.BASEURL
                }/meeting/moments/${data.id}/`,
                {
                    color_code: data.color_code,
                    slack_channel: data.slack_channel,
                },
                getAuthHeader()
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

// get slack channel list
export const getSlackChannels = createAsyncThunk(
    "momentSettings/getSlackChannels",
    async (_, { getState, rejectWithValue }) => {
        try {
            const res = await axios.get(
                `${apiConfigs.HTTPS}${getState().common.domain}.${
                    apiConfigs.BASEURL
                }/meeting/slack-channels-list/`,
                getAuthHeader()
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

// batch update order
export const updateOrder = createAsyncThunk(
    "momentSettings/updateOrder",
    async (data, { getState, rejectWithValue }) => {
        try {
            const res = await axios.patch(
                `${apiConfigs.HTTPS}${getState().common.domain}.${
                    apiConfigs.BASEURL
                }/meeting/moments/${data.id}/`,
                {
                    order: data.index,
                },
                getAuthHeader()
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

// Moments slice
const momentSettingsSlice = createSlice({
    name: "momentSettings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMoments.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(getMoments.rejected, (state, action) => {
                state.loading = false;
                openNotification(
                    "error",
                    "Error",
                    "Error occurred while fetching moments!"
                );
            })
            .addCase(getMoments.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(createMoment.fulfilled, (state, action) => {
                state.momentCreate.isCreated = true;
                successSnackBar("Success", "Moment created successfully");
            })
            .addCase(createMoment.rejected, (state, action) => {
                state.momentCreate.isCreated = false;
                state.momentCreate.isError = true;
                openNotification("error", "Error", "Fields Required");
            })
            .addCase(deleteMoment.fulfilled, (state, action) => {
                state.momentDelete.isDeleted = true;
                successSnackBar("Success", "Moment deleted successfully");
            })
            .addCase(deleteMoment.rejected, (state, action) => {
                state.momentDelete.isDeleted = false;
                state.momentDelete.isDeleteError = true;
                openNotification(
                    "error",
                    "Error",
                    "Error while deleteing moment!"
                );
            })
            .addCase(updateMoment.fulfilled, (state, action) => {
                state.momentUpdate.isUpdated = true;
                // successSnackBar('Success', 'Moment updated successfully');
            })
            .addCase(updateMoment.rejected, (state, action) => {
                state.momentUpdate.isUpdated = false;
                state.momentUpdate.isUpdateError = true;
                openNotification(
                    "error",
                    "Error",
                    "Error while updating moment!"
                );
            })
            .addCase(getSlackChannels.fulfilled, (state, action) => {
                state.channel = action.payload;
            })
            .addCase(getSlackChannels.rejected, (state, action) => {
                openNotification(
                    "error",
                    "Error",
                    "Error getting slack channels"
                );
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.orderUpdate.isUpdated = true;
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.orderUpdate.isUpdated = false;
                state.orderUpdate.isUpdateError = true;
                openNotification(
                    "error",
                    "Error",
                    "Error while updating order!"
                );
            });
    },
});

export default momentSettingsSlice.reducer;
