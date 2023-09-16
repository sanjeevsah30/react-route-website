import React, { useEffect, useState } from "react";
import { storeIndividualCalls } from "@store/individualcall/actions";
import { useDispatch, useSelector } from "react-redux";
import { storeSearchCalls } from "../../../../store/search/actions";
import IndividualCallConfig from "@constants/IndividualCall/index";
import { getCallById } from "@store/calls/actions";
import callsConfig from "@constants/MyCalls/index";
import {
    setMeetingAiScore,
    setMeetingAuditTemplate,
    setMeetingManualScore,
} from "@store/auditSlice/auditSlice";
import { getMeetingAiScoreStatus } from "../../../../store/auditSlice/auditSlice";

export default function useHandleActiveCall({ id }) {
    const dispatch = useDispatch();
    const [hasError, sethasError] = useState(false);
    const individualcall = useSelector((state) => state.individualcall);
    const [activeCall, setActiveCall] = useState({});
    const [isLoadingCall, setIsLaodingCall] = useState(true);
    const setCall = ({
        callId = 0,
        callName = "",
        callType = "",
        callDetails = {},
        searchKeyWords = [],
        activeTab = IndividualCallConfig.TABS.overview.value,
        callActiveSpeaker = "",
        callActiveTopic = "",
    }) => {
        setActiveCall({
            ...activeCall,
            id: callId,
            callId,
            callName,
            callType,
            callDetails,
            searchKeyWords,
            activeTab,
            callActiveSpeaker,
            callActiveTopic,
        });
    };

    useEffect(() => {
        if (typeof +id !== "number") return;
        if (activeCall.id === +id) {
            setIsLaodingCall(false);
            return;
        }
        if (id) {
            setIsLaodingCall(true);
            dispatch(getCallById(id)).then((res) => {
                if (!res.status) {
                    setCall({
                        callId: res.id,
                        callName: res.title,
                        callType: callsConfig.COMPLETED_TYPE,
                        callDetails: res,
                    });
                    dispatch(storeSearchCalls([res]));
                    if (res?.template) {
                        dispatch(setMeetingAuditTemplate(res.template));
                    }
                    if (res?.ai_score) {
                        dispatch(
                            setMeetingAiScore({
                                status: res.stats.ai_score !== null,
                                scores: {
                                    ...res?.ai_score,
                                },
                            })
                        );
                        if (res.template)
                            dispatch(
                                getMeetingAiScoreStatus({
                                    id: res.id,
                                    payload: {
                                        template_id: res.template.id,
                                    },
                                })
                            );
                    }
                    if (res?.manual_score) {
                        dispatch(
                            setMeetingManualScore({
                                acknowledged: res?.acknowledged,
                                scores: res?.manual_score,
                                auditor: res?.stats?.auditor,
                                status: res?.stats?.auditor ? true : false,
                                audit_time: res?.stats?.audit_time || null,
                            })
                        );
                    }

                    if (Array.isArray(res.speaker_stats)) {
                        const speaker_stats = {};
                        for (let i = 0; i < res.speaker_stats?.length; i++) {
                            if (res.speaker_stats[i].owner)
                                speaker_stats[res.speaker_stats[i].owner] =
                                    res.speaker_stats[i];
                            if (res.speaker_stats[i].client)
                                speaker_stats[res.speaker_stats[i].client] =
                                    res.speaker_stats[i];
                        }
                        const existingCalls = {
                            ...individualcall,
                        };
                        if (existingCalls[id]) {
                            existingCalls[id] = {
                                ...existingCalls[id],
                                speaker_stats,
                            };
                        } else
                            existingCalls[id] = {
                                speaker_stats,
                                questions: {},
                                importantMoments: {},
                                callTopics: [],
                                actionItems: {},
                                transcripts: [],
                                renderedTranscript: [],
                                monologues: {},
                                monologueTopics: [],
                                transcript_speaker_ids: {},
                                original_transcripts: [],
                            };

                        dispatch(storeIndividualCalls(existingCalls));
                    }
                } else {
                    sethasError(true);
                }
                setIsLaodingCall(false);
            });
        } else {
            setIsLaodingCall(false);
        }
    }, [id]);

    const updateCall = (rest) => {
        setActiveCall({
            ...activeCall,
            callDetails: {
                ...activeCall.callDetails,
                ...rest,
            },
        });
    };

    return { activeCall, hasError, updateCall, setCall, isLoadingCall };
}
