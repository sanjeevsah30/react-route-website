import { Alert, Input, Modal } from "antd";
import React, { useState } from "react";

export default function CrmClosePopup({ visible, onClose, label, onSubmit }) {
    const [error, setError] = useState("");
    const [accessKey, setAccessKey] = useState("");

    const handleSubmit = () => {
        setError("");
        if (!accessKey) {
            setError("All fields are mandatory.");
            return;
        }
        onSubmit({
            access_key: accessKey,
        });
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
                    href="https://help.close.com/docs/api-keys"
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
