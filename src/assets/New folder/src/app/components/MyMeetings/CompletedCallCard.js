import React, { memo, useContext, useEffect, useRef, useState } from "react";
import {
    formatFloat,
    getDateTime,
    getDisplayName,
    getDuration,
    goToAccount,
    goToTranscriptTab,
    secondsToTime,
    uid,
} from "@helpers";
import { Tooltip, Popover, Popconfirm, Row, Col, Input } from "antd";
import { CommentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateCallName } from "@store/calls/actions";
import MonologuePlayer from "@presentational/reusables/MonologuePlayer";

import TwoUserSvg from "app/static/svg/TwoUserSvg";
import MoreSvg from "app/static/svg/MoreSvg";
import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import SaleTaskSvg from "app/static/svg/SalesTaskSvg";
import Dot from "@presentational/reusables/Dot";
import PlaySvg from "app/static/svg/PlaySvg";
import ProgressSvg from "@presentational/reusables/ProgressSvg";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";
import { deleteCallById } from "@store/callListSlice/callListSlice";
import CustomTagSelector from "../Resuable/Select/CustomTagSelector";
import CustomTypeSelector from "../Resuable/Select/CustomTypeSelector";
import { capitalize } from "lodash";

const processingInfo = Object.freeze({
    processing: {
        value: "processing",
        text: "PROCESSING",
        fill: "#1A62F2",
        bg: "#1A62F233",
    },
    not_recorded: {
        value: "not_recorded",
        text: "NOT RECORDED",
        fill: "#FF4D4F",
        bg: "#FF4D4F33",
    },
    error_processing: {
        value: "error_processing",
        text: "ERROR PROCESSING",
        fill: "#FF4D4F",
        bg: "#FF4D4F33",
    },
});

