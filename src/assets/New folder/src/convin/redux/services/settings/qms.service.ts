import { QmsField } from "@convin/modules/settings/qmsManager/context/QmsStateContext";
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

export const qmsApiSlice = createApi({
    reducerPath: "QmsApiSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    endpoints: (builder) => ({
        getManualQmsFieldsList: builder.query<QmsField[], void>({
            query: () => "audit/qms/list_all/",
        }),
        createQmsField: builder.mutation<QmsField, QmsField>({
            query: ({ ...payload }) => ({
                url: "audit/qms/",
                method: "POST",
                body: payload,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        qmsApiSlice.util.updateQueryData(
                            "getManualQmsFieldsList",
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
        updateQmsFiled: builder.mutation<QmsField, QmsField>({
            query: ({ ...payload }) => ({
                url: `audit/qms/${payload.id}/`,
                method: "PATCH",
                body: payload,
            }),
            async onQueryStarted(
                { id, is_disabled, is_mandatory },
                { queryFulfilled, dispatch }
            ) {
                const patchResult = dispatch(
                    qmsApiSlice.util.updateQueryData(
                        "getManualQmsFieldsList",
                        undefined,
                        (draft) => {
                            Object.assign(
                                draft,
                                draft.map((e) =>
                                    e.id === id
                                        ? { ...e, is_disabled, is_mandatory }
                                        : e
                                )
                            );
                        }
                    )
                );
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        qmsApiSlice.util.updateQueryData(
                            "getManualQmsFieldsList",
                            undefined,
                            (draft) => {
                                Object.assign(
                                    draft,
                                    draft.map((e) =>
                                        e.id === data.id ? data : e
                                    )
                                );
                            }
                        )
                    );
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetManualQmsFieldsListQuery,
    useUpdateQmsFiledMutation,
    useCreateQmsFieldMutation,
} = qmsApiSlice;
