import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    loading: false,
    data: { code: "" },
    error: {
        is_error: false,
        message: "",
    },
};

// THUNKS
export const applyCoupon = createAsyncThunk(
    "coupon/apply",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/subscription/validate-coupons/`,
                payload
            );

            return { ...res.data, code: payload.coupon };
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

// Reducers
const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        clearError(state) {
            state.error = {
                is_error: false,
                message: "",
            };
        },
        clearCoupon(state) {
            state.data = { code: "" };
        },
    },
    extraReducers: {
        [applyCoupon.pending]: (state) => {
            state.loading = true;
            state.error = {
                is_error: false,
                message: "",
            };
        },
        [applyCoupon.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.data = payload;
        },
        [applyCoupon.rejected]: (state, { payload }) => {
            state.loading = false;
            state.data = {};
            state.error = {
                is_error: true,
                message: payload?.message,
            };
            openNotification("error", "Error", payload?.message);
        },
    },
});
export const { clearError, clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;
