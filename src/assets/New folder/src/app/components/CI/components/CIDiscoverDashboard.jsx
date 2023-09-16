import React from "react";
import CIDiscoverStats from "./CIDiscover/CIDiscoverStats";
import CIWordCloud from "./CIDiscover/CIWordCloud";

export default function CIDiscoverDashboard() {
    return (
        <div className="ci__discover__dashboard">
            <div className="box height100p wordCloudContainer">
                <CIWordCloud />
            </div>
            <div className="box height100p stats overflowYscroll">
                <CIDiscoverStats />
            </div>
        </div>
    );
}
