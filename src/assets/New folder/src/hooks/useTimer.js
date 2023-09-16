import { count } from "d3";
import { useEffect, useRef } from "react";
import { useState } from "react";
import useInterval from "./useInterval";

class Time {
    static getTimeFromSeconds(secs) {
        const totalSeconds = Math.ceil(secs);
        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        return {
            totalSeconds,
            seconds,
            minutes,
            hours,
            days,
        };
    }

    static getSecondsFromExpiry(expiry, shouldRound) {
        const now = new Date().getTime();
        const milliSecondsDistance = expiry - now;
        if (milliSecondsDistance > 0) {
            const val = milliSecondsDistance / 1000;
            return shouldRound ? Math.round(val) : val;
        }
        return 0;
    }

    static getSecondsFromPrevTime(prevTime, shouldRound) {
        const now = new Date().getTime();
        const milliSecondsDistance = now - prevTime;
        if (milliSecondsDistance > 0) {
            const val = milliSecondsDistance / 1000;
            return shouldRound ? Math.round(val) : val;
        }
        return 0;
    }

    static getSecondsFromTimeNow() {
        const now = new Date();
        const currentTimestamp = now.getTime();
        const offset = now.getTimezoneOffset() * 60;
        return currentTimestamp / 1000 - offset;
    }

    static getFormattedTimeFromSeconds(totalSeconds, format) {
        const {
            seconds: secondsValue,
            minutes,
            hours,
        } = Time.getTimeFromSeconds(totalSeconds);
        let ampm = "";
        let hoursValue = hours;

        if (format === "12-hour") {
            ampm = hours >= 12 ? "pm" : "am";
            hoursValue = hours % 12;
        }

        return {
            seconds: secondsValue,
            minutes,
            hours: hoursValue,
            ampm,
        };
    }
}

class Validate {
    static expiryTimestamp(expiryTimestamp) {
        const isValid = new Date(expiryTimestamp).getTime() > 0;
        if (!isValid) {
            console.warn(
                "react-timer-hook: { useTimer } Invalid expiryTimestamp settings",
                expiryTimestamp
            ); // eslint-disable-line
        }
        return isValid;
    }

    static onExpire(onExpire) {
        const isValid = onExpire && typeof onExpire === "function";
        if (onExpire && !isValid) {
            console.warn(
                "react-timer-hook: { useTimer } Invalid onExpire settings function",
                onExpire
            ); // eslint-disable-line
        }
        return isValid;
    }
}

const DEFAULT_DELAY = 1000;
function getDelayFromExpiryTimestamp(expiryTimestamp) {
    if (!Validate.expiryTimestamp(expiryTimestamp)) {
        return null;
    }

    const seconds = Time.getSecondsFromExpiry(expiryTimestamp);
    const extraMilliSeconds = Math.floor(
        (seconds - Math.floor(seconds)) * 1000
    );
    return extraMilliSeconds > 0 ? extraMilliSeconds : DEFAULT_DELAY;
}

export default function useTimer({
    expiryTimestamp: expiry,
    onExpire,
    autoStart = true,
    isTimerActive,
}) {
    const [expiryTimestamp, setExpiryTimestamp] = useState(expiry);
    const [seconds, setSeconds] = useState(
        Time.getSecondsFromExpiry(expiryTimestamp)
    );
    const [isRunning, setIsRunning] = useState(autoStart);
    const [didStart, setDidStart] = useState(autoStart);
    const [delay, setDelay] = useState(
        getDelayFromExpiryTimestamp(expiryTimestamp)
    );
    const [timer, setTimer] = useState(0);
    useEffect(() => {
        let interval = null;
        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer((time) => time + 1);
            }, 1000);
        } else {
            clearInterval(interval);
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    function handleExpire() {
        Validate.onExpire(onExpire) && onExpire();
        setIsRunning(false);
        setDelay(null);
    }

    function pause() {
        setIsRunning(false);
    }

    function restart(newExpiryTimestamp, newAutoStart = true) {
        setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp));
        setDidStart(newAutoStart);
        setIsRunning(newAutoStart);
        setExpiryTimestamp(newExpiryTimestamp);
        setSeconds(Time.getSecondsFromExpiry(newExpiryTimestamp));
    }

    function resume() {
        const time = new Date();
        time.setMilliseconds(time.getMilliseconds() + seconds * 1000);
        restart(time);
    }

    function start() {
        if (didStart) {
            setSeconds(Time.getSecondsFromExpiry(expiryTimestamp));
            setIsRunning(true);
        } else {
            resume();
        }
    }

    useInterval(
        () => {
            if (delay !== DEFAULT_DELAY) {
                setDelay(DEFAULT_DELAY);
            }
            const secondsValue = Time.getSecondsFromExpiry(expiryTimestamp);
            setSeconds(secondsValue);
            if (secondsValue <= 0) {
                handleExpire();
            }
        },
        isRunning ? delay : null
    );

    return {
        ...Time.getTimeFromSeconds(seconds),
        start,
        pause,
        resume,
        restart,
        isRunning,
        timer: Time.getTimeFromSeconds(timer),
    };
}
