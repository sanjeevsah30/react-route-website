import { Form, Select, Input, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import DeleteSvg from "app/static/svg/DeleteSvg";
const { Option, OptGroup } = Select;

/*important : Labels for every form except the first is hidden using css
. Available in the the current directory's style file 
    .ant-form:not(:first-child) {
        label {
            display: none !important;
        }
    }
*/
function UserForm({
    handleLicenseValidation,

    setFormRefs,
    formRefs,
    idx,
    handleRemove,
}) {
    const { available_subscriptions, user_types } = useSelector(
        (state) => state.settings
    );

    const allTeams = useSelector((state) => state.common.teams);
    const allRoles = useSelector((state) => state.role_manager.roles);
    const [isSelectedObserver, setIsSelectedObserver] = useState(true);

    const {
        common: { versionData },
    } = useSelector((state) => state);

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
        setFormRefs([...formRefs, form]);
    }, []);

    const handleUserTypeChange = (val) => {
        val === 0 ? setIsSelectedObserver(true) : setIsSelectedObserver(false);
    };

    useEffect(() => {
        if (isSelectedObserver) {
            form.setFieldsValue({ subscription: null });
        }
    }, [isSelectedObserver]);

    return (
        <>
            <Form
                form={form}
                layout={"vertical"}
                name="Create User"
                // onFinish={createUserHandler}
                validateMessages={validateMessages}
                initialValues={{ user_type: 0, subscription: null }}
            >
                {versionData?.domain_type === "b2c" && (
                    <>
                        <Form.Item
                            name={"first_name"}
                            label="First Name"
                            rules={[{ required: true }]}
                            hasFeedback
                        >
                            <Input
                                placeholder={"Enter First Name"}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item
                            name={"last_name"}
                            label="Last Name"
                            hasFeedback
                        >
                            <Input placeholder={"Enter Last Name"} allowClear />
                        </Form.Item>
                    </>
                )}

                <Form.Item
                    name={"email"}
                    label="Email"
                    rules={[{ type: "email", required: true }]}
                    hasFeedback
                >
                    <Input placeholder={"Enter Email Address"} allowClear />
                </Form.Item>
                <Form.Item
                    name={"role"}
                    label="Role"
                    rules={[{ required: true }]}
                    hasFeedback
                >
                    <Select
                        placeholder="Select a Role"
                        allowClear
                        dropdownClassName="user_manager_drop"
                    >
                        {allRoles.map((role) => (
                            <Option key={`invitee__${role.id}`} value={role.id}>
                                {role.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name={"user_type"}
                    label="User Type"
                    rules={[{ required: true }]}
                    hasFeedback
                >
                    <Select
                        placeholder="Select User Type"
                        allowClear
                        dropdownClassName="user_manager_drop"
                        onChange={handleUserTypeChange}
                    >
                        {user_types.map((type) => (
                            <Option key={type.id} value={type.id}>
                                {type.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name={"subscription"}
                    label="License"
                    rules={[{ required: !isSelectedObserver }]}
                    hasFeedback
                >
                    <Select
                        placeholder="Select a License"
                        allowClear
                        dropdownClassName="user_manager_drop"
                        disabled={isSelectedObserver}
                        // defaultValue="free"
                        onChange={handleLicenseValidation}
                    >
                        {available_subscriptions.map((license) => (
                            <Option
                                key={`invitee__${license.subscription_id}`}
                                value={license.subscription_id}
                            >
                                {license.subscription_type}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name={"team"}
                    label="Team"
                    rules={[{ required: true }]}
                    hasFeedback
                >
                    <Select
                        placeholder="Select a Team"
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        dropdownClassName="user_manager_drop"
                    >
                        {allTeams.map((team) => {
                            return team?.subteams?.length ? (
                                <OptGroup key={team.id} label={team.name}>
                                    {team.subteams.map((team) => (
                                        <Option
                                            key={`invitee__${team.id}`}
                                            value={team.id}
                                            label={team.name}
                                        >
                                            {team.name}
                                        </Option>
                                    ))}
                                </OptGroup>
                            ) : (
                                <Option
                                    key={`invitee__${team.id}`}
                                    value={team.id}
                                    label={team.name}
                                >
                                    {team.name}
                                </Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="User ID" hasFeedback>
                    <div className="flex alignCenter">
                        <Form.Item name={"primary_phone"}>
                            <Input placeholder={"Enter user ID"} allowClear />
                        </Form.Item>
                        {idx !== 0 && (
                            <Button
                                type="text height100p"
                                onClick={() => {
                                    handleRemove(idx);
                                }}
                            >
                                <DeleteSvg />
                            </Button>
                        )}
                    </div>
                </Form.Item>
            </Form>
        </>
    );
}

export default UserForm;
