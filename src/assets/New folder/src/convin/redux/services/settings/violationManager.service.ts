import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import { Violation } from "@convin/type/Violation";

export const violationManagerApiSlice = createApi({
    reducerPath: "violationManagerApiSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    keepUnusedDataFor: 0,
    endpoints: (builder) => ({
        getViolations: builder.query<Violation[], void>({
            query: () => "audit/violation/list_all/",
        }),
        createViolation: builder.mutation<
            Violation,
            Partial<Violation<number>>
        >({
            query: (payload) => {
                return {
                    url: "audit/violation/create/",
                    method: "POST",
                    body: payload,
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        violationManagerApiSlice.util.updateQueryData(
                            "getViolations",
                            undefined,
                            (draft) => {
                                Object.assign(draft, [...draft, data]);
                            }
                        )
                    );
                } catch {
                    return;
                }
            },
        }),

        updateViolation: builder.mutation<
            Violation,
            Pick<Violation, "id"> & Partial<Violation<number>>
        >({
            query: ({ id, ...patch }) => {
                return {
                    url: `audit/violation/${id}/`,
                    method: "PATCH",
                    body: patch,
                };
            },

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        violationManagerApiSlice.util.updateQueryData(
                            "getViolations",
                            undefined,
                            (draft) => {
                                Object.assign(
                                    draft,
                                    draft.map((e) =>
                                        data.id === e.id ? data : e
                                    )
                                );
                            }
                        )
                    );
                } catch {
                    return;
                }
            },
        }),
        deleteViolation: builder.mutation<Violation, number>({
            query: (id) => ({
                url: `audit/violation/${id}/`,
                method: "DELETE",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // const { data: deletedPhrase } = await queryFulfilled;
                const deleteResult = dispatch(
                    violationManagerApiSlice.util.updateQueryData(
                        "getViolations",
                        undefined,
                        (draft) => draft.filter((e) => e.id !== id)
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
    useGetViolationsQuery,
    useCreateViolationMutation,
    useUpdateViolationMutation,
    useDeleteViolationMutation,
} = violationManagerApiSlice;
