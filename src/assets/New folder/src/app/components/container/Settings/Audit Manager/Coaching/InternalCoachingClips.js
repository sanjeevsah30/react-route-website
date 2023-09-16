import Icon from "@presentational/reusables/Icon";
import Loader from "@presentational/reusables/Loader";
import {
    deleteClipVerifying,
    deleteInternalCoachingClip,
    getInternalCoachingClips,
    getNextInternalCoachingClips,
    verifyInternalCoachingClip,
} from "@store/internalCoachingSlice/internalCoachingSlice";
import { getDurationInSeconds, secToTime, secondsToTime } from "@tools/helpers";
import { Button, Modal, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ShakaPlayer from "app/components/ShakaPlayer/ShakaPlayer";
import ClockSvg from "app/static/svg/ClockSvg";
import CloseSvg from "app/static/svg/CloseSvg";
import NoDataSvg from "app/static/svg/NoDataSvg";
import PlaySvg from "app/static/svg/PlaySvg";
import RightSvg from "app/static/svg/RightSvg";
import palyer_poster from "../../../../../static/images/player_poster.png";
import "../../../Coaching/styles.scss";
import PendingModal from "./PendingModal";

const { Option } = Select;

export default function InternalCoachingClips(props) {
    let { id } = useParams();
    const dispatch = useDispatch();
    const [currentMedia, setCurrentMedia] = useState({});

    const {
        internalCoachingSlice: {
            clips,
            loading,
            verifyingClip,
            next,
            nextLoading,
        },
    } = useSelector((state) => state);

    const [status, setStatus] = useState("all");

    useEffect(() => {
        if (id) {
            dispatch(getInternalCoachingClips({ id, status }));
        }
    }, [status]);

    const [activeClip, setActiveClip] = useState({});
    const [fullscreenVisible, setfullscreenVisible] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const handleShowPendingModal = (media) => {
        setShowPendingModal(!showPendingModal);
        getClipHandler(media?.id);
    };

    const handleSetFullScreenVisible = () => {
        setfullscreenVisible(true);
    };

    const getClipHandler = (clip) => {
        const active = clips.find(({ id }) => id === clip);
        setActiveClip(active || {});
    };

    const playerRef = useRef();

    return (
        <div className="coaching-container">
            <Select
                className="graph__dropdown bold400 font12 marginR10"
                suffixIcon={
                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                }
                dropdownRender={(menu) => (
                    <div className="mine_shaft_cl">{menu}</div>
                )}
                dropdownClassName="freq_dropdown"
                // dropdownStyle={{display: "none"}}
                onChange={(value) => {
                    setStatus(value);
                }}
                value={status}
            >
                <Option
                    value="all"
                    className="option__container bold400 font12"
                >
                    All
                </Option>
                <Option
                    value="Verified"
                    className="option__container bold400 font12"
                >
                    Verified
                </Option>
                <Option
                    value="In_Review"
                    className="option__container bold400 font12"
                >
                    In Review
                </Option>
            </Select>
            <div className="coaching-cards right-section flex1">
                <div className="height100p flex column paddingR24 overflowYscroll">
                    <Loader loading={loading}>
                        {clips?.length ? (
                            <div className="course-container internal-course-container">
                                {clips?.map((media, idx) => (
                                    <div className="video-container1" key={idx}>
                                        <div className="vedio_card">
                                            <img
                                                src={palyer_poster}
                                                alt="poster_img"
                                            />
                                        </div>
                                        <div className="vedio-thambnail flex alignCenter justifySpaceBetween">
                                            <div
                                                className="white_cl"
                                                style={{
                                                    maxWidth: "80%",
                                                }}
                                            >
                                                <div
                                                    className="heading bold700 font16 curPoint"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const win = window.open(
                                                            `/call/${media?.meeting?.id}`
                                                        );
                                                        win.focus();
                                                    }}
                                                >
                                                    {media?.meeting?.title}
                                                </div>
                                                <div className="lecture_duration-tracker flex alignCenter bold400 font12">
                                                    <span className="flex alignCenter justifyCenter">
                                                        <ClockSvg
                                                            style={{
                                                                paddingRight:
                                                                    "6px",
                                                            }}
                                                        />
                                                        <span className="lecture_duration-length marginR5">
                                                            {secondsToTime(
                                                                media?.end_time -
                                                                    media?.start_time
                                                            )}
                                                        </span>
                                                    </span>

                                                    <Button
                                                        type="primary"
                                                        className="borderRadius6 capitalize font10 padding10"
                                                        loading={
                                                            verifyingClip[
                                                                media?.id
                                                            ]
                                                        }
                                                        style={{
                                                            padding: "0px 12px",
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            dispatch(
                                                                deleteInternalCoachingClip(
                                                                    media.id
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>

                                                    <Button
                                                        type="primary"
                                                        className="borderRadius6 capitalize font10 padding10"
                                                        loading={
                                                            verifyingClip[
                                                                media?.id
                                                            ]
                                                        }
                                                        style={{
                                                            padding: "0px 12px",
                                                        }}
                                                        onClick={() =>
                                                            handleShowPendingModal(
                                                                media
                                                            )
                                                        }
                                                    >
                                                        {media?.status ===
                                                        "In_Review"
                                                            ? "Pending"
                                                            : "Verified"}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <PlaySvg
                                                    className="play-btn"
                                                    onClick={() => {
                                                        handleSetFullScreenVisible();
                                                        getClipHandler(
                                                            media?.id
                                                        );
                                                    }}
                                                    style={{
                                                        transform: "scale(1.5)",
                                                        backgroundColor: "#fff",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {next && (
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            dispatch(
                                                getNextInternalCoachingClips(
                                                    next
                                                )
                                            )
                                        }
                                        loading={nextLoading}
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="flex column alignCenter justifyCenter height100p">
                                <NoDataSvg />
                                <div>No Data</div>
                            </div>
                        )}
                    </Loader>
                </div>
            </div>

            {/*---------------------- Pending modal ------------------------------- */}
            {showPendingModal && (
                <PendingModal
                    showModal={showPendingModal}
                    handleShowModel={handleShowPendingModal}
                    activeClip={activeClip}
                />
            )}

            {/* -------------------- coaching modal cards ------------------- */}

            {fullscreenVisible && (
                <Modal
                    centered
                    visible={fullscreenVisible}
                    closable={false}
                    footer={null}
                    width="1094px"
                >
                    <div className="video-container1 full-screen">
                        <ShakaPlayer
                            videoRef={playerRef}
                            uri={activeClip?.media}
                            playOnLoad={false}
                            // startTime={
                            //   clip?.clip_data?.start_time
                            // }
                            // onProgress={clipStatusHandler}
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
        </div>
    );
}
