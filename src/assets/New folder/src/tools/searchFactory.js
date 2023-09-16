import auditConfig from "@constants/Audit/index";
import TopbarConfig from "@constants/Topbar/index";
import { getDMYDate, getLocaleDate, isArrayEqual } from "./helpers";
import { openNotification } from "../store/common/actions";

export const models = {
    meeting: "meeting.models.Meeting",
    transcript: "search.models.MeetingTranscriptTsVector",
    speakerTranscript: "search.models.MeetingSpeakerTranscriptTsVector",
    sentenceCategory: "search.models.SentenceCategoryTranscriptTsVector",
    opportunity: "account.models.AccountStats",
};

export const types = {
    ArrayField: "ArrayField",
    AutoField: "AutoField",
    BigIntegerField: "BigIntegerField",
    BooleanField: "BooleanField",
    CharField: "CharField",
    DateField: "DateField",
    FloatField: "FloatField",
    IntegerField: "IntegerField",
    PositiveIntegerField: "PositiveIntegerField",
    PositiveSmallIntegerField: "PositiveSmallIntegerField",
    SearchVectorField: "SearchVectorField",
    TextField: "TextField",
    DateTimeField: "DateTimeField",
    PositiveBigIntegerField: "PositiveBigIntegerField",
};

export const fields = {
    call_types__id: "call_types__id",
    owner__id: "owner__id",
    owner__team__id: "owner__team__id",
    start_time: "start_time",
    end_time: "end_time",
    start_join_time: "start_join_time",
    end_join_time: "end_join_time",
    client__id: "client__id",
    sales_task__id: "sales_task__id",
    stats__duration: "stats__duration",
    tags__id: "tags__id",
    stats__owner_question_count: "stats__owner_question_count",
    stats__client_question_count: "stats__client_question_count",
    topics__id: "topics__id",
    stats__owner_talk_ratio: "stats__owner_talk_ratio",
    stats__client_talk_ratio: "stats__client_talk_ratio",
    stats__longest_monologue_owner: "stats__longest_monologue_owner",
    stats__longest_monologue_client: "stats__longest_monologue_client",
    stats__interactivity: "stats__interactivity",
    stats__patience: "stats__patience",
    sentence_category_transcript_ts_vector:
        "sentence_category_transcript_ts_vector",
    topic_class: "topic_class",
    speaker_type: "speaker_type",
    combined_ts_vector: "combined_ts_vector",
    speaker_transcript_ts_vector: "speaker_transcript_ts_vector",
    category: "category",
    stats__criterias_count: "stats__criterias_count",
    stats__criterias__id: "stats__criterias__id",
    conference_tool: "conference_tool",
    processing_status: "processing_status",
    score__question__id: "score__question__id",
    scores__question__id: "scores__question__id",
    score__score_given: "score__score_given",
    scores__score_given: "scores__score_given",
    meeting_score__percent: "meeting_score__percent",
    meeting_score__auditor__id: "meeting_score__auditor__id",
    score__is_ai_rated: "score__is_ai_rated",
    scores__is_ai_rated: "scores__is_ai_rated",
    meeting_score__scores__question__category__template__id:
        "meeting_score__scores__question__category__template__id",
    reps_id: "reps__id",
    sales_stage__id: "sales_stage__stage__id",
    result__type_id: "result__type_id",
    result__type: "result__type",
    result__result_repr: "result__result_repr",
    sales_task__created: "sales_task__created",
    close_date: "close_date",
    sales_task__owner__team__id: "sales_task__owner__team__id",
    sales_task__owner__id: "sales_task__owner__id",
    DateField: "DateField",
    stage__id: "stage__id",
    size: "size",
    last_connected_date: "last_connected_date",
    name: "name",
    meeting__id: "meeting__id",
    account_size: "account_size",
    duration: "duration",
    sales_task__name: "sales_task__name",
    id: "id",
    ai_score: "ai_score",
    manual_score: "manual_score",
    template__id: "template__id",
    result__question__id: "result__question__id",
    lead_score_objs__template__category__question__id:
        "lead_score_objs__template__category__question__id",
    lead_score_objs__result_repr: "lead_score_objs__result_repr",
    lead_score: "lead_score",
    meeting_score__auditor: "meeting_score__auditor",
    meeting_type: "meeting_type",
    account_tags: "sales_task__tags__id",
    stats__talk_time: "stats__talk_time",
    stats__owner_overlap_rate: "stats__owner_overlap_rate",
    tag__id: "tag__id",
    sales_stage__sales_task__account_stat__lead_classification:
        "sales_stage__sales_task__account_stat__lead_classification",
    owner__org_date_joined: "owner__org_date_joined",
    meeting_score__status: "meeting_score__status",
};

const getRepSelectionStatus = (data) => {
    if (data.saidByClient && !data.saidByOwner) return "client|participant";
    else if (!data.saidByClient && data.saidByOwner) return "owner";
    else return null;
};

export const fixDateField = (val, is_start = true) => {
    if (!val) return null;
    const date = new Date(val);
    let dd = date.getDate();
    dd = dd < 10 ? `0${dd}` : dd;
    let mm = date.getMonth() + 1;
    mm = mm < 10 ? `0${mm}` : mm;
    const yy = date.getFullYear();
    return is_start
        ? `${yy}-${mm}-${dd}T00:00:00.000Z`
        : `${yy}-${mm}-${dd}T23:59:59.999Z`;
};

export const fixBeforeAfterDateField = (val, is_before = true) => {
    if (!val) return null;

    const date = new Date(new Date(val));
    is_before ? date.setDate(date.getDate()) : date.setDate(date.getDate() + 1);
    let dd = date.getDate();
    dd = dd < 10 ? `0${dd}` : dd;
    let mm = date.getMonth() + 1;
    mm = mm < 10 ? `0${mm}` : mm;
    const yy = date.getFullYear();
    return new Date(`${yy}-${mm}-${dd}`).toISOString();
};

