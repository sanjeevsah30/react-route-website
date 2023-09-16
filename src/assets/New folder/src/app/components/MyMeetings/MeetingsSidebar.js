import apiErrors from "@apis/common/errors";
import { deleteCommentAjx, updateCommentAjx } from "@apis/calls/index";
import callsConfig from "@constants/MyCalls/index";
import { Spinner, Tag } from "@presentational/reusables/index";
import {
    updateCommentsList,
    updateMeetingComments,
    updateMeetingTags,
    updateSidebarNote,
} from "@store/calls/actions";
import { createNewTag, openNotification } from "@store/common/actions";
import {
    createMarkup,
    getCleanComment,
    getDateTime,
    uid,
    userMentionsData,
} from "@tools/helpers";
import { Button, Popconfirm, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import { useDispatch, useSelector } from "react-redux";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useDebounce from "hooks/useDebounce";
import CommentMentions from "../IndividualCall/Comment/CommentMentions";

const SidebarTags = (props) => (
    <div className="callTags">
        <p className="callLabel">{callsConfig.TAGS_LABEL}</p>
        <div className="callTags-container">
            {props.sideBar.showAddTag ? null : props.sideBar.tags &&
              props.sideBar.tags.length > 0 ? (
                props.sideBar.tags.map((tag, idx) => {
                    return (
                        <Tag
                            key={uid() + tag.id}
                            tagId={tag.id}
                            label={tag.name || tag.tag_name}
                            isEditable={props.sideBar.showAddTag}
                            handleRemoveTag={props.handleRemoveTag}
                        />
                    );
                })
            ) : (
                <div className="callTags-container-notags">
                    {callsConfig.NO_TAGS}
                </div>
            )}
            {props.sideBar.showAddTag && (
                <Select
                    mode="tags"
                    style={{
                        width: "100%",
                    }}
                    placeholder={callsConfig.NEW_TAG_PLACEHOLDER}
                    value={
                        props.sideBar.tags && props.sideBar.tags.length > 0
                            ? props.sideBar.tags.map((tag, idx) => {
                                  return tag.name || tag.tag_name;
                              })
                            : []
                    }
                    options={props.options}
                    onDeselect={props.handleRemoveTag}
                    onSelect={props.handleNewTag}
                    disabled={props.isDisabled}
                />
            )}
        </div>
    </div>
);

const CallComments = (props) => {
    return (
        <div className="callComments">
            <p className="callLabel">{callsConfig.COMMENTS_LABEL}</p>
            <div className="callComments-container">
                <div className="callComments-addComment">
                    <MentionsInput
                        value={props.newComment}
                        onChange={(event, value, newPlainTextValue, mentions) =>
                            props.handleNewComment(
                                callsConfig.COMMENTS_NAME,
                                value,
                                mentions
                            )
                        }
                        placeholder={callsConfig.COMMENTS_PLACEHOLDER}
                        className="callComments-addComment-write"
                    >
                        <Mention
                            markup={`${callsConfig.COMMENTS_OPEN_DELIMITER}__display__(__id__)${callsConfig.COMMENTS_CLOSE_DELIMITER}`}
                            trigger="@"
                            appendSpaceOnAdd
                            data={userMentionsData(props.users)}
                            className="mentions__mention"
                        />
                    </MentionsInput>
                    <span
                        onClick={() =>
                            props.handleNewComment(
                                callsConfig.COMMENTS_SEND_NAME
                            )
                        }
                        className="callComments-addComment-send"
                    >
                        {callsConfig.COMMENTS_SEND_NAME}
                    </span>
                </div>
                {props.sideBar?.comments?.length > 0 ? (
                    <div className="callComments-showComments">
                        {props.sideBar.comments.length <=
                        callsConfig.MAX_SHOW_COMMENTS ? (
                            props.sideBar.comments.map((comment, idx) => {
                                return (
                                    <SidebarCommentCard
                                        comment={comment}
                                        key={uid() + comment.id}
                                    />
                                );
                            })
                        ) : (
                            <>
                                {props.sideBar.comments
                                    .slice(0, callsConfig.MAX_SHOW_COMMENTS)
                                    .map((comment, idx) => {
                                        return (
                                            <SidebarCommentCard
                                                comment={comment}
                                                key={uid() + comment.id}
                                            />
                                        );
                                    })}
                                {!props.showMoreComments ? (
                                    <span
                                        className="callComments-showComments-more"
                                        onClick={props.toggleShowMore}
                                    >
                                        <span className="line"></span>
                                        {callsConfig.SHOW_MORE}
                                        <span className="line"></span>
                                    </span>
                                ) : (
                                    props.sideBar.comments
                                        .slice(callsConfig.MAX_SHOW_COMMENTS)
                                        .map((comment, idx) => {
                                            return (
                                                <SidebarCommentCard
                                                    comment={comment}
                                                    key={uid() + comment.id}
                                                />
                                            );
                                        })
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="callComments-container-noComments">
                        {callsConfig.COMMENTS_NOCOMMENTS}
                    </div>
                )}
            </div>
        </div>
    );
};

const SidebarCommentCard = ({ comment }) => {
    const dispatch = useDispatch();
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
        // dispatch(setUpdatingSidebar(true));
        deleteCommentAjx(domain, comment.id).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(updateCommentsList(true, comment.id));
            }
            // dispatch(setUpdatingSidebar(false));
        });
    };
    const updateComment = () => {
        if (editedComment) {
            // dispatch(setUpdatingSidebar(true));
            updateCommentAjx(domain, comment.id, {
                comment: editedComment,
                mentioned_users: editedMentions.map((mention) => +mention.id),
            }).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(updateCommentsList(false, res.id, res));
                    setEditingComment(false);
                }
                // dispatch(setUpdatingSidebar(false));
            });
        }
    };
    return (
        <div className="callComments-showComments-card">
            <div className="callComments-showComments-card-user">
                <span className="callComments-showComments-card-user-name truncate flex1">
                    {comment.owner.first_name} {comment.owner.last_name}
                </span>
                <div className="callComments-showComments-card-user-time flex alignCenter">
                    {getDateTime(comment.updated)}
                    {comment.owner.id === userId && (
                        <>
                            <Button
                                icon={<EditOutlined />}
                                type={"link"}
                                size="small"
                                onClick={() => setEditingComment(true)}
                            />

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
                        </>
                    )}
                </div>
            </div>
            {editingComment ? (
                <>
                    <CommentMentions
                        placeholder={"Enter a Comment"}
                        onChange={handleEditComment}
                        defaultValue={comment.comment}
                    />
                    <div className="flex justifyEnd marginT10">
                        <Button
                            className="marginR10"
                            type="link"
                            onClick={() => setEditingComment(false)}
                        >
                            Cancel
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
                    className="callComments-showComments-card-comment"
                    dangerouslySetInnerHTML={createMarkup(
                        getCleanComment(comment.comment)
                    )}
                />
            )}
        </div>
    );
};

