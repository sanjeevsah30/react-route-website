import { updateCallName } from "@store/calls/actions";
import { Button, Input, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { EditOutlined } from "@ant-design/icons";

export default function CallName({ callId, title, showOwnerActions }) {
    const dispatch = useDispatch();
    const [editName, setEditName] = useState(false);
    const [meetingTitle, setMeetingTitle] = useState(title);

    useEffect(() => {
        setMeetingTitle(title);
    }, [title]);

    const updateMeetingName = () => {
        dispatch(updateCallName(callId, meetingTitle));
        setEditName(false);
    };

    return (
        <>
            {editName ? (
                <div className="edit-callname">
                    <Input
                        autoFocus
                        size="small"
                        onBlur={updateMeetingName}
                        onPressEnter={updateMeetingName}
                        value={meetingTitle}
                        onFocus={(evt) => evt.target.select()}
                        onChange={(evt) => setMeetingTitle(evt.target.value)}
                    />
                </div>
            ) : (
                <Tooltip
                    destroyTooltipOnHide
                    title={`${meetingTitle}`}
                    overlayInnerStyle={{ textTransform: "capitalize" }}
                    placement="topLeft"
                >
                    <div className="flex alignCenter">
                        <p
                            style={{
                                maxWidth: "400px",
                            }}
                            className="paragraph strong ellipsis callname font16 capitalize"
                        >
                            {meetingTitle}
                        </p>
                        {showOwnerActions && (
                            <span>
                                <Button
                                    type="link"
                                    icon={<EditOutlined />}
                                    onClick={() => setEditName(true)}
                                />
                            </span>
                        )}
                    </div>
                </Tooltip>
            )}
        </>
    );
}
