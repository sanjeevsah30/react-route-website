import callsConfig from "@constants/MyCalls/index";
import { Menu } from "antd";
import React from "react";

export default function SideMenu({ handleClick, activeMenu }) {
    return (
        <Menu
            onClick={handleClick}
            selectedKeys={[activeMenu]}
            mode="horizontal"
            className={"width22 meetings_sidenav"}
        >
            <Menu.Item key={callsConfig.SEARCH_VIEW}>
                {callsConfig.SEARCH_VIEW}
            </Menu.Item>
            <Menu.Item key={callsConfig.TRACKER_VIEW}>
                {callsConfig.TRACKER_VIEW}
            </Menu.Item>
        </Menu>
    );
}
