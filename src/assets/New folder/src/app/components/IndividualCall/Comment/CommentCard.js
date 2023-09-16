import Icon from "@presentational/reusables/Icon";
import { Button, Popconfirm } from "antd";
import React, { useState } from "react";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getDateTime, createMarkup, getCleanComment } from "@helpers";
import CommentMentions from "./CommentMentions";
import IndividualCallConfig from "@constants/IndividualCall/index";
import { useSelector } from "react-redux";
import { deleteCommentAjx, updateCommentAjx } from "@apis/calls/index";
import apiErrors from "@apis/common/errors";
import { openNotification } from "@store/common/actions";

export default function CommentCard({
    baseClass,
    comment,
    handleTimeStampClick,
    updateCommentsList,
    setLoading,
}) {
    const userId = useSelector((state) => state.auth.id);
    const domain = useSelector((state) => state.common.domain);
    const [editingComment, setEditingComment] = useState(false);
    const [editedComment, setEditedComment] = useState("");
    const [editedMentions, setEditedMentions] = useState("");
    const handleEditComment = (value, mentions) => {
        setEditedComment(value);
        setEditedMentions(mentions);
    };
    const deleteComment = () => {
        setLoading(true);
        deleteCommentAjx(domain, comment.id).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                updateCommentsList(true, comment.id);
            }
            setLoading(false);
        });
    };
    const updateComment = () => {
        if (editedComment) {
            setLoading(true);
            updateCommentAjx(domain, comment.id, {
                comment: editedComment,
                mentioned_users: editedMentions.map((mention) => +mention.id),
            }).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    updateCommentsList(false, res.id, res);
                    setEditingComment(false);
                }
                setLoading(false);
            });
        }
    };
    return (
        <div className={`${baseClass}-main-comment-section`}>
            <div className={`${baseClass}-main-comment-owner flex alignCenter`}>
                <div
                    className={`${baseClass}-main-comment-owner-name truncate`}
                >
                    {comment.owner.first_name
                        ? comment.owner.first_name
                        : comment.owner.email}
                </div>
                <div
                    className={`${baseClass}-main-comment-owner-datetime flex alignCenter`}
                >
                    {getDateTime(
                        comment.updated
                            ? comment.updated
                            : comment.created
                            ? comment.created
                            : new Date()
                    )}
                    {comment.owner?.id === userId && (
                        <>
                            <div className="marginL4">
                                <Button
                                    icon={<EditOutlined />}
                                    type={"link"}
                                    size="small"
                                    onClick={() => setEditingComment(true)}
                                />
                            </div>
                            <div className="marginL4">
                                <Popconfirm
                                    title="Are you sure to delete this comment?"
                                    onConfirm={deleteComment}
                                    // onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        icon={<DeleteOutlined />}
                                        type={"link"}
                                        size="small"
                                        danger
                                    />
                                </Popconfirm>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className={`${baseClass}-main-comment-text`}>
                {editingComment ? (
                    <>
                        <CommentMentions
                            placeholder={IndividualCallConfig.ENTERCOMMENT}
                            onChange={handleEditComment}
                            defaultValue={comment.comment}
                        />
                        <div className="flex justifyEnd marginT10">
                            <Button
                                className="marginR10"
                                type="link"
                                onClick={() => setEditingComment(false)}
                            >
                                {IndividualCallConfig.CANCEL}
                            </Button>
                            <Button
                                type="primary"
                                shape="round"
                                onClick={updateComment}
                            >
                                Update
                            </Button>
                        </div>
                    </>
                ) : (
                    <pre
                        onClick={handleTimeStampClick}
                        className="callComments-showComments-card-comment"
                        dangerouslySetInnerHTML={createMarkup(
                            getCleanComment(comment.comment)
                        )}
                    />
                )}
            </div>
            {/* <div className={`${baseClass}-main-comment-reply`}>
                {commentReply.replying &&
                commentReply.commentIndex === index ? (
                    <>
                        <CommentMentions
                            placeholder={IndividualCallConfig.REPLYTOCOMMENT}
                            onChange={handleReplyChange}
                            value={commentReply.reply}
                        />
                        <div
                            className={`${baseClass}-main-comment-reply-options`}
                        >
                            <Button
                                className="marginR10"
                                type="link"
                                onClick={cancelReply}
                            >
                                {IndividualCallConfig.CANCEL}
                            </Button>
                            <Button
                                type="primary"
                                shape="round"
                                onClick={confirmReply}
                            >
                                {IndividualCallConfig.REPLY}
                            </Button>
                        </div>
                    </>
                ) : (
                    <Icon
                        iconTitle={IndividualCallConfig.REPLYTOCOMMENT}
                        className={IndividualCallConfig.REPLYICON}
                        handleClick={() =>
                            setReply(index, comment.owner.username)
                        }
                    />
                )}
            </div> */}
        </div>
    );
}
