import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import { AuthUserType, UpdateUserPayload, UserType } from "@convin/type/User";
import { getUserName } from "@convin/utils/helper/common.helper";
import { CreateUserPayload, InviteUser } from "@convin/type/UserManager";
import { AvailableSubscription } from "@convin/type/Subscription";
import { AxiosResponse } from "axios";

export const userManagerApiSlice = createApi({
    reducerPath: "userManagerApiSlice",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getAllUsers: builder.query<UserType[], void>({
            query: () => "/person/person/list_all/",
            transformResponse: (response: UserType[]) => {
                return Array.isArray(response)
                    ? response?.map((e) => ({ ...e, label: getUserName(e) }))
                    : response;
            },
            providesTags: ["User"],
        }),

        getInvitedUsers: builder.query<InviteUser, void>({
            query: () => "/person/person/invite/",
        }),

        getAvailableSubscriptions: builder.query<AvailableSubscription[], void>(
            {
                query: () => "/subscription/available-subscriptions/",
            }
        ),
        downloadUsers: builder.query<Blob, void>({
            query: () => "/person/download",
        }),
        changePasswordByUserId: builder.mutation<
            string[],
            { user_id: number; password: string }
        >({
            query: (payload) => ({
                url: "/person/reset_password/",
                method: "POST",
                body: payload,
            }),
        }),
        updateUserById: builder.mutation<
            UserType,
            Partial<UpdateUserPayload> & { id: number }
        >({
            query: ({ id, ...payload }) => ({
                url: `/person/person/retrieve_update/${id}`,
                method: "PATCH",
                body: payload,
            }),
            async onQueryStarted(
                { id, ...payload },
                { queryFulfilled, dispatch }
            ) {
                // // console.log("onQueryStarted", id, payload);
                // const updatedData = dispatch(
                //     userManagerApiSlice.util.updateQueryData(
                //         "getAllUsers",
                //         undefined,
                //         (draft) =>
                //             Object.assign(
                //                 draft,
                //                 draft.map((e) =>
                //                     e.id === id ? { ...e, ...payload } : e
                //                 )
                //             )
                //     )
                // );
                // console.log("updatedData", updatedData);
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        userManagerApiSlice.util.updateQueryData(
                            "getAllUsers",
                            undefined,
                            (draft) =>
                                Object.assign(
                                    draft,
                                    draft.map((e) =>
                                        e.id === id ? { ...e, ...data } : e
                                    )
                                )
                        )
                    );
                    // console.log("result", result);
                } catch {
                    return;
                }
            },
        }),
        inviteUser: builder.mutation<string, string>({
            query: (invitation_id) => ({
                url: `/person/person/invite/${invitation_id}`,
                method: "POST",
            }),
        }),
        createBulkUser: builder.mutation<
            Partial<AuthUserType>,
            Partial<CreateUserPayload>[]
        >({
            query: (payload) => ({
                url: "/person/bulk/create/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: (res, error) => (!!error ? [] : ["User"]),
        }),
        inviteBulkUser: builder.mutation<
            Partial<AuthUserType>,
            Partial<CreateUserPayload>[]
        >({
            query: (payload) => ({
                url: "/person/bulk/invite/",
                method: "POST",
                body: payload,
            }),
        }),
        downloadUsersExcelSheet: builder.mutation<Blob, void>({
            query: () => ({
                url: "/person/download/",
                method: "POST",
                body: {},
                responseType: "blob",
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data, meta } = await queryFulfilled;
                    const { headers } = meta as Omit<AxiosResponse, "data">;
                    const href = URL.createObjectURL(data);
                    const link = document.createElement("a");
                    link.href = href;
                    link.setAttribute(
                        "download",
                        headers?.["content-disposition"].split("filename=")[1]
                    );
                    link.click();
                    URL.revokeObjectURL(href);
                } catch (err) {}
            },
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useUpdateUserByIdMutation,
    useGetInvitedUsersQuery,
    useGetAvailableSubscriptionsQuery,
    useInviteUserMutation,
    useChangePasswordByUserIdMutation,
    useCreateBulkUserMutation,
    useInviteBulkUserMutation,
    useDownloadUsersExcelSheetMutation,
} = userManagerApiSlice;
