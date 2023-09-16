import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    loading: false,
    battle_cards: {
        data: [],
        loading: false,
    },
    categories: {
        data: [],
        loading: false,
    },
    activeBattleCard: {
        data: null,
        loading: false,
    },
};

export const listBattleCards = createAsyncThunk(
    "liveAssistSlice/listBattleCards",
    async (_, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`live_assist/battle_cards/`);
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const listLiveAssistBattleCardCtegories = createAsyncThunk(
    "liveAssistSlice/listLiveAssistBattleCardCtegories",
    async (_, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`live_assist/categories/`);
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const createUpdateBattleCard = createAsyncThunk(
    "liveAssistSlice/createUpdateBattleCard",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const res = !payload?.id
                ? await axiosInstance.post(`live_assist/battle_card/`, payload)
                : await axiosInstance.patch(
                      `live_assist/battle_card/${payload.id}/`,
                      payload
                  );
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteBattleCard = createAsyncThunk(
    "liveAssistSlice/deleteBattleCard",
    async (id, { getState, rejectWithValue }) => {
        try {
            await axiosInstance.delete(`live_assist/battle_card/${id}/`);

            return id;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

const getByCardId = async (id, { getState, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`live_assist/battle_card/${id}/`);
        return res.data;
    } catch (err) {
        return rejectWithValue(getError(err));
    }
};

export const getBattleCardById = createAsyncThunk(
    "liveAssistSlice/getBattleCardById",
    getByCardId
);

export const getBattleCardDataToUpdate = createAsyncThunk(
    "liveAssistSlice/getBattleCardDataToUpdate",
    getByCardId
);

const liveAssistSlice = createSlice({
    name: "liveAssistSlice",
    initialState,
    reducers: {
        resetActiveBattleCard(state) {
            state.activeBattleCard.data = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(listBattleCards.pending, (state, action) => {
            state.battle_cards.loading = true;
        });
        builder.addCase(listBattleCards.fulfilled, (state, action) => {
            state.battle_cards.data = [...action.payload];
            state.battle_cards.loading = false;
        });
        builder.addCase(listBattleCards.rejected, (state, { payload }) => {
            state.battle_cards.loading = false;
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(
            listLiveAssistBattleCardCtegories.pending,
            (state, action) => {
                state.categories.loading = true;
            }
        );
        builder.addCase(
            listLiveAssistBattleCardCtegories.fulfilled,
            (state, action) => {
                state.categories.data = [...action.payload];
                state.categories.loading = false;
            }
        );
        builder.addCase(
            listLiveAssistBattleCardCtegories.rejected,
            (state, { payload }) => {
                state.categories.loading = false;
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(createUpdateBattleCard.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(createUpdateBattleCard.fulfilled, (state, action) => {
            if (action.payload.id === state.activeBattleCard?.data?.id) {
                state.activeBattleCard.data = action.payload;
            }
            state.battle_cards.data = state.battle_cards.data.find(
                (e) => e.id === action.payload.id
            )
                ? state.battle_cards.data.map((e) =>
                      e.id === action.payload.id ? action.payload : e
                  )
                : [...state.battle_cards.data, action.payload];
            state.loading = false;
        });
        builder.addCase(
            createUpdateBattleCard.rejected,
            (state, { payload }) => {
                state.loading = false;
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(getBattleCardById.pending, (state, action) => {
            state.activeBattleCard.data = null;
            state.activeBattleCard.loading = true;
        });
        builder.addCase(getBattleCardById.fulfilled, (state, action) => {
            state.activeBattleCard.data = action.payload;
            state.activeBattleCard.loading = false;
        });
        builder.addCase(getBattleCardById.rejected, (state, { payload }) => {
            state.activeBattleCard.loading = false;
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(deleteBattleCard.pending, (state, action) => {});
        builder.addCase(deleteBattleCard.fulfilled, (state, action) => {
            state.battle_cards.data = state.battle_cards.data.filter(
                (e) => e.id !== action.payload
            );
        });
        builder.addCase(deleteBattleCard.rejected, (state, { payload }) => {
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(
            getBattleCardDataToUpdate.rejected,
            (state, { payload }) => {
                openNotification("error", "Error", payload?.message);
            }
        );
    },
});

export const { resetActiveBattleCard } = liveAssistSlice.actions;

export default liveAssistSlice.reducer;
