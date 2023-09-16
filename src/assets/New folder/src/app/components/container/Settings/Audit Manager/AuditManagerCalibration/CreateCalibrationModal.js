import React, { useState, useEffect } from "react";
import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";
import { getAuditTemplatesRequest } from "@store/call_audit/actions";
import { openNotification } from "@store/common/actions";
import { uid } from "@tools/helpers";
import { Button, DatePicker, Form, Input, Select, Switch, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CustomMultipleSelect } from "app/components/Resuable/index";
import { toEpoch } from "tools/helpers";
const { Option } = Select;

export default function CreateCalibrationModal({ setCalibrationCreated }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    useEffect(() => {
        dispatch(getAuditTemplatesRequest());
    }, []);

    const {
        common: { users },
        callAudit: { templates },
    } = useSelector((state) => state);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = ({
        set_name,
        start_date,
        end_date,
        auditor_list,
        template,
        is_manual,
        limit,
        offset,
    }) => {
        const endPoint = `/audit/calibration/create/?is_manual=${is_manual}`;
        const payload = {
            set_name: set_name,
            template_id: template,
            auditor_list: auditor_list,
            start_date: start_date && toEpoch(start_date),
            end_date: end_date && toEpoch(end_date),
            limit: +limit,
            offset: +offset,
        };
        axiosInstance
            .post(endPoint, payload)
            .then((res) => {
                if (res.status === 201) {
                    setCalibrationCreated(true);
                    openNotification("success", "success", res.data.message);
                    handleCancel();
                }
            })
            .catch((err) => {
                openNotification("error", "error", getError(err).message);
            });
    };

    return (
        <>
            <Button
                type="primary"
                onClick={showModal}
                style={{ margin: "1rem", float: "right" }}
            >
                Create Calibration
            </Button>
            <Modal
                title="Create Calibration"
                visible={isModalOpen}
                onCancel={handleCancel}
                footer={
                    <div className="calibration-modal-footer">
                        <Button key="reset" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            key="submit"
                            type="primary"
                            form="form"
                            htmlType="submit"
                        >
                            Submit
                        </Button>
                    </div>
                }
            >
                <Form
                    id="form"
                    form={form}
                    layout={"vertical"}
                    name="calibration"
                    onFinish={onFinish}
                    style={{
                        padding: "1rem",
                        height: "30rem",
                        overflow: "scroll",
                    }}
                >
                    <Form.Item
                        name="set_name"
                        label="Set Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="auditor_list" label="Auditor List">
                        <CustomMultipleSelect
                            data={users}
                            select_placeholder={"Select Users"}
                            style={{
                                width: "100%",
                                height: "auto",
                                padding: "0",
                            }}
                            className=" multiple__select"
                            type={"user"}
                            filter_type="email_filter"
                        />
                    </Form.Item>
                    <Form.Item
                        name="template"
                        label="Template"
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ backgorund: "blue" }}
                        >
                            {templates.map((template, idx) => (
                                <Option value={template.id} key={uid() + idx}>
                                    {template.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="start_date" label="Start Date">
                        <DatePicker placeholder="" />
                    </Form.Item>
                    <Form.Item name="end_date" label="End Date">
                        <DatePicker placeholder="" />
                    </Form.Item>
                    <Form.Item name="limit" label="Limit">
                        <Input type="number" min="0" placeholder="" />
                    </Form.Item>
                    <Form.Item name="offset" label="Offset">
                        <Input type="number" min="0" placeholder="" />
                    </Form.Item>
                    <Form.Item
                        name="is_manual"
                        label="Is Manual"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