export const getTopbarFilters = (data) => {
    let preparedData = [];
    if (data?.callType?.length)
        preparedData.push({
            name: fields.call_types__id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes: data?.callType?.length
                ? {
                      in: data.callType,
                  }
                : {
                      exact: null,
                  },
        });

    if (data?.repId?.filter((e) => +e !== 0).length)
        preparedData.push({
            name: fields.owner__id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes:
                data?.repId?.filter((e) => +e !== 0).length === 0
                    ? {
                          exact: null,
                      }
                    : {
                          in: data.repId,
                      },
        });

    if (data.teamId.filter((e) => +e !== 0).length)
        preparedData.push({
            name: fields.owner__team__id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes:
                data?.teamId?.filter((e) => +e !== 0).length === 0
                    ? { exact: null }
                    : {
                          in: data.teamId,
                      },
        });

    if (data.startJoinDate || data.endJoinDate)
        preparedData.push({
            name: fields.owner__org_date_joined,
            model: models.meeting,
            type: types.DateTimeField,
            search_attributes: {
                gte: data.startJoinDate
                    ? new Date(
                          new Date(new Date(data.startJoinDate)).toUTCString()
                      ).toISOString()
                    : null,
                lte: data.endJoinDate
                    ? new Date(
                          new Date(new Date(data.endJoinDate)).toUTCString()
                      ).toISOString()
                    : null,
            },
        });

    if (data?.hasChat) preparedData.push(...getMeetingField(data.meetingType));
    preparedData.push(...searchDurationFilters(data.callDuration));
    preparedData = [...preparedData, ...getDateField(data)];
    return preparedData;
};

export const getAccountAuditTopbarFilters = (data) => {
    let preparedData = [];

    if (data?.callDuration?.[0])
        preparedData.push({
            name: fields.duration,
            model: models.opportunity,
            type: types.BigIntegerField,
            search_attributes: {
                gte: data?.callDuration?.[0]
                    ? data?.callDuration?.[0] * 60
                    : null,
            },
        });

    if (!data.repId.length === 0)
        preparedData.push({
            name: fields.sales_task__owner__id,
            model: models.opportunity,
            type: types.AutoField,
            search_attributes: {
                ...(data.repId.length === 0 && { exact: null }),
                ...(data.repId.length !== 0 && { in: data.repId }),
            },
        });

    if (data?.teamId?.length)
        preparedData.push({
            name: fields.sales_task__owner__team__id,
            model: models.opportunity,
            type: types.AutoField,
            search_attributes: data?.teamId?.length
                ? { in: data.teamId }
                : {
                      exact: null,
                  },
        });
    // let preparedData = [
    //     {
    //         name: fields.duration,
    //         model: models.opportunity,
    //         type: types.BigIntegerField,
    //         search_attributes: {
    //             gte: data?.callDuration?.[0]
    //                 ? data?.callDuration?.[0] * 60
    //                 : null,
    //         },
    //     },
    //     {
    //         name: fields.sales_task__owner__id,
    //         model: models.opportunity,
    //         type: types.AutoField,
    //         search_attributes: {
    //             ...(data.repId.length === 0 && { exact: null }),
    //             ...(data.repId.length !== 0 && { in: data.repId }),
    //         },
    //     },
    //     {
    //         name: fields.sales_task__owner__team__id,
    //         model: models.opportunity,
    //         type: types.AutoField,
    //         search_attributes: data?.teamId?.length
    //             ? { in: data.teamId }
    //             : {
    //                 exact: null,
    //             },
    //     },
    // ];

    let dateFilter = [];
    if (data.startDate) {
        const startDate = new Date(data.startDate).toISOString();

        dateFilter = [
            {
                name: fields.sales_task__created,
                model: models.opportunity,
                type: types.DateTimeField,
                search_attributes: {
                    gte: startDate,
                    lte: data.endDate
                        ? new Date(data.endDate).toISOString()
                        : null,
                },
            },
        ];
    } else {
        dateFilter = [
            {
                name: fields.sales_task__created,
                model: models.opportunity,
                type: types.DateTimeField,
                search_attributes: {
                    gte: null,
                    lte: null,
                },
            },
        ];
    }

    preparedData = [...preparedData, ...dateFilter];

    return preparedData;
};

export const getOwnerTeamId = (data) => {
    return {
        name: fields.owner__team__id,
        model: models.meeting,
        type: types.AutoField,
        search_attributes: {
            exact: +data.teamId === 0 ? null : data.teamId,
        },
    };
};

export const getStatsDuration = () => {
    return {
        name: fields.stats__duration,
        model: models.meeting,
        type: types.BigIntegerField,
        search_attributes: {
            gte: 0,
        },
    };
};

export const getDateField = (data) => {
    let filter = [];
    if (data.startDate || data.endDate) {
        // This is to fix the offset by one day. While converting to iso string for start date is given one day before
        const startDate = data.startDate
            ? new Date(
                  new Date(new Date(data.startDate)).toUTCString()
              ).toISOString()
            : null;

        filter = [
            {
                name: fields.start_time,
                model: models.meeting,
                type: types.DateTimeField,
                search_attributes: {
                    gte: startDate,
                    lte: data.endDate
                        ? new Date(
                              new Date(new Date(data.endDate)).toUTCString()
                          ).toISOString()
                        : null,
                },
            },
        ];
    }
    // else {
    //     filter = [
    //         {
    //             name: fields.start_time,
    //             model: models.meeting,
    //             type: types.DateTimeField,
    //             search_attributes: {
    //                 gte: null,
    //                 lte: null,
    //             },
    //         },
    //     ];
    // }
    return filter;
};

export const searchClientNameFilters = (clientId) => {
    return {
        name: fields.client__id,
        model: models.meeting,
        type: types.AutoField,
        search_attributes: {
            exact: clientId || null,
        },
    };
};
export const searchConferenceToolFilters = (toolId) => {
    if (toolId)
        return [
            {
                name: fields.conference_tool,
                model: models.meeting,
                type: types.CharField,
                search_attributes: {
                    exact: toolId || null,
                },
            },
        ];
    else return [];
};

export const searchSalesTaskNameFilters = (salesTaskId) => {
    if (salesTaskId)
        return [
            {
                name: fields.sales_task__id,
                model: models.meeting,
                type: types.AutoField,
                search_attributes: {
                    exact: salesTaskId || null,
                },
            },
        ];
    else return [];
};

export const searchDurationFilters = (data) => {
    let search_attributes = {
        gte: data[0] * 60,
    };
    if (data[1]) {
        search_attributes.lte = data[1] * 60;
    }
    if (search_attributes.gte || search_attributes.lte)
        return [
            {
                name: fields.stats__duration,
                model: models.meeting,
                type: types.BigIntegerField,
                search_attributes,
            },
        ];
    else return [];
};

export const searchTagsFilters = (tags) => {
    if (tags)
        return [
            {
                name: fields.tags__id,
                model: models.meeting,
                type: types.AutoField,
                search_attributes: {
                    in: tags,
                },
            },
        ];
    else return [];
};

