import React, { useState, useEffect, useRef } from "react";
import { getRandomColors, secondsToTime, uid } from "@tools/helpers";
import { Row, Col, Input, Tag } from "antd";
import { Label, Icon, NoData } from "@reusables";
import useThrottle from "hooks/useThrottle";
import { useLocation } from "react-router";

const MeetingTranscript = (props) => {
    const [activeTranscript, _setActiveTranscript] = useState(0);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    const activeTranscriptRef = useRef(activeTranscript);

    const setActiveTranscript = (data) => {
        activeTranscriptRef.current = data;
        _setActiveTranscript(data);
    };

    if (props.playerRef.current) {
        props.playerRef.current.onloadeddata = function () {
            function handlePlayPause() {
                if (this.getAttribute("icon") === "play") {
                    scrollToElement(activeTranscriptRef.current);
                }
            }
            document
                .querySelector(".preview_player .shaka-play-button")
                .addEventListener("click", handlePlayPause);
        };
    }

    const useThrottleValue = useThrottle(props.playedSeconds, 1000);

    useEffect(() => {
        let activateIndex = props.transcript_json.findIndex(
            (transcript) =>
                props.playedSeconds >= transcript.start_time &&
                props.playedSeconds <= transcript.end_time
        );
        handleActiveTranscript(
            activateIndex === -1 ? activeTranscript : activateIndex
        );
    }, [useThrottleValue]);

    const handleActiveTranscript = (index, time) => {
        if ((index === activeTranscript || !isAutoScrollEnabled) && !time) {
            setActiveTranscript(index);
            return;
        }
        scrollToElement(index);
        setActiveTranscript(index);
        if (time) {
            props.seekNplay(time, true);
            setIsAutoScrollEnabled(true);
        }
    };

    useEffect(() => {
        const handleWheel = () => {
            setIsAutoScrollEnabled(false);
        };

        document
            .querySelector(`.preview_right_transcript_monologues`)
            .addEventListener("wheel", handleWheel);
        return () => {
            // document
            //     .querySelector(`.preview_right_transcript_monologues`)
            //     .removeEventListener('wheel', handleWheel);
        };
    }, []);

    const location = useLocation();
    useEffect(() => {
        const search = location.search;
        const urlSearchParamsObj = new URLSearchParams(search);
        let start_time = urlSearchParamsObj.get("start_time");
        let end_time = urlSearchParamsObj.get("end_time");
        if (start_time && end_time) {
            let activateIndex = props.transcript_json.findIndex(
                (transcript) => +start_time === +transcript.start_time
            );
            if (activateIndex !== -1) {
                handleActiveTranscript(activateIndex, start_time);
            }
        }
    }, []);

    const scrollToElement = (index) => {
        const elem = document.querySelector(
            `.preview_right_transcript_monologues [data-index="${index}"]`
        );
        const topPos = elem ? elem.offsetTop : 0;

        scrollTo(
            document.querySelector(".preview_right_transcript_monologues"),
            topPos - 30,
            300
        );
    };

    function scrollTo(element, to, duration) {
        var start = element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20;

        var animateScroll = function () {
            currentTime += increment;
            var val = Math.easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val;
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }

    //t = current time
    //b = start value
    //c = change in value
    //d = duration
    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    return (
        <Row className={"preview_right_transcript"}>
            <Col className={"preview_right_transcript_monologues"}>
                {props.transcript_json.length ? (
                    props.transcript_json.map((transcript, idx) => {
                        return (
                            <div
                                key={uid() + idx}
                                data-index={idx}
                                className={`preview_right_transcript_monologue ${
                                    idx === activeTranscript
                                        ? "preview_right_transcript_monologue_active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleActiveTranscript(
                                        idx,
                                        transcript.start_time
                                    )
                                }
                            >
                                <Row className={"preview_right_transcript_top"}>
                                    <div
                                        className={
                                            "preview_right_transcript_top_username"
                                        }
                                    >
                                        <i
                                            className="fa fa-user"
                                            aria-hidden="true"
                                        ></i>
                                        <Label
                                            label={transcript.speaker_name}
                                        />

                                        <div
                                            className={
                                                "preview_right_transcript_top_topics"
                                            }
                                        >
                                            {Object.keys(
                                                transcript.topics
                                            )[0] && (
                                                <Tag
                                                    color={getRandomColors(
                                                        Object.keys(
                                                            transcript.topics
                                                        )[0]
                                                    )}
                                                >
                                                    {
                                                        Object.keys(
                                                            transcript.topics
                                                        )[0]
                                                    }
                                                </Tag>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            "preview_right_transcript_top_time"
                                        }
                                    >
                                        <Icon className={"fa-clock-o"} />
                                        {secondsToTime(transcript.start_time)}
                                    </div>
                                </Row>
                                <Row>
                                    {props?.keyword ? (
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: transcript.monologue_text.replace(
                                                    new RegExp(
                                                        props.keyword,
                                                        "gi"
                                                    ),
                                                    (matched) =>
                                                        `<mark class="cite">${matched}</mark>`
                                                ),
                                            }}
                                        />
                                    ) : (
                                        <p>{transcript.monologue_text}</p>
                                    )}
                                </Row>
                            </div>
                        );
                    })
                ) : (
                    <NoData description={"Transcript not available"} />
                )}
            </Col>
        </Row>
    );
};

export default MeetingTranscript;
