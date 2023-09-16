import { Alert, Input, Modal } from "antd";
import React, { useState } from "react";

export default function CrmETPopup({ visible, onClose, label, onSubmit }) {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [accessKey, setAccessKey] = useState("");
    // const [accessSecret, setAccessSecret] = useState('');

    const handleSubmit = () => {
        if (!username || !accessKey) {
            setError("All fields are mandatory.");
            return;
        }
        if (username && accessKey) {
            onSubmit({
                user_name: username,
                api_key: accessKey,
            });
            setUsername("");
            setAccessKey("");
            setError("");
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
                    value={username}
                    onChange={(evt) => {
                        setError("");
                        setUsername(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"Username"}
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
                    placeholder={"API key"}
                />
            </div>
            <p className="font16">
                <a
                    href="https://support.exotel.com/support/solutions/articles/3000023019-how-to-find-my-api-key-api-token-account-sid-and-subdomain-"
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