export const searchQuestionFilters = (data) => {
    if (data.byOwner.from !== 0 || data.byOwner.to !== 100)
        return [
            {
                name: fields.stats__owner_question_count,
                model: models.meeting,
                type: types.PositiveIntegerField,
                search_attributes: {
                    gte: data.byOwner.from,
                    lte: data.byOwner.to,
                },
            },
            {
                name: fields.stats__client_question_count,
                model: models.meeting,
                type: types.PositiveIntegerField,
                search_attributes: {
                    gte: data.byClient.from,
                    lte: data.byClient.to,
                },
            },
        ];
    else return [];
};

export const searchTopicsFilters = (data) => {
    if (data.topic)
        return [
            {
                name: fields.topics__id,
                model: models.meeting,
                type: types.AutoField,
                search_attributes: {
                    exact: data.topic || null,
                    negate: !data.inCall,
                },
            },
        ];
    else return [];
};

export const searchInteractivityFilters = (data) => {
    let tempArr = [];
    if (data.ownerRatio.from !== 0 || data.ownerRatio.to !== 1)
        tempArr.push({
            name: fields.stats__owner_talk_ratio,
            model: models.meeting,
            type: types.FloatField,
            search_attributes: {
                gte: data.ownerRatio.from,
                lte: data.ownerRatio.to,
            },
        });

    if (data.clientRatio.from !== 0 || data.clientRatio.to !== 1)
        tempArr.push({
            name: fields.stats__client_talk_ratio,
            model: models.meeting,
            type: types.FloatField,
            search_attributes: {
                gte: data.clientRatio.from,
                lte: data.clientRatio.to,
            },
        });

    if (data.ownerMonologue.from !== 0 || data.ownerMonologue.to !== 6000)
        tempArr.push({
            name: fields.stats__longest_monologue_owner,
            model: models.meeting,
            type: types.BigIntegerField,
            search_attributes: {
                gte: data.ownerMonologue.from,
                lte: data.ownerMonologue.to,
            },
        });

    if (data.clientMonologue.from !== 0 || data.clientMonologue.to !== 6000)
        tempArr.push({
            name: fields.stats__longest_monologue_client,
            model: models.meeting,
            type: types.BigIntegerField,
            search_attributes: {
                gte: data.clientMonologue.from,
                lte: data.clientMonologue.to,
            },
        });

    if (data.interactivity.from !== -10 || data.interactivity.to !== 10)
        tempArr.push({
            name: fields.stats__interactivity,
            model: models.meeting,
            type: types.FloatField,
            search_attributes: {
                gte: data.interactivity.from,
                lte: data.interactivity.to,
            },
        });
    if (data.patience.from !== 0 || data.patience.to !== 100)
        tempArr.push({
            name: fields.stats__patience,
            model: models.meeting,
            type: types.FloatField,
            search_attributes: {
                gte: data.patience.from,
                lte: data.patience.to,
            },
        });

    if (
        data?.interruption_count &&
        (data?.interruption_count?.from !== null ||
            data?.interruption_count?.to !== null)
    ) {
        tempArr.push({
            name: fields.stats__owner_overlap_rate,
            model: models.meeting,
            type: types.FloatField,
            search_attributes: {
                ...(data.interruption_count.from !== null && {
                    gte: data.interruption_count.from,
                }),
                ...(data.interruption_count.to !== null && {
                    lte: data.interruption_count.to,
                }),
            },
        });
    }

    return tempArr;
};

export const searchKeywordsFilters = (data) => {
    let keywordFilters = [];
    if (data.keywords && data.keywords.length) {
        const repSelectionStatus = getRepSelectionStatus(data);
        if (data.topic) {
            keywordFilters.push({
                name: fields.sentence_category_transcript_ts_vector,
                model: models.sentenceCategory,
                type: types.SearchVectorField,
                search_attributes: {
                    exact: data.keywords.join(" "),
                    negate: !data.isInCall,
                },
            });

            keywordFilters.push({
                name: fields.topic_class,
                model: models.sentenceCategory,
                type: types.CharField,
                search_attributes: {
                    exact: data.topic,
                },
            });

            if (repSelectionStatus)
                keywordFilters.push({
                    name: fields.speaker_type,
                    model: models.sentenceCategory,
                    type: types.CharField,
                    search_attributes: {
                        iregex: repSelectionStatus,
                    },
                });
        } else {
            if (repSelectionStatus)
                keywordFilters.push({
                    name: fields.speaker_type,
                    model: models.speakerTranscript,
                    type: types.CharField,
                    search_attributes: {
                        iregex: repSelectionStatus,
                    },
                });
            if (!repSelectionStatus) {
                keywordFilters.push({
                    name: fields.combined_ts_vector,
                    model: models.transcript,
                    type: types.SearchVectorField,
                    search_attributes: {
                        exact: data.keywords.join(" "),
                        negate: !data.isInCall,
                    },
                });
            } else {
                keywordFilters.push({
                    name: fields.speaker_transcript_ts_vector,
                    model: models.speakerTranscript,
                    type: types.SearchVectorField,
                    search_attributes: {
                        exact: data.keywords.join(" "),
                        negate: !data.isInCall,
                    },
                });
            }
        }

        if (data.isPartOfQuestion !== undefined) {
            keywordFilters.push({
                name: fields.category,
                model: models.sentenceCategory,
                type: types.CharField,
                search_attributes: {
                    exact: "question",
                    negate: !data.isPartOfQuestion,
                },
            });
        }
    }
    return keywordFilters;
};

const objectKeyMap = (data) => {
    let keyMapData = {};
    for (const datum of data) {
        keyMapData[datum.name] = datum;
    }
    return keyMapData;
};

