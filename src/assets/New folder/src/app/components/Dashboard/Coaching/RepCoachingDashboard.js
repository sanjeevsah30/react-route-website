import React, { useState, useId, useCallback, useEffect } from "react";
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
    Radio,
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
import coachingConfig from "@constants/Coaching/index";
import {
    FilterLinesSvg,
    MinusSvg,
    PlusSvg,
    CloseSvg,
    InfoSvg,
} from "app/static/svg/indexSvg";
import CoachingProgressGraph from "./Components/CoachingProgressGraph";
import PageFilters from "@presentational/PageFilters/PageFilters";
import {
    formatFloat,
    getTimeZone,
    toEpoch,
    capitalizeFirstLetter,
    uid,
    yearlyCoachingSessions,
} from "@helpers";
import {
    getCoachingSessions,
    getCompletionGraph,
    getRepLeaderboard,
    getRepTiles,
    setCoachingFilter,
    setActiveCoachingFilter,
} from "@store/coaching/coaching.store";
import LoadingCards from "../../Audit Report/LoadingCards";

export default function RepCoachingDashboard() {
    // const id = useId();
    const [visible, setVisible] = useState(false);
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
            tiles_loading,
            coaching_loading,
            activeCoachingFilters,
            coachingFilters,
            defaultCoachingFilters,
        },
        auth,
    } = useSelector((state) => state);

    //payload for all API'S
    const getPayload = useCallback(() => {
        const payload = {
            start_date: toEpoch(
                filterDates?.dates?.[filterDates?.active]?.dateRange[0]
            ),
            end_date: toEpoch(
                filterDates?.dates?.[filterDates?.active]?.dateRange[1]
            ),
            session_type: coachingFilters.session_type,
            session_progress: coachingFilters.session_progress,
            timezone: getTimeZone(),
        };

        return payload;
    }, [
        filterDates.active,
        filterTeams.active,
        filterReps.active,
        coachingFilters,
    ]);

    // paylaod for Coaching Sessions API
    const prepareFilterPaylaod = () => {
        return {
            ...getPayload(),
            session_type: coachingFilters.session_type,
            session_progress: coachingFilters.session_progress,
            reps_id: [auth.id],
        };
    };

    const setSessionProgressHandler = ({ target: { value } }) => {
        let progress_temp =
            value === coachingConfig.ALL
                ? "all"
                : value === coachingConfig.IN_PROGRESS
                ? "progress"
                : value === coachingConfig.COMPLETED
                ? "completed"
                : "all";
        if (progress_temp !== coachingFilters.session_progress)
            dispatch(setCoachingFilter({ session_progress: progress_temp }));
    };

    const setSessionTypeHandler = ({ target: { value } }) => {
        let session_temp =
            value === coachingConfig.ALL
                ? "all"
                : value === coachingConfig.DAILY
                ? "daily"
                : value === coachingConfig.ASSIGNED
                ? "assigned"
                : "all";

        if (session_temp !== coachingFilters.session_type)
            dispatch(setCoachingFilter({ session_type: session_temp }));
    };

    const clearFilter = () => {
        dispatch(setCoachingFilter(defaultCoachingFilters));
        dispatch(setActiveCoachingFilter(createActiveFilters()));
        closeDrawer();
    };

    // createing formated filters for coaching dashboard UI using coachingFilters(i.e applied filter)
    const createActiveFilters = () => {
        const { session_type, session_progress } = coachingFilters;

        const data = [];

        if (session_progress !== "all") {
            data.push({
                id: uid(),
                type: session_progress,
                name: capitalizeFirstLetter(coachingConfig.SESSION_PROGRESS),
            });
        }
        if (session_type !== "all") {
            data.push({
                id: uid(),
                type: session_type,
                name: capitalizeFirstLetter(coachingConfig.SESSION_TYPE),
            });
        }

        return data;
    };

    useEffect(() => {
        if (visible) return;
        const payload = getPayload();
        dispatch(getRepTiles({ ...payload, reps_id: [auth.id] }));
        dispatch(getRepLeaderboard(payload));
        dispatch(getCoachingSessions(prepareFilterPaylaod()));
        dispatch(setCoachingFilter(defaultCoachingFilters));
    }, [
        filterDates.active,
        coachingFilters.session_type,
        coachingFilters.session_progress,
    ]);

    // useEffect(() => {
    //     dispatch(setActiveCoachingFilter(createActiveFilters()))
    // }, [coachingFilters])

    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);

    return (
        <div className="coaching--container">
            <div
                className="flex alignCenter justifySpaceBetween"
                style={{ borderBottom: "1px solid rgba(153, 153, 153, 0.2)" }}
            >
                <div>
                    <div className="mine_shaft_cl bold600 font26">
                        Welcome to your Coaching Dashboard,{" "}
                        {auth.first_name.split("")[0].toUpperCase() +
                            auth.first_name.slice(1)}
                    </div>
                    <div className="font18 dusty_gray_cl marginB30">
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

                <Drawer
                    title={<div className="bold700 font24">Filters</div>}
                    placement="right"
                    width={480}
                    visible={visible}
                    onClose={closeFilters}
                    footer={
                        <div className="filter_footer">
                            <Button
                                className="footer_button clear__button"
                                onClick={clearFilter}
                            >
                                Clear
                            </Button>
                            <Button
                                type="primary"
                                className="footer_button"
                                onClick={() => {
                                    closeDrawer();
                                    dispatch(
                                        setCoachingFilter(coachingFilters)
                                    );
                                }}
                            >
                                Apply Filter
                            </Button>
                        </div>
                    }
                    closable={false}
                    bodyStyle={{ padding: 0 }}
                    extra={
                        <>
                            <span className="curPoint" onClick={closeFilters}>
                                <CloseSvg />
                            </span>
                        </>
                    }
                >
                    <Collapse
                        expandIconPosition="right"
                        bordered={false}
                        className="dashboard-drawer"
                        expandIcon={({ isActive }) =>
                            isActive ? (
                                <MinusSvg
                                    style={{
                                        color: "#999999",
                                    }}
                                />
                            ) : (
                                <PlusSvg
                                    style={{
                                        color: "#999999",
                                    }}
                                />
                            )
                        }
                    >
                        <Panel
                            header="SESSION PROGRESS"
                            key="1"
                            className="callFilter-panel font16"
                        >
                            <Radio.Group className="flex row">
                                <Radio.Group
                                    options={[
                                        "ALL",
                                        "In Progress",
                                        "Completed",
                                    ]}
                                    value={
                                        coachingFilters.session_progress ===
                                        "all"
                                            ? coachingConfig.ALL
                                            : coachingFilters.session_progress ===
                                              "progress"
                                            ? coachingConfig.IN_PROGRESS
                                            : coachingFilters.session_progress ===
                                              "completed"
                                            ? coachingConfig.COMPLETED
                                            : "all"
                                    }
                                    onChange={setSessionProgressHandler}
                                />
                            </Radio.Group>
                        </Panel>
                    </Collapse>
                    <Collapse
                        expandIconPosition="right"
                        bordered={false}
                        className="dashboard-drawer"
                        expandIcon={({ isActive }) =>
                            isActive ? (
                                <MinusSvg
                                    style={{
                                        color: "#999999",
                                    }}
                                />
                            ) : (
                                <PlusSvg
                                    style={{
                                        color: "#999999",
                                    }}
                                />
                            )
                        }
                    >
                        <Panel
                            header="SESSION TYPE"
                            key="1"
                            className="callFilter-panel font16"
                        >
                            <Radio.Group className="flex row">
                                <Radio.Group
                                    options={[
                                        "ALL",
                                        "Daily Session",
                                        "Assigned Session",
                                    ]}
                                    value={
                                        coachingFilters.session_type === "all"
                                            ? coachingConfig.ALL
                                            : coachingFilters.session_type ===
                                              "daily"
                                            ? coachingConfig.DAILY
                                            : coachingFilters.session_type ===
                                              "assigned"
                                            ? coachingConfig.ASSIGNED
                                            : "all"
                                    }
                                    onChange={setSessionTypeHandler}
                                />
                            </Radio.Group>
                        </Panel>
                    </Collapse>
                </Drawer>
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
                    tooltip_text="Sessions Completed"
                />
                <CoachingStatCard
                    Svg={NotStartedSvg}
                    heading="Sessions Not Started"
                    color="#FF6365"
                    value={rep_tiles_data.not_started}
                    tooltip_text="Sessions Not Started"
                />
                <CoachingStatCard
                    Svg={BookSvg}
                    heading="Average Coaching Completion"
                    color="#1A62F2"
                    value={rep_tiles_data.avg_percentage}
                    tooltip_text="Average Coaching Completion"
                    suffixIcon="%"
                />
                <CoachingStatCard
                    Svg={ConcernSvg}
                    heading="Areas of Concern"
                    color="#FF6365"
                    value={rep_tiles_data.area_of_concern}
                    tooltip_text="Areas of Concern"
                />
            </div>
            <div className="flex">
                <div
                    className="leaderBoard flex1"
                    style={{
                        height: "480px",
                    }}
                >
                    <Leaderboard tooltip_text="Leaderboard" />
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
                                <div className="min_width_0_flex_child flex alignCenter flex1">
                                    <div className="elipse_text font16 bold600 mine_shaft_cl marginR5">
                                        Call Quality Score
                                    </div>
                                    <Tooltip title="Call Quality Score">
                                        <span className="curPoint">
                                            <InfoSvg />
                                        </span>
                                    </Tooltip>
                                </div>

                                <div className="min_width_0_flex_child flex">
                                    <CompletedSvg
                                        style={{
                                            color:
                                                rep_tiles_data.avg_call_quality >=
                                                stats_threshold.good
                                                    ? "#52C41A"
                                                    : rep_tiles_data.avg_call_quality >
                                                      stats_threshold.bad
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
                                                    stats_threshold.good
                                                        ? "#52C41A"
                                                        : rep_tiles_data.avg_call_quality >
                                                          stats_threshold.bad
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
                                                                          stats_threshold
                                                                              .good
                                                                              .bad
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

            {/* <div className="marginT20">
                <FilterAppliedLeadboard />
            </div> */}
        </div>
    );
}
