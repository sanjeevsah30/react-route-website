import { createApi } from "@reduxjs/toolkit/query/react";

import {
    Category,
    CategoryPayload,
    CategorySequencePayload,
    Question,
    QuestionPayload,
    QuestionSequencePayload,
    Template,
    TemplatePayload,
} from "@convin/type/Audit";
import axiosBaseQuery from "../axiosBaseQuery";
import { Violation } from "@convin/type/Violation";
import { isDefined } from "@convin/utils/helper/common.helper";

export const auditManagerApiSlice = createApi({
    reducerPath: "auditManagerApiSlice",
    tagTypes: ["Templates", "Categories", "Parameters"],
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    endpoints: (builder) => ({
        getTemplates: builder.query<Template[], void>({
            query: () => "/audit/template/list_all/",
            providesTags: ["Templates"],
        }),
        createTemplate: builder.mutation<Template, TemplatePayload>({
            query: (payload) => ({
                url: "/audit/template/create/",
                method: "POST",
                body: {
                    ...payload,
                    tags: [
                        {
                            tag_name: "Critical",
                            tag_type: "scoring tag",
                            rules: ["score_p_no_c_no"],
                        },
                        {
                            tag_name: "Fatal",
                            tag_type: "scoring tag",
                            rules: ["score_p_no_c_no"],
                        },
                    ],
                },
            }),
        }),
        updateTemplate: builder.mutation<
            Template,
            Pick<Template, "id"> & Partial<TemplatePayload>
        >({
            query: ({ id, ...payload }) => ({
                url: `/audit/template/update/${id}/`,
                method: "PATCH",
                body: payload,
            }),
            async onQueryStarted({ id }, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        auditManagerApiSlice.util.updateQueryData(
                            "getTemplateById",
                            id.toString(),
                            (draft) => {
                                Object.assign(draft, data);
                            }
                        )
                    );
                } catch {}
            },
        }),
        getTemplateById: builder.query<Template, string>({
            query: (id) => `/audit/template/retrieve/${id}/`,
            keepUnusedDataFor: 0,
        }),
        getCategoriesByTemplateId: builder.query<Category[], number>({
            query: (id) => `/audit/category/list_all/${id}/`,
            keepUnusedDataFor: 0,
            providesTags: ["Categories"],
        }),
        getCategory: builder.query<Category, number>({
            query: (id) => `/audit/category/retrieve/${id}/`,
            keepUnusedDataFor: 0,
        }),
        createCategory: builder.mutation<Category, Partial<CategoryPayload>>({
            query: (payload) => ({
                url: "/audit/category/create/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: (result, error) =>
                !isDefined(error) ? ["Categories"] : [],
        }),
        updateCategory: builder.mutation<
            Category,
            Pick<Category, "id"> & Partial<CategoryPayload>
        >({
            query: ({ id, ...payload }) => ({
                url: `/audit/category/update/${id}/`,
                method: "PATCH",
                body: payload,
            }),
            async onQueryStarted(
                { template, id, ...rest },
                { queryFulfilled, dispatch }
            ) {
                const patchResult = dispatch(
                    auditManagerApiSlice.util.updateQueryData(
                        "getCategoriesByTemplateId",
                        template as number,
                        (draft) => {
                            Object.assign(
                                draft,
                                draft.map((e) =>
                                    e.id === id ? { ...e, ...rest } : e
                                )
                            );
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateCategorySequence: builder.mutation<
            { status: boolean },
            CategorySequencePayload
        >({
            query: (payload) => ({
                url: "/audit/category/seq_no/bulk_update/",
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Categories"],
        }),
        getParameterByCategoryId: builder.query<Question[], number>({
            query: (id) => `/audit/question/list_all/${id}/`,
            keepUnusedDataFor: 0,
            providesTags: ["Parameters"],
        }),
        getParameterById: builder.query<Question[], number>({
            query: (id) => `/audit/question/list_all/${id}/`,
            keepUnusedDataFor: 0,
            providesTags: ["Parameters"],
        }),
        createParameter: builder.mutation<Question, Partial<QuestionPayload>>({
            query: (payload) => ({
                url: "/audit/question/create/",
                method: "POST",
                body: payload,
            }),
            async onQueryStarted({ category }, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        auditManagerApiSlice.util.updateQueryData(
                            "getParameterByCategoryId",
                            category as number,
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
        updateParameterById: builder.mutation<
            Question,
            Pick<QuestionPayload, "id"> & Partial<QuestionPayload>
        >({
            query: ({ id, ...payload }) => ({
                url: `/audit/question/update/${id}/`,
                method: "PATCH",
                body: payload,
            }),
            async onQueryStarted(
                { category, id, is_live_assist, is_disabled },
                { queryFulfilled, dispatch }
            ) {
                const patchResult = dispatch(
                    auditManagerApiSlice.util.updateQueryData(
                        "getParameterByCategoryId",
                        category as number,
                        (draft) => {
                            Object.assign(
                                draft,
                                draft.map((e) =>
                                    e.id === id
                                        ? { ...e, is_live_assist, is_disabled }
                                        : e
                                )
                            );
                        }
                    )
                );
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        auditManagerApiSlice.util.updateQueryData(
                            "getParameterByCategoryId",
                            category as number,
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
        updateParameterSequence: builder.mutation<
            { status: boolean },
            QuestionSequencePayload
        >({
            query: (payload) => ({
                url: "/audit/question/seq_no/bulk_update/",
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Parameters"],
        }),
        getViolations: builder.query<Violation[], void>({
            query: () => "audit/violation/list_all/",
            transformResponse: (response: Violation[]) => {
                return Array.isArray(response)
                    ? response?.map((e) => ({ ...e, label: e.name }))
                    : response;
            },
        }),
        cloneTemplate: builder.mutation<Template, number>({
            query: (id) => ({
                url: "/audit/template/clone/",
                method: "POST",
                body: {
                    template_id: id,
                },
            }),
        }),
    }),
});

export const {
    useGetViolationsQuery,
    useGetTemplatesQuery,
    useCreateTemplateMutation,
    useGetTemplateByIdQuery,
    useUpdateTemplateMutation,
    useGetCategoriesByTemplateIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useGetParameterByCategoryIdQuery,
    useCreateParameterMutation,
    useUpdateParameterByIdMutation,
    useGetCategoryQuery,
    useUpdateCategorySequenceMutation,
    useUpdateParameterSequenceMutation,
    useCloneTemplateMutation,
} = auditManagerApiSlice;
