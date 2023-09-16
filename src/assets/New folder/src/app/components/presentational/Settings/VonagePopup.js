import { Alert, Input, Modal } from "antd";
import React, { useState } from "react";

export default function VonagePopup({ visible, onClose, label, onSubmit }) {
    const [error, setError] = useState("");
    const [accessKey, setAccessKey] = useState("");
    const [accessSecret, setAccessSecret] = useState("");

    const handleSubmit = () => {
        onSubmit({
            api_key: accessKey,
            api_secret: accessSecret,
        });
    };

    return (
        <Modal
            title={label}
            visible={visible}
            onOk={handleSubmit}
            onCancel={onClose}
        >
            <div className="marginB10">
                <Input
                    value={accessKey}
                    onChange={(evt) => {
                        setError("");
                        setAccessKey(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"API key"}
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
                    placeholder={"API Secret"}
                />
            </div>
            <p className="font16">
                <a
                    href="https://developer.vonage.com/concepts/guides/authentication#api-key-and-secret"
                    target="__blank"
                    className="primaryText bold"
                >
                    Click here
                </a>
                &nbsp;to know how to generate keys.
            </p>
            {error && <Alert message={error} type="error" closable />}
        </Modal>
    );
}
