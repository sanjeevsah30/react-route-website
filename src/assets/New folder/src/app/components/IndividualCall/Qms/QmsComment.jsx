import React, { useEffect, useState } from "react";
import CommentsTab from "../../Compound Components/Comments/CommentsTab";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    createCallComments,
    createCallMediaComments,
    deleteCallComment,
    fetchCallCommentReply,
    fetchCallComments,
    setCallCommentToReply,
    updateCallComments,
} from "@store/individualcall/actions";
import { scrollElementInNoShaka, timeToSeconds } from "@tools/helpers";
import IndividualCallConfig from "@constants/IndividualCall/index";
import Spinner from "@presentational/reusables/Spinner";
import "./QmsShareComment.scss";

const QmsComment = ({ isCommentsVisible, onClose }) => {
    const { callComments } = useSelector((state) => state.individualcall);
    const dispatch = useDispatch();
    const { id: callId } = useParams();
    const [commentToAdd, setcommentToAdd] = useState({
        comment: "",
        transcript: null,
    });
    const loadMoreComments = () => {
        dispatch(fetchCallComments(callId, callComments.comments.next));
    };

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

    // const seekToPoint = (start_time) => {
    //     setActiveLeftTab(IndividualCallConfig.LEFT_TABS.transcript.value);
    //     setAutoScrollTranscripts(true);
    //     playerHandlers.seekToPoint(start_time, true);
    // };

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

    const deleteComment = ({ id, payload }) => {
        dispatch(deleteCallComment(id, payload));
    };

    // const handleTimeStampClick = (e) => {
    //     e.stopPropagation();
    //     if (e && e.target.closest('a') && e.target.closest('a').dataset.time) {
    //         seekToPoint(
    //             timeToSeconds(e.target.closest('a').dataset.time),
    //             true
    //         );
    //     }
    // };

    const handleGoToChatClick = (timestamp) => {
        scrollElementInNoShaka(
            `[data-index="${timestamp}"]`,
            undefined,
            undefined,
            null,
            true,
            true
        );
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

    useEffect(() => {
        dispatch(fetchCallComments(callId));
    }, []);

    return (
        <>
            <Spinner loading={false}>
                {isCommentsVisible && (
                    <CommentsTab
                        closeDrawer={onClose}
                        comments={callComments?.comments?.results || []}
                        totalComments={callComments?.comments?.count || 0}
                        createComment={saveComment}
                        loadMoreComments={loadMoreComments}
                        editComment={saveComment}
                        setCommentToReply={setCommentToReply}
                        activeComment={callComments.activeComment}
                        removeReplyBlock={removeReplyBlock}
                        saveReply={saveComment}
                        loadMoreReplies={loadMoreReplies}
                        deleteComment={deleteComment}
                        defaultComment={commentToAdd.comment}
                        transcript={commentToAdd.transcript}
                        handleGoToChatClick={handleGoToChatClick}
                        addMediaComment={addMediaComment}
                    />
                )}
            </Spinner>
        </>
    );
};

export default QmsComment;
