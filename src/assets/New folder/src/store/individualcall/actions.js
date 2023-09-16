import * as types from "./types";
import { isEmpty } from "lodash";
import apiErrors from "@apis/common/errors";
import {
    setLoader,
    openNotification,
    showError,
    successSnackBar,
} from "../common/actions";
import {
    createCallMediaCommentsApi,
    createCallCommentsApi,
    deleteCallCommentApi,
    deleteCallSnippetsApi,
    fetchCallCommentReplyApi,
    fetchCallCommentsApi,
    fetchCallSnippetsApi,
    getCallTranscript,
    getLeadScoreInsightsApi,
    getSnippetToUpdateApi,
    updateCallCommentsApi,
    updateShareSnippetApi,
    updateTranscript,
} from "@apis/individual/index";
import { getColor, getRandomColors } from "@tools/helpers";
import IndividualCallConfig from "@constants/IndividualCall/index";
import getSnippets, {
    getSnippetShareLinkAjx,
} from "app/components/IndividualCall/__mock__/getSnippets";

export const getParticipantType = (speaker_type) => {
    switch (speaker_type) {
        case "client":
            return "CUSTOMER";
        case "owner":
            return "INTERNAL";
        case "participant":
            return "PARTICIPANT";
        default:
            return "UNKNOWN";
    }
};

export function storeIndividualCalls(data) {
    return {
        type: types.STORE_INDIVIDUAL_CALLS,
        data,
    };
}
export function storeSnippets(data) {
    return {
        type: types.STORE_SNIPPETS,
        data,
    };
}