export const decodeTracker = (data) => {
    let decodedData = {};
    const keyMap = objectKeyMap(data);

    decodedData.templateId = keyMap[
        fields.meeting_score__scores__question__category__template__id
    ]
        ? keyMap[fields.meeting_score__scores__question__category__template__id]
              .search_attributes.exact
        : null;

    decodedData.stageId = keyMap[fields.sales_stage__id]
        ? keyMap[fields.sales_stage__id].search_attributes.exact
        : null;

    decodedData.client = keyMap[fields.sales_task__id]
        ? keyMap[fields.sales_task__id].search_attributes.exact
        : undefined;

    decodedData.processing_status = keyMap[fields.processing_status]
        ? keyMap[fields.processing_status].search_attributes.exact
        : null;

    decodedData.conferenceMedium = keyMap[fields.conference_tool]
        ? keyMap[fields.conference_tool].search_attributes.exact
        : undefined;

    if (keyMap[fields.stats__duration]) {
        decodedData.duration = [
            keyMap[fields.stats__duration]
                ? keyMap[fields.stats__duration].search_attributes.gte / 60
                : 0,
            keyMap[fields.stats__duration] &&
            keyMap[fields.stats__duration].search_attributes.lte
                ? keyMap[fields.stats__duration].search_attributes.lte / 60
                : null,
        ];
    }

    if (keyMap[fields.tags__id]) {
        decodedData.filterTags = keyMap[fields.tags__id].search_attributes.in;
    }

    if (
        keyMap[fields.meeting_score__auditor__id]?.search_attributes?.isnull ===
            false ||
        keyMap[fields.meeting_score__auditor__id]?.search_attributes?.in
    ) {
        decodedData.audit_filter = {
            audit_type: auditConfig.MANUAL_AUDIT_TYPE,
            auditors:
                keyMap[fields.meeting_score__auditor__id].search_attributes
                    .isnull === false
                    ? [0]
                    : keyMap[fields.meeting_score__auditor__id]
                          .search_attributes.in || [],
        };
    } else {
        if (keyMap?.[fields?.score__is_ai_rated]?.search_attributes?.exact)
            decodedData.audit_filter = {
                audit_type: auditConfig.AI_AUDIT_TYPE,
                auditors: [],
            };
        else if (
            keyMap?.[fields?.score__is_ai_rated]?.search_attributes &&
            keyMap?.[fields?.score__is_ai_rated]?.search_attributes?.exact ===
                false
        )
            decodedData.audit_filter = {
                audit_type: auditConfig.MANUAL_AUDIT_TYPE,
                auditors: [],
            };
        else
            decodedData.audit_filter = {
                audit_type: null,
                auditors: [],
            };
    }

    decodedData.questions = {
        byClient: [
            keyMap[fields.stats__client_question_count]
                ? keyMap[fields.stats__client_question_count].search_attributes
                      .gte
                : 0,
            keyMap[fields.stats__client_question_count]
                ? keyMap[fields.stats__client_question_count].search_attributes
                      .lte
                : 100,
        ],
        byOwner: [
            keyMap[fields.stats__owner_question_count]
                ? keyMap[fields.stats__owner_question_count].search_attributes
                      .gte
                : 0,
            keyMap[fields.stats__owner_question_count]
                ? keyMap[fields.stats__owner_question_count].search_attributes
                      .lte
                : 100,
        ],
    };

    if (keyMap[fields?.topics__id]) {
        decodedData.topics = {
            topic: keyMap[fields.topics__id].search_attributes.exact,
            inCall: !keyMap[fields.topics__id].search_attributes.negate,
        };
    }

    decodedData.interactivity = {
        ownerTalkRatio: [
            keyMap[fields.stats__owner_talk_ratio]
                ? keyMap[fields.stats__owner_talk_ratio].search_attributes.gte *
                  100
                : 0,
            keyMap[fields.stats__owner_talk_ratio]
                ? keyMap[fields.stats__owner_talk_ratio].search_attributes.lte *
                  100
                : 100,
        ],
        clientTalkRatio: [
            keyMap[fields.stats__client_talk_ratio]
                ? keyMap[fields.stats__client_talk_ratio].search_attributes
                      .gte * 100
                : 0,
            keyMap[fields.stats__client_talk_ratio]
                ? keyMap[fields.stats__client_talk_ratio].search_attributes
                      .lte * 100
                : 100,
        ],
        ownerLongestMonologue: [
            keyMap[fields.stats__longest_monologue_owner]
                ? keyMap[fields.stats__longest_monologue_owner]
                      .search_attributes.gte / 60
                : 0,
            keyMap[fields.stats__longest_monologue_owner]
                ? keyMap[fields.stats__longest_monologue_owner]
                      .search_attributes.lte / 60
                : 100,
        ],
        clientLongestMonologue: [
            keyMap[fields.stats__longest_monologue_client]
                ? keyMap[fields.stats__longest_monologue_client]
                      .search_attributes.gte / 60
                : 0,
            keyMap[fields.stats__longest_monologue_client]
                ? keyMap[fields.stats__longest_monologue_client]
                      .search_attributes.lte / 60
                : 100,
        ],
        interactivity: [
            keyMap[fields.stats__interactivity]
                ? keyMap[fields.stats__interactivity].search_attributes.gte
                : 0,
            keyMap[fields.stats__interactivity]
                ? keyMap[fields.stats__interactivity].search_attributes.lte
                : 10,
        ],
        patience: [
            keyMap[fields.stats__patience]
                ? keyMap[fields.stats__patience].search_attributes.gte
                : 0,
            keyMap[fields.stats__patience]
                ? keyMap[fields.stats__patience].search_attributes.lte
                : 100,
        ],
        talktime: [
            keyMap[fields.stats__talk_time]
                ? keyMap[fields.stats__talk_time].search_attributes.gte
                : null,
            keyMap[fields.stats__talk_time]
                ? keyMap[fields.stats__talk_time].search_attributes.lte
                : null,
        ],
        interruption_count: [
            keyMap[fields.stats__owner_overlap_rate]
                ? keyMap[fields.stats__owner_overlap_rate].search_attributes.gte
                : null,
            keyMap[fields.stats__owner_overlap_rate]
                ? keyMap[fields.stats__owner_overlap_rate].search_attributes.lte
                : null,
        ],
    };

    const speakerData = keyMap[fields?.speaker_type];
    decodedData.searchKeywords = {
        saidByClient: speakerData
            ? speakerData.search_attributes.iregex === "client"
            : false,
        saidByOwner: speakerData
            ? speakerData.search_attributes.iregex === "owner"
            : false,
        isPartOfQuestion: keyMap[fields.category]
            ? !keyMap[fields.category].search_attributes.negate
            : undefined,
    };

    if (keyMap[fields?.sentence_category_transcript_ts_vector]) {
        let topicData = keyMap[fields.sentence_category_transcript_ts_vector];
        decodedData.searchKeywords.keywords =
            topicData.search_attributes.exact.split(" ");
        decodedData.searchKeywords.isInCall =
            !topicData.search_attributes.negate;
        decodedData.searchKeywords.topic =
            keyMap[fields.topic_class].search_attributes.exact;
    }
    if (keyMap[fields?.combined_ts_vector]) {
        decodedData.searchKeywords.keywords =
            keyMap[fields.combined_ts_vector].search_attributes.exact.split(
                " "
            );
        decodedData.searchKeywords.isInCall =
            !keyMap[fields.combined_ts_vector].search_attributes.negate;
    }
    if (keyMap[fields?.speaker_transcript_ts_vector]) {
        decodedData.searchKeywords.keywords =
            keyMap[
                fields.speaker_transcript_ts_vector
            ].search_attributes.exact.split(" ");
        decodedData.searchKeywords.isInCall =
            !keyMap[fields.speaker_transcript_ts_vector].search_attributes
                .negate;
    }

    // get topbar filters
    if (keyMap[fields.start_time]) {
        decodedData.startTime =
            keyMap[fields?.start_time]?.search_attributes.gte || null;
        decodedData.endTime =
            keyMap[fields?.start_time]?.search_attributes.lte || null;
    } else {
        decodedData.startTime = null;
        decodedData.endTime = null;
    }

    if (keyMap[fields.owner__org_date_joined]) {
        decodedData.startJoinTime =
            keyMap[fields?.owner__org_date_joined]?.search_attributes.gte ||
            null;
        decodedData.endJoinTime =
            keyMap[fields?.owner__org_date_joined]?.search_attributes.lte ||
            null;
    } else {
        decodedData.startJoinTime = null;
        decodedData.endJoinTime = null;
    }
    if (keyMap[fields.call_types__id]) {
        decodedData.callType = keyMap[fields.call_types__id].search_attributes
            .exact
            ? keyMap[fields.call_types__id].search_attributes.exact
            : keyMap[fields.call_types__id].search_attributes.in;
    }

    if (keyMap[fields.owner__id]) {
        decodedData.repId =
            keyMap[fields.owner__id].search_attributes.exact ||
            keyMap[fields.owner__id].search_attributes.in;
    } else {
        decodedData.repId = null;
    }

    if (keyMap[fields.owner__team__id]?.search_attributes.in) {
        decodedData.teamId =
            keyMap[fields.owner__team__id].search_attributes.in;
    } else {
        decodedData.teamId = null;
    }

    const last = data[data.length - 1];
    if (last?.name === "custom_data") {
        decodedData.custom_data = last;
    }

    if (keyMap[fields.meeting_score__percent]) {
        decodedData.call_score = [
            keyMap[fields.meeting_score__percent]?.search_attributes?.gte *
                100 || 0,
            keyMap[fields.meeting_score__percent]?.search_attributes?.lte *
                100 || 100,
        ];
    }

    if (keyMap[fields.meeting_type]) {
        decodedData.meeting_type =
            keyMap[fields.meeting_type]?.search_attributes?.exact;
    }

    return decodedData;
};

