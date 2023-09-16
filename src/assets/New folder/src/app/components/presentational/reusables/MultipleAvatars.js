import { getColor, getDisplayName, uid } from "@tools/helpers";
import { Avatar, Tooltip } from "antd";
import React from "react";
import UserSvg from "app/static/svg/UserSvg";
import "./multipleavatar.scss";

function MultipleAvatars({
    participants,
    isString,
    max,
    className,
    size,
    colors,
}) {
    const inWords = participants?.reduce((str, participant, idx) => {
        const name = isString
            ? participant
            : getDisplayName({
                  ...participant,
              });
        return idx !== participants.length - 1
            ? str + `${name}, `
            : str + `${name}`;
    }, "");
    const checkIsPhoneNumber = (ch) =>
        ch === "+" || !isNaN(parseInt(ch)) ? true : false;

    return (
        <Tooltip destroyTooltipOnHide placement="topLeft" title={inWords}>
            <div>
                <Avatar.Group
                    maxCount={max}
                    maxStyle={{
                        color: "white",
                        backgroundColor: "#1a62f2",
                    }}
                    size={size}
                    className={className}
                >
                    {participants?.map((participant, idx) => {
                        const name = isString
                            ? participant
                            : getDisplayName({
                                  ...participant,
                              });
                        return (
                            <Avatar
                                style={{
                                    backgroundColor:
                                        colors.length > 0
                                            ? colors[idx % colors.length]
                                            : getColor(name),
                                }}
                                key={uid()}
                            >
                                {checkIsPhoneNumber(name[0]?.toUpperCase()) ? (
                                    <UserSvg
                                        style={{
                                            transform: "scale(0.8)",
                                        }}
                                    />
                                ) : name ? (
                                    name?.[0]?.toUpperCase()
                                ) : (
                                    <UserSvg
                                        style={{
                                            transform: "scale(0.8)",
                                        }}
                                    />
                                )}
                            </Avatar>
                        );
                    })}
                </Avatar.Group>
            </div>
        </Tooltip>
    );
}

MultipleAvatars.defaultProps = {
    max: 4,
    className: "",
    size: 25,
    participants: [],
    isString: false,
    colors: [],
};

export default MultipleAvatars;
