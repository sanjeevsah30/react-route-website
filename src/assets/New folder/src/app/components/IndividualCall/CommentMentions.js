import callsConfig from "@constants/MyCalls/index";
import { userMentionsData } from "@tools/helpers";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import { useSelector } from "react-redux";

const CommentMentions = React.forwardRef((props, ref) => {
    const { defaultValue, onChange, placeholder } = props;
    const inputRef = useRef(null);
    const allUsers = useSelector((state) => state.common.users);
    const [state, setState] = useState({
        value: "",
        mentions: [],
    });

    useEffect(() => {
        if (defaultValue) {
            setState((st) => ({
                ...st,
                value: defaultValue,
            }));
        }
    }, [defaultValue]);

    useImperativeHandle(ref, () => ({
        clearState() {
            setState({
                value: "",
                mentions: [],
            });
        },
        hasFocus(status) {
            if (status) {
                inputRef.current.focus();
            } else {
                inputRef.current.blur();
            }
        },
    }));

    return (
        <div ref={ref}>
            <MentionsInput
                value={state.value}
                onChange={(event, value, newPlainTextValue, mentions) =>
                    setState({ value, mentions })
                }
                placeholder={placeholder}
                className="callComments-addComment-write"
                onBlur={() => {
                    onChange(state.value, state.mentions);
                }}
                inputRef={inputRef}
            >
                <Mention
                    markup={`${callsConfig.COMMENTS_OPEN_DELIMITER}__display__(__id__)${callsConfig.COMMENTS_CLOSE_DELIMITER}`}
                    trigger="@"
                    appendSpaceOnAdd
                    data={userMentionsData(allUsers)}
                    className="mentions__mention"
                />
            </MentionsInput>
        </div>
    );
});

export default React.memo(CommentMentions);
