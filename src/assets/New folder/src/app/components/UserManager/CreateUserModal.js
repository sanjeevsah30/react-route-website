import { Spinner } from "@presentational/reusables/index";
import { Form, Modal, Button } from "antd";
import React, { useEffect, useState, useRef } from "react";
import Papa from "papaparse";

import {
    createNewUser,
    getAvailableSubscription,
} from "@store/settings/actions";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleFilled } from "@ant-design/icons";
import useTimer from "hooks/useTimer";
import { Redirect, useHistory } from "react-router-dom";

import { flattenTeams, uid } from "@tools/helpers";
import UserForm from "./UserForm";
import { inviteMultipleUsersApi } from "@apis/authentication/index";

import { getAllUsers, openNotification } from "@store/common/actions";
import apiErrors from "@apis/common/errors";
import { STORE_INVITED_USERS } from "@store/settings/types";
import { getUserMangerList } from "@store/userManagerSlice/userManagerSlice";
import { getError } from "@apis/common/index";

export default function CreateUserModal({
    handleCreateUserModal,
    showCreateModal,
}) {
    const [massage, setMassage] = useState("");
    const fileInput = useRef();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [creatingUser, setCreatingUser] = useState(false);
    const {
        settings: { available_subscriptions, designations, user_types },
        common: { versionData, domain, teams },
        settings: { invited },
    } = useSelector((state) => state);
    const [users, setUsers] = useState([
        {
            id: uid(),
        },
    ]);
    const [formRefs, setFormRefs] = useState([]);

    const [isSelectedObserver, setIsSelectedObserver] = useState(true);
    const [isValidLicense, setIsValidLicense] = useState(true);

    // const {
    //     subscription: { data: subscriptionData },
    // } = useSelector((state) => state.billing);

    const {
        subscription: { data },
    } = useSelector((state) => state.billing);

    const { totalSeconds } = useTimer({
        expiryTimestamp: versionData?.expirydate * 1000,
        onExpire: () => {},
    });

    const history = useHistory();

    useEffect(() => {
        if (isSelectedObserver) {
            form.setFieldsValue({ subscription: null });
        }
    }, [isSelectedObserver]);

    const [pay_now, setPay_now] = useState(false);

    // const handleLicenseValidation = (val) => {
    //     const is_licenses_available = available_subscriptions.find(
    //         ({ subscription_id }) => subscription_id === val
    //     )?.is_licenses_available;

    //     if (val !== subscriptionData?.id) {
    //         setPay_now(true);
    //     }

    //     val === subscriptionData?.id && is_licenses_available
    //         ? setIsValidLicense(true)
    //         : setIsValidLicense(false);
    // };

    const createUserHandler = (values) => {
        setCreatingUser(true);
        if (values.user_type === 0) {
            delete values.subscription;
        }
        dispatch(createNewUser(values, versionData.domain_type)).then((res) => {
            if (!res.status) {
                handleCreateUserModal(false);
            }
            setCreatingUser(false);
        });
    };

    const resetFormState = () => {
        form.resetFields();
        setIsSelectedObserver(true);
        setPay_now(false);
    };

    useEffect(() => {
        resetFormState();
    }, [available_subscriptions]);

    useEffect(() => {
        return () => {
            resetFormState();
        };
    }, [showCreateModal]);

    const handleRemove = (idx) => {
        setFormRefs(formRefs.filter((_, index) => index !== idx));
        setUsers(users.filter((_, index) => index !== idx));
    };

    const handleClose = () => {
        handleCreateUserModal(false);
        setUsers([
            {
                id: uid(),
            },
        ]);
        setFormRefs([]);
    };

    const handleInvite = (users) => {
        const payload = users.map((user) => {
            const temp = { ...user };
            if (temp.user_type === 0) {
                delete temp.subscription;
            }
            if (
                versionData?.domain_type === "b2b" ||
                versionData?.domain_type === undefined
            ) {
                temp.extra_info = {};
                if (temp.primary_phone) {
                    temp.extra_info = {
                        primary_phone: temp.primary_phone,
                    };
                }
                delete temp.primary_phone;
            }

            return temp;
        });

        setCreatingUser(true);
        inviteMultipleUsersApi(domain, payload, versionData?.domain_type)
            .then((res) => {
                setCreatingUser(false);
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    const error = getError(res);
                    return openNotification("error", "Error", error.message);
                }
                dispatch(getUserMangerList());
                openNotification(
                    "success",
                    "Success",
                    "Invitation mail sent to email id"
                );
                handleClose();
                let existingUsers = JSON.parse(JSON.stringify(invited));
                dispatch(STORE_INVITED_USERS([res.data, ...existingUsers]));
                dispatch(getAvailableSubscription());
                dispatch(getUserMangerList());
            })
            .catch((err) => {
                setCreatingUser(false);
            });
    };

    let isCreateUser = "";

    const csvHandleForce = (users, fileInfo) => {
        const userPayload = [];

        users.forEach((user) => {
            const newUser = Object.keys(user).reduce((item, key) => {
                item[key.split(" ").join("").toLowerCase()] = user[key];
                return item;
            }, {});

            let isUserValidForPayload = true;
            let validUser =
                newUser.hasOwnProperty("firstname") &&
                newUser.firstname !== "" &&
                newUser.hasOwnProperty("email") &&
                newUser.email !== "" &&
                newUser.hasOwnProperty("role") &&
                newUser.role !== "" &&
                (newUser.hasOwnProperty("usertype") &&
                newUser.usertype !== "" &&
                newUser.usertype.toLowerCase() === "Observer".toLowerCase()
                    ? true
                    : newUser.usertype.toLowerCase() ===
                          "Product User".toLowerCase() &&
                      newUser.hasOwnProperty("license") &&
                      newUser.license !== "") &&
                newUser.hasOwnProperty("team") &&
                newUser.team !== ""
                    ? validateData(newUser)
                    : { invalid: null };

            if (validUser["invalid"] === null) isUserValidForPayload = false;

            for (let userInfo in validUser) {
                if (validUser[userInfo] === null) isUserValidForPayload = false;
            }

            if (isUserValidForPayload) userPayload.push(validUser);
        });

        setCreatingUser(true);

        inviteMultipleUsersApi(domain, userPayload, versionData?.domain_type)
            .then((res) => {
                setCreatingUser(false);
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    const tempkeyArr = Object.keys(res.message);
                    const errorMsg = res.message[tempkeyArr[0]][0]; // we are taking 1st occurance value of response
                    return openNotification("error", "Error", errorMsg);
                }

                openNotification(
                    "success",
                    "Success",
                    "Invitation mail sent to email id"
                );
                handleClose();
                let existingUsers = JSON.parse(JSON.stringify(invited));
                dispatch(STORE_INVITED_USERS([res.data, ...existingUsers]));
                dispatch(getAvailableSubscription());
            })
            .catch((err) => {
                setCreatingUser(false);
            });
    };

    useEffect(() => {
        if (creatingUser && fileInput?.current) {
            fileInput.current.value = "";
        }
    }, [creatingUser]);

    const validateData = (user) => {
        const newObj = {};

        newObj["first_name"] =
            typeof user.firstname === "string" && user.firstname.length >= 2
                ? user.firstname
                : null;

        newObj["last_name"] =
            typeof user.lastname === "string" && user.lastname.length >= 1
                ? user.lastname
                : "";

        newObj["email"] = user.email.match(
            /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        )
            ? user.email
            : null;

        newObj["degination"] =
            designations.find(
                (type) => type.name.toLowerCase() === user.role.toLowerCase()
            )?.id || null;

        newObj["user_type"] = user_types.find(
            (type) =>
                type.name.split(" ").join("").trim().toLowerCase() ===
                user.usertype.split(" ").join("").trim().toLowerCase()
        )?.id;

        if (newObj["user_type"] === undefined) newObj["user_type"] = null;

        if (
            user_types
                .find(
                    (type) =>
                        type.name.toLowerCase() === user.usertype.toLowerCase()
                )
                ?.name.toLowerCase() === "Product User".toLowerCase()
        ) {
            newObj["subscription"] =
                available_subscriptions.find(
                    ({ subscription_type }) =>
                        subscription_type.toLowerCase() ===
                        user.license.toLowerCase().trim()
                )?.subscription_id || null;
        }

        newObj["team"] =
            flattenTeams(teams).find(
                (team) =>
                    team.name?.split(" ").join("").trim().toLowerCase() ===
                    user.team.split(" ").join("").trim().toLowerCase()
            )?.id || null;

        newObj["primary_phone"] =
            typeof user.primaryphone === "string" &&
            `${user.primaryphone}`.length === 10
                ? user.primaryphone
                : "";

        return newObj;
    };

    function uploadCsvHandler(event) {
        if (event.target.files[0] !== undefined) {
            setMassage(`${event.target.files[0].name}`);
            Papa.parse(event.target.files[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const parsedData = results.data;
                    csvHandleForce(parsedData, event.target.files[0].name);
                },
            });
        } else {
            setMassage("");
        }
    }
    return (
        <Modal
            visible={showCreateModal}
            title={
                versionData?.domain_type === "b2c"
                    ? "Create User"
                    : "Invite User"
            }
            className={
                versionData?.domain_type === "b2c"
                    ? "createUserModal"
                    : "createUserModal inviteUserModal"
            }
            okText={
                (totalSeconds > 0 && isValidLicense) || isSelectedObserver
                    ? versionData?.domain_type === "b2c"
                        ? "Create User"
                        : "Invite User"
                    : "Pay Now"
            }
            cancelText="Cancel"
            onCancel={handleClose}
            onOk={() => {
                (totalSeconds > 0 && isValidLicense) || isSelectedObserver
                    ? form
                          .validateFields()
                          .then((values) => {
                              resetFormState();
                              createUserHandler(values);
                          })
                          .catch((info) => {
                              console.log("Validate Failed:", info);
                          })
                    : pay_now || totalSeconds === 0
                    ? history.push("/settings/billing?pay_now=true")
                    : history.push("/settings/billing?manage=true");
            }}
            width={1300}
            destroyOnClose={true}
            footer={
                <div className="flex justifySpaceBetween width100p">
                    <Button
                        onClick={() => {
                            setUsers([
                                ...users,
                                {
                                    id: uid(),
                                },
                            ]);
                        }}
                        type="text"
                        className="mine_shaft_cl height100p"
                    >
                        + Add User
                    </Button>
                    <div className="control-container flex justifySpaceBetween alignCenter">
                        {data?.total_licenses -
                            data?.active_licenses -
                            formRefs.filter(
                                (e) =>
                                    e.getFieldValue("user_type") !== 0 &&
                                    e.getFieldValue("subscription") !== null &&
                                    available_subscriptions
                                        .find((a) => {
                                            return (
                                                a.subscription_id ===
                                                e.getFieldValue("subscription")
                                            );
                                        })
                                        ?.subscription_type?.toLowerCase() !==
                                        "free"
                            )?.length >=
                        0 ? (
                            <Button
                                className="marginR16"
                                type="primary"
                                onClick={() => {
                                    Promise.all(
                                        formRefs.map((ref) =>
                                            ref.validateFields()
                                        )
                                    )
                                        .then((values) => handleInvite(values))
                                        .catch((info) => {
                                            console.log(
                                                "Validate Failed:",
                                                info
                                            );
                                        });
                                }}
                            >
                                {
                                    (isCreateUser =
                                        versionData?.domain_type === "b2c"
                                            ? "Create User"
                                            : "Invite User")
                                }
                            </Button>
                        ) : (
                            <Button
                                className="marginR16"
                                type="primary"
                                onClick={() => {
                                    history.push(
                                        "/settings/billing?manage=true"
                                    );
                                }}
                            >
                                Pay Now
                            </Button>
                        )}
                    </div>
                </div>
            }
        >
            {versionData?.banner && <Banner {...versionData?.banner} />}

            <Spinner loading={creatingUser}>
                {users.map(({ id }, idx) => (
                    <UserForm
                        key={id}
                        idx={idx}
                        setFormRefs={setFormRefs}
                        formRefs={formRefs}
                        handleRemove={handleRemove}
                    />
                ))}
            </Spinner>
        </Modal>
    );
}

const Banner = ({ text, level }) => {
    return (
        <p className={`trial_banner ${level === "error" ? "expired" : ""}`}>
            <ExclamationCircleFilled style={{ fontSize: "16px" }} />
            <span
                dangerouslySetInnerHTML={{
                    __html: text,
                }}
                className="paddingL8"
            />
        </p>
    );
};
