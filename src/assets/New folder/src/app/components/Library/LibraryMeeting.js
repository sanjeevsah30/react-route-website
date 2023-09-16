/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useSelector } from "react-redux";
import { Button, Popconfirm, Tooltip, Card, Avatar } from "antd";
import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import commonConfig from "@constants/common";
import { getDateTime } from "@tools/helpers";

export default function LibraryMeeting({
    id,
    owner,
    deleteMeeting,
    handlePlayVideo,
    handleViewOriginal,
    meeting,
    start_time,
    end_time,
    note,
    created,
}) {
    const user = useSelector((state) => state.auth);
    const isSample = useSelector((state) => state.library.sample);

    const hasAccess = () => {
        return owner.id === user.id || user.designation === commonConfig.ADMIN;
    };

    return (
        <Card
            className={"library-meeting"}
            actions={[
                <Popconfirm
                    // placement="topRight"
                    title={"Are you sure to delete this call?"}
                    onConfirm={() => deleteMeeting(id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        className="call-delete"
                        icon={<DeleteOutlined />}
                        type="link"
                        danger
                        disabled={!hasAccess() || isSample}
                    />
                </Popconfirm>,
                <Tooltip
                    destroyTooltipOnHide
                    placement="topLeft"
                    title={"View Original"}
                >
                    <a
                        className="display-inline"
                        style={{ pointerEvents: isSample ? "none" : "auto" }}
                        href={
                            isSample
                                ? ""
                                : `${window.location.origin}/call/${meeting}`
                        }
                        target={"_target"}
                    >
                        <Button
                            icon={<PlayCircleOutlined />}
                            type={"link"}
                            disabled={isSample}
                        />
                    </a>
                </Tooltip>,
                <Button
                    shape={"round"}
                    type={"primary"}
                    onClick={() => {
                        handlePlayVideo(
                            {
                                id: meeting,
                                start_time: start_time,
                                end_time: end_time,
                            },
                            true
                        );
                    }}
                    disabled={isSample}
                >
                    Play
                </Button>,
            ]}
        >
            <div className="name-section">
                <p className="name">
                    <span className="user">
                        <Avatar
                            size={24}
                            style={{
                                backgroundColor: "#7265e6",
                                verticalAlign: "middle",
                            }}
                        >
                            {owner.first_name.split("")[0].toUpperCase()}
                        </Avatar>
                        {`${owner.first_name} ${owner.last_name}` || "User"}
                    </span>
                    <span className="created_on">
                        <i>{getDateTime(created, "date")}</i>
                    </span>
                </p>
                <p className="note">{note}</p>
            </div>
        </Card>
    );
}

LibraryMeeting.defaultProps = {
    owner: {
        first_name: "User",
    },
};
