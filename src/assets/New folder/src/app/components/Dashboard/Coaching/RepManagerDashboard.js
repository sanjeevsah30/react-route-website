import React, { useState } from "react";
import CoachingStatCard from "./Components/CoachingStatCard";
import FilterAppliedLeadboard from "./Components/FilterAppliedLeadboard";
import {
    Checkbox,
    Drawer,
    Collapse,
    Button,
    Tooltip,
    Skeleton,
    Row,
} from "antd";
import "./coaching.style.scss";
import Leaderboard from "./Components/Leaderboard";
import CompletedSvg from "./Svg/CompletedSvg";
import BookSvg from "./Svg/BookSvg";
import NotStartedSvg from "./Svg/NotStartedSvg";
import ConcernSvg from "./Svg/ConcernSvg";
import TelephoneSvg from "./Svg/TelephoneSvg";
import authApiConfig from "@apis/authentication/config";
import { useDispatch, useSelector } from "react-redux";
import CoachingDashboard from "@container/Coaching/CoachingDashboard";
import CoachingProgressGraph from "./Components/CoachingProgressGraph";
import PageFilters from "@presentational/PageFilters/PageFilters";
import { useCallback } from "react";
import {
    formatFloat,
    getTimeZone,
    toEpoch,
    yearlyCoachingSessions,
} from "@tools/helpers";
import { useEffect } from "react";
import {
    getCoachingSessions,
    getCompletionGraph,
    getRepLeaderboard,
    getRepTiles,
} from "@store/coaching/coaching.store";
import { getParameterAverageData } from "@store/dashboard/dashboard";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";
import { setActiveRep } from "@store/common/actions";
import LoadingCards from "../../Audit Report/LoadingCards";

import {
    CallSvg,
    InfoSvg,
    FilterLinesSvg,
    MinusSvg,
    PlusSvg,
    CloseSvg,
} from "app/static/svg/indexSvg";

