import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import { CallType } from "@convin/type/CallManager";

export const callTypeManagerApiSlice = createApi({
    reducerPath: "callTypeManagerApiSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    tagTypes: ["CallType"],
    endpoints: (builder) => ({
        getCallTypes: builder.query<CallType[], void>({
            query: () => "calendar/call_type/list_all/",
            transformResponse: (response: CallType[]) => {
                return Array.isArray(response)
                    ? response?.map((e) => ({ ...e, label: e.type }))
                    : response;
            },
            providesTags: ["CallType"],
        }),
        getCallTypeById: builder.query<CallType & { meeting: number }, number>({
            query: (id) => `calendar/call_type/${id}/`,
        }),
        createCallType: builder.mutation<CallType, Partial<CallType>>({
            query: (payload) => ({
                url: "calendar/call_type/create/",
                method: "POST",
                body: payload,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        callTypeManagerApiSlice.util.updateQueryData(
                            "getCallTypes",
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
        deleteCallType: builder.mutation<CallType[], number>({
            query: (id) => ({
                url: `calendar/call_type/edit/${id}/`,
                method: "DELETE",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // const { data: deletedPhrase } = await queryFulfilled;
                const deleteResult = dispatch(
                    callTypeManagerApiSlice.util.updateQueryData(
                        "getCallTypes",
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
    useGetCallTypesQuery,
    useLazyGetCallTypeByIdQuery,
    useCreateCallTypeMutation,
    useDeleteCallTypeMutation,
} = callTypeManagerApiSlice;
