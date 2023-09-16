import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import { UserType } from "@convin/type/User";
import { getUserName } from "@convin/utils/helper/common.helper";

export const usersApiSlice = createApi({
    reducerPath: "usersApiSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    endpoints: (builder) => ({
        getAllUser: builder.query<UserType[], void>({
            query: () => "person/team/list_reps/",
            transformResponse: (response: UserType[]) => {
                return Array.isArray(response)
                    ? response?.map((e) => ({ ...e, label: getUserName(e) }))
                    : response;
            },
        }),
        getAllAuditors: builder.query<UserType[], void>({
            query: () => "/person/list_auditor/",
            transformResponse: (response: UserType[]) => {
                return Array.isArray(response)
                    ? response?.map((e) => ({ ...e, label: getUserName(e) }))
                    : response;
            },
        }),
    }),
});

export const { useGetAllUserQuery, useGetAllAuditorsQuery } = usersApiSlice;
