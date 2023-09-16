import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";

const DropnUpload = (props) => {
    const inputOpenFileRef = useRef(null);
    const [uploadState, setuploadState] = useState({
        file: "",
        dragOver: false,
        type: "",
        error: "",
    });

    useEffect(() => {
        setuploadState({
            ...uploadState,
            file: props.file,
            type: props.file ? uploadState.type : "",
        });
    }, [props.file]);

    const onfileOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setuploadState({
            ...uploadState,
            dragOver: true,
        });
    };

    const onfileOut = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setuploadState({
            ...uploadState,
            dragOver: false,
        });
    };

    const onDropfile = (event) => {
        event.preventDefault();
        event.stopPropagation();
        sendFile(event.dataTransfer.files[0]);
    };

    const onUploadfile = (event) => {
        event.preventDefault();
        event.stopPropagation();
        sendFile(event.target.files[0]);
    };

    const removeFile = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setuploadState({
            ...uploadState,
            file: "",
            error: "",
        });
        document.getElementById("uploadFile").value = "";
        props.getfile("");
    };

    const sendFile = (file) => {
        if (
            file.type.startsWith("audio") ||
            file.type.startsWith("video") ||
            file.name
                .split(".")
                [file.name.split(".").length - 1].toLowerCase() === "amr" ||
            file.name
                .split(".")
                [file.name.split(".").length - 1].toLowerCase() === "awb"
        ) {
            setuploadState({
                ...uploadState,
                file: file,
                type: file.type.startsWith("audio")
                    ? "audio"
                    : file.name.includes("amr")
                    ? "audio"
                    : file.name.includes("awb")
                    ? "audio"
                    : "video",
                dragOver: false,
                error: "",
            });
            props.getfile(file);
        } else {
            setuploadState({
                ...uploadState,
                file: "",
                type: "",
                dragOver: false,
                error: "Unsupported Format.",
            });
        }
    };

    const showOpenFileDlg = () => {
        inputOpenFileRef.current.click();
    };

    return (
        <>
            <input
                id="uploadFile"
                ref={inputOpenFileRef}
                type="file"
                multiple={false}
                accept={props.acceptedFormats}
                style={{ display: "none" }}
                onChange={onUploadfile}
            />
            <div
                onDrop={onDropfile}
                onDragOver={onfileOver}
                onDragLeave={onfileOut}
                className={
                    uploadState.dragOver
                        ? `uploadFile fileover ${props.className}`
                        : `uploadFile ${props.className}`
                }
            >
                {!uploadState.file && (
                    <div className={"uploadFile-dropzone"}>
                        <p className={"uploadFile-msg"}>
                            {props.uploadFileMsg}
                        </p>
                        <p className={"uploadFile-or"}>OR</p>
                        <Button
                            handleClick={showOpenFileDlg}
                            btnLabel={props.dropzoneBtnLabel}
                            btnClass={"uploadFile-browse"}
                            btnTitle={
                                props.dropzoneBtnTitle
                                    ? props.dropzoneBtnTitle
                                    : props.dropzoneBtnLabel
                            }
                        />
                        {uploadState.error && (
                            <span className="error">{uploadState.error}</span>
                        )}
                        <p className={"uploadFile-allowed-label"}>
                            {props.allowedFormatsLabel}
                        </p>
                    </div>
                )}
                {uploadState.file && (
                    <div className="uploadFile-preview">
                        <div className="uploadFile-preview-box">
                            {uploadState.type === "audio" ? (
                                <p>
                                    <i
                                        className="fa fa-file-audio-o"
                                        aria-hidden="true"
                                    ></i>
                                    <span>{uploadState.file.name}</span>
                                </p>
                            ) : (
                                <p>
                                    <i
                                        className="fa fa-file-video-o"
                                        aria-hidden="true"
                                    ></i>
                                    <span>{uploadState.file.name}</span>
                                </p>
                            )}
                            {props.uploadProgress.value !== 0 ? (
                                <>
                                    <p
                                        className={
                                            props.uploadProgress.isError
                                                ? "progressBar error"
                                                : "progressBar"
                                        }
                                        style={{
                                            width: `calc(${props.uploadProgress.value}% - 3rem)`,
                                        }}
                                    ></p>
                                    <span className={"progressBar-percentage"}>
                                        {props.uploadProgress.value}%
                                    </span>
                                </>
                            ) : (
                                ""
                            )}
                        </div>
                        <span className={"remove-file"} onClick={removeFile}>
                            <i
                                className="fa fa-times-circle"
                                aria-hidden="true"
                            ></i>
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};

export default DropnUpload;
