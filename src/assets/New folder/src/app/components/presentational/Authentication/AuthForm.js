import React, { useState } from "react";
import { Helmet } from "react-helmet";
import authFormConfig from "@constants/AuthForm";
import { Card, Button, Form, Input, Alert } from "antd";
import CardTitle from "./CardTitle";
import { Spinner } from "@presentational/reusables/index";
import Icon, {
    MailOutlined,
    GlobalOutlined,
    GoogleOutlined,
} from "@ant-design/icons";
import { extractDomain, getDomain } from "@tools/helpers";
import { Provider, useSelector } from "react-redux";
import ProviderAuth from "./ProviderAuth";

const AuthForm = (props) => {
    const domainRegex = /^([a-z][^0-9]*)$/;
    const [form] = Form.useForm();
    const [domainText, setDomainText] = useState("");
    const { hasConflict } = useSelector((state) => state.auth);
    const validateMessages = {
        required: "Field is required!",
        types: {
            email: "${label} is not valid!",
        },
        string: {
            min: "${label} must be at least ${min} characters",
        },
    };
    const handleFormValuesChange = (changedValues) => {
        if (
            Array.isArray(changedValues) &&
            changedValues.length === 1 &&
            changedValues[0]?.name[0] === "email"
        ) {
            const extractedDomain = extractDomain(form.getFieldValue("email"));
            setDomainText(extractedDomain);
        }
    };
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{props.formCallout}</title>
            </Helmet>
            <div
                className={`row user-auth-card ${
                    props.isSignup ? "signupForm" : ""
                }`}
            >
                <Card
                    title={
                        <CardTitle
                            title={props.formCallout}
                            orgName={""}
                            layout={{ left: 16, right: 8 }}
                        />
                    }
                    actions={[
                        <Button type="link" onClick={props.handleAuthForm}>
                            {props.fromNavLabel}
                            {props.fromNavLink}
                        </Button>,
                    ]}
                >
                    <Spinner
                        loading={props.isLoading}
                        // tip={props.isSignup ? 'Creating your org...' : ''}
                    >
                        <Form
                            form={form}
                            layout={"vertical"}
                            name="domain-form"
                            onFinish={props.handleSubmit}
                            validateMessages={validateMessages}
                            onFieldsChange={handleFormValuesChange}
                        >
                            <Form.Item
                                name={"email"}
                                label="Email"
                                rules={[{ type: "email", required: true }]}
                                hasFeedback
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder={
                                        authFormConfig.EMAIL_PLACEHOLDER
                                    }
                                    allowClear
                                    autoComplete={"off"}
                                />
                            </Form.Item>
                            {props.isSignup && (
                                <>
                                    {!hasConflict ? (
                                        <div className="marginB16 flex alignCenter paddingL8">
                                            {domainText && !hasConflict && (
                                                <>
                                                    {/* <span className="font14 bolder marginR8">
                                                                                Your Org Url:
                                                                            </span> */}
                                                    <span
                                                        className={`user_auth_orgName ${
                                                            domainText
                                                                ? "actual"
                                                                : ""
                                                        }`}
                                                    >
                                                        <GlobalOutlined />{" "}
                                                        <span>
                                                            https://
                                                            {domainText ? (
                                                                <span className="domainText__actual">
                                                                    {domainText}
                                                                </span>
                                                            ) : (
                                                                <span className="domainText__placeholder">
                                                                    &nbsp;email&nbsp;
                                                                </span>
                                                            )}
                                                            .convin.ai
                                                        </span>
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <Form.Item
                                            name={"domain"}
                                            label={props.formLabel}
                                            initialValue={domainText}
                                            rules={[
                                                {
                                                    type: "string",
                                                    required: true,
                                                },
                                                () => ({
                                                    validator(_, value) {
                                                        return !value ||
                                                            domainRegex.test(
                                                                value
                                                            )
                                                            ? Promise.resolve()
                                                            : Promise.reject(
                                                                  authFormConfig.DOMAIN_INVALID_ERROR
                                                              );
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input
                                                className="domain__input"
                                                addonBefore="https://"
                                                addonAfter=".convin.ai"
                                            />
                                        </Form.Item>
                                    )}
                                </>
                            )}
                            <Form.Item>
                                <Button
                                    className="submitButton"
                                    shape="round"
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {props.formCta}
                                </Button>
                            </Form.Item>
                            {props.isSignup && (
                                <ProviderAuth callout="SIGN UP" />
                            )}
                            {props.formError.status && (
                                <div className="marginTB20">
                                    <Alert
                                        message={props.formError.message}
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
};
export default AuthForm;
