import React from "react";

import TeamManagerUI from "@presentational/Settings/TeamManagerUI";
import Spinner from "@presentational/reusables/Spinner";
import { useSelector } from "react-redux";

const TeamManager = (props) => {
    const { team_manager } = useSelector((state) => state);
    return (
        <Spinner loading={team_manager.loading}>
            <TeamManagerUI />
        </Spinner>
    );
};

export default TeamManager;
