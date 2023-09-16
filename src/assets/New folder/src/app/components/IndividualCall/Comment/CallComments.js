import React, { useEffect, useRef, useState } from "react";
import config from "@constants/IndividualCall";
import { timeToSeconds, uid } from "@helpers";
import CommentMentions from "./CommentMentions";
import { Button } from "antd";
import CommentCard from "./CommentCard";
import Spinner from "@presentational/reusables/Spinner";
import { useDispatch } from "react-redux";
import { updateCommentsList } from "@store/calls/actions";

const Comments = (props) => {
    const dispatch = useDispatch();
    const baseClass = "individualcall-comments";
    const mentionsRef = useRef();

    const [isLoading, setisLoading] = useState(false);

    const handleTimeStampClick = (e) => {
        if (e && e.target.closest("a") && e.target.closest("a").dataset.time) {
            props.seekToPoint(
                timeToSeconds(e.target.closest("a").dataset.time),
                true
            );
            props.toggleComments();
        }
    };

    const updateCommentList = (isDeleted, id, comment) => {
        if (isDeleted) {
            props.updateCommentsList((c) => c.filter((t) => t.id !== id));
        } else {
            const cmtIdx = props.comments.findIndex((c) => c.id === id);
            const updatedComments = [...props.comments];
            updatedComments[cmtIdx] = comment;
            props.updateCommentsList(updatedComments);
        }
        dispatch(updateCommentsList(isDeleted, id, comment));
    };

    useEffect(() => {
        mentionsRef.current.hasFocus(props.isVisible);
    }, [props.isVisible]);

    const commentsToShow =
        props.comments && props.comments.length > 0 ? (
            props.comments.map((comment, index) => {
                return (
                    <div
                        className={`${baseClass}-main-comment`}
                        onClick={() => props.setactiveComment(index)}
                        key={uid() + index}
                    >
                        <CommentCard
                            baseClass={baseClass}
                            commentReply={props.commentReply}
                            handleReplyChange={props.handleReplyChange}
                            cancelReply={props.cancelReply}
                            setReply={props.setReply}
                            confirmReply={props.confirmReply}
                            index={index}
                            comment={comment}
                            handleTimeStampClick={handleTimeStampClick}
                            updateCommentsList={updateCommentList}
                            setLoading={setisLoading}
                        />
                    </div>
                );
            })
        ) : (
            <div className={`${baseClass}-main-nocomments`}>
                {config.NOCOMMENTS}
            </div>
        );

    return (
        <Spinner loading={isLoading}>
            <div className={`${baseClass}-container`}>
                <div className="borderBottomBold paddingLR20 flex justifySpaceBetween alignCenter">
                    <p className="font18 bolder">Comments</p>
                    <Button
                        type="text"
                        className="header"
                        onClick={() => props.toggleComments()}
                    >
                        &times;
                    </Button>
                </div>
                <div className={`${baseClass}-main`}>
                    <div className={`${baseClass}-main-comment addcomment`}>
                        {/* <Label label={config.ADDCOMMENT} /> */}
                        <CommentMentions
                            placeholder={config.ENTERCOMMENT}
                            onChange={(value, mentions) => {
                                props.setcommentToAdd(value);
                                props.setCommentMentions(mentions);
                            }}
                            defaultValue={props.commentToAdd}
                            ref={mentionsRef}
                        />
                        <div className={"addcommentbutton"}>
                            <Button
                                type="primary"
                                shape="round"
                                onClick={() => {
                                    props.addComment();
                                    mentionsRef.current.clearState();
                                }}
                            >
                                {config.ADDCOMMENT}
                            </Button>
                        </div>
                    </div>
                    {commentsToShow}
                </div>
            </div>
        </Spinner>
    );
};

export default Comments;
