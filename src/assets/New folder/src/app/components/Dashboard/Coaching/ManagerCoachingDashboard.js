import React, { useRef, useState } from "react";
import CoachingStatCard from "./Components/CoachingStatCard";
import FilterAppliedLeadboard from "./Components/FilterAppliedLeadboard";
import {
    Collapse,
    Button,
    Row,
    Skeleton,
    Popconfirm,
    Col,
    Tooltip,
    Drawer,
    Radio,
    Popover,
    Modal,
} from "antd";
import "./coaching.style.scss";
import CompletedSvg from "./Svg/CompletedSvg";

import { useDispatch, useSelector } from "react-redux";

import CoachingProgressGraph from "./Components/CoachingProgressGraph";
import CreateCoachingModal from "./CreateCoachingModal";
import PageFilters from "@presentational/PageFilters/PageFilters";
import { useCallback } from "react";
import {
    capitalizeFirstLetter,
    flattenTeams,
    formatFloat,
    getColor,
    getDisplayName,
    getTimeZone,
    toEpoch,
    uid,
    getDateTime,
} from "@tools/helpers";
import { useEffect } from "react";
import {
    deleteCoaching,
    getCoachingAssesment,
    getCoachingSessionList,
    getLeaderboardTable,
    getManagerIndividualTiles,
    getManagerTiles,
    getRepLeaderboard,
    setActiveCoachingFilter,
    setCoachingFilter,
} from "@store/coaching/coaching.store";
import TeamsSvg from "./Svg/TeamsSvg";
import NotesSvg from "./Svg/NotesSvg";
import StopSvg from "./Svg/StopSvg";
import RepSvg from "./Svg/RepSvg";
import DefaultersSvg from "./Svg/DefaultersSvg";
import CompletionSvg from "./Svg/CompletionSvg";
import RepManagerDashboard from "./RepManagerDashboard";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";
import { changeActiveTeam, openNotification } from "@store/common/actions";
import { getLibraryModules } from "@store/coaching/createCoachingSlice";
import ChevronUpSvg from "app/static/svg/ChevronUpSvg";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";
import EditCommentSvg from "app/static/svg/EditCommentSvg";
import DeleteSvg from "app/static/svg/DeleteSvg";
import InfoSvg from "app/static/svg/InfoSvg";
import FilterLinesSvg from "app/static/svg/FilterLinesSvg";
import MinusSvg from "app/static/svg/MinusSvg";
import PlusSvg from "app/static/svg/PlusSvg";
import CloseSvg from "app/static/svg/CloseSvg";
import coachingConfig from "@constants/Coaching/index";
import CreateAssessmentModal from "./CreateAssessmentModal";
import { AddNoteSvg, DownLoadSvg } from "app/static/svg/indexSvg";
import { handleDownloadGetRequest } from "@apis/audit_report/index";
import { saveAs } from "file-saver";
import { getError } from "@apis/common/index";
import apiErrors from "@apis/common/errors";
import MoreSvg from "app/static/svg/MoreSvg";
import { axiosInstance } from "@apis/axiosInstance";
import Spinner from "@presentational/reusables/Spinner";

