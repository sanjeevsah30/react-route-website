import { getError } from "../common";
import config from "./config";
import { axiosInstance } from "@apis/axiosInstance";

export const getOverallStatsTiles = (
    domain,
    fields,
    aggregations,
    groupByTime,
    filterData,
    groupByOwner
) => {
    let data = {
        fields: fields,
        aggregations: aggregations,
        group_by_time: groupByTime,
        filters: filterData,
        group_by_owner: groupByOwner,
    };

    const endpoint = `/${config.GET_OVERALL_STATS_TILES}/`;
    return axiosInstance
        .post(endpoint, data)
        .then((res) => res.data)
        .catch((error) => getError(error));
};

export const getOverallStatsGraph = (
    domain,
    fields,
    aggregations,
    groupByTime,
    filterData,
    groupByOwner
) => {
    let data = {
        fields: fields,
        aggregations: aggregations,
        group_by_time: groupByTime,
        filters: filterData,
        group_by_owner: groupByOwner,
    };

    const endpoint = `/${config.GET_OVERALL_STATS_GRAPH}/`;
    return axiosInstance
        .post(endpoint, data)
        .then((res) => res.data)
        .catch((error) => getError(error));
};

export const getStatsAggregations = (
    domain,
    fields,
    aggregations,
    groupByTime,
    filterData,
    groupByOwner
) => {
    let data = {
        fields: fields,
        aggregations: aggregations,
        group_by_time: groupByTime,
        filters: filterData,
        group_by_owner: groupByOwner,
    };

    const endpoint = `/${config.GET_STATS_AGGREGATIONS}/`;
    return axiosInstance
        .post(endpoint, data)
        .then((res) => res.data)
        .catch((error) => getError(error));
};

export const getDurationAggregations = (
    domain,
    aggregations,
    groupByTopic,
    filterData,
    groupByOwner,
    groupByTime
) => {
    const endpoint = `/${config.GET_TOPIC_DURATION_STATS}/`;
    return axiosInstance
        .post(endpoint, { filters: filterData })
        .then((res) => res.data)
        .catch((error) => getError(error));
};

export const getTimingAggregations = (
    domain,
    aggregations,
    groupByTopic,
    filterData,
    groupByOwner
) => {
    let data = {
        aggregations: aggregations,
        group_by_topic: groupByTopic,
        filters: filterData,
        group_by_owner: groupByOwner,
    };

    const endpoint = `/${config.GET_TOPIC_TIMING_STATS}/`;
    return axiosInstance
        .post(endpoint, data)
        .then((res) => res.data)
        .catch((error) => getError(error));
};

export const getIdealRangesAjx = (domain) => {
    const endpoint = `/${config.GET_IDEAL_RANGES}`;
    return axiosInstance
        .get(endpoint)
        .then((res) => res.data)
        .catch((error) => getError(error));
};
export const getTopicSnippetsAjx = (domain, data, topicId, nextUrl, repId) => {
    const endpoint = nextUrl || `/${config.GET_TOPIC_SNIPPETS}/${topicId}/`;
    return axiosInstance
        .post(endpoint, { filters: data, speaker_id: +repId })
        .then((res) => res.data)
        .catch((error) => getError(error));
};
