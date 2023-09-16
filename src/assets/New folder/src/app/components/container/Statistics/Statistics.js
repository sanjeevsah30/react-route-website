import React, { useState, useEffect, useContext } from "react";
import statisticsConfig from "@constants/Statistics/index";
import StatsSubNav from "@presentational/Statistics/StatsSubNav";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { openNotification, setActiveRep } from "@store/common/actions";
import { getIdLabelArray } from "@tools/helpers";
import { getStatsAggregations } from "@apis/statistics";
import apiErrors from "@apis/common/errors";
import InteractionsContainer from "./Interactions";
import { getIdealRanges } from "@store/stats/actions";
import withReactTour from "hoc/withReactTour";
import { getTopbarFilters, searchTagsFilters } from "@tools/searchFactory";
import withErrorCollector from "hoc/withErrorCollector";
import { compose } from "redux";
import {
    getOverallStatsGraph,
    getOverallStatsTiles,
} from "@apis/statistics/index";
import { HomeContext } from "@container/Home/Home";

const Activity = React.lazy(() => import("./Activity"));
const Topics = React.lazy(() => import("./Topics"));

function Statistics(props) {
    const dispatch = useDispatch();
    const domain = useSelector((state) => state.common.domain);
    const allReps = useSelector((state) =>
        state.common.users.map(({ id, first_name }) => {
            return { id, name: first_name };
        })
    );
    const idealRanges = useSelector((state) => state.stats.idealRanges);
    const filterTeams = useSelector((state) => state.common.filterTeams);
    const filterReps = useSelector((state) => state.common.filterReps);

    const filterCallDuration = useSelector(
        (state) => state.common.filterCallDuration
    );
    const filterDates = useSelector((state) => state.common.filterDates);

    const [activeTab, setActiveTab] = useState(
        localStorage.getItem(statisticsConfig.SUBNAV)
            ? parseInt(localStorage.getItem(statisticsConfig.SUBNAV))
            : statisticsConfig.SUBNAV_TABS.activity
    );
    const [allActiveRep, setallActiveRep] = useState(0);
    const { meetingType } = useContext(HomeContext);

    useEffect(() => {
        if (isEmpty(idealRanges)) {
            dispatch(getIdealRanges());
        }
        // dispatch(setActiveRep([]));
    }, []);

    const handlers = {
        handleLocalRep: (index) => {
            setallActiveRep(index);
            dispatch(setActiveRep([index]));
        },
        handleFilterRepChange: (index) => {
            dispatch(setActiveRep([index]));
        },
    };

    const {
        common: { versionData, activeCallTag },
    } = useSelector((state) => state);

    // common variables
    const dateArr = filterDates.dates[filterDates.active].dateRange;
    const startDate = dateArr[0] ? new Date(dateArr[0]) : null;
    const endDate = dateArr[1] ? new Date(dateArr[1]) : null;
    const teamId = filterTeams.active;
    const callDuration =
        filterCallDuration.options[filterCallDuration.active].value;

    const handleActiveTab = (tabIndex) => {
        setActiveTab(tabIndex);
        localStorage.setItem(statisticsConfig.SUBNAV, tabIndex);
    };

    const dataHandlers = {
        getSearchData: (rep) => {
            const topbarData = {
                repId: filterReps.active,
                teamId: teamId,
                startDate: startDate,
                endDate: endDate,
                callDuration: callDuration,
                // templateId: activeTemplate,
                meetingType: meetingType,
                hasChat: versionData?.has_chat,
            };

            return [
                ...getTopbarFilters(topbarData),
                ...searchTagsFilters(
                    activeCallTag.length ? activeCallTag : null
                ),
            ];
        },
        getStats: (fields, groupByTime, groupByOwner = false, rep) => {
            return getStatsAggregations(
                domain,
                fields,
                meetingType === "chat"
                    ? ["sum"]
                    : statisticsConfig.AGGREGATIONS,
                groupByTime,
                dataHandlers.getSearchData(rep),
                groupByOwner
            ).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                }
                return res;
            });
        },
        getStatsTiles: (fields, groupByTime, groupByOwner = false, rep) => {
            return getOverallStatsTiles(
                domain,
                fields,
                meetingType === "chat"
                    ? ["sum"]
                    : statisticsConfig.AGGREGATIONS,
                groupByTime,
                dataHandlers.getSearchData(rep),
                groupByOwner
            ).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                }
                return res;
            });
        },
        getStatsGraph: (fields, groupByTime, groupByOwner = false, rep) => {
            return getOverallStatsGraph(
                domain,
                fields,
                meetingType === "chat"
                    ? ["sum"]
                    : statisticsConfig.AGGREGATIONS,
                groupByTime,
                dataHandlers.getSearchData(rep),
                groupByOwner
            ).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                }
                return res;
            });
        },
    };

    return versionData.domain_type === "b2c" ? (
        // <div className="statistics-container view">
        <div
            className="statistics-container"
            style={{
                minHeight: "421px",
                border: "1px solid rgba(153, 153, 153, 0.2)",
                borderRadius: "8px",
            }}
        >
            <div
                className="view-container"
                style={{
                    height: `${versionData.domain_type === "b2c"}`
                        ? "490px"
                        : "560px",
                }}
            >
                <div
                    className=" statistics-custom content-container card "
                    style={{ boxShadow: "none" }}
                >
                    {!isEmpty(allReps) && (
                        <>
                            <Activity
                                teamId={teamId}
                                repsOptions={filterReps.reps}
                                activestatsRep={filterReps.active[0]}
                                handleRepsChange={
                                    teamId === 0
                                        ? handlers.handleLocalRep
                                        : handlers.handleFilterRepChange
                                }
                                repId={filterReps.active}
                                activeTeam={filterTeams.active}
                                dateArr={dateArr}
                                // callType={callType}
                                callDuration={callDuration}
                                // templateOptions={activeTemplate}
                                {...dataHandlers}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <div className="statistics-container view">
            <div className="view-container">
                <div className=" statistics-custom content-container card ">
                    <StatsSubNav
                        handleActiveTab={handleActiveTab}
                        tabs={statisticsConfig.TABS}
                        activeTab={activeTab}
                    />
                    {!isEmpty(allReps) && (
                        <>
                            {activeTab ===
                                statisticsConfig.SUBNAV_TABS.activity && (
                                <Activity
                                    teamId={teamId}
                                    repsOptions={filterReps.reps}
                                    activestatsRep={+filterReps.active}
                                    handleRepsChange={
                                        teamId === 0
                                            ? handlers.handleLocalRep
                                            : handlers.handleFilterRepChange
                                    }
                                    repId={filterReps.active}
                                    activeTeam={filterTeams.active}
                                    dateArr={dateArr}
                                    // callType={callType}
                                    callDuration={callDuration}
                                    {...dataHandlers}
                                />
                            )}
                            {activeTab ===
                                statisticsConfig.SUBNAV_TABS.interactions && (
                                <InteractionsContainer
                                    teamId={teamId}
                                    repsOptions={filterReps.reps}
                                    activestatsRep={filterReps.active}
                                    handleRepsChange={
                                        teamId === 0
                                            ? handlers.handleLocalRep
                                            : handlers.handleFilterRepChange
                                    }
                                    repId={filterReps.active}
                                    activeTeam={filterTeams.active}
                                    dateArr={dateArr}
                                    callDuration={callDuration}
                                    {...dataHandlers}
                                />
                            )}
                            {activeTab ===
                                statisticsConfig.SUBNAV_TABS.topic && (
                                <Topics
                                    repsOptions={
                                        teamId === 0
                                            ? [
                                                  { id: 0, name: "All Reps" },
                                                  ...allReps,
                                              ]
                                            : filterReps.reps
                                    }
                                    activestatsRep={filterReps.active}
                                    handleRepsChange={
                                        teamId === 0
                                            ? handlers.handleLocalRep
                                            : handlers.handleFilterRepChange
                                    }
                                    repId={filterReps.active}
                                    activeTeamIdx={filterTeams.active}
                                    domain={domain}
                                    isLoading={false}
                                    callDuration={callDuration}
                                    startDate={startDate}
                                    teamId={teamId}
                                    endDate={endDate}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default compose(withReactTour, withErrorCollector)(Statistics);
