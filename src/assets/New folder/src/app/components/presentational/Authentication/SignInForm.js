/* eslint-disable no-template-curly-in-string */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import authFormConfig from "@constants/AuthForm";
import routes from "@constants/Routes";
import { Card, Form, Input, Button, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import CardTitle from "./CardTitle";
import { Spinner } from "@presentational/reusables/index";
import ProviderAuth from "./ProviderAuth";

export default function SignInForm(props) {
    const validateMessages = {
        required: "${label} is required!",
        types: {
            email: "${label} is not valid email!",
        },
        string: {
            min: "${label} must be at least ${min} characters",
        },
    };
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            email: props.invitedUserMailId,
        });
    }, [props.invitedUserMailId]);
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
                            title={"Sign In"}
                            orgName={props.orgName}
                            layout={{ left: 6, right: 18 }}
                        />
                    }
                    actions={[
                        <Link
                            to={routes.SIGNUP}
                            className="user-auth-bottom-nav-link"
                        >
                            <Button type="link">
                                {authFormConfig.SIGNIN_BOTTOM_CALLOUT}
                                {authFormConfig.SIGNIN_BOTTOM_LINK}
                            </Button>
                        </Link>,
                    ]}
                >
                    <Spinner loading={props.isLoading}>
                        <Form
                            form={form}
                            layout={"vertical"}
                            name="SignIn Form"
                            onFinish={props.handleSubmit}
                            validateMessages={validateMessages}
                        >
                            <Form.Item
                                name={"email"}
                                label="Email"
                                rules={[{ required: true, type: "email" }]}
                                hasFeedback
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder={"john@doe.com"}
                                    allowClear
                                />
                            </Form.Item>
                            <Form.Item
                                name={"password"}
                                label="Password"
                                rules={[{ type: "string", required: true }]}
                                hasFeedback
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder={
                                        authFormConfig.PASSWORD_PLACEHOLDER
                                    }
                                    allowClear
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    className="submitButton"
                                    shape="round"
                                    type="primary"
                                    htmlType="submit"
                                >
                                    SignIn
                                </Button>
                            </Form.Item>
                            <ProviderAuth callout="SIGN IN" />
                            <Link to={routes.FORGET_PASSWORD}>
                                <Button type="link">Forgot password?</Button>
                            </Link>
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
                        </Form>
                    </Spinner>
                </Card>
            </div>
        </>
    );
}
