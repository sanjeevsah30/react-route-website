import {
    getTopbarFilters,
    searchSalesTaskNameFilters,
    // searchDurationFilters,
    searchTagsFilters,
    searchQuestionFilters,
    searchTopicsFilters,
    searchInteractivityFilters,
    searchKeywordsFilters,
    searchConferenceToolFilters,
    searchProcessingStatusFilters,
    searchAuditFilters,
    searchAuditorFilters,
    setAiScoreFilter,
    getCallLevelStage,
    getTalktimeFilter,
} from "@tools/searchFactory";
import { getLeadConfig } from "tools/searchFactory";

//custom data is to save those filters which are dependent on other api to be shown in the filters section
export const prepareSearchData = (
    searchFields,
    data,
    custom_data,
    stats_threshold
) => {
    const topbarData = {
        callType: data.callType,
        callDuration: data.callDuration,
        repId: data.activeReps,
        teamId: data.activeTeam,
        startDate: data.activeDateRange[0],
        endDate: data.activeDateRange[1],
        hasChat: data?.versionData?.has_chat,
        meetingType: data.meetingType,
    };
    const interactivityData = {
        interactivity: {
            from: data.interactivity.interactivity[0],
            to: data.interactivity.interactivity[1],
        },
        patience: {
            from: data.min_patience,
            to: data.max_patience,
        },
        interruption_count: {
            from: data.min_interruption_count,
            to: data.max_interruption_count,
        },
        clientMonologue: {
            from: data.interactivity.clientLongestMonologue[0] * 60,
            to: data.interactivity.clientLongestMonologue[1] * 60,
        },
        ownerMonologue: {
            from: data.interactivity.ownerLongestMonologue[0] * 60,
            to: data.interactivity.ownerLongestMonologue[1] * 60,
        },
        clientRatio: {
            from: data.interactivity.clientTalkRatio[0] / 100,
            to: data.interactivity.clientTalkRatio[1] / 100,
        },
        ownerRatio: {
            from: data.interactivity.ownerTalkRatio[0] / 100,
            to: data.interactivity.ownerTalkRatio[1] / 100,
        },
    };
    let preparedData = [
        ...getTopbarFilters(topbarData),

        // ...getMeetingField(data.meetingType),

        ...searchConferenceToolFilters(data.conferenceMedium),
        ...searchProcessingStatusFilters(data.processingStatus),
        ...searchSalesTaskNameFilters(data.client),
        ...searchKeywordsFilters(data.searchKeywords),

        ...searchTagsFilters(data.filterTags.length ? data.filterTags : null),
        ...searchQuestionFilters({
            byOwner: {
                from: data.questions.byOwner[0],
                to: data.questions.byOwner[1],
            },
            byClient: {
                from: data.questions.byClient[0],
                to: data.questions.byClient[1],
            },
        }),
        ...searchTopicsFilters({
            topic: data.topics.topic,
            inCall: data.topics.inCall,
        }),
        ...searchInteractivityFilters(interactivityData),
        ...searchAuditorFilters(data.audit_filter, data.audit_feedback_status),
        ...getCallLevelStage(data),
        ...getTalktimeFilter([data?.min_talktime, data?.max_talktime]),
        ...getLeadConfig(data.lead_config),
    ];

    if (
        (typeof data.min_aiscore === "number" ||
            typeof data.max_aiscore === "number") &&
        data.template
    ) {
        preparedData = [...preparedData, ...setAiScoreFilter(data)];
    }
    preparedData = [
        ...preparedData,
        ...searchAuditFilters(
            data.auditQuestions,
            data.template,
            data.audit_filter,
            stats_threshold
        ),
    ];

    if (custom_data) {
        return [
            ...preparedData,
            {
                name: "custom_data",
                ...custom_data,
            },
        ];
    }

    return preparedData;
};

const checkIsInCall = (fields) => {
    if (fields["title|agenda|client_transcript|owner_transcript"]) {
        return !fields["title|agenda|client_transcript|owner_transcript"]
            .search_attributes.negate_search;
    }
    if (
        fields["title|agenda|client_transcript"] ||
        fields["title|agenda|owner_transcript"]
    ) {
        return true;
    }

    if (
        fields["topics.topic_text"].search_attributes.value ||
        fields["owner_questions|client_questions"] ||
        fields.client_questions.search_attributes.value ||
        fields.owner_questions.search_attributes.value
    ) {
        return true;
    }

    return false;
};

const getIsPartOfQuestion = (fields) => {
    if (fields["client_questions|owner_questions"]) {
        return fields["client_questions|owner_questions"].search_attributes
            .negate_search;
    }
    if (fields.client_questions.search_attributes.value) {
        return fields.client_questions.search_attributes.negate_search;
    }
    if (fields.owner_questions.search_attributes.value) {
        return fields.owner_questions.search_attributes.negate_search;
    }
};
