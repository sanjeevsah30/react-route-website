import { secondsToTime } from "@tools/helpers";
import React from "react";
import ClockSvg from "app/static/svg/ClockSvg";

function TimeStamp({ onClick, start_time }) {
    return (
        <div
            className="time_stamp"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {/* <ClockSvg /> */}

            <span className="marginT1">&nbsp;{start_time}</span>
        </div>
    );
}

export default React.memo(
    TimeStamp,
    (prev, next) => prev.start_time === next.start_time
);
