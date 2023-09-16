import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RecordingsManagerUI from "@presentational/Settings/RecordingsManagerUI";
import MediaRec from "audio-recorder-polyfill";
import config from "@constants/Settings";
import { sendRecording } from "@apis/voice";
import { hasVoicePrint } from "@apis/voice/index";
import { openNotification } from "@store/common/actions";
import apiErrors from "@apis/common/errors";
import { checkAuth } from "@store/auth/actions";

const RecordingsManager = (props) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);
    const domain = useSelector((state) => state.common.domain);
    const [showRecording, setshowRecording] = useState(true);
    const [showOptions, setshowOptions] = useState(true);
    const [isRecording, setisRecording] = useState(false);
    const [isBlocked, setisBlocked] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");
    const [hasRecorded, sethasRecorded] = useState(false);
    const [recordedBlob, setrecordedBlob] = useState(null);
    const [mediaRecorder, setmediaRecorder] = useState(null); // The media recorder object.
    const [loading, setLoading] = useState(false);

    const handlers = {
        deleteRecording: () => {
            // Call the API to delete the recording.
            // And reset all the states.
            setshowOptions(false);
            sethasRecorded(false);
            setshowRecording(true);
            setrecordedBlob(null);
            setisRecording(false);
        },
        toggleRecorder: () => {
            if (!showRecording) {
                setshowRecording(true);
                // Setting the passage to read.
            } else {
                setshowRecording(false);
            }
        },
        startRecording: () => {
            if (!isRecording) {
                setisRecording(true);
                navigator.mediaDevices
                    .getUserMedia({ audio: true })
                    .then((stream) => {
                        const mediaRec = new window.MediaRecorder(stream);
                        mediaRec.addEventListener("dataavailable", (e) => {
                            setrecordedBlob(e.data);
                        });
                        // Start recording
                        mediaRec.start();
                        setmediaRecorder(mediaRec);
                    })
                    .catch((err) => {
                        if (
                            config.RECORDINGMANAGER.accessDeniedTypes.includes(
                                err.name
                            )
                        ) {
                            seterrorMessage(
                                config.RECORDINGMANAGER.accessDeniedError
                            );
                        } else {
                            seterrorMessage(
                                config.RECORDINGMANAGER.someOtherError
                            );
                        }
                        handlers.stopRecording();
                    });
            }
        },
        stopRecording: () => {
            setisRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                mediaRecorder.stream.getTracks().forEach((i) => i.stop());
                setmediaRecorder(null); // Reset the media Recorder state var to null.
            }
        },
        saveRecording: () => {
            // Save the recorded Audio
            setisRecording(false);
            if (recordedBlob !== null) {
                sethasRecorded(true);
                setshowRecording(false); // Hide the recording screen.
                const data = new FormData();
                data.append(
                    "recording",
                    recordedBlob,
                    user.first_name +
                        new Date().getTime() +
                        "." +
                        recordedBlob.type.split("/").pop()
                );
                setLoading(true);
                sendRecording(domain, data).then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    } else {
                        if (typeof props.onSaveRecording === "function") {
                            props.onSaveRecording();
                        }
                    }
                    setLoading(false);
                    dispatch(checkAuth());
                });
            }
            // If recordedBlob is null, then the user hasn't recorded anything in the session.
        },
    };
    useEffect(() => {
        // Polyfill for Safari and other non-audio supporting browsers.
        window.MediaRecorder = MediaRec;
        // First check if the user has registered their voice print.
        // Check if the user even has a browser that supports audio recording or not.
        if (
            !navigator ||
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {
            seterrorMessage(config.RECORDINGMANAGER.notSupportedError);
            return setisBlocked(true);
        }

        // If the user has navigator, then check if there is a microphone
        navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
            if (
                mediaDevices.filter(
                    (device) =>
                        device.kind === config.RECORDINGMANAGER.audioInputType
                ).length <= 0
            ) {
                seterrorMessage(config.RECORDINGMANAGER.notAvailableError);
                setisBlocked(true); // No microphone on device.
            }
        });
        setLoading(true);
        hasVoicePrint(domain).then((res) => {
            if (res.recording) {
                sethasRecorded(true);
                setshowRecording(false);
            }
            setLoading(false);
        });

        return () => {
            // Cleanup the state and audio whenever user exits.
            setisBlocked(false);
            setisRecording(false);
            setrecordedBlob(null);
            sethasRecorded(false);
        };
    }, []);

    return (
        <RecordingsManagerUI
            showOptions={showOptions}
            showRecording={showRecording}
            isRecording={isRecording}
            hasRecorded={hasRecorded}
            sethasRecorded={sethasRecorded}
            isBlocked={isBlocked}
            errorMessage={errorMessage}
            recordedBlob={recordedBlob}
            setrecordedBlob={setrecordedBlob}
            loading={loading}
            {...handlers}
            {...props}
        />
    );
};

export default RecordingsManager;
