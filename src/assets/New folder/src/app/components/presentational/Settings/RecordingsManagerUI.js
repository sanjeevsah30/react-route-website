import React from "react";
import config from "@constants/Settings";
import { Label, Icon, Error } from "@reusables";
import RecordingAssistant from "@container/Settings/RecordingAssistant";
import { Spinner } from "@presentational/reusables/index";
import { Button } from "antd";
import routes from "../../../constants/Routes/index";
import { useHistory } from "react-router-dom";

const RecordingsManagerUI = (props) => {
    const history = useHistory();
    return (
        <div className={"user-manager recordingmanager"}>
            <div className={"card user-settings-container recording-container"}>
                <Spinner loading={props.loading}>
                    <div className={"recording-container-topsection"}>
                        <span
                            className={"recording-container-topsection-heading"}
                        >
                            {config.RECORDINGMANAGER.heading}
                        </span>
                    </div>
                    <div className={"recording-container-bottomsection"}>
                        {!props.showRecording ? (
                            <React.Fragment>
                                <div
                                    className={
                                        "recording-container-bottomsection-voiceprint"
                                    }
                                >
                                    {props.hasRecorded && (
                                        <React.Fragment>
                                            <div className={"voiceprinttext"}>
                                                {
                                                    config.RECORDINGMANAGER
                                                        .myVoicePrint
                                                }
                                            </div>
                                            <div className={"recordoptions"}>
                                                <div
                                                    className={
                                                        "deleterecording"
                                                    }
                                                >
                                                    <button
                                                        className={
                                                            "accessibility"
                                                        }
                                                        type={"button"}
                                                        onClick={
                                                            props.deleteRecording
                                                        }
                                                    >
                                                        <span
                                                            className={"danger"}
                                                        >
                                                            {
                                                                config
                                                                    .RECORDINGMANAGER
                                                                    .delete
                                                            }
                                                        </span>
                                                    </button>
                                                </div>
                                                <div
                                                    className={`recordingicon`}
                                                >
                                                    <Icon
                                                        className={
                                                            "fa-microphone"
                                                        }
                                                    />
                                                </div>
                                                <div className={"recordaudio"}>
                                                    <button
                                                        className={
                                                            "accessibility"
                                                        }
                                                        type={"button"}
                                                        onClick={
                                                            props.toggleRecorder
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                "startrecording"
                                                            }
                                                        >
                                                            {
                                                                config
                                                                    .RECORDINGMANAGER
                                                                    .recordAgain
                                                            }
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                            </React.Fragment>
                        ) : (
                            <div
                                className={"recording-container-bottomsection"}
                            >
                                <div
                                    className={
                                        "recording-container-bottomsection-voiceprint recordingsection"
                                    }
                                >
                                    <Label
                                        label={
                                            config.RECORDINGMANAGER.readPassage
                                        }
                                    />
                                    <div className={"passage"}>
                                        <p>
                                            The team at convin is really humbled
                                            to have you with us.
                                        </p>
                                        <p>
                                            Convin is a conversation
                                            intelligence platform that empowers
                                            sales teams to sell better on calls
                                            and close more deals.
                                        </p>
                                        <p>
                                            Convin helps you capture and manage
                                            valuable information that is
                                            communicated verbally in meetings on
                                            video conferences or calls.
                                        </p>
                                        <p>
                                            Since the transcription is 100%
                                            automated, Convin may not recognize
                                            every word perfectly, especially if
                                            the audio quality is poor. For best
                                            results, try to have good audio
                                            quality & keep speaking parties
                                            close to their microphones. Try to
                                            speak clearly & minimize background
                                            noise & speech overlap
                                        </p>
                                        <p>
                                            So give Convin a try and send us
                                            your feedback inside the app.
                                        </p>
                                    </div>
                                    <div className={"recordoptions"}>
                                        <div className={"saveRecording"}>
                                            {props.recordedBlob !== null && (
                                                <button
                                                    className={"accessibility"}
                                                    type={"button"}
                                                    onClick={
                                                        props.saveRecording
                                                    }
                                                >
                                                    <span className={"save"}>
                                                        {
                                                            config
                                                                .RECORDINGMANAGER
                                                                .save
                                                        }
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                        <div
                                            className={`recordingicon ${
                                                props.isRecording &&
                                                !props.isBlocked
                                                    ? "animated"
                                                    : ""
                                            }`}
                                            onClick={
                                                !props.isRecording
                                                    ? props.startRecording
                                                    : props.stopRecording
                                            }
                                        >
                                            <Icon className={"fa-microphone"} />
                                            <span
                                                className={
                                                    props.isRecording
                                                        ? "label recording"
                                                        : "label"
                                                }
                                            >
                                                {!props.isRecording
                                                    ? config.RECORDINGMANAGER
                                                          .start
                                                    : config.RECORDINGMANAGER
                                                          .stop}
                                            </span>
                                        </div>
                                        <div className={"recordaudio"}>
                                            {props.recordedBlob !== null &&
                                                !props.isRecording && (
                                                    <button
                                                        className={
                                                            "accessibility"
                                                        }
                                                        type={"button"}
                                                        onClick={
                                                            !props.isRecording
                                                                ? props.startRecording
                                                                : props.stopRecording
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                "startrecording"
                                                            }
                                                        >
                                                            {!props.isRecording
                                                                ? config
                                                                      .RECORDINGMANAGER
                                                                      .recordAgain
                                                                : config
                                                                      .RECORDINGMANAGER
                                                                      .stop}
                                                        </span>
                                                    </button>
                                                )}
                                            {props.isRecording && (
                                                <p className="startrecording loading">
                                                    {
                                                        config.RECORDINGMANAGER
                                                            .recording
                                                    }
                                                    <span>.</span>
                                                    <span>.</span>
                                                    <span>.</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {((props.isBlocked && props.isRecording) ||
                                    props.errorMessage) && (
                                    <div className={"blockederror"}>
                                        <Error
                                            errorMessage={props.errorMessage}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Spinner>
            </div>
            {!props.isOnSetup && <RecordingAssistant />}
        </div>
    );
};

export default RecordingsManagerUI;
