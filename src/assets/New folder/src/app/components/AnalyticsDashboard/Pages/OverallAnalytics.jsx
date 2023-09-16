import Statistics from "@container/Statistics/Statistics";
import React, { useEffect } from "react";
import OverallParameterAnalytics from "../Components/OverallParameterAnalytics";
import OverallPieLineAnalitics from "../Components/OverallPieLineAnalitics";
import OverallRepLevelAnalytics from "../Components/OverallRepLevelAnalytics";
import OverallTeamLevelAnalytics from "../Components/OverallTeamLevelAnalytics";
import SectionHeader from "../Components/SectionHeader";
import { report_types } from "../Constants/dashboard.constants";
import OverallViolationAnalytics from "../Components/OverallViolationAnalytics";
import OverallLeadAnalysis from "../Components/OverallLeadAnalysis";
import AuditDashboardAnalytics from "../Components/AuditDashboardAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { setActiveRep, setActiveTeam } from "@store/common/actions";

export default function OverallAnalytics() {
    const dispatch = useDispatch();
    const {
        common: { filterTeams, filterReps },
    } = useSelector((state) => state);

    useEffect(() => {
        if (!filterReps.active.length === 0) dispatch(setActiveRep([]));
        if (!filterTeams.active.length === 0) dispatch(setActiveTeam([]));
    }, []);

    return (
        <div className="analysis__dashboard ">
            {/*  Overall Analysis */}
            <div className="overall__analysis__section posRel">
                <OverallPieLineAnalitics />
                <div className="team__level__analytics marginTB16">
                    <SectionHeader
                        title="Statistics"
                        showSeeDetails={false}
                        report_type={report_types.statistics}
                    />
                    <Statistics />
                </div>

                <OverallTeamLevelAnalytics />
                <OverallRepLevelAnalytics />
                <AuditDashboardAnalytics />
                <OverallParameterAnalytics />
                <OverallViolationAnalytics />
                <OverallLeadAnalysis />
            </div>
        </div>
    );
}