function processTranscript(dispatch, transcripts, callId, existingCalls) {
    if (!!transcripts.length) {
        let transQuestions = {
            all: {
                count: 0,
                data: [],
            },
        };
        let transActions = {
            all: {
                count: 0,
                data: [],
            },
        };
        let transMoments = {
            all: {
                count: 0,
                data: [],
            },
        };
        let transTopics = [];
        let uniqueTopics = {};
        let transMonologues = {};
        let sentimentMonologues = {};
        let prevActionItem = null;
        const transcript_speaker_ids = {};
        const sentiment = {
            positive: 0,
            negative: 0,
            neutral: 0,
        };

        transcripts.forEach((transcript) => {
            if (
                transcript.speaker_type === "client" ||
                transcript.speaker_type === "participant" ||
                transcript.speaker_type === "owner"
            )
                transcript?.sentiment_score?.[0] > 0
                    ? sentiment.positive++
                    : transcript?.sentiment_score?.[0] < 0
                    ? sentiment.negative++
                    : sentiment.neutral++;

            if (!transQuestions[transcript.speaker_name]) {
                transQuestions[transcript.speaker_name] = {
                    count: 0,
                    data: [],
                    speaker_type: getParticipantType(transcript.speaker_type),
                };
            }
            if (transcript.speaker_id && transcript.speaker_name) {
                transcript_speaker_ids[transcript.speaker_name] =
                    transcript.speaker_id;
            }
            if (!transActions[transcript.speaker_name]) {
                transActions[transcript.speaker_name] = {
                    count: 0,
                    data: [],
                    speaker_type: getParticipantType(transcript.speaker_type),
                };
            }
            if (!transMoments[transcript.speaker_name]) {
                transMoments[transcript.speaker_name] = {
                    count: 0,
                    data: [],
                    speaker_type: getParticipantType(transcript.speaker_type),
                };
            }
            if (!transMonologues[transcript.speaker_name]) {
                transMonologues[transcript.speaker_name] = [];
            }

            // Extract Monologues for all speakers
            transMonologues[transcript.speaker_name].push({
                startsAt: transcript.start_time,
                endsAt: transcript.end_time,
                color: getColor(transcript.speaker_name),
                name: transcript.speaker_name,
                speaker_type: getParticipantType(transcript.speaker_type),
            });

            // Extract all questions for all speakers
            if (transcript.sentence_categories.question) {
                transcript.sentence_categories.question.forEach((question) => {
                    // if (question.text.split(' ').length > 3) {
                    // Increment question count
                    transQuestions[transcript.speaker_name].count += 1;
                    transQuestions.all.count += 1;
                    // Add data for all
                    transQuestions.all.data.push({
                        name: transcript.speaker_name,
                        time: question.start_time || 0,
                        startsAt: question.start_time || 0,
                        endsAt: question.end_time || 0,
                        text: question.text,
                        type: IndividualCallConfig.QUESTIONTYPE,
                        speaker_type: getParticipantType(
                            transcript.speaker_type
                        ),
                    });

                    // Add question
                    transQuestions[transcript.speaker_name].data.push({
                        name: transcript.speaker_name,
                        time: question.start_time || 0,
                        startsAt: question.start_time || 0,
                        endsAt: question.end_time || 0,
                        text: question.text,
                        type: IndividualCallConfig.QUESTIONTYPE,
                    });
                    // }
                });
            }

            // Extract Actions
            if (transcript.sentence_categories.action) {
                transcript.sentence_categories.action.forEach((action) => {
                    // Increment action count
                    transActions[transcript.speaker_name].count += 1;
                    transActions.all.count += 1;
                    // Add data for all
                    transActions.all.data.push({
                        name: transcript.speaker_name,
                        time: action.start_time || 0,
                        startsAt: action.start_time || 0,
                        endsAt: action.end_time || 0,
                        text: action.text,
                        type: IndividualCallConfig.ACTIONTYPE,
                        speaker_type: getParticipantType(
                            transcript.speaker_type
                        ),
                    });

                    transActions[transcript.speaker_name].data.push({
                        name: transcript.speaker_name,
                        time: action.start_time || 0,
                        startsAt: action.start_time || 0,
                        endsAt: action.end_time || 0,
                        text: action.text,
                        type: IndividualCallConfig.ACTIONTYPE,
                    });
                });
            }

            //Extract Positiev and Negative Moments
            if (
                transcript?.sentiment_score?.[0] > 0 ||
                transcript?.sentiment_score?.[0] < 0
            ) {
                transMoments[transcript.speaker_name].count += 1;
                transMoments.all.count += 1;

                // Add data for all
                transMoments.all.data.push({
                    name: transcript.speaker_name,
                    time: transcript.start_time || 0,
                    startsAt: transcript.start_time || 0,
                    endsAt: transcript.end_time || 0,
                    text: transcript.monologue_text,
                    type:
                        transcript?.sentiment_score?.[0] > 0
                            ? IndividualCallConfig.POSITIVE_MOMENTS
                            : IndividualCallConfig.NEGATIVE_MOMENTS,
                    speaker_type: getParticipantType(transcript.speaker_type),
                    sentiment_score: transcript.sentiment_score || null,
                });

                transMoments[transcript.speaker_name].data.push({
                    name: transcript.speaker_name,
                    time: transcript.start_time || 0,
                    startsAt: transcript.start_time || 0,
                    endsAt: transcript.end_time || 0,
                    text: transcript.monologue_text,
                    type:
                        transcript?.sentiment_score?.[0] > 0
                            ? IndividualCallConfig.POSITIVE_MOMENTS
                            : IndividualCallConfig.NEGATIVE_MOMENTS,
                    speaker_type: getParticipantType(transcript.speaker_type),
                    sentiment_score: transcript.sentiment_score || null,
                });

                if (!sentimentMonologues[transcript.speaker_name]) {
                    sentimentMonologues[transcript.speaker_name] = [];
                }

                sentimentMonologues[transcript.speaker_name].push({
                    startsAt: transcript.start_time,
                    endsAt: transcript.end_time,
                    color:
                        transcript?.sentiment_score?.[0] > 0
                            ? "#52C41A"
                            : "#FC3E01",
                    name: transcript.speaker_name,
                    speaker_type: getParticipantType(transcript.speaker_type),
                    type:
                        transcript?.sentiment_score?.[0] > 0
                            ? IndividualCallConfig.POSITIVE_MOMENTS
                            : IndividualCallConfig.NEGATIVE_MOMENTS,
                });
            }

            // Extract Important Moments
            // if (transcript.sentence_categories.important_moment) {
            //     transcript.sentence_categories.important_moment.forEach(
            //         (moment) => {
            //             // Increment moments count
            //             transMoments[transcript.speaker_name].count += 1;
            //             transMoments.all.count += 1;
            //             // Add data for all
            //             transMoments.all.data.push({
            //                 name: transcript.speaker_name,
            //                 time: moment.start_time || 0,
            //                 startsAt: moment.start_time || 0,
            //                 endsAt: moment.end_time || 0,
            //                 text: moment.text,
            //                 type: IndividualCallConfig.IMPORTANT_MOMENTS,
            //                 speaker_type: getParticipantType(
            //                     transcript.speaker_type
            //                 ),
            //             });

            //             transMoments[transcript.speaker_name].data.push({
            //                 name: transcript.speaker_name,
            //                 time: moment.start_time || 0,
            //                 startsAt: moment.start_time || 0,
            //                 endsAt: moment.end_time || 0,
            //                 text: moment.text,
            //                 type: IndividualCallConfig.IMPORTANT_MOMENTS,
            //                 speaker_type: getParticipantType(
            //                     transcript.speaker_type
            //                 ),
            //             });
            //         }
            //     );
            // }

            // Extract Topics
            if (Object.keys(transcript.topics).length) {
                Object.keys(transcript.topics).forEach((topic) => {
                    if (!uniqueTopics[topic]) {
                        uniqueTopics[topic] = {
                            count: Object.keys(
                                transcript?.topics[topic]?.[0]?.detected_phrases
                            )?.length,
                            color: getColor(topic),
                            data: {},
                            allData: [],
                        };
                    } else {
                        uniqueTopics[topic] = {
                            ...uniqueTopics[topic],
                            count:
                                uniqueTopics[topic].count +
                                Object.keys(
                                    transcript?.topics[topic]?.[0]
                                        ?.detected_phrases
                                )?.length,
                        };
                    }
                    transTopics.push({
                        name: topic,
                        startsAt: transcript.start_time,
                        endsAt: transcript.end_time,
                        color: getColor(topic),
                    });
                    transcript.topics[topic].forEach((processedTopic) => {
                        let phrases = Array.isArray(
                            processedTopic.detected_phrases
                        )
                            ? processedTopic.detected_phrases
                            : Object.keys(processedTopic.detected_phrases);

                        phrases.forEach((phrase) => {
                            if (!uniqueTopics[topic].data[phrase]) {
                                uniqueTopics[topic].data[phrase] = {
                                    count: 1,
                                    data: [],
                                };
                            } else {
                                uniqueTopics[topic].data[phrase].count =
                                    uniqueTopics[topic].data[phrase].count + 1;
                            }

                            const last =
                                uniqueTopics[topic].allData[
                                    uniqueTopics[topic].allData.length - 1
                                ];

                            // if (last?.time !== processedTopic.start_time)
                            uniqueTopics[topic].allData = [
                                ...uniqueTopics[topic].allData,
                                {
                                    speaker_name: transcript.speaker_name,
                                    speaker_id: transcript.speaker_id,
                                    time: processedTopic.start_time,
                                    startsAt: processedTopic.start_time || 0,

                                    endsAt: processedTopic.end_time,
                                    color: getColor(topic),
                                    text: Array.isArray(
                                        processedTopic.detected_phrases
                                    )
                                        ? processedTopic.text
                                        : processedTopic.detected_phrases[
                                              phrase
                                          ],
                                },
                            ];

                            uniqueTopics[topic].data[phrase].data.push({
                                name: transcript.speaker_name,
                                speaker_type: getParticipantType(
                                    transcript.speaker_type
                                ),
                                speaker_name: transcript.speaker_name,
                                speaker_id: transcript.speaker_id,
                                time: processedTopic.start_time,
                                startAt: processedTopic.start_time,
                                endsAt: processedTopic.end_time,
                                color: getColor(topic),
                                text: Array.isArray(
                                    processedTopic.detected_phrases
                                )
                                    ? processedTopic.text
                                    : processedTopic.detected_phrases[phrase],
                            });
                        });
                    });
                });
            }
        });

        // Add final action Item left after merging
        if (prevActionItem) {
            transActions[prevActionItem.name].push(prevActionItem);
        }

        existingCalls[callId] = {
            ...existingCalls[callId],
            questions: transQuestions,
            actionItems: transActions,
            importantMoments: transMoments,
            callTopics: transTopics,
            transcripts: transcripts,
            monologues: transMonologues,
            monologueTopics: uniqueTopics,
            transcript_speaker_ids,
            sentiment,
            sentimentMonologues: sentimentMonologues,
        };
        dispatch(storeIndividualCalls(existingCalls));
    }
}

