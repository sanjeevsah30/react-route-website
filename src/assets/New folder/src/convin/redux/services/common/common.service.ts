import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import { VersionDataType } from "@convin/type/Common";

export const commonApiSlice = createApi({
    reducerPath: "commonApiSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    keepUnusedDataFor: 0,
    endpoints: (builder) => ({
        getVersionData: builder.query<VersionDataType, void>({
            query: () => ({
                url: "app/api/version/",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetVersionDataQuery } = commonApiSlice;
