import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { dashboardRoutes } from "../Constants/dashboard.constants";
import { useDispatch } from "react-redux";
import { changeActiveTeam } from "@store/common/actions";

export default function useDashboardNavigation() {
    const location = useLocation();
    const history = useHistory();

    const {
        common: { filterTeams, filterReps },
    } = useSelector((state) => state);

    const dispatch = useDispatch();

    useEffect(() => {
        if (
            (location.pathname !== dashboardRoutes.home &&
                location.pathname !== dashboardRoutes.team &&
                location.pathname !== dashboardRoutes.rep) ||
            location.pathname.includes("coaching")
        ) {
            return;
        }
        // Overall Dashboard Navigation
        if (filterReps.active.length === 1)
            return history.push(dashboardRoutes.rep);

        if (location.pathname === dashboardRoutes.home) {
            if (filterTeams.active.length >= 1)
                return history.push(dashboardRoutes.team);
        }

        //Teamlevel Dashboard Navigation
        if (location.pathname === dashboardRoutes.team) {
        }

        // Replevel Dashboard Navigation
        if (location.pathname === dashboardRoutes.rep) {
            if (filterReps.active.length === 0 && filterReps.reps?.length) {
                dispatch(changeActiveTeam([]));
                return history.push(dashboardRoutes.team);
            }
            if (filterReps.active.length > 1) {
                const teamIds = filterReps.active.map(
                    (id) => filterReps.reps.find((e) => e.id === id)?.team
                );
                dispatch(changeActiveTeam([...new Set(teamIds)]));
                return history.push(dashboardRoutes.team);
            }
        }
    }, [filterTeams.active, filterReps.active]);
    return [];
}
