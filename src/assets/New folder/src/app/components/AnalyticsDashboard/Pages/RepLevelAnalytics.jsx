import Statistics from "@container/Statistics/Statistics";
import { setActiveRep, setActiveTeam } from "@store/common/actions";
import { clearReports } from "@store/dashboard/dashboard";
import {
    clearDefaultReports,
    getDefaultReports,
} from "@store/scheduledReports/scheduledReports";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OverallLeadAnalysis from "../Components/OverallLeadAnalysis";
import OverallParameterAnalytics from "../Components/OverallParameterAnalytics";
import OverallPieLineAnalitics from "../Components/OverallPieLineAnalitics";
import OverallRepLevelAnalytics from "../Components/OverallRepLevelAnalytics";
import OverallTeamLevelAnalytics from "../Components/OverallTeamLevelAnalytics";
import OverallViolationAnalytics from "../Components/OverallViolationAnalytics";
import SectionHeader from "../Components/SectionHeader";
import TemporaryComp from "../Components/TemporaryComp";
import { report_types } from "../Constants/dashboard.constants";

export default function RepLevelAnalytics() {
    const dispatch = useDispatch();
    const [isMount, setIsMount] = useState(true);
    const {
        common: { filterReps },
        scheduled_reports: { default_reports },
        auth,
    } = useSelector((state) => state);

    useEffect(() => {
        let payload = { dashboard: "rep_analysis" };
        dispatch(getDefaultReports(payload));

        setIsMount(true);
        if (filterReps?.active?.length === 0 && filterReps?.reps[1]?.id !== 0) {
            dispatch(setActiveRep([auth.id]));
            dispatch(setActiveTeam([auth.team]));
        }
        return () => {
            dispatch(clearDefaultReports());
            dispatch(clearReports());
            setIsMount(false);
        };
    }, []);

    return (
        <div className="team_level analysis__dashboard">
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
                {filterReps.active.length ? (
                    <></>
                ) : (
                    <OverallRepLevelAnalytics showSeeDetails={false} />
                )}
                <OverallParameterAnalytics />
                <OverallViolationAnalytics />
                <OverallLeadAnalysis />
                {isMount && !!default_reports?.data?.length && (
                    <div>
                        <SectionHeader title="Reports" defaultHeader={false} />
                        {default_reports?.data?.map((item, index) => (
                            <TemporaryComp
                                item={item}
                                index={index}
                                key={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
