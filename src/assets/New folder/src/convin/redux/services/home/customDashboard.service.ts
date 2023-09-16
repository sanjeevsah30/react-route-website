import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import {
    CustomDashboardForm,
    PinReportPayloadType,
    ReportObjectType,
    SingelObjectType,
} from "@convin/type/CustomDashboard";
import { isDefined } from "@convin/utils/helper/common.helper";

export const customDashboardApiSlice = createApi({
    reducerPath: "customDashboardApiSlice",
    tagTypes: ["Dashboard", "Dashboards"],
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    endpoints: (builder) => ({
        getDashboardList: builder.query<CustomDashboardForm[], void>({
            query: () => "/analytics/custom_dashboard/list/ ",
            providesTags: ["Dashboards"],
        }),
        createDashboard: builder.mutation<
            CustomDashboardForm,
            CustomDashboardForm
        >({
            query: (payload) => ({
                url: "/analytics/custom_dashboard/create/",
                method: "POST",
                body: {
                    ...payload,
                },
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        customDashboardApiSlice.util.updateQueryData(
                            "getDashboardList",
                            undefined,
                            (draft) => {
                                return [...draft, data];
                            }
                        )
                    );
                } catch {}
            },
        }),
        getDashboardData: builder.query<CustomDashboardForm, number>({
            query: (id) => `analytics/custom_dashboard/${id}/`,
            providesTags: (result, error, id) => [{ type: "Dashboard", id }],
            keepUnusedDataFor: 0,
        }),
        updateDashboard: builder.mutation<
            CustomDashboardForm,
            Partial<CustomDashboardForm>
        >({
            query: (payload) => ({
                url: `analytics/custom_dashboard/${payload.id}/`,
                method: "PATCH",
                body: {
                    ...payload,
                },
            }),
            async onQueryStarted({ id }, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        customDashboardApiSlice.util.updateQueryData(
                            "getDashboardList",
                            undefined,
                            (draft) => {
                                return [...draft].map((e) =>
                                    e.id === id ? data : e
                                );
                            }
                        )
                    );
                } catch {}
            },
            invalidatesTags: (result, error, arg) =>
                !isDefined(error) ? [{ type: "Dashboard", id: arg.id }] : [],
        }),

        deleteDashboard: builder.mutation<void, number>({
            query: (id) => ({
                url: `analytics/custom_dashboard/${id}/`,
                method: "DELETE",
            }),
        }),
        getSingleObjects: builder.query<SingelObjectType[], void>({
            query: () => "/analytics/custom_dashboard/single_object/list/ ",
        }),
        singleObjectsData: builder.query<SingelObjectType[], void>({
            query: () => "/analytics/custom_dashboard/single_object/list/ ",
        }),
        pinReport: builder.mutation<
            SingelObjectType | ReportObjectType,
            Partial<PinReportPayloadType>
        >({
            query: (payload) => ({
                url: "/analytics/custom_report/create/",
                method: "POST",
                body: { ...payload },
            }),
            invalidatesTags: (result, error, arg) => {
                const tags: Array<{ type: "Dashboard"; id: number }> =
                    arg.custom_dashboards?.map((e) => ({
                        type: "Dashboard",
                        id: e,
                    })) || [];
                return !isDefined(error) ? tags : [];
            },
        }),
        createCustomDahboardReport: builder.mutation<
            SingelObjectType | ReportObjectType,
            Partial<
                (SingelObjectType | ReportObjectType) & {
                    custom_dashboard: number;
                }
            >
        >({
            query: (payload) => ({
                url: "/analytics/custom_report/single/create/",
                method: "POST",
                body: { ...payload },
            }),
            invalidatesTags: (result, error, arg) =>
                !isDefined(error)
                    ? [{ type: "Dashboard", id: arg.custom_dashboard }]
                    : [],
        }),
        updateCustomDahboardReport: builder.mutation<
            SingelObjectType | ReportObjectType,
            Partial<SingelObjectType | ReportObjectType>
        >({
            query: (payload) => ({
                url: `/analytics/custom_report/${payload.id}/`,
                method: "PATCH",
                body: { ...payload },
            }),
            invalidatesTags: (result, error, arg) =>
                !isDefined(error)
                    ? [{ type: "Dashboard", id: arg.custom_dashboard }]
                    : [],
        }),
        renameDashboardReport: builder.mutation<
            SingelObjectType | ReportObjectType,
            Partial<SingelObjectType | ReportObjectType>
        >({
            query: (payload) => ({
                url: `/analytics/custom_report/${payload.id}/`,
                method: "PATCH",
                body: { ...payload },
            }),
            async onQueryStarted(
                { custom_dashboard },
                { queryFulfilled, dispatch }
            ) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        customDashboardApiSlice.util.updateQueryData(
                            "getDashboardData",
                            custom_dashboard as number,
                            (draft) => {
                                Object.assign(draft, {
                                    ...draft,
                                    single_objects: draft.single_objects.map(
                                        (e) =>
                                            e.id === data.id
                                                ? { ...e, name: data.name }
                                                : e
                                    ),
                                    reports: draft.reports.map((e) =>
                                        e.id === data.id
                                            ? { ...e, name: data.name }
                                            : e
                                    ),
                                });
                            }
                        )
                    );
                } catch {}
            },
        }),
        unPinReport: builder.mutation<
            void,
            { id: number; dashboard_id?: number }
        >({
            query: ({ id }) => ({
                url: `analytics/custom_report/${id}/`,
                method: "DELETE",
            }),
            async onQueryStarted(
                { id, dashboard_id },
                { dispatch, queryFulfilled }
            ) {
                try {
                    await queryFulfilled;
                    if (isDefined(dashboard_id))
                        dispatch(
                            customDashboardApiSlice.util.updateQueryData(
                                "getDashboardData",
                                dashboard_id,
                                (draft) => {
                                    Object.assign(draft, {
                                        ...draft,
                                        single_objects:
                                            draft.single_objects.filter(
                                                (e) => e.id !== id
                                            ),
                                        reports: draft.reports.filter(
                                            (e) => e.id !== id
                                        ),
                                    });
                                }
                            )
                        );
                } catch {}
            },
        }),
        shareCustomDahboardReport: builder.mutation<
            void,
            | {
                  emails: number[];
                  custom_dashboard: string;
                  comment: string;
                  dashboard_screenshot: string;
              }
            | FormData
        >({
            query: (payload) => ({
                url: "analytics/custom_dashboard/share/",
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const {
    useGetDashboardListQuery,
    useCreateDashboardMutation,
    useGetDashboardDataQuery,
    useUpdateDashboardMutation,
    useDeleteDashboardMutation,
    useGetSingleObjectsQuery,
    usePinReportMutation,
    useUnPinReportMutation,
    useUpdateCustomDahboardReportMutation,
    useCreateCustomDahboardReportMutation,
    useRenameDashboardReportMutation,
    useShareCustomDahboardReportMutation,
} = customDashboardApiSlice;