function clubTranscript(dispatch, transcripts, callId, existingCalls) {
    let prevTranscript = null;
    let reducedTranscript = [];
    let words = 0;
    const original_transcripts = [...transcripts];
    if (transcripts && transcripts.length) {
        for (let i = 0; i <= transcripts.length; i++) {
            if (transcripts[i] && transcripts[i].word_alignment)
                words += transcripts[i].word_alignment.length;
            if (prevTranscript) {
                // if speaker name and first topic is same and total block time is  less then a threshold then merge
                if (
                    transcripts[i] &&
                    prevTranscript.speaker_name ===
                        transcripts[i].speaker_name &&
                    ((isEmpty(prevTranscript.topics) &&
                        isEmpty(transcripts[i].topics)) ||
                        Object.keys(prevTranscript.topics)[0] ===
                            Object.keys(transcripts[i].topics)[0]) &&
                    prevTranscript.totalTime +
                        (transcripts[i].end_time - transcripts[i].start_time) <
                        IndividualCallConfig.MERGE_THRESHOLD
                ) {
                    prevTranscript.monologue_text += ` ${transcripts[i].monologue_text}`;

                    prevTranscript.topics = {
                        ...prevTranscript.topics,
                        ...transcripts[i].topics,
                    };

                    prevTranscript.end_time = transcripts[i].end_time;
                    if (transcripts[i].word_alignment) {
                        prevTranscript.word_alignment = [
                            ...prevTranscript.word_alignment,
                            ...transcripts[i].word_alignment,
                        ];
                    }
                    prevTranscript.totalTime +=
                        transcripts[i].end_time - transcripts[i].start_time;
                } else {
                    reducedTranscript.push(prevTranscript);
                    prevTranscript = {
                        ...transcripts[i],
                        totalTime: transcripts[i]
                            ? transcripts[i].end_time -
                              transcripts[i].start_time
                            : 0,
                    };
                }
                if (prevTranscript.indexes) {
                    prevTranscript.indexes.push(i);
                } else {
                    prevTranscript.indexes = [i];
                }
            } else {
                prevTranscript = {
                    ...transcripts[i],
                    totalTime:
                        transcripts[i].end_time - transcripts[i].start_time,
                };
                if (prevTranscript.indexes) {
                    prevTranscript.indexes.push(i);
                } else {
                    prevTranscript.indexes = [i];
                }
            }
        }
    }

    existingCalls[callId] = {
        ...existingCalls[callId],
        renderedTranscript: reducedTranscript,
        transcripts: transcripts,
        words: words,
        isLoaded: true,
        original_transcripts,
    };
    dispatch(storeIndividualCalls(existingCalls));
}

