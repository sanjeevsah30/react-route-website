import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import {
    MigrationPayloadType,
    Team,
    TeamsPayload,
} from "@convin/type/Team";
import { DeleteTeam } from "@convin/type/Team";
import { UpdateUserPayload, UserType } from "@convin/type/User";
import { isDefined } from "@convin/utils/helper/common.helper";

export const teamManagerSeviceSlice = createApi({
    reducerPath: "teamManagerSeviceSlice",
    baseQuery: axiosBaseQuery({
        transformResponse: (response) => response,
    }),
    tagTypes: ["Teams"],
    endpoints: (builder) => ({
        getTeams: builder.query<Team[], void>({
            query: () => "/person/team/list_all/",
            providesTags: ["Teams"],
        }),
        getTeamById: builder.query<Team, number>({
            query: (id) => `/person/team/${id}/`,
            // providesTags: ["Teams"],
        }),

        createTeams: builder.mutation<Team, Partial<Omit<TeamsPayload, "id">>>({
            query: (payload) => ({
                url: "/person/team/create/",
                method: "POST",
                body: payload,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        teamManagerSeviceSlice.util.updateQueryData(
                            "getTeams",
                            undefined,
                            (draft) => {
                                return [data, ...draft];
                            }
                        )
                    );
                } catch {}
            },
        }),

        updateTeam: builder.mutation<Team, Partial<TeamsPayload>>({
            query: ({ id, ...payload }) => ({
                url: `/person/team/edit/${id}`,
                method: "PATCH",
                body: { ...payload, id: id },
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    const isSubTeam = isDefined(data.group);

                    dispatch(
                        teamManagerSeviceSlice.util.updateQueryData(
                            "getTeams",
                            undefined,
                            (draft) => {
                                let teamToUpdate = isSubTeam
                                    ? draft.find((e) => e.id === data.group)
                                    : draft.find((e) => e.id === data.id);
                                if (isDefined(teamToUpdate)) {
                                    if (isSubTeam) {
                                        teamToUpdate = {
                                            ...teamToUpdate,
                                            subteams: teamToUpdate.subteams.map(
                                                (e) =>
                                                    e.id === data.id ? data : e
                                            ),
                                        };
                                    } else {
                                        teamToUpdate = {
                                            ...data,
                                        };
                                    }
                                    return draft.map((e) =>
                                        e.id === teamToUpdate?.id
                                            ? teamToUpdate
                                            : e
                                    );
                                }
                                return draft;
                            }
                        )
                    );
                } catch {}
            },
        }),

        deleteTeam: builder.mutation<
            DeleteTeam,
            { id: number; data: MigrationPayloadType[] }
        >({
            query: ({ id, data }) => ({
                url: `/person/team/edit/${id}`,
                method: "DELETE",
                body: data,
            }),
            invalidatesTags: (res, error) => (!!error ? [] : ["Teams"]),
        }),

        updateUserTeamById: builder.mutation<
            UserType,
            Partial<UpdateUserPayload> & { id: number }
        >({
            query: ({ id, ...payload }) => ({
                url: `/person/person/retrieve_update/${id}`,
                method: "PATCH",
                body: payload,
            }),
        }),
    }),
});

export const {
    useGetTeamsQuery,
    useLazyGetTeamsQuery,
    useCreateTeamsMutation,
    useUpdateTeamMutation,
    useDeleteTeamMutation,
    useUpdateUserTeamByIdMutation,
} = teamManagerSeviceSlice;
