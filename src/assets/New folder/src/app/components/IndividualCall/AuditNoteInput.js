import { Button, Modal, Popover } from "antd";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import SendCommentSvg from "app/static/svg/SendCommentSvg";
import useRecorder from "../../../hooks/useRecorder";
import { openNotification } from "../../../store/common/actions";
import { uid } from "../../../tools/helpers";
import CameraSvg from "../../static/svg/CameraSvg";
import CloseSvg from "../../static/svg/CloseSvg";
import PlusSvg from "../../static/svg/PlusSvg";
import VideoFilledSvg from "../../static/svg/VideoFilledSvg";
import AudioRecording from "../Compound Components/Comments/AudioRecording";
import VideoRecording from "../Compound Components/Comments/VideoRecording";
import "./auditNoteInput.scss";
import "../Resuable/commentInput.scss";

import DebounceTextArea from "./DebounceTextArea";

const AuditNoteInput = (props) => {
    const {
        toggleClose,
        addMedia,
        mediaData: { media, media_type } = {
            media: undefined,
            media_type: undefined,
        },
        deleteNotesMedia,
        hideClose,
        isQms = false,
        setFeedbackModal,
    } = props;
    const [mediaOptionsVisible, setMediaOptionsVisible] = useState(false);
    const [recording, setRecording] = useState();
    const [video, setVideo] = useState(false);
    const videoRef = useRef(null);
    const {
        audioURL,
        status: recordingStatus,
        startRecording,
        stopRecording,
        deleteRecording,
        stream,
    } = useRecorder({ video: video });

    useEffect(() => {
        if (recordingStatus === "error") {
            openNotification(
                "error",
                "Error Recording",
                "Ensure microphone permissions are enabled"
            );
        }
        if (video && recordingStatus === "recording") {
            videoRef.current.srcObject = stream;
        }
    }, [recordingStatus, stream]);

    useEffect(() => {
        if (audioURL) setRecording(audioURL);
    }, [audioURL]);

    const handleAddMedia = () => {
        const type = video ? "video" : "audio";
        let formData = new FormData();
        formData.append(
            "media",
            recording,
            type === "audio" ? `${uid()}.mp3` : `${uid()}.mp4`
        );
        formData.append("media_type", type);
        addMedia(type, formData);
        setRecording(undefined);
        setFeedbackModal(false);
    };

    return (
        <>
            <div className="audit_note_container">
                <div
                    className="flex alignCenter"
                    style={
                        recordingStatus === "recording"
                            ? {
                                  height: "60px",
                              }
                            : {}
                    }
                >
                    {recordingStatus === "recording" ? (
                        <div className="recording_status">
                            <span> Recording...</span>{" "}
                        </div>
                    ) : (
                        <DebounceTextArea {...props} />
                    )}

                    <div
                        className="audit_note_plus_button"
                        style={{
                            ...(hideClose || {
                                borderRight: "1px solid #99999933",
                            }),
                        }}
                    >
                        {recordingStatus === "recording" ? (
                            <div
                                className="recording_stop"
                                onClick={() => {
                                    stopRecording();
                                }}
                            >
                                <div className="recording_stop_icon"></div>
                            </div>
                        ) : recording ? (
                            <div className="curPoint" onClick={handleAddMedia}>
                                {isQms ? (
                                    <Button
                                        type="primary"
                                        style={{ borderRadius: "5px" }}
                                        className="paddingLR16 marginR12"
                                        // loading={
                                        //     props?.condition ? true : false
                                        // }
                                    >
                                        ADD
                                    </Button>
                                ) : (
                                    <SendCommentSvg />
                                )}
                            </div>
                        ) : (
                            <Popover
                                placement="bottomRight"
                                content={
                                    <div
                                        className="audit_notes_media_add_popover"
                                        onClick={() =>
                                            setMediaOptionsVisible(false)
                                        }
                                    >
                                        <button
                                            onClick={() => {
                                                setVideo(false);
                                                startRecording();
                                            }}
                                        >
                                            <CameraSvg />
                                            <span>Record Audio</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setVideo(true);
                                                startRecording();
                                            }}
                                        >
                                            <VideoFilledSvg />
                                            <span>Record Video</span>
                                        </button>
                                    </div>
                                }
                                trigger="click"
                                overlayInnerStyle={{ borderRadius: "5px" }}
                                visible={mediaOptionsVisible}
                                onVisibleChange={(visible) =>
                                    setMediaOptionsVisible(visible)
                                }
                            >
                                <PlusSvg
                                    onClick={() => setMediaOptionsVisible(true)}
                                />
                            </Popover>
                        )}
                    </div>
                    {hideClose ? (
                        <></>
                    ) : (
                        <div
                            className="audit_note_close_button curPoint"
                            onClick={() => {
                                if (recordingStatus === "recording") {
                                    deleteRecording();
                                }
                                toggleClose();
                            }}
                        >
                            <CloseSvg />
                        </div>
                    )}
                </div>
            </div>
            <MediaLayout
                {...{
                    video,
                    recordingStatus,
                    videoRef,
                    recording,
                    setRecording,
                    media,
                    media_type,
                    deleteNotesMedia,
                    isQms,
                }}
            />
            {/* <Modal
                open={video}
                onCancel={() => {
                    setVideo(false);
                }}
                footer={<></>}
            >
                <MediaLayout
                    {...{
                        video,
                        recordingStatus,
                        videoRef,
                        recording,
                        setRecording,
                        media,
                        media_type,
                        deleteNotesMedia,
                    }}
                />
            </Modal> */}
        </>
    );
};

export default React.memo(AuditNoteInput, (prev, next) => false);

const MediaLayout = React.memo(
    ({
        video,
        recordingStatus,
        videoRef,
        recording,
        setRecording,
        media,
        media_type,
        deleteNotesMedia,
        isQms,
    }) => {
        return (
            <>
                {video && recordingStatus === "recording" && (
                    <video
                        ref={videoRef}
                        width={isQms ? "100%" : "240px"}
                        style={{ borderRadius: "6px" }}
                        onCanPlay={() => videoRef.current.play()}
                        muted
                    ></video>
                )}

                {recording ? (
                    video === true ? (
                        <VideoRecording
                            src={URL.createObjectURL(recording)}
                            deleteRecording={() => setRecording()}
                        />
                    ) : (
                        <AudioRecording
                            url={URL.createObjectURL(recording)}
                            deleteRecording={() => setRecording()}
                        />
                    )
                ) : (
                    <></>
                )}

                {recordingStatus !== "recording" && !recording && media ? (
                    <div>
                        {media_type === "mp4" ? (
                            <VideoRecording
                                src={media}
                                deleteRecording={deleteNotesMedia}
                                // showDelete={is_Auditor(role?.code_names)}
                            />
                        ) : (
                            <AudioRecording
                                url={media}
                                deleteRecording={deleteNotesMedia}
                                // showDelete={is_Auditor(role?.code_names)}
                            />
                        )}
                    </div>
                ) : (
                    <></>
                )}
            </>
        );
    },
    (prev, next) => {
        return (
            prev.media_type === next.media_type &&
            prev.recording === next.recording &&
            prev.video === next.video &&
            prev.recordingStatus === next.recordingStatus &&
            prev.media === next.media
        );
    }
);
