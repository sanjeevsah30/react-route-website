import { Input } from "antd";
import React from "react";

export default function Tabs({
    handleActiveTab,
    tabs,
    activeTab,
    findInTranscript,
}) {
    return (
        <div className="preview__tabs">
            <ul className="preview__tabs--items">
                {tabs.map((tab) => (
                    <li
                        key={tab.key}
                        className={tab.key === activeTab ? "active" : ""}
                        onClick={() => handleActiveTab(tab)}
                    >
                        {tab.label}
                    </li>
                ))}
            </ul>
            <Input
                placeholder="Input text to search in transcript"
                allowClear
                onChange={findInTranscript}
            />
        </div>
    );
}
