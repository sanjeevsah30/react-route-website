import { QmsField } from "@convin/modules/settings/qmsManager/context/QmsStateContext";
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import {
    AvailableSubscriptionType,
    SubscriptionType,
} from "@convin/type/Billing";

export const billingApiSlice = createApi({
    reducerPath: "billingSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    endpoints: (builder) => ({
        getSubscriptions: builder.query<SubscriptionType, void>({
            query: () => "subscription/get-subscription/",
            keepUnusedDataFor: 0,
        }),
        getAvailableSubscriptions: builder.query<
            AvailableSubscriptionType[],
            void
        >({
            query: () => "subscription/available-subscriptions/",
        }),
    }),
});

export const { useGetSubscriptionsQuery, useGetAvailableSubscriptionsQuery } =
    billingApiSlice;
