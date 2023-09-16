import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Input } from "antd";

import searchConfig from "@constants/Search";
import { Label, Error } from "@reusables";
import config from "@constants/Search";
import { useDispatch } from "react-redux";
import { createNewTracker } from "@store/search/actions";
import * as searchActions from "@store/search/actions";
import CloseSvg from "app/static/svg/CloseSvg";
import Icon from "@presentational/reusables/Icon";

const { Option } = Select;

function TrackerModal({ resetModal, data, visible, closeModal, ...props }) {
    const [name, setName] = useState("");
    const [updateInterval, setUpdateInterval] = useState(0);
    const [id, setId] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        if (data.id) {
            setName(data?.name);
            setUpdateInterval(data?.update_interval);
            setId(data?.id);
        }
    }, [data]);
    const handleSubmit = () => {
        if (id) {
            dispatch(
                searchActions.editTracker(
                    {
                        name,
                        update_interval: config.NOTIFICATION[+updateInterval],
                    },
                    id
                )
            );
        } else {
            if (!name) return;
            dispatch(
                createNewTracker({
                    name,
                    update_interval: config.NOTIFICATION[+updateInterval],
                    search_json: {
                        ...props.filtersData,
                        activeDateRange: [],
                    },
                })
            );
        }
        setName(data?.name);
        setUpdateInterval(data?.update_interval);
        setId(data?.id);

        closeModal();
    };
    return (
        <Modal
            visible={visible}
            title={
                id
                    ? searchConfig.EDIT_TRACKER_TITLE
                    : searchConfig.CREATE_TRACKER_TITLE
            }
            centered={true}
            className="homepage_modal"
            onOk={() => {}}
            onCancel={closeModal}
            width={605}
            footer={[
                <div></div>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {searchConfig.SEND_TITLE}
                </Button>,
            ]}
            closeIcon={<CloseSvg />}
        >
            <div className="marginB12 setting_name">{searchConfig.TRACKER}</div>

            <Input
                name="name"
                placeholder="Enter name"
                value={name}
                allowClear
                onChange={(e) => {
                    setName(e.target.value);
                }}
                className="borderRadius5"
            />

            <div className="flex alignCenter marginT19">
                <span className="setting_name marginR26">
                    {searchConfig.DROPDOWN_LABEL}
                </span>
                <Select
                    value={updateInterval}
                    placeholder="Select Notification Frequency"
                    onChange={(val) => {
                        setUpdateInterval(val);
                    }}
                    className="flex1 custom__select filter__select"
                    dropdownClassName={"account_select_dropdown"}
                    suffixIcon={
                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                    }
                >
                    <Option value={0}>Immediately</Option>
                    <Option value={1}>Daily</Option>
                    <Option value={2}> Weekly</Option>
                    <Option value={3}>Monthly</Option>
                </Select>
            </div>
        </Modal>
    );
}

export default TrackerModal;
