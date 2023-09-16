import { Alert, Input, Modal } from "antd";
import React, { useState } from "react";

export default function CrmLSPopup({ visible, onClose, label, onSubmit }) {
    const [serverUrl, setServerUrl] = useState("");
    const [error, setError] = useState("");
    const [accessKey, setAccessKey] = useState("");
    const [accessSecret, setAccessSecret] = useState("");

    const validateUrl = (value) => {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
            value.trim()
        );
    };
    const handleSubmit = () => {
        if (!serverUrl || !accessKey || !accessSecret) {
            setError("All fields are mandatory.");
            return;
        }
        if (validateUrl(serverUrl) && accessKey && accessSecret) {
            onSubmit({
                server: serverUrl,
                access_key: accessKey,
                access_secret: accessSecret,
            });
            setServerUrl("");
            setAccessKey("");
            setAccessSecret("");
            setError("");
        } else {
            setError("Please enter a valid server url");
        }
    };
    return (
        <Modal
            title={label}
            visible={visible}
            onOk={handleSubmit}
            onCancel={() => {
                onClose();
                setError("");
            }}
        >
            <div className="marginB10">
                <Input
                    value={serverUrl}
                    onChange={(evt) => {
                        setError("");
                        setServerUrl(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"Server"}
                />
            </div>
            <div className="marginB10">
                <Input
                    value={accessKey}
                    onChange={(evt) => {
                        setError("");
                        setAccessKey(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"Access key"}
                />
            </div>
            <div className="marginB10">
                <Input
                    value={accessSecret}
                    onChange={(evt) => {
                        setError("");
                        setAccessSecret(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"Access Secret"}
                />
            </div>
            <p className="font16">
                <a
                    href="https://help.leadsquared.com/how-do-i-obtain-api-access-keys-in-leadsquared/"
                    target="__blank"
                    className="primaryText bold"
                >
                    Click here
                </a>
                &nbsp;to know how to generate keys.
            </p>
            {error && (
                <Alert
                    message={error}
                    type="error"
                    closable
                    onClose={() => {
                        setError("");
                    }}
                />
            )}
        </Modal>
    );
}
