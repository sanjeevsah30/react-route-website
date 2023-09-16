import {
    getCompletedComments,
    addCompletedComments,
    changeCompletedCallType,
} from "@apis/calls";
import { getCallMedia } from "@apis/individual";
import apiErrors from "@apis/common/errors";
import { updateCallTranscript } from "@store/individualcall/actions";
import { secondsToTime } from "@tools/helpers";
import IndividualCallConfig from "@constants/IndividualCall/index";

export function getCallHandlers({
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
    seteditedTranscript,
    setisEditingTranscript,
    transcripts,
    editedTranscript,
    dispatch,
    addFeedback,
    setactiveNote,
    activeNote,
    setnewNote,
    allNotes,
    getUserFeedbacks,
    setfeedbackBy,
    playerPreviousPlaying,
    setPlayerPreviousPlaying,
    setcall_type_loading,
    setcall_type_error,
    setShowAuditDrawer,
    setShowAiAuditInfo,
    setShowLeadScoreSider,
    setShowCallStatistics,
}) {
    const tabHandlers = {
        handleTabChange: (tab, speaker = "") => {
            if (
                Object.keys(IndividualCallConfig.LEFT_TABS).indexOf(tab) !== -1
            ) {
                setActiveLeftTab(tab);
            } else {
                setActiveRightTab(tab);
            }
            setActiveSpeaker(speaker);
        },
        toggleComments: (chat) => {
            if (!showComments) {
                if (!chat)
                    setcommentToAdd({
                        comment: `@${secondsToTime(playedDuration)}`,
                    });
                else {
                }
                overviewHandlers.getComment();
            } else {
                setshowComments(false);
                setShowCallStatistics(true);
                if (!chat && playerPreviousPlaying) {
                    playerRef?.current?.play();
                }
            }
        },
    };

    const playerHandlers = {
        getPlayerMedia: () => {
            getCallMedia(domain, activeCall.callDetails.id).then((res) => {
                if (res.status !== apiErrors.AXIOSERRORSTATUS) {
                    setMediaUri(res.location);
                }
                return res.location || "";
            });
        },
        seekToPoint: (time, seeknplay) => {
            if (playerRef.current) {
                time = Math.floor(time);
                playerRef.current.currentTime = time;
                if (seeknplay) {
                    playerRef.current.play();
                }
            }
        },
        onProgress: (duration) => {
            setPlayedDuration(duration);
        },
    };

    const miscPageHandlers = {
        changeCallType: (callTypeId = 0, calla_id, current, prev) => {
            if (callTypeId) {
                setcall_type_loading(true);
                setcall_type(current);
                setcall_type_error(false);
                changeCompletedCallType(domain, callId, callTypeId)
                    .then((res) => {
                        setcall_type(res.call_types);
                        setcall_type_loading(false);
                    })
                    .catch((err) => {
                        setcall_type_loading(false);
                        setcall_type_error(true);
                        setcall_type(prev);
                    });
            }
        },
    };
    const commentHandlers = {
        addComment: (comment) => {
            // Function to add a Comment through an API Call.
            // Pass the comment to the function in order to send that.
            // Or pass no comment to the function to send the default comment State.
            // if (!commentToAdd && !comment) return;
            // if (activeCallType === IndividualCallConfig.COMPLETED_TYPE) {
            //     addCompletedComments(domain, callId, {
            //         comment: comment ? comment : commentToAdd,
            //         mentioned_users: commentMentions.map(
            //             (mention) => +mention.id
            //         ),
            //     })
            //         .then((res) => setcomments(res.comments))
            //         .catch((err) => {
            //             seterrorMessage(err);
            //         });
            // }
            // setcommentToAdd('');
            // setCommentMentions([]);
            // return;
        },
        getComments: () => {
            if (activeCallType === IndividualCallConfig.COMPLETED_TYPE) {
                getCompletedComments(domain, callId)
                    .then((res) => setcomments(res.results))
                    .catch((err) => {
                        seterrorMessage(err);
                    });
            }
        },
        setReply: (commentIndex, commentOwner) => {
            setcommentReply({
                ...commentReply,
                // reply: `@${commentOwner} `,
                reply: "",
                replying: true,
                commentIndex,
                commentOwner,
            });
        },
        handleReplyChange: (value, mentions) => {
            setcommentReply({
                ...commentReply,
                reply: value,
            });
            setCommentMentions(mentions);
        },
        confirmReply: (event) => {
            if (commentReply.replying && commentReply.reply) {
                commentHandlers.addComment(event, commentReply.reply);

                setcommentReply({
                    ...commentReply,
                    reply: "",
                    replying: false,
                    commentIndex: -1,
                    commentOwner: "",
                });
            }
        },
        cancelReply: () => {
            // Cancel the reply. Reset the reply form and remove the text box and buttons.
            setcommentReply({
                ...commentReply,
                reply: "",
                replying: false,
                commentIndex: -1,
                commentOwner: "",
            });
            setCommentMentions([]);
        },
        activateComment: (commentIndex) => {
            setactiveComment(commentIndex);
        },
    };

    const overviewHandlers = {
        getComment: (commentIndex) => {
            // Function to toggle comments section with the comment to highlight.
            const url = new URLSearchParams(document.location.search);
            const chat = url.get("chat") === "true";
            setshowComments(true);
            setShowAuditDrawer(false);
            setShowAiAuditInfo(false);
            setShowLeadScoreSider(false);
            setShowCallStatistics(false);
            if (!chat && !playerRef?.current?.paused) {
                setPlayerPreviousPlaying(true);
                playerRef?.current?.pause();
            } else if (!chat) {
                setPlayerPreviousPlaying(false);
            }
            if (commentIndex) commentHandlers.activateComment(commentIndex);
        },

        handleTopicDotClick: (name) => {
            setActiveTopic(name);
            setActiveRightTab(IndividualCallConfig.RIGHT_TABS.topics.value);
        },
    };

    const transcriptHandlers = {
        handleTurnEditOn: () => {
            seteditedTranscript(transcripts);
            setisEditingTranscript(true);
            setTimeout(() => {
                document
                    .querySelector(
                        ".individualcall-transcript:first-of-type textarea.ant-input"
                    )
                    .focus();
            }, 0);
        },
        handleEditTranscript: (transcript, idx) => {
            let updatedTranscript = [...editedTranscript];
            updatedTranscript[idx] = {
                ...updatedTranscript[idx],
                monologue_text: transcript,
            };
            seteditedTranscript(updatedTranscript);
        },
        saveEdit: () => {
            setisEditingTranscript(false);
            dispatch(
                updateCallTranscript(callId, {
                    transcript_json: editedTranscript,
                    is_processable: true,
                })
            );
        },
        cancelEdit: () => {
            setisEditingTranscript(false);
        },
        highlightTranscript: (monologue) => {
            let updatedTranscript = [...transcripts];
            monologue.indexes.map((idx) => {
                updatedTranscript[idx] = {
                    ...updatedTranscript[idx],
                    highlighted: updatedTranscript[idx].highlighted
                        ? false
                        : true,
                };
            });
            dispatch(
                updateCallTranscript(callId, {
                    transcript_json: updatedTranscript,
                    is_processable: false,
                })
            );
        },
    };

    const feedbackHandlers = {
        setRating: (rating, feedback, idx) => {
            dispatch(addFeedback(callId, feedback, idx, rating));
        },
        addNote: (feedback, idx) => {
            setactiveNote({
                show:
                    activeNote.feedback &&
                    feedback.question.id === activeNote.feedback.question.id &&
                    activeNote.show
                        ? false
                        : true,
                feedback: feedback,
                idx: idx,
            });
            if (feedback.response) {
                setnewNote(feedback.response.note);
            } else {
                setnewNote("");
            }
        },

        showAllNotes: (question) => {
            setactiveNote({
                show:
                    activeNote.feedback &&
                    question === activeNote.feedback &&
                    activeNote.show
                        ? false
                        : true,
                feedback: question,
            });
            if (!allNotes[question]) {
                dispatch(getUserFeedbacks(callId, null, question));
            }
        },

        // Handle note
        handleNoteChange: (event) => {
            setnewNote(event.target.value);
        },
        handleFeedbackBy: (event) => {
            setfeedbackBy(parseInt(event.target.value));
        },
    };
    return {
        tabHandlers,
        playerHandlers,
        miscPageHandlers,
        commentHandlers,
        overviewHandlers,
        transcriptHandlers,
        feedbackHandlers,
    };
}
