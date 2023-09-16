import React, { memo, useContext } from "react";
import config from "@constants/IndividualCall";
import {
    getDateTime,
    getDuration,
    getMatchRegex,
    getRandomColors,
} from "@helpers";
import { Avatar, Tag, Tooltip } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import MultipleAvatars from "@presentational/reusables/MultipleAvatars";
import ClockSvg from "app/static/svg/ClockSvg";
import CalendarSvg from "app/static/svg/CalendarSvg";
import { CallContext } from "./IndividualCall";

const CallDetails = ({
    id,
    summary,
    title,
    start_time,
    end_time,
    duration,
    description,
    keywords,
    agenda,
    playerRef,
    playerHandlers,
    mediaUri,
    subtitles,
    participants,
}) => {
    const baseClass = "individualcall-details-right";
    const { chat } = useContext(CallContext);
    return (
        <div className={`${baseClass}-calldetails`}>
            <div className={`${baseClass}-calldetails-top paddingLR24`}>
                <div className="displayLarge marginT22">
                    <div className="row marginT10 borderBottomBold">
                        <div className="col-24">
                            <h2 className="font18 bold700  mine_shaft_cl">
                                <span> {summary ? summary : title}</span>
                            </h2>
                        </div>
                        <div className="col-24 marginB24">
                            <div className="flex justifySpaceBetween alignCenter font16 bolder ltNrml">
                                {participants.length ? (
                                    <MultipleAvatars
                                        isString={true}
                                        participants={participants}
                                        size={32}
                                        max={4}
                                        className={
                                            "individual_call_participants"
                                        }
                                    />
                                ) : null}

                                <span className="flex alignCenter font16 bold600 dove_gray_cl">
                                    {chat || (
                                        <span className="flexShrink0 flex alignCenter marginR27">
                                            <ClockSvg
                                                style={{
                                                    transform: "scale(1.8)",
                                                    marginRight: "10px",
                                                    color: "#666666",
                                                }}
                                            />
                                            <span>
                                                {duration
                                                    ? duration
                                                    : start_time && end_time
                                                    ? getDuration(
                                                          start_time,
                                                          end_time
                                                      )
                                                    : ""}
                                            </span>
                                        </span>
                                    )}

                                    <span className="flexShrink0 flex alignCenter">
                                        <CalendarSvg
                                            style={{
                                                color: "#666666",
                                            }}
                                        />
                                        <span className="marginL8">
                                            {getDateTime(
                                                start_time,
                                                "timeDate"
                                            )}
                                        </span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="row marginT18">
                        <div className="col-24">
                            <span className="bold700 font16 mine_shaft_cl">
                                {config.AGENDA}
                            </span>
                        </div>
                        <div className="col-24 dove_gray_cl">
                            {description && keywords.length > 0 ? (
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: description.replace(
                                            getMatchRegex(keywords),
                                            (matched) =>
                                                `<mark class="cite">${matched}</mark>`
                                        ),
                                    }}
                                />
                            ) : (
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: description.replace(
                                            /\n/g,
                                            "<br />"
                                        ),
                                    }}
                                />
                            )}
                            {agenda && keywords.length > 0 ? (
                                <p
                                    className="font16 lineBreak"
                                    dangerouslySetInnerHTML={{
                                        __html: agenda.replace(
                                            getMatchRegex(keywords),
                                            (matched) =>
                                                `<mark class="cite">${matched}</mark>`
                                        ),
                                    }}
                                />
                            ) : (
                                <p
                                    className="font16 lineBreak"
                                    dangerouslySetInnerHTML={{
                                        __html: agenda.replace(/\n/g, "<br />"),
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserAvatar = ({ user }) => (
    <Tooltip
        destroyTooltipOnHide={{ keepParent: false }}
        placement="topLeft"
        title={user}
    >
        <Avatar
            size={30}
            style={{
                backgroundColor: getRandomColors(user),
            }}
        >
            {user.split("")[0].toUpperCase()}
        </Avatar>
    </Tooltip>
);

const ParticipantInitials = memo(function ({ participants }) {
    const MAX_USERS_SHOWN = 4;
    const getSharedString = (users) => {
        return users
            .slice(MAX_USERS_SHOWN)
            .map((user) => user)
            .join(", ");
    };
    return (
        <>
            {!!participants.length && (
                <div className="paddingR10 flex alignCenter">
                    {participants.length > MAX_USERS_SHOWN ? (
                        <>
                            {participants
                                .slice(0, MAX_USERS_SHOWN)
                                .map((user, idx) => (
                                    <UserAvatar key={idx} user={user} />
                                ))}

                            <Tooltip
                                destroyTooltipOnHide={{
                                    keepParent: false,
                                }}
                                placement="topLeft"
                                title={() => getSharedString(participants)}
                            >
                                <span className="text-bold marginL8 labelGreyText font16">
                                    +{participants.length - MAX_USERS_SHOWN}{" "}
                                    participants
                                </span>
                            </Tooltip>
                        </>
                    ) : (
                        participants.map((user, idx) => (
                            <UserAvatar user={user} key={idx} />
                        ))
                    )}
                </div>
            )}
        </>
    );
});

CallDetails.defaultProps = {
    participants: [],
    description: "",
    agenda: "",
};

export default CallDetails;
