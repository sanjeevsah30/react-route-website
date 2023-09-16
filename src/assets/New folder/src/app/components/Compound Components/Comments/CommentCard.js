import Dot from "@presentational/reusables/Dot";
import Icon from "@presentational/reusables/Icon";
import MultipleAvatars from "@presentational/reusables/MultipleAvatars";
import {
    createMarkup,
    getCleanComment,
    getColor,
    getDateTime,
    getDisplayName,
} from "@tools/helpers";
import { Avatar, Button, Tooltip, Popconfirm } from "antd";
import React, { useEffect, useRef, useState } from "react";
import CommentInput from "app/components/Resuable/CommentInput";
import CommentSvg from "app/static/svg/CommentSvg";
import DeleteSvg from "app/static/svg/DeleteSvg";
import EditCommentSvg from "app/static/svg/EditCommentSvg";
import ChatImage from "../../IndividualCall/ChatImage";
import ShakaPlayer from "../../ShakaPlayer/ShakaPlayer";
import AudioComment from "./AudioComment";
import VideoRecording from "./VideoRecording";

function CommentCard({
    showReplyBlock,
    borderClass,
    owner,
    is_disabled,
    comment: text,
    created,
    loggedUserId,
    saveComment,
    id: commentId,
    setCommentToReply,
    data,
    reply_initials,
    replies_count,
    hideActions,
    hideReplyAction,
    last_reply,
    deleteComment,
    parent,
    disableClickEvent,
    handleTimeStampClick,
    transcript,
    handleGoToChatClick,
    media,
    media_type,
}) {
    const { first_name, last_name, email, userName, id: userId } = owner;
    const name = getDisplayName({ first_name, last_name, email, userName });
    const videoCommentRef = useRef(null);
    const [editFlag, setEditFlag] = useState(false);

    const [editComment, setEditComment] = useState({
        comment: "",
        mentioned_users: [],
    });

    //If text changes it means your edit was succesfull
    useEffect(() => {
        if (editFlag) {
            setEditFlag(false);
        }
    }, [text]);

    return (
        <div
            className={`posRel paddingT21 paddingB15 paddingLR18 comment__card ${
                editFlag
                    ? "dusty_gray_bg_10_percent"
                    : "component--hover--active"
            } curPoint ${borderClass}`}
            onClick={() => {
                !editFlag &&
                    !disableClickEvent &&
                    replies_count &&
                    setCommentToReply(data);
            }}
        >
            {!editFlag && !hideActions && (
                <div
                    className="posAbs font18 comment__actions flex"
                    style={{
                        right: "0",
                        zIndex: "2",
                    }}
                >
                    {!hideReplyAction && (
                        <Tooltip placement="topLeft" title="Reply to thread">
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    !editFlag &&
                                        !disableClickEvent &&
                                        setCommentToReply(data);
                                }}
                            >
                                <CommentSvg />
                            </span>
                        </Tooltip>
                    )}

                    {loggedUserId === userId && !is_disabled && (
                        <>
                            <Tooltip placement="topLeft" title="Edit">
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditFlag(true);
                                        setEditComment({
                                            comment: text,
                                            mentioned_users: [],
                                        });
                                    }}
                                >
                                    <EditCommentSvg />
                                </span>
                            </Tooltip>

                            <Popconfirm
                                title="Are you sure to delete this comment?"
                                placement="topRight"
                                onConfirm={(e) => {
                                    e.stopPropagation();
                                    deleteComment({
                                        id: commentId,
                                        payload: { parent },
                                    });
                                }}
                                onCancel={(e) => e.stopPropagation()}
                                okText="Yes"
                                cancelText="No"
                            >
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <DeleteSvg />
                                </span>
                            </Popconfirm>
                        </>
                    )}
                </div>
            )}
            <div className="flex alignStart">
                <Avatar
                    style={{
                        backgroundColor: getColor(name),
                        verticalAlign: "middle",
                    }}
                    className="bold font18"
                    size={30}
                >
                    {name?.[0]}
                </Avatar>

                <div className="paddingL12 flex column flex1">
                    <span className="mine_shaft_cl bold600 font14">{name}</span>
                    {!editFlag && (
                        <span>
                            <span className="dusty_gray_cl font12">
                                {getDateTime(created, "timeDate")}
                            </span>
                            {transcript && (
                                <span
                                    className="currPoint marginLR16 primary_cl"
                                    onClick={() => {
                                        handleGoToChatClick(
                                            transcript.timestamp
                                        );
                                    }}
                                >
                                    Go to Chat
                                </span>
                            )}
                        </span>
                    )}
                </div>
            </div>

            <div style={{ width: "90%" }}>
                {transcript &&
                    (transcript.image ? (
                        <ChatImage transcript={transcript} />
                    ) : (
                        <div className="chat_container  marginT16">
                            <div className="chat_text view">
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

                {editFlag ? (
                    <div className="marginTB15">
                        <CommentInput
                            // placeholder={config.ENTERCOMMENT}
                            comment={editComment}
                            setComment={setEditComment}
                        />
                        <div className="marginT15 flex justifyEnd">
                            <Button
                                className="cancel__btn"
                                onClick={() => {
                                    // editComment && setEditComment('');
                                    setEditFlag(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="save__btn"
                                onClick={() => {
                                    saveComment({
                                        id: commentId,
                                        payload: {
                                            ...editComment,
                                            mentioned_users:
                                                editComment.mentioned_users.map(
                                                    ({ id }) => +id
                                                ),
                                        },
                                    });
                                    if (editComment.comment === text) {
                                        setEditFlag(false);
                                    }
                                }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                ) : text && media && media_type === "mp3" ? (
                    <>
                        <div
                            className="font14 marginT14 sonic_silver_cl bold400"
                            onClick={handleTimeStampClick}
                        >
                            {is_disabled && (
                                <Icon className="fas fa-trash marginR5" />
                            )}{" "}
                            <span
                                dangerouslySetInnerHTML={createMarkup(
                                    getCleanComment(text)
                                )}
                                style={{
                                    lineHeight: "14px",
                                }}
                            />
                        </div>
                        <AudioComment url={media} />
                    </>
                ) : text && media && media_type === "mp4" ? (
                    <>
                        <div
                            className="font14 marginT14 sonic_silver_cl bold400"
                            onClick={handleTimeStampClick}
                        >
                            {is_disabled && (
                                <Icon className="fas fa-trash marginR5" />
                            )}{" "}
                            <span
                                dangerouslySetInnerHTML={createMarkup(
                                    getCleanComment(text)
                                )}
                                style={{
                                    lineHeight: "14px",
                                }}
                            />
                        </div>
                        <VideoRecording src={media} hideClose={true} />
                        {/* <ShakaPlayer
                            uri={data.media}
                            videoRef={videoCommentRef}
                        /> */}
                    </>
                ) : (
                    <div
                        className="font14 marginT14 sonic_silver_cl bold400"
                        onClick={handleTimeStampClick}
                    >
                        {is_disabled && (
                            <Icon className="fas fa-trash marginR5" />
                        )}{" "}
                        <span
                            dangerouslySetInnerHTML={createMarkup(
                                getCleanComment(text)
                            )}
                            style={{
                                lineHeight: "14px",
                            }}
                        />
                    </div>
                )}
                {!!replies_count && showReplyBlock && !editFlag && (
                    <div className="flex alignCenter marginT10">
                        <MultipleAvatars
                            isString={true}
                            participants={reply_initials}
                            max={2}
                        />

                        <span className="bold600 primary_cl font12">
                            &nbsp; {replies_count}{" "}
                            {replies_count === 1 ? "reply" : "replies"}
                        </span>
                        <Dot
                            height="5px"
                            width="5px"
                            className="silver_bg marginLR5"
                        />
                        <span className="silver_cl font12">
                            Last reply {getDateTime(last_reply, "date")}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

CommentCard.defaultProps = {
    showReplyBlock: true,
    borderClass: "",
    hideActions: false,
    hideReplyAction: false,
    disableClickEvent: false,
    setCommentToReply: () => {},
    handleTimeStampClick: () => {},
};

export default CommentCard;
