import { uid } from "@tools/helpers";
import { Button, Modal, Select } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function ShareTabModal({ isVisible, onCancel, onOk }) {
    const users = useSelector((state) => state.common.users);

    const [selectedOptions, setSelectedOptions] = useState([]);
    // const [filteredOptions, setFilteredOptions] = useState(users);

    const handleChange = (selectedItems) => {
        setSelectedOptions(selectedItems);
        // setFilteredOptions(users.filter((o) => !selectedItems.includes(o.id)));
    };

    return (
        <Modal
            className={"shareTabModal"}
            width={600}
            title="Share dashboard"
            visible={isVisible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel} shape={"round"}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={() => {
                        onOk(selectedOptions);
                    }}
                    shape={"round"}
                >
                    Add
                </Button>,
            ]}
        >
            <div className="flex column">
                <Select
                    mode="multiple"
                    placeholder="Select users to share the tab"
                    value={selectedOptions}
                    onChange={handleChange}
                    className="addTabModal__input"
                >
                    {users.map((item) => (
                        <Select.Option key={uid() + item.id} value={item.id}>
                            {item.first_name}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </Modal>
    );
}
