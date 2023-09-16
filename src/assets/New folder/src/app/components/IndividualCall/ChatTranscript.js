import React, {
    useState,
    useEffect,
    useRef,
    useImperativeHandle,
    Fragment,
} from "react";
import { Label } from "@reusables";
import {
    secondsToTime,
    getRandomColors,
    scrollElementInView,
    getColor,
    scrollElementInNoShaka,
    getDateTime,
} from "@helpers";
import { Button, Typography, Input, Tag, Avatar, Tooltip } from "antd";
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

import "./chatTranscript.scss";
import ChatImage from "./ChatImage";

const { Paragraph } = Typography;

function isHTML(str) {
    const htmlRegex = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i;
    return htmlRegex.test(str);
}
// const { Search } = Input;

const ChatTranscript = React.forwardRef((props, ref) => {
    const endRef = useRef(null);
    const baseClass = `chat-transcript`;
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
        if (!props.isEditingTranscript && props.searchKeyword) {
            filterTranscripts(props.searchKeyword);
        }
        let pattern =
            /(?:[hH]ttps?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

        const urlTranscripts = props.transcripts.map((transcript) => {
            if (pattern.test(transcript.monologue_text)) {
                return {
                    ...transcript,
                    monologue_text: transcript.monologue_text,
                    ...(isHTML(transcript.monologue_text) || {
                        image:
                            transcript.monologue_text?.includes("png") ||
                            transcript.monologue_text?.includes("jpg") ||
                            transcript.monologue_text
                                ?.split("type")?.[1]
                                ?.includes("image"),
                    }),
                    urls: [pattern.exec(transcript.monologue_text)[0]],
                };
            }
            return transcript;
        });
        setTranscripts(urlTranscripts);
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

    useImperativeHandle(ref, () => ({
        filterTranscriptsExp(val) {
            filterTranscripts(val);
        },
    }));

    const checkIsPhoneNumber = (ch) =>
        ch === "+" || !isNaN(parseInt(ch)) ? true : false;

    useEffect(() => {
        if (transcripts.length) {
            scrollElementInNoShaka(
                `[data-index="${
                    transcripts[transcripts.length - 1]?.timestamp
                }"]`,
                undefined,
                undefined,
                null,
                true
            );
        }
    }, [transcripts.length]);

    const filterTranscripts = (val) => {
        // setSearchKeyword(val);
        if (val) {
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

    // const handleActiveTranscript = (index, time) => {
    //     setTranscriptCliked(true);
    //     if (index === activeTranscript && !time) {
    //         return;
    //     }

    //     setactiveTranscript(index);
    //     if (time) {
    //         props.seekToPoint(time, true);
    //         props.handleAutoScroll(true);
    //     }
    // };

    // const { domain } = useSelector((state) => state.common);

    // console.log(transcripts);
    const [i, setI] = useState(0);

    // let showLine = false;
    // let currDate = getDateTime(start_time, 'date');
    // if (prevDate !== currDate || index === 0) {
    //     showLine = true;
    // }
    // return (
    //     <div style={style} key={data.id}>
    //         {showLine && (
    //             <div className="date_timeline_container">
    //                 <div className="date"> {currDate}</div>
    //             </div>
    //         )}
    return (
        <>
            {/* <input
                value={i}
                onChange={(e) => {
                    setI(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    scrollElementInNoShaka(
                        `[data-index="${i}"]`,
                        undefined,
                        undefined,
                        null,
                        true
                    );
                }}
            >
                Scroll
            </button> */}
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
                                    transcripts.map((transcript, index) => {
                                        const {
                                            monologue_text,
                                            speaker_type,
                                            speaker_name,
                                            timestamp,
                                        } = transcript;
                                        let showLine = false;
                                        let prevDate =
                                            index !== 0
                                                ? getDateTime(
                                                      new Date(
                                                          transcripts[index - 1]
                                                              ?.timestamp * 1000
                                                      ),
                                                      "date"
                                                  )
                                                : null;
                                        let currDate = getDateTime(
                                            new Date(timestamp * 1000),
                                            "date"
                                        );

                                        if (
                                            prevDate !== currDate ||
                                            index === 0
                                        ) {
                                            showLine = true;
                                        }
                                        return transcript.image ? (
                                            <Fragment key={index}>
                                                <ChatImage
                                                    transcript={transcript}
                                                    addComment={(evt) => {
                                                        evt.stopPropagation();
                                                        props.setcommentToAdd({
                                                            comment: "",
                                                            transcript,
                                                        });
                                                        props.getComment();
                                                    }}
                                                />
                                            </Fragment>
                                        ) : (
                                            <Fragment key={index}>
                                                {showLine && (
                                                    <div className="date_timeline_container">
                                                        <div className="date">
                                                            {currDate}
                                                        </div>
                                                    </div>
                                                )}
                                                <div
                                                    className={`${speaker_type}_chat`}
                                                    key={index}
                                                    data-index={timestamp}
                                                >
                                                    <div className="chat_container">
                                                        <div className="chat_text">
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                }}
                                                            >
                                                                <div
                                                                    className="font12 chat_date bold600 flex1 paddingR16"
                                                                    style={{
                                                                        textAlign:
                                                                            "left",
                                                                        whiteSpace:
                                                                            "nowrap",
                                                                        overflow:
                                                                            "hidden",
                                                                        textOverflow:
                                                                            "ellipsis",
                                                                    }}
                                                                >
                                                                    {
                                                                        speaker_name
                                                                    }
                                                                </div>
                                                                <div className="font12 chat_date">
                                                                    {getDateTime(
                                                                        new Date(
                                                                            timestamp *
                                                                                1000
                                                                        ),
                                                                        "time"
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: monologue_text,
                                                                }}
                                                            />
                                                        </div>

                                                        <Tooltip title="Add Comment">
                                                            <Button
                                                                icon={
                                                                    <CommentOutlined />
                                                                }
                                                                type={"text"}
                                                                onClick={(
                                                                    evt
                                                                ) => {
                                                                    evt.stopPropagation();
                                                                    props.setcommentToAdd(
                                                                        {
                                                                            comment:
                                                                                "",
                                                                            transcript,
                                                                        }
                                                                    );
                                                                    props.getComment();
                                                                }}
                                                                className="comment_btn"
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        );
                                    })
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

export default ChatTranscript;
