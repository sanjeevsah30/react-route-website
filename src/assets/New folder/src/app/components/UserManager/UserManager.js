import "./styles.scss";
import {
    allDesignation,
    getAvailableSubscription,
} from "@store/settings/actions";
import { Button, Input, Popover, Tooltip, Typography } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateUserModal from "./CreateUserModal";
import UserTable from "./UserTable";
import InvitedUsersTable from "./InvitedUsersTable";
import { getSubscriptions } from "@store/billing/billing";
import SearchSvg from "app/static/svg/SearchSvg";
import DownloadSvg from "app/static/svg/DownloadSvg";
import { getLocaleDate } from "@tools/helpers";
import ExcelSvg from "app/static/svg/ExcelSvg";
import { getUserMangerList } from "@store/userManagerSlice/userManagerSlice";
import { getRoles } from "@store/roleManager/role_manager.store";
import BulkUploadUsersModal from "./BulkUploadUsersModal";
import { getDateTime } from "tools/helpers";
const { Title } = Typography;

export default function UserManager() {
    const dispatch = useDispatch();
    const { designations } = useSelector((state) => state.settings);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { allUsers } = useSelector((state) => state.userManagerSlice);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const { loading } = useSelector((state) => state.userManagerSlice);

    // fake comment
    useEffect(() => {
        if (!allUsers.length) {
            dispatch(getUserMangerList());
        }
        dispatch(getRoles());
    }, []);
    useEffect(() => {
        if (!designations.length) {
            dispatch(allDesignation());
        }

        dispatch(getAvailableSubscription());
        dispatch(getSubscriptions());
    }, []);

    const handleCreateUserModal = (status) => {
        setShowCreateModal(status);
    };

    const {
        common: { versionData },
    } = useSelector((state) => state);

    const [searchTerm, setSearchTerm] = useState("");

    const childRef = useRef(null);
    const removeSelectedId = (value) => {
        childRef.current.selectedId(value);
    };

    const [downloadableUserList, setDownloadableUserList] = useState([]);

    const downloadUserData = () => {
        if (!allUsers.length) return;
        const csvData = allUsers.map((user) => {
            return {
                "First Name": user.first_name.split(",").join(" ") || "",
                "Last Name": user.last_name || "",
                Email: user.email,

                "User ID": String(user.primary_phone || ""),

                "Organization Joining Date": user?.org_date_joined
                    ? getDateTime(user.org_date_joined, undefined, "/")
                    : "",

                "Supervisor Email ID": user.manager?.email || "",
                Role: user?.role?.name || "",
                Team:
                    user?.team?.group !== null
                        ? user.team.group.name
                        : user?.team?.name,
                "Sub Team": user?.team?.group === null ? "" : user?.team?.name,
                "User Type (Observer/Product User)": user?.user_type
                    ? "Product User"
                    : "Observer",
                Location: user.loaction,
                "WhatsApp Number": user.phone,
                "Active/In Active": user.is_active ? "Active" : "In Active",
            };
        });

        let csv = "";
        let header = Object?.keys?.(csvData?.[0])?.join(",");
        let values = csvData
            ?.map?.((o) => Object?.values?.(o)?.join(","))
            ?.join("\n");
        csv = header + "\n" + values;
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "users.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <>
            <div className="userMgr">
                <div
                    className="flex justifySpaceBetween"
                    style={{ paddingBottom: 25 }}
                >
                    <Title level={4}>Manage Active Users</Title>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Input
                            size="default"
                            placeholder="Search for Name and Email Address"
                            prefix={<SearchSvg />}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={() => removeSelectedId(0)}
                            allowClear={true}
                            style={{
                                marginRight: "20px",
                                borderRadius: "6px",
                            }}
                        />

                        <Popover
                            className="usertable_Popover"
                            placement="bottomRight"
                            overlayClassName={
                                "sampling_rule_more_options_popover"
                            }
                            open={open}
                            onOpenChange={setOpen}
                            // onOpenChange={
                            // }
                            content={
                                <>
                                    <div>
                                        <div
                                            className="option "
                                            onClick={() => {
                                                handleCreateUserModal(true);
                                                setOpen(false);
                                            }}
                                        >
                                            {versionData?.domain_type === "b2c"
                                                ? "Create User"
                                                : "Invite User"}
                                        </div>
                                        <div
                                            className="option "
                                            onClick={() => {
                                                ref?.current?.openBulkUpladUserModal?.();
                                                setOpen(false);
                                            }}
                                        >
                                            Upload User Data
                                        </div>
                                    </div>
                                </>
                            }
                            trigger="click"
                        >
                            <Button
                                type="primary"
                                className="borderR4 marginR16"
                                onClick={() => {
                                    setOpen(true);
                                }}
                                disabled={loading}
                                loading={loading}
                            >
                                + User
                            </Button>
                        </Popover>

                        {versionData?.domain_type === "b2c" && (
                            <Tooltip title="Download User Data">
                                <Button
                                    type="text"
                                    loading={loading}
                                    style={{
                                        height: "100%",
                                    }}
                                >
                                    <DownloadSvg
                                        className="padding5"
                                        style={{
                                            background:
                                                "rgba(153, 153, 153, 0.2)",
                                            borderRadius: "6px",
                                        }}
                                        onClick={downloadUserData}
                                        disabled={loading}
                                    />
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                </div>
                <div className="appendBottom20 paddingTop20">
                    <UserTable
                        searchTerm={searchTerm}
                        childRef={childRef}
                        setDownloadableUserList={setDownloadableUserList}
                        downloadableUserList={downloadableUserList}
                    />
                </div>
                {showCreateModal && (
                    <CreateUserModal
                        handleCreateUserModal={handleCreateUserModal}
                        showCreateModal={showCreateModal}
                    />
                )}
            </div>
            <div className="userMgr">
                <div className="flex justifySpaceBetween">
                    <Title level={4}>Manage Invited Users</Title>
                </div>
                <InvitedUsersTable />
            </div>
            <BulkUploadUsersModal
                ref={ref}
                downloadUserData={downloadUserData}
            />
        </>
    );
}
