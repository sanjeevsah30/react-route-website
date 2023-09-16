import { createContext } from "react";
import CommentCard from "./CommentCard";

export default createContext({
    comments: [],
    next: null,
    prev: null,
    editComment: () => {},
    createComment: () => {},
    deleteComment: () => {},
    containerStyle: {},
    totalComments: 0,
    closeDrawer: () => {},
    Component: CommentCard,
    showReplyAction: false,
    setCommentToReply: () => {},
    loadMoreComments: () => {},
    activeComment: null,
    removeReplyBlock: () => {},
    saveReply: () => {},
    loadMoreReplies: () => {},
    defaultComment: "",
    handleTimeStampClick: () => {},
    addMediaComment: () => {},
});
