import React, { useContext, useEffect, useState } from "react";
import { Avatar, notification, Radio, Tooltip } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

import { capitalizeFirstLetter, secondsToTime } from "@helpers";
import Processing from "./Processing";

import UserSvg from "app/static/svg/UserSvg";
import { CallContext } from "./IndividualCall";
import { CustomSelect } from "../Resuable/index";
import IndividualCallConfig from "@constants/IndividualCall/index";

import ShareSvg from "app/static/svg/ShareSvg";
import { shareMeeting } from "@apis/sharer/index";
import { useDispatch, useSelector } from "react-redux";
import apiErrors from "@apis/common/errors";
import { openNotification } from "@store/common/actions";
import { fetchCallSnippets } from "@store/individualcall/actions";
const MAX_RENDER = 4;

function MomentsSection({
    items: data,
    seekToPoint,
    isProcessing,
    activeSpeaker,
    label,
    showLabel,
    showCount,
    activeTab,
    isTopicType,
    notFoundText,
    NotFoundIcon,
}) {
    const baseClass = `individualcall-infoCard`;
    const [activeIdx, setActiveIdx] = useState(-1);
    const [activeType, setActiveType] = useState(activeSpeaker);
    const [showAll, setShowAll] = useState(false);
    const [items, setItems] = useState({});
    const { momentFilterType, setMomentFilterType, callId } =
        useContext(CallContext);
    useEffect(() => {
        const keys = Object.keys(data);

        let cloneData = { ...data };
        if (!keys.length) return;
        for (let key of keys) {
            if (cloneData[key]?.data?.length) continue;
            delete cloneData[key];
        }
        setItems(cloneData);
    }, [data]);
    useEffect(() => {
        if (!activeSpeaker && Object.keys(items).length) {
            setActiveType(Object.keys(items)[0]);
        }
    }, [items]);

    useEffect(() => {
        setActiveIdx(-1);
    }, [activeTab]);

    const checkIsPhoneNumber = (ch) =>
        ch === "+" || !isNaN(parseInt(ch)) ? true : false;

    const { domain } = useSelector((state) => state.common);
    const dispatch = useDispatch();
    const [isSharing, setisSharing] = useState(false);

    const handleShare = (data) => {
        setisSharing(true);
        shareMeeting(domain, data).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(fetchCallSnippets(callId));

                navigator.clipboard.writeText(res.url, 100);

                notification.success({
                    message: "Link Copied",
                });
            }
            setisSharing(false);
        });
    };

    return (
        <>
            {isProcessing ? (
                <div className="height100p flex alignCenter justifyCenter">
                    <Processing />
                </div>
            ) : (
                <div className={baseClass + "-container"}>
                    {items &&
                        items[activeType] &&
                        !!items[activeType]?.data?.length && (
                            <div className="row togglers flex alignCenter justifySpaceBetween">
                                <div className="flex alignCenter flexWrap">
                                    <Radio.Group
                                        onChange={(e) => {
                                            setActiveIdx(-1);
                                            setActiveType(e.target.value);
                                        }}
                                        value={activeType}
                                    >
                                        {(showAll
                                            ? Object.keys(items)
                                            : Object.keys(items).slice(
                                                  0,
                                                  MAX_RENDER
                                              )
                                        ).map((item, idx) => (
                                            <Radio.Button
                                                key={idx}
                                                value={item}
                                            >
                                                {showCount
                                                    ? `${item}(${items[item].count})`
                                                    : item}
                                            </Radio.Button>
                                        ))}
                                        {!showAll &&
                                            Object.keys(items).length >
                                                MAX_RENDER && (
                                                <button
                                                    className="toogler__showMore"
                                                    onClick={() =>
                                                        setShowAll(true)
                                                    }
                                                >
                                                    +
                                                    {Object.keys(items).length -
                                                        MAX_RENDER}
                                                </button>
                                            )}
                                    </Radio.Group>
                                </div>
                                <div>
                                    <CustomSelect
                                        data={[
                                            {
                                                id: IndividualCallConfig.POSITIVE_MOMENTS,
                                                value: IndividualCallConfig.POSITIVE_MOMENTS,
                                                name: "Positive Sentiment",
                                            },
                                            {
                                                id: IndividualCallConfig.NEGATIVE_MOMENTS,
                                                value: IndividualCallConfig.NEGATIVE_MOMENTS,
                                                name: "Negative Sentiment",
                                            },
                                            {
                                                id: 0,
                                                value: null,
                                                name: "All",
                                            },
                                        ]}
                                        option_key={"value"}
                                        option_name={"name"}
                                        select_placeholder={
                                            "Select Momment Type"
                                        }
                                        placeholder={"Select Momment Type"}
                                        style={{
                                            width: "128px",
                                            height: "36px",
                                        }}
                                        value={momentFilterType}
                                        onChange={(value) => {
                                            setMomentFilterType(value);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    {items &&
                    items[activeType] &&
                    items[activeType].data.length ? (
                        items[activeType].data
                            .filter(
                                (item) =>
                                    momentFilterType === null ||
                                    item.type === momentFilterType
                            )
                            .map((item, index) => (
                                <div
                                    className={`${baseClass} ${baseClass}__${
                                        item.speaker_type
                                    } padding16 ${
                                        index === activeIdx ? "active" : ""
                                    }`}
                                    onClick={() => {
                                        setActiveIdx(index);
                                        seekToPoint(item.time, true);
                                    }}
                                >
                                    <div className="flex alignStart">
                                        <Avatar
                                            size={40}
                                            className="card__avatar"
                                        >
                                            {checkIsPhoneNumber(
                                                item?.name?.[0]
                                            ) ? (
                                                <UserSvg
                                                    style={{
                                                        color: "#1a62f2",
                                                        marginTop: "3px",
                                                    }}
                                                />
                                            ) : (
                                                item?.name?.slice(0, 1)
                                            )}
                                        </Avatar>
                                        <div className="flex1">
                                            <div
                                                className={`${baseClass}-top paddingB14`}
                                            >
                                                <div
                                                    className={`${baseClass}-top-name flex alignCenter`}
                                                >
                                                    <div
                                                        className={`widthAuto font16 bold600 ${item.speaker_type?.toLowerCase()}`}
                                                    >
                                                        {item.name}
                                                    </div>
                                                </div>
                                                <div className="flex alignCenter">
                                                    {item.type !==
                                                        "Moments" && (
                                                        <div
                                                            className={`${item.type}_reaction`}
                                                        >
                                                            {item.type}
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`speaker_tag ${item.speaker_type?.toLowerCase()}`}
                                                    >
                                                        {capitalizeFirstLetter(
                                                            item.speaker_type
                                                        )}
                                                    </div>
                                                    &nbsp;
                                                    <div className="clock">
                                                        <ClockCircleOutlined />
                                                        <span>
                                                            {secondsToTime(
                                                                item.time
                                                            )}
                                                        </span>
                                                    </div>
                                                    <Tooltip
                                                        title={
                                                            isSharing
                                                                ? "...Genrating Link. Please wait"
                                                                : "Share"
                                                        }
                                                    >
                                                        <div
                                                            className="clock marginL5 padding0 height100p"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleShare({
                                                                    meeting:
                                                                        callId,
                                                                    comment: "",
                                                                    emails: [],
                                                                    start_time:
                                                                        item.startsAt,
                                                                    end_time:
                                                                        item.endsAt,
                                                                    expires_in: 365,
                                                                    public: true,
                                                                    share_with_transcript: true,
                                                                });
                                                                // setShowShare(true);
                                                                // setShareDuration([
                                                                //     item.startsAt,
                                                                //     item.endsAt,
                                                                // ]);
                                                            }}
                                                        >
                                                            <ShareSvg
                                                                style={{
                                                                    transform:
                                                                        "scale(0.6)",
                                                                }}
                                                            />
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div
                                                className={`${baseClass}-bottom`}
                                            >
                                                <div
                                                    className={`call_overview_monologue`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: `${item.text}`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* {activeType === 'all' || isTopicType ? (
                                    <div className="flex alignStart">
                                        <Avatar
                                            size={40}
                                            className="card__avatar"
                                        >
                                            {checkIsPhoneNumber(
                                                item?.name?.[0]
                                            ) ? (
                                                <UserSvg
                                                    style={{
                                                        color: '#1a62f2',
                                                        marginTop: '3px',
                                                    }}
                                                />
                                            ) : (
                                                item?.name?.slice(0, 1)
                                            )}
                                        </Avatar>
                                        <div className="flex1">
                                            <div
                                                className={`${baseClass}-top paddingB14`}
                                            >
                                                <div
                                                    className={`${baseClass}-top-name flex alignCenter`}
                                                >
                                                    <div
                                                        className={`widthAuto font16 bold600 ${item.speaker_type.toLowerCase()}`}
                                                    >
                                                        {item.name}
                                                    </div>
                                                </div>
                                                <div className="flex alignCenter">
                                                    <div
                                                        className={`speaker_tag ${item.speaker_type.toLowerCase()}`}
                                                    >
                                                        {capitalizeFirstLetter(
                                                            item.speaker_type
                                                        )}
                                                    </div>
                                                    &nbsp;
                                                    <div className="clock">
                                                        <ClockCircleOutlined />
                                                        <span>
                                                            {secondsToTime(
                                                                item.time
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={`${baseClass}-bottom`}
                                            >
                                                <div
                                                    className={`call_overview_monologue`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: `${item.text}`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="individualcall-infoCard-top alignStart">
                                        <div className={`${baseClass}-bottom`}>
                                            <div
                                                className={`call_overview_monologue`}
                                                dangerouslySetInnerHTML={{
                                                    __html: `${item.text}`,
                                                }}
                                            />
                                        </div>
                                        <div className="clock">
                                            <ClockCircleOutlined />
                                            <span>
                                                {secondsToTime(item.time)}
                                            </span>
                                        </div>
                                    </div>
                                )} */}
                                </div>
                            ))
                    ) : (
                        <div className="height100p flex column alignCenter justifyCenter">
                            <NotFoundIcon />
                            <div className="bold700 font18 marginTB20">
                                {notFoundText}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default MomentsSection;