export const getTranscript = (callId, club = true, loading = true) => {
    return (dispatch, getState) => {
        if (
            getState().individualcall[callId] &&
            getState().individualcall[callId].isLoaded
        ) {
            return new Promise((resolve) => resolve());
        }
        loading && dispatch(setLoader(true));

        return getCallTranscript(getState().common.domain, callId).then(
            (res) => {
                dispatch(setLoader(false));
                const existingCalls = JSON.parse(
                    JSON.stringify(getState().individualcall)
                );
                existingCalls[callId] = {
                    ...existingCalls[callId],
                    isLoaded: true,
                };
                dispatch(storeIndividualCalls(existingCalls));
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    // openNotification('error', 'Error', res.message);
                } else {
                    if (club)
                        clubTranscript(dispatch, res, callId, existingCalls);
                    processTranscript(dispatch, res, callId, existingCalls);
                }
                return res;
            }
        );
    };
};

export const updateCallTranscript = (callId, data) => {
    return (dispatch, getState) => {
        setLoader(true);
        const existingCalls = JSON.parse(
            JSON.stringify(getState().individualcall)
        );
        existingCalls[callId] = {
            ...existingCalls[callId],
            isLoaded: true,
        };
        clubTranscript(dispatch, data.transcript_json, callId, existingCalls);
        updateTranscript(getState().common.domain, callId, data).then((res) => {
            setLoader(false);
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            }
        });
    };
};

