import { Button, Input, Modal } from "antd";
import React from "react";
import CloseSvg from "app/static/svg/CloseSvg";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ isVisible, onOk, onCancel, tabName, handleChange }) => {
    return (
        <>
            <Modal
                visible={isVisible}
                onCancel={onCancel}
                title="Add new dashboard"
                // case constants.CLOSE_CREATE_VIEW_MODAL:
                //     return { showCrateViewModal: false };
                centered={true}
                className="homepage_modal"
                onOk={() => {}}
                width={605}
                footer={[
                    <Button key="submit" type="primary" onClick={onOk}>
                        Add
                    </Button>,
                    <Button key="back" onClick={onCancel}>
                        Cancel
                    </Button>,
                ]}
                closeIcon={<CloseSvg />}
            >
                <div className="marginB12 setting_name">Tab Name</div>

                <Input
                    value={tabName}
                    onChange={(evt) => handleChange(evt.target.value)}
                    name="title"
                    className={"borderRadius5"}
                    placeholder={"Enter tab Name"}
                    autoFocus
                    onPressEnter={onOk}
                />
            </Modal>
        </>
    );
};
