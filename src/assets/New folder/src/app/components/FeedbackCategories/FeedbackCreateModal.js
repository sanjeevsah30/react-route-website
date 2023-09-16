import { Form, Modal, Input } from "antd";
import React from "react";

export default function FeedbackCreateModal({
    visible,
    onCreate,
    onCancel,
    form,
    initialValues,
    okBtnLabel,
}) {
    return (
        <Modal
            className="create__scorecard--modal"
            visible={visible}
            title="Create a new scorecard"
            okText={okBtnLabel || "Create"}
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={initialValues}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    className="margin0"
                    rules={[
                        {
                            required: true,
                            message: "Please input the title of scorecard!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please input the description of scorecard!",
                        },
                    ]}
                >
                    <Input type="textarea" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