export const initializeIndividualCall = (callId) => {
    return (dispatch, getState) => {
        const existingCalls = JSON.parse(
            JSON.stringify(getState().individualcall)
        );

        if (!existingCalls[callId]) {
            existingCalls[callId] = {
                ...existingCalls[callId],
                questions: {},
                importantMoments: {},
                callTopics: [],
                actionItems: {},
                transcripts: [],
                renderedTranscript: [],
                monologues: {},
                monologueTopics: [],
                speaker_stats: {},
                transcript_speaker_ids: {},
                leadScoreInsights: [],
                original_transcripts: [],
            };
            dispatch(storeIndividualCalls(existingCalls));
        }
    };
};

export const getLeadScoreInsights = (callId) => (dispatch, getState) => {
    dispatch(setLoader(true));
    getLeadScoreInsightsApi(getState().common.domain, callId).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
        } else {
            const existingCalls = JSON.parse(
                JSON.stringify(getState().individualcall)
            );

            existingCalls[callId] = {
                ...existingCalls[callId],
                leadScoreInsights: res,
            };
            dispatch(storeIndividualCalls(existingCalls));
        }
        dispatch(setLoader(false));
    });
};

export const setCommentsLoader = (flag) => {
    return {
        type: types.SET_CALL_COMMENTS_LOADER,
        flag,
    };
};

export const setCallComments = (data) => {
    return {
        type: types.SET_CALL_COMMENTS,
        data,
    };
};

export function setCallCommentToReply(data) {
    return {
        type: types.SET_CALL_COMMENT_TO_REPLY,
        data,
    };
}

export const fetchCallComments = (id, next) => (dispatch, getState) => {
    next || dispatch(setCommentsLoader(true));
    fetchCallCommentsApi(getState().common.domain, id, next).then((res) => {
        dispatch(setCommentsLoader(false));
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }

        dispatch(
            setCallComments(
                next
                    ? {
                          ...res,
                          results: [
                              ...getState().individualcall.callComments.comments
                                  .results,
                              ...res.results,
                          ],
                      }
                    : res
            )
        );
    });
};

export const createCallComments = (id, payload) => (dispatch, getState) => {
    dispatch(setCommentsLoader(true));
    return createCallCommentsApi(getState().common.domain, id, payload).then(
        (res) => {
            dispatch(setCommentsLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return showError(res);
            }
            if (payload.parent) {
                return dispatch(
                    setCallCommentToReply({
                        replies: {
                            count: res.comments.length,
                            next: null,
                            prev: null,
                            results: [...res.comments],
                        },
                    })
                );
            }
            dispatch(
                setCallComments({
                    count: res.comments.length,
                    next: null,
                    prev: null,
                    results: [...res.comments],
                })
            );
        }
    );
};

export const createCallMediaComments =
    (id, payload) => (dispatch, getState) => {
        dispatch(setCommentsLoader(true));
        return createCallMediaCommentsApi(
            getState().common.domain,
            id,
            payload
        ).then((res) => {
            dispatch(setCommentsLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return showError(res);
            }

            if (payload?.get("parent")) {
                return dispatch(
                    setCallCommentToReply({
                        replies: {
                            count: res.comments.length,
                            next: null,
                            prev: null,
                            results: [...res.comments],
                        },
                    })
                );
            }
            dispatch(
                setCallComments({
                    count: res.comments.length,
                    next: null,
                    prev: null,
                    results: [...res.comments],
                })
            );
        });
    };

export const updateCallComments = (id, payload) => (dispatch, getState) => {
    dispatch(setCommentsLoader(true));
    updateCallCommentsApi(getState().common.domain, id, payload).then((res) => {
        dispatch(setCommentsLoader(false));
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }
        if (res.parent) {
            const { replies } =
                getState().individualcall.callComments.activeComment;
            const results = replies?.results.map((reply) => {
                if (reply.id === res.id) return res;
                return reply;
            });
            return dispatch(
                setCallCommentToReply({
                    replies: {
                        ...replies,
                        results,
                    },
                })
            );
        }
        const { comments } = getState().individualcall.callComments;
        const results = comments.results.map((comment) => {
            if (comment.id === res.id) return res;
            return comment;
        });
        dispatch(
            setCallComments({
                ...comments,
                results,
            })
        );
    });
};