export default function ManagerCoachingDashboard() {
    const { auth } = useSelector((state) => state);

    const dispatch = useDispatch();

    const {
        common: { filterDates, filterTeams, filterReps, teams },
        coaching_dashboard: {
            manager_tiles_data,
            manager_individual_tiles_data,

            leaderboard_table,
            leaderboard_table_loading,
            coaching_session_list,
            session_list_loading,
            coachingFilters,
            defaultCoachingFilters,
        },
    } = useSelector((state) => state);

    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);

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

        if (Array.isArray(filterTeams.active) && filterTeams?.active?.length) {
            payload.teams_id = filterTeams.active;
        }

        if (+filterReps.active[0]) {
            payload.reps_id = [filterReps.active[0]];
        }

        return payload;
    }, [
        filterDates.active,
        filterReps.active,
        filterTeams.active,
        coachingFilters,
    ]);

    useEffect(() => {
        dispatch(getCoachingAssesment());
    }, []);

    useEffect(() => {
        if (visible) return;
        document.querySelector(".main__dashboard").scrollTo(0, 0);
        if (teams.length) dispatch(getLeaderboardTable(getPayload()));
        const api1 = dispatch(getLibraryModules());
        const api2 = dispatch(getManagerTiles(getPayload()));
        const api3 = dispatch(getRepLeaderboard(getPayload()));
        const api4 = dispatch(getManagerIndividualTiles(getPayload()));
        const api5 = dispatch(getCoachingSessionList(getPayload()));

        return () => {
            api1?.abort();
            api2?.abort();
            api3?.abort();
            api4?.abort();
            api5?.abort();
        };
    }, [
        teams,
        filterDates.active,
        filterTeams.active,
        filterReps.active,
        coachingFilters,
    ]);

    const [showCreateCoaching, setShowCreateCoaching] = useState(false);
    const [showCreateAssesment, setShowCreateAssesment] = useState(false);

    const handleClose = useCallback(() => {
        setShowCreateCoaching(false);
        setShowCreateAssesment(false);
    }, []);

    const [visible, setVisible] = useState(false);
    const closeDrawer = () => {
        setVisible(false);
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

    return (
        <div className="coaching--container">
            {filterReps.active[0] ? (
                <RepManagerDashboard
                    setVisible={setVisible}
                    visible={visible}
                />
            ) : (
                <>
                    <div
                        className="flex alignCenter justifySpaceBetween marginB16"
                        style={{
                            borderBottom: "1px solid rgba(153, 153, 153, 0.2)",
                        }}
                    >
                        <div>
                            {(Array.isArray(filterTeams.active) &&
                                filterTeams.active.length !== 1) ||
                            +filterTeams.active === 0 ? (
                                <>
                                    <div className="mine_shaft_cl bold600 font26">
                                        Welcome to your Coaching Dashboard,{" "}
                                        {auth.first_name}
                                    </div>
                                    <div className="font18 dusty_gray_cl marginB30">
                                        All Teams Coaching Progress Stats
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex">
                                        <div
                                            className={"curPoint marginR16"}
                                            onClick={() => {
                                                dispatch(changeActiveTeam([]));
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
                                                flattenTeams(
                                                    filterTeams.teams
                                                ).find(
                                                    ({ id }) =>
                                                        id ===
                                                        filterTeams?.active?.[0]
                                                )?.name
                                            }
                                        </div>
                                    </div>

                                    <div className="font18 dusty_gray_cl marginB30 paddingL35">
                                        All Team Members Coaching Progress Stats
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex">
                            <PageFilters
                                className="topbar__filters"
                                hideDuration={true}
                                hideTeamSelect={false}
                                hideRepSelect={false}
                                showTemplateSelection={false}
                            />
                            <span
                                className="filterBtn marginL16 paddingL16 paddingR13 paddingTB9 flex alignCenter"
                                onClick={() => {
                                    setVisible(true);
                                }}
                            >
                                <FilterLinesSvg />
                                <span className="marginL8 bold400 font12">
                                    Filters
                                </span>
                            </span>
                            <Popover
                                content={
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <div
                                            onClick={() => {
                                                setShowCreateAssesment(true);
                                                setMoreOptionsVisible(false);
                                            }}
                                            className="option"
                                        >
                                            Assessment Session
                                        </div>

                                        <div
                                            onClick={() => {
                                                setShowCreateCoaching(true);
                                                setMoreOptionsVisible(false);
                                            }}
                                            className="option"
                                        >
                                            Coaching Session
                                        </div>
                                    </div>
                                }
                                trigger="click"
                                visible={moreOptionsVisible}
                                onVisibleChange={(visible) =>
                                    setMoreOptionsVisible(visible)
                                }
                                overlayClassName={
                                    "completed_card_more_options_popover"
                                }
                                placement="bottomRight"
                            >
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}
                                >
                                    <Button className="create_coaching_btn">
                                        + Create
                                    </Button>
                                </div>
                            </Popover>

                            <CreateCoachingModal
                                open={showCreateCoaching}
                                handleClose={handleClose}
                                filtersPayload={getPayload()}
                            />
                            <CreateAssessmentModal
                                open={showCreateAssesment}
                                handleClose={handleClose}
                                filtersPayload={getPayload()}
                            />
                        </div>
                    </div>
                    {((Array.isArray(filterTeams.active) &&
                        filterTeams.active.length !== 1) ||
                        +filterTeams.active === 0) &&
                        !filterReps.active[0] && (
                            <div className="coaching__stats--container marginB35">
                                <CoachingStatCard
                                    Svg={TeamsSvg}
                                    heading="No of Teams"
                                    color="#1a62f2"
                                    value={manager_tiles_data.no_of_teams}
                                    tooltip_text="No of Teams"
                                />
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
                                    value={manager_tiles_data.session_completed}
                                    tooltip_text="Sessions Completed"
                                />
                                <CoachingStatCard
                                    Svg={StopSvg}
                                    heading="Sessions Not Started"
                                    color="#FF6365"
                                    value={manager_tiles_data.not_started}
                                    tooltip_text="Sessions Not Started"
                                />

                                <CoachingStatCard
                                    Svg={NotesSvg}
                                    heading="DAILY COACHING SESSIONS"
                                    color="#4E89FF"
                                    value={
                                        manager_tiles_data.daily_coaching_sessions
                                    }
                                    tooltip_text="DAILY COACHING SESSIONS"
                                />

                                <CoachingStatCard
                                    Svg={NotesSvg}
                                    heading="ASSIGNED COACHING SESSIONS"
                                    color="#FF6365"
                                    value={
                                        manager_tiles_data.assigned_coaching_session
                                    }
                                    tooltip_text="ASSIGNED COACHING SESSIONS"
                                />
                            </div>
                        )}

                    {Array.isArray(filterTeams.active) &&
                        filterTeams.active.length === 1 &&
                        !filterReps.active[0] && (
                            <>
                                <h2>Coaching Progress</h2>
                                <div className="flex">
                                    {/* custom width in percentage*/}
                                    <CoachingProgressGraph
                                        height={460}
                                        payload={getPayload()}
                                    />

                                    <div
                                        className="coaching_grid_layout"
                                        style={{ flex: "4" }}
                                    >
                                        <CoachingStatCard
                                            Svg={RepSvg}
                                            heading="NO. OF REPS"
                                            color="#1a62f2"
                                            value={
                                                manager_individual_tiles_data.no_of_reps
                                            }
                                            tooltip_text="NO. OF REPS"
                                        />
                                        <CoachingStatCard
                                            Svg={NotesSvg}
                                            heading="ASSIGNED COACHING SESSIONS"
                                            color="#FD6D01"
                                            value={
                                                manager_individual_tiles_data.assigned_coaching_session
                                            }
                                            tooltip_text="ASSIGNED COACHING SESSIONS"
                                        />
                                        <CoachingStatCard
                                            Svg={DefaultersSvg}
                                            heading="DEFAULTERS"
                                            color="#AC72DA"
                                            value={
                                                manager_individual_tiles_data.defaulters
                                            }
                                            tooltip_text="Defaulters"
                                        />
                                        <CoachingStatCard
                                            Svg={CompletionSvg}
                                            heading="high completion rate"
                                            color="#31C6FB"
                                            value={
                                                manager_individual_tiles_data.high_completion_rate
                                            }
                                            tooltip_text="high completion rate"
                                        />
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
                                            value={
                                                manager_individual_tiles_data.session_completed
                                            }
                                            tooltip_text="Sessions Completed"
                                        />
                                        <CoachingStatCard
                                            Svg={StopSvg}
                                            heading="Sessions not started"
                                            color="#FF6365"
                                            value={
                                                manager_individual_tiles_data.not_started
                                            }
                                            tooltip_text="Sessions not started"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                    {leaderboard_table_loading ? (
                        <Skeleton
                            active
                            paragraph={{ rows: 8 }}
                            title={false}
                            style={{ marginTop: "45px" }}
                        />
                    ) : (
                        !!leaderboard_table?.length && (
                            <>
                                <div className="bold600 font18 marginTB16">
                                    Leaderboard{" "}
                                    {`(${leaderboard_table?.length})`}
                                </div>
                                <div className="marginT20">
                                    <FilterAppliedLeadboard
                                        data={leaderboard_table}
                                        type={
                                            (Array.isArray(
                                                filterTeams.active
                                            ) &&
                                                filterTeams.active.length !==
                                                    1) ||
                                            +filterTeams.active === 0
                                                ? "team"
                                                : "rep"
                                        }
                                    />
                                </div>
                            </>
                        )
                    )}
                </>
            )}

            <Drawer
                title={<div className="bold700 font24">Filters</div>}
                placement="right"
                width={480}
                visible={visible}
                onClose={closeDrawer}
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
                                dispatch(setCoachingFilter(coachingFilters));
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
                        <span className="curPoint" onClick={closeDrawer}>
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
                                options={["ALL", "In Progress", "Completed"]}
                                value={
                                    coachingFilters.session_progress === "all"
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

            {!filterReps.active[0] && (
                <div className="flex alignCenter marginB16">
                    <div className="font18 bold600 marginR10">
                        Assigned Coaching Sessions
                    </div>
                    <Tooltip
                        title={
                            <div className="capitalize">
                                Assigned Coaching Sessions
                            </div>
                        }
                    >
                        <InfoSvg />
                    </Tooltip>
                </div>
            )}

            {session_list_loading ? (
                <Skeleton
                    active
                    paragraph={{ rows: 8 }}
                    title={false}
                    style={{ marginTop: "45px" }}
                />
            ) : (
                !!coaching_session_list?.length &&
                !filterReps?.active[0] && (
                    <>
                        {coaching_session_list?.map((e) => {
                            return <SessionDetailsCard key={e.id} {...e} />;
                        })}
                    </>
                )
            )}
        </div>
    );
}

const { Panel } = Collapse;

const SessionDetailsCard = ({
    teams,
    id,
    average_completion,
    rep_count,
    title,
    media_count,
    reps_with_complete_session,
    reps_with_incomplete_session,
    created_at,
    assessment,
    is_assessment,
}) => {
    const {
        common: { filterTeams, filterReps },
    } = useSelector((state) => state);
    const dispatch = useDispatch();

    const [isVisible, setIsVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [isLoding, setIsLoding] = useState(false);
    const [clicked, setClicked] = useState(false);
    const imgRef = useRef(null);

    const downloadImage = (e) => {
        e.preventDefault();
        setIsVisible(false);
        const a = document.createElement("a");
        a.href = imgRef.current.src;
        a.download = "image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleDownload = (id) => {
        let url = `/coachings/download/${id}/`;

        return handleDownloadGetRequest(url)
            .then((response) => {
                var blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                saveAs(
                    blob,
                    `${
                        response.headers?.["content-disposition"]
                            .split("filename=")[1]
                            .split(";")[0]
                            .split('"')[1]
                    }`
                );
            })
            .catch((err) => {
                const { status } = getError(err);

                if (status === apiErrors.AXIOSERRORSTATUS) {
                    let message = JSON.parse(
                        new TextDecoder().decode(err?.response?.data)
                    );

                    openNotification(
                        "error",
                        "Error",
                        Object.values(message || {})?.[0] ||
                            "Something went wrong"
                    );
                }
            });
    };

    const getResponseHandle = (ass_id, id) => {
        setIsLoding(true);
        const url = `coachings/assessment/${ass_id}/graph/?session_id=${id}`;
        axiosInstance
            .get(url, { responseType: "arraybuffer" })
            .then((res) => {
                const blob = new Blob([res.data], {
                    type: res.headers["content-type"],
                });
                const objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
                setIsLoding(false);
            })
            .catch((err) => {
                const { status, message } = getError(err);
                if (status === apiErrors.AXIOSERRORSTATUS)
                    openNotification("error", "Error", message);
            });
    };

    return (
        <div className="session--card">
            <Collapse
                expandIconPosition={"right"}
                bordered={false}
                expandIcon={({ isActive }) => {
                    teams?.length && isActive ? (
                        <ChevronUpSvg />
                    ) : (
                        <ChevronDownSvg />
                    );
                }}
            >
                <Panel
                    showArrow={teams.length}
                    header={
                        <div
                            className="flex alignCenter justifySpaceBetween width100p"
                            onClick={(e) => {
                                if (teams?.length) e.stopPropagation();
                            }}
                        >
                            <div className="font16 bold600 mine_shaft_cl capitalize flex">
                                <div
                                    className="text_ellipsis"
                                    style={{ maxWidth: "300px" }}
                                >
                                    {title}
                                </div>
                                <span className="marginLR5">{"|"}</span>
                                <span>{getDateTime(created_at)}</span>
                            </div>
                            <div className="flex alignCenter justifySpaceBetween marginR60">
                                <div className="marginR60">
                                    <span className="top__label">
                                        <span>Assigned to</span>
                                        <span></span>
                                    </span>
                                    {filterTeams?.active?.length === 1 || (
                                        <span className="top__label">
                                            <span>Teams</span>
                                            <span>{teams?.length}</span>
                                        </span>
                                    )}

                                    <span className="top__label">
                                        <span>Reps</span>
                                        <span>{rep_count}</span>
                                    </span>
                                    <span className="top__label">
                                        <span>Media</span>
                                        <span>{media_count}</span>
                                    </span>
                                    <span className="top__label">
                                        <span>Average Completion</span>
                                        <span
                                            style={{
                                                color:
                                                    average_completion >= 75
                                                        ? "#52C41A"
                                                        : average_completion >=
                                                          50
                                                        ? "#ECA51D"
                                                        : "#FF6365",
                                            }}
                                        >
                                            {formatFloat(average_completion)}%
                                        </span>
                                    </span>
                                </div>
                                <Popover
                                    destroyTooltipOnHide={{ keepParent: false }}
                                    overlayClassName="library_card_more_options_popover"
                                    trigger="click"
                                    visible={clicked}
                                    onVisibleChange={(visible) =>
                                        setClicked(visible)
                                    }
                                    placement={"bottomRight"}
                                    content={
                                        <div
                                            className="flex column"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Popconfirm
                                                title="Are you sure to delete this team?"
                                                onConfirm={(e) => {
                                                    e.stopPropagation();
                                                    setClicked(false);
                                                    dispatch(
                                                        deleteCoaching(id)
                                                    );
                                                }}
                                                onCancel={(e) => {
                                                    e.stopPropagation();
                                                    setClicked(false);
                                                }}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <span
                                                    className="curPoint paddingLR14 paddingTB9"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    {"Delete"}
                                                    {/* <DeleteSvg /> */}
                                                </span>
                                            </Popconfirm>
                                            <span
                                                className="curPoint paddingLR14 paddingTB9"
                                                onClick={(e) => {
                                                    handleDownload(id);
                                                    setClicked(false);
                                                }}
                                                style={{ lineHeight: "normal" }}
                                            >
                                                {"Response Sheet"}
                                                {/* <DownLoadSvg className="download_btn" /> */}
                                            </span>
                                            {is_assessment && (
                                                <span
                                                    className="curPoint paddingLR14 paddingTB9"
                                                    onClick={(e) => {
                                                        setClicked(false);
                                                        setIsVisible(true);
                                                        getResponseHandle(
                                                            assessment,
                                                            id
                                                        );
                                                    }}
                                                    style={{
                                                        lineHeight: "normal",
                                                    }}
                                                >
                                                    {"View Analysis"}
                                                </span>
                                            )}
                                        </div>
                                    }
                                >
                                    <div
                                        className="flex alignStart"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                    >
                                        <MoreSvg />
                                    </div>
                                </Popover>
                            </div>
                        </div>
                    }
                    key="1"
                >
                    {filterTeams?.active?.length === 0 ||
                    filterTeams?.active?.length > 1 ? (
                        <>
                            <div className="panel-label">
                                <div className="font12 dove_gray_cl">
                                    Teams & Completion Rate
                                </div>
                            </div>
                            <div className="session--details">
                                {teams?.map(
                                    ({ name, average_completion, id }) => {
                                        return (
                                            <span
                                                key={id}
                                                className="top__label"
                                            >
                                                <span>{name}</span>
                                                <span
                                                    style={{
                                                        color:
                                                            average_completion >=
                                                            75
                                                                ? "#52C41A"
                                                                : average_completion >=
                                                                  50
                                                                ? "#ECA51D"
                                                                : "#FF6365",
                                                    }}
                                                >
                                                    {formatFloat(
                                                        average_completion
                                                    )}
                                                    %
                                                </span>
                                            </span>
                                        );
                                    }
                                )}
                            </div>
                        </>
                    ) : filterTeams?.active?.length === 1 ? (
                        <div className="session--details--rep padding20">
                            <div
                                className="flex1"
                                style={{
                                    borderRight: "1px solid #99999933",
                                }}
                            >
                                <div className="bold600 font14">
                                    Sessions Completed
                                </div>
                                <div className="users--container">
                                    {reps_with_complete_session?.map((e) => (
                                        <User {...e} key={e.id} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex1 paddingL16">
                                <div className="bold600 font14">
                                    Sessions Not Completed
                                </div>
                                <div className="users--container">
                                    {reps_with_incomplete_session?.map((e) => (
                                        <User {...e} key={e.id} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </Panel>
            </Collapse>
            <Modal
                title={"Analysis Report"}
                visible={isVisible}
                onCancel={() => setIsVisible(false)}
                centered={true}
                className="coaching_modal"
                onOk={() => {}}
                width={855}
                footer={[
                    <Button key="submit" type="primary" onClick={downloadImage}>
                        Download
                    </Button>,
                ]}
                closeIcon={<CloseSvg />}
            >
                <Spinner loading={isLoding}>
                    {!isLoding && <img src={imageUrl} ref={imgRef} />}
                </Spinner>
            </Modal>
        </div>
    );
};

const User = ({ ...e }) => (
    <div className="user">
        <div
            className="avatar"
            style={{
                backgroundColor: getColor(getDisplayName(e)),
            }}
        >
            {getDisplayName(e)
                .split(" ")
                .reduce((prev, cur) => {
                    return prev + cur?.[0];
                }, "")}
        </div>
        <span className="user_name">{getDisplayName(e)}</span>
    </div>
);
