import React, { useState, useEffect } from "react";
import SidebarUI from "@presentational/Navigation/SidebarUI";
import { useLocation } from "react-router";

const Sidebar = ({ activeTypes, notificationCount, handleClick }) => {
    const [activeKey, setActiveKey] = useState("");

    useEffect(() => {
        for (const key of Object.keys(activeTypes)) {
            if (activeTypes[key]) {
                setActiveKey(key);
            }
        }
    }, [activeTypes]);

    const search = useLocation().search;
    const widget = new URLSearchParams(search).get("widget");

    return (
        <>
            {widget ? (
                ""
            ) : (
                <SidebarUI
                    activeKey={activeKey}
                    notificationCount={notificationCount}
                    handleClick={handleClick}
                />
            )}
        </>
    );
};

export default Sidebar;
