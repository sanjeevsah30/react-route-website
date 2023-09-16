import InfiniteLoader from "@presentational/reusables/InfiniteLoader";
import { Divider, Popover } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import CommentInput from "app/components/Resuable/CommentInput";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";
import NoCommentsSvg from "app/static/svg/NoCommentsSvg";
import SendCommentSvg from "app/static/svg/SendCommentSvg";
import CommentCard from "./CommentCard";
import CommentsContext from "./CommentsContext";
import "./comments.scss";
import CloseSvg from "app/static/svg/CloseSvg";
import { getDateTime, uid } from "@tools/helpers";
import PlusSvg from "../../../static/svg/PlusSvg";
import CameraSvg from "../../../static/svg/CameraSvg";
import VideoFilledSvg from "../../../static/svg/VideoFilledSvg";
import { openNotification } from "../../../../store/common/actions";
import useRecorder from "../../../../hooks/useRecorder";
import { DeleteOutlined } from "@ant-design/icons";
import AudioRecording from "./AudioRecording";
import VideoRecording from "./VideoRecording";
import ChatImage from "../../IndividualCall/ChatImage";

function CommentTabUI(props) {
    const {
        containerStyle,
        totalComments,
        closeDrawer,
        createComment,
        next,
        comments,
        setCommentToReply,
        loadMoreComments,
        editComment,
        activeComment,
        removeReplyBlock,
        saveReply,
        loadMoreReplies,
        deleteComment,
        defaultComment,
        handleTimeStampClick,
        transcript,
        handleGoToChatClick = () => {},
        addMediaComment,
    } = useContext(CommentsContext);

    const { auth: loggedUser } = useSelector((state) => state);
    const [comment, setComment] = useState({
        comment: defaultComment,
        mentioned_users: [],
    });
    const videoPlayerRef = useRef(null);
    const [video, setVideo] = useState(false);
    const {
        audioURL,
        status: recordingStatus,
        startRecording,
        stopRecording,
        deleteRecording,
        stream,
    } = useRecorder({ video: video });
    const [recording, setRecording] = useState();
    const [commentOptionsOpen, setCommentOptionsOpen] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (audioURL) setRecording(audioURL);
    }, [audioURL]);

    useEffect(() => {
        if (totalComments && comment.comment) {
            setComment({
                comment: defaultComment,
                mentioned_users: [],
            });
        }
    }, [totalComments, activeComment?.replies?.count]);

    useEffect(() => {
        if (recordingStatus === "error") {
            openNotification(
                "error",
                "Error Recording",
                `Ensure microphone ${
                    video && "and camera"
                } permissions are enabled`
            );
        }
        if (video && recordingStatus === "recording") {
            videoRef.current.srcObject = stream;
        }
    }, [recordingStatus, stream]);

    return (
        <div className="comment__container border" style={containerStyle}>
            <div className="comment__container__header border_bottom">
                {activeComment?.comment?.id ? (
                    <div className="flex alignCenter">
                        <span
                            className={"curPoint marginR10"}
                            onClick={() => {
                                removeReplyBlock();
                            }}
                        >
                            <LeftArrowSvg style={{ fontSize: "14px" }} />
                        </span>
                        <span className="bold700 font16"> Comment</span>
                    </div>
                ) : (
                    <div className="bold700 font18">
                        Comments
                        {!!totalComments && <span> ({totalComments})</span>}
                    </div>
                )}
                <span className="curPoint " onClick={closeDrawer}>
                    <CloseSvg />
                </span>
            </div>
            {activeComment?.comment?.id ? (
                <>
                    <div className="flexShrink">
                        <CommentCard
                            {...activeComment.comment}
                            hideActions={true}
                            showReplyBlock={false}
                            disableClickEvent={true}
                            handleTimeStampClick={handleTimeStampClick}
                            handleGoToChatClick={handleGoToChatClick}
                        />
                        {activeComment?.replies?.count ? (
                            <Divider orientation="left">
                                <span className="bold600 font12">
                                    {activeComment?.replies?.count === 1
                                        ? "1 reply"
                                        : `${activeComment?.replies?.count} replies`}
                                </span>
                            </Divider>
                        ) : (
                            <Divider orientation="left">
                                <span className="bold600 font12">
                                    0 replies
                                </span>
                            </Divider>
                        )}
                    </div>
                    {activeComment?.replies?.count ? (
                        // <ReactVirtualCard
                        //     hasNextPage={activeComment?.replies?.next || null}
                        //     data={activeComment?.replies?.results || []}
                        //     onLoadMore={loadMoreReplies}
                        //     Component={CommentCard}
                        //     borderClass="border_bottom"
                        //     className="flex1 overflowYauto"
                        //     loggedUserId={loggedUser.id}
                        //     saveComment={saveReply}
                        //     setCommentToReply={setCommentToReply}
                        //     showReplyBlock={false}
                        //     hideReplyAction={true}
                        //     deleteComment={deleteComment}
                        // />
                        <InfiniteLoader
                            hasNextPage={activeComment?.replies?.next || null}
                            data={activeComment?.replies?.results || []}
                            Component={CommentCard}
                            borderClass="border_bottom"
                            className="flex1 overflowYauto"
                            loggedUserId={loggedUser.id}
                            saveComment={saveReply}
                            setCommentToReply={setCommentToReply}
                            showReplyBlock={false}
                            hideReplyAction={true}
                            deleteComment={deleteComment}
                            onLoadMore={loadMoreReplies}
                            disableClickEvent={true}
                            handleTimeStampClick={handleTimeStampClick}
                            handleGoToChatClick={handleGoToChatClick}
                        />
                    ) : (
                        <div className="flex1"></div>
                    )}
                </>
            ) : totalComments ? (
                // <ReactVirtualCard
                //     hasNextPage={next || null}
                //     data={comments || []}
                //     onLoadMore={loadMoreComments}
                //     Component={CommentCard}
                //     borderClass="border_bottom"
                //     className="flex1 overflowYauto"
                //     loggedUserId={loggedUser.id}
                //     saveComment={editComment}
                //     setCommentToReply={setCommentToReply}
                //     showReplyAction={false}
                //     deleteComment={deleteComment}
                // />
                <InfiniteLoader
                    hasNextPage={next || null}
                    data={comments || []}
                    onLoadMore={loadMoreComments}
                    Component={CommentCard}
                    borderClass="border_bottom"
                    className="flex1 overflowYauto"
                    loggedUserId={loggedUser.id}
                    saveComment={editComment}
                    setCommentToReply={setCommentToReply}
                    showReplyAction={false}
                    deleteComment={deleteComment}
                    handleTimeStampClick={handleTimeStampClick}
                    handleGoToChatClick={handleGoToChatClick}
                />
            ) : (
                <div className="overflowYauto flex1">
                    <div className="height100p flex alignCenter justifyCenter column">
                        <NoCommentsSvg />
                        <div className="bold700 font16">No Comments Yet</div>
                        <div className="dove_gray_cl font12">
                            Be the first one comment
                        </div>
                    </div>
                </div>
            )}

            <div className="comment__container__footer">
                {recordingStatus === "recording" ? (
                    video ? (
                        <>
                            <div className="font18 bold600 marginB10">
                                Recording...
                            </div>{" "}
                            <video
                                ref={videoRef}
                                width="240px"
                                style={{ borderRadius: "6px" }}
                                onCanPlay={() => videoRef?.current.play()}
                                muted
                            ></video>
                        </>
                    ) : (
                        <div className="font18 bold600 marginB10">
                            Recording...
                        </div>
                    )
                ) : !!!totalComments ? (
                    <div className="font18 bold600 marginB10">
                        Add a Comment
                    </div>
                ) : null}{" "}
                {transcript &&
                    (transcript.image ? (
                        <ChatImage transcript={transcript} />
                    ) : (
                        <div className="chat_container">
                            <div className="chat_text">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: transcript.monologue_text,
                                    }}
                                />
                                <div className="font12 chat_date">
                                    {getDateTime(
                                        new Date(transcript.timestamp * 1000),
                                        "time"
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                <div className="posRel">
                    <div
                        className="posAbs paddingL16 paddingR16  paddingT10 curPoint comment_add"
                        style={{
                            top: "50%",
                            left: "8px",
                            transform: "translateY(-50%)",
                        }}
                        onClick={() => {}}
                    >
                        {recordingStatus === "recording" ? (
                            <DeleteOutlined
                                style={{
                                    color: "#666666",
                                    scale: "1.35",
                                    marginBottom: "0.625rem",
                                }}
                                onClick={() => {
                                    deleteRecording();
                                }}
                            />
                        ) : (
                            <Popover
                                content={
                                    <div
                                        className="comment_media_add_popover"
                                        onClick={() =>
                                            setCommentOptionsOpen(false)
                                        }
                                    >
                                        <button
                                            onClick={() => {
                                                setVideo(false);
                                                startRecording();
                                            }}
                                        >
                                            <CameraSvg />
                                            Record Audio
                                        </button>
                                        <button
                                            onClick={() => {
                                                setVideo(true);
                                                startRecording();
                                            }}
                                        >
                                            <VideoFilledSvg />
                                            Record Video
                                        </button>
                                    </div>
                                }
                                trigger="click"
                                visible={commentOptionsOpen}
                                onVisibleChange={(visible) =>
                                    setCommentOptionsOpen(visible)
                                }
                                overlayInnerStyle={{ borderRadius: "5px" }}
                            >
                                <PlusSvg
                                    style={{
                                        scale: "1.25",
                                        color: "#1A62F2",
                                        marginBottom: "12px",
                                    }}
                                    onClick={() => setCommentOptionsOpen(true)}
                                />
                            </Popover>
                        )}
                    </div>
                    <CommentInput
                        placeholder={
                            activeComment?.comment?.id
                                ? "Write a reply..."
                                : undefined
                        }
                        comment={comment}
                        setComment={setComment}
                    />
                    {recordingStatus === "recording" ? (
                        <div
                            className="posAbs marginT8 borderRadius10 curPoint recording_stop"
                            style={{
                                top: "50%",
                                right: "8px",
                                transform: "translateY(-50%)",
                            }}
                            onClick={() => {
                                stopRecording();
                            }}
                        >
                            <div className="recording_stop_icon"></div>
                        </div>
                    ) : (
                        <div
                            className="posAbs marginT8 borderRadius10 curPoint comment_send"
                            style={{
                                top: "50%",
                                right: "8px",
                                transform: "translateY(-50%)",
                            }}
                            onClick={() => {
                                if (recording) {
                                    const type =
                                        video === true ? "video" : "audio";
                                    const extension =
                                        video === true ? "mp4" : "mp3";

                                    var formdata = new FormData();
                                    formdata.append(
                                        "media",
                                        recording,
                                        `${uid()}.${extension}`
                                    );
                                    formdata.append(
                                        "comment",
                                        comment.comment || type
                                    );
                                    if (transcript) {
                                        formdata.append(
                                            "transcript",
                                            JSON.stringify(transcript)
                                        );
                                    }
                                    addMediaComment(formdata);
                                    setRecording();
                                } else {
                                    comment.comment &&
                                        createComment({
                                            payload: transcript
                                                ? { ...comment, transcript }
                                                : comment,
                                        });
                                }
                            }}
                        >
                            <SendCommentSvg
                                style={{
                                    color: "#1a62f2",
                                }}
                            />
                        </div>
                    )}
                </div>
                {recording &&
                    (video ? (
                        <VideoRecording
                            src={URL.createObjectURL(recording)}
                            deleteRecording={() => {
                                setRecording();
                            }}
                        />
                    ) : (
                        <AudioRecording
                            url={URL.createObjectURL(recording)}
                            deleteRecording={() => {
                                setRecording();
                            }}
                        />
                    ))}
            </div>
        </div>
    );
}

export default CommentTabUI;
