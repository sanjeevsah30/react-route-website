import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import {
    ActivityLog,
    ActivityPayload,
    ScoreSenseChange,
} from "@convin/type/Activity";
import { PaginationType } from "@convin/type/Common";

export const activityApiSlice = createApi({
    reducerPath: "activityApiSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    endpoints: (builder) => ({
        getScoreSenceActivityLogs: builder.query<
            PaginationType<ActivityLog<ScoreSenseChange>>,
            ActivityPayload & { next?: string }
        >({
            query: (payload) => ({
                url: payload?.next || "analytics/activity_log/",
                method: "POST",
                body: payload,
            }),
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useGetScoreSenceActivityLogsQuery,
    useLazyGetScoreSenceActivityLogsQuery,
} = activityApiSlice;
