import { Popover } from "antd";
import React, { useEffect, useRef, useState } from "react";
import CameraSvg from "app/static/svg/CameraSvg";
import PlusSvg from "app/static/svg/PlusSvg";
import SendCommentSvg from "app/static/svg/SendCommentSvg";
import VideoFilledSvg from "app/static/svg/VideoFilledSvg";
import useRecorder from "hooks/useRecorder";
import AudioRecording from "../Compound Components/Comments/AudioRecording";
import VideoRecording from "../Compound Components/Comments/VideoRecording";
import { DeleteOutlined } from "@ant-design/icons";
import { openNotification } from "@store/common/actions";

export default function AuditMediaNote() {
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
    } = useRecorder({ video });
    const [commentOptionsOpen, setCommentOptionsOpen] = useState(false);
    useEffect(() => {
        if (audioURL) setRecording(audioURL);
    }, [audioURL]);

    useEffect(() => {
        if (recordingStatus === "error") {
            openNotification(
                "error",
                "Error Recording",
                `Ensure microphone ${
                    video && "and camera"
                } permissions are enabled`
            );
        }
        if (video && videoRef.current && recordingStatus === "recording") {
            videoRef.current.srcObject = stream;
        }
    }, [recordingStatus, stream]);

    return (
        <div>
            <div className="posRel">
                <div
                    className="posAbs paddingL16 paddingR16  paddingT10 curPoint comment_add"
                    style={{
                        top: "50%",
                        left: "8px",
                        transform: "translateY(-50%)",
                    }}
                    onClick={() => {}}
                >
                    {recordingStatus === "recording" ? (
                        <DeleteOutlined
                            style={{
                                color: "#666666",
                                scale: "1.35",
                                marginBottom: "0.625rem",
                            }}
                            onClick={() => {
                                deleteRecording();
                            }}
                        />
                    ) : (
                        <Popover
                            content={
                                <div
                                    className="comment_media_add_popover"
                                    onClick={() => setCommentOptionsOpen(false)}
                                >
                                    <button
                                        onClick={() => {
                                            setVideo(false);
                                            startRecording();
                                        }}
                                    >
                                        <CameraSvg />
                                        Record Audio
                                    </button>
                                    <button
                                        onClick={() => {
                                            setVideo(true);
                                            startRecording();
                                        }}
                                    >
                                        <VideoFilledSvg />
                                        Record Video
                                    </button>
                                </div>
                            }
                            trigger="click"
                            visible={commentOptionsOpen}
                            onVisibleChange={(visible) =>
                                setCommentOptionsOpen(visible)
                            }
                            overlayInnerStyle={{ borderRadius: "5px" }}
                        >
                            <PlusSvg
                                style={{
                                    scale: "1.25",
                                    color: "#1A62F2",
                                    marginBottom: "12px",
                                }}
                                onClick={() => setCommentOptionsOpen(true)}
                            />
                        </Popover>
                    )}
                </div>
                {/* <CommentInput
                    placeholder={
                        activeComment?.comment?.id
                            ? 'Write a reply...'
                            : undefined
                    }
                    comment={comment}
                    setComment={setComment}
                /> */}
                {recordingStatus === "recording" ? (
                    <div
                        className="posAbs marginT8 borderRadius10 curPoint recording_stop"
                        style={{
                            top: "50%",
                            right: "8px",
                            transform: "translateY(-50%)",
                        }}
                        onClick={() => {
                            stopRecording();
                        }}
                    >
                        <div className="recording_stop_icon"></div>
                    </div>
                ) : (
                    <div
                        className="posAbs marginT8 borderRadius10 curPoint comment_send"
                        style={{
                            top: "50%",
                            right: "8px",
                            transform: "translateY(-50%)",
                        }}
                        onClick={() => {}}
                    >
                        <SendCommentSvg
                            style={{
                                color: "#1a62f2",
                            }}
                        />
                    </div>
                )}
            </div>
            {recording &&
                (video ? (
                    <VideoRecording
                        src={URL.createObjectURL(recording)}
                        deleteRecording={() => {
                            setRecording();
                        }}
                    />
                ) : (
                    <AudioRecording
                        url={URL.createObjectURL(recording)}
                        deleteRecording={() => {
                            setRecording();
                        }}
                    />
                ))}
        </div>
    );
}
