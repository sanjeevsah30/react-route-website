import React from "react";
import CommentsContext from "./CommentsContext";
import CommentTabUI from "./CommentTabUI";

function CommentsTab({ children, ...rest }) {
    const { Provider } = CommentsContext;

    return (
        <Provider value={{ ...rest }}>
            <CommentTabUI />
        </Provider>
    );
}

export default CommentsTab;
