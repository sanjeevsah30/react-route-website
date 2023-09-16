import { Modal, Input, Button, Alert } from "antd";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CopyOutlined } from "@ant-design/icons";

export default function ResourceUriPopup({ visible, onClose, uri }) {
    const [isCopied, setIsCopied] = useState(false);

    const onCopyText = () => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    };

    return (
        <Modal
            title={"Resource URI"}
            visible={visible}
            onOk={onClose}
            onCancel={onClose}
            footer={
                <Button type={"primary"} onClick={onClose}>
                    OK
                </Button>
            }
        >
            <div className="marginB10">
                <CopyToClipboard text={uri} onCopy={onCopyText}>
                    <div className="flex alignCenter">
                        <Input
                            value={uri}
                            className={`bold`}
                            readOnly
                            // suffix={<CopyOutlined />}
                        />
                        <span className="curPoint paddingL10">
                            <CopyOutlined />
                        </span>
                    </div>
                </CopyToClipboard>
            </div>
            {isCopied && (
                <Alert message="Uri copied to your clipboard" type="success" />
            )}
            {/* <p className="font14">
                <a
                    href="https://help.close.com/docs/api-keys"
                    target="__blank"
                    className="primaryText bold"
                >
                    Click here
                </a>
                &nbsp;to know how to generate API key.
            </p> */}
        </Modal>
    );
}
