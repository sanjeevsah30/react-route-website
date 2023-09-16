import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Card, Button, Form, Input, Alert, Result } from "antd";
import CardTitle from "@presentational/Authentication/CardTitle";
import { useSelector, useDispatch } from "react-redux";
import routes from "@constants/Routes/index";
import { Link, withRouter, Redirect } from "react-router-dom";
import { Spinner } from "@presentational/reusables/index";
import authFormConfig from "@constants/AuthForm/index";
import { LockOutlined } from "@ant-design/icons";
import { checkAuth } from "@store/auth/actions";
import apiErrors from "@apis/common/errors";
import { resetPasswordAjx } from "@apis/authentication/index";
import { getDomain } from "tools/helpers";

function ResetPassword(props) {
    const dispatch = useDispatch();
    const domain = useSelector((state) => state.common.domain);
    const isLoading = useSelector((state) => state.common.showLoader);
    const isUserAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );
    const [isResetting, setIsResetting] = useState(false);
    const [error, setError] = useState("");
    const [passwordResetDone, setPasswordResetDone] = useState(false);
    const [hasToken, setHasToken] = useState(true);
    const [resetToken, setResetToken] = useState("");

    useEffect(() => {
        let query = props.location.search.substring(1);
        let params = {};
        if (query) {
            params = JSON.parse(
                '{"' +
                    decodeURI(query)
                        .replace(/"/g, '\\"')
                        .replace(/&/g, '","')
                        .replace(/=/g, '":"') +
                    '"}'
            );
        }
        if (params.uid) {
            setResetToken(params.uid);
            if (!isUserAuthenticated) {
                dispatch(checkAuth());
            }
        } else {
            setHasToken(false);
        }
    }, []);

    const validateMessages = {
        required: "${label} is required!",
        string: {
            min: "${label} must be at least ${min} characters",
        },
    };

    const resetPassword = (values) => {
        setIsResetting(true);
        setError("");
        const data = new FormData();
        data.append("new_password", values.password);
        resetPasswordAjx(domain, data, resetToken).then(
            ({ status, message }) => {
                setIsResetting(false);
                if (status === apiErrors.AXIOSERRORSTATUS) {
                    if (Array.isArray(message)) {
                        const newError = message.reduce(
                            (prev, curr) => prev + "\n" + curr
                        );
                        setError(newError);
                    } else {
                        setError(message);
                    }
                    return;
                }
                setPasswordResetDone(true);
            }
        );
    };
    return (
        <>
            {isUserAuthenticated && <Redirect to={routes.CALLS} />}
            <Helmet>
                <meta charSet="utf-8" />
                <title>Reset Password</title>
            </Helmet>
            <>
                {hasToken ? (
                    <>
                        {!passwordResetDone ? (
                            <Spinner loading={isLoading || isResetting}>
                                <div className="row user-auth-card password_reset_card">
                                    <Card
                                        title={
                                            <CardTitle
                                                title={"Sign In"}
                                                orgName={getDomain(
                                                    window.location.host
                                                )}
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
                                            onFinish={resetPassword}
                                            validateMessages={validateMessages}
                                        >
                                            <Form.Item
                                                name={"password"}
                                                label="Password"
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
                                                label="Confirm Password"
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
                                                    className="submitButton marginT16"
                                                    shape="round"
                                                    type="primary"
                                                    htmlType="submit"
                                                >
                                                    CHANGE PASSWORD
                                                </Button>
                                                {!!error && (
                                                    <Alert
                                                        message={error}
                                                        type="error"
                                                        showIcon
                                                        closable
                                                        style={{
                                                            whiteSpace:
                                                                "pre-wrap",
                                                            marginTop: "0.5rem",
                                                        }}
                                                    />
                                                )}
                                            </Form.Item>
                                        </Form>
                                    </Card>
                                </div>
                            </Spinner>
                        ) : (
                            <div className="flex column items-center">
                                <Result
                                    status="success"
                                    title="Password was reset successfully!"
                                />
                                <Link
                                    to="/signin"
                                    style={{
                                        color: "#1a62f2",
                                    }}
                                >
                                    GO TO SIGNIN
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <Result status="error" title="Invalid reset request" />
                )}
            </>
        </>
    );
}

export default withRouter(ResetPassword);
