import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Card, Button, Form, Input, Alert, Result } from "antd";
import CardTitle from "@presentational/Authentication/CardTitle";
import { useSelector, useDispatch } from "react-redux";
import routes from "@constants/Routes/index";
import { Link, withRouter, Redirect } from "react-router-dom";
import { Spinner } from "@presentational/reusables/index";
import authFormConfig from "@constants/AuthForm/index";
import { MailOutlined } from "@ant-design/icons";
import { checkAuth } from "@store/auth/actions";
import { forgetPasswordAjx } from "@apis/authentication/index";
import apiErrors from "@apis/common/errors";

function ForgetPassword() {
    const dispatch = useDispatch();
    const domain = useSelector((state) => state.common.domain);
    const isLoading = useSelector((state) => state.common.showLoader);
    const isUserAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );
    const [isSendingLink, setIsSendingLink] = useState(false);
    const [error, setError] = useState("");
    const [resetLinkSent, setResetLinkSent] = useState(false);

    useEffect(() => {
        if (!isUserAuthenticated) {
            dispatch(checkAuth());
        }
    }, []);

    const validateMessages = {
        required: "${label} is required!",
        types: {
            email: "${label} is not validate email!",
        },
    };

    const sendResetLink = (values) => {
        setIsSendingLink(true);
        setError("");
        const data = new FormData();
        data.append("email", values.email);
        forgetPasswordAjx(domain, data).then((res) => {
            setIsSendingLink(false);
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                setError(
                    "Unable to sent link at the moment. Please double-check your email."
                );
                return;
            }
            setResetLinkSent(true);
        });
    };
    return (
        <>
            {isUserAuthenticated && <Redirect to={routes.CALLS} />}
            <Helmet>
                <meta charSet="utf-8" />
                <title>Forget Password</title>
            </Helmet>
            <div className="row user-auth-card">
                <Card
                    title={
                        <CardTitle
                            title={"Forget Password"}
                            orgName={domain}
                            layout={{ left: 6, right: 18 }}
                        />
                    }
                    actions={[
                        <Link
                            to={routes.SIGNIN}
                            className="user-auth-bottom-nav-link"
                        >
                            <Button type="link">Back to Sign in</Button>
                        </Link>,
                    ]}
                >
                    {!resetLinkSent ? (
                        <Spinner loading={isLoading || isSendingLink}>
                            <Form
                                layout={"vertical"}
                                name="SignIn Form"
                                onFinish={sendResetLink}
                                validateMessages={validateMessages}
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
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        className="submitButton"
                                        shape="round"
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        Get Reset Link
                                    </Button>
                                    {!!error && (
                                        <div className="marginT20">
                                            <Alert
                                                message={error}
                                                type="error"
                                                showIcon
                                                closable
                                            />
                                        </div>
                                    )}
                                </Form.Item>
                            </Form>
                        </Spinner>
                    ) : (
                        <Result
                            status="success"
                            title="Reset link sent successfully"
                            subTitle="Please check your email account. Remember to check spam/junk folder as well."
                        />
                    )}
                </Card>
            </div>
        </>
    );
}

export default withRouter(ForgetPassword);
