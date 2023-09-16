import React, { useState } from "react";
import {
    Card,
    Avatar,
    Button,
    Form,
    Input,
    Result,
    Alert,
    Row,
    Col,
    Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import authFormConfig from "@constants/AuthForm/index";
import { LockOutlined } from "@ant-design/icons";
import { Spinner } from "@presentational/reusables/index";
import { changePasswordAjx } from "@apis/authentication/index";
import apiErrors from "@apis/common/errors";
import { checkAuth } from "@store/auth/actions";
import { openNotification } from "@store/common/actions";
import { withRouter } from "react-router";
import CardTitle from "app/components/presentational/Authentication/CardTitle";
import { getDomain } from "tools/helpers";
const ChangePassword = () => {
    const dispatch = useDispatch();
    const domain = useSelector((state) => state.common.domain);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const validateMessages = {
        required: "${label} is required!",
        string: {
            min: "${label} must be at least ${min} characters",
        },
    };
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const changePassword = (values) => {
        setIsLoading(true);
        setError("");
        const data = new FormData();
        data.append("new_password", values.password);
        changePasswordAjx(domain, data).then((res) => {
            setIsLoading(false);
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                setError(res.message);
                return;
            }
            setIsPasswordChanged(true);
            window.localStorage.clear("authTokens");
            dispatch(checkAuth());
            openNotification(
                "success",
                "Success",
                "Password changed successfully. Login again with the new Password"
            );
        });
    };
    return (
        <>
            {!isPasswordChanged ? (
                <Spinner loading={isLoading}>
                    <div className="row user-auth-card password_reset_card">
                        <Card
                            title={
                                <CardTitle
                                    title={"Sign In"}
                                    orgName={getDomain(window.location.host)}
                                    layout={{ left: 6, right: 18 }}
                                />
                            }
                        >
                            <div className="bold600 font24 marginB30 ">
                                Set-Up New Password
                            </div>
                            <Form
                                layout={"vertical"}
                                name="SignIn Form"
                                onFinish={changePassword}
                                validateMessages={validateMessages}
                            >
                                <Form.Item
                                    name={"password"}
                                    label="New Password"
                                    rules={[
                                        {
                                            type: "string",
                                            min: 8,
                                            required: true,
                                        },
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
                                <Form.Item
                                    name={"cnf_password"}
                                    label="Confirm New Password"
                                    dependencies={["password"]}
                                    rules={[
                                        {
                                            type: "string",
                                            required: true,
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (
                                                    !value ||
                                                    getFieldValue(
                                                        "password"
                                                    ) === value
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    "The two passwords that you entered do not match!"
                                                );
                                            },
                                        }),
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
                                <Form.Item>
                                    <Button
                                        className="submitButton marginT18"
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            borderRadius: "100px",
                                        }}
                                    >
                                        Change Password
                                    </Button>
                                </Form.Item>
                                {!!error && (
                                    <Alert
                                        message={error}
                                        type="error"
                                        showIcon
                                        closable
                                    />
                                )}
                            </Form>
                        </Card>
                    </div>
                </Spinner>
            ) : (
                <Result
                    status="success"
                    title="Password changed successfully!"
                />
            )}
        </>
    );
};
export default withRouter(ChangePassword);
