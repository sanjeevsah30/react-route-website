import React, { useState, useRef, useEffect } from "react";
import "./styles.scss";
import { Button, Dropdown, Menu, message, Space, Modal, Card } from "antd";
import { Link } from "react-router-dom";
import player_poster from "../../../static/images/player_poster.png";
import doc_poster from "../../../static/images/doc_poster.png";
import audio_poster from "../../../static/images/audio_poster.png";
import { useParams } from "react-router-dom";
import Loader from "@presentational/reusables/Loader";
import {
    ClockSvg,
    NoDataSvg,
    RightSvg,
    CloseSvg,
    ChevronRightSvg,
    PlaySvg,
    LeftArrowSvg,
    PlaySvgA,
    CompleteTickSvg,
} from "app/static/svg/indexSvg";

import Spinner from "@presentational/reusables/Spinner";
import ShakaPlayer from "../../ShakaPlayer/ShakaPlayer";
import {
    checkFileType,
    checkUrlFileType,
    formatFloat,
    secToTime,
    secondsToTime,
} from "../../../../tools/helpers";
import {
    fetchOneSession,
    fetchModule,
    fetchClip,
    fetchClipStatus,
    fetchOneSessionSuccess,
} from "../../../../store/coaching/action";
import { useDispatch, useSelector } from "react-redux";
import {
    getActiveCoachingSession,
    getStatusAssesment,
    setCoachingSession,
} from "@store/coaching/coaching.store";
import AssesmentModal from "./AssesmentModal";

