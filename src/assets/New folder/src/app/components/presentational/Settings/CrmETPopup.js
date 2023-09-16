import { Alert, Input, Modal } from "antd";
import React, { useState } from "react";

export default function CrmOZPopup({ visible, onClose, label, onSubmit }) {
    const [accountSid, setAccountSid] = useState("");
    const [error, setError] = useState("");
    const [accessKey, setAccessKey] = useState("");
    const [apiToken, setAPIToken] = useState("");
    const [server, setServer] = useState("");

    const validateUrl = (value) => {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
            value.trim()
        );
    };

    const handleSubmit = () => {
        if (!accountSid || !accessKey || !apiToken) {
            setError("All fields are mandatory.");
            return;
        }

        if (server !== "" && !validateUrl(server)) {
            setError("Please enter a valid server url");
            return;
        }
        if (accountSid && accessKey && apiToken) {
            onSubmit({
                server: server || undefined,
                account_sid: accountSid,
                api_key: accessKey,
                api_token: apiToken,
            });
            setAccountSid("");
            setAccessKey("");
            setAPIToken("");
            setServer("");
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
                    value={server}
                    onChange={(evt) => {
                        setError("");
                        setServer(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"Server"}
                />
            </div>
            <div className="marginB10">
                <Input
                    value={accountSid}
                    onChange={(evt) => {
                        setError("");
                        setAccountSid(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"Account SID"}
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
            <div className="marginB10">
                <Input
                    value={apiToken}
                    onChange={(evt) => {
                        setError("");
                        setAPIToken(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"API Token"}
                />
            </div>
            <p className="font16">
                <a
                    href="https://help.leadsquared.com/ozonetel-v2-connector/"
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
