import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Result } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getInvitedUsers, sendReminder } from "@store/settings/actions";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import { USER_TYPES } from "@store/initialState";

export default function InvitedUsersTable() {
    const dispatch = useDispatch();
    const searchInput = useRef(null);
    const users = useSelector((state) => state.settings.invited);
    const allRoles = useSelector((state) => state.role_manager.roles);
    const allTeams = useSelector((state) => state.common.teams);
    const [searchUser, setSearchUser] = useState({
        searchText: "",
        searchedColumn: "",
    });
    const [tableData, setTableData] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const { available_subscriptions } = useSelector((state) => state.settings);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ width: 188, marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    fontSize: "1.25rem",
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                      .toString()
                      .toLowerCase()
                      .includes(value.toLowerCase())
                : "",
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(
                    () =>
                        searchInput.current
                            ? searchInput.current.select()
                            : null,
                    100
                );
            }
        },
        render: (text) =>
            searchUser.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchUser.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchUser({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchUser((state) => ({ ...state, searchText: "" }));
    };

    useEffect(() => {
        if (!users.length) {
            setLoadingUsers(true);
            dispatch(getInvitedUsers()).then(() => {
                setLoadingUsers(false);
            });
        }
    }, []);

    useEffect(() => {
        if (users.length) {
            const data = users.map((user) => ({
                key: user.id,
                email: user.email,
                role: user.role,
                team: user.team,
                invitation_id: user.invitation_id,
                user_type: user.user_type,
                license: user.subscription,
            }));
            setTableData(data);
        }
    }, [users]);

    const columns = [
        {
            title: "Email Address",
            dataIndex: "email",
            key: "email",
            width: 80,
            ellipsis: true,
            ...getColumnSearchProps("email"),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            width: 80,
            ellipsis: true,
            render: (role, record) => {
                return (
                    <span className="uppercase">
                        {allRoles.find(({ id }) => id === role)?.name}
                    </span>
                );
            },
        },
        {
            title: "Team",
            dataIndex: "team",
            key: "team",
            width: 80,
            ellipsis: true,
            render: (team, record) => {
                return (
                    <span className="uppercase">
                        {allTeams.find(({ id }) => id === team)?.name ||
                            "Default"}
                    </span>
                );
            },
        },
        {
            title: "User Type",
            dataIndex: "user_type",
            key: "user_type",
            width: 80,
            ellipsis: true,
            render: (user_type, record) => {
                return (
                    <span className="uppercase">
                        {user_type === USER_TYPES.product
                            ? "Product User"
                            : "Observer"}
                    </span>
                );
            },
        },
        {
            title: "License",
            dataIndex: "license",
            key: "license",
            width: 80,
            ellipsis: true,
            render: (license, record) => {
                return (
                    <span className="uppercase">
                        {available_subscriptions.find(
                            ({ subscription_id }) => subscription_id === license
                        )?.subscription_type || "Free"}
                    </span>
                );
            },
        },
        {
            title: "Remind",
            key: `remind`,
            width: 80,
            ellipsis: true,
            render: (team, record) => (
                <Button
                    type="link"
                    icon={<SendOutlined />}
                    onClick={() => {
                        dispatch(sendReminder(record.invitation_id));
                    }}
                >
                    Send Reminder
                </Button>
            ),
        },
    ];
    let locale = {
        emptyText: loadingUsers ? (
            ""
        ) : (
            <Result
                icon={<SmileOutlined />}
                title={"No pending invitations🎉"}
            />
        ),
    };
    return (
        <Table
            columns={columns}
            dataSource={tableData}
            pagination={{ position: ["topRight"] }}
            loading={loadingUsers}
            scroll={{ y: 550, x: "90%" }}
            bordered
            size="small"
            locale={locale}
        />
    );
}
