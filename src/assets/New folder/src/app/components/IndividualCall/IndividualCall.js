import IndividualCallConfig from "@constants/IndividualCall/index";
import Spinner from "@presentational/reusables/Spinner";
import { getAllUsers, openNotification } from "@store/common/actions";
import {
    createCallMediaComments,
    createCallComments,
    deleteCallComment,
    fetchCallCommentReply,
    fetchCallComments,
    getLeadScoreInsights,
    getTranscript,
    initializeIndividualCall,
    setCallCommentToReply,
    updateCallComments,
} from "@store/individualcall/actions";
import {
    getDurationInSeconds,
    getPercentage,
    scrollElementInNoShaka,
    scrollElementInView,
    timeToSeconds,
} from "@tools/helpers";
import React, {
    createContext,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router";
import withErrorCollector from "hoc/withErrorCollector";
import ShakaPlayer from "../ShakaPlayer/ShakaPlayer";
import { getCallHandlers } from "./IndividualCallHandlers";

import "./styles.scss";
import FallbackUI from "@presentational/reusables/FallbackUI";
import { Button, Input, Modal, Tooltip, Checkbox, message } from "antd";
import CallName from "../MyMeetings/CallName";
import CallTabBar from "./CallTabBar";
import Sharer from "@container/Sharer/Sharer";
import AddToLibrary from "../AddToLibrary/AddToLibrary";
import apiErrors from "@apis/common/errors";
import CallAudit from "./CallAudit";
import CallStatistics from "./CallStatistics";
import { resetCallAudit } from "@store/call_audit/actions";
import {
    acknowledgeRaiseDisputeApi,
    handleDownloadTranscript,
} from "@apis/individual/index";
import DownloadIcon from "app/static/svg/DownloadIcon";
import LeadScoreInsights from "./LeadScoreInsights";
import CommentsTab from "app/components/Compound Components/Comments/CommentsTab";
import MoreOptions from "./MoreOptions";
import AiSiderTab from "../Compound Components/AI Audit Sider/AiSiderTab";
import SnippetsContainer from "./Snippets/SnippetsContainer";
import { fetchAccountGraph } from "@store/accounts/actions";
import {
    LeftArrowSvg,
    ChevronDownSvg,
    ChevronUpSvg,
    CloseSvg,
} from "app/static/svg/indexSvg";

import GraphCarouselTab from "../Compound Components/Graph Carousel/GraphCarouselTab";
import TagTranscript from "./TagTranscripts";
import { getError } from "@apis/common/index";
import { useContext } from "react";
import { HomeContext } from "@container/Home/Home";
import { CallOverviewTopics } from "./CallOverview";
import { generateSentimentMoments, generateSentimentMonologue } from "./helper";
import {
    completeMeetingAudit,
    createMeetingScoreObjects,
    getMeetingAiScoreStatus,
    getMeetingAuditViolations,
    getMeetingManualScoreStatus,
    getMeetingTemplates,
    setMeetingAuditTemplate,
} from "@store/auditSlice/auditSlice";
import { useParams } from "react-router-dom";
import { ActiveCallContext } from "./ActiveCallView";
import routes from "@constants/Routes/index";
import CallNotes from "./CallNotes";
import ConversationDetails from "@convin/modules/conversationDetails/components/ConversationDetails";
import ConversationWordCloud from "../../../convin/modules/conversationDetails/components/ConversationWordCloud";

export const CallContext = createContext();

const { Search } = Input;
// Call Info UI Components
const CallOverview = React.lazy(() => import("./CallOverview"));
const CallDetails = React.lazy(() => import("./CallDetails"));
const CallTranscript = React.lazy(() => import("./CallTranscript"));
const ChatTranscript = React.lazy(() => import("./ChatTranscript"));
const CallSentenceCards = React.lazy(() => import("./CallSentenceCards"));
const MomentsSection = React.lazy(() => import("./MomentsSection"));
const CallTopics = React.lazy(() => import("./CallTopics"));
const Summary = React.lazy(() => import("./Summary"));

function IndividualCall() {
    const location = useLocation();
    const { id: callId } = useParams();
    const history = useHistory();
    const { activeCall, updateCall } = useContext(ActiveCallContext);
    const allCallTypes = useSelector((state) => state.common.call_types || []);
    const [chat, setChat] = useState(false);
    const {
        common: { versionData },
        callAudit: { categories },
    } = useSelector((state) => state);
    const playerRef = useRef(null);
    // const [activeTab, setactiveTab] = useState(activeCall.activeTab);
    const [showComments, setshowComments] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");
    const [callDetails, setcallDetails] = useState({});
    const [showAddToLib, setshowAddToLib] = useState(false);

    // // Video and Audio Player vars.
    const [mediaUri, setMediaUri] = useState("");
    // const [mediaDuration, setMediaDuration] = useState(0);
    const [playedDuration, setPlayedDuration] = useState(0);
    // Comment Vars
    const [comments, setcomments] = useState([]);
    const [activeComment, setactiveComment] = useState(0);
    const [commentToAdd, setcommentToAdd] = useState({
        comment: "",
        transcript: null,
    });
    const [commentMentions, setCommentMentions] = useState([]);

    ///
    const [call_types, setcall_type] = useState(
        activeCall.callDetails.call_types
    );
    const [call_type_loading, setcall_type_loading] = useState(false);
    const [call_type_error, setcall_type_error] = useState(false);
    ///
    const [commentReply, setcommentReply] = useState({
        replying: false,
        reply: "",
        commentIndex: -1,
    });
    const [showUserOptions, setshowUserOptions] = useState(false);
    const [callerOverview, setcallerOverview] = useState({});
    const [receiverOverview, setreceiverOverview] = useState({});

    // Other vars.
    const activeCallType = activeCall.callType;
    const dispatch = useDispatch();
    const domain = useSelector((state) => state.common.domain);
    const user = useSelector((state) => state.auth);
    const allUsers = useSelector((state) => state.common.users);
    const [users, setusers] = useState();
    const [showShare, setShowShare] = useState(false);
    const [autoScrollTranscripts, setAutoScrollTranscripts] = useState(true);
    const [playerPreviousPlaying, setPlayerPreviousPlaying] = useState(false);

    // New Handlers: START
    const [activeLeftTab, setActiveLeftTab] = useState(
        IndividualCallConfig.LEFT_TABS.overview.value
    );
    const [activeRightTab, setActiveRightTab] = useState(
        IndividualCallConfig.RIGHT_TABS.stats.value
    );
    const transcriptRef = useRef(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [showAuditDrawer, setShowAuditDrawer] = useState(false);
    const [showLeadScoreSider, setShowLeadScoreSider] = useState(false);
    const [showAiAuditInfo, setShowAiAuditInfo] = useState(false);
    const [showCallStatistics, setShowCallStatistics] = useState(true);
    const [showUpdateShareModal, setShowUpdateShareModal] = useState(false);
    // New Handlers: END

    // ##########################
    // Transcript States
    const [isEditingTranscript, setisEditingTranscript] = useState(false);
    const [editedTranscript, seteditedTranscript] = useState([]);
    const [acknowledgeUrl, setAcknowledgeUrl] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSpeaker, setActiveSpeaker] = useState(
        activeCall.callActiveSpeaker
    );
    const [activeTopic, setActiveTopic] = useState(
        activeCall.callActiveTopic || ""
    );

    const questions = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].questions
            : {}
    );
    const importantMoments = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].importantMoments
            : {}
    );
    const callTopics = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].callTopics
            : []
    );
    const monologueTopics = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].monologueTopics
            : {}
    );
    const actionItems = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].actionItems
            : {}
    );
    const transcripts = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].transcripts
            : []
    );
    const renderedTranscript = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].renderedTranscript
            : []
    );

    const original_transcripts = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].original_transcripts
            : []
    );
    const monologues = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].monologues
            : {}
    );

    const words = useSelector((state) =>
        state.individualcall[callId] ? state.individualcall[callId].words : []
    );

    const { callComments } = useSelector((state) => state.individualcall);

    const [showTagTranscripts, setShowTagTranscripts] = useState(false);
    const [selectedTagTranscripts, setSelectedTagTranscripts] = useState([]);
    const [scoreToTag, setScoreToTag] = useState(undefined);

    useEffect(() => {
        if (callId) {
            // dispatch(listMeetingScores(callId));
            // dispatch(
            //     getMeetingAiScoreStatus({
            //         id: callId,
            //         payload: {},
            //     })
            // );
            dispatch(getMeetingTemplates(callId));
            dispatch(getMeetingAuditViolations());
        }
    }, [callId]);

    useEffect(() => {
        dispatch(setMeetingAuditTemplate(callDetails?.template));
    }, [callDetails]);

    useEffect(() => {
        dispatch(initializeIndividualCall(callId));

        setcallDetails(
            activeCall.callDetails &&
                Object.keys(activeCall.callDetails).length > 0
                ? activeCall.callDetails
                : {}
        );
        dispatch(getTranscript(activeCall.callDetails.id)).then(() => {
            setIsLoading(false);
        });
        playerHandlers.getPlayerMedia();
        if (!allUsers.length) {
            dispatch(getAllUsers());
        }
        // Making an API Call to get the comments on the Call.
        // commentHandlers.getComments();
        dispatch(fetchCallComments(callId));

        return () => {
            dispatch(resetCallAudit());
        };
    }, []);

    useEffect(() => {
        // Make an API Call to get the Caller Overview.
        setcallerOverview({
            recpName: callDetails.owner && callDetails.owner.first_name,
            totalLength: getDurationInSeconds(
                callDetails.start_time,
                callDetails.end_time
            ),
            mainLabel: `${
                callDetails.stats && callDetails.stats.owner_question_count
            } Questions`,
            talkratio: `${
                callDetails.stats &&
                (callDetails.stats.owner_talk_ratio * 100).toFixed(2)
            } %`,
        });

        // Make an API Call to get the Receiver Overview.
        setreceiverOverview({
            recpName:
                callDetails.client &&
                (callDetails.client.first_name || callDetails.client.email),
            totalLength: getDurationInSeconds(
                callDetails.start_time,
                callDetails.end_time
            ),
            mainLabel: `${
                callDetails.stats && callDetails.stats.client_question_count
            } Questions`,
            talkratio: `${
                callDetails.stats &&
                (callDetails.stats.client_talk_ratio * 100).toFixed(2)
            } %`,
        });
    }, [callDetails]);

    const handleShowAddToLib = () => {
        setshowAddToLib((show) => !show);
    };

    useEffect(() => {
        const search = location.search;
        const urlSearchParamsObj = new URLSearchParams(search);

        const tab = urlSearchParamsObj.get("tab");

        if (tab === "comments" && !isLoading) {
            setShowCallStatistics(false);
            return setshowComments(true);
        }
        if (Object.keys(IndividualCallConfig.LEFT_TABS).indexOf(tab) !== -1) {
            setActiveLeftTab(tab);
        } else if (
            Object.keys(IndividualCallConfig.RIGHT_TABS).indexOf(tab) !== -1
        ) {
            setActiveRightTab(tab);
        }
        let keyword = urlSearchParamsObj.get("keyword");
        if (keyword) {
            setSearchKeyword(keyword);
        }
    }, [location, isLoading]);

    const {
        tabHandlers,
        playerHandlers,
        miscPageHandlers,
        overviewHandlers,
        transcriptHandlers,
    } = getCallHandlers({
        setActiveLeftTab,
        setActiveRightTab,
        setActiveSpeaker,
        setshowComments,
        showComments,
        domain,
        activeCall,
        setMediaUri,
        playerRef,
        playedDuration,
        setPlayedDuration,
        callId,
        setcall_type,
        activeCallType,
        commentToAdd,
        commentMentions,
        setcomments,
        seterrorMessage,
        setcommentToAdd,
        setCommentMentions,
        setcommentReply,
        commentReply,
        setactiveComment,
        setActiveTopic,
        IndividualCallConfig,
        seteditedTranscript,
        setisEditingTranscript,
        transcripts,
        editedTranscript,
        dispatch,
        playerPreviousPlaying,
        setPlayerPreviousPlaying,
        setcall_type_loading,
        setcall_type_error,
        call_types,
        setShowAuditDrawer,
        setShowAiAuditInfo,
        setShowLeadScoreSider,
        setShowCallStatistics,
    });

    const items = (activeTab) => {
        return activeTab === IndividualCallConfig.RIGHT_TABS.questions.value
            ? questions
            : activeTab === IndividualCallConfig.RIGHT_TABS.actions.value
            ? actionItems
            : importantMoments;
    };

    useEffect(() => {
        if (playerRef?.current?.paused) {
            setAutoScrollTranscripts(true);
        }
    }, [playerRef?.current?.paused]);

    const playSnippet = (snippets) => {
        if (snippets.length) {
            setActiveLeftTab(IndividualCallConfig.LEFT_TABS.transcript.value);
            playerHandlers.seekToPoint(snippets[0].start_time, true);
        }
    };

    const seekToPoint = (start_time) => {
        setActiveLeftTab(IndividualCallConfig.LEFT_TABS.transcript.value);
        setAutoScrollTranscripts(true);
        playerHandlers.seekToPoint(start_time, true);
    };

    const speaker_stats = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].speaker_stats
            : {}
    );

    const transcript_speaker_ids = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].transcript_speaker_ids
            : {}
    );

    const leadScoreInsights = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].leadScoreInsights
            : []
    );

    const {
        ai_score,
        manual_score,
        audit_template,
        score_objects,
        meeting_templates,
        loading,
    } = useSelector((state) => state.auditSlice);

    const { showLoader } = useSelector((state) => state.common);

    const { auth } = useSelector((state) => state);
    const { role } = auth;

    const { is_Auditor } = useContext(HomeContext);

    const closeAuditDrawer = () => {
        if (!is_Auditor(role?.code_names)) {
            setShowAuditDrawer(false);
            setShowCallStatistics(true);
            return;
        }
        if (manual_score?.data?.status) {
            setShowAuditDrawer(false);
            setShowCallStatistics(true);
            return;
        }

        dispatch(
            completeMeetingAudit({
                id: callId,
                submit: false,
                payload: {
                    template_id: audit_template?.id,
                },
            })
        ).then(({ payload }) => {
            if (payload.status === apiErrors.AXIOSERRORSTATUS) return;
            if (payload.status) {
                setShowAuditDrawer(false);
                setShowCallStatistics(true);
            } else {
                if (
                    window.confirm(
                        "Audit is incomplete. Are you sure you want to close the audit"
                    )
                ) {
                    setShowAuditDrawer(false);
                    setShowCallStatistics(true);
                }
            }
        });
    };

    useEffect(() => {
        if (showLeadScoreSider) {
            dispatch(getLeadScoreInsights(callId));
        }
    }, [showLeadScoreSider]);

    useEffect(() => {
        const url = new URLSearchParams(document.location.search);
        setAcknowledgeUrl(!url.get("acknowledge"));

        if (
            callDetails?.owner?.id === user.id &&
            url.get("acknowledge") &&
            url.get("ack_template_id")
        ) {
            handleAcknowledge(
                {
                    status: "acknowledge",
                    template_id: +url.get("ack_template_id"),
                },
                "Thank you for Acknowledging"
            );
        }
    }, [callDetails?.owner?.id]);

    useEffect(() => {
        const url = new URLSearchParams(document.location.search);
        const ack_template_id = +url.get("ack_template_id");
        if (meeting_templates?.data?.length && ack_template_id) {
            const temp = meeting_templates?.data?.find(
                ({ template: { id } }) => ack_template_id === id
            );
            dispatch(setMeetingAuditTemplate(temp?.template));
            const params = {
                id: callId,
                payload: { template_id: ack_template_id },
            };

            dispatch(getMeetingAiScoreStatus(params));
            dispatch(getMeetingManualScoreStatus(params)).then((res) => {
                dispatch(
                    createMeetingScoreObjects({
                        id: callId,
                        template_id: ack_template_id,
                    })
                );
            });
        }
    }, [meeting_templates]);

    const saveComment = ({ id, payload }) => {
        if (callComments?.activeComment?.comment?.id) {
            payload.parent = callComments.activeComment.comment.id;
        }
        if (callId && !id) {
            dispatch(
                createCallComments(callId, {
                    ...payload,
                    mentioned_users: payload.mentioned_users.map(
                        ({ id }) => +id
                    ),
                })
            ).then((res) => {
                setcommentToAdd({
                    comment: "",
                    transcript: null,
                });
            });
        }

        if (id) {
            dispatch(updateCallComments(id, payload));
        }
    };

    const addMediaComment = (payload) => {
        if (callComments?.activeComment?.comment?.id) {
            payload.append("parent", callComments.activeComment.comment.id);
        }
        if (callId) {
            dispatch(createCallMediaComments(callId, payload)).then((res) => {
                setcommentToAdd({
                    comment: "",
                    transcript: null,
                });
            });
        }
    };

    const deleteComment = ({ id, payload }) => {
        dispatch(deleteCallComment(id, payload));
    };

    const loadMoreComments = () => {
        dispatch(fetchCallComments(callId, callComments.comments.next));
    };

    const setCommentToReply = (comment) => {
        dispatch(
            setCallCommentToReply({
                comment,
            })
        );
        dispatch(fetchCallCommentReply(comment.id));
        setcommentToAdd({
            comment: "",
            transcript: null,
        });
    };

    const removeReplyBlock = () => {
        dispatch(fetchCallComments(callId));
        dispatch(setCallCommentToReply({ comment: null, replies: null }));
    };

    const loadMoreReplies = () => {
        const {
            comment: { id: acitveCommentId },
            replies: { next: nextReplies },
        } = callComments.activeComment;
        dispatch(fetchCallCommentReply(acitveCommentId, nextReplies));
    };

    const handleTimeStampClick = (e) => {
        e.stopPropagation();
        if (e && e.target.closest("a") && e.target.closest("a").dataset.time) {
            seekToPoint(
                timeToSeconds(e.target.closest("a").dataset.time),
                true
            );
        }
    };

    const leftContentRef = useRef(null);
    const leftTabBarRef = useRef(null);
    useEffect(() => {
        const handleTabBar = () => {
            const tabY = leftTabBarRef.current?.getBoundingClientRect()?.y;
            if (tabY <= 200) {
                document
                    .querySelector(".main_player")
                    .classList.add("miniPlayer");
            } else {
                document
                    .querySelector(".main_player")
                    .classList.remove("miniPlayer");
            }
        };
        leftContentRef.current &&
            leftContentRef.current.addEventListener("scroll", handleTabBar);
        return () => {
            leftContentRef.current &&
                leftContentRef.current.removeEventListener(
                    "scroll",
                    handleTabBar
                );
        };
    }, []);

    const hasCalledCreateSocreObjectOnce = useRef(false);

    const toggleAudit = (call_api = true) => {
        setShowAuditDrawer((t) => !t);
        setshowComments(false);
        setShowLeadScoreSider(false);
        setShowAiAuditInfo(false);
        if (showComments) return;
        setShowCallStatistics((prev) => !prev);
        if (!call_api) return;
        if (audit_template?.id)
            if (!manual_score?.data?.status && is_Auditor(auth.role.code_names))
                dispatch(
                    createMeetingScoreObjects({
                        id: callId,
                        template_id: audit_template?.id,
                    })
                ).then((res) => {
                    hasCalledCreateSocreObjectOnce.current = true;
                });
            else {
                dispatch(
                    createMeetingScoreObjects({
                        id: callId,
                        template_id: audit_template?.id,
                    })
                );
            }
    };

    const toggleLeadScore = () => {
        setShowLeadScoreSider((t) => !t);
        setshowComments(false);
        setShowAuditDrawer(false);

        setShowAiAuditInfo(false);
        setShowCallStatistics(false);
    };

    const toggleComment = () => {
        tabHandlers.toggleComments(chat);
        setShowAuditDrawer(false);
        setShowAiAuditInfo(false);
        setShowLeadScoreSider(false);
    };

    const {
        accounts: { graph, loaders },
    } = useSelector((state) => state);

    useEffect(() => {
        if (activeCall && activeCall?.callDetails?.sales_task?.id) {
            const id = activeCall?.callDetails?.sales_task?.id;
            id && dispatch(fetchAccountGraph(id));
        }
    }, [activeCall]);

    const [showAccTimeLine, setShowAccTimeLine] = useState(false);

    const { count } = useSelector(
        ({ individualcall }) => individualcall.snippets
    );

    const [momentFilterType, setMomentFilterType] = useState(null);
    const [shareDuration, setShareDuration] = useState(null);

    useEffect(() => {
        if (!showShare && shareDuration) {
            setShareDuration(null);
        }
    }, [showShare]);

    const [activeTemplate, setActiveTemplate] = useState({});
    const [activeCategories, setActiveCategories] = useState(categories);

    const [showDisputeModal, setShowDisputeModal] = useState(false);

    const [disputeDescription, setDisputeDescription] = useState("");
    const [acknowledging, setAcknowledging] = useState(false);
    const [auditStartTime, setAuditStartTime] = useState(null);
    const trackAuditedTime = useCallback(() => {
        if (auditStartTime) {
            return;
        }

        if (
            (manual_score?.data?.audit_time === null ||
                manual_score?.data?.audit_time === undefined) &&
            auditStartTime === null
        ) {
            setAuditStartTime(new Date().getTime());
        }
    }, [manual_score.data, auditStartTime]);

    const handleAcknowledge = (payload, msg) => {
        setAcknowledging(true);
        acknowledgeRaiseDisputeApi(domain, callId, payload)
            .then((res) => {
                setAcknowledging(false);
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    return openNotification("error", "Error", res.message);
                }
                if (payload.status === "acknowledge") {
                } else {
                    setShowDisputeModal(false);
                }
                message.success({
                    content: msg,
                    className: "toast-dark",
                });
            })
            .catch((err) => {
                setAcknowledging(false);
                openNotification("error", "Error", getError(err));
            });
    };

    useEffect(() => {
        const url = new URLSearchParams(document.location.search);
        if (
            url.get("dispute") === "true" &&
            activeCall?.callDetails?.owner?.id === user.id
        ) {
            setShowDisputeModal(true);
        }
    }, [showUserOptions]);

    useEffect(() => {
        if (
            callDetails?.meeting_type === "chat" ||
            callDetails?.meeting_type === "email"
        ) {
            setChat(true);
            setActiveLeftTab(IndividualCallConfig.LEFT_TABS.transcript.value);
        }
    }, [callDetails?.meeting_type]);

    const handleGoToChatClick = (timestamp) => {
        scrollElementInNoShaka(
            `[data-index="${timestamp}"]`,
            undefined,
            undefined,
            null,
            true,
            true
        );
        setActiveLeftTab(IndividualCallConfig.LEFT_TABS.transcript.value);
    };

    const { participants, title, start_time, end_time, agenda } = callDetails;

    console.log(agenda);
    return (
        <CallContext.Provider
            value={{
                callDetails,
                momentFilterType,
                setMomentFilterType,
                setShowShare,
                setShareDuration,
                callId,
                setSearchKeyword,
                setActiveLeftTab,
                transcriptRef,
                searchKeyword,
                showDisputeModal,
                setShowDisputeModal,
                showTagTranscripts,
                setShowTagTranscripts,
                selectedTagTranscripts,
                setSelectedTagTranscripts,
                scoreToTag,
                setScoreToTag,
                original_transcripts,
                handleAcknowledge,
                acknowledging,
                showUserOptions,
                seekToPoint,
                activeTemplate,
                setActiveTemplate,
                activeCategories,
                setActiveCategories,
                chat,
                handleGoToChatClick,
                playerRef,
                trackAuditedTime,
                auditStartTime,
                setAuditStartTime,
                updateCall,
            }}
        >
            <div className={"individualcall posRel"}>
                <Spinner loading={isLoading}>
                    <div className={"individualcall-container"}>
                        <div className="invdl__topbar">
                            <div className="invdl__topbar--left flex alignCenter">
                                <div
                                    className="marginR16 padding0 curPoint flex alignCenter"
                                    onClick={() => {
                                        history.push(routes.CALLS);
                                    }}
                                >
                                    <LeftArrowSvg />
                                </div>
                                <CallName
                                    title={activeCall["callName"]}
                                    callId={activeCall["callId"]}
                                />
                                {callDetails && (
                                    <ConversationDetails
                                        {...{
                                            participants,
                                            title,
                                            start_time,
                                            end_time,
                                            agenda,
                                        }}
                                    />
                                )}
                            </div>
                            {!!graph?.length && (
                                <button
                                    className={`timeline_btn  ${
                                        showAccTimeLine ? "active" : ""
                                    }`}
                                    onClick={() => {
                                        setShowAccTimeLine((prev) => !prev);
                                        if (!playerRef?.current?.paused) {
                                            setPlayerPreviousPlaying(true);
                                            playerRef?.current?.pause();
                                        } else {
                                            setPlayerPreviousPlaying(false);
                                        }
                                    }}
                                >
                                    <span className="marginR8">
                                        ACCOUNT TIMELINE
                                    </span>

                                    {!!showAccTimeLine ? (
                                        <ChevronUpSvg />
                                    ) : (
                                        <ChevronDownSvg />
                                    )}
                                </button>
                            )}

                            <div className="invdl__topbar--right">
                                <CallTabBar
                                    handleShowAddToLib={handleShowAddToLib}
                                    toggleComments={() => toggleComment(chat)}
                                    sharerHandler={() => setShowShare(true)}
                                    callId={callId}
                                    isProcessing={
                                        activeCall.callDetails.transcript ===
                                        null
                                    }
                                    toggleAudit={toggleAudit}
                                    showAuditDrawer={showAuditDrawer}
                                    {...callDetails}
                                    chat={chat}
                                />
                            </div>
                        </div>
                        <div className="flex flex1 overflowYauto posRel">
                            <div
                                className={`account_timeline_container  ${
                                    showAccTimeLine
                                        ? "timeline_show"
                                        : "timeline_hide"
                                }`}
                            >
                                <div className="paddingB15 graph_container">
                                    <GraphCarouselTab
                                        loading={loaders.graphLoader}
                                        graph={graph || []}
                                        graphContainer={null}
                                        headerStyle={{
                                            paddingLeft: "45px",
                                        }}
                                        isAccountsGraph={false}
                                        callId={callId}
                                        //holds account info
                                        sales_task={
                                            activeCall?.callDetails
                                                ?.sales_task || {}
                                        }
                                    />
                                </div>
                                <div
                                    className="flex1"
                                    style={{
                                        background: "#33333366",
                                    }}
                                    onClick={() => {
                                        setShowAccTimeLine((prev) => !prev);
                                    }}
                                ></div>
                            </div>
                            <div
                                className={`invdl__content paddingLR18  ${
                                    showComments ||
                                    showAuditDrawer ||
                                    showLeadScoreSider ||
                                    showAiAuditInfo
                                        ? "open_drawer"
                                        : ""
                                }`}
                            >
                                {}{" "}
                                <div
                                    className="invdl__content--left "
                                    ref={leftContentRef}
                                >
                                    {chat || (
                                        <ShakaPlayer
                                            videoRef={playerRef}
                                            onProgress={
                                                playerHandlers.onProgress
                                            }
                                            uri={mediaUri}
                                            callId={callDetails.id}
                                            subtitles={callDetails.subtitles}
                                            customClass={
                                                "main_player individual"
                                            }
                                            playOnLoad={
                                                new URLSearchParams(
                                                    location.search
                                                ).get("start_time")
                                                    ? true
                                                    : false
                                            }
                                            startTime={
                                                +new URLSearchParams(
                                                    location.search
                                                ).get("start_time")
                                            }
                                            showCompressToggle
                                            callName={
                                                activeCall.callDetails.title
                                            }
                                            showTagTranscripts={
                                                showTagTranscripts
                                            }
                                        />
                                    )}

                                    {chat || (
                                        <div className="invdl__content--blockSeparator flexShrink"></div>
                                    )}
                                    {showTagTranscripts ? (
                                        <>
                                            <div className="flex alignCenter justifySpaceBetween marginB10 paddingLR16">
                                                <div className="flexShrink flex alignCenter justifyCenter">
                                                    <span>
                                                        Click on the checkbox
                                                        <Checkbox
                                                            className="marginLR5 font16 mine_shaft_cl"
                                                            checked={true}
                                                        />{" "}
                                                        if you feel the snippet
                                                        relates to the question.
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    className="flex alignCneter justifyEnd"
                                                    onClick={() => {
                                                        transcriptRef.current.setTagedTrascriptsState();
                                                    }}
                                                >
                                                    <CloseSvg />
                                                </div>
                                            </div>
                                            {selectedTagTranscripts.length >
                                            0 ? (
                                                <div className="flexShrink flex alignCenter justifyCenter marginB10">
                                                    {`${selectedTagTranscripts.length} snippet selected`}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </>
                                    ) : (
                                        <div
                                            className="invdl__left--tabbar flexShrink"
                                            ref={leftTabBarRef}
                                        >
                                            <div
                                                className={`invdl__left--tabs`}
                                            >
                                                {Object.values(
                                                    IndividualCallConfig.LEFT_TABS
                                                ).map((tab, index) => {
                                                    return tab.title ===
                                                        "Overview" ? (
                                                        chat || (
                                                            <button
                                                                className={`accessibility indvl__tab ${
                                                                    tab.value ===
                                                                    activeLeftTab
                                                                        ? "active"
                                                                        : ""
                                                                }`}
                                                                key={tab.value}
                                                                onClick={() =>
                                                                    setActiveLeftTab(
                                                                        tab.value
                                                                    )
                                                                }
                                                            >
                                                                <span
                                                                    className={`indvl__tab--value`}
                                                                >
                                                                    {tab.title}
                                                                </span>
                                                            </button>
                                                        )
                                                    ) : tab.title ===
                                                          "Summary" &&
                                                      !callDetails
                                                          ?.meeting_summary
                                                          ?.length ? null : (
                                                        <button
                                                            className={`accessibility indvl__tab ${
                                                                tab.value ===
                                                                activeLeftTab
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            key={tab.value}
                                                            onClick={() =>
                                                                setActiveLeftTab(
                                                                    tab.value
                                                                )
                                                            }
                                                        >
                                                            <span
                                                                className={`indvl__tab--value`}
                                                            >
                                                                {tab.title}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex alignCenter">
                                                {
                                                    <MoreOptions
                                                        call={
                                                            activeCall.callDetails
                                                        }
                                                        activeCallType={
                                                            activeCallType
                                                        }
                                                        allCallTypes={
                                                            allCallTypes
                                                        }
                                                        showUserOptions={
                                                            showUserOptions
                                                        }
                                                        handleNewType={
                                                            miscPageHandlers.changeCallType
                                                        }
                                                        call_type_loading={
                                                            call_type_loading
                                                        }
                                                        call_type_error={
                                                            call_type_error
                                                        }
                                                        callId={callId}
                                                        updateCall={updateCall}
                                                    />
                                                }
                                                <Search
                                                    className="invdl__left--search"
                                                    value={searchKeyword}
                                                    allowClear
                                                    placeholder="Search in transcript"
                                                    onChange={(e) => {
                                                        setSearchKeyword(
                                                            e.target.value
                                                        );
                                                        setActiveLeftTab(
                                                            IndividualCallConfig
                                                                .LEFT_TABS
                                                                .transcript
                                                                .value
                                                        );
                                                        transcriptRef.current &&
                                                            transcriptRef.current.filterTranscriptsExp(
                                                                e.target.value
                                                            );
                                                    }}
                                                    onSearch={(val) => {
                                                        setActiveLeftTab(
                                                            IndividualCallConfig
                                                                .LEFT_TABS
                                                                .transcript
                                                                .value
                                                        );
                                                    }}
                                                />
                                                {!!transcripts?.length && (
                                                    <Tooltip
                                                        title={
                                                            "Download Transcript"
                                                        }
                                                    >
                                                        <Button
                                                            className="transcript__downloadBtn"
                                                            icon={
                                                                <DownloadIcon />
                                                            }
                                                            size={"medium"}
                                                            onClick={() =>
                                                                handleDownloadTranscript(
                                                                    domain,
                                                                    callId
                                                                )
                                                            }
                                                        />
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className="invdl__left--content flex1 overflowHidden marginB20"
                                        style={
                                            showTagTranscripts
                                                ? {
                                                      border: "1px solid #1a62f2",
                                                      borderRadius: "6px",
                                                  }
                                                : {}
                                        }
                                    >
                                        {showTagTranscripts ? (
                                            <TagTranscript
                                                {...transcriptHandlers}
                                                transcripts={
                                                    original_transcripts
                                                }
                                                seekToPoint={
                                                    playerHandlers.seekToPoint
                                                }
                                                keywords={
                                                    activeCall.searchKeyWords
                                                }
                                                isEditingTranscript={
                                                    isEditingTranscript
                                                }
                                                playedSeconds={playedDuration}
                                                isProcessing={
                                                    activeCall.callDetails
                                                        .transcript === null
                                                }
                                                getComment={
                                                    overviewHandlers.getComment
                                                }
                                                setcommentToAdd={
                                                    setcommentToAdd
                                                }
                                                handleAutoScroll={(status) =>
                                                    setAutoScrollTranscripts(
                                                        status
                                                    )
                                                }
                                                autoScrollEnabled={
                                                    autoScrollTranscripts
                                                }
                                                ref={transcriptRef}
                                                searchKeyword={searchKeyword}
                                                words={words ? words : 0}
                                                callId={callId}
                                                // getTagTranscriptCount={getTagTranscriptCount}
                                            />
                                        ) : (
                                            <Suspense fallback={<FallbackUI />}>
                                                {activeLeftTab ===
                                                    IndividualCallConfig
                                                        .LEFT_TABS.overview
                                                        .value && (
                                                    <CallOverview
                                                        callerOverview={
                                                            callerOverview
                                                        }
                                                        receiverOverview={
                                                            receiverOverview
                                                        }
                                                        getComment={
                                                            overviewHandlers.getComment
                                                        }
                                                        startAtPoint={
                                                            playerHandlers.seekToPoint
                                                        }
                                                        playedSeconds={
                                                            playedDuration
                                                        }
                                                        questions={questions}
                                                        actionItems={
                                                            actionItems
                                                        }
                                                        importantMoments={
                                                            importantMoments
                                                        }
                                                        callTopics={callTopics}
                                                        monologues={monologues}
                                                        setcommentToAdd={
                                                            setcommentToAdd
                                                        }
                                                        commentToAdd={
                                                            commentToAdd
                                                        }
                                                        handleTabChange={
                                                            tabHandlers.handleTabChange
                                                        }
                                                        isProcessing={
                                                            activeCall
                                                                .callDetails
                                                                .transcript ===
                                                            null
                                                        }
                                                        setActiveTopic={
                                                            overviewHandlers.handleTopicDotClick
                                                        }
                                                        speaker_stats={
                                                            speaker_stats
                                                        }
                                                        transcript_speaker_ids={
                                                            transcript_speaker_ids
                                                        }
                                                        topics={monologueTopics}
                                                        sentimentMonologues={generateSentimentMonologue(
                                                            callDetails?.stats
                                                                ?.sentiment_snippets
                                                        )}
                                                    />
                                                )}
                                                {activeLeftTab ===
                                                    IndividualCallConfig
                                                        .LEFT_TABS.transcript
                                                        .value &&
                                                    // Add the Raw Transcript Section here.
                                                    (!chat ? (
                                                        <CallTranscript
                                                            {...transcriptHandlers}
                                                            transcripts={
                                                                isEditingTranscript
                                                                    ? editedTranscript
                                                                    : renderedTranscript
                                                            }
                                                            seekToPoint={
                                                                playerHandlers.seekToPoint
                                                            }
                                                            keywords={
                                                                activeCall.searchKeyWords
                                                            }
                                                            isEditingTranscript={
                                                                isEditingTranscript
                                                            }
                                                            playedSeconds={
                                                                playedDuration
                                                            }
                                                            isProcessing={
                                                                activeCall
                                                                    .callDetails
                                                                    .transcript ===
                                                                null
                                                            }
                                                            getComment={
                                                                overviewHandlers.getComment
                                                            }
                                                            setcommentToAdd={
                                                                setcommentToAdd
                                                            }
                                                            handleAutoScroll={(
                                                                status
                                                            ) =>
                                                                setAutoScrollTranscripts(
                                                                    status
                                                                )
                                                            }
                                                            autoScrollEnabled={
                                                                autoScrollTranscripts
                                                            }
                                                            ref={transcriptRef}
                                                            searchKeyword={
                                                                searchKeyword
                                                            }
                                                            words={
                                                                words
                                                                    ? words
                                                                    : 0
                                                            }
                                                            callId={callId}
                                                        />
                                                    ) : (
                                                        <ChatTranscript
                                                            {...transcriptHandlers}
                                                            transcripts={
                                                                original_transcripts
                                                            }
                                                            seekToPoint={
                                                                playerHandlers.seekToPoint
                                                            }
                                                            keywords={
                                                                activeCall.searchKeyWords
                                                            }
                                                            isEditingTranscript={
                                                                isEditingTranscript
                                                            }
                                                            playedSeconds={
                                                                playedDuration
                                                            }
                                                            isProcessing={
                                                                activeCall
                                                                    .callDetails
                                                                    .transcript ===
                                                                null
                                                            }
                                                            getComment={
                                                                overviewHandlers.getComment
                                                            }
                                                            setcommentToAdd={
                                                                setcommentToAdd
                                                            }
                                                            handleAutoScroll={(
                                                                status
                                                            ) =>
                                                                setAutoScrollTranscripts(
                                                                    status
                                                                )
                                                            }
                                                            autoScrollEnabled={
                                                                autoScrollTranscripts
                                                            }
                                                            ref={transcriptRef}
                                                            searchKeyword={
                                                                searchKeyword
                                                            }
                                                            words={
                                                                words
                                                                    ? words
                                                                    : 0
                                                            }
                                                            callId={callId}
                                                        />
                                                    ))}

                                                {activeLeftTab ===
                                                    IndividualCallConfig
                                                        .LEFT_TABS.summary
                                                        .value && (
                                                    <Summary {...callDetails} />
                                                )}
                                                {activeLeftTab ===
                                                    IndividualCallConfig
                                                        .LEFT_TABS.worldcloud
                                                        .value &&
                                                    typeof callDetails?.word_cloud ===
                                                        "object" &&
                                                    !!Object.keys(
                                                        callDetails.word_cloud
                                                    )?.length && (
                                                        <ConversationWordCloud
                                                            word_cloud={
                                                                callDetails.word_cloud
                                                            }
                                                        />
                                                    )}
                                            </Suspense>
                                        )}
                                    </div>
                                    <Suspense fallback={<FallbackUI />}>
                                        {activeLeftTab ===
                                            IndividualCallConfig.LEFT_TABS
                                                .overview.value && (
                                            <CallOverviewTopics
                                                topics={monologueTopics}
                                                callTopics={callTopics}
                                                receiverOverview={
                                                    receiverOverview
                                                }
                                                startAtPoint={
                                                    playerHandlers.seekToPoint
                                                }
                                                playedSeconds={playedDuration}
                                            />
                                        )}
                                    </Suspense>
                                </div>
                                <div className="invdl__content--right">
                                    {showCallStatistics && (
                                        <div className="invdl__content--rightContent">
                                            <div className="invdl__right--tabbar">
                                                {Object.values(
                                                    IndividualCallConfig.RIGHT_TABS
                                                )
                                                    .filter((e) =>
                                                        chat
                                                            ? e?.value !==
                                                              "snippets"
                                                            : e?.value ===
                                                              "notes"
                                                            ? callDetails?.notes &&
                                                              !!Object.keys(
                                                                  callDetails?.notes
                                                              ).length
                                                            : true
                                                    )
                                                    .map((tab, index) => {
                                                        if (
                                                            versionData?.domain_type ===
                                                            "b2b"
                                                        ) {
                                                            return (
                                                                <button
                                                                    id={`invdl__rightTabBar${tab.value}`}
                                                                    className={`accessibility indvl__tab ${
                                                                        tab.value ===
                                                                        activeRightTab
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                    key={
                                                                        tab.value
                                                                    }
                                                                    onClick={() => {
                                                                        scrollElementInView(
                                                                            `#invdl__rightTabBar${tab.value}`
                                                                        );
                                                                        setActiveRightTab(
                                                                            tab.value
                                                                        );
                                                                    }}
                                                                >
                                                                    <span
                                                                        className={`indvl__tab--value`}
                                                                    >
                                                                        {
                                                                            tab.title
                                                                        }{" "}
                                                                        {tab.value !==
                                                                        "stats"
                                                                            ? activeRightTab ===
                                                                                  "snippets" &&
                                                                              tab.value ===
                                                                                  "snippets"
                                                                                ? `(${count})`
                                                                                : activeRightTab ===
                                                                                      "topics" &&
                                                                                  tab.value ===
                                                                                      "topics"
                                                                                ? `(${
                                                                                      Object.keys(
                                                                                          monologueTopics
                                                                                      )
                                                                                          ?.length
                                                                                  })`
                                                                                : activeRightTab ===
                                                                                      "notes" &&
                                                                                  tab.value ===
                                                                                      "notes"
                                                                                ? ""
                                                                                : activeRightTab ===
                                                                                      tab.value &&
                                                                                  items(
                                                                                      activeRightTab
                                                                                  )
                                                                                      ?.all
                                                                                      ?.data
                                                                                      ?.length >=
                                                                                      0
                                                                                ? `(${
                                                                                      items(
                                                                                          activeRightTab
                                                                                      )
                                                                                          ?.all
                                                                                          ?.data
                                                                                          ?.length
                                                                                  })`
                                                                                : ""
                                                                            : ""}
                                                                    </span>
                                                                </button>
                                                            );
                                                        }
                                                    })}
                                                {Object.values(
                                                    IndividualCallConfig.CENTRE_TABS
                                                )
                                                    .filter((e) =>
                                                        chat
                                                            ? e?.value !==
                                                              "snippets"
                                                            : e?.value ===
                                                              "notes"
                                                            ? callDetails?.notes &&
                                                              !!Object.keys(
                                                                  callDetails?.notes
                                                              ).length
                                                            : true
                                                    )
                                                    .map((tab, index) => {
                                                        if (
                                                            versionData?.domain_type ===
                                                            "b2c"
                                                        ) {
                                                            return (
                                                                tab.title ===
                                                                    "Topics" &&
                                                                Object.keys(
                                                                    monologueTopics
                                                                )
                                                            )?.length ||
                                                                tab.title !==
                                                                    "topics" ? (
                                                                <button
                                                                    id={`invdl__rightTabBar${tab.value}`}
                                                                    className={`accessibility indvl__tab ${
                                                                        tab.value ===
                                                                        activeRightTab
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                    key={
                                                                        tab.value
                                                                    }
                                                                    onClick={() => {
                                                                        scrollElementInView(
                                                                            `#invdl__rightTabBar${tab.value}`
                                                                        );
                                                                        setActiveRightTab(
                                                                            tab.value
                                                                        );
                                                                    }}
                                                                >
                                                                    <span
                                                                        className={`indvl__tab--value`}
                                                                    >
                                                                        {
                                                                            tab.title
                                                                        }{" "}
                                                                        {tab.value !==
                                                                            "stats" &&
                                                                        tab.value !==
                                                                            "notes" &&
                                                                        tab.value !==
                                                                            "moments"
                                                                            ? activeRightTab ===
                                                                                  "snippets" &&
                                                                              tab.value ===
                                                                                  "snippets"
                                                                                ? `(${count})`
                                                                                : activeRightTab ===
                                                                                      "topics" &&
                                                                                  tab.value ===
                                                                                      "topics"
                                                                                ? `(${
                                                                                      Object.keys(
                                                                                          monologueTopics
                                                                                      )
                                                                                          ?.length
                                                                                  })`
                                                                                : activeRightTab ===
                                                                                      tab.value &&
                                                                                  items(
                                                                                      activeRightTab
                                                                                  )
                                                                                      ?.all
                                                                                      ?.data
                                                                                      ?.length >=
                                                                                      0
                                                                                ? `(${
                                                                                      items(
                                                                                          activeRightTab
                                                                                      )
                                                                                          ?.all
                                                                                          ?.data
                                                                                          ?.length
                                                                                  })`
                                                                                : ""
                                                                            : ""}
                                                                    </span>
                                                                </button>
                                                            ) : (
                                                                <></>
                                                            );
                                                        }
                                                    })}
                                            </div>
                                            <div className="invdl__right--content">
                                                <Suspense
                                                    fallback={<FallbackUI />}
                                                >
                                                    {activeRightTab ===
                                                        IndividualCallConfig
                                                            .RIGHT_TABS.stats
                                                            .value && (
                                                        <CallStatistics
                                                            {...callDetails.stats}
                                                            isProcessing={
                                                                activeCall
                                                                    .callDetails
                                                                    .transcript ===
                                                                null
                                                            }
                                                            callId={callId}
                                                            toggleAudit={
                                                                toggleAudit
                                                            }
                                                            showAuditDrawer={
                                                                showAuditDrawer
                                                            }
                                                            playSnippet={
                                                                playSnippet
                                                            }
                                                            toggleLeadScore={
                                                                toggleLeadScore
                                                            }
                                                            sentiment={{
                                                                positive:
                                                                    callDetails
                                                                        ?.stats
                                                                        ?.sentiment_snippets
                                                                        ?.positive
                                                                        ?.length,
                                                                negative:
                                                                    callDetails
                                                                        ?.stats
                                                                        ?.sentiment_snippets
                                                                        ?.negative
                                                                        ?.length,
                                                                neutral: 0,
                                                            }}
                                                            setActiveRightTab={
                                                                setActiveRightTab
                                                            }
                                                            word_cloud={
                                                                callDetails?.word_cloud
                                                            }
                                                            {...callDetails}
                                                            chat={chat}
                                                            sentiment_snippets={
                                                                callDetails
                                                                    ?.stats
                                                                    ?.sentiment_snippets
                                                            }
                                                            overall_sentiment={
                                                                callDetails
                                                                    ?.stats
                                                                    ?.sentiment
                                                            }
                                                            lead_analysis={
                                                                callDetails.lead_analysis
                                                            }
                                                        />
                                                    )}

                                                    {activeRightTab ===
                                                        IndividualCallConfig
                                                            .RIGHT_TABS.notes
                                                            .value && (
                                                        <CallNotes
                                                            setActiveTopic={
                                                                setActiveTopic
                                                            }
                                                            {...callDetails}
                                                        />
                                                    )}
                                                    {activeRightTab ===
                                                        IndividualCallConfig
                                                            .RIGHT_TABS.topics
                                                            .value && (
                                                        <CallTopics
                                                            topics={
                                                                monologueTopics
                                                            }
                                                            isProcessing={
                                                                activeCall
                                                                    .callDetails
                                                                    .transcript ===
                                                                null
                                                            }
                                                            activeTopic={
                                                                activeTopic ||
                                                                Object.keys(
                                                                    monologueTopics
                                                                )?.[0]
                                                            }
                                                            seekToPoint={
                                                                playerHandlers.seekToPoint
                                                            }
                                                            setActiveTopic={
                                                                setActiveTopic
                                                            }
                                                        />
                                                    )}
                                                    {(activeRightTab ===
                                                        IndividualCallConfig
                                                            .RIGHT_TABS
                                                            .questions.value ||
                                                        activeRightTab ===
                                                            IndividualCallConfig
                                                                .RIGHT_TABS
                                                                .actions
                                                                .value) && (
                                                        <CallSentenceCards
                                                            items={items(
                                                                activeRightTab
                                                            )}
                                                            NotFoundIcon={
                                                                IndividualCallConfig
                                                                    .RIGHT_TABS[
                                                                    activeRightTab
                                                                ].notFoundIcon
                                                            }
                                                            notFoundText={
                                                                IndividualCallConfig
                                                                    .RIGHT_TABS[
                                                                    activeRightTab
                                                                ].notFoundText
                                                            }
                                                            activeTab={
                                                                activeRightTab
                                                            }
                                                            activeSpeaker={
                                                                activeSpeaker
                                                            }
                                                            seekToPoint={
                                                                playerHandlers.seekToPoint
                                                            }
                                                            isProcessing={
                                                                activeCall
                                                                    .callDetails
                                                                    .transcript ===
                                                                null
                                                            }
                                                        />
                                                    )}
                                                    {activeRightTab ===
                                                        IndividualCallConfig
                                                            .RIGHT_TABS.moments
                                                            .value && (
                                                        <MomentsSection
                                                            items={generateSentimentMoments(
                                                                callDetails
                                                                    ?.stats
                                                                    ?.sentiment_snippets
                                                            )}
                                                            NotFoundIcon={
                                                                IndividualCallConfig
                                                                    .RIGHT_TABS[
                                                                    activeRightTab
                                                                ].notFoundIcon
                                                            }
                                                            notFoundText={
                                                                IndividualCallConfig
                                                                    .RIGHT_TABS[
                                                                    activeRightTab
                                                                ].notFoundText
                                                            }
                                                            activeTab={
                                                                activeRightTab
                                                            }
                                                            activeSpeaker={
                                                                activeSpeaker
                                                            }
                                                            seekToPoint={
                                                                playerHandlers.seekToPoint
                                                            }
                                                            isProcessing={
                                                                activeCall
                                                                    .callDetails
                                                                    .transcript ===
                                                                null
                                                            }
                                                        />
                                                    )}
                                                    {activeRightTab ===
                                                        IndividualCallConfig
                                                            .RIGHT_TABS.snippets
                                                            .value && (
                                                        <SnippetsContainer
                                                            callId={callId}
                                                            setShowUpdateShareModal={
                                                                setShowUpdateShareModal
                                                            }
                                                            showUpdateShareModal={
                                                                showUpdateShareModal
                                                            }
                                                            seekToPoint={
                                                                seekToPoint
                                                            }
                                                        />
                                                    )}
                                                </Suspense>
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className={`invdl__drawer ${
                                            showComments ||
                                            showAuditDrawer ||
                                            showLeadScoreSider ||
                                            showAiAuditInfo
                                                ? "drawer_open"
                                                : ""
                                        }`}
                                    >
                                        <div className="drawer_container">
                                            <Suspense fallback={<FallbackUI />}>
                                                {showComments && (
                                                    <Spinner
                                                        loading={
                                                            callComments.loading
                                                        }
                                                    >
                                                        <CommentsTab
                                                            containerStyle={{
                                                                flex: "1",
                                                            }}
                                                            closeDrawer={() => {
                                                                tabHandlers.toggleComments();
                                                                setShowCallStatistics(
                                                                    true
                                                                );
                                                            }}
                                                            comments={
                                                                callComments
                                                                    ?.comments
                                                                    ?.results ||
                                                                []
                                                            }
                                                            totalComments={
                                                                callComments
                                                                    ?.comments
                                                                    ?.count || 0
                                                            }
                                                            createComment={
                                                                saveComment
                                                            }
                                                            loadMoreComments={
                                                                loadMoreComments
                                                            }
                                                            editComment={
                                                                saveComment
                                                            }
                                                            setCommentToReply={
                                                                setCommentToReply
                                                            }
                                                            activeComment={
                                                                callComments.activeComment
                                                            }
                                                            removeReplyBlock={
                                                                removeReplyBlock
                                                            }
                                                            saveReply={
                                                                saveComment
                                                            }
                                                            loadMoreReplies={
                                                                loadMoreReplies
                                                            }
                                                            deleteComment={
                                                                deleteComment
                                                            }
                                                            defaultComment={
                                                                commentToAdd.comment
                                                            }
                                                            transcript={
                                                                commentToAdd.transcript
                                                            }
                                                            handleTimeStampClick={
                                                                handleTimeStampClick
                                                            }
                                                            handleGoToChatClick={
                                                                handleGoToChatClick
                                                            }
                                                            addMediaComment={
                                                                addMediaComment
                                                            }
                                                        />
                                                    </Spinner>
                                                )}
                                                {showAuditDrawer && (
                                                    <Spinner
                                                        loading={
                                                            score_objects?.loading ||
                                                            ai_score.loading ||
                                                            loading ||
                                                            meeting_templates?.loading
                                                        }
                                                    >
                                                        <CallAudit
                                                            closeAuditDrawer={
                                                                closeAuditDrawer
                                                            }
                                                            callId={callId}
                                                            seekToPoint={
                                                                seekToPoint
                                                            }
                                                            toggleAudit={
                                                                toggleAudit
                                                            }
                                                            showAuditDrawer={
                                                                showAuditDrawer
                                                            }
                                                            auditor={
                                                                callDetails
                                                                    ?.stats
                                                                    ?.auditor
                                                            }
                                                            showAcknowledgeBtn={
                                                                manual_score
                                                                    ?.data
                                                                    ?.auditor &&
                                                                callDetails
                                                                    ?.owner
                                                                    ?.id ===
                                                                    user.id &&
                                                                acknowledgeUrl
                                                            }
                                                            {...callDetails}
                                                        />
                                                    </Spinner>
                                                )}
                                                {showLeadScoreSider && (
                                                    <Spinner
                                                        loading={showLoader}
                                                    >
                                                        <LeadScoreInsights
                                                            setShowLeadScoreSider={
                                                                setShowLeadScoreSider
                                                            }
                                                            leadScoreInsights={
                                                                leadScoreInsights
                                                            }
                                                            seekToPoint={
                                                                seekToPoint
                                                            }
                                                        />
                                                    </Spinner>
                                                )}
                                                {showAiAuditInfo && (
                                                    <Spinner
                                                        loading={showLoader}
                                                    >
                                                        <AiSiderTab
                                                            aiData={
                                                                ai_score?.data
                                                                    ?.scored ||
                                                                []
                                                            }
                                                            label={
                                                                " Call Score"
                                                            }
                                                            closeDrawer={() =>
                                                                setShowAiAuditInfo(
                                                                    false
                                                                )
                                                            }
                                                            ai_score={getPercentage(
                                                                ai_score?.data
                                                                    ?.scores
                                                                    ?.template_score,
                                                                ai_score?.data
                                                                    ?.scores
                                                                    ?.template_marks_audited
                                                            )}
                                                            seekToPoint={
                                                                seekToPoint
                                                            }
                                                            chat={chat}
                                                            handleGoToChatClick={
                                                                handleGoToChatClick
                                                            }
                                                        />
                                                    </Spinner>
                                                )}
                                            </Suspense>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Spinner>
                {showAddToLib && (
                    <AddToLibrary
                        monologues={monologues}
                        totalLength={callerOverview.totalLength}
                        activeCall={activeCall}
                        showAddToLib={showAddToLib}
                        mediaUri={mediaUri}
                        handleShowAddToLib={handleShowAddToLib}
                        callName={activeCall["callName"]}
                    />
                )}
                {(showShare || showUpdateShareModal) && (
                    <Sharer
                        domain={domain}
                        config={{
                            id: callId,
                            visible: true,
                            shareDuration,
                        }}
                        sharerHandler={() => setShowShare(false)}
                        totalLength={callerOverview.totalLength}
                        monologues={monologues}
                        callName={activeCall["callName"]}
                        setShowUpdateShareModal={setShowUpdateShareModal}
                    />
                )}

                <Modal
                    title="Raise Dispute"
                    visible={showDisputeModal}
                    footer={[
                        <Button
                            key="raise_dispute_submit_btn"
                            onClick={() => {
                                handleAcknowledge(
                                    {
                                        status: "dispute",
                                        note: disputeDescription,
                                        template_id: audit_template?.id,
                                    },
                                    "Dispute raised successfully"
                                );
                            }}
                            type="primary"
                            loading={acknowledging}
                        >
                            Submit
                        </Button>,
                    ]}
                    onCancel={() => setShowDisputeModal(false)}
                    maskClosable={true}
                    keyboard={true}
                    width={600}
                >
                    <div className="bold paddingL16 font16">
                        <div>
                            Please comment the issue to rasie dispute against
                            the audit by{" "}
                            <span className="primary_cl">
                                {callDetails?.stats?.auditor?.first_name +
                                    callDetails?.stats?.auditor?.last_name}
                            </span>
                            .
                        </div>
                        <Input.TextArea
                            placeholder="Write a brief description"
                            className="marginT16 dispute_note"
                            autoSize={{ minRows: 6, maxRows: 8 }}
                            value={disputeDescription}
                            onChange={(e) => {
                                setDisputeDescription(e.target.value);
                            }}
                        />
                    </div>
                </Modal>
            </div>
        </CallContext.Provider>
    );
}

export default withErrorCollector(IndividualCall);
