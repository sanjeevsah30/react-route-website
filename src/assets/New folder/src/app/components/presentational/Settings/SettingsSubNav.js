// File for the subnav for the User Settings Area.

import React, { Fragment, useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useSelector } from "react-redux";
import ChevronDownSvg from "../../../static/svg/ChevronDownSvg";
import { useHistory } from "react-router-dom";

const getTabName = (tab) => {
    // if (versionData?.domain_type !== 'b2c' && tab?.noAiAuditTabName) {
    //     return tab?.noAiAuditTabName;
    // }
    return tab.tabName;
};

export default function SettingsSubnav(props) {
    const activeTab = props.activeTab ? props.activeTab : 0;
    const versionData = useSelector((state) => state.common.versionData);
    const [tabOpen, setTabOpen] = useState({});
    const { Sider } = Layout;
    const handleTabClick = (tab) => {
        if (!tab.options) return;
        const key = getTabName(tab);
        const value = tabOpen[getTabName(tab)] ? false : true;
        setTabOpen({
            ...tabOpen,
            [key]: value,
        });
    };
    //List of tabs that we dont need to for B2B domains
    const tabDontShow = ["Sampling Manager"];
    return (
        <Sider className="site-settings" width={240}>
            <Menu
                onClick={(e) => {
                    props.handleActiveTab(+e.key);
                }}
                mode="inline"
                selectedKeys={[activeTab]}
                style={{ height: "100%" }}
            >
                {versionData?.domain_type === "b2b" ? (
                    <>
                        {props.tabs
                            .filter((e) => !tabDontShow.includes(e.tabName))
                            .map((tab, idx) => {
                                if (tab.protected) {
                                    const tabName = getTabName(tab);
                                    if (props.canAccess(tabName)) {
                                        return (
                                            <Menu.Item
                                                key={tab.tabIdx.toString()}
                                                className={tab.class}
                                            >
                                                {tabName}
                                            </Menu.Item>
                                        );
                                    } else {
                                        return null;
                                    }
                                } else {
                                    return (
                                        <Menu.Item
                                            key={tab.tabIdx.toString()}
                                            className={tab.class}
                                        >
                                            {getTabName(tab)}
                                        </Menu.Item>
                                    );
                                }
                            })}
                    </>
                ) : (
                    <>
                        {props.tabs.map((tab, idx) => {
                            if (tab.protected) {
                                const tabName = getTabName(tab);
                                if (props.canAccess(tabName)) {
                                    return (
                                        <Menu.Item
                                            key={tab.tabIdx.toString()}
                                            className={tab.class}
                                        >
                                            {tabName}
                                        </Menu.Item>
                                    );
                                } else {
                                    return null;
                                }
                            } else {
                                return (
                                    <Menu.Item
                                        key={tab.tabIdx.toString()}
                                        className={tab.class}
                                    >
                                        {getTabName(tab)}
                                    </Menu.Item>
                                );
                            }
                        })}
                    </>
                )}
            </Menu>
        </Sider>
    );
}

function DropDownIcon({ tab, tabOpen }) {
    if (!tab.options) return null;
    return (
        <ChevronDownSvg
            style={{
                marginLeft: "16px",
                transform: tabOpen[getTabName(tab)] ? "" : "rotateX(180deg)",
            }}
        />
    );
}

function MenuDropdown({ tab, visible }) {
    const history = useHistory();
    if (!visible || !tab.options) return null;
    return (
        <>
            <Menu style={{ minWidth: "100%", margin: 0, paddingLeft: "48px" }}>
                {tab.options.map((item, i) => (
                    <Menu.Item
                        key={i}
                        className="settings-container--suboptions"
                        style={{ height: "40px" }}
                        onClick={() => history.push(item.path)}
                    >
                        {item.tabName}
                    </Menu.Item>
                ))}
            </Menu>
        </>
    );
}
