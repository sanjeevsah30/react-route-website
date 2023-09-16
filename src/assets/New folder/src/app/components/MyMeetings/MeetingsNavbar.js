import callsConfig from "@constants/MyCalls/index";
import { Button, Menu } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import React from "react";

import SideMenu from "./SideMenu";

export default function MeetingsNavbar(props) {
    return (
        <>
            <Menu
                onClick={props.handleClick}
                selectedKeys={[props.activeMenu]}
                mode="horizontal"
                className={"flex1"}
            >
                <Menu.Item key={callsConfig.COMPLETED_TYPE}>
                    {callsConfig.COMPLETED}
                </Menu.Item>
                <Menu.Item key={callsConfig.UPCOMING_TYPE}>
                    {callsConfig.UPCOMING}
                </Menu.Item>
            </Menu>
            {props.isSideMenuActive && (
                <SideMenu
                    handleClick={props.handleSearchToggle}
                    activeMenu={props.activeSidebarView}
                />
            )}
            <div className="displayMobile alignCenter">
                <Button
                    icon={<SearchOutlined />}
                    type="link"
                    onClick={props.openDrawer}
                />
            </div>
        </>
    );
}
