import callsConfig from "@constants/MyCalls/index";
import { userMentionsData } from "@tools/helpers";
import React, { useEffect } from "react";
import { Mention, MentionsInput } from "react-mentions";
import { useSelector } from "react-redux";
import "./commentInput.scss";

const CommentInput = React.forwardRef((props, ref) => {
    const users = userMentionsData(useSelector((state) => state.common.users));
    const { comment, setComment, placeholder } = props;

    const handleChange = (event, newValue, newPlainTextValue, mentions) => {
        setComment({
            comment: newValue,
            mentioned_users: mentions,
        });
    };
    useEffect(() => {
        const input = document.querySelector(".mentions__input");
        const len = comment?.comment?.length;
        input.focus();
        input.setSelectionRange(len, len);
    }, []);
    return (
        <MentionsInput
            value={comment.comment}
            onChange={handleChange}
            markup="__type__[[[__display__]]](__id__)"
            placeholder={placeholder}
            className="mentions"
            autoFocus
            {...props}
        >
            <Mention
                type="user"
                markup={`${callsConfig.COMMENTS_OPEN_DELIMITER}__display__(__id__)${callsConfig.COMMENTS_CLOSE_DELIMITER}`}
                trigger="@"
                appendSpaceOnAdd
                data={users}
                className="mentions__mention"
            />
        </MentionsInput>
    );
});

CommentInput.defaultProps = {
    placeholder: "Add a comment",
};

export default React.memo(CommentInput);
