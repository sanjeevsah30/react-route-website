import { Input, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { Upload, Button } from "antd";

import { InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
    createLeadScore,
    deleteLeadScore,
    getAuditTemplateRequestForFilterSettings,
    getLeadScore,
    updateLeadScore,
} from "@store/call_audit/actions";
import { useHistory } from "react-router";
import Spinner from "@presentational/reusables/Spinner";

const { Dragger } = Upload;

const FileUploader = ({ onFileSelect }) => {
    const [fileList, setFileList] = useState([]);
    const handleFileInput = (file) => {
        // handle validations
        onFileSelect(file);
    };

    const props = {
        onRemove: (file) => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            setFileList([file]);
            handleFileInput(file);
            return false;
        },
        fileList,
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">
                Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">Upload a .pkl file</p>
        </Dragger>
    );
};

function FileUploadPage() {
    const [pyCode, setPyCode] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();
    const history = useHistory();

    const { leadScore } = useSelector((state) => state.callAudit);
    const { showLoader } = useSelector((state) => state.common);
    const submitForm = () => {
        const temp = history.location.pathname.split("/");
        const [template] = temp.reverse();
        const formData = new FormData();
        formData.append("py_code", pyCode);
        selectedFile && formData.append("ml_model", selectedFile);
        formData.append("template", template);
        leadScore?.template
            ? dispatch(updateLeadScore(formData, leadScore?.template))
            : dispatch(createLeadScore(formData));
    };

    useEffect(() => {
        const temp = history.location.pathname.split("/");
        const [template] = temp.reverse();
        dispatch(getLeadScore(template));
        dispatch(getAuditTemplateRequestForFilterSettings(template));
    }, []);

    useEffect(() => {
        if (leadScore?.template) return setPyCode(leadScore.py_code);
        pyCode && setPyCode("");
    }, [leadScore]);
    return (
        <Spinner loading={showLoader}>
            <div className="padding30">
                <div className="marginB10 bold font20">Python Code</div>
                <Input.TextArea
                    className="audit__input__bg font18"
                    placeholder="Enter Python Code"
                    rows={8}
                    onChange={(e) => setPyCode(e.target.value)}
                    value={pyCode}
                />
                {leadScore?.model_size && (
                    <div className="marginTB10 bold font20">
                        Model Size : {leadScore.model_size}
                    </div>
                )}

                <div className="marginTB10 bold font20">Choose a pkl file</div>
                <FileUploader onFileSelect={(file) => setSelectedFile(file)} />
                <div className="marginT20 flex justifyEnd">
                    <Button type="primary" onClick={submitForm}>
                        {leadScore?.template ? "Update" : "Create"}
                    </Button>
                    {leadScore?.template && (
                        <Popconfirm
                            title="Are you sure to delete this lead score?"
                            onConfirm={() => {
                                dispatch(deleteLeadScore(leadScore.template));
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    )}
                </div>
            </div>
        </Spinner>
    );
}

export default FileUploadPage;
