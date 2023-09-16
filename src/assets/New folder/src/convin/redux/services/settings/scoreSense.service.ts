import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import { ScoreSense, scoreType } from "@convin/type/ScoreSense";

export const scoreSenseApiSlice = createApi({
    reducerPath: "scoreSenseApiSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    keepUnusedDataFor: 0,
    endpoints: (builder) => ({
        getLeadScoreConfig: builder.query<ScoreSense<"Lead">, void>({
            query: () => "gpt/score_sense/?query=Lead",
            transformResponse: (
                res: [ScoreSense<"Lead">]
            ): ScoreSense<"Lead"> => {
                return res[0];
            },
        }),
        updateScoreSenseConfig: builder.mutation<
            ScoreSense<scoreType>,
            Pick<ScoreSense<scoreType>, "id"> & Partial<ScoreSense<scoreType>>
        >({
            query: (payload) => ({
                url: `gpt/score_sense/${payload.id}/`,
                method: "PATCH",
                body: payload,
            }),
            onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data.score_type === "Lead") {
                        dispatch(
                            scoreSenseApiSlice.util.updateQueryData(
                                "getLeadScoreConfig",
                                undefined,
                                (draft) => Object.assign(draft, data)
                            )
                        );
                    }
                } catch {}
            },
        }),
    }),
});

export const { useGetLeadScoreConfigQuery, useUpdateScoreSenseConfigMutation } =
    scoreSenseApiSlice;
