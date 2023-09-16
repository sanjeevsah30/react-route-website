// File containing the Functional Top Navigation bar.

import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import TopbarUI from "@presentational/Navigation/TopbarUI";
const Topbar = (props) => {
    const [showSideDrawer, setshowSideDrawer] = useState(false);

    const handleDrawer = (status) => {
        setshowSideDrawer(status);
    };

    return (
        <TopbarUI
            isCallActive={props.isCallActive}
            removeActiveCall={props.removeActiveCall}
            activeCall={props.activeCall}
            activePageConfig={props.activePageConfig}
            uploadHandler={props.callHandlers.handleUpload}
            scheduleHandler={props.callHandlers.handleJoinCall}
            currentActiveDate={props.currentActiveDate}
            handleDrawer={handleDrawer}
            showSideDrawer={showSideDrawer}
        />
    );
};

export default withRouter(Topbar);
