import { axiosInstance, gptServiceBaseApi } from "@apis/axiosInstance";
import { getServiceApiError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    loading: false,
    is_loading_response: false,
    is_submitting_feedback: false,
    gptChat: {
        data: [],
        loading: false,
    },
    activeGptChat: {
        data: {
            messages: [],
        },
        loading: false,
    },
};

export const getGptChatList = createAsyncThunk(
    "gptSlice/getGptChatList",
    async ({ next }, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(
                next || `${gptServiceBaseApi}/chat/list/`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getServiceApiError(err.response.data));
        }
    }
);

export const createNewChat = createAsyncThunk(
    "gptSlice/createNewChat",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                `${gptServiceBaseApi}/chat/query/`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getServiceApiError(err.response.data));
        }
    }
);

export const getActiveChatHistoryById = createAsyncThunk(
    "gptSlice/getActiveChatHistoryById",
    async (id, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(
                `${gptServiceBaseApi}/chat/${id}/`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getServiceApiError(err.response.data));
        }
    }
);

export const deleteChatHistoryById = createAsyncThunk(
    "gptSlice/deleteChatHistoryById",
    async (id, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(
                `${gptServiceBaseApi}/chat/${id}/`
            );
            return { id };
        } catch (err) {
            return rejectWithValue(getServiceApiError(err.response.data));
        }
    }
);

export const createChatQueryById = createAsyncThunk(
    "gptSlice/createChatQueryById",
    async ({ payload }, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                `${gptServiceBaseApi}/chat/query/`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getServiceApiError(err.response.data));
        }
    }
);

export const gptGiveFeedback = createAsyncThunk(
    "gptSlice/gptGiveFeedback",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                `${gptServiceBaseApi}/chat/feedback/`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getServiceApiError(err.response.data));
        }
    }
);

const gptSlice = createSlice({
    name: "gptSlice",
    initialState,
    reducers: {
        resetGptChatHistory(state, action) {
            state.activeGptChat.data = {
                messages: [],
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createNewChat.pending, (state, action) => {
            state.is_loading_response = true;
        });
        builder.addCase(createNewChat.fulfilled, (state, action) => {
            state.is_loading_response = false;
            state.gptChat.data = [...state.gptChat.data, action.payload.data];
            state.activeGptChat = {
                loading: false,
                data: { ...action.payload.data },
            };
        });
        builder.addCase(createNewChat.rejected, (state, { payload }) => {
            state.is_loading_response = false;
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(getGptChatList.pending, (state, action) => {
            if (!action?.meta?.arg?.next) {
                state.gptChat.loading = true;
            }
        });
        builder.addCase(getGptChatList.fulfilled, (state, action) => {
            state.gptChat = { loading: false, ...action.payload };
        });
        builder.addCase(getGptChatList.rejected, (state, { payload }) => {
            state.gptChat.loading = false;
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(gptGiveFeedback.pending, (state, action) => {
            state.is_submitting_feedback = true;
        });
        builder.addCase(gptGiveFeedback.fulfilled, (state, action) => {
            state.is_submitting_feedback = false;
        });
        builder.addCase(gptGiveFeedback.rejected, (state, { payload }) => {
            state.is_submitting_feedback = false;
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(getActiveChatHistoryById.pending, (state, action) => {
            state.activeGptChat.loading = true;
            state.activeGptChat.data = { messages: [] };
        });
        builder.addCase(getActiveChatHistoryById.fulfilled, (state, action) => {
            state.activeGptChat = {
                loading: false,
                data: { ...action.payload.data },
            };
        });
        builder.addCase(
            getActiveChatHistoryById.rejected,
            (state, { payload }) => {
                state.activeGptChat.loading = false;
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(deleteChatHistoryById.pending, (state, action) => {});
        builder.addCase(
            deleteChatHistoryById.fulfilled,
            (state, { payload }) => {
                state.gptChat.data = [...state.gptChat.data].filter(
                    (e) => e.id !== payload.id
                );
            }
        );
        builder.addCase(
            deleteChatHistoryById.rejected,
            (state, { payload }) => {
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(createChatQueryById.pending, (state, action) => {
            state.is_loading_response = true;
            state.activeGptChat.data.messages = [
                ...state.activeGptChat.data.messages,
                { content: { query: action.meta.arg.payload.query } },
            ];
        });
        builder.addCase(createChatQueryById.fulfilled, (state, action) => {
            state.is_loading_response = false;
            state.activeGptChat.data.messages = action.payload.data.messages;
        });
        builder.addCase(createChatQueryById.rejected, (state, { payload }) => {
            state.is_loading_response = false;
            state.activeGptChat.data.messages.pop();
            openNotification("error", "Error", payload?.message);
        });
    },
});

export const { resetGptChatHistory } = gptSlice.actions;

export default gptSlice.reducer;
