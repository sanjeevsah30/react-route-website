// File for the subnav for the User Settings Area.

import { uid } from "@tools/helpers";
import React from "react";

export default function StatsSubNav(props) {
    const userHasAccess = props.userHasAccess ? props.userHasAccess : false; // Show protected routes or not.
    const activeTab = props.activeTab ? props.activeTab : 0;

    const tabsToRender = props.tabs.map((tab, index) => {
        if (!tab) {
            return <></>;
        }
        if (tab.protected) {
            // If the tab is to be shown only to special users.

            return userHasAccess ? (
                <div
                    className={`subnav-option ${tab.class}`}
                    onClick={() => props.handleActiveTab(index)}
                    key={uid() + index}
                >
                    <div
                        className={`${
                            index === activeTab
                                ? "settings-subnav-option-label subnav-option-label active"
                                : "settings-subnav-option-label subnav-option-label"
                        }`}
                    >
                        <button className="accessibility" type="button">
                            {tab.tabName}
                        </button>
                    </div>
                    {index === activeTab && (
                        <span className="subnav-option-active"></span>
                    )}
                </div>
            ) : (
                ""
            );
        } else {
            return (
                <div
                    className={`subnav-option ${tab.class}`}
                    onClick={() => props.handleActiveTab(index)}
                    key={index}
                >
                    <div
                        className={`${
                            index === activeTab
                                ? "settings-subnav-option-label subnav-option-label active"
                                : "settings-subnav-option-label subnav-option-label"
                        }`}
                    >
                        <button className="accessibility" type="button">
                            {tab.tabName}
                        </button>
                    </div>
                    {index === activeTab && (
                        <span className="subnav-option-active"></span>
                    )}
                </div>
            );
        }
    });

    return <div className="stats-subnav-container ">{tabsToRender}</div>;
}
