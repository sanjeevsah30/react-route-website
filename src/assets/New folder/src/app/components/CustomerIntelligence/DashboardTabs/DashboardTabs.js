import { Button, Menu, Popconfirm, Tooltip } from "antd";
import React, { useState } from "react";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addTabsRequest } from "@store/ci/actions";
import AddTabModal from "../AddTabModal/AddTabModal";
import "../customerIntelligence.scss";
export default function DashboardTabs({
    tabList,
    onTabSelect,
    activeTab,
    onTabDelete,
}) {
    const dispatch = useDispatch();
    const [showAddTab, setShowAddTab] = useState(false);
    const [newTabTitle, setNewTabTitle] = useState("");
    const domain = useSelector((state) => state.common.domain);
    const handleNewTab = (value) => {
        setNewTabTitle(value);
    };
    const handleSubmitNewTab = () => {
        if (newTabTitle) {
            dispatch(
                addTabsRequest({
                    domain,
                    title: newTabTitle,
                })
            );
        }
        setNewTabTitle("");
        setShowAddTab(false);
        // onTabSelect({ key: newTab });
    };

    return (
        <div className="row borderBottom alignCenter">
            <Menu
                onClick={onTabSelect}
                selectedKeys={[activeTab]}
                mode="horizontal"
                className="tabs_container"
            >
                {tabList.map((tab, idx) => (
                    <Menu.Item key={tab.slug}>
                        {tab.is_removable ? (
                            <div
                                className={
                                    "flex alignCenter justifySpaceBetween"
                                }
                            >
                                <span>{tab.title}</span>
                                <Popconfirm
                                    title="Are you sure to delete this tab?"
                                    onConfirm={(evt) =>
                                        onTabDelete(evt, tab.id, tab.slug)
                                    }
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        icon={<CloseOutlined />}
                                        danger
                                        type="link"
                                    />
                                </Popconfirm>
                            </div>
                        ) : (
                            tab.title
                        )}
                    </Menu.Item>
                ))}
            </Menu>
            <div className="flexImp justifyEnd newDashboardBtn">
                <Tooltip destroyTooltipOnHide title={"Create new dashboard"}>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        shape="rectangle"
                        onClick={() => setShowAddTab(true)}
                    ></Button>
                </Tooltip>
            </div>
            <AddTabModal
                onCancel={() => setShowAddTab(false)}
                onOk={() => handleSubmitNewTab()}
                isVisible={showAddTab}
                handleChange={handleNewTab}
                tabName={newTabTitle}
            />
        </div>
    );
}
