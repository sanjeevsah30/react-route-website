import React from "react";
import { Button, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function CallHover(props) {
    return (
        <div className="callhover">
            {props.call && (
                <>
                    <p className="details">
                        <span className={"paragraph strong ellipsis"}>
                            {props.title}:
                        </span>
                        <span className={"paragraph ellipsis"}>
                            {props.value}
                        </span>
                    </p>
                    {/* <p className="details">
                        <Tooltip
                            destroyTooltipOnHide
                            title={'Participants'}
                            placement="topLeft"
                        >
                            <span>
                                <UserOutlined /> -{' '}
                            </span>
                        </Tooltip>
                    </p> */}
                    <a
                        href={`${window.location.origin}/call/${props.call.id}`}
                        target={"_target"}
                    >
                        <Tooltip
                            destroyTooltipOnHide
                            title={
                                props.showingSampleData
                                    ? "Not available for sample data"
                                    : ""
                            }
                            placement="topLeft"
                        >
                            <Button
                                shape={"round"}
                                type="primary"
                                disabled={props.showingSampleData}
                            >
                                View Call
                            </Button>
                        </Tooltip>
                    </a>
                </>
            )}
        </div>
    );
}
