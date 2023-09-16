import { axiosInstance } from "@apis/axiosInstance";

import { getError } from "@apis/common/index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    ErrorSnackBar,
    openNotification,
    successSnackBar,
} from "@store/common/actions";
import { displayRazorpay } from "@tools/razorpay";

const initialState = {
    cartData: {
        data: {
            total_price: 0,
            days: 0,
            licenses: 0,
            currency: "usd",
        },
        loading: false,
    },

    create_subscription_flag: false,
    subscription: {
        loading: true,
        data: null,
    },
    billingPlans: {
        loading: false,
        data: [],
    },
    razor_pay_details: {
        loading: false,
        data: null,
    },
    ads: {
        loading: true,
        data: {
            carousel: [],
            banner: {},
        },
    },
    invoices: {
        loading: true,
        data: [],
    },
    close_popup: false,

    billing_info: {
        loading: false,
        data: {},
        next_clicked: false,
    },
};

// THUNKS
export const getSubscriptions = createAsyncThunk(
    "billing/getSubscriptions",
    async (_, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(
                `/subscription/get-subscription/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getBillingPlans = createAsyncThunk(
    "billing/getBillingPlans",
    async (_, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(
                `/subscription/get-billingcycle/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const updateBillingPlan = createAsyncThunk(
    "billing/updateBillingPlan",
    async ({ payload, id }, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.put(
                `/subscription/update/${id}/`,
                payload
            );
            if (res.data?.key) {
                displayRazorpay(
                    res.data,
                    getState().auth,
                    (payload) => {
                        dispatch(confirmPayment(payload));
                        successSnackBar("Payment Successfull");
                    },
                    (response) => {
                        ErrorSnackBar(response?.error?.description);
                    }
                );
                return res.data;
            } else {
                successSnackBar("Subscription Updated successfully");
                dispatch(setClosePopUpFlag(true));
            }
        } catch (err) {
            ErrorSnackBar(getError(err)?.message);
            return rejectWithValue(getError(err));
        }
    }
);

export const confirmPayment = createAsyncThunk(
    "billing/confirmPayment",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                `/subscription/payment-confirmation/`,
                payload
            );
            dispatch(setClosePopUpFlag(true));
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getBillingAds = createAsyncThunk(
    "billing/getBillingAds",
    async (_, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(
                `/subscription/get-billingads/`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const getInvoices = createAsyncThunk(
    "billing/getInvoices",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(`/subscription/get-invoices/`);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getTotalPrice = createAsyncThunk(
    "billing/getTotalPrice",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                `/subscription/calculate-price/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getBillingInfo = createAsyncThunk(
    "billing/getBillingInfo",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(
                `/subscription/billing_information/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const updateBillingInfo = createAsyncThunk(
    "billing/updateBillingInfo",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.patch(
                `/subscription/billing_information/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createBillingInfo = createAsyncThunk(
    "billing/createBillingInfo",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                `/subscription/billing_information/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

// Reducers
const billingSlice = createSlice({
    name: "billing",
    initialState,
    reducers: {
        subscriptionLoading(state, action) {
            state.subscription.loading = action.payload;
        },
        plansLoading(state, action) {
            state.billingPlans.loading = action.payload;
        },
        setCartValue(state, action) {
            state.cartValue = action.payload;
        },
        setSubscription(state, { payload }) {
            state.subscription = payload;
        },
        setCreateSubscriptionFlag(state, { payload }) {
            state.create_subscription_flag = payload;
        },
        setClosePopUpFlag(state, { payload }) {
            state.close_popup = payload;
        },
        setNextClicked(state, { payload }) {
            state.billing_info.next_clicked = payload;
        },
    },
    extraReducers: {
        [getSubscriptions.pending]: (state) => {
            state.subscription.loading = true;
        },
        [getSubscriptions.fulfilled]: (state, { payload }) => {
            state.subscription.loading = false;
            state.subscription.data = { ...payload };
        },
        [getSubscriptions.rejected]: (state, { payload }) => {
            state.subscription.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getTotalPrice.pending]: (state) => {
            state.cartData.loading = true;
        },
        [getTotalPrice.fulfilled]: (state, { payload }) => {
            state.cartData.loading = false;
            state.cartData.data = { ...payload };
        },
        [getTotalPrice.rejected]: (state, { payload }) => {
            state.cartData.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [confirmPayment.pending]: (state) => {
            state.subscription.loading = true;
        },
        [confirmPayment.fulfilled]: (state, { payload }) => {
            state.subscription.loading = false;
            state.subscription.data = payload;
        },
        [confirmPayment.rejected]: (state, { payload }) => {
            state.subscription.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getBillingPlans.pending]: (state) => {
            state.billingPlans.loading = true;
        },
        [getBillingPlans.fulfilled]: (state, { payload }) => {
            state.billingPlans.loading = false;
            state.billingPlans.data = payload;
        },
        [getBillingPlans.rejected]: (state, { payload }) => {
            state.billingPlans.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [updateBillingPlan.pending]: (state) => {
            state.razor_pay_details.loading = true;
        },
        [updateBillingPlan.fulfilled]: (state, { payload }) => {
            state.razor_pay_details.loading = false;
            state.razor_pay_details.data = payload;
        },
        [updateBillingPlan.rejected]: (state, { payload }) => {
            state.razor_pay_details.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getBillingAds.pending]: (state) => {
            state.ads.loading = true;
        },
        [getBillingAds.fulfilled]: (state, { payload }) => {
            state.ads.loading = false;
            state.ads.data = payload;
        },
        [getBillingAds.rejected]: (state, { payload }) => {
            state.ads.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getInvoices.pending]: (state) => {
            state.invoices.loading = true;
        },
        [getInvoices.fulfilled]: (state, { payload }) => {
            state.invoices.loading = false;
            state.invoices.data = payload;
        },
        [getInvoices.rejected]: (state, { payload }) => {
            state.invoices.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getBillingInfo.pending]: (state) => {
            state.billing_info.loading = true;
        },
        [getBillingInfo.fulfilled]: (state, { payload }) => {
            state.billing_info.loading = false;
            state.billing_info.data = payload;
        },
        [getBillingInfo.rejected]: (state, { payload }) => {
            state.billing_info.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [updateBillingInfo.pending]: (state) => {
            state.billing_info.loading = true;
        },
        [updateBillingInfo.fulfilled]: (state, { payload }) => {
            state.billing_info.loading = false;
            state.billing_info.data = payload;
        },
        [updateBillingInfo.rejected]: (state, { payload }) => {
            state.billing_info.loading = false;
            state.billing_info.next_clicked = false;
            openNotification("error", "Error", payload?.message);
        },
        [createBillingInfo.pending]: (state) => {
            state.billing_info.loading = true;
        },
        [createBillingInfo.fulfilled]: (state, { payload }) => {
            state.billing_info.loading = false;
            state.billing_info.data = payload;
        },
        [createBillingInfo.rejected]: (state, { payload }) => {
            state.billing_info.loading = false;
            state.billing_info.next_clicked = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

export const {
    subscriptionLoading,
    plansLoading,
    setCartValue,
    setCreateSubscriptionFlag,
    setClosePopUpFlag,
    setNextClicked,
} = billingSlice.actions;
export default billingSlice.reducer;
