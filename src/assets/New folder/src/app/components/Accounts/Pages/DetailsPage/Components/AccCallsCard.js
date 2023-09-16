import React, { useEffect } from "react";
import { getDateTime } from "@tools/helpers";
import { useParticipantsHook } from "../../../Accounts";
import MultipleAvatars from "../../../../presentational/reusables/MultipleAvatars";
import CallMark from "./CallMark";

function AccCallsCard({ activeCall, data, onClick, hideType }) {
    const { title, owner, reps, client, start_time, id } = data;

    const [participants, setParticipants] = useParticipantsHook({
        owner: [owner],
        client: client ? [client] : [],
        reps,
    });

    useEffect(() => {
        const arr = [];
        if (owner) {
            arr.push(owner);
        }
        if (client) {
            arr.push(client);
        }

        setParticipants([...arr, ...reps]);
    }, [owner, reps, client]);

    return (
        <div
            className={`paddingLR16 paddingTB10 border_bottom calls__card component--hover--active curPoint ${
                activeCall?.id === id ? "call__active" : ""
            }`}
            onClick={() => onClick(data)}
        >
            <div className="bold600 mine_shaft_cl  marginB7 marginR6 font14 call_name">
                {title}
            </div>
            {participants.length && (
                <MultipleAvatars
                    className={"calls__card__avatar--group"}
                    participants={participants}
                />
            )}

            <div className="font12 dusty_gray_cl flex alignCenter justifySpaceBetween marginT6">
                <span>{getDateTime(start_time)}</span>
                {hideType || <CallMark className="call__mark lima_bg" />}
            </div>
        </div>
    );
}

AccCallsCard.defaultProps = {
    owner: {},
    reps: [],
    client: {},
    onClick: () => {},
    hideType: false,
};

export default AccCallsCard;
