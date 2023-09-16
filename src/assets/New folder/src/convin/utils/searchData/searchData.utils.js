import {
    ACCOUNT_SCORING,
    CLIENT,
    LEAD_SCORE,
    REPS,
    TOPIC,
} from "@components/modules/accounts/Constants";
import { fields, models, types } from "@config/searchData.config";
import { getTimeZone } from "@convin/utils/helper";

export const setDurationSearchData = (duration) => {
    let search_attributes = {
        gte: duration[0] * 60,
    };
    if (duration[1]) {
        search_attributes.lte = duration[1] * 60;
    }
    return {
        name: fields.stats__duration,
        model: models.meeting,
        type: types.BigIntegerField,
        search_attributes,
    };
};

export const setDateSearchData = (date = []) => {
    let [startDate, endDate] = date;
    return {
        name: fields.start_time,
        model: models.meeting,
        type: types.DateTimeField,
        search_attributes: {
            // This is to fix the offset by one day. While converting to iso string for start date is given one day before
            gte: startDate
                ? new Date(
                      new Date(new Date(startDate)).toUTCString()
                  ).toISOString()
                : null,
            lte: endDate
                ? new Date(
                      new Date(new Date(endDate)).toUTCString()
                  ).toISOString()
                : null,
        },
    };
};

export const setMeetingStageSearchData = (stage) => ({
    name: fields.sales_stage__id,
    model: models.meeting,
    type: types.AutoField,
    search_attributes: {
        exact: stage || null,
    },
});

export const setMeetingSalesTaskSearchData = (stage) => ({
    name: fields.sales_task__id,
    model: models.meeting,
    type: types.AutoField,
    search_attributes: {
        exact: stage || null,
    },
});

export const setPhraseSearchData = (phrase) => ({
    name: fields.combined_ts_vector,
    model: models.transcript,
    type: types.SearchVectorField,
    search_attributes: {
        exact: phrase,
        negate: false,
    },
});

export const setSaidBySearchData = (data = {}) => {
    const { owner, client } = data;
    return {
        name: fields.speaker_type,
        model: models.speakerTranscript,
        type: types.CharField,
        search_attributes: {
            iregex:
                client && !owner ? "owner" : !client && owner ? "client" : null,
        },
    };
};

//fuction which prepares the search data for team,owner,duration and date
export const preparePageSearchData = ({ teams, owner, duration, date }) => {
    const data = [];
    data.push({
        name: fields.owner__team__id,
        model: models.meeting,
        type: types.AutoField,
        search_attributes: teams?.length
            ? { in: teams }
            : {
                  exact: null,
              },
    });

    data.push({
        name: fields.owner__id,
        model: models.meeting,
        type: types.AutoField,
        search_attributes: {
            exact: owner || null,
        },
    });

    data.push(setDurationSearchData(duration));
    data.push(setDateSearchData(date));

    return data;
};

//function which prepares payload for all the api's of customer inttelligence
export const prepareCISearchData = ({
    phrase,
    stage,
    saidBy,
    exclude,
    ...rest
}) => {
    const data = [...preparePageSearchData(rest)];

    data.push(setSaidBySearchData(saidBy));
    if (phrase) {
        data.push(setPhraseSearchData);
    }

    if (stage) {
        data.push(setMeetingStageSearchData(stage));
    }

    return {
        search_data: data,
        exclude,
        timezone: getTimeZone(),
    };
};

// List page filter
export const accountListFiltersPayload = ({
    start_date_gte,
    start_date_lte,
    team_id,
    owner_id,
    duration_gte,
    duration_lte,
}) => {
    const data = [];

    if (duration_gte) {
        data.push({
            name: fields.duration,
            model: models.opportunity,
            type: types.BigIntegerField,
            search_attributes: {
                gte: duration_gte,
            },
        });
    }
    if (duration_lte) {
        data.push({
            name: fields.duration,
            model: models.opportunity,
            type: types.BigIntegerField,
            search_attributes: {
                lte: duration_lte,
            },
        });
    }

    data.push({
        name: fields.sales_task__created,
        model: models.opportunity,
        type: types.DateTimeField,
        search_attributes: {
            gte: start_date_gte ? new Date(start_date_gte).toISOString() : null,
            lte: start_date_lte ? new Date(start_date_lte).toISOString() : null,
        },
    });

    data.push({
        name: fields.sales_task__owner__team__id,
        model: models.opportunity,
        type: types.AutoField,
        search_attributes: team_id.length
            ? { in: team_id }
            : {
                  exact: null,
              },
    });

    data.push({
        name: fields.sales_task__owner__id,
        model: models.opportunity,
        type: types.AutoField,
        search_attributes: {
            exact: owner_id || null,
        },
    });

    return data;
};

