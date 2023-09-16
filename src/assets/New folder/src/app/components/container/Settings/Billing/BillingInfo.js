import billingConfig from "@constants/Billing/index";
import { Spinner } from "@presentational/reusables/index";
import {
    getBillingInfo,
    updateBillingInfo,
    setNextClicked,
    createBillingInfo,
} from "@store/billing/billing";
import { Form, Modal, Select, Input, Button } from "antd";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

export default function BillingInfo({ setActiveTab, tabs, isModal }) {
    const { billing_info } = useSelector((state) => state.billing);

    const { users } = useSelector((state) => state.common);
    const dispatch = useDispatch();
    const validateMessages = {
        required: "${label} is required!",
        types: {
            email: "${label} is not a valid email!",
            number: "${label} is not a valid number!",
        },
        number: {
            range: "${label} must be between ${min} and ${max}",
        },
    };
    const [form] = Form.useForm();
    const [showGstBlock, setShowGstBlock] = useState(false);

    const onFinish = (values) => {
        Object.keys(billing_info?.data)?.length
            ? dispatch(updateBillingInfo(values))
            : dispatch(createBillingInfo(values));

        isModal && dispatch(setNextClicked(true));
    };

    const handleCurrencyValidation = (val) => {
        if (val === "inr") {
            return setShowGstBlock(true);
        }
        return setShowGstBlock(false);
    };

    useEffect(() => {
        dispatch(getBillingInfo());
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            ...billing_info?.data,
            customer:
                billing_info?.data?.customer === null
                    ? ""
                    : billing_info?.data?.customer,
        });

        if (billing_info?.data?.currency === "inr") {
            setShowGstBlock(true);
        } else {
            setShowGstBlock(false);
        }
        if (isModal && billing_info?.next_clicked) {
            setActiveTab(tabs.MAKE_PAYMENT);
            dispatch(setNextClicked(false));
        }
    }, [billing_info?.data]);

    const [customer, setCustomer] = useState("");

    return (
        <div className="billing_info">
            <Spinner loading={billing_info.loading}>
                <Form
                    layout="vertical"
                    name="nest-messages"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    form={form}
                >
                    <Form.Item
                        name={"company_name"}
                        label="Company Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={"customer"}
                        label="Customer Email"
                        rules={[{ required: true }]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={"address"}
                        label="Address"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <FlexParent isModal={isModal}>
                        <Form.Item
                            name={"city"}
                            label="City"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={"state"}
                            label="State"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name={"country"}
                            label="Country"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={"zip_code"}
                            label="Zip/Postal"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </FlexParent>

                    <Form.Item
                        name={"currency"}
                        label="Currency"
                        rules={[{ required: true }]}
                        hasFeedback
                    >
                        <Select
                            placeholder="Select Currency"
                            dropdownClassName="user_manager_drop"
                            onChange={handleCurrencyValidation}
                        >
                            <Option value={"usd"}>
                                US Dollar {billingConfig.USD}
                            </Option>
                            <Option value={"inr"}>
                                Indian Rupee {billingConfig.INR}
                            </Option>
                        </Select>
                    </Form.Item>
                    {showGstBlock && (
                        <>
                            <Form.Item label="GST Number">
                                <div className="marginB8">
                                    If you are a GST registerd buisness, enter
                                    GST number
                                </div>
                                <Form.Item name="gst_number">
                                    <Input />
                                </Form.Item>
                            </Form.Item>
                        </>
                    )}

                    <Form.Item className="next_container">
                        <Button type="primary" htmlType="submit">
                            {isModal ? "Next" : "Save"}
                        </Button>
                    </Form.Item>
                </Form>
            </Spinner>
        </div>
    );
}

BillingInfo.defaultProps = {
    isModal: true,
};

const FlexParent = ({ isModal, children }) =>
    isModal ? <div className="flex">{children}</div> : <> {children} </>;
