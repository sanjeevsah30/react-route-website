import {
    fetchAuditManagerCalibrationList,
    removeCalibrationMeetings,
} from "@apis/call_audit/index";
import { openNotification } from "@store/common/actions";
import { Button, Input, Modal, Select, Table, Tooltip } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CreateCalibrationModal from "./CreateCalibrationModal";
import moment from "moment-timezone";
import { getError } from "@apis/common/index";
import DeleteSvg from "app/static/svg/DeleteSvg";
const { Option } = Select;
const intialPayloadState = { remove_meetings: [], notes: "" };

export default function AuditManagerCalibration() {
    const domain = useSelector((state) => state.common.domain);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [calibrationCreated, setCalibrationCreated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCalibration, setActiveCalibration] = useState(null);
    const [payload, setPayload] = useState(intialPayloadState);
    const handleCancel = () => {
        setIsModalOpen(false);
        setPayload(intialPayloadState);
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Start Date",
            dataIndex: "start_time",
            render: (val) => moment(val).format("DD-MM-YYYY hh:mm"),
        },
        {
            title: "End Date",
            dataIndex: "end_time",
            render: (val) => moment(val).format("DD-MM-YYYY hh:mm"),
        },
        {
            title: "Template",
            dataIndex: "template",
        },
        {
            title: "Progress",
            dataIndex: "progress",
        },
        {
            title: "Meetings",
            dataIndex: "meetings",
            render: (val) => (
                <Tooltip placement="bottom" title={val.toString()}>
                    {val.length}
                </Tooltip>
            ),
        },
        {
            title: "",
            dataIndex: "",
            render: (val) => (
                <DeleteSvg
                    onClick={() => {
                        setIsModalOpen(true);
                        setActiveCalibration(val);
                    }}
                />
            ),
        },
    ];

    useEffect(() => {
        setLoading(true);
        setCalibrationCreated(false);
        fetchAuditManagerCalibrationList(domain)
            .then((data) => {
                setLoading(false);
                setData(data);
            })
            .catch((err) => {
                setLoading(false);
                openNotification("error", "error", getError(err).message);
            });
    }, [calibrationCreated]);
    return (
        <div style={{ padding: "1rem" }}>
            <CreateCalibrationModal
                setCalibrationCreated={setCalibrationCreated}
            />
            <Table dataSource={data} columns={columns} loading={loading} />
            <Modal
                title="Remove Calibration Meetings"
                visible={isModalOpen}
                onCancel={handleCancel}
                footer={
                    <div className="calibration-modal-footer">
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() => {
                                removeCalibrationMeetings(
                                    payload,
                                    activeCalibration?.id
                                )
                                    .then(() => {
                                        setLoading(false);
                                    })
                                    .catch((err) => {
                                        setLoading(false);
                                        openNotification(
                                            "error",
                                            "error",
                                            getError(err).message
                                        );
                                    });
                                setIsModalOpen(false);
                            }}
                            loading={loading}
                        >
                            Remove
                        </Button>
                    </div>
                }
            >
                <Select
                    optionFilterProp="children"
                    onChange={(values) => {
                        setPayload({ ...payload, remove_meetings: values });
                    }}
                    mode="multiple"
                    placeholder={"Select meeting ids"}
                    showSearch
                    className="meetingSelector width100p  marginB10"
                    value={payload?.remove_meetings}
                >
                    {Array.from(
                        new Set(
                            activeCalibration?.meetings.map((e) => {
                                return e;
                            })
                        )
                    )?.map((item) => (
                        <Option key={item} value={item}>
                            {item}
                        </Option>
                    ))}
                </Select>

                <Input
                    onChange={(e) => {
                        setPayload({ ...payload, notes: e.target.value });
                    }}
                    placeholder="Add reason to remove meetings"
                    value={payload?.notes}
                />
            </Modal>
        </div>
    );
}
