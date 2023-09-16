import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCallById } from "@store/calls/actions";
import { withRouter, Link } from "react-router-dom";
import callsConfig from "@constants/MyCalls/index";
import { FallbackUI } from "@presentational/reusables/index";
import { Result, Button } from "antd";
import routes from "@constants/Routes/index";
import { compose } from "redux";
import withErrorCollector from "hoc/withErrorCollector";
import { storeIndividualCalls } from "@store/individualcall/actions";
import { storeSearchCalls } from "@store/search/actions";

import {
    setMeetingAiScore,
    setMeetingAuditTemplate,
    setMeetingManualScore,
} from "@store/auditSlice/auditSlice";

const CallDetailsPage = (props) => {
    const dispatch = useDispatch();
    const [hasError, sethasError] = useState(false);
    const individualcall = useSelector((state) => state.individualcall);

    useEffect(() => {
        // let query = props.location.search.substring(1);
        document.querySelector("body").classList.add("my-calls");
        let call_id = new URLSearchParams(props.location.search).get("id");
        if (!call_id) {
            call_id = new URLSearchParams(props.location.search).get("call_id");
        }

        if (call_id) {
            dispatch(getCallById(call_id)).then((res) => {
                if (!res.status) {
                    props.setCall(
                        res.id,
                        res.title,
                        callsConfig.COMPLETED_TYPE,
                        res
                    );
                    dispatch(storeSearchCalls([res]));
                    props.setOverviewFromRoute(true);
                    if (res?.template) {
                        dispatch(setMeetingAuditTemplate(res.template));
                    }
                    if (res?.ai_score) {
                        dispatch(setMeetingAiScore({ scores: res?.ai_score }));
                    }
                    if (res?.manual_score) {
                        dispatch(
                            setMeetingManualScore({
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
                        if (existingCalls[call_id]) {
                            existingCalls[call_id] = {
                                ...existingCalls[call_id],
                                speaker_stats,
                            };
                        } else
                            existingCalls[call_id] = {
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
            });
        }

        return () => {
            document.querySelector("body").classList.remove("my-calls");
        };
    }, []);

    return (
        <>
            {hasError ? (
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the meeting you were looking for does not exist."
                    extra={
                        <Link to={routes.HOME}>
                            {" "}
                            <Button type="primary">Back Home</Button>
                        </Link>
                    }
                />
            ) : (
                <></>
            )}
        </>
    );
};

export default compose(withRouter, withErrorCollector)(CallDetailsPage);
