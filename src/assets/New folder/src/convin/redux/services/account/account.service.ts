import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import { CallTag } from "@convin/type/CallManager";
import { Stage } from "@convin/type/Account";

export const accountsApiSlice = createApi({
    reducerPath: "accountsApiSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    keepUnusedDataFor: 0,
    endpoints: (builder) => ({
        getStages: builder.query<Stage[], void>({
            query: () => "/account/stage/",
            transformResponse: (response: Stage[]) => {
                return Array.isArray(response)
                    ? response?.map((e) => ({ ...e, label: e.stage }))
                    : response;
            },
        }),
    }),
});

export const { useGetStagesQuery } = accountsApiSlice;
