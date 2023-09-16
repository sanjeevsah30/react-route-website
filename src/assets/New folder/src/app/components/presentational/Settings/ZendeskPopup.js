import { Alert, Input, Modal } from "antd";
import React, { useState } from "react";

export default function ZendeskPopup({ visible, onClose, label, onSubmit }) {
    const [error, setError] = useState("");
    const [subDomain, setsubDomain] = useState("");

    const handleSubmit = () => {
        setError("");
        if (!subDomain) {
            setError("All fields are mandatory.");
            return;
        }
        onSubmit({
            sub_domain: `zendesk_subdomain=${subDomain}`,
            // sub_domain: subDomain,
        });
        setsubDomain("");
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
                    value={subDomain}
                    onChange={(evt) => {
                        setError("");
                        setsubDomain(evt.target.value);
                    }}
                    className={`bold`}
                    placeholder={"Sub domain"}
                />
            </div>
            <p className="font14">
                <a
                    href="https://support.zendesk.com/hc/en-us/articles/4409381383578-Where-can-I-find-my-Zendesk-subdomain-#:~:text=Request%20an%20email&text=Type%20your%20email%20address%20and,with%20the%20email%20address%20chosen."
                    target="__blank"
                    className="primaryText bold"
                >
                    Click here
                </a>
                &nbsp;to know how to get Sub Domain.
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
