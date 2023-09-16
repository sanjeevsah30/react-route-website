import UserAvatar from "@presentational/reusables/UserAvatar";
import { getColor, getDisplayName } from "@tools/helpers";
import { Avatar, Tag } from "antd";
import React, { useContext } from "react";
import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import { AccountsContext } from "../../../Accounts";

function ParticipantsCard({
    first_name,
    last_name,
    email,
    id,
    title,
    type,
    userName,
    setFilter,
    isActive,
}) {
    const name = getDisplayName({
        first_name,
        last_name,
        email,
        userName,
    });

    const { checkIsPhoneNumber } = useContext(AccountsContext);

    return (
        <div
            className={`posRel marginB7 flex alignCenter paddingTB11 curPoint component--hover--active curPoint ${
                isActive(id, type) ? "call__active" : ""
            }`}
            onClick={() => {
                setFilter({ id, type, name });
            }}
        >
            <div
                style={{
                    width: "30px",
                }}
            >
                {checkIsPhoneNumber(name[0].toUpperCase()) ? (
                    <UserAvatar size={30} color={getColor(name)} scale={0.7} />
                ) : (
                    <Avatar
                        style={{
                            backgroundColor: getColor(name),
                            verticalAlign: "middle",
                        }}
                        className="bold font18 "
                        size={30}
                    >
                        {name[0].toUpperCase()}
                    </Avatar>
                )}
            </div>

            <div className="paddingLR12 flex1">
                <span className="mine_shaft_cl bold600 font14 marginB4 ">
                    {name}
                </span>
                <div>
                    {title && (
                        <Tag
                            color="#99999933"
                            className="participant_tag dusty_gray_cl--important text_ellipsis"
                            style={{
                                maxWidth: "80%",
                            }}
                        >
                            {title}
                        </Tag>
                    )}
                    {type === "reps" || type === "owner" ? (
                        <Tag
                            color="#99999933"
                            className="participant_tag  dusty_gray_cl--important text_ellipsis"
                            style={{
                                maxWidth: "80%",
                            }}
                        >
                            Internal
                        </Tag>
                    ) : (
                        <Tag
                            color="#1A62F233"
                            className="participant_tag  primary_cl--important text_ellipsis"
                            style={{
                                maxWidth: "80%",
                            }}
                        >
                            External
                        </Tag>
                    )}
                </div>
            </div>
            <div
                className="posAbs displayNone rightArrow"
                style={{
                    right: "10px",
                }}
            >
                <div className="flex alignCenter justifyCenter chevron">
                    <ChevronRightSvg
                        style={{
                            color: "rgb(51,51,51)",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default React.memo(ParticipantsCard);