export const getMeetingField = (meeting_type, versionData) => {
    if (meeting_type)
        return [
            {
                name: fields.meeting_type,
                model: models.meeting,
                type: types.CharField,
                search_attributes: {
                    exact: meeting_type,
                },
            },
        ];
    return [];
};

export const getDateFilter = (startDate, endDate) => {
    let foundMatch = null;
    let isCustom = false;
    const trackerDate = [
        getDMYDate(new Date(startDate)),
        getDMYDate(new Date(endDate)),
    ];
    const today = {
        date: [
            getDMYDate(TopbarConfig.TODAYDATERANGE[0]),
            getDMYDate(TopbarConfig.TODAYDATERANGE[1]),
        ],
        name: TopbarConfig.dateKeys.today,
        dateRange: TopbarConfig.TODAYDATERANGE,
    };
    const thisWeek = {
        date: [
            getDMYDate(TopbarConfig.WEEKDATERANGE[0]),
            getDMYDate(TopbarConfig.WEEKDATERANGE[1]),
        ],
        name: TopbarConfig.dateKeys.week,
        dateRange: TopbarConfig.WEEKDATERANGE,
    };
    const last30Days = {
        date: [
            getDMYDate(TopbarConfig.LAST30DAYSRANGE[0]),
            getDMYDate(TopbarConfig.LAST30DAYSRANGE[1]),
        ],
        name: TopbarConfig.dateKeys.last30days,
        dateRange: TopbarConfig.LAST30DAYSRANGE,
    };
    const thisMonth = {
        date: [
            getDMYDate(TopbarConfig.MONTHDATERANGE[0]),
            getDMYDate(TopbarConfig.MONTHDATERANGE[1]),
        ],
        name: TopbarConfig.dateKeys.month,
        dateRange: TopbarConfig.MONTHDATERANGE,
    };
    const dateOptions = [today, thisWeek, last30Days, thisMonth];
    for (const dateOption of dateOptions) {
        if (isArrayEqual(dateOption.date, trackerDate)) {
            foundMatch = dateOption;
        }
    }

    if (!foundMatch) {
        foundMatch = {
            date: trackerDate,
            name: `${getLocaleDate(startDate)} - ${getLocaleDate(endDate)}`,
            dateRange: [new Date(startDate), new Date(endDate)],
        };
        isCustom = true;
    }

    return {
        match: foundMatch,
        isCustom: isCustom,
    };
};

export const saidByPayload = (data) => {
    let value = null;
    if (data?.saidByOwner && !data?.saidByClient) value = "owner";
    else if (data?.saidByClient && !data?.saidByOwner) value = "client";
    return {
        name: fields.speaker_type,
        model: models.speakerTranscript,
        type: types.CharField,
        search_attributes: {
            iregex: value,
        },
    };
};

export const searchProcessingStatusFilters = (processing_status) => {
    if (processing_status)
        return [
            {
                name: fields.processing_status,
                model: models.meeting,
                type: types.CharField,
                search_attributes: {
                    exact: processing_status || null,
                },
            },
        ];
    else return [];
};

export const getCallLevelStage = (search_data) => {
    if (search_data.stage)
        return [
            {
                name: fields.sales_stage__id,
                model: models.meeting,
                type: types.AutoField,
                search_attributes: {
                    exact: +search_data.stage || null,
                },
            },
        ];
    else return [];
};

export const getCallTagId = (search_data) => {
    if (!!search_data.call_tags.length)
        return [
            {
                name: fields.tags__id,
                model: models.meeting,
                type: types.AutoField,
                search_attributes: {
                    in: search_data.call_tags,
                },
            },
        ];
    else return [];
};

export const getTalktimeFilter = (data) => {
    let search_attributes = {};
    if (data[0]) {
        search_attributes.gte = data[0];
    }
    if (data[1]) {
        search_attributes.lte = data[1];
    }
    if (search_attributes.gte || search_attributes.lte)
        return [
            {
                name: fields.stats__talk_time,
                model: models.meeting,
                type: types.BigIntegerField,
                search_attributes,
            },
        ];
    else return [];
};

