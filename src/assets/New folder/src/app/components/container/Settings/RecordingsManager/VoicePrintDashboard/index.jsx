import { Button } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getVoicePrintCsv } from "../../../../../../store/settings/actions";
import UploadVoicePrintForm from "./UploadVoicePrintForm";

const VoicePrintDashboard = () => {
    const dispatch = useDispatch();
    const [downloading, isDownloading] = useState(false);
    const handleDownloadCsv = () => {
        isDownloading(true);
        dispatch(getVoicePrintCsv()).then(({ data, headers }) => {
            const fileName = headers["content-disposition"]
                .split("filename=")[1]
                .split('"')[1];
            const href = URL.createObjectURL(data);
            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
            isDownloading(false);
        });
    };
    return (
        <>
            <h2 style={{ marginTop: "2.5rem" }}>Voice Print Dashboard</h2>
            <div
                style={{
                    display: "flex",
                    marginTop: "2.5rem",
                }}
            >
                <div
                    className="card"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "30%",
                        height: "100%",
                        marginRight: "2.5rem",
                    }}
                >
                    <h2>Download Voice Prints</h2>
                    <div>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleDownloadCsv}
                            disabled={downloading}
                        >
                            Download
                        </Button>
                    </div>
                </div>
                <div
                    className="card"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "30%",
                    }}
                >
                    <h2>Upload Voice Prints</h2>
                    <div>
                        <UploadVoicePrintForm />
                    </div>
                </div>
            </div>
        </>
    );
};

export default VoicePrintDashboard;
