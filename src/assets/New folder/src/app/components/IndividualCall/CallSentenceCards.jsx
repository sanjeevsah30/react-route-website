import React, { useEffect, useState } from "react";
import { Avatar, Radio, Tag } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Label, NoData } from "@reusables";
import {
    capitalizeFirstLetter,
    getAcronym,
    secondsToTime,
    uid,
} from "@helpers";
import Processing from "./Processing";
import TimeStamp from "@presentational/reusables/TimeStamp";
import UserSvg from "app/static/svg/UserSvg";
const MAX_RENDER = 4;
const CallSentenceCards = ({
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
}) => {
    const baseClass = `individualcall-infoCard`;
    const [activeIdx, setActiveIdx] = useState(-1);
    const [activeType, setActiveType] = useState(activeSpeaker);
    const [showAll, setShowAll] = useState(false);
    const [items, setItems] = useState({});

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

    console.log(items);

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
                            <div className="row togglers">
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
                                        ).map((item) => (
                                            <Radio.Button
                                                key={item}
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
                            </div>
                        )}
                    {items &&
                    items[activeType] &&
                    items[activeType].data.length ? (
                        items[activeType].data.map((item, index) => (
                            <div
                                className={`${baseClass} ${baseClass}__${
                                    item.speaker_type
                                } padding16 ${
                                    index === activeIdx ? "active" : ""
                                }`}
                                key={`${baseClass}__${index}`}
                                onClick={() => {
                                    setActiveIdx(index);
                                    seekToPoint(item.time, true);
                                }}
                            >
                                {activeType === "all" || isTopicType ? (
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
                                )}
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
};

CallSentenceCards.defaultProps = {
    showLabel: true,
    showCount: false,
};

export default CallSentenceCards;