export const getAccLevelStage = (search_data) => {
    if (search_data.stage)
        return [
            {
                name: fields.stage__id,
                model: models.opportunity,
                type: types.AutoField,
                search_attributes: {
                    exact: search_data.stage || null,
                },
            },
        ];
    else return [];
};

export const setAiScoreFilter = (data, score_treshold) => {
    const headers = [];
    const { min_aiscore, max_aiscore } = data;

    const getScorePercentFields = {
        name: fields.meeting_score__percent,
        model: models.meeting,
        type: types.FloatField,
    };

    const custom_aiscore = {
        ...getScorePercentFields,
        search_attributes: {},
    };
    if (typeof min_aiscore === "number") {
        custom_aiscore.search_attributes = {
            gte: +data.min_aiscore / 100,
        };
    }

    if (typeof max_aiscore === "number") {
        custom_aiscore.search_attributes = {
            ...custom_aiscore.search_attributes,
            lte: +max_aiscore / 100,
        };
    }

    if (typeof min_aiscore === "number" || typeof max_aiscore === "number") {
        headers.push(custom_aiscore);
        headers.push({
            name: fields.meeting_score__auditor__id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes: {
                isnull: true,
            },
        });
    }

    if (headers.length && data.template?.id) {
        headers.push({
            name: fields.meeting_score__scores__question__category__template__id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes: {
                exact: data.template.id,
            },
        });
    }
    return headers;
};

export const searchAuditFilters = (
    filters,
    template,
    audit_filter,
    stats_threshold
) => {
    const headers = [];
    if (
        audit_filter?.manualAuditDateRange?.[0] &&
        audit_filter?.manualAuditDateRange?.[1]
    ) {
        headers.push({
            name: "meeting_score__created",
            model: "meeting.models.Meeting",
            type: "DateTimeField",
            search_attributes: {
                gte: audit_filter?.manualAuditDateRange?.[0],
                lte: audit_filter?.manualAuditDateRange?.[1],
            },
        });
    }

    let ids = Object.keys(filters);

    if (!ids.length) {
        if (headers?.length && template?.id) {
            headers.push({
                name: fields.meeting_score__scores__question__category__template__id,
                model: models.meeting,
                type: types.AutoField,
                search_attributes: {
                    exact: template.id,
                },
            });
        }
        return headers;
    }

    const getScorePercentFields = {
        name: fields.meeting_score__percent,
        model: models.meeting,
        type: types.FloatField,
    };

    const getScoreGivenFields = {
        name: fields.score__score_given,
        model: models.meeting,
        type: types.FloatField,
    };

    for (let id of ids) {
        if (+id === 0) {
            headers.push({
                ...getScorePercentFields,
                search_attributes:
                    filters[id]?.checked === 1
                        ? {
                              gte: stats_threshold.good / 100,
                          }
                        : filters[id]?.checked === 0
                        ? {
                              lt: stats_threshold.good / 100,
                              gte: stats_threshold.average / 100,
                          }
                        : { lt: stats_threshold.bad / 100 },
            });
        } else {
            const { checked, question_type } = filters[id];

            headers.push({
                name: fields.score__question__id,
                model: models.meeting,
                type: types.AutoField,
                search_attributes: {
                    exact: +id,
                },
            });

            if (question_type === "rating") {
                const score_given = { ...getScoreGivenFields };
                switch (checked) {
                    case "5<":
                        score_given.search_attributes = {
                            lt: 5,
                        };
                        break;
                    case "7<":
                        score_given.search_attributes = {
                            lt: 7,
                        };
                        break;
                    case "7>":
                        score_given.search_attributes = {
                            gte: 7,
                        };
                        break;
                    default:
                        score_given.search_attributes = {
                            exact: -1,
                        };
                }

                headers.push(score_given);
            } else
                headers.push({
                    ...getScoreGivenFields,
                    search_attributes: {
                        exact: checked,
                    },
                });
        }
    }

    if (headers?.length && template?.id) {
        headers.push({
            name: fields.meeting_score__scores__question__category__template__id,
            model: models.meeting,
            type: types.AutoField,
            search_attributes: {
                exact: template.id,
            },
        });
        if (audit_filter.audit_type === auditConfig.MANUAL_AUDIT_TYPE) {
            headers.push({
                name: fields.score__is_ai_rated,
                model: models.meeting,
                type: types.BooleanField,
                search_attributes: {
                    exact: false,
                },
            });
        } else {
            headers.push({
                name: fields.score__is_ai_rated,
                model: models.meeting,
                type: types.BooleanField,
                search_attributes: {
                    exact: true,
                },
            });
        }
        if (audit_filter.audit_type !== auditConfig.MANUAL_AUDIT_TYPE)
            headers.push(searchAuditorFilters());
    }

    return headers;
};

