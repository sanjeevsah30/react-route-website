import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import { CallTag } from "@convin/type/CallManager";

export const callTagsManagerApiSlice = createApi({
    reducerPath: "callTagsManagerApiSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    keepUnusedDataFor: 0,
    endpoints: (builder) => ({
        getCallTags: builder.query<CallTag[], void>({
            query: () => "calendar/tags/list_all/",
            transformResponse: (response: CallTag[]) => {
                return Array.isArray(response)
                    ? response?.map((e) => ({ ...e, label: e.tag_name }))
                    : response;
            },
        }),
        getCallTagById: builder.query<CallTag & { meeting: number }, number>({
            query: (id) => `calendar/tags/${id}/`,
        }),
        createCallTag: builder.mutation<CallTag, Partial<CallTag>>({
            query: (payload) => ({
                url: "calendar/tags/create/",
                method: "POST",
                body: payload,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        callTagsManagerApiSlice.util.updateQueryData(
                            "getCallTags",
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
        deleteCallTag: builder.mutation<void, number>({
            query: (id) => ({
                url: `calendar/tags/${id}/`,
                method: "DELETE",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const deleteResult = dispatch(
                    callTagsManagerApiSlice.util.updateQueryData(
                        "getCallTags",
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
    useGetCallTagsQuery,
    useLazyGetCallTagByIdQuery,
    useCreateCallTagMutation,
    useDeleteCallTagMutation,
} = callTagsManagerApiSlice;
