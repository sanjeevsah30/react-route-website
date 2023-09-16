import React, { useRef, useEffect, useState } from "react";
import "./dragDrop.style.scss";
import { UploadTempSvg, CloseSvg } from "app/static/svg/indexSvg";

import { useSelector } from "react-redux";
import callsConfig from "app/constants/MyCalls";

function DragDrop({
    files,
    setFiles,
    // uploadProgress
}) {
    const refDiv = useRef(null);
    const { fileStatus } = useSelector((state) => state.librarySlice);

    const onUploadfile = (event) => {
        event.preventDefault();
        event.stopPropagation();
        // sendFile(event.target.files[0]);
        console.log(Object.keys(event.target.files).length);
        setFiles(event.target.files);
    };

    useEffect(() => {}, [fileStatus]);

    // const sendFile = (file) => {
    //     if (
    //         file.type.startsWith('audio') ||
    //         file.type.startsWith('video') ||
    //         file.name
    //             .split('.')
    //         [file.name.split('.').length - 1].toLowerCase() === 'amr' ||
    //         file.name
    //             .split('.')
    //         [file.name.split('.').length - 1].toLowerCase() === 'awb'
    //     ) {
    //         setuploadState({
    //             ...uploadState,
    //             file: file,
    //             type: file.type.startsWith('audio')
    //                 ? 'audio'
    //                 : file.name.includes('amr')
    //                     ? 'audio'
    //                     : file.name.includes('awb')
    //                         ? 'audio'
    //                         : 'video',
    //             dragOver: false,
    //             error: '',
    //         });
    //         props.getfile(file);
    //     } else {
    //         setuploadState({
    //             ...uploadState,
    //             file: '',
    //             type: '',
    //             dragOver: false,
    //             error: 'Unsupported Format.',
    //         });
    //     }
    // };

    const allowedFormats =
        ".mp3, .wav, .ogg, .wma, .mp4, .webm, .acc, .ac3, .aiff, .3gpp, .smf, .amr-wb, .x-amr-wb, .doc, .docx, .png, .jpg, .jpeg, .mpeg, .xls, .xlsx, .csv, .pdf";

    const onDropfile = (event) => {
        event.preventDefault();
        event.stopPropagation();
        // console.log(event.dataTransfer.files);
        if (
            allowedFormats
                .split(",")
                .map((format) => format.trim())
                .includes(`.${event.dataTransfer.files[0].name.split(".")[1]}`)
        )
            setFiles(event.dataTransfer.files);
    };
    const onfileOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setFiles(event.dataTransfer.files);
    };
    const onfileOut = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setFiles(event.dataTransfer.files);
    };

    // useEffect(() => {

    //     return () => {
    //         refDiv.current.removeEventListener("dragenter", (e) => {
    //             e.preventDefault()
    //             e.stopPropagation()
    //         })
    //         refDiv.current.removeEventListener("dragleave", (e) => {
    //             e.preventDefault()
    //             e.stopPropagation()
    //         })
    //         refDiv.current.removeEventListener("dragover", (e) => {
    //             e.preventDefault()
    //             e.stopPropagation()
    //         });
    //         refDiv.current.removeEventListener("drop", (e) => {
    //             e.preventDefault()
    //             e.stopPropagation()
    //             console.log("droped")
    //             console.log(e)

    //         });

    //     }
    // }, [])
    // console.log(files);
    return (
        <>
            <div
                className="browse_file_container flex alignCenter column paddingTB12"
                ref={refDiv}
                onDrop={onDropfile}
                onDragOver={onfileOver}
                onDragLeave={onfileOut}
            >
                {/* <DropnUpload
                        className={error.file ? 'error' : ''}
                        getfile={handlers.getFile}
                        dropzoneBtnLabel={
                            "Upload file"
                        }
                        uploadFileMsg={
                            callsConfig.UPLOAD_CALL.uploadFileMsg
                        }
                        acceptedFormats={
                            callsConfig.UPLOAD_CALL.acceptedFormats
                        }
                        allowedFormatsLabel={
                            callsConfig.UPLOAD_CALL.allowedFormatsLabel
                        }
                    uploadProgress={uploadProgress}
                    file={file}
                    /> */}

                <UploadTempSvg />
                <div
                    className="body_container bold600 font18"
                    style={{ textAlign: "center" }}
                >
                    <span className="title dove_gray_cl">
                        Drop Files here or
                    </span>
                    <span> </span>
                    <label
                        className="browse_btn primary_cl curPoint"
                        htmlFor="file"
                    >
                        browse
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        multiple={true}
                        onChange={onUploadfile}
                        onClick={(e) => {
                            e.target.value = "";
                        }} // this is to remove the privious selected files
                        accept={allowedFormats}
                    />
                    <div className="dusty_gray_cl bold400 font12">
                        Max. File Size : 200mb
                    </div>
                    <div className="dusty_gray_cl bold400 font12">{`(ALLOWED DOC FORMATS: DOCX, DOC, PNG, JPG, JPEG, MPEG, XLS, XLSX, CSV, PDF)`}</div>
                    <div className="dusty_gray_cl bold400 font12">{`(ALLOWED AUDIO FORMATS: MP3, WAV, OGG, WMA, MP4, WEBM, ACC, AC3, AIFF, 3GPP, SMF, AMR-WB, X-AMR-WB)`}</div>
                </div>
            </div>
            {!!Object.keys(files).length && (
                <div
                    className="file_container overflowYscroll marginT40 paddingR23 marginB40"
                    style={{ maxHeight: "240px" }}
                >
                    <div
                        className="line_container bold600 font16"
                        style={{
                            display: "grid",
                            gap: "1rem",
                            gridTemplateColumns: "repeat(2, 1fr)",
                        }}
                    >
                        {Object.keys(files).map((key) => (
                            <div
                                key={key}
                                className="flex paddingTB20 paddingLR12 justifySpaceBetween"
                                style={{
                                    background: "rgba(153, 153, 153, 0.1)",
                                    maxWidth: "430px",
                                    borderRadius: "6px",
                                }}
                            >
                                <div className="left flex alignCenter min_width_0_flex_child width70p">
                                    <span className="title elipse_text mine_shaft_cl">
                                        {files[key].name}
                                    </span>
                                    <span className="file_size dusty_gray_cl marginR36 marginL15">{`(${Number(
                                        (
                                            files[key].size /
                                            (1024 * 1024)
                                        ).toFixed(2)
                                    )}mb)`}</span>
                                    {!!fileStatus[files[key].name] &&
                                        !!fileStatus[files[key].name]
                                            .progress && (
                                            <span
                                                className="flex alignCenter"
                                                style={{
                                                    border: "1px solid #999999",
                                                    height: "20px",
                                                    minWidth: "120px",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: `${
                                                            fileStatus[
                                                                files[key].name
                                                            ].progress
                                                        }%`,
                                                        height: "14px",
                                                        margin: "2px",
                                                        backgroundColor:
                                                            "#1A62F2",
                                                    }}
                                                ></span>
                                            </span>
                                        )}
                                </div>
                                <div className="curPoint flex alignCenter marginL15">
                                    <CloseSvg
                                        style={{
                                            color: "#666",
                                            transform: "scale(0.75)",
                                            marginRight: "0.75rem",
                                        }}
                                        onClick={() => {
                                            const temp = { ...files };
                                            delete temp[key];
                                            setFiles({ ...temp });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default DragDrop;
