import React, { useEffect, useState } from "react";
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
import { changePasswordAjx, updateUser } from "@apis/authentication/index";
import apiErrors from "@apis/common/errors";
import { uid } from "@tools/helpers";
import { tz } from "moment-timezone";
import { checkAuth, storeUser } from "@store/auth/actions";
import commonConfig from "@constants/common/index";
import { capitalizeFirstLetter, getDateTime } from "@tools/helpers";
import { openNotification } from "@store/common/actions";
import "./usersettings.style.scss";

const { Meta } = Card;
const { Option } = Select;

const UserSettings = () => {
    const dispatch = useDispatch();
    const domain = useSelector((state) => state.common.domain);
    const user = useSelector((state) => state.auth);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isChangingTimeZone, setIsChangingTimeZone] = useState(false);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const [isTimeZoneChanged, setIsTimeZoneChanged] = useState(false);

    const validateMessages = {
        required: "${label} is required!",
        string: {
            min: "${label} must be at least ${min} characters",
        },
    };
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     if (debounsePhone !== user?.primary_phone) {
    //         dispatch(
    //             updateUserRequest(user?.id, {
    //                 primary_phone: debounsePhone,
    //             })
    //         );
    //     }
    // }, [debounsePhone]);

    const changePassword = (values) => {
        setIsLoading(true);
        setError("");
        const data = new FormData();
        data.append("new_password", values.password);
        data.append("old_password", values.old_password);
        changePasswordAjx(domain, data).then((res) => {
            setIsLoading(false);
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                setError(res.message);
                return;
            }
            setIsChangingPassword(true);
            setIsPasswordChanged(true);
            window.localStorage.clear("authTokens");
            dispatch(checkAuth());
            openNotification(
                "success",
                "Success",
                "Password changed successfully. Login again with the new Password"
            );
            setTimeout(() => {
                setIsPasswordChanged(false);
                setIsChangingPassword(false);
            }, 2000);
        });
    };

    const changeTimeZone = (values) => {
        setIsLoading(true);
        setError("");
        updateUser(
            domain,
            {
                timezone: values.time_zone,
            },
            user.id
        ).then((res) => {
            setIsLoading(false);
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                setError(res.message);
                return;
            }
            dispatch(
                storeUser({
                    id: res.id,
                    email: res.email,
                    first_name: res.first_name
                        ? res.first_name.split(" ")[0]
                        : "",
                    full_name: res.first_name,
                    role: res.role,
                    timezone: res.timezone,
                })
            );
            setIsChangingTimeZone(true);
            setIsTimeZoneChanged(true);
            setTimeout(() => {
                setIsTimeZoneChanged(false);
                setIsChangingTimeZone(false);
            }, 2000);
        });
    };

    return (
        <div>
            <div>
                <div className="profile__card">
                    <div className="bold600 font20 mine_shaft_cl marginB20">
                        User Profile
                    </div>
                    <div>
                        <div className="flex">
                            <div className="flex1">
                                <Meta
                                    avatar={
                                        <Avatar
                                            size={50}
                                            style={{
                                                backgroundColor: "#7265e6",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            {user.first_name
                                                ?.split("")[0]
                                                ?.toUpperCase()}
                                        </Avatar>
                                    }
                                />
                            </div>

                            <div className="flex1">
                                <div className="profile_label">First Name</div>
                                <div className="value">{user.first_name}</div>
                            </div>
                            <div className="flex1">
                                <div className="profile_label">Last Name</div>
                                <div className="value">{user.last_name}</div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex1">
                                <div className="profile_label">Email</div>
                                <div className="value">{user.email}</div>
                            </div>

                            <div className="flex1">
                                <div className="profile_label">User ID</div>
                                <div className="value">
                                    {user.primary_phone}
                                </div>
                            </div>
                            <div className="flex1"></div>
                        </div>
                        <div className="flex">
                            <div className="flex1">
                                <div className="profile_label">Team</div>
                                <div className="value">
                                    {capitalizeFirstLetter(user?.team_name)}
                                </div>
                            </div>

                            <div className="flex1">
                                <div className="profile_label">Role</div>
                                <div className="value">{user?.role?.name}</div>
                            </div>
                            <div className="flex1">
                                <div className="flex1">
                                    <div className="profile_label">Manager</div>
                                    <div className="value">
                                        {`${user?.manager?.first_name || ""} ${
                                            user?.manager?.last_name || ""
                                        }`}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex1">
                                <div className="profile_label">User Type</div>
                                <div className="value">
                                    {commonConfig.USER_TYPE?.[user.user_type]}
                                </div>
                            </div>

                            <div className="flex1">
                                <div className="profile_label">
                                    License Type
                                </div>
                                <div className="value">
                                    {user?.license_name}
                                </div>
                            </div>
                            <div className="flex1">
                                <div className="profile_label">Join Date</div>
                                <div className="value">
                                    {getDateTime(user.date_joined, "date")}
                                </div>
                            </div>
                        </div>
                        <Row gutter={[12, 12]} className="paddingL6 marginT20">
                            <Col
                                style={{
                                    paddingLeft: 0,
                                }}
                            >
                                <Button
                                    type={"primary"}
                                    onClick={() => {
                                        isChangingTimeZone &&
                                            setIsChangingTimeZone(false);
                                        setIsChangingPassword(true);
                                    }}
                                    disabled={isChangingPassword}
                                    className="borderRadius6"
                                >
                                    Change Password
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type={"secondary"}
                                    onClick={() => {
                                        isChangingPassword &&
                                            setIsChangingPassword(false);
                                        setIsChangingTimeZone(true);
                                    }}
                                    disabled={isChangingTimeZone}
                                    className="borderRadius6 marginL10"
                                >
                                    Change Timezone
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
                {isChangingTimeZone && (
                    <Card className="changePassword" title={"Change TimeZone"}>
                        {!isTimeZoneChanged ? (
                            <Spinner loading={isLoading}>
                                <Form
                                    layout={"vertical"}
                                    name="SignIn Form"
                                    onFinish={changeTimeZone}
                                    validateMessages={validateMessages}
                                    initialValues={{
                                        time_zone: user.timezone,
                                    }}
                                >
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
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
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
                                    <Form.Item>
                                        <Button
                                            className="borderRadius6 marginL10"
                                            htmlType="button"
                                            onClick={() =>
                                                setIsChangingTimeZone(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="submitButton borderRadius6"
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            Change TimeZone
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
                            </Spinner>
                        ) : (
                            <Result
                                status="success"
                                title="Timezone changed successfully!"
                            />
                        )}
                    </Card>
                )}
                {isChangingPassword && (
                    <Card className="changePassword" title={"Change Password"}>
                        {!isPasswordChanged ? (
                            <Spinner loading={isLoading}>
                                <Form
                                    layout={"vertical"}
                                    name="SignIn Form"
                                    onFinish={changePassword}
                                    validateMessages={validateMessages}
                                >
                                    <Form.Item
                                        name={"old_password"}
                                        label="Old Password"
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
                                            className="borderRadius6 marginL10"
                                            htmlType="button"
                                            onClick={() =>
                                                setIsChangingPassword(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="submitButton borderRadius6"
                                            type="primary"
                                            htmlType="submit"
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
                            </Spinner>
                        ) : (
                            <Result
                                status="success"
                                title="Password changed successfully!"
                            />
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default UserSettings;