function CompletedCallCard({ viewMore, setViewMore, index, call, ...props }) {
    const getTalkRatio = () => {
        const talkRatio = +(call?.stats?.owner_talk_ratio * 100).toFixed(2);
        let color = "";
        if (talkRatio < 40) {
            color = "warn";
        } else if (talkRatio <= 60 && talkRatio >= 40) {
            color = "success";
        } else {
            color = "danger";
        }

        return {
            value: talkRatio,
            color: color,
        };
    };
    const childRef = useRef();
    const parentRef = useRef();

    useEffect(() => {
        const onHover = () => {
            parentRef.current.classList?.toggle("active_hover");
        };

        if (childRef.current && call?.sales_task?.id) {
            childRef.current?.addEventListener("mouseenter", onHover);
            childRef.current?.addEventListener("mouseleave", onHover);
        }
        return () => {
            childRef.current?.removeEventListener("mouseenter", onHover);
            childRef.current?.removeEventListener("mouseleave", onHover);
        };
    }, []);

    const dispatch = useDispatch();
    const { versionData, domain } = useSelector(({ common }) => common);

    const [editName, setEditName] = useState(false);
    const [meetingTitle, setMeetingTitle] = useState(call.title);

    const updateMeetingName = (e) => {
        e.stopPropagation();
        dispatch(updateCallName(call.id, meetingTitle));
        setEditName(false);
    };

    const talkRatio = getTalkRatio();
    // const callType = call.call_type ? call.call_type.type : null;
    const callTags = call.tags || [];
    const displayName = getDisplayName({ ...call.owner });
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);

    const { meetingType } = useContext(HomeContext);
    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);

    let date = new Date(call?.stats?.audited_date);
    return meetingType === MeetingTypeConst.chat ? (
        <>
            <div
                className={`completed_call_card active_hover ${
                    processingInfo[call?.processing_status] ? "fadedCall" : ""
                }`}
                onClick={() => {
                    if (editName) return;
                    const url =
                        call.conference_tool === "convin_qms"
                            ? `chat/qms/${call.id}`
                            : `chat/${call.id}`;
                    const win = window.open(url);
                    win.focus();
                }}
                ref={parentRef}
            >
                <Row className="completed_call_card_top_section mine_shaft_cl">
                    <Col span={6} className="call_title_container">
                        <div>
                            {processingInfo[call?.processing_status] ? (
                                <>
                                    <span
                                        className="processing_text marginB10"
                                        style={{
                                            color: processingInfo[
                                                call?.processing_status
                                            ].fill,
                                            background:
                                                processingInfo[
                                                    call?.processing_status
                                                ].bg,
                                        }}
                                    >
                                        <span>
                                            {
                                                processingInfo[
                                                    call?.processing_status
                                                ].text
                                            }
                                        </span>
                                    </span>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                        {editName ? (
                            <Input
                                autoFocus
                                size="small"
                                onBlur={updateMeetingName}
                                onPressEnter={updateMeetingName}
                                value={meetingTitle}
                                onFocus={(evt) => evt.target.select()}
                                onChange={(evt) =>
                                    setMeetingTitle(evt.target.value)
                                }
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            />
                        ) : (
                            <Tooltip destroyTooltipOnHide title={meetingTitle}>
                                <div className="call_title text_ellipsis">
                                    {meetingTitle}
                                </div>
                            </Tooltip>
                        )}

                        <div className="font12 dove_gray_cl">
                            <span>
                                {getDateTime(
                                    call.start_time,
                                    undefined,
                                    undefined,
                                    "MMM dd, yyyy - HH:MM"
                                )}
                            </span>

                            <Dot
                                height="8px"
                                width="8px"
                                className="marginLR8 silver_bg"
                            />
                            <span>
                                {call.start_time && call.end_time
                                    ? getDuration(
                                          call.start_time,
                                          call.end_time
                                      )
                                    : ""}
                            </span>
                        </div>
                        {!!call.stats?.auditor?.id && (
                            <span className="flex alignCenter font12">
                                <span className="marginR8 dusty_gray_cl ">
                                    Audited by
                                </span>
                                <span>
                                    {call?.stats?.auditor?.first_name}{" "}
                                    {call?.stats?.auditor?.last_name}
                                </span>
                            </span>
                        )}

                        <div className="flex alignCenter">
                            <div className="flex alignCenter">
                                {call.participants.length ? (
                                    <Tooltip
                                        destroyTooltipOnHide
                                        title={
                                            <ul
                                                style={{
                                                    margin: 0,
                                                    padding: 0,
                                                }}
                                            >
                                                {call.participants.map(
                                                    (participant) => (
                                                        <li key={participant}>
                                                            {" "}
                                                            {participant}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        }
                                        placement="topLeft"
                                    >
                                        <span className="flex alignCenter">
                                            <TwoUserSvg />
                                            &nbsp;
                                            <span className="owner_text">
                                                {call.participants.length}
                                            </span>
                                        </span>
                                    </Tooltip>
                                ) : (
                                    <span className="owner_text">
                                        <TwoUserSvg /> -{" "}
                                    </span>
                                )}
                            </div>
                            {!!call.commented_initials?.length && (
                                <>
                                    <Dot
                                        height="8px"
                                        width="8px"
                                        className="marginLR8 silver_bg"
                                    />

                                    <CallCommentInitials
                                        commented_initials={
                                            call.commented_initials || []
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </Col>
                    <Col span={4} className="owner_name_container">
                        {call?.owner ? (
                            <span className="owner_name text_ellipsis">
                                {displayName}
                            </span>
                        ) : (
                            <span className="call_text">-</span>
                        )}
                    </Col>
                    <Col className={`flex alignCenter`} span={4}>
                        <Tooltip
                            destroyTooltipOnHide
                            title={"View this account"}
                        >
                            <div
                                className={`${
                                    call?.sales_task?.id ? "client_name" : ""
                                } `}
                                onClick={(e) => {
                                    if (!call?.sales_task?.id) {
                                        return;
                                    }

                                    goToAccount({
                                        domain,
                                        id: call.sales_task.id,
                                    });
                                    e.stopPropagation();
                                }}
                                ref={childRef}
                            >
                                <span
                                    style={{
                                        transform: "scale(0.8)",
                                        fontSize: 0,
                                    }}
                                >
                                    <SaleTaskSvg />
                                </span>

                                <span className="owner_name marginL8 text_ellipsis">
                                    {call.sales_task
                                        ? call.sales_task.name ||
                                          call.sales_task.company_name ||
                                          "-"
                                        : "-"}
                                </span>
                                <span
                                    className={`lead_score_type ${call?.lead_analysis?.classification?.toLowerCase()}`}
                                >
                                    {call?.lead_analysis?.classification?.toUpperCase()}
                                </span>
                            </div>
                        </Tooltip>
                    </Col>

                    <Col span={3} className="call_stat primary_cl">
                        {versionData?.domain_type === "b2c" ? (
                            <Col span={3} className="call_stat primary_cl">
                                {!!call.stats?.auditor?.id ? (
                                    typeof call?.stats?.manual_score ===
                                    "number" ? (
                                        <ProgressSvg
                                            percentage={
                                                formatFloat(
                                                    call.stats.manual_score
                                                ) || 0
                                            }
                                            color={
                                                call?.stats?.manual_score >=
                                                stats_threshold.good
                                                    ? "#52C41A"
                                                    : call?.stats
                                                          ?.manual_score >=
                                                      stats_threshold.bad
                                                    ? "#ECA51D"
                                                    : "#FF6365"
                                            }
                                            stroke={
                                                call?.stats?.manual_score >=
                                                stats_threshold.good
                                                    ? "#52C41A33"
                                                    : call?.stats
                                                          ?.manual_score >=
                                                      stats_threshold.bad
                                                    ? "#ECA51D33"
                                                    : "#FF636533"
                                            }
                                            circleSize={44}
                                            strokeWidth={4}
                                            fontSize={12}
                                            fontWeight={600}
                                        />
                                    ) : (
                                        <div className="text-center width3">
                                            <p className="blank_hyphen marginAuto"></p>
                                        </div>
                                    )
                                ) : typeof call?.stats?.ai_score ===
                                  "number" ? (
                                    <ProgressSvg
                                        percentage={
                                            formatFloat(call.stats.ai_score) ||
                                            0
                                        }
                                        color={
                                            call?.stats?.ai_score >=
                                            stats_threshold.good
                                                ? "#52C41A"
                                                : call?.stats?.ai_score >=
                                                  stats_threshold.bad
                                                ? "#ECA51D"
                                                : "#FF6365"
                                        }
                                        stroke={
                                            call?.stats?.ai_score >=
                                            stats_threshold.good
                                                ? "#52C41A33"
                                                : call?.stats?.ai_score >=
                                                  stats_threshold.bad
                                                ? "#ECA51D33"
                                                : "#FF636533"
                                        }
                                        circleSize={44}
                                        strokeWidth={4}
                                        fontSize={12}
                                        fontWeight={600}
                                    />
                                ) : (
                                    <div className="text-center width3">
                                        <p className="blank_hyphen marginAuto"></p>
                                    </div>
                                )}
                            </Col>
                        ) : (
                            ""
                        )}
                    </Col>
                    <Col span={6} className="">
                        <CallCardTags
                            showOwnerActions={props.showOwnerActions}
                            isOnSearch={props.isOnSearch}
                            handleNewType={props.handleNewType}
                            call_id={call.id}
                            _id={
                                props.activeCallCategory
                                    ? props.activeCallCategory.id
                                    : 0
                            }
                            callCategories={props.callCategories}
                            callTags={callTags}
                        />
                    </Col>

                    <Col span={1}>
                        {props.showOwnerActions && (
                            <Popover
                                content={
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <Popconfirm
                                            title="Are you sure to delete this meeting?"
                                            onConfirm={(e) => {
                                                e.stopPropagation();
                                                dispatch(
                                                    deleteCallById(call.id)
                                                );
                                                setMoreOptionsVisible(false);
                                            }}
                                            onCancel={(e) =>
                                                e.stopPropagation()
                                            }
                                        >
                                            <div className="option">Delete</div>
                                        </Popconfirm>

                                        <div
                                            onClick={() => {
                                                setEditName(true);
                                                setMoreOptionsVisible(false);
                                            }}
                                            className="option"
                                        >
                                            Edit Name
                                        </div>
                                    </div>
                                }
                                title="More Options"
                                trigger="click"
                                visible={moreOptionsVisible}
                                onVisibleChange={(visible) =>
                                    setMoreOptionsVisible(visible)
                                }
                                overlayClassName={
                                    "completed_card_more_options_popover"
                                }
                                placement="bottom"
                            >
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}
                                >
                                    <MoreSvg />
                                </div>
                            </Popover>
                        )}
                    </Col>
                </Row>

                {!!call?.search_context?.length && (
                    <div className="borderTop widthp100 callCardMonolgueContainer">
                        <Monologue
                            title={call.title}
                            id={call.id}
                            monologues={call.search_context}
                        />
                    </div>
                )}
            </div>
        </>
    ) : (
        <div
            className={`completed_call_card active_hover ${
                processingInfo[call?.processing_status] ? "fadedCall" : ""
            }`}
            onClick={() => {
                if (editName) return;
                const url =
                    call.conference_tool === "convin_qms"
                        ? `call/qms/${call.id}`
                        : `call/${call.id}`;
                const win = window.open(url);
                win.focus();
            }}
            ref={parentRef}
        >
            <Row className="completed_call_card_top_section mine_shaft_cl">
                <Col span={6} className="call_title_container">
                    <div>
                        {processingInfo[call?.processing_status] ? (
                            <>
                                <span
                                    className="processing_text marginB10"
                                    style={{
                                        color: processingInfo[
                                            call?.processing_status
                                        ].fill,
                                        background:
                                            processingInfo[
                                                call?.processing_status
                                            ].bg,
                                    }}
                                >
                                    <span>
                                        {
                                            processingInfo[
                                                call?.processing_status
                                            ].text
                                        }
                                    </span>
                                </span>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    {editName ? (
                        <Input
                            autoFocus
                            size="small"
                            onBlur={updateMeetingName}
                            onPressEnter={updateMeetingName}
                            value={meetingTitle}
                            onFocus={(evt) => evt.target.select()}
                            onChange={(evt) =>
                                setMeetingTitle(evt.target.value)
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        />
                    ) : (
                        <Tooltip destroyTooltipOnHide title={meetingTitle}>
                            <div className="call_title text_ellipsis">
                                {meetingTitle}
                            </div>
                        </Tooltip>
                    )}

                    <div className="font12 dove_gray_cl">
                        <span>
                            {getDateTime(
                                call.start_time,
                                undefined,
                                undefined,
                                "MMM dd, yyyy - HH:MM"
                            )}
                        </span>
                    </div>
                    {!!call.stats?.auditor?.id && (
                        <span className="flex alignCenter font12">
                            <span className="marginR8 dusty_gray_cl ">
                                Audited by
                            </span>
                            <span>
                                {call?.stats?.auditor?.first_name}{" "}
                                {call?.stats?.auditor?.last_name}
                            </span>
                            {!!call.stats.audited_date ? (
                                <>
                                    <Dot
                                        height="8px"
                                        width="8px"
                                        className="marginLR8 silver_bg"
                                    />
                                    <span className="font12 dove_gray_cl">{`${date.getDate()}/${
                                        date.getMonth() + 1
                                    }/${date.getFullYear()}`}</span>
                                </>
                            ) : (
                                <></>
                            )}
                        </span>
                    )}

                    <div
                        className="flex alignCenter"
                        style={{ color: "#666666" }}
                    >
                        <ClockCircleOutlined />
                        <span style={{ marginLeft: "4px" }}>
                            {call.start_time && call.end_time
                                ? getDuration(call.start_time, call.end_time)
                                : ""}
                        </span>
                        <Dot
                            height="4px"
                            width="4px"
                            className="marginLR8 silver_bg"
                        />
                        {call.participants.length ? (
                            <Tooltip
                                destroyTooltipOnHide
                                title={
                                    <ul style={{ margin: 0, padding: 0 }}>
                                        {call.participants.map(
                                            (participant) => (
                                                <li key={participant}>
                                                    {" "}
                                                    {participant}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                }
                                placement="topLeft"
                            >
                                <span className="flex alignCenter">
                                    <TwoUserSvg />
                                    &nbsp;
                                    <span className="owner_text">
                                        {call.participants.length}
                                    </span>
                                </span>
                            </Tooltip>
                        ) : (
                            <span className="owner_text">
                                <TwoUserSvg /> -{" "}
                            </span>
                        )}
                        <Dot
                            height="4px"
                            width="4px"
                            className="marginLR8 silver_bg"
                        />
                        {call.commented_initials.length ? (
                            <Tooltip
                                destroyTooltipOnHide
                                title={
                                    <ul style={{ margin: 0, padding: 0 }}>
                                        {call.commented_initials.map(
                                            (commented_initial) => (
                                                <li key={commented_initial}>
                                                    {" "}
                                                    {commented_initial}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                }
                                placement="topLeft"
                            >
                                <CommentOutlined />
                                &nbsp;
                                <span className="owner_text">
                                    {call.commented_initials.length}
                                </span>
                            </Tooltip>
                        ) : (
                            <span className="owner_text flex alignCenter">
                                <CommentOutlined /> &nbsp; -{" "}
                            </span>
                        )}
                    </div>
                </Col>
                <Col span={4} className="owner_name_container">
                    {call?.owner ? (
                        <span className="owner_name text_ellipsis">
                            {displayName}
                        </span>
                    ) : (
                        <span className="call_text">-</span>
                    )}
                </Col>
                <Col className={`flex alignCenter`} span={4}>
                    <Tooltip destroyTooltipOnHide title={"View this account"}>
                        <div
                            className={`${
                                call?.sales_task?.id ? "client_name" : ""
                            } `}
                            onClick={(e) => {
                                if (!call?.sales_task?.id) {
                                    return;
                                }

                                goToAccount({ domain, id: call.sales_task.id });
                                e.stopPropagation();
                            }}
                            ref={childRef}
                        >
                            <span
                                style={{
                                    transform: "scale(0.8)",
                                }}
                            >
                                <SaleTaskSvg />
                            </span>

                            <span className="owner_name marginL8 text_ellipsis">
                                {call.sales_task
                                    ? call.sales_task.name ||
                                      call.sales_task.company_name ||
                                      "-"
                                    : "-"}
                            </span>

                            <span
                                className={`lead_score_type ${call?.lead_analysis?.classification?.toLowerCase()}`}
                            >
                                {capitalize(
                                    call?.lead_analysis?.classification
                                )}
                            </span>
                        </div>
                    </Tooltip>
                </Col>
                {versionData?.domain_type === "b2c" ? (
                    <></>
                ) : (
                    <Col span={2}>
                        {talkRatio.value === 0 ? (
                            <div className="text-center width3">
                                <p className="blank_hyphen marginAuto"></p>
                            </div>
                        ) : (
                            <div
                                className="call_stat"
                                style={{
                                    color:
                                        talkRatio.value >= 40 &&
                                        talkRatio.value <= 60
                                            ? "#52C41A"
                                            : "#FF6365",
                                }}
                            >
                                {" "}
                                {formatFloat(talkRatio.value, 2)}%
                            </div>
                        )}
                    </Col>
                )}
                {versionData?.domain_type === "b2c" ? (
                    <Col span={3} className="call_stat primary_cl">
                        {!!call.stats?.auditor?.id ? (
                            typeof call?.stats?.manual_score === "number" ? (
                                <ProgressSvg
                                    percentage={
                                        formatFloat(call.stats.manual_score) ||
                                        0
                                    }
                                    color={
                                        call?.stats?.manual_score >=
                                        stats_threshold.good
                                            ? "#52C41A"
                                            : call?.stats?.manual_score >=
                                              stats_threshold.bad
                                            ? "#ECA51D"
                                            : "#FF6365"
                                    }
                                    stroke={
                                        call?.stats?.manual_score >=
                                        stats_threshold.good
                                            ? "#52C41A33"
                                            : call?.stats?.manual_score >=
                                              stats_threshold.bad
                                            ? "#ECA51D33"
                                            : "#FF636533"
                                    }
                                    circleSize={44}
                                    strokeWidth={4}
                                    fontSize={12}
                                    fontWeight={600}
                                />
                            ) : (
                                <div className="text-center width3">
                                    <p className="blank_hyphen marginAuto"></p>
                                </div>
                            )
                        ) : typeof call?.stats?.ai_score === "number" ? (
                            <ProgressSvg
                                percentage={
                                    formatFloat(call.stats.ai_score) || 0
                                }
                                color={
                                    call?.stats?.ai_score >=
                                    stats_threshold.good
                                        ? "#52C41A"
                                        : call?.stats?.ai_score >=
                                          stats_threshold.bad
                                        ? "#ECA51D"
                                        : "#FF6365"
                                }
                                stroke={
                                    call?.stats?.ai_score >=
                                    stats_threshold.good
                                        ? "#52C41A33"
                                        : call?.stats?.ai_score >=
                                          stats_threshold.bad
                                        ? "#ECA51D33"
                                        : "#FF636533"
                                }
                                circleSize={44}
                                strokeWidth={4}
                                fontSize={12}
                                fontWeight={600}
                            />
                        ) : (
                            <div className="text-center width3">
                                <p className="blank_hyphen marginAuto"></p>
                            </div>
                        )}
                    </Col>
                ) : (
                    <></>
                )}
                <Col span={6} className="">
                    <CallCardTags
                        showOwnerActions={props.showOwnerActions}
                        isOnSearch={props.isOnSearch}
                        handleNewType={props.handleNewType}
                        call_id={call.id}
                        _id={
                            props.activeCallCategory
                                ? props.activeCallCategory.id
                                : 0
                        }
                        callCategories={props.callCategories}
                        callTags={callTags}
                    />
                </Col>
                <Col span={1}>
                    {props.showOwnerActions && (
                        <Popover
                            content={
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Popconfirm
                                        title="Are you sure to delete this meeting?"
                                        onConfirm={(e) => {
                                            e.stopPropagation();
                                            dispatch(deleteCallById(call.id));
                                            setMoreOptionsVisible(false);
                                        }}
                                        onCancel={(e) => e.stopPropagation()}
                                    >
                                        <div className="option">Delete</div>
                                    </Popconfirm>

                                    <div
                                        onClick={() => {
                                            setEditName(true);
                                            setMoreOptionsVisible(false);
                                        }}
                                        className="option"
                                    >
                                        Edit Name
                                    </div>
                                </div>
                            }
                            title="More Options"
                            trigger="click"
                            visible={moreOptionsVisible}
                            onVisibleChange={(visible) =>
                                setMoreOptionsVisible(visible)
                            }
                            overlayClassName={
                                "completed_card_more_options_popover"
                            }
                            placement="bottom"
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                            >
                                <MoreSvg />
                            </div>
                        </Popover>
                    )}
                </Col>
                {/* <Col span={1} className="flex alignStart justifyEnd">
                    <div className="flex alignCenter justifyCenter chevron">
                        <ChevronRightSvg
                            style={{
                                color: 'rgb(51,51,51)',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        />
                    </div>
                </Col> */}
            </Row>

            {!!call?.search_context?.length && (
                <div className="borderTop widthp100 callCardMonolgueContainer">
                    <Monologue
                        title={call.title}
                        id={call.id}
                        monologues={call.search_context}
                    />
                </div>
            )}
        </div>
    );
}

const CallCommentInitials = memo(function ({ commented_initials }) {
    const MAX_USERS_SHOWN = 1;
    const getSharedString = (users) => {
        return users
            .slice(MAX_USERS_SHOWN)
            .map((user) => user)
            .join(", ");
    };
    return (
        <>
            {!!commented_initials.length && (
                <div className="comment_initials font12 marginT2">
                    <span className="marginR8 dusty_gray_cl ">
                        Commented by
                    </span>
                    {commented_initials.length > MAX_USERS_SHOWN ? (
                        <>
                            <Tooltip
                                destroyTooltipOnHide={{
                                    keepParent: false,
                                }}
                                placement="topLeft"
                                title={() =>
                                    getSharedString(commented_initials)
                                }
                            >
                                {commented_initials
                                    .slice(0, MAX_USERS_SHOWN)
                                    .map((user, idx) => (
                                        <span className="marginR3" key={idx}>
                                            {user}
                                        </span>
                                    ))}
                                +{commented_initials.length - MAX_USERS_SHOWN}
                            </Tooltip>
                        </>
                    ) : (
                        commented_initials.map((user, idx) => (
                            <span key={idx}>{user}</span>
                        ))
                    )}
                </div>
            )}
        </>
    );
});

export const CardCallType = memo(function (props) {
    const { callType } = props;
    return (
        <div className={"width100p flex"}>
            <div
                className="flex1 flex alignCenter"
                style={{
                    gap: "16px",
                }}
            >
                <CustomTypeSelector
                    value={callType?.map((e) => e.id)}
                    call_id={props.call_id}
                    onUpdate={props.updateCall}
                />
                {true ? (
                    <Row gutter={[12, 12]} className="paddingL6">
                        {
                            // !!true &&
                            callType?.slice(0, 1).map(({ id, type }) => (
                                <>
                                    <Col
                                        style={{
                                            backgroundColor: "#9999991A",
                                            transform: "initial",
                                        }}
                                        key={id}
                                        className="marginR10 paddingLR4 paddingTB2 borderRadius4 paddingTB2 dove_gray_cl"
                                    >
                                        <Tooltip title={type}>
                                            <div
                                                style={{
                                                    maxWidth: "120px",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {type}
                                            </div>
                                        </Tooltip>
                                    </Col>
                                    {/* <Col
                                    style={{
                                        backgroundColor:
                                            '#9999991A'
                                    }}
                                    // key={id}
                                    className="marginR10 paddingLR4 paddingTB2 borderRadius4 paddingTB2 capitalize"
                                >
                                    {'custom'}
                                </Col>
                                <Col
                                    style={{
                                        backgroundColor:
                                            '#9999991A'
                                    }}
                                    // key={id}
                                    className="marginR10 paddingLR4 paddingTB2 borderRadius4 paddingTB2 capitalize"
                                >
                                    {'custom'}
                                </Col> */}
                                </>
                            ))
                        }
                        {callType?.length > 1 && (
                            <Col
                                className="marginR10 paddingLR4 paddingTB2 curPoint primary bold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                            >
                                <Tooltip
                                    title={callType
                                        ?.slice(1)
                                        .map(({ id, type }) => (
                                            <div key={id}>
                                                <div>{type}</div>
                                            </div>
                                        ))}
                                    placement="bottom"
                                >
                                    <span
                                        className="dove_gray_cl paddingLR5"
                                        style={{
                                            background: "#9999991A",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        {`+${callType?.length - 1}`}
                                    </span>
                                </Tooltip>
                            </Col>
                        )}
                    </Row>
                ) : (
                    <div>None</div>
                )}
            </div>
        </div>
    );
});

export const CallCardTags = function (props) {
    const { callTags } = props;
    return (
        <div className={"flex"}>
            <div
                className="flex1 flex alignCenter"
                style={{
                    gap: "16px",
                }}
            >
                <CustomTagSelector
                    value={callTags?.map((e) => e.id)}
                    call_id={props.call_id}
                    onUpdate={props.updateCall}
                />
                {true ? (
                    <Row gutter={[12, 12]} className="paddingL6">
                        {
                            // !!true &&
                            callTags
                                ?.slice(0, 1)
                                .map(({ id, tag_name }, idx) => (
                                    <>
                                        <Col
                                            style={{
                                                backgroundColor: "#9999991A",
                                                transform: "initial",
                                            }}
                                            key={idx}
                                            className="marginR10 paddingLR4 paddingTB2 borderRadius4 paddingTB2 dove_gray_cl"
                                        >
                                            <Tooltip title={tag_name}>
                                                <div
                                                    style={{
                                                        maxWidth: "120px",
                                                        textOverflow:
                                                            "ellipsis",
                                                        overflow: "hidden",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {tag_name}
                                                </div>
                                            </Tooltip>
                                        </Col>
                                    </>
                                ))
                        }
                        {callTags?.length > 1 && (
                            <Col
                                className="marginR10 paddingLR4 paddingTB2 curPoint primary bold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                            >
                                <Tooltip
                                    title={callTags
                                        ?.slice(1)
                                        .map(({ id, tag_name }) => (
                                            <div key={id}>
                                                <div>{tag_name}</div>
                                            </div>
                                        ))}
                                    placement="bottom"
                                >
                                    <span
                                        className="dove_gray_cl paddingLR5"
                                        style={{
                                            background: "#9999991A",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        {`+${callTags?.length - 1}`}
                                    </span>
                                </Tooltip>
                            </Col>
                        )}
                    </Row>
                ) : (
                    <div>None</div>
                )}
            </div>
        </div>
    );
};

const Monologue = ({ title, id, monologues, goToTranscriptPage }) => {
    const { domain } = useSelector((state) => state.common);
    return (
        <>
            {monologues.map((monologue, idx) => (
                <div className={`flex alignCenter`} key={uid() + idx}>
                    <Popover
                        overlayClassName={"minWidth30 maxWidth30 maxHeight30"}
                        destroyTooltipOnHide={{ keepParent: false }}
                        content={
                            <MonologuePlayer
                                id={id}
                                start_time={monologue.start_time}
                                end_time={monologue.end_time}
                            />
                        }
                        title={title}
                        placement={"bottom"}
                        trigger="hover"
                        // getPopupContainer={() =>
                        //     document.getElementById(`search__callCard${id}`)
                        // }
                    >
                        <PlaySvg />
                    </Popover>

                    <p
                        className="font14 marginLR14  flex1"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToTranscriptTab({
                                event: e,
                                start_time: monologue.start_time,
                                end_time: monologue.end_time,
                                headline: monologue.headline,
                                meeting_id: id,
                                domain,
                            });
                        }}
                    >
                        <span className="dove_gray_cl font14 bold600 marginR4">
                            {secondsToTime(monologue.start_time)} :
                        </span>
                        <span className="paddingR8 font14 bold600 capitalize">
                            {monologue.speaker_name || "Multiple Speakers"} :
                        </span>
                        <span
                            className="srchCallCard__monologue mine_shaft_cl"
                            dangerouslySetInnerHTML={{
                                __html: monologue?.headline,
                            }}
                        ></span>
                    </p>
                </div>
            ))}
        </>
    );
};

export default memo(CompletedCallCard);
