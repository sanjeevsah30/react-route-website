/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import authFormConfig from "@constants/AuthForm";
import routes from "@constants/Routes";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { Card, Button, Form, Input, Alert } from "antd";
import CardTitle from "./CardTitle";
import { Spinner } from "@presentational/reusables/index";
import { Select } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import "./form.scss";
import { tz } from "moment-timezone";
import { uid } from "@tools/helpers";
const { Option } = Select;

export default function SignUpForm(props) {
    const [hasProvider, setHasProvider] = useState(false);
    let location = useLocation();
    const [form] = Form.useForm();
    const validateMessages = {
        required: "${label} is required!",
        types: {
            email: "${label} is not validate email!",
        },
        string: {
            min: "${label} must be at least ${min} characters",
        },
    };
    useEffect(() => {
        form.setFieldsValue({
            email: props.invitedUserMailId,
        });
    }, [props.invitedUserMailId]);

    useEffect(() => {
        form.setFieldsValue({ time_zone: tz.guess() });
    }, []);

    const onTimeZoneChange = (value) => {
        form.setFieldsValue({ timeZone: value });
    };

    useEffect(() => {
        form.setFieldsValue({
            first_name: props.invitedUserName,
        });
    }, [props.invitedUserName]);
    useEffect(() => {
        const provider = new URLSearchParams(location.search).get("provider");
        if (provider) {
            setHasProvider(true);
        }
    }, [location]);

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{props.title}</title>
            </Helmet>
            <div className="row user-auth-card">
                <Card
                    title={
                        <CardTitle
                            title={"Sign Up"}
                            orgName={props.orgName}
                            layout={{ left: 6, right: 18 }}
                        />
                    }
                    actions={[
                        <Link
                            to={routes.SIGNIN}
                            className="user-auth-bottom-nav-link"
                        >
                            <Button type="link">
                                {authFormConfig.SIGNUP_BOTTOM_CALLOUT}
                                {authFormConfig.SIGNUP_BOTTOM_LINK}
                            </Button>
                        </Link>,
                    ]}
                >
                    <Spinner loading={props.isLoading}>
                        <Form
                            form={form}
                            layout={"vertical"}
                            name="SignUp_Form"
                            onFinish={props.handleSubmit}
                            validateMessages={validateMessages}
                        >
                            <Form.Item
                                name={"first_name"}
                                label="Full Name"
                                rules={[{ type: "string", required: true }]}
                                hasFeedback
                            >
                                <Input
                                    placeholder={
                                        authFormConfig.NAME_PLACEHOLDER
                                    }
                                    prefix={<UserOutlined />}
                                    allowClear
                                />
                            </Form.Item>
                            <Form.Item
                                name={"email"}
                                label="Email"
                                rules={[{ type: "email", required: true }]}
                                autoComplete={"off"}
                                hasFeedback
                            >
                                <Input
                                    placeholder={
                                        authFormConfig.EMAIL_PLACEHOLDER
                                    }
                                    prefix={<MailOutlined />}
                                    disabled={!!props.invitedUserMailId}
                                    allowClear
                                />
                            </Form.Item>
                            <Form.Item
                                name={"password"}
                                label="Password"
                                rules={[
                                    { type: "string", min: 8, required: true },
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    placeholder={
                                        authFormConfig.PASSWORD_PLACEHOLDER
                                    }
                                    prefix={<LockOutlined />}
                                    allowClear
                                />
                            </Form.Item>
                            <div className="posRel">
                                <div className="clock_icon_container">
                                    <ClockCircleOutlined />
                                </div>
                                <Form.Item
                                    name="time_zone"
                                    label="Time Zone"
                                    hasFeedback
                                    style={{
                                        position: "relative",
                                    }}
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select a timezone"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                        onChange={onTimeZoneChange}
                                    >
                                        {tz.names().map((name, idx) => (
                                            <Option
                                                value={name}
                                                key={uid() + idx}
                                            >
                                                {name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                            {/* <Form.Item
                                label="Time Zone"
                                rules={[{ type: 'string', required: true }]}
                                hasFeedback
                                style={{
                                    position: 'relative',
                                }}
                            >
                               
                                <Select
                                   
                                >
                                    {moment.tz.names().map((name, idx) => (
                                        <Option value={name} key={uid() + idx}>
                                            {name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item> */}
                            <Form.Item>
                                <Button
                                    className="submitButton"
                                    shape="round"
                                    type="primary"
                                    htmlType="submit"
                                >
                                    SignUp
                                </Button>
                                {props.apiError.status && (
                                    <div className="marginT12">
                                        <Alert
                                            message={props.apiError.message}
                                            type="error"
                                            showIcon
                                            closable
                                        />
                                    </div>
                                )}
                            </Form.Item>
                        </Form>
                    </Spinner>
                </Card>
            </div>
        </>
    );
}
