import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const CircularProgress = ({
    width,
    strokeWidth,
    setTimeUp,
    timer,
    setTimer,
}) => {
    // const [timer, setTimer] = useState(120);

    function pad(num) {
        return ("0" + num).slice(-2);
    }
    function hhmmss(secs) {
        var minutes = Math.floor(secs / 60);
        secs = secs % 60;
        minutes = minutes % 60;
        return `${pad(minutes)}:${pad(secs)}`;
    }
    const renderTime = ({ remainingTime }) => {
        if (remainingTime <= 0) {
            setTimeUp(true);
            setTimer(0);

            return <></>;
        }

        // localStorage.setItem('remainingTime', remainingTime);

        return <div className="timer">{hhmmss(remainingTime)}</div>;
    };

    return (
        <CountdownCircleTimer
            isPlaying
            duration={timer}
            colors={"#1A62F2"}
            onComplete={() => ({ shouldRepeat: false })}
            size={width}
            strokeWidth={strokeWidth}
        >
            {renderTime}
        </CountdownCircleTimer>
    );
};
// set deafult props
CircularProgress.defaultProps = {
    width: 100,
    strokeWidth: 10,
};
export default CircularProgress;
