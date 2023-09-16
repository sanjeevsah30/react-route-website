import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import {
    Badge,
    Button,
    Input,
    Select,
    Space,
    Table,
    Tooltip,
    Popover,
    Modal,
    Form,
    DatePicker,
    Switch,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@store/common/actions";
import {
    flattenTeams,
    getDateTime,
    getLocaleDate,
    getRandomInt,
    uid,
} from "@tools/helpers";
import {
    changeRole,
    changeUserActive,
    changeUserManager,
    changeUserTeam,
    changeUserType,
    updateUserRequest,
} from "@store/settings/actions";
import commonConfig from "@constants/common/index";
import MoreSvg from "app/static/svg/MoreSvg";
import { resetUserPassword } from "@apis/settings/index";
import moment from "moment-timezone";
import { fixDateField } from "../../../tools/searchFactory";

const { Option, OptGroup } = Select;

export default function UserTable({
    searchTerm,
    childRef,
    setDownloadableUserList,
    downloadableUserList,
}) {
    const colors = [
        "pink",
        "red",
        "orange",
        "cyan",
        "green",
        "blue",
        "purple",
        "geekblue",
        "magenta",
        "volcano",
        "gold",
        "lime",
    ];
    const dispatch = useDispatch();
    const searchInput = useRef(null);
    const userId = useSelector((state) => state.auth.id);
    const isEditPermissionEnable = useSelector(
        (state) =>
            state.auth?.role?.code_names?.find(
                (obj) => obj?.heading === "User Manager"
            )?.permissions["View Users"]?.edit[0]?.is_selected
    );
    const { allUsers, loading } = useSelector(
        (state) => state.userManagerSlice
    );
    const allRoles = useSelector((state) => state.role_manager.roles);
    const allTeams = useSelector((state) => state.common.teams);
    const { user_types } = useSelector((state) => state.settings);
    const [searchUser, setSearchUser] = useState({
        searchText: "",
        searchedColumn: "",
    });
    const [tableData, setTableData] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const [form] = Form.useForm();

    function validateConfirmPassword(_, value) {
        const newPassword = form.getFieldValue("newPassword");

        if (!value) {
            return Promise.reject("Please enter a password");
        }
        if (value.length < 8) {
            return Promise.reject(
                "Password must be at least 8 characters long"
            );
        }
        if (!/\d/.test(value)) {
            return Promise.reject("Password must contain at least one number");
        }
        if (!/[a-z]/.test(value)) {
            return Promise.reject(
                "Password must contain at least one lowercase letter"
            );
        }
        if (!/[A-Z]/.test(value)) {
            return Promise.reject(
                "Password must contain at least one uppercase letter"
            );
        }
        if (!/\W/.test(value)) {
            return Promise.reject(
                "Password must contain at least one special character"
            );
        }

        // if (value !== confirmNewPassword) {
        //     return Promise.reject('password does not match');
        // }
        return Promise.resolve();
    }

    const onFinish = (values) => {
        const payload = {
            user_id: activeRecord,
            password: values.newPassword.trim(),
        };
        resetUserPassword(payload);

        setIsModalOpen(false);
        form.resetFields();
    };

    const {
        common: { versionData },
    } = useSelector((state) => state);

    // filter data based on global search term
    // let filteredTableData = {};
    useEffect(() => {
        let temp = searchTerm
            ? tableData.filter((el) => {
                  return Object.values(el).some((val) => {
                      if (val) {
                          return val
                              ?.toString()
                              ?.toLowerCase()
                              ?.includes(searchTerm?.toLowerCase());
                      }
                  });
              })
            : tableData;
        setDownloadableUserList(temp);
    }, [searchTerm, tableData]);

    useEffect(() => {
        if (allUsers.length) {
            const data = allUsers.map((user) => ({
                key: user?.id,
                email: user?.email,
                first_name: user.first_name,
                last_name: user.last_name,
                name: `${user?.first_name} ${user?.last_name}`,
                joinedOn: getLocaleDate(user?.date_joined),
                team: user?.team,
                integrations: user?.integrations || [],
                is_active: user?.is_active,
                manager: user.manager?.id,
                user_type: user.user_type,
                phone: user.primary_phone || "",
                android_details: user?.extra_details?.convin_android || null,
                android_extra_details:
                    user?.extra_details?.android_extra_details || null,
                role: user?.role?.id,
                org_date_joined: user.org_date_joined,
                location: user.location,
            }));

            setTableData(data);
            setLoadingUsers(false);
        }
    }, [allUsers]);

    // state for input editing

    const [selectedId, setSelectedId] = useState(0);
    useImperativeHandle(childRef, () => ({
        selectedId: (value) => setSelectedId(value),
    }));

    // const inputRef = useRef(null);

    // useEffect(() => {
    //     if (selectedId > 0) {
    //         inputRef.current.focus();
    //     }
    // }, [selectedId]);

    const [showBtn, setShowBtn] = useState(false);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState(null);
    const [activeRecord, setActiveRecord] = useState(null);
    const [org_date, set_org_date] = useState(null);
    const [location, setLoaction] = useState(null);

    const saveData = (user) => {
        const data = {
            first_name: firstName || user.first_name,
            last_name: lastName === null ? user.last_name : lastName,
            email: email.length > 0 ? email : user.email,
            primary_phone: phone,
        };
        dispatch(
            updateUserRequest(
                user.key,
                {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    primary_phone: data.primary_phone,
                    org_date_joined: org_date || user.org_date_joined,
                    location: location === null ? user.location : location,
                },
                () => {
                    setSelectedId(0);
                    setPhone("");
                    setFirstName("");
                    setLastName(null);
                    setEmail("");
                    set_org_date(null);
                    setShowBtn(false);
                    setLoaction("");
                }
            )
        );
        data.name = "";
        data.email = "";
        data.primary_phone = "";
    };

    const columns = [
        {
            title: "First Name",
            dataIndex: "first_name",
            key: "first_name",
            fixed: "left",
            width: 150,
            ellipsis: true,
            filterSearch: true,
            filters: Array?.from(
                new Set(downloadableUserList.map((e) => e?.first_name))
            ).map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),

            onFilter: (value, record) => record.first_name.startsWith(value),
            render: (fName, record) =>
                record.key === selectedId ? (
                    <Input
                        defaultValue={fName}
                        onChange={(e) => {
                            setShowBtn(true);
                            setFirstName(e.target.value);
                        }}
                        placeholder="Enter First Name"
                    />
                ) : (
                    <div
                        style={{
                            overflowX: "scroll",
                        }}
                    >
                        {fName}
                    </div>
                ),
        },
        {
            title: "Last Name",
            dataIndex: "last_name",
            key: "last_name",
            fixed: "left",
            width: 150,
            ellipsis: true,
            filterSearch: true,
            filters: Array?.from(
                new Set(downloadableUserList.map((e) => e?.last_name))
            ).map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),

            onFilter: (value, record) => {
                if (value) {
                    return record.last_name.startsWith(value);
                }
                if (value === "") {
                    return record.last_name === value;
                }
                return false;
            },
            render: (lName, record) =>
                record.key === selectedId ? (
                    <Input
                        defaultValue={lName}
                        onChange={(e) => {
                            setShowBtn(true);
                            setLastName(e.target.value);
                        }}
                        placeholder="Enter Last Name"
                    />
                ) : (
                    <div
                        style={{
                            overflowX: "scroll",
                        }}
                    >
                        {lName}
                    </div>
                ),
        },
        {
            title: "Email Address",
            dataIndex: "email",
            key: "email",
            width: 150,
            ellipsis: true,
            filterSearch: true,
            filters: Array?.from(
                new Set(downloadableUserList?.map((e) => e?.email))
            )?.map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),
            onFilter: (value, record) => record.email.startsWith(value),
            render: (email, record) => {
                return versionData?.domain_type === "b2c" ? (
                    record.key === selectedId ? (
                        <Input
                            defaultValue={email}
                            onChange={(e) => {
                                setShowBtn(true);
                                setEmail(e.target.value);
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                overflowX: "scroll",
                            }}
                        >
                            {email}
                        </div>
                    )
                ) : (
                    <div>{email}</div>
                );
            },
        },
        {
            title: "User ID",
            dataIndex: "phone",
            key: "phone",
            width: 150,

            ellipsis: true,
            filterSearch: true,
            filters: Array.from(
                new Set(downloadableUserList.map((e) => e?.phone))
            ).map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),
            onFilter: (value, record) => {
                if (value) {
                    return record.phone.startsWith(value);
                }
                if (value === "") {
                    return record.phone === value;
                }
                return false;
            },
            render: (phone, record) =>
                record.key === selectedId ? (
                    <Input
                        defaultValue={phone}
                        onChange={(e) => {
                            setShowBtn(true);
                            setPhone(e.target.value);
                        }}
                        placeholder="Enter Phone Number"
                    />
                ) : (
                    <div
                        style={{
                            overflowX: "scroll",
                        }}
                    >
                        {phone}
                    </div>
                ),
        },
        {
            title: "Joined On",
            dataIndex: "joinedOn",
            key: "joinedOn",
            width: 120,

            ellipsis: true,
            filterSearch: true,
            filters: Array.from(
                new Set(
                    downloadableUserList.map((e) => {
                        return e?.joinedOn;
                    })
                )
            ).map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),
            onFilter: (value, record) => record.joinedOn.startsWith(value),
        },
        {
            title: "Organization Joining Date",
            dataIndex: "org_date_joined",
            key: "org_date_joined",
            ellipsis: true,
            filterSearch: true,
            width: 120,
            filters: Array.from(
                new Set(
                    downloadableUserList.map((e) => {
                        return e?.org_date_joined;
                    })
                )
            ).map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),
            onFilter: (value, record) => {
                if (value) {
                    return record.org_date_joined.startsWith(value);
                }
                if (value === "") {
                    return record.org_date_joined === value;
                }
                return false;
            },
            render: (org_date_joined, record) =>
                record.key === selectedId ? (
                    <DatePicker
                        {...(org_date_joined && {
                            defaultValue: moment(org_date_joined),
                        })}
                        disabledDate={(current) => {
                            return current.valueOf() > Date.now();
                        }}
                        onChange={(date, dateString) => {
                            if (!date) {
                                return;
                            }
                            setShowBtn(true);
                            set_org_date(fixDateField(dateString));
                        }}
                    />
                ) : (
                    <div
                        style={{
                            overflowX: "scroll",
                        }}
                    >
                        {formatDate(org_date_joined)}
                    </div>
                ),
        },
        {
            title: "Manager",
            dataIndex: "manager",
            key: "manager",
            width: 150,

            ellipsis: true,
            filterSearch: true,
            filters: Array.from(
                new Set(
                    allUsers
                        .map((user) => {
                            if (
                                user?.role?.name === "Manager" ||
                                user?.role?.name === "Team Lead" ||
                                user?.role?.name === "Auditor" ||
                                user?.role?.name === "Admin"
                            )
                                return user?.first_name;
                        })
                        .filter((e) => e !== undefined)
                )
            ).map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),
            onFilter: (value, record) => {
                if (value)
                    return allUsers
                        .find((user) => user?.id === record.manager)
                        ?.first_name?.startsWith(value);
                if (value === "")
                    return (
                        allUsers.find((user) => user?.id === record.manager)
                            ?.first_name === value
                    );
            },
            render: (manager, record) =>
                record.key === selectedId ? (
                    <Select
                        placeholder="Select a manager"
                        defaultValue={manager}
                        onChange={(value) => {
                            dispatch(changeUserManager(record.key, value));
                        }}
                        style={{ width: "100%" }}
                        optionFilterProp="children"
                        showSearch
                        filterOption={(input, option) =>
                            option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {allUsers.map((user) =>
                            record.key === user.id ? null : (
                                <Option
                                    key={`${uid()}_${user.id}`}
                                    value={user.id}
                                >
                                    {user?.first_name || user?.email}
                                </Option>
                            )
                        )}
                    </Select>
                ) : (
                    <div>
                        {allUsers?.find((user) => user.id === manager)
                            ?.first_name ||
                            allUsers?.find((user) => user.id === manager)
                                ?.email}
                    </div>
                ),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            width: 150,
            ellipsis: true,
            filterSearch: true,
            filters: allRoles?.map((e) => {
                return {
                    text: e?.name?.replace(/\_/g, " "),
                    value: e?.name?.replace(/\_/g, " "),
                };
            }),
            onFilter: (value, record) =>
                allRoles
                    .find((el) => el.id === record?.role)
                    ?.name.replace(/\_/g, " ")
                    .startsWith(value),
            render: (role, record) =>
                record.key === selectedId ? (
                    <Select
                        placeholder="Select a role"
                        defaultValue={role}
                        onChange={(value) => {
                            dispatch(changeRole(record.key, value));
                        }}
                        style={{ width: "100%" }}
                    >
                        {allRoles?.map((designation) => (
                            <Option
                                key={uid() + designation.id}
                                value={designation.id}
                            >
                                {designation.name.replace(/\_/g, " ")}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    <div style={{ textTransform: "capitalize" }}>
                        {allRoles
                            .find((el) => el.id === role)
                            ?.name.replace(/\_/g, " ")}
                    </div>
                ),
        },
        {
            title: "Team",
            dataIndex: "team",
            key: "team",
            width: 150,
            ellipsis: true,
            filterSearch: true,
            filters: [
                {
                    text: "",
                    value: "",
                },
                ...flattenTeams(allTeams)?.map((e) => {
                    return {
                        text: e?.name?.replace(/\_/g, " "),
                        value: e?.name?.replace(/\_/g, " "),
                    };
                }),
            ],
            onFilter: (value, record) => {
                if (value === "") {
                    return record?.team?.name === value;
                }
                if (record.team !== null) {
                    return flattenTeams(allTeams)
                        .find((e) => e.id === record?.team?.id)
                        ?.name?.startsWith(value);
                } else return false;
            },
            render: (team, record) =>
                record.key === selectedId ? (
                    <Select
                        placeholder="Select a team"
                        defaultValue={team?.id}
                        onChange={(value) => {
                            dispatch(changeUserTeam(record.key, value));
                        }}
                        style={{ width: "100%" }}
                        optionFilterProp="children"
                        showSearch
                    >
                        {allTeams.map((team) => {
                            return team?.subteams?.length ? (
                                <OptGroup key={uid()} label={team.name}>
                                    {team.subteams.map((team) => (
                                        <Option key={team.id} value={team.id}>
                                            {team.name}
                                        </Option>
                                    ))}
                                </OptGroup>
                            ) : (
                                <Option key={team.id} value={team.id}>
                                    {team.name}
                                </Option>
                            );
                        })}
                    </Select>
                ) : (
                    <>
                        {(team != null &&
                            flattenTeams(allTeams)?.find(
                                ({ id }) => id === team.id
                            )?.name) ||
                            ""}
                    </>
                ),
        },
        {
            title: "User Type",
            dataIndex: "user_type",
            key: "user_type",
            width: 150,

            ellipsis: true,
            filterSearch: true,
            filters: Object.values(commonConfig.USER_TYPE).map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),
            onFilter: (value, record) =>
                commonConfig.USER_TYPE[record.user_type].startsWith(value),
            render: (user_type, record) =>
                record.key === selectedId ? (
                    <Select
                        placeholder="Select User Type"
                        defaultValue={user_type}
                        onChange={(value) => {
                            dispatch(changeUserType(record.key, value));
                        }}
                        style={{ width: "100%" }}
                        disabled={
                            !record.is_active || record.key === selectedId
                                ? false
                                : true
                        }
                    >
                        {user_types.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    <div>
                        {user_types.find((el) => el.id === user_type)?.name}
                    </div>
                ),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            width: 150,

            ellipsis: true,
            filterSearch: true,
            filters: Array.from(
                new Set(downloadableUserList.map((e) => e?.location))
            ).map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),
            onFilter: (value, record) => {
                if (value) {
                    return record.location.startsWith(value);
                }
                if (value === "") {
                    return record.location === value;
                }
                return false;
            },
            render: (location, record) =>
                record.key === selectedId ? (
                    <Input
                        defaultValue={location}
                        onChange={(e) => {
                            setShowBtn(true);
                            setLoaction(e.target.value);
                        }}
                        placeholder="Enter Location"
                    />
                ) : (
                    <div
                        style={{
                            overflowX: "scroll",
                        }}
                    >
                        {location}
                    </div>
                ),
        },
        {
            title: "Integrations",
            dataIndex: "integrations",
            key: "integrations",
            width: 150,
            ellipsis: true,
            // ...getColumnSearchProps('integrations'),
            filterSearch: true,
            filters: Array.from(
                new Set(
                    downloadableUserList.map((e) => {
                        return e?.integrations.length;
                    })
                )
            ).map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),
            onFilter: (value, record) => record.integrations.length === value,
            render: (integrations, record) => (
                <div className="flex justifyCenter">
                    {!!integrations?.length ? (
                        <Tooltip
                            destroyTooltipOnHide={{ keepParent: false }}
                            title={
                                <ul className="marginB0 paddingL16">
                                    {integrations.map((a, idx) => (
                                        <li key={uid() + idx}>
                                            {a.charAt(0).toUpperCase() +
                                                a.substr(1)}
                                        </li>
                                    ))}
                                </ul>
                            }
                            color={colors[getRandomInt(0, 11)]}
                        >
                            <Badge count={integrations?.length} showZero />
                        </Tooltip>
                    ) : (
                        <Badge count={integrations?.length} showZero />
                    )}
                </div>
            ),
        },
        {
            title: "Con. Device",
            dataIndex: "android_details",
            key: "android_details",
            width: 150,

            ellipsis: true,
            // ...getColumnSearchProps('integrations'),
            render: (android_details, record) => {
                const isOnline =
                    android_details &&
                    new Date().getTime() -
                        Math.max(
                            android_details?.last_meeting_time,
                            android_details?.sync_time
                        ) <
                        60 * 60 * 1000;
                return android_details ? (
                    <Popover
                        overlayClassName={"heatmap__stat--popover"}
                        destroyTooltipOnHide={{ keepParent: false }}
                        content={
                            <div className="heatmap__stat--popoverWrapper">
                                <p className="font16 bold600 mine_shaft_cl">
                                    Device Info
                                </p>

                                <p className="font13 paddingB5 srchSummary__stats">
                                    <span className="text-bold">
                                        Model Name:&nbsp;
                                    </span>
                                    <span>
                                        {" "}
                                        {android_details.device_info?.model ||
                                            "nill"}
                                    </span>
                                </p>
                                <p className="font13 paddingB5 srchSummary__stats">
                                    <span className="text-bold">
                                        OS Version:&nbsp;
                                    </span>
                                    <span>
                                        {android_details.installed_app_info
                                            ?.version_name || "nill"}
                                    </span>
                                </p>
                                <p className="font13 paddingB5 srchSummary__stats">
                                    <span className="text-bold">
                                        Last Seen:&nbsp;
                                    </span>
                                    <span>
                                        {getDateTime(
                                            Number(android_details.sync_time)
                                        )}
                                    </span>
                                </p>
                                <p className="font13 paddingB5 srchSummary__stats">
                                    <span className="text-bold">
                                        Last Meeting Time:&nbsp;
                                    </span>
                                    <span>
                                        {getDateTime(
                                            Number(
                                                android_details.last_meeting_time
                                            )
                                        )}
                                    </span>
                                </p>
                                <p className="font13 paddingB5 srchSummary__stats">
                                    <span className="text-bold">
                                        Status:&nbsp;
                                    </span>
                                    <span
                                        style={{
                                            color: isOnline
                                                ? "#76b95c"
                                                : "#ff6365",
                                        }}
                                    >
                                        {isOnline ? "Online" : "Offline"}
                                    </span>
                                </p>
                                {record?.android_extra_details &&
                                    Object.keys(
                                        record?.android_extra_details
                                    ).map((key, idx) => {
                                        return typeof record
                                            ?.android_extra_details?.[key] ===
                                            "string" ? (
                                            <>
                                                <p
                                                    className="font13 paddingB5 srchSummary__stats"
                                                    key={idx}
                                                >
                                                    <span className="text-bold">
                                                        {key}:&nbsp;
                                                    </span>
                                                    <span>
                                                        {
                                                            record
                                                                ?.android_extra_details?.[
                                                                key
                                                            ]
                                                        }
                                                    </span>
                                                </p>
                                            </>
                                        ) : null;
                                    })}
                            </div>
                        }
                        placement={"left"}
                        trigger={"hover"}
                    >
                        <div className="flex justifyCenter">
                            <div className="android_info_btn">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z"
                                        stroke={`${
                                            isOnline ? "#76b95c" : "#ff6365"
                                        }`}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 18H12.01"
                                        stroke={`${
                                            isOnline ? "#76b95c" : "#ff6365"
                                        }`}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                <span className="marginL4 marginT2 dove_gray_cl">
                                    Info
                                </span>
                            </div>
                        </div>
                    </Popover>
                ) : (
                    <div className="flex justifyCenter">
                        <span>Not Connected</span>
                    </div>
                );
            },
        },
        {
            title: "is Active",
            dataIndex: "is_active",
            key: "is_active",
            width: 80,
            ellipsis: true,
            filterSearch: true,
            filters: ["Active", "Deactive"].map((e) => {
                return {
                    text: e,
                    value: e,
                };
            }),
            onFilter: (value, record) => {
                if (value === "Active") return record.is_active === true;
                if (value === "Deactive") return record.is_active === false;
            },
            render: (is_active, record) => (
                <Switch
                    defaultChecked={is_active}
                    onChange={(checked) => {
                        dispatch(changeUserActive(record.key, checked));
                    }}
                    disabled={
                        record.key === userId || record.key === selectedId
                            ? false
                            : true
                    }
                />
            ),
            fixed: "right",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: 60,
            ellipsis: true,
            render: (action, record) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {showBtn && record.key === selectedId ? (
                            <Button
                                onClick={() => saveData(record)}
                                size="small"
                            >
                                Save
                            </Button>
                        ) : (
                            <Popover
                                className="usertable_Popover"
                                placement="bottomRight"
                                title={"Selected Option"}
                                overlayClassName={
                                    "sampling_rule_more_options_popover"
                                }
                                open={
                                    record.key === activeRecord &&
                                    moreOptionsVisible
                                }
                                onOpenChange={(visible) =>
                                    setMoreOptionsVisible(visible)
                                }
                                content={
                                    <>
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div
                                                className="option "
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedId(record.key);
                                                    setMoreOptionsVisible(
                                                        false
                                                    );
                                                }}
                                            >
                                                edit
                                            </div>
                                            <div
                                                className="option "
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMoreOptionsVisible(
                                                        false
                                                    );
                                                    showModal();
                                                }}
                                            >
                                                Change Password
                                            </div>
                                        </div>
                                    </>
                                }
                                trigger="click"
                            >
                                {isEditPermissionEnable ? (
                                    <MoreSvg
                                        onClick={() => {
                                            setActiveRecord(record.key);
                                        }}
                                    />
                                ) : (
                                    <Tooltip
                                        placement="topRight"
                                        title={"you don't have permission"}
                                    >
                                        <MoreSvg />
                                    </Tooltip>
                                )}
                            </Popover>
                        )}
                    </div>
                );
            },
            fixed: "right",
        },
    ];
    return (
        <>
            <Table
                columns={columns}
                dataSource={downloadableUserList}
                // pagination={{ position: ['topRight'] }}
                loading={loading}
                scroll={{ x: 1300 }}
                bordered
                size="small"
            />
            <Modal
                title="Change Password"
                className="resetPasswordModal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={600}
                footer={[]}
            >
                <Form onFinish={onFinish} form={form}>
                    <div className="font16 bold400 marginB13">New Password</div>
                    <Form.Item
                        name="newPassword"
                        rules={[{ validator: validateConfirmPassword }]}
                    >
                        <Input.Password
                            placeholder="New Password"
                            type="password"
                            size="large"
                            className="borderRadius10"
                            style={{
                                background: "rgba(153, 153, 153, 0.1)",
                            }}
                        />
                    </Form.Item>
                    <div className="font16 bold400 marginB13">
                        Enter Confirm New Password
                    </div>

                    <Form.Item
                        name="confirmNewPassword"
                        dependencies={["password"]}
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your password",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("newPassword") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        "Passwords does not match"
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Confirm New Password"
                            type="password"
                            size="large"
                            className="borderRadius10"
                            style={{
                                background: "rgba(153, 153, 153, 0.1)",
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <div className="flex justifyCenter alignCenter">
                            <Button
                                type="primary"
                                className="flex alignCenter borderRadius6 paddingLR30 paddingTB20 "
                                htmlType="submit"
                            >
                                Change Password
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

const formatDate = (inputDateString) => {
    // Create a new Date object from the input date string
    if (!inputDateString) return null;
    const date = new Date(inputDateString);

    // Get the month, day, and year components from the Date object
    const month = date.toLocaleString("en-us", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    // Create the formatted date string
    const formattedDateString = `${month} ${day}, ${year}`;

    return formattedDateString; // Output: "Dec 12, 2019"
};