//Detalis Page of account filter
export const accountFiltersPayload = ({
    clients,
    reps,
    topics,
    acc_id,
    keyword,
    aiDataFilter,
    date: epoch,
    leadScoreFilter,
    meeting_ids,
}) => {
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
                    exact: leadScoreFilter.type_id,
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
                    iregex: leadScoreFilter.result ? "true" : "false",
                },
            },
            {
                name: fields.score__question__id,
                model: models.meeting,
                type: types.AutoField,
                search_attributes: {
                    exact: leadScoreFilter.id,
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

//List Page Filters
export const accountListFiltersPayload = ({
    start_date_gte,
    start_date_lte,
    team_id,
    owner_id,
    stage,
    dealSize,
    close_date_gte,
    close_date_lte,
    last_contacted_gte,
    last_contacted_lte,
    searchText,
    aiQuestions,
    duration_gte,
    duration_lte,
    template_id,
    leadScoreQuestions,
    leadScorePercent,
    audit_filter,
    stats_threshold,
    accountTags,
    lead_config,
}) => {
    const formatDate = (epoch, start = false, dateTimeFormat = false) => {
        const date = new Date(epoch);

        const yy = date.getFullYear();
        const mm = date.getMonth() + 1;
        let dd = date.getDate();

        dd = dd < 10 ? `0${dd}` : dd;
        if (!dateTimeFormat) return `${yy}-${mm}-${dd}`;
        return start
            ? `${yy}-${mm}-${dd}T00:00:00.000Z`
            : `${yy}-${mm}-${dd}T23:59:59.999Z`;
    };

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
        search_attributes: owner_id.length
            ? { in: owner_id }
            : {
                  exact: null,
              },
    });

    data.push({
        name: fields.stage__id,
        model: models.opportunity,
        type: types.AutoField,
        search_attributes: {
            exact: stage || null,
        },
    });

    data.push({
        name: fields.account_size,
        model: models.opportunity,
        type: types.PositiveIntegerField,
        search_attributes: {
            gte: +dealSize[0] || null,
        },
    });

    data.push({
        name: fields.account_size,
        model: models.opportunity,
        type: types.PositiveIntegerField,
        search_attributes: {
            lte: +dealSize[1] || null,
        },
    });

    data.push({
        name: fields.close_date,
        model: models.opportunity,
        type: types.DateField,
        search_attributes: {
            gte: close_date_gte ? formatDate(close_date_gte) : null,
        },
    });

    data.push({
        name: fields.close_date,
        model: models.opportunity,
        type: types.DateField,
        search_attributes: {
            lte: close_date_lte ? formatDate(close_date_lte) : null,
        },
    });

    data.push({
        name: fields.last_connected_date,
        model: models.opportunity,
        type: types.DateField,
        search_attributes: {
            gte: last_contacted_gte ? formatDate(last_contacted_gte) : null,
        },
    });

    data.push({
        name: fields.last_connected_date,
        model: models.opportunity,
        type: types.DateField,
        search_attributes: {
            lte: last_contacted_lte ? formatDate(last_contacted_lte) : null,
        },
    });

    if (leadScorePercent !== null) {
        data.push({
            name: fields.lead_score,
            model: models.opportunity,
            type: types.FloatField,
            search_attributes: {
                gte: +leadScorePercent,
            },
        });
    }

    // if (searchText) {
    //     data.push({
    //         name: fields.sales_task__name,
    //         model: models.opportunity,
    //         type: types.CharField,
    //         search_attributes: {
    //             iregex: searchText,
    //         },
    //     });
    // }

    const keys = Object.keys(aiQuestions);
    const leadScoreKeys = Object.keys(leadScoreQuestions);

    if (leadScoreKeys.length) {
        for (let i = 0; i < leadScoreKeys.length; i++) {
            data.push({
                name: fields.lead_score_objs__result_repr,
                model: models.opportunity,
                type: types.TextField,
                search_attributes:
                    leadScoreQuestions[leadScoreKeys[i]]?.checked === 1
                        ? {
                              iregex: "True",
                          }
                        : leadScoreQuestions[leadScoreKeys[i]]?.checked === 0
                        ? {
                              iregex: "False",
                          }
                        : { iregex: "None" },
            });
            data.push({
                name: fields.lead_score_objs__template__category__question__id,
                model: models.opportunity,
                type: types.AutoField,
                search_attributes: {
                    exact: +leadScoreKeys[i],
                },
            });
        }
    }

    if (template_id && (audit_filter?.audit_type || keys.length)) {
        data.push({
            name: fields.template__id,
            model: models.opportunity,
            type: types.AutoField,
            search_attributes: {
                exact: template_id,
            },
        });
    }

    if (keys.length) {
        for (let i = 0; i < keys.length; i++) {
            let key = +keys[i];
            //If key is number it means it is a question else it means the question is CALL SCORE
            if (isNaN(key)) {
                data.push({
                    name:
                        audit_filter?.audit_type ===
                        auditConfig.MANUAL_AUDIT_TYPE
                            ? fields.manual_score
                            : fields.ai_score,
                    model: models.opportunity,
                    type: types.FloatField,
                    search_attributes:
                        aiQuestions[keys[i]]?.checked === 1
                            ? {
                                  gte: stats_threshold.good,
                              }
                            : aiQuestions[keys[i]]?.checked === 0
                            ? {
                                  gte: stats_threshold.average,
                                  lt: stats_threshold.good,
                              }
                            : { lt: stats_threshold.bad },
                });
                continue;
            }
            data.push({
                name: fields.scores__question__id,
                model: models.opportunity,
                type: types.AutoField,
                search_attributes: {
                    exact: +keys[i],
                },
            });

            if (aiQuestions[keys[i]].type === "rating") {
                const score_given = {
                    name: fields.scores__score_given,
                    model: models.opportunity,
                    type: types.FloatField,
                };
                switch (aiQuestions[keys[i]].checked) {
                    case "5<":
                        score_given.search_attributes = {
                            lt: 5,
                        };
                        break;
                    case "7<":
                        score_given.search_attributes = {
                            lt: 7,
                        };
                        break;
                    case "7>":
                        score_given.search_attributes = {
                            gte: 7,
                        };
                        break;
                    default:
                        score_given.search_attributes = {
                            exact: -1,
                        };
                }
                data.push(score_given);
            } else {
                data.push({
                    name: fields.scores__score_given,
                    model: models.opportunity,
                    type: types.FloatField,
                    search_attributes: {
                        exact: aiQuestions[keys[i]].checked,
                    },
                });
            }
        }
        data.push({
            name: fields.scores__is_ai_rated,
            model: models.opportunity,
            type: types.BooleanField,
            search_attributes: {
                exact:
                    audit_filter?.audit_type === auditConfig.MANUAL_AUDIT_TYPE
                        ? false
                        : true,
            },
        });
    }

    if (accountTags.length) {
        if (accountTags.length === 1) {
            data.push({
                name: fields.account_tags,
                model: models.opportunity,
                type: types.AutoField,
                search_attributes: {
                    exact: accountTags[0],
                },
            });
        } else {
            data.push({
                name: fields.account_tags,
                model: models.opportunity,
                type: types.AutoField,
                search_attributes: {
                    in: accountTags,
                },
            });
        }
    }
    return [...data, ...getAccLeadConfig(lead_config)];
};

export const searchAuditorFilters = (filter, audit_feedback_status) => {
    const data = {
        name: fields.meeting_score__auditor__id,
        model: models.meeting,
        type: types.AutoField,
    };

    if (!filter) {
        return {
            ...data,
            search_attributes: {
                isnull: true,
            },
        };
    }
    if (
        (filter.audit_type === auditConfig.MANUAL_AUDIT_TYPE &&
            !filter?.auditors?.filter((e) => +e !== 0)?.length) ||
        audit_feedback_status
    ) {
        if (audit_feedback_status)
            return [
                {
                    ...data,
                    search_attributes: {
                        isnull: false,
                    },
                },
                {
                    name: fields.meeting_score__status,
                    model: models.meeting,
                    type: types.CharField,
                    search_attributes:
                        audit_feedback_status === "not_acknowledged"
                            ? {
                                  isnull: true,
                              }
                            : {
                                  exact: audit_feedback_status,
                              },
                },
            ];
        else
            return [
                {
                    ...data,
                    search_attributes: {
                        isnull: false,
                    },
                },
            ];
    }
    if (
        !filter?.auditors?.length ||
        (filter?.auditors?.length === 1 && filter?.auditors?.[0] === -1)
    )
        return [];

    const index = filter.auditors.findIndex((id) => id === 0);

    //index is -1 it means all is not selected so send the ids
    if (index === -1) {
        return [
            {
                ...data,
                search_attributes: {
                    in: filter.auditors,
                },
            },
        ];
    }

    //If index is -. It means all is selected
    return [
        {
            ...data,
            search_attributes: {
                isnull: false,
            },
        },
    ];
};

