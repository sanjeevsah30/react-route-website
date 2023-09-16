import React, { useEffect, useState } from "react";
import {
    UpOutlined,
    PhoneFilled,
    LineChartOutlined,
    ReadOutlined,
    SettingFilled,
    LogoutOutlined,
    QuestionOutlined,
    FilterFilled,
} from "@ant-design/icons";

import "./mobileDrawer.scss";
import { Drawer } from "antd";
import sidebarConfig from "@constants/Sidebar/index";
import ReportSvg from "app/static/svg/ReportSvg";
export default function MobileDrawer({ activeTypes, handleClick }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeKey, setActiveKey] = useState("");

    // useEffect(() => {
    //     for (const key of Object.keys(activeTypes)) {
    //         if (activeTypes[key]) {
    //             setActiveKey(key);
    //         }
    //     }
    // }, [activeTypes]);

    const handleTileClick = (key) => {
        handleClick(key);
        setDrawerOpen(false);
    };

    return (
        <div className="bottomDrawer boxShadow displayMobile">
            <div
                className="btnContainer boxShadow"
                onClick={() => setDrawerOpen(true)}
            >
                <UpOutlined />
            </div>
            <Drawer
                placement="bottom"
                closable={true}
                onClose={() => setDrawerOpen(false)}
                visible={drawerOpen}
                width={window.innerWidth}
            >
                <div className="bottom_navigation flex">
                    <div
                        className={`bottom_navigation--tile boxShadow ${
                            activeKey === sidebarConfig.BTNTYPE_PHONE
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleTileClick(sidebarConfig.BTNTYPE_PHONE)
                        }
                    >
                        <PhoneFilled />
                        <span>{sidebarConfig.PHONE_TITLE}</span>
                    </div>
                    {/* <div
                        className={`bottom_navigation--tile boxShadow ${
                            activeKey === sidebarConfig.BTNTYPE_SEARCH
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            handleTileClick(sidebarConfig.BTNTYPE_SEARCH)
                        }
                    >
                        <SearchOutlined />
                        <span>{sidebarConfig.SEARCH_TITLE}</span>
                    </div> */}
                    <div
                        className={`bottom_navigation--tile boxShadow ${
                            activeKey === sidebarConfig.BTNTYPE_STATISTICS
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleTileClick(sidebarConfig.BTNTYPE_STATISTICS)
                        }
                    >
                        <LineChartOutlined />
                        <span>{sidebarConfig.STATISTICS_TITLE}</span>
                    </div>
                    <div
                        className={`bottom_navigation--tile boxShadow ${
                            activeKey === sidebarConfig.BTNTYPE_LIBRARY
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleTileClick(sidebarConfig.BTNTYPE_LIBRARY)
                        }
                    >
                        <ReadOutlined />
                        <span>{sidebarConfig.LIBRARY_TITLE}</span>
                    </div>
                    <div
                        className={`bottom_navigation--tile boxShadow ${
                            activeKey === sidebarConfig.BTNTYPE_CALL_FILTER
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleTileClick(sidebarConfig.BTNTYPE_CALL_FILTER)
                        }
                    >
                        <FilterFilled />
                        <span>{sidebarConfig.AI_AUDIT_DASHBOARD_TITLE}</span>
                    </div>
                    <div
                        className={`bottom_navigation--tile boxShadow ${
                            activeKey === sidebarConfig.BTNTYPE_SETTINGS
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleTileClick(sidebarConfig.BTNTYPE_SETTINGS)
                        }
                    >
                        <SettingFilled />
                        <span>{sidebarConfig.SETTINGS_TITLE}</span>
                    </div>

                    <div
                        className={`bottom_navigation--tile boxShadow ${
                            activeKey === sidebarConfig.BTNTYPE_HELP
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleTileClick(sidebarConfig.BTNTYPE_HELP)
                        }
                    >
                        <QuestionOutlined />
                        <span>{sidebarConfig.HELP_TITLE}</span>
                    </div>
                    <div
                        className="bottom_navigation--tile boxShadow logout-user"
                        onClick={() =>
                            handleTileClick(sidebarConfig.BTNTYPE_LOGOUT)
                        }
                    >
                        <LogoutOutlined />
                        <span>{sidebarConfig.LOGOUT_TITLE}</span>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
