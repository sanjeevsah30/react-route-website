import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import { Label } from "@reusables";
import { secondsToTime, getRandomColors, scrollElementInView } from "@helpers";
import { Button, Typography, Input, Tag } from "antd";
import {
    // HighlightOutlined,
    CommentOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import IndividualCallConfig from "@constants/IndividualCall/index";
import Processing from "./Processing";
import { Spinner, NoData } from "@reusables";
import useThrottle from "hooks/useThrottle";
import { useLocation } from "react-router";
// import { DownloadOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux';
// import PencilSvg from 'app/static/svg/PencilSvg';
// import { handleDownloadTranscript } from '@apis/individual/index';

const { Paragraph } = Typography;
// const { Search } = Input;

const CallTranscript = React.forwardRef((props, ref) => {
    const baseClass = `individualcall-transcript`;
    const [activeTranscript, _setactiveTranscript] = useState(0);
    const [transcripts, setTranscripts] = useState([]);
    const [transcriptClicked, setTranscriptCliked] = useState(false);
    const useThrottleValue = useThrottle(props.playedSeconds, 1000);

    const baseRef = useRef(null);
    const activeTranscriptRef = useRef(activeTranscript);

    const location = useLocation();

    const setactiveTranscript = (data) => {
        activeTranscriptRef.current = data;
        _setactiveTranscript(data);
    };

    useEffect(() => {
        setTranscripts(props.transcripts);
        if (!props.isEditingTranscript && props.searchKeyword) {
            filterTranscripts(props.searchKeyword);
        }
    }, [props.transcripts]);

    useEffect(() => {
        const handleWheel = () => {
            props.handleAutoScroll(false);
        };

        function handlePlayPause() {
            if (
                this.getAttribute("icon") === "play" ||
                this.textContent === "play_arrow"
            ) {
                if (!props.isEditingTranscript) {
                    scrollElementInView(
                        `[data-index="${activeTranscriptRef.current}"]`,
                        "nearest"
                    );
                }
            } else {
                props.autoScrollEnabled || props.handleAutoScroll(true);
            }
        }

        if (baseRef.current) {
            baseRef.current.addEventListener("wheel", handleWheel);
        }
        const main_player = document.querySelector(
            ".main_player .shaka-play-button"
        );
        const main_player_mini = document.querySelector(
            ".main_player .shaka-small-play-button"
        );

        main_player && main_player.addEventListener("click", handlePlayPause);
        main_player_mini &&
            main_player_mini.addEventListener("click", handlePlayPause);

        return () => {
            if (baseRef.current) {
                baseRef.current.removeEventListener("wheel", handleWheel);
            }
            main_player &&
                main_player.removeEventListener("click", handlePlayPause);
            main_player &&
                main_player.removeEventListener("click", handlePlayPause);
        };
    }, []);

    useEffect(() => {
        const search = location.search;
        const urlSearchParamsObj = new URLSearchParams(search);
        let start_time = urlSearchParamsObj.get("start_time");
        let end_time = urlSearchParamsObj.get("end_time");
        let keyword = urlSearchParamsObj.get("keyword");

        if (start_time && end_time) {
            let activateIndex = props.transcripts.findIndex(
                (transcript) =>
                    +start_time === +transcript.start_time &&
                    +end_time === +transcript.end_time
            );
            keyword && filterTranscripts(keyword);
            if (activateIndex !== -1) {
                setactiveTranscript(activateIndex);
            }
        }
    }, []);

    useEffect(() => {
        if (transcriptClicked) {
            setTranscriptCliked(false);
            return;
        }
        let activateIndex = props.transcripts.findIndex(
            (transcript) =>
                props.playedSeconds >= transcript.start_time &&
                props.playedSeconds <= transcript.end_time
        );
        if (activateIndex !== -1) {
            setactiveTranscript(activateIndex);
        }
    }, [useThrottleValue]);

    useImperativeHandle(ref, () => ({
        filterTranscriptsExp(val) {
            filterTranscripts(val);
        },
    }));

    useEffect(() => {
        if (!props.isEditingTranscript && props.autoScrollEnabled) {
            scrollElementInView(
                `[data-index="${activeTranscript}"]`,
                undefined,
                undefined,
                null,
                true
            );
            // scrollElementInView(
            //     `[data-index="${activeTranscript}"]`,
            //     'nearest'
            // );
        }
    }, [activeTranscript]);

    useEffect(() => {
        const video = document.querySelector(".main_player .shaka-video");
        let timerArr = [];
        const resetTimer = () => {
            let syncData = document.querySelectorAll(".words");

            for (let i = 0; i < timerArr.length; i++) {
                clearTimeout(timerArr[i]);
            }
            for (let i = 0; i < syncData.length; i++) {
                syncData[i].style.background = "unset";
                syncData[i].style.color = "#666666";
            }
        };

        const startTimer = () => {
            let syncData = document.querySelectorAll(".words");

            for (let i = 0; i < timerArr.length; i++) {
                clearTimeout(timerArr[i]);
            }
            for (let i = 0; i < syncData.length; i++) {
                syncData[i].style.background = "unset";
                syncData[i].style.color = "#666666";
            }

            if (!video.paused)
                for (let i = 0; i < syncData.length; i++) {
                    timerArr.push(
                        setTimeout(() => {
                            if (i !== 0) {
                                syncData[i - 1].style.background = "unset";
                                syncData[i - 1].style.color = "#666666";
                            }
                            syncData[i].style.background = " #6A4FF7";
                            syncData[i].style.color =
                                "rgba(255, 255, 255, 0.9)";
                        }, ((+syncData[i].dataset.starttime - video.currentTime) * 1000) / video.playbackRate)
                    );
                    // timerArr.push(
                    //     setTimeout(() => {
                    //         syncData[i].style.background = 'unset';
                    //     }, ((+syncData[i].dataset.endtime - video.currentTime) * 1000) / video.playbackRate)
                    // );
                }
        };

        if (props.words) {
            video.onseeking = resetTimer;

            video.onpause = resetTimer;

            video.onratechange = startTimer;

            video.onplaying = startTimer;

            video.onerror = resetTimer;

            video.onwaiting = resetTimer;
        }

        if (props.words && !video.paused) {
            startTimer();
        }

        return () => {
            for (let i = 0; i < timerArr.length; i++) {
                clearTimeout(timerArr[i]);
            }
        };
    }, [activeTranscript]);

    // const binnarySearch = (transcripts, time) => {
    //     let high = transcripts.length - 1;
    //     let low = 0;
    //     let ans = -1;
    //     while (low <= high) {
    //         let mid = low + Math.floor((high - low) / 2);
    //         if (+transcripts[mid].start_time <= +time) {
    //             ans = mid;
    //             low = mid + 1;
    //         } else {
    //             high = mid - 1;
    //         }
    //     }
    //     if (ans !== -1) {
    //         if (transcripts[ans].end_time >= time) return ans;
    //     }
    //     return -1;
    // };

    const filterTranscripts = (val) => {
        // setSearchKeyword(val);
        if (!props.isEditingTranscript && val) {
            const found = props.transcripts.filter((transcript) =>
                new RegExp(val.replace(/\//g, ""), "ig").test(
                    transcript.monologue_text
                )
            );
            const highlight = found.map((transcript) => {
                return {
                    ...transcript,
                    monologue_text: transcript.monologue_text.replace(
                        new RegExp(val, "ig"),
                        function (value) {
                            return `<mark>${value}</mark>`;
                        }
                    ),
                };
            });
            setTranscripts(highlight);
        } else {
            setTranscripts(props.transcripts);
        }
    };

    const handleActiveTranscript = (index, time) => {
        setTranscriptCliked(true);
        if (index === activeTranscript && !time) {
            return;
        }

        setactiveTranscript(index);
        if (time) {
            props.seekToPoint(time, true);
            props.handleAutoScroll(true);
        }
    };

    // const { domain } = useSelector((state) => state.common);
    return (
        <>
            {props.isProcessing ? (
                <div className="height100p flex alignCenter justifyCenter">
                    <Processing />
                </div>
            ) : (
                <>
                    <div className={`${baseClass}-container`} ref={baseRef}>
                        {props.transcripts.length &&
                        !transcripts.length &&
                        !props.searchKeyword ? (
                            <Spinner />
                        ) : (
                            <>
                                {transcripts.length ? (
                                    transcripts.map((transcript, index) => (
                                        <div
                                            className={`${baseClass} ${
                                                index === activeTranscript
                                                    ? "active"
                                                    : ""
                                            }`}
                                            key={index}
                                            data-index={index}
                                            onClick={() => {
                                                handleActiveTranscript(
                                                    index,
                                                    transcript.start_time
                                                );
                                            }}
                                        >
                                            <div className={`${baseClass}-top`}>
                                                <div
                                                    className={`${baseClass}-top-name`}
                                                >
                                                    {/* <Icon
                                                        className={'fa-user'}
                                                    /> */}
                                                    <Label
                                                        label={
                                                            transcript.speaker_name
                                                        }
                                                    />
                                                    <div className="topics">
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
                                                    <div className="clock">
                                                        <ClockCircleOutlined />
                                                        <span>
                                                            {secondsToTime(
                                                                transcript.start_time
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`${baseClass}-top-time`}
                                                >
                                                    {!props.isEditingTranscript && (
                                                        <>
                                                            <div className="marginL8">
                                                                <Button
                                                                    icon={
                                                                        <CommentOutlined />
                                                                    }
                                                                    type={
                                                                        "text"
                                                                    }
                                                                    onClick={(
                                                                        evt
                                                                    ) => {
                                                                        evt.stopPropagation();
                                                                        props.setcommentToAdd(
                                                                            {
                                                                                comment: `@${secondsToTime(
                                                                                    transcript.start_time
                                                                                )} `,
                                                                                transcript:
                                                                                    null,
                                                                            }
                                                                        );

                                                                        props.getComment();
                                                                    }}
                                                                >
                                                                    <span className="bold400">
                                                                        Add
                                                                        Comment
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className={`${baseClass}-bottom`}
                                            >
                                                {props.isEditingTranscript ? (
                                                    <Paragraph
                                                        mark={
                                                            transcript.highlighted
                                                        }
                                                        editable={{
                                                            editing:
                                                                props.isEditingTranscript,
                                                            onChange: (str) => {
                                                                props.handleEditTranscript(
                                                                    str,
                                                                    index
                                                                );
                                                            },
                                                        }}
                                                    >
                                                        {index === 0
                                                            ? props
                                                                  .transcripts[0]
                                                                  .monologue_text
                                                            : transcript.monologue_text}
                                                    </Paragraph>
                                                ) : transcript.highlighted ? (
                                                    <div>
                                                        <mark>
                                                            {index ===
                                                            activeTranscript ? (
                                                                transcript.monologue_text
                                                                    .split(" ")
                                                                    .map(
                                                                        (
                                                                            word,
                                                                            i
                                                                        ) => {
                                                                            return (
                                                                                <React.Fragment
                                                                                    key={`${index}-${i}`}
                                                                                >
                                                                                    <span
                                                                                        data-starttime={`${transcript.word_alignment?.[i][1]}`}
                                                                                        data-endtime={`${transcript.word_alignment?.[i][2]}`}
                                                                                        className="words"
                                                                                    >
                                                                                        {
                                                                                            word
                                                                                        }
                                                                                    </span>
                                                                                    <span className="space">
                                                                                        {" "}
                                                                                    </span>
                                                                                </React.Fragment>
                                                                            );
                                                                        }
                                                                    )
                                                            ) : (
                                                                <span
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: transcript.monologue_text,
                                                                    }}
                                                                />
                                                            )}
                                                        </mark>
                                                    </div>
                                                ) : index !==
                                                  activeTranscript ? (
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: transcript.monologue_text,
                                                        }}
                                                    />
                                                ) : (
                                                    transcript.monologue_text
                                                        .split(" ")
                                                        .map((word, i) => {
                                                            return (
                                                                <React.Fragment
                                                                    key={`${index}-${i}`}
                                                                >
                                                                    <span
                                                                        data-starttime={`${transcript.word_alignment?.[i]?.[1]}`}
                                                                        data-endtime={`${transcript.word_alignment?.[i]?.[2]}`}
                                                                        className="words"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: word,
                                                                        }}
                                                                    />

                                                                    <span className="space">
                                                                        {" "}
                                                                    </span>
                                                                </React.Fragment>
                                                            );
                                                        })
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="height100p flex alignCenter justifyCenter">
                                        <NoData
                                            description={
                                                IndividualCallConfig.NOTRANSCRIPT
                                            }
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
});

export default CallTranscript;
