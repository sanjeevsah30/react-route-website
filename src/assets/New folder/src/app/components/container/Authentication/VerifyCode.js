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
import { Spinner } from "@presentational/reusables/index";
import { checkAuth } from "@store/auth/actions";
import { withRouter, useLocation, Redirect } from "react-router";
import CardTitle from "app/components/presentational/Authentication/CardTitle";
import { getDomain } from "tools/helpers";
import { getError } from "app/ApiUtils/common";
import axios from "axios";
import apiConfigs from "app/ApiUtils/common/commonApiConfig";
import routes from "app/constants/Routes";
import { openNotification } from "@store/common/actions";
const VerifyCode = () => {
    const dispatch = useDispatch();
    const domain = useSelector((state) => state.common.domain);
    const validateMessages = {
        required: "Code is required!",
    };
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const email = new URLSearchParams(location.search).get("email");
    const [form] = Form.useForm();

    const isUserAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const handleLogin = (values) => {
        setIsLoading(true);
        setError("");
        const data = new FormData();
        data.append("otp", values.code);
        data.append("email", email);
        axios
            .post(
                `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/person/verify_otp/`,
                data
            )
            .then((res) => {
                localStorage.setItem("authTokens", JSON.stringify(res.data));
                dispatch(checkAuth());
                setIsLoading(false);
            })
            .catch((e) => {
                const err = getError(e);
                form.resetFields();
                setError(err?.message);
                setIsLoading(false);
            });
    };

    const resendCode = () => {
        setIsLoading(true);
        setError("");
        const data = new FormData();
        data.append("email", email);
        axios
            .post(
                `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/person/verify_otp/resend/`,
                data
            )
            .then((res) => {
                setIsLoading(false);
                openNotification(
                    "success",
                    "success",
                    `Otp sent to your mail ${email}`
                );
            })
            .catch((e) => {
                const err = getError(e);
                setError(err?.message);
                setIsLoading(false);
            });
    };
    return (
        <>
            {isUserAuthenticated && <Redirect to={routes.CALLS} />}

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
                        <div
                            className="bold600 font24 marginB10"
                            style={{
                                width: "60%",
                            }}
                        >
                            We have sent a verification code to your email.
                        </div>
                        <div className="font20 bold600 dove_gray_cl marginB30">
                            ({`${email}`})
                        </div>
                        <Form
                            layout={"vertical"}
                            name="SignIn Form"
                            onFinish={handleLogin}
                            validateMessages={validateMessages}
                            form={form}
                        >
                            <Form.Item
                                name={"code"}
                                label="Enter the code"
                                rules={[
                                    {
                                        type: "string",

                                        required: true,
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    placeholder={
                                        authFormConfig.PASSWORD_PLACEHOLDER
                                    }
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
                                    Verify Code
                                </Button>
                            </Form.Item>
                            <Button
                                className="submitButton"
                                type="primary"
                                onClick={resendCode}
                                style={{
                                    borderRadius: "100px",
                                }}
                            >
                                Resend Code
                            </Button>
                            {!!error && (
                                <Alert
                                    message={error}
                                    type="error"
                                    showIcon
                                    closable
                                    className="marginTB24"
                                />
                            )}
                        </Form>
                    </Card>
                </div>
            </Spinner>
        </>
    );
};
export default withRouter(VerifyCode);