function Coaching() {
    let { sessionId } = useParams();
    const dispatch = useDispatch();
    const playerRef = useRef(null);

    const {
        common: { filterReps },
        auth: { first_name, id },
        coaching: { oneModule, clip },
        coaching_dashboard: { session },
    } = useSelector((state) => state);

    const [activeClip, setActiveClip] = useState({});
    const [fullscreenVisible, setfullscreenVisible] = useState(false);
    const [isCourseComplete, setIsCourseComplete] = useState(false);
    const [playedDuration, setPlayedDuration] = useState(0);

    // const playerHandler = {
    //     onProgress: (time) => {
    //         setPlayedDuration(time);
    //     },
    // };

    useEffect(() => {
        const payload = {
            id: sessionId,
            reps_id: [getRepIdForCoaching()],
        };
        dispatch(getActiveCoachingSession(payload));
    }, []);

    // useEffect(() => {
    //     if (playedDuration >= activeClip?.end_time) {
    //         playerRef?.current.pause();
    //         playerRef.current.currentTime = activeClip?.start_time;
    //     }
    // }, [playedDuration, playerRef?.current]);

    // function provides RepId of user for which we want to get coaching sessions
    const getRepIdForCoaching = () => {
        return session?.data?.rep;
    };

    const getRepName =
        filterReps?.reps?.find(({ id }) => session?.data?.rep === id)?.name ||
        first_name;

    const getModuleHandler = (moduleId) => {
        const payload = {
            module_id: moduleId,
            reps_id: [getRepIdForCoaching()],
        };
        dispatch(fetchModule(payload));
    };

    const getClipHandler = (clipid) => {
        const active = oneModule.module_data.clips.filter(
            ({ id }) => id === clipid
        );

        setActiveClip(active[0]);
        if (checkFileType(checkUrlFileType(active[0].media_url)) === "document")
            window.open(active[0].media_url, "_blank");
        else setfullscreenVisible(true);
    };

    const clipStatusHandler = () => {
        const payload = {
            status: "COMPLETED",
            reps_id: [getRepIdForCoaching()],
            module_id: oneModule?.module_data?.id,
            session_stats_id: session?.data?.id,
        };
        dispatch(fetchClipStatus(payload, activeClip?.id));
        // dispatch(getActiveCoachingSession(sessionId));
        // setfullscreenVisible(false);
    };

    const [showAssesmentModal, setShowAssesmentModal] = useState(false);

    return (
        <Spinner loading={session.loading}>
            {!session.loading && (
                <div className="coaching-container flex justifySpaceBetween height100p">
                    {/* ----------------  left coaching card i.e. all Courses container --------------*/}

                    <div className="coaching-cards left-section flex1">
                        <div className="height100p flex column paddingR24 overflowYscroll">
                            <div className="flexShrink">
                                <h3 className="coaching-head flex alignCenter font26 bold700">
                                    <Link
                                        className="flex alignCenter"
                                        to={"/home/coaching/"}
                                    >
                                        <LeftArrowSvg
                                            style={{
                                                fontSize: "14px",
                                                marginRight: "8px",
                                            }}
                                        />
                                    </Link>
                                    <span>Coaching Sessions</span>
                                </h3>
                                <span
                                    className="dove_gray_cl font14 bold400"
                                    style={{ marginLeft: "35px" }}
                                >{`${
                                    session?.data?.total_modules -
                                    session?.data?.completed_modules
                                } ${"Coaching Module to Complete"}`}</span>
                                <ParameterBar
                                    barData={{
                                        name: `${
                                            getRepName
                                                .split(" ")[0]
                                                .split("")[0]
                                                .toUpperCase() +
                                            getRepName.split(" ")[0].slice(1)
                                        }`,
                                        doneCourses: `${session?.data?.completed_modules}`,
                                        massage: `${
                                            session?.data?.total_modules ===
                                            session?.data?.completed_modules
                                                ? "Coaching is completed"
                                                : "Coaching in progress"
                                        }`,
                                        allCourses: `${session?.data?.total_modules}`,
                                    }}
                                />
                            </div>
                            <div className="">
                                <h3 className="coaching-ataintion font18 bold700 marginT22 marginB16 primary_cl">
                                    Sessions
                                </h3>
                                {session?.data?.module_stats?.map(
                                    (item, index) => (
                                        <ParameterCard
                                            style={{
                                                borderLeft: `6px solid #1a62f2`,
                                            }}
                                            key={item?.module}
                                            data={{
                                                item,
                                                index,
                                                getModuleHandler:
                                                    getModuleHandler,
                                            }}
                                        />
                                    )
                                )}

                                {session?.data?.assessment ? (
                                    <div>
                                        <h3 className="coaching-ataintion font18 bold700 marginT22 marginB16 primary_cl">
                                            Assessment
                                        </h3>
                                        <div
                                            className={`parameter-card flex justifySpaceBetween marginTB14 curPoint`}
                                            onClick={() => {
                                                if (
                                                    session?.data
                                                        ?.total_modules ===
                                                        session?.data
                                                            ?.completed_modules &&
                                                    session?.data?.rep === id
                                                )
                                                    setShowAssesmentModal(true);
                                            }}
                                            style={{
                                                borderLeft: `6px solid #1a62f2`,
                                                ...(!(
                                                    session?.data
                                                        ?.total_modules ===
                                                        session?.data
                                                            ?.completed_modules &&
                                                    session?.data?.rep === id
                                                ) && {
                                                    opacity: "0.6",
                                                    cursor: "not-allowed",
                                                }),
                                            }}
                                        >
                                            <div className="">
                                                <h5 className="font16 bold600 mine_shaft_cl">
                                                    1.
                                                    {
                                                        session?.data
                                                            ?.assessment?.title
                                                    }
                                                </h5>
                                                <span className="avialable-vedio dove_gray_cl">
                                                    {`${
                                                        session?.data
                                                            ?.assessment
                                                            ?.question || 0
                                                    } Questions`}
                                                </span>
                                                <span className="lecture_duration-tracker dove_gray_cl"></span>
                                                {session?.data?.assessment
                                                    ?.status !== "Completed" ? (
                                                    <>
                                                        <span>{" | "}</span>
                                                        <span className="course-msg primary_cl">
                                                            Pending
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="primary_cl">
                                                            <span>{" | "}</span>
                                                            <span className="paddingLR8 bold600">{`${session?.data?.assessment?.scored}/${session?.data?.assessment?.total} points`}</span>
                                                            <span>{" | "}</span>
                                                        </span>
                                                        <span className="course-msg good_green_cl">{`Successfully Completed`}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="icon-container flex justifyCenter alignCenter">
                                                <RightSvg
                                                    style={{
                                                        paddingRight: "27px",
                                                        display: `${
                                                            session?.data
                                                                ?.assessment
                                                                ?.status ===
                                                            "Completed"
                                                                ? "block"
                                                                : "none"
                                                        }`,
                                                    }}
                                                />
                                                {/* <ClockSvg
            className="clock-icon"
            style={{
                transform: 'scale(2)',
                display: `${
                    props?.data?.item
                        ?.total !==
                        props?.data?.item
                            ?.completed_clips &&
                    props?.data?.item
                        ?.completed_clips !==
                        0
                        ? ''
                        : 'none'
                }`,
            }}
        /> */}
                                                <div
                                                    className="flex alignCenter justifyCenter"
                                                    style={{
                                                        height: "24px",
                                                        width: "24px",
                                                        backgroundColor:
                                                            "#99999933",
                                                        borderRadius: "50%",
                                                    }}
                                                >
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
                                    </div>
                                ) : null}

                                <div
                                    className={`${
                                        session?.data?.total_modules ===
                                        session?.data?.completed_modules
                                            ? "finish-btn2"
                                            : "finish-btn1"
                                    } flex alignCenter justifyEnd`}
                                >
                                    <Button
                                        disabled={
                                            !(
                                                session?.data?.total_modules ===
                                                    session?.data
                                                        ?.completed_modules &&
                                                session?.data?.rep === id
                                            ) ||
                                            (session?.data?.assessment &&
                                                session?.data?.assessment
                                                    ?.status !== "Completed")
                                        }
                                        onClick={() =>
                                            setIsCourseComplete(true)
                                        }
                                        type="primary"
                                    >
                                        Finish Coaching
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ----------------  right coaching card i.e. all videos container --------------*/}

                    <div className="coaching-cards right-section flex1">
                        <div className="height100p flex column paddingR24 overflowYscroll">
                            <Loader loading={oneModule.module_loading}>
                                <div className="heading-container flex alignCenter justifySpaceBetween">
                                    <div>
                                        <h4 className="font22 bold700 mine_shaft_cl">
                                            {oneModule?.module_data?.title}
                                        </h4>
                                        <span className="vedio-tracker dove_gray_cl">
                                            {/* {`${media.videos.length ? `${media.videos.length} Videos` : ''} ${media.audios.length ? `| ${media.audios.length} Audios` : ''}`} */}
                                            {/* {`${
                                                oneModule?.module_data?.total ||
                                                0
                                            } Media`} */}
                                            {`${
                                                oneModule?.module_data?.clips
                                                    ?.length || 0
                                            } Media`}
                                        </span>
                                        <span className="lecture_duration-tracker dove_gray_cl">
                                            {oneModule?.module_data
                                                ?.duration ? (
                                                <>
                                                    <span>{" | "}</span>
                                                    <ClockSvg className="inlineFlex alignCenter" />
                                                    <span className="lecture_duration-length">
                                                        {/* {`${media.duration.hours ? `${media.course_duration.hours}hr` : ''} ${media.course_duration.minutes ? `${media.course_duration.minutes}min` : ''}`} */}
                                                        {secondsToTime(
                                                            oneModule
                                                                ?.module_data
                                                                ?.duration
                                                        )}
                                                    </span>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    </div>
                                </div>
                                {oneModule?.module_data?.clips?.length ? (
                                    <div className="course-container">
                                        {oneModule?.module_data?.clips?.map(
                                            (media, idx) => (
                                                <div
                                                    className="video-container1"
                                                    onClick={() => {
                                                        getClipHandler(
                                                            media?.id
                                                        );
                                                        if (
                                                            checkFileType(
                                                                checkUrlFileType(
                                                                    media.media_url
                                                                )
                                                            ) === "document"
                                                        ) {
                                                            const payload = {
                                                                status: "COMPLETED",
                                                                reps_id: [
                                                                    getRepIdForCoaching(),
                                                                ],
                                                                module_id:
                                                                    oneModule
                                                                        ?.module_data
                                                                        ?.id,
                                                                session_stats_id:
                                                                    session
                                                                        ?.data
                                                                        ?.id,
                                                            };
                                                            dispatch(
                                                                fetchClipStatus(
                                                                    payload,
                                                                    media?.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    key={idx}
                                                >
                                                    <div className="vedio_card">
                                                        <img
                                                            className="height100p width100p"
                                                            src={
                                                                checkFileType(
                                                                    checkUrlFileType(
                                                                        media.media_url
                                                                    )
                                                                ) === "document"
                                                                    ? doc_poster
                                                                    : checkFileType(
                                                                          checkUrlFileType(
                                                                              media.media_url
                                                                          )
                                                                      ) ===
                                                                      "audio"
                                                                    ? audio_poster
                                                                    : checkFileType(
                                                                          checkUrlFileType(
                                                                              media.media_url
                                                                          )
                                                                      ) ===
                                                                      "video"
                                                                    ? player_poster
                                                                    : doc_poster
                                                            }
                                                            //         ? checkFileType(
                                                            //             checkUrlFileType(media.media_url)
                                                            //         ) ===
                                                            //             'audio'
                                                            //             :
                                                            //             ? doc_poster
                                                            //             : palyer_poster
                                                            //             // audio_poster
                                                            // }
                                                            alt="poster_img"
                                                        ></img>
                                                        {/* <Card
                                                            cover={
                                                                <img
                                                                    src={
                                                                        palyer_poster
                                                                    }
                                                                    alt="poster_img"
                                                                />
                                                            }
                                                            hoverable
                                                            style={{
                                                                width: 'inherit !important',
                                                                borderRadius:
                                                                    'inherit',
                                                            }}
                                                        /> */}
                                                    </div>

                                                    <div className="vedio-thambnail flex alignCenter justifySpaceBetween">
                                                        <div
                                                            className="white_cl"
                                                            style={{
                                                                maxWidth: "80%",
                                                            }}
                                                        >
                                                            <div className="heading bold700 font16">
                                                                {
                                                                    // ?.meeting_json
                                                                    media?.title
                                                                }{" "}
                                                            </div>
                                                            <div className="lecture_duration-tracker flex alignCenter bold400 font12">
                                                                {checkFileType(
                                                                    checkUrlFileType(
                                                                        media.media_url
                                                                    )
                                                                ) !==
                                                                "document" ? (
                                                                    <span className="flex alignCenter justifyCenter">
                                                                        <ClockSvg
                                                                            style={{
                                                                                paddingRight:
                                                                                    "6px",
                                                                            }}
                                                                        />
                                                                        <span className="lecture_duration-length marginR5">
                                                                            {secondsToTime(
                                                                                media?.duration
                                                                            )}
                                                                        </span>
                                                                    </span>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                                {media?.status ===
                                                                "COMPLETED" ? (
                                                                    <>
                                                                        <RightSvg
                                                                            style={{
                                                                                transform:
                                                                                    "scale(0.8)",
                                                                                paddingRight:
                                                                                    "6px",
                                                                            }}
                                                                        />{" "}
                                                                        <span className="course-status">{`${"Completed"}`}</span>
                                                                    </>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {checkFileType(
                                                                checkUrlFileType(
                                                                    media.media_url
                                                                )
                                                            ) !== "document" ? (
                                                                <PlaySvgA
                                                                    className="play-btn"
                                                                    style={{
                                                                        transform:
                                                                            "scale(1.5)",
                                                                        backgroundColor:
                                                                            "#fff",
                                                                        borderRadius:
                                                                            "50%",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex alignCenter justifyCenter height100p">
                                        <NoDataSvg />
                                    </div>
                                )}
                            </Loader>
                        </div>
                    </div>

                    {/* -------------------- coaching modal cards ------------------- */}

                    {fullscreenVisible && (
                        <Modal
                            centered
                            visible={fullscreenVisible}
                            closable={false}
                            footer={null}
                            width="1094px"
                            onCancel={() => setfullscreenVisible(false)}
                            className="coaching_video_player"
                        >
                            <div className="video-container1 full-screen">
                                <ShakaPlayer
                                    // {...playerHandler}
                                    videoRef={playerRef}
                                    uri={activeClip?.media_url}
                                    playOnLoad={false}
                                    // startTime={
                                    //     activeClip?.start_time
                                    // }
                                    // onProgress={clipStatusHandler}
                                    onEnded={clipStatusHandler}
                                />
                                <div className="vedio-thambnail-modal white_cl flex alignCenter justifySpaceBetween">
                                    <div className="heading bold600 font22">
                                        {activeClip?.title}{" "}
                                    </div>
                                    <div
                                        className="flex"
                                        onClick={() => {
                                            setfullscreenVisible(false);
                                            playerRef.current.pause();
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div
                                        // onClick={clipStatusHandler}
                                        >
                                            <CloseSvg
                                                style={{
                                                    transform: "scale(1.3)",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    )}
                    <Modal
                        centered
                        visible={isCourseComplete}
                        closable={false}
                        footer={null}
                        width="584px"
                    >
                        <div className="completion-card-container">
                            <div className="completion-card flex alignCenter column justifyCenter">
                                <div className="svg-icon">
                                    <CompleteTickSvg />
                                </div>
                                <div className="bold600 font16">{`Hey ${
                                    first_name
                                        .split(" ")[0]
                                        .split("")[0]
                                        .toUpperCase() +
                                    first_name.split(" ")[0].slice(1)
                                } !`}</div>
                                <div className="bold700 font24">
                                    Awesome. Coaching Complete
                                </div>
                                <div classNAme="bold400 font14">
                                    Keep up the good work.
                                </div>
                                <div
                                    className="close-btn marginT30"
                                    onClick={() => setIsCourseComplete()}
                                >
                                    <Link to="/home/coaching">
                                        <Button type="primary">
                                            Close Window
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div
                                className="close-btn1"
                                onClick={() => setIsCourseComplete()}
                            >
                                <CloseSvg />
                            </div>
                        </div>
                    </Modal>
                    {session?.data?.assessment?.status !== "Completed" ? (
                        <AssesmentModal
                            open={showAssesmentModal}
                            handleClose={() => {
                                if (
                                    session?.data?.assessment?.status !==
                                    "Completed"
                                ) {
                                    dispatch(
                                        getStatusAssesment(session?.data?.id)
                                    ).then((res) => {
                                        if (
                                            res.payload?.status === "Completed"
                                        ) {
                                            dispatch(
                                                setCoachingSession({
                                                    ...session?.data,
                                                    assessment: {
                                                        ...session?.data
                                                            ?.assessment,
                                                        scored: res?.payload
                                                            ?.scored,
                                                        status: "Completed",
                                                    },
                                                })
                                            );
                                            setShowAssesmentModal(false);
                                        } else setShowAssesmentModal(false);
                                    });
                                } else setShowAssesmentModal(false);
                            }}
                            urlId={session?.data?.assessment?.responder_uri}
                        />
                    ) : (
                        <Modal
                            centered
                            visible={showAssesmentModal}
                            onCancel={() => setShowAssesmentModal(false)}
                            footer={null}
                            width="584px"
                        >
                            <div className="completion-card-container">
                                <div className="completion-card flex alignCenter column justifyCenter">
                                    <div className="svg-icon">
                                        <CompleteTickSvg />
                                    </div>

                                    <div className="bold700 font20">
                                        Check your Convin registered mail id for
                                        your scorecard
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            )}
        </Spinner>
    );
}

const ParameterBar = (props) => {
    return (
        <div className="parameterBar">
            <div className="flex alignCenter justifySpaceBetween">
                <div className="parameter font20 bold600 min_width_0_flex_child flex1 elipse_text">
                    <div className="elipse_text">
                        {`Hey ${props.barData.name} !`}
                    </div>
                </div>
                <div className="para_percentile font22 bold600">
                    {`${props.barData.doneCourses} / ${props.barData.allCourses}`}
                </div>
            </div>
            <span>{`${props.barData.massage}`}</span>
            <div className="bar marginT16">
                <div
                    className="bar-progress"
                    style={{
                        width: `${
                            (props.barData.doneCourses /
                                props.barData.allCourses) *
                            100
                        }%`,
                    }}
                ></div>
            </div>
        </div>
    );
};

const ParameterCard = (props) => {
    const {
        coaching: { oneModule },
    } = useSelector((state) => state);
    return (
        <div
            className={`parameter-card flex justifySpaceBetween marginTB14 curPoint ${
                oneModule?.module_data?.id === props?.data?.item?.module
                    ? "active"
                    : ""
            }`}
            style={props.style}
            onClick={() =>
                props.data.getModuleHandler(props?.data?.item?.module)
            }
        >
            <div className="">
                <h5 className="font16 bold600 mine_shaft_cl">{`${
                    props?.data?.index + 1
                }. ${props?.data?.item?.title}`}</h5>
                <span className="avialable-vedio dove_gray_cl">
                    {/* {`${props.data.item.videos.length ? `${props.data.item.videos.length}Videos` : ''}  ${props.data.item.audios.length ? ` | ${props.data.item.audios.length} Audios` : ''}`} */}
                    {`${props?.data?.item?.total} Media`}
                </span>
                <span className="lecture_duration-tracker dove_gray_cl">
                    {props?.data?.item?.duration ? (
                        <>
                            <span>{" | "}</span>
                            <ClockSvg className="inlineFlex alignCenter" />
                            <span className="lecture_duration-length marginL6">
                                {`${secondsToTime(
                                    props?.data?.item?.duration
                                )}`}
                            </span>
                        </>
                    ) : (
                        ""
                    )}
                </span>

                {props?.data?.item?.total !==
                    props?.data?.item?.completed_clips &&
                props?.data?.item?.completed_clips !== 0 ? (
                    <>
                        <span>{" | "}</span>
                        <span className="course-msg primary_cl">{`${formatFloat(
                            (props?.data?.item?.completed_clips /
                                props?.data?.item?.total) *
                                100,
                            2
                        )}% Completed`}</span>
                    </>
                ) : props?.data?.item?.total ===
                  props?.data?.item?.completed_clips ? ( //
                    <>
                        <span>{" | "}</span>
                        <span className="course-msg good_green_cl">{`Successfully Completed`}</span>
                    </>
                ) : (
                    <></>
                )}
            </div>
            <div className="icon-container flex justifyCenter alignCenter">
                <RightSvg
                    style={{
                        paddingRight: "27px",
                        display: `${
                            props?.data?.item?.total ===
                            props?.data?.item?.completed_clips
                                ? ""
                                : "none"
                        }`,
                    }}
                />
                <ClockSvg
                    className="clock-icon"
                    style={{
                        transform: "scale(2)",
                        display: `${
                            props?.data?.item?.total !==
                                props?.data?.item?.completed_clips &&
                            props?.data?.item?.completed_clips !== 0
                                ? ""
                                : "none"
                        }`,
                    }}
                />
                <div
                    className="flex alignCenter justifyCenter"
                    style={{
                        height: "24px",
                        width: "24px",
                        backgroundColor: "#99999933",
                        borderRadius: "50%",
                    }}
                >
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
};

const menu = (
    <Menu
        onClick={handleMenuClick}
        items={[
            {
                label: "1st menu item",
                key: "1",
            },
            {
                label: "2nd menu item",
                key: "2",
            },
            {
                label: "3rd menu item",
                key: "3",
            },
        ]}
    />
);

const handleMenuClick = (e) => {
    message.info("Click on menu item.");
};

export default Coaching;
