import React from "react";
import { Button } from "antd";
import settingsConfig from "@constants/Settings/index";
import routes from "@constants/Routes/index";
import { withRouter } from "react-router-dom";

function NoMeetingsFound({ history, desc, showCTA }) {
    const redirectToIntegrate = () => {
        localStorage.setItem(settingsConfig.SUBNAV, 3);
        history.push(routes.SETTINGS);
    };
    return (
        <div style={{ width: 400 }} className="text-center">
            <img
                src={require("../../static/images/noMeetings.png").default}
                alt="no meetings"
            />
            <div className="font18 bold600 mine_shaft_cl">
                No Meetings Found.
            </div>
            <p className="font14 marginTB12">{desc}</p>
            {!!showCTA && (
                <Button
                    className="borderRadius5"
                    type="primary"
                    onClick={redirectToIntegrate}
                >
                    Connect Now
                </Button>
            )}
        </div>
    );
}

export default withRouter(NoMeetingsFound);
