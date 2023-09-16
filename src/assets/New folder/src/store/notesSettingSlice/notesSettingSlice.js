import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    loading: false,
    note_cards: {
        data: [],
        loading: false,
    },
    activeNoteCard: {
        data: null,
        loading: false,
    },
};

export const listNotesSettingsCard = createAsyncThunk(
    "NotesSetting/listNotesSettingsCard",
    async (payload, { getState, rejectWithValue, dispatch }) => {
        try {
            const res = await axiosInstance.get(`gpt/nerconfigs/`);
            return res?.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createUpdateNotesCard = createAsyncThunk(
    "NotesSetting/createNotesCard",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const res = !payload?.id
                ? await axiosInstance.post(`gpt/nerconfigs/`, payload)
                : await axiosInstance.patch(
                      `gpt/nerconfigs/${payload.id}/`,
                      payload
                  );
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

const getByCardId = async (id, { getState, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`gpt/nerconfigs/${id}/`);
        return res.data;
    } catch (err) {
        return rejectWithValue(getError(err));
    }
};

export const getNotesCardById = createAsyncThunk(
    "NotesSetting/getNotesCardById",
    getByCardId
);

export const getNotesCradToUpdate = createAsyncThunk(
    "NotesSetting/getNotesCradToUpdate",
    getByCardId
);

export const deleteNotesSettingCard = createAsyncThunk(
    "NotesSetting/deleteNotesSettingCard",
    async (id, { getState, rejectWithValue, dispatch }) => {
        try {
            await axiosInstance.delete(`gpt/nerconfigs/${id}/`);
            return id;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const notesSettingSlice = createSlice({
    name: "NotesSetting",
    initialState,
    reducers: {
        setNotesSetting(state, action) {
            state.notesSetting = action.payload;
        },
        resetActiveNotesCard(state) {
            state.activeNoteCard.data = null;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(listNotesSettingsCard.pending, (state, action) => {
            state.note_cards.loading = true;
        });
        builder.addCase(listNotesSettingsCard.fulfilled, (state, action) => {
            state.note_cards.data = action.payload;
            state.note_cards.loading = false;
        });
        builder.addCase(
            listNotesSettingsCard.rejected,
            (state, { payload }) => {
                state.note_cards.loading = false;
                openNotification("error", "Error", payload?.message);
            }
        );

        builder.addCase(deleteNotesSettingCard.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(
            deleteNotesSettingCard.fulfilled,
            (state, { payload }) => {
                state.loading = false;
                state.note_cards.data = state.note_cards.data.filter(
                    (item) => item.id !== payload
                );
                openNotification("success", "Success", " deleted successfully");
            }
        );
        builder.addCase(
            deleteNotesSettingCard.rejected,
            (state, { payload }) => {
                state.loading = false;
                openNotification("error", "Error", payload?.message);
            }
        );

        builder.addCase(createUpdateNotesCard.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(createUpdateNotesCard.fulfilled, (state, action) => {
            if (action.payload.id === state.activeNoteCard?.data?.id) {
                state.activeNoteCard.data = action.payload;
            }
            state.note_cards.data = state.note_cards.data.find(
                (e) => e.id === action.payload.id
            )
                ? state.note_cards.data.map((e) =>
                      e.id === action.payload.id ? action.payload : e
                  )
                : [...state.note_cards.data, action.payload];
            state.loading = false;
        });
        builder.addCase(
            createUpdateNotesCard.rejected,
            (state, { payload }) => {
                openNotification("error", "Error", payload?.message);
                state.loading = false;
            }
        );
        builder.addCase(getNotesCardById.pending, (state, action) => {
            state.activeNoteCard.data = null;
            state.activeNoteCard.loading = true;
        });
        builder.addCase(getNotesCardById.fulfilled, (state, action) => {
            state.activeNoteCard.data = action.payload;
            state.activeNoteCard.loading = false;
        });
        builder.addCase(getNotesCardById.rejected, (state, { payload }) => {
            state.activeNoteCard.loading = false;
            openNotification("error", "Error", payload?.message);
        });
    },
});

export const { setNotesSetting, resetActiveNotesCard } =
    notesSettingSlice.actions;
export default notesSettingSlice.reducer;