// keyword,

/* Account filters */
export const accountFiltersPayload = ({ filters, acc_id, meeting_ids }) => {
    let keyword;
    let aiDataFilter;
    let reps = [];
    let topics = [];
    let clients = [];
    let leadScoreFilter = {};
    filters.map((item) => {
        if (item.type === REPS) {
            reps.push(item);
        } else if (item.type === CLIENT) {
            clients.push(item);
        } else if (item.type === TOPIC) {
            topics.push(item);
        } else if (item.type === LEAD_SCORE) {
            leadScoreFilter = {
                ...item.item,
            };
        } else if (item.type === ACCOUNT_SCORING) {
            aiDataFilter = {
                ...item.item,
            };
        }
    });
    let data = [
        {
            name: fields.sales_task__id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes: {
                exact: +acc_id,
            },
        },
    ];

    if (leadScoreFilter?.type_id) {
        data = [
            ...data,
            {
                name: fields.result__type_id,
                model: models.meeting,
                type: types.PositiveBigIntegerField,
                search_attributes: {
                    exact: leadScoreFilter?.type_id,
                },
            },
            {
                name: fields.result__type,
                model: models.meeting,
                type: types.CharField,
                search_attributes: {
                    exact: "lead_score",
                },
            },
            {
                name: fields.result__result_repr,
                model: models.meeting,
                type: types.TextField,
                search_attributes: {
                    iregex: leadScoreFilter?.result ? "true" : "false",
                },
            },
            {
                name: fields.score__question__id,
                model: models.meeting,
                type: types.AutoField,
                search_attributes: {
                    exact: leadScoreFilter?.id,
                },
            },
        ];
    }

    if (meeting_ids?.length) {
        data.push({
            name: fields.id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes: {
                in: meeting_ids,
            },
        });
    }

    if (keyword) {
        data.push({
            model: models.transcript,
            name: fields.combined_ts_vector,
            search_attributes: { exact: keyword, negate: false },
            type: types.SearchVectorField,
        });
    }
    if (aiDataFilter?.question_id) {
        data.push({
            name: fields.score__question__id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes: {
                exact: aiDataFilter.question_id,
            },
        });
        data.push({
            name: fields.score__score_given,
            model: models.meeting,
            type: types.FloatField,
            search_attributes: {
                exact: aiDataFilter.score_given || 0,
            },
        });
        data.push({
            name: fields.score__is_ai_rated,
            model: models.meeting,
            type: types.BooleanField,
            search_attributes: {
                exact: true,
            },
        });
    }
    if (aiDataFilter?.sub_filter_id) {
        data.push({
            name: fields.result__type_id,
            model: models.meeting,
            type: types.PositiveBigIntegerField,
            search_attributes: {
                exact: aiDataFilter.sub_filter_id,
            },
        });
        data.push({
            name: fields.result__type,
            model: models.meeting,
            type: types.CharField,
            search_attributes: {
                exact: "sub_filter",
            },
        });
        data.push({
            name: fields.result__result_repr,
            model: models.meeting,
            type: types.TextField,
            search_attributes: {
                exact: aiDataFilter.score,
            },
        });
    }
    if (topics.length) {
        data.push({
            name: fields.topics__id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes: {
                in: topics.map(({ id }) => id),
            },
        });
    }
    if (clients.length) {
        data.push({
            name: fields.client__id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes: {
                in: clients.map(({ id }) => id),
            },
        });
    }
    if (reps.length) {
        data.push({
            name: fields.reps_id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes: {
                in: reps.map(({ id }) => id),
            },
        });
    }

    return data;
};
