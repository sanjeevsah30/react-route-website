import { Button, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    getVoicePrintUploadStatus,
    uploadVoicePrintCsv,
} from "../../../../../../store/settings/actions";

const UploadVoicePrintForm = () => {
    const dispatch = useDispatch();
    const [fileList, setFileList] = useState([]);
    const [uploadStatus, setUploadStatus] = useState("");
    const [uploadThread, setUploadThread] = useState("");
    const handleUploadCsv = () => {
        setUploadStatus("running");
        const body = {};
        const formData = new FormData();
        formData.append("file", fileList[0]);
        formData.append("body", JSON.stringify(body));
        dispatch(uploadVoicePrintCsv(formData))
            .then((res) => {
                setUploadThread(res.thread_id);
                setFileList([]);
            })
            .catch((err) => message.error(err));
    };
    const checkUploadStatus = () => {
        if (uploadThread) {
            dispatch(getVoicePrintUploadStatus(uploadThread))
                .then((res) => {
                    setUploadStatus(res.status);
                    if (res.status === "completed") {
                        message.success("Upload completed");
                    } else {
                        message.info("Uploading");
                    }
                })
                .catch((err) => message.error(err));
        } else {
            message.error("No running uploads found");
        }
    };
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    marginBottom: "1rem",
                }}
            >
                <Upload.Dragger
                    accept=".csv"
                    fileList={fileList}
                    beforeUpload={(file) => {
                        setFileList([file]);
                        return false;
                    }}
                    onRemove={() => setFileList([])}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Upload CSV File of Voice Prints here
                    </p>
                </Upload.Dragger>
                <Button
                    size="large"
                    type="primary"
                    disabled={fileList.length !== 1}
                    style={{
                        width: "160px",
                        marginTop: "1rem",
                        alignSelf: "center",
                    }}
                    onClick={handleUploadCsv}
                >
                    Upload
                </Button>
            </div>
            <Button
                disabled={uploadStatus !== "running"}
                onClick={checkUploadStatus}
            >
                Check Upload Status
            </Button>
        </>
    );
};

export default UploadVoicePrintForm;