export default function MeetingsSidebar(props) {
    const [note, setNote] = useState("");

    const dispatch = useDispatch();
    const loading = useSelector((state) => state.calls.updatingSidebar);
    const sidebar = useSelector((state) => state.calls.sidebar);
    const allTags = useSelector((state) => state.common.tags);
    const allUsers = useSelector((state) => state.common.users);
    const updatingTags = useSelector((state) => state.calls.updatingTags);
    const debouncedNote = useDebounce(note, callsConfig.AUTOSAVE_DURATION);

    const [isSavingNote, setIsSavingNote] = useState(false);
    const [showMoreComments, setShowMoreComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentMentions, setCommentMentions] = useState([]);

    const options =
        allTags && allTags.length > 0
            ? allTags.map((tag) => {
                  return {
                      id: tag.id,
                      value: tag.name || tag.tag_name,
                  };
              })
            : [];

    useEffect(() => {
        setNote(sidebar.note || "");
    }, [sidebar.note]);

    useEffect(() => {
        if (loading) {
            setShowMoreComments(false);
        }
    }, [loading]);

    useEffect(() => {
        if (
            debouncedNote &&
            sidebar.isReadOnly !== true &&
            sidebar.note !== debouncedNote
        ) {
            setIsSavingNote(true);
            dispatch(updateSidebarNote(debouncedNote, props.type)).then(
                (res) => {
                    if (!res.status) {
                        setIsSavingNote(false);
                    }
                }
            );
        }
    }, [debouncedNote]);

    const handlers = {
        handleNoteChange: (event) => {
            setNote(event.target.value);
        },
        addTag: (tagName, data) => {
            if (data.id) {
                dispatch(
                    updateMeetingTags(data, sidebar.callId, props.type, "add")
                );
            } else {
                dispatch(
                    createNewTag(tagName, sidebar.callId, "calls", props.type)
                );
            }
        },
        removeTag: (data) => {
            dispatch(
                updateMeetingTags(data, sidebar.callId, props.type, "remove")
            );
        },

        /**
         * Handle New Comment
         */
        handleNewComment: (name, value, mentions) => {
            if (name === callsConfig.COMMENTS_NAME) {
                setNewComment(value);
                setCommentMentions(mentions);
            } else {
                const commentAjxData = {
                    comments: newComment,
                    comment: newComment,
                    mentioned_users: commentMentions.map(
                        (mention) => +mention.id
                    ),
                };
                dispatch(
                    updateMeetingComments(props.type, commentAjxData)
                ).then((res) => {
                    if (!res.status) {
                        setNewComment("");
                        setCommentMentions([]);
                    }
                });
            }
        },

        /**
         * Show all comments
         */
        toggleShowMore: () => {
            setShowMoreComments(true);
        },
    };

    return (
        <>
            {sidebar.callId ? (
                <aside className="call-details">
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div className="callSidebar-otherDetails">
                            <div className="callNotes">
                                <p className="callLabel">
                                    {callsConfig.NOTES_LABEL}
                                </p>
                                {sidebar.isReadOnly ? (
                                    <>
                                        {sidebar.note ? (
                                            <div className="callNotes-notereadonly">
                                                <p className="callNotes-notereadonly-date">
                                                    {sidebar.noteDate}
                                                </p>
                                                <div className="callNotes-notereadonly-note">
                                                    {sidebar.note}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="callNotes-nonotes">
                                                No Notes Yet...
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="callNotes-writenote">
                                        <textarea
                                            name={callsConfig.NOTES_NAME}
                                            placeholder={
                                                callsConfig.NOTES_PLACEHOLDER
                                            }
                                            value={note}
                                            onChange={handlers.handleNoteChange}
                                        />
                                        {isSavingNote ? (
                                            <span className="callNotes-writeNotesave saving">
                                                {callsConfig.IS_SAVING}
                                            </span>
                                        ) : (
                                            <i
                                                className="fa fa-check-circle callNotes-writeNotesave"
                                                aria-hidden="true"
                                            ></i>
                                        )}
                                    </div>
                                )}
                            </div>
                            <SidebarTags
                                sideBar={sidebar}
                                handleRemoveTag={handlers.removeTag}
                                handleNewTag={handlers.addTag}
                                options={options}
                                isDisabled={updatingTags}
                            />
                            <CallComments
                                newComment={newComment}
                                handleNewComment={handlers.handleNewComment}
                                sideBar={sidebar}
                                toggleShowMore={handlers.toggleShowMore}
                                users={allUsers}
                                showMoreComments={showMoreComments}
                            />
                        </div>
                    )}
                </aside>
            ) : null}
        </>
    );
}
