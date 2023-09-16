import React from "react";

export default function BillingTabs({ tabs, activeTab, handleActiveTab }) {
    return (
        <ul className="app__billing--tabs">
            {tabs?.map((tab) => (
                <li
                    key={tab.id}
                    onClick={() => {
                        handleActiveTab(tab.id);
                    }}
                    className={activeTab === tab.id ? "active" : ""}
                >
                    {tab.value}
                </li>
            ))}
        </ul>
    );
}
