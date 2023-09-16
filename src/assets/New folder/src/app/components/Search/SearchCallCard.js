import React, { useState } from "react";
import {
    UserOutlined,
    PlayCircleOutlined,
    UpOutlined,
    DownOutlined,
} from "@ant-design/icons";
import { Button, Popover, Tooltip } from "antd";
import { getDateTime, getDuration, secondsToTime, uid } from "@tools/helpers";
import callsConfig from "@constants/MyCalls/index";
import MonologuePlayer from "../presentational/reusables/MonologuePlayer";
import SearchCallSummary from "./SearchCallSummary";
import IndividualCallConfig from "@constants/IndividualCall/index";

export default function SearchCallCard({ call, onClick }) {
    const MAX_MONOLOGUES = 3;
    const [showMore, setShowMore] = useState(false);

    const handleCallDetails = (
        activeTab = IndividualCallConfig.TABS.overview.value,
        speaker = "",
        topic = ""
    ) => {
        onClick(
            call.id,
            call.title,
            callsConfig.COMPLETED_TYPE,
            call,
            [],
            activeTab,
            speaker,
            topic
        );
    };

    return (
        <div
            className="srchCallCard boxShadow"
            id={`search__callCard${call.id}`}
        >
            <div className="flex alignCenter">
                <div className="srchCallCard__img borderRight padding12">
                    <img
                        className="width3 height3"
                        src={
                            call.thumbnail
                                ? call.thumbnail
                                : require("../../static/images/logo-shape.png")
                                      .default
                        }
                        alt={call.title}
                    />
                </div>
                <div className="padding12 flex1">
                    <p className="flex justifySpaceBetween">
                        <Button
                            className="srchCallCard__callBtn"
                            type="link"
                            onClick={() => {
                                handleCallDetails(
                                    IndividualCallConfig.TABS.overview.value
                                );
                            }}
                        >
                            <span className="truncate">{call.title}</span>
                        </Button>
                        <span className="font14 inlineBlock truncate width15">
                            {call.client
                                ? call.client.first_name
                                    ? call.client.first_name
                                    : call.client.email
                                : ""}
                        </span>

                        {call.participants.length ? (
                            <Tooltip
                                destroyTooltipOnHide
                                title={
                                    <ul style={{ margin: 0, padding: 0 }}>
                                        {call.participants.map(
                                            (participant) => (
                                                <li key={participant}>
                                                    - {participant}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                }
                                placement="topLeft"
                            >
                                <span className="font14">
                                    <UserOutlined />
                                    <span className="marginL4">
                                        {call.participants.length}
                                    </span>
                                </span>
                            </Tooltip>
                        ) : (
                            <span className="font14">
                                <UserOutlined /> -{" "}
                            </span>
                        )}
                        <Popover
                            overlayClassName={"minWidth30 maxWidth40"}
                            destroyTooltipOnHide={{ keepParent: false }}
                            content={
                                <SearchCallSummary
                                    callId={call.id}
                                    talkRatio={call?.stats?.owner_talk_ratio}
                                    interactivity={call?.stats?.interactivity}
                                    longestMonologue={
                                        call.stats.longest_monologue_owner
                                    }
                                    longestMonologueClient={
                                        call.stats.longest_monologue_client
                                    }
                                    patience={call.stats.patience}
                                    questionRate={
                                        call.stats.owner_question_count
                                    }
                                    handleClick={handleCallDetails}
                                />
                            }
                            placement={"right"}
                            trigger={call.transcript ? "hover" : ""}
                            getPopupContainer={() =>
                                document.getElementById(
                                    `search__callCard${call.id}`
                                )
                            }
                        >
                            <Button
                                className="margin0 srchCallCard__summary"
                                disabled={!call.transcript}
                                type="link"
                            >
                                Summary
                            </Button>
                        </Popover>
                    </p>
                    <p className="greyText font12 margin0">
                        {getDateTime(call.start_time)} |{" "}
                        {getDuration(call.start_time, call.end_time)}
                    </p>
                </div>
            </div>
            {!!call.search_context.length && (
                <div className="borderTop">
                    {call.search_context.length > MAX_MONOLOGUES &&
                    !showMore ? (
                        <Monologue
                            title={call.title}
                            id={call.id}
                            monologues={call.search_context.slice(
                                0,
                                MAX_MONOLOGUES
                            )}
                        />
                    ) : (
                        <Monologue
                            title={call.title}
                            id={call.id}
                            monologues={call.search_context}
                        />
                    )}
                    {call.search_context.length > MAX_MONOLOGUES && (
                        <div className="flex justifyCenter borderTop">
                            <Button
                                type={"link"}
                                icon={
                                    showMore ? <UpOutlined /> : <DownOutlined />
                                }
                                onClick={() => setShowMore((status) => !status)}
                            >
                                {showMore ? "View Less" : "View More"}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const Monologue = ({ title, id, monologues }) => {
    return (
        <>
            {monologues.map((monologue, idx) => (
                <div className={`flex`} key={uid() + idx}>
                    <div className="minWidth3 paddingLR16 borderRight text-center">
                        <Popover
                            overlayClassName={
                                "minWidth30 maxWidth30 maxHeight30"
                            }
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
                            getPopupContainer={() =>
                                document.getElementById(`search__callCard${id}`)
                            }
                        >
                            <Button
                                className="margin0 text-center"
                                icon={<PlayCircleOutlined />}
                                type="link"
                            />
                        </Popover>
                    </div>
                    <p className="font14 marginLR12 marginTB4 flex1">
                        <span className="greyText paddingR8 font12">
                            {secondsToTime(monologue.start_time)}
                        </span>
                        <span
                            className="srchCallCard__monologue"
                            dangerouslySetInnerHTML={{
                                __html: monologue.headline,
                            }}
                        ></span>
                    </p>
                </div>
            ))}
        </>
    );
};