export default function RepManagerDashboard({ setVisible, visible }) {
    const dispatch = useDispatch();
    const closeFilters = () => setVisible(false);
    const closeDrawer = () => {
        setVisible(false);
    };
    const { Panel } = Collapse;

    const {
        dashboard: {
            overall_data: { pie_data, graph_data, overall_average, calls_data },
        },
        common: { filterDates, filterTeams, filterReps },
        coaching_dashboard: {
            rep_tiles_data,
            coaching_sessions,
            rep_leaderboard,
            completionGraph_data,
            tiles_loading,
            coaching_loading,
            coachingFilters,
        },
        auth,
    } = useSelector((state) => state);

    const prepareFilterPaylaod = () => {
        return {
            session_type: coachingFilters.session_type,
            session_progress: coachingFilters.session_progress,
        };
    };

    const getPayload = useCallback(() => {
        const payload = {
            start_date: toEpoch(
                filterDates?.dates?.[filterDates?.active]?.dateRange[0]
            ),
            end_date: toEpoch(
                filterDates?.dates?.[filterDates?.active]?.dateRange[1]
            ),
            timezone: getTimeZone(),
            reps_id: [filterReps.active[0]] || null,
            session_type: coachingFilters.session_type,
            session_progress: coachingFilters.session_progress,
        };

        return payload;
    }, [
        filterDates.active,
        filterTeams.active,
        filterReps.active,
        coachingFilters,
    ]);

    useEffect(() => {
        if (visible) return;
        const payload = getPayload();
        dispatch(getRepTiles(payload));
        dispatch(getRepLeaderboard(payload));
        dispatch(
            getCoachingSessions({ ...payload, ...prepareFilterPaylaod() })
        );
    }, [
        filterDates.active,
        filterTeams.active,
        filterReps.active,
        coachingFilters,
    ]);

    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);

    return (
        <div className="coaching--container">
            <div
                className="flex alignCenter justifySpaceBetween marginB16"
                style={{ borderBottom: "1px solid rgba(153, 153, 153, 0.2)" }}
            >
                <div>
                    <div className="flex">
                        <div
                            className={"curPoint marginR16"}
                            onClick={() => {
                                dispatch(setActiveRep([]));
                            }}
                        >
                            <LeftArrowSvg
                                style={{
                                    fontSize: "14px",
                                    marginTop: "8px",
                                }}
                            />
                        </div>
                        <div className="mine_shaft_cl bold600 font26">
                            {
                                filterReps.reps?.find(
                                    (rep) => rep.id === +filterReps.active[0]
                                )?.name
                            }
                        </div>
                    </div>

                    <div className="font18 dusty_gray_cl marginB30 paddingL35">
                        Coaching Progress Detailed Stats
                    </div>
                </div>
                <div className="flex">
                    <PageFilters
                        className="topbar__filters"
                        hideDuration={true}
                        hideTeamSelect={true}
                        hideRepSelect={true}
                        showTemplateSelection={false}
                    />
                    <span
                        className="filterBtn marginL16 paddingL16 paddingR13 paddingTB9 flex alignCenter"
                        onClick={() => {
                            setVisible(true);
                        }}
                    >
                        <FilterLinesSvg />
                        <span className="marginL8 bold400 font12">Filters</span>
                    </span>
                </div>
            </div>
            <div className="coaching__stats--container marginB35">
                <CoachingStatCard
                    Svg={() => (
                        <CompletedSvg
                            style={{
                                color: "#52C41A",
                            }}
                        />
                    )}
                    heading="Sessions Completed"
                    color="#52C41A"
                    value={rep_tiles_data.session_completed}
                />
                <CoachingStatCard
                    Svg={NotStartedSvg}
                    heading="Sessions Not Started"
                    color="#FF6365"
                    value={rep_tiles_data.not_started}
                />
                <CoachingStatCard
                    Svg={BookSvg}
                    heading="Average Coaching Completion"
                    color="#1A62F2"
                    value={rep_tiles_data.avg_percentage}
                    suffixIcon="%"
                />
                <CoachingStatCard
                    Svg={ConcernSvg}
                    heading="Areas of Concern"
                    color="#FF6365"
                    value={rep_tiles_data.area_of_concern}
                />
            </div>
            <div className="flex">
                <div
                    className="leaderBoard flex1"
                    style={{
                        height: "480px",
                    }}
                >
                    <Leaderboard />
                </div>
                <div className="min_width_0_flex_child flex column">
                    <div
                        className="call__stat--card  flex"
                        style={{
                            height: "120px",
                        }}
                    >
                        {tiles_loading ? (
                            <Skeleton
                                active
                                paragraph={{ rows: 2 }}
                                title={false}
                            />
                        ) : (
                            <>
                                <div
                                    className="min_width_0_flex_child flex alignCenter flex1 paddingR15 paddingTB9"
                                    style={{
                                        borderRight: "2px solid #99999933",
                                    }}
                                >
                                    <div className="elipse_text font16 bold600 mine_shaft_cl marginR5">
                                        Call Quality Score
                                    </div>
                                    <Tooltip title="Call Quality Score">
                                        <InfoSvg />
                                    </Tooltip>
                                </div>

                                <div className="min_width_0_flex_child flex">
                                    <CallSvg
                                        style={{
                                            color:
                                                rep_tiles_data.avg_call_quality >=
                                                75
                                                    ? "#52C41A"
                                                    : rep_tiles_data.avg_call_quality >
                                                      50
                                                    ? "#ECA51D"
                                                    : "#FF6365",
                                        }}
                                    />

                                    <div className="marginL16 min_width_0_flex_child flex column">
                                        <div className="stat__heading elipse_text">
                                            Avg. Call Quality SCORE
                                        </div>

                                        <div
                                            className="font24 bold600"
                                            style={{
                                                color:
                                                    rep_tiles_data.avg_call_quality >=
                                                    75
                                                        ? "#52C41A"
                                                        : rep_tiles_data.avg_call_quality >
                                                          50
                                                        ? "#ECA51D"
                                                        : "#FF6365",
                                            }}
                                        >
                                            {formatFloat(
                                                rep_tiles_data.avg_call_quality,
                                                2
                                            )}
                                            %
                                        </div>
                                    </div>
                                </div>
                                <span
                                    className="paddingTB21"
                                    style={{
                                        borderRight: "2px solid #99999933",
                                    }}
                                ></span>
                                <div className="min_width_0_flex_child flex">
                                    <TelephoneSvg />

                                    <div className="marginL16 min_width_0_flex_child flex column">
                                        <div className="stat__heading elipse_text">
                                            Recent Calls EvalUATION
                                        </div>

                                        <div className="flex">
                                            {rep_tiles_data?.last_meeting_score_data?.map(
                                                (c, idx) => (
                                                    <Tooltip
                                                        key={idx}
                                                        destroyTooltipOnHide
                                                        title={
                                                            formatFloat(c, 2) +
                                                            "%"
                                                        }
                                                    >
                                                        <div
                                                            className="circle"
                                                            style={{
                                                                backgroundColor:
                                                                    c >=
                                                                    stats_threshold.good
                                                                        ? "#52C41A"
                                                                        : c >=
                                                                          50
                                                                        ? "#ECA51D"
                                                                        : "#FF6365",
                                                            }}
                                                        ></div>
                                                    </Tooltip>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="marginT16 flex1">
                        <CoachingProgressGraph
                            height={344}
                            payload={getPayload()}
                        />
                    </div>
                </div>
            </div>
            {coaching_loading ? (
                <Row className="marginT16" gutter={[16, 24]}>
                    <LoadingCards count={3} />
                </Row>
            ) : (
                <CoachingDashboard
                    coaching_sessions={yearlyCoachingSessions(
                        coaching_sessions
                    )}
                />
            )}
        </div>
    );
}
