import { Alert, Input, Modal } from "antd";
import React, { useState } from "react";

export default function CrmPDPopup({ visible, onClose, label, onSubmit }) {
    const [domain, setDomain] = useState("");
    const [error, setError] = useState("");
    const [accessKey, setAccessKey] = useState("");

    const handleSubmit = () => {
        setError("");
        if (!domain || !accessKey) {
            setError("All fields are mandatory.");
            return;
        }
        onSubmit({
            server: domain,
            access_key: accessKey,
        });
        setDomain("");
        setAccessKey("");
        setError("");
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
                    value={domain}
                    onChange={(evt) => {
                        setError("");
                        setDomain(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"domain"}
                    addonBefore="https://"
                    suffix=".pipedrive.com"
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
                    placeholder={"API Key"}
                />
            </div>
            <p className="font14">
                <a
                    href="https://support.pipedrive.com/en/article/how-can-i-find-my-personal-api-key/"
                    target="__blank"
                    className="primaryText bold"
                >
                    Click here
                </a>
                &nbsp;to know how to generate API key.
            </p>
            {error && (
                <Alert
                    message={error}
                    type="error"
                    closable
                    onClose={() => setError("")}
                />
            )}
        </Modal>
    );
}