export const encodeFilterData = (state) => {
    const topbarData = {
        callType: state.selectedCallTypes,
        callDuration:
            state.durationOptions[state.activeDurationKey ?? 0]?.value,
        repId: state.selectedReps || [],
        teamId: state.selectedTeams || [],
        startDate: state.dateOptions[state.activeDateRangeKey]?.dateRange?.[0],
        endDate: state.dateOptions[state.activeDateRangeKey]?.dateRange?.[1],
        startJoinDate:
            state.dateOptions[state.activeJoinDateRangeKey]?.dateRange?.[0],
        endJoinDate:
            state.dateOptions[state.activeJoinDateRangeKey]?.dateRange?.[1],
    };
    const searchKeywords = {
        keywords: state.keywords,
        isInCall: state.keywordPresent,
        saidByClient: state.keywordSaidBy?.includes("Others"),
        saidByOwner: state.keywordSaidBy?.includes("Rep"),
    };
    const interactivityData = {
        interactivity: {
            from: state.interactivity.interactivity[0],
            to: state.interactivity.interactivity[1],
        },
        patience: {
            from: state.interactivity.patience[0] || 0,
            to: state.interactivity.patience[1] || 100,
        },
        clientMonologue: {
            from: state.interactivity.clientLongestMonologue[0] * 60,
            to: state.interactivity.clientLongestMonologue[1] * 60,
        },
        ownerMonologue: {
            from: state.interactivity.ownerLongestMonologue[0] * 60,
            to: state.interactivity.ownerLongestMonologue[1] * 60,
        },
        clientRatio: {
            from: state.interactivity.clientTalkRatio[0] / 100,
            to: state.interactivity.clientTalkRatio[1] / 100,
        },
        ownerRatio: {
            from: state.interactivity.ownerTalkRatio[0] / 100,
            to: state.interactivity.ownerTalkRatio[1] / 100,
        },
        interruption_count: {
            from: state.interactivity.interruption_count[0],
            to: state.interactivity.interruption_count[1],
        },
    };
    let encodedFilters = [
        ...getTopbarFilters(topbarData),
        ...searchConferenceToolFilters(state.activeRecMediumKey),
        ...searchProcessingStatusFilters(state.activeProcStatusKey),
        ...searchSalesTaskNameFilters(state.activeClientKey),
        ...searchKeywordsFilters(searchKeywords),
        ...searchTagsFilters(
            state.selectedTags?.length > 0 ? state.selectedTags : null
        ),
        ...getCallLevelStage({ stage: state.activeStageKey }),
        ...searchInteractivityFilters(interactivityData),
        ...searchQuestionFilters({
            byOwner: {
                from: state.questionCountRep[0],
                to: state.questionCountRep[1],
            },
            byClient: {
                from: state.questionCountOther[0],
                to: state.questionCountOther[1],
            },
        }),
        ...searchAuditFilters(
            state.activeQuestions,
            {
                id: state.activeTemplateKey,
            },
            {
                audit_filter:
                    state.auditType === "ai"
                        ? auditConfig.AI_AUDIT_TYPE
                        : auditConfig.MANUAL_AUDIT_TYPE,
            },
            state.stats_threshold
        ),
        ...getTalktimeFilter(state.interactivity?.talktime),
        ...searchTopicsFilters({ topic: state.activeTopicKey, inCall: true }),
    ];
    if (
        (typeof state.minCallScore === "number" ||
            typeof state.maxCallScore === "number") &&
        state.activeTemplateKey
    ) {
        encodedFilters = [
            ...encodedFilters,
            ...setAiScoreFilter({
                min_aiscore: state.minCallScore,
                max_aiscore: state.maxCallScore,
                template: { id: state.activeTemplateKey },
            }),
        ];
    }
    if (state.has_chat) {
        encodedFilters = [
            ...encodedFilters,
            ...getMeetingField(state.meetingType),
        ];
    }
    return encodedFilters || [];
};

export const decodeQuestionsFilter = (filters) => {
    let questions = {};

    for (let i = 0; i < filters?.length - 1; i++) {
        if (filters[i]?.name === fields.score__question__id) {
            if (filters[i + 1].name !== fields.score__score_given) {
                return openNotification(
                    "error",
                    "Error",
                    "Question has no corresponding score"
                );
            }
            if (typeof filters[i + 1]?.search_attributes?.exact === "number") {
                questions[filters[i]?.search_attributes?.exact] =
                    filters[i + 1]?.search_attributes?.exact;
            } else if (
                typeof filters[i + 1]?.search_attributes?.lt === "number"
            ) {
                questions[filters[i]?.search_attributes?.exact] = `${
                    filters[i + 1]?.search_attributes?.lt
                }<`;
            } else if (
                typeof filters[i + 1]?.search_attributes?.gte === "number"
            ) {
                questions[filters[i]?.search_attributes?.exact] = `${
                    filters[i + 1]?.search_attributes?.gte
                }>`;
            }
        }
    }
    return questions;
};

export const getLeadConfig = ({ is_hot, is_warm, is_cold }) => {
    if (is_hot || is_warm || is_cold)
        return [
            {
                name: fields.sales_stage__sales_task__account_stat__lead_classification,
                model: models.meeting,
                type: types.CharField,
                search_attributes: {
                    ...(is_hot && {
                        exact: "hot",
                    }),
                    ...(is_warm && {
                        exact: "warm",
                    }),
                    ...(is_cold && {
                        exact: "cold",
                    }),
                },
            },
        ];

    return [];
};

export const getAccLeadConfig = ({ is_hot, is_warm, is_cold }) => {
    if (is_hot || is_warm || is_cold)
        return [
            {
                name: "lead_classification",
                model: "account.models.AccountStats",
                type: types.CharField,
                search_attributes: {
                    ...(is_hot && {
                        exact: "hot",
                    }),
                    ...(is_warm && {
                        exact: "warm",
                    }),
                    ...(is_cold && {
                        exact: "cold",
                    }),
                },
            },
        ];

    return [];
};