export const deleteCallComment = (id, payload) => (dispatch, getState) => {
    deleteCallCommentApi(getState().common.domain, id, payload).then((res) => {
        dispatch(setCommentsLoader(false));
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }

        if (payload.parent) {
            const { replies } =
                getState().individualcall.callComments.activeComment;
            const results = replies?.results?.filter(
                (reply) => +reply.id !== +id
            );
            return dispatch(
                setCallCommentToReply({
                    replies: {
                        ...replies,
                        count:
                            getState().individualcall.callComments.activeComment
                                .replies.count - 1,
                        results,
                    },
                })
            );
        }
        const { comments } = getState().individualcall.callComments;

        const results = res
            ? comments?.results?.map((comment) =>
                  +comment.id === +id ? res : comment
              )
            : comments?.results?.filter((comment) => +comment.id !== +id);
        dispatch(
            setCallComments({
                ...comments,
                count: res ? comments.count : comments.count - 1,
                results,
            })
        );
    });
};

export const fetchCallCommentReply = (id, next) => (dispatch, getState) => {
    next || dispatch(setCommentsLoader(true));
    fetchCallCommentReplyApi(getState().common.domain, id).then((res) => {
        dispatch(setCommentsLoader(false));
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }
        dispatch(
            setCallCommentToReply({
                replies: res,
            })
        );
    });
};

export const fetchCallSnippets = (id, next) => (dispatch, getState) => {
    next ||
        dispatch(
            storeSnippets({
                loading: true,
            })
        );
    fetchCallSnippetsApi(getState().common.domain, id, next).then((res) => {
        next ||
            dispatch(
                storeSnippets({
                    loading: false,
                })
            );
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }

        dispatch(
            storeSnippets(
                next && getState().individualcall.snippets?.results
                    ? {
                          ...res,
                          results: [
                              ...getState().individualcall.snippets?.results,
                              ...res.results,
                          ],
                      }
                    : res
            )
        );
    });
};

export const getSnippetShareLink = (id) => (dispatch, getState) => {
    return getSnippetShareLinkAjx(id).then((res) => {
        navigator.clipboard.writeText(res, 100);
        const existingSnippets = JSON.parse(
            JSON.stringify(getState().individualcall.snippets)
        );
        const snippetToUpdate = existingSnippets.findIndex(
            (item) => item.id === id
        );
        existingSnippets[snippetToUpdate].shareLink = res;
        dispatch(storeSnippets(existingSnippets));
    });
};

export const deleteCallSnippet = (id) => (dispatch, getState) => {
    return deleteCallSnippetsApi(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }

        dispatch(
            storeSnippets({
                count: getState().individualcall.snippets.count - 1,
                results: [
                    ...getState().individualcall.snippets?.results?.filter(
                        (snippet) => snippet.id !== id
                    ),
                ],
            })
        );
    });
};

export const setSnippetToUpdate = (data) => {
    return {
        type: types.SET_SNIPPET_TO_UPDATE,
        data,
    };
};

export const getSnippetToUpdate = (id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    return getSnippetToUpdateApi(getState().common.domain, id).then((res) => {
        dispatch(setLoader(false));
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }

        dispatch(setSnippetToUpdate(res));
    });
};

export const updateShareSnippet = (id, payload) => (dispatch, getState) => {
    dispatch(setLoader(true));
    return updateShareSnippetApi(getState().common.domain, id, payload).then(
        (res) => {
            dispatch(setLoader(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return showError(res);
            }
            successSnackBar("Update Successful");

            dispatch(
                storeSnippets({
                    results: [
                        ...getState().individualcall?.snippets?.results?.map(
                            (snippet) =>
                                snippet.id !== id
                                    ? snippet
                                    : { ...res, owner: snippet.owner }
                        ),
                    ],
                })
            );
            dispatch(setSnippetToUpdate(res));
        }
    );
};
