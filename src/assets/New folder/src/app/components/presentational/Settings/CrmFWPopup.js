import { Alert, Input, Modal, Select } from "antd";
import React, { useState } from "react";

const { Option } = Select;
const DOMAINS = [
    ".myfreshworks.com",
    ".freshworks.com",
    "freshsales.io",
    "freshdesk.com",
];
export default function CrmFWPopup({ visible, onClose, label, onSubmit }) {
    const [error, setError] = useState("");
    const [accessKey, setAccessKey] = useState("");
    const [server, setServer] = useState("");
    const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]);

    const handleSubmit = () => {
        setError("");
        if (!accessKey) {
            setError("All fields are mandatory.");
            return;
        }
        onSubmit({
            server: `${server}${selectedDomain}`,
            access_key: accessKey,
        });
        setAccessKey("");
        setError("");
    };
    const selectAfter = (
        <Select
            defaultValue={DOMAINS[0]}
            className="select-after"
            onChange={(val) => setSelectedDomain(val)}
        >
            {DOMAINS.map((domain) => (
                <Option value={domain} key={domain}>
                    {domain}
                </Option>
            ))}
        </Select>
    );
    return (
        <Modal
            title={label}
            visible={visible}
            onOk={handleSubmit}
            onCancel={onClose}
        >
            <div className="marginB10">
                <Input
                    value={server}
                    onChange={(evt) => {
                        setError("");
                        setServer(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"domain"}
                    addonBefore="https://"
                    addonAfter={selectAfter}
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
                    href="https://crmsupport.freshworks.com/support/solutions/articles/50000002503-how-to-find-my-api-key-"
                    target="__blank"
                    className="primaryText bold"
                >
                    Click here
                </a>
                &nbsp;to know how to generate API key.
            </p>
            {error && <Alert message={error} type="error" closable />}
        </Modal>
    );
}
