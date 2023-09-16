import { createApi } from "@reduxjs/toolkit/query/react";
import { CodeNames, Role } from "@convin/type/Role";
import axiosBaseQuery from "../axiosBaseQuery";

export const roleManagerApiSlice = createApi({
    reducerPath: "roleManagerApiSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    tagTypes: ["Role"],
    keepUnusedDataFor: 0,
    endpoints: (builder) => ({
        getRoles: builder.query<Role[], void>({
            query: () => "person/role/",
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: "Role" as const,
                              id,
                          })),
                          "Role",
                      ]
                    : ["Role"],
        }),
        getRoleById: builder.query<Role, string>({
            query: (id) => `person/role/${id}/`,
            keepUnusedDataFor: 0,
        }),
        getDefaultRoleCodeNames: builder.query<CodeNames[], void>({
            query: () => "person/role_perms/list_all/",
        }),
        createRole: builder.mutation<Role, Partial<Role>>({
            query: (payload) => ({
                url: "person/role/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Role"],
        }),
        updateRole: builder.mutation<Role, Pick<Role, "id"> & Partial<Role>>({
            query: ({ id, ...patch }) => ({
                url: `person/role/${id}/`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: ["Role"],
            async onQueryStarted(
                { id, ...patch },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    roleManagerApiSlice.util.updateQueryData(
                        "getRoleById",
                        String(id),
                        (draft) => {
                            Object.assign(draft, patch);
                        }
                    )
                );
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        roleManagerApiSlice.util.updateQueryData(
                            "getRoleById",
                            String(id),
                            (draft) => {
                                Object.assign(draft, data);
                            }
                        )
                    );
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteRole: builder.mutation<Role, string>({
            query: (id) => ({
                url: `person/role/${id}/`,
                method: "DELETE",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // const { data: deletedPhrase } = await queryFulfilled;
                const deleteResult = dispatch(
                    roleManagerApiSlice.util.updateQueryData(
                        "getRoles",
                        undefined,
                        (draft) => draft.filter((e) => String(e.id) !== id)
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    deleteResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useGetRoleByIdQuery,
    useGetDefaultRoleCodeNamesQuery,
} = roleManagerApiSlice;
