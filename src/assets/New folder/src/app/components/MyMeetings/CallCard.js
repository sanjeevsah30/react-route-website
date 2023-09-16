import React, { useEffect, useRef, useState } from "react";
import callsConfig from "@constants/MyCalls";
import { Tag } from "@reusables";
import { Button, Select } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import { openNotification } from "@store/common/actions";
import GoogleMeetSvg from "app/static/svg/GoogleMeetSvg";
import PhoneSvg from "app/static/svg/PhoneSvg";
import ZoomSvg from "app/static/svg/ZoomSvg";
import OutlookSvg from "app/static/svg/OutlookSvg";
import Icon from "@presentational/reusables/Icon";

const { Option } = Select;

export default function CallCard(props) {
    let btnLabel = callsConfig.INITIATE_CALL;
    const handleBtnClick = () => {
        if (!props.call.location) {
            openNotification(
                "warning",
                "Not Supported",
                `Join call is not supported for ${props.call.conference_tool}`
            );
            return;
        }
        window.open(props.call.location, "_blank");
    };

    const [showMore, setShowMore] = useState(false);
    const [showBtn, setShowBtn] = useState(false);
    const callAgenda = useRef(null);

    useEffect(() => {
        const ele = callAgenda.current;

        if (ele && ele.scrollHeight - 1 > ele.clientHeight) {
            setShowBtn(true);
        }
    }, []);

    return (
        <div
            className={`upcomming__call__card google__meet ${
                props?.call?.conference_tool
                    ? props?.call?.conference_tool
                    : "no_medium"
            }
        `}
        >
            <div className="call_title">
                {props.call.summary || <MinusOutlined />}
            </div>

            <div
                ref={callAgenda}
                className={`call_agenda ${showMore ? "show-more" : ""}`}
                dangerouslySetInnerHTML={{
                    __html: props.call.description
                        ? props.call.description
                        : props.call.summary,
                }}
            ></div>

            {showBtn && (
                <div
                    className="call_show_more_btn"
                    onClick={() => {
                        setShowMore((prev) => !prev);
                    }}
                >
                    {showMore ? "Show Less" : "Show More"}
                </div>
            )}

            <div
                className="footer"
                style={{
                    justifyContent: props?.call?.conference_tool
                        ? "space-between"
                        : "flex-end",
                }}
            >
                {props?.call?.conference_tool === "google_meet" ? (
                    <GoogleMeetSvg />
                ) : props?.call?.conference_tool === "zoom" ? (
                    <ZoomSvg />
                ) : props?.call?.conference_tool === "outlook" ? (
                    <OutlookSvg />
                ) : null}
                <div className="flex alignCenter justifyCenter">
                    {props?.call?.call_types?.id && !props.showOwnerActions ? (
                        <Tag
                            tagClass="call_type_tag"
                            label={props.call.call_types.type}
                        />
                    ) : (
                        <>
                            {props.showOwnerActions ? (
                                <Select
                                    className="custom__select"
                                    name=""
                                    placeholder="Select Call Type"
                                    onChange={(value) => {
                                        props.handleNewType(
                                            value,
                                            props.call.id
                                        );
                                    }}
                                    suffixIcon={
                                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                                    }
                                    dropdownClassName={
                                        "account_select_dropdown"
                                    }
                                    value={
                                        props.activeCallCategory
                                            ? props.activeCallCategory.id
                                            : 0
                                    }
                                    dropdownRender={(menu) => (
                                        <div>
                                            <span className={"topbar-label"}>
                                                Select Call Type
                                            </span>
                                            {menu}
                                        </div>
                                    )}
                                >
                                    {props.callCategories.map((category) => (
                                        <Option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.type}
                                        </Option>
                                    ))}
                                </Select>
                            ) : null}
                        </>
                    )}
                    <Button
                        disabled={!props.call.conference_tool}
                        icon={<PhoneSvg />}
                        type={"secondary"}
                        onClick={handleBtnClick}
                    >
                        {btnLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
