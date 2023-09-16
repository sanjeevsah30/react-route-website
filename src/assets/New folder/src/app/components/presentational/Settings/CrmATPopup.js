import { Alert, Input, Modal, Select } from "antd";
import React, { useState } from "react";

export default function CrmATPopup({ visible, onClose, label, onSubmit }) {
    const [basePk, setBasePk] = useState(null);
    const [tablePk, setTablePk] = useState(null);
    const [error, setError] = useState("");
    const [accessKey, setAccessKey] = useState("");

    const handleSubmit = () => {
        if (!basePk || !tablePk || !accessKey) {
            setError("All fields are mandatory.");
            return;
        } else if (basePk && tablePk && accessKey) {
            onSubmit({
                base_pk: basePk.keywords,
                access_key: accessKey,
                table_pk: tablePk.keywords,
            });
            setBasePk({});
            setAccessKey("");
            setTablePk({});
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
            className={"airtable_model"}
        >
            <Select
                dropdownStyle={{ display: "none" }}
                name="keywords"
                mode="tags"
                className="custom_tag bold"
                value={basePk?.keywords}
                placeholder={"Base Names"}
                onChange={(keywords) => {
                    setError("");
                    setBasePk({ keywords });
                }}
                style={{
                    width: "100%",
                    marginBottom: "10px",
                }}
            />
            <Select
                dropdownStyle={{ display: "none" }}
                name="keywords"
                mode="tags"
                className="select_tag bold"
                value={tablePk?.keywords}
                placeholder={"Table Names"}
                onChange={(keywords) => {
                    setError("");
                    setTablePk({ keywords });
                }}
                style={{
                    width: "100%",
                    marginBottom: "10px",
                }}
            />
            <div>
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
            <p className="font14">
                <a
                    href="https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-"
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
                    onClose={() => {
                        setError("");
                    }}
                />
            )}
        </Modal>
    );
}
