import * as types from "./types";
import apiErrors from "@apis/common/errors";
import { setLoader, openNotification, storeTopics } from "../common/actions";
import { getIdealRangesAjx, getDurationAggregations } from "@apis/statistics";
import {
    generateTopicDuration,
    REPS_DUMMY,
    TOPICS_DUMMY,
} from "@container/Statistics/__mock__/mock";
import { getTopicSnippetsAjx } from "@apis/statistics/index";

const storeIdealRanges = (idealRanges) => {
    return {
        type: types.STORE_IDEAL_RANGES,
        idealRanges,
    };
};

const storeTopicDuration = (data) => {
    return {
        type: types.STORE_TOPIC_DURATION,
        data,
    };
};

const setTopicSnippetsLoading = (loading) => {
    return {
        type: types.TOPIC_SNIPPETS_LOADING,
        loading,
    };
};

export function getIdealRanges() {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        return getIdealRangesAjx(getState().common.domain).then((res) => {
            dispatch(setLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeIdealRanges(res));
            }
            return res;
        });
    };
}

export function getDurationAggregationsById(
    groupByTopic,
    searchData,
    groupByOwner,
    groupByTime
) {
    return (dispatch, getState) => {
        return getDurationAggregations(
            getState().common.domain,
            ["avg", "max"],
            groupByTopic,
            searchData,
            groupByOwner,
            groupByTime
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                if (
                    !Object.keys(res).length &&
                    !getState().common.didFiltersChange
                ) {
                    let data = generateTopicDuration(TOPICS_DUMMY, REPS_DUMMY);
                    dispatch(storeTopicDuration(data));
                } else {
                    dispatch(storeTopicDuration(res));
                }
            }
        });
    };
}

export function getTopicSnippets(searchData, topicId, repId, nextUrl) {
    return (dispatch, getState) => {
        dispatch(setTopicSnippetsLoading(true));

        return getTopicSnippetsAjx(
            getState().common.domain,
            searchData,
            topicId,
            nextUrl,
            repId
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                const { topicDuration } = getState().stats;
                let details = [...topicDuration[topicId]];
                let newDetails = details.map((detail) => {
                    if (+detail.speaker_id === +repId) {
                        if (detail.meetings) {
                            return {
                                ...detail,
                                meetings: [...detail.meetings, ...res.results],
                                nextUrl: res.next,
                            };
                        } else {
                            return {
                                ...detail,
                                meetings: res.results,
                                nextUrl: res.next,
                            };
                        }
                    } else return detail;
                });
                const newTopicsDuration = {
                    ...topicDuration,
                };
                newTopicsDuration[topicId] = newDetails;

                dispatch(storeTopicDuration(newTopicsDuration));
            }
            dispatch(setTopicSnippetsLoading(false));
        });
    };
}
