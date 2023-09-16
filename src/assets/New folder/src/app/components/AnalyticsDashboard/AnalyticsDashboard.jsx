import routes from "@constants/Routes/index";
import PageFilters from "@presentational/PageFilters/PageFilters";
import FallbackUI from "@presentational/reusables/FallbackUI";
import NotFound from "@presentational/reusables/NotFound";
import { Button } from "antd";
import React, {
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import {
    Redirect,
    Route,
    Switch,
    useHistory,
    useLocation,
} from "react-router-dom";
import FillterSvg from "app/static/svg/FillterSvg";
import ManagerCoachingDashboard from "../Dashboard/Coaching/ManagerCoachingDashboard";
import RepCoachingDashboard from "../Dashboard/Coaching/RepCoachingDashboard";
import CustomTabs from "../Resuable/Tabs/CustomTabs";
import { DashboardFiltersDrawer } from "./Components/DashboardFiltersDrawer";
import OverallAnalytics from "./Pages/OverallAnalytics";
import TeamLevelAnalytics from "./Pages/TeamLevelAnalytics";
import {
    CoachingTab,
    dashboardRoutes,
    report_types,
} from "./Constants/dashboard.constants";
import { HomeDashboardContext } from "./Context/HomeDashboardContext";
import "./style.scss";
import { saveAs } from "file-saver";

import useGetDashboardPayload from "./Hooks/useGetDashboardPayload";
import { handleDownloadRequest } from "@apis/audit_report/index";
import { getError } from "@apis/common/index";
import apiErrors from "@apis/common/errors";
import {
    changeActiveTeam,
    openNotification,
    setActiveCallDuration,
    setActiveRep,
} from "@store/common/actions";
import ScheduleReportModal from "../Resuable/Schedule Report Modal/ScheduleReportModal";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";
import { useDispatch } from "react-redux";
import dashboardConfig from "@constants/Dashboard/index";
import RepLevelAnalytics from "./Pages/RepLevelAnalytics";
import ParameterLevelAnalytics from "./Pages/ParameterLevelAnalytics";
import ViolationLevelAnalytics from "./Pages/ViolationLevelAnalytics";
import LeadLevelAnalytics from "./Pages/LeadLevelAnalytics";
import MultiTeamLevelAnalytics from "./Pages/MultiTeamLevelAnalytics";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";
import FiltersUI from "../Accounts/Pages/DetailsPage/Components/FiltersUI";
import { setActiveSearchView } from "@store/search/actions";
import useGetActiveDashboardFilters from "./Hooks/useGetActiveDashboardFilters";
import ShareAnalyticsModal from "./Components/ShareAnalyticsModal";
import useDashboardNavigation from "./Hooks/useDashboardNavigation";
import SingleReport from "./Pages/SingleReport";
import { getAccountTags } from "@store/accounts/actions";
import { CustomSelect } from "../Resuable/index";
import CustomDashboard from "@convin/modules/home/customDashboard/CustomDashboard";
import AuditReport from "../Audit Report/AuditReport";
import FilterLinesSvg from "app/static/svg/FilterLinesSvg";
import DateFilter from "@convin/components/custom_components/Filters/DateFilter";
import EmptyDataState from "./Components/EmptyDataState";
import { NoLeadSvg } from "./Components/svg/NoLeadSvg";
import { setIsAccountLevel } from "@store/call_audit/actions";

export const is_Auditor = (code_names) => {
    let audit_manager_permissions = code_names?.find(
        (e) => e.heading === "Audit Manager"
    ).permissions;

    const editKeys = [].concat.apply(
        [],
        Object.keys(audit_manager_permissions || {}).map(
            (key) => audit_manager_permissions[key]?.edit
        )
    );

    return editKeys?.find((e) => e.code_name === "audit.can_audit")
        ?.is_selected;
};

export default React.memo(
    function AnalyticsDashboard() {
        const {
            common: {
                activeReportType,
                versionData: { stats_threshold, has_chat, feature_access },
                domain,
                versionData,
            },
            callAudit: { isAccountLevel },
            auth,
            accounts: { filters },
            dashboard: { dashboard_filters },
        } = useSelector((state) => state);

        const ref = useRef();

        const dispatch = useDispatch();

        useDashboardNavigation();

        const [visible, setVisible] = useState(false);
        const [showShare, setShowShare] = useState(false);

        const { meetingType, setMeetingType } = useContext(HomeContext);

        const [reportType, setReportType] = useState(report_types.default);
        const [showScheduleModal, setShowScheduelModal] = useState(false);

        const { getDashboardPayload } = useGetDashboardPayload();

        //either he can manage or view the coaching sessions
        const canManageCoaching = () => {
            const coaching = auth?.role?.code_names?.find(({ heading }) => {
                return heading === "Coaching";
            });

            return (
                coaching?.permissions?.["Manage Coaching"]?.view?.is_selected ||
                false
            );
        };

        const handleDownload = useCallback(
            (report_type) => {
                let url = "/analytics/download/reports/";
                let payload = getDashboardPayload();
                payload.type = report_type || activeReportType;

                return handleDownloadRequest(url, payload)
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
            },
            [activeReportType, getDashboardPayload]
        );

        const get_dashboard_label = useCallback(() => {
            return meetingType === MeetingTypeConst.chat
                ? "Chat"
                : isAccountLevel
                ? "Acc."
                : "Call";
        }, [isAccountLevel, meetingType]);

        const { labelsFunc } = dashboardConfig;

        const labelsBasedOnThreshold = labelsFunc(stats_threshold);

        const applyRepFilter = useCallback(
            ({ id }) => {
                if (typeof id !== "number") {
                    return;
                }
                dispatch(setActiveRep([Number(id)]));
                openNotification(
                    "info",
                    "Filter Applied",
                    "You have applied owner filter"
                );
            },
            [isAccountLevel]
        );

        const applyTeamFilter = useCallback(
            ({ id }) => {
                if (typeof id !== "number") {
                    return;
                }
                dispatch(changeActiveTeam([Number(id)]));
                openNotification(
                    "info",
                    "Filter Applied",
                    "You have applied team filter"
                );
            },
            [isAccountLevel]
        );

        const location = useLocation();

        const { activeFilters, handleRemove, clearSearch } =
            useGetActiveDashboardFilters();

        useEffect(() => {
            if (ref.current) ref.current.scrollTo(0, 0);
        }, [location.pathname]);

        useEffect(() => {
            if (!filters.accountTags) {
                dispatch(getAccountTags());
            }
        }, []);

        return (
            <HomeDashboardContext.Provider
                value={{
                    handleDownload,
                    setShowScheduelModal,
                    setReportType,
                    get_dashboard_label,
                    labelsBasedOnThreshold,
                    applyRepFilter,
                    applyTeamFilter,
                    filtersVisible: visible,
                }}
            >
                <Suspense fallback={<FallbackUI />}>
                    <div className="flex column height100p">
                        <div className="dashboard__header flexShrink">
                            {location.pathname === dashboardRoutes.multiTeam ? (
                                <GoBack />
                            ) : (
                                <CustomTabs />
                            )}

                            <div>
                                {location.pathname.includes(
                                    CoachingTab.path
                                ) ? (
                                    <></>
                                ) : (
                                    <div
                                        className="flex alignCenter marginB10"
                                        style={{
                                            display: `${
                                                location.pathname.includes(
                                                    "custom"
                                                )
                                                    ? "none"
                                                    : ""
                                            }`,
                                        }}
                                    >
                                        <PageFilters
                                            showTemplateSelection={
                                                versionData.domain_type ===
                                                    "b2c" &&
                                                location.pathname !==
                                                    dashboardRoutes.audit
                                            }
                                            className="topbar__filters marginL10"
                                            durationPlaceholder={
                                                isAccountLevel
                                                    ? "or Select Minimum and Maximum Account Level Duration"
                                                    : "or Select Minimum and Maximum Call Level Duration"
                                            }
                                            showChat={true}
                                            hideDuration={
                                                location.pathname ===
                                                dashboardRoutes.audit
                                            }
                                            hideRepSelect={
                                                location.pathname ===
                                                dashboardRoutes.audit
                                            }
                                            dateOptionPlaceholder={
                                                location.pathname ===
                                                dashboardRoutes.audit
                                                    ? "Select Audit Date"
                                                    : "Select created Date"
                                            }
                                        />

                                        <Button
                                            className="borderRadius4 capitalize flex alignCenter"
                                            size={36}
                                            onClick={() => setVisible(true)}
                                            style={{
                                                height: "36px",
                                                marginLeft: "10px",
                                            }}
                                        >
                                            <FilterLinesSvg
                                                style={{
                                                    lineHeight: 0,
                                                }}
                                            />
                                            <span>Filters</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {location.pathname !== dashboardRoutes.coaching &&
                        location.pathname !== dashboardRoutes.reports &&
                        activeFilters.length &&
                        !location.pathname.includes("custom") ? (
                            <div className="marginB20 flex justifySpaceBetween marginLR28 ">
                                <FiltersUI
                                    data={activeFilters}
                                    blockWidth={200}
                                    maxCount={6}
                                    removeFilter={handleRemove}
                                    clearAll={() => {
                                        clearSearch();
                                        dispatch(setActiveSearchView(0));
                                    }}
                                />
                                {location.pathname === dashboardRoutes.home && (
                                    <div className="flex alignCenter">
                                        <button
                                            onClick={() => setShowShare(true)}
                                            className="create_share_btn"
                                        >
                                            SHARE ANALYTICS
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="main__dashboard" ref={ref}>
                            <Switch>
                                <Route exact path="/home">
                                    <Redirect to="/home/analytics" />
                                </Route>
                                <Route
                                    exact
                                    path={dashboardRoutes.home}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    Analytics Dashboard
                                                </title>
                                            </Helmet>
                                            <OverallAnalytics />
                                        </>
                                    )}
                                />
                                <Route
                                    exact
                                    path={dashboardRoutes.team}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    Team Level Dashboard
                                                </title>
                                            </Helmet>
                                            <TeamLevelAnalytics />
                                        </>
                                    )}
                                />
                                <Route
                                    exact
                                    path={dashboardRoutes.multiTeam}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    Multi Team Level Dashbaord
                                                </title>
                                            </Helmet>
                                            <MultiTeamLevelAnalytics />
                                        </>
                                    )}
                                />
                                <Route
                                    exact
                                    path={dashboardRoutes.rep}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    Rep Level Dashboard
                                                </title>
                                            </Helmet>
                                            <RepLevelAnalytics />
                                        </>
                                    )}
                                />
                                <Route
                                    exact
                                    path={dashboardRoutes.parameter}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    Parameter Dashboard
                                                </title>
                                            </Helmet>
                                            <ParameterLevelAnalytics />
                                        </>
                                    )}
                                />
                                <Route
                                    exact
                                    path={dashboardRoutes.violation}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    Violation Dashboard
                                                </title>
                                            </Helmet>
                                            <ViolationLevelAnalytics />
                                        </>
                                    )}
                                />
                                <Route
                                    exact
                                    path={dashboardRoutes.lead}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>Lead Dashboard</title>
                                            </Helmet>
                                            {feature_access?.lead_score &&
                                            isAccountLevel ? (
                                                <LeadLevelAnalytics />
                                            ) : (
                                                <div className="flex column alignCenter justifyCenter height100p">
                                                    <NoLeadSvg />
                                                    <div
                                                        style={{
                                                            marginTop: "-50px",
                                                        }}
                                                        className="text-center"
                                                    >
                                                        <div className="font18 bold600 mine_shaft_cl">
                                                            Available only on
                                                            Account Level
                                                        </div>
                                                        <div className="font14 dove_gray_cl marginB20">
                                                            Please change the
                                                            “Level Filter to
                                                            Accounts” for Lead
                                                            Analysis access or
                                                            Click below button
                                                            to change the
                                                            filter.
                                                        </div>
                                                        <Button
                                                            type="primary"
                                                            onClick={() => {
                                                                dispatch(
                                                                    setIsAccountLevel(
                                                                        true
                                                                    )
                                                                );
                                                            }}
                                                        >
                                                            Change Filter
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                />

                                <Route
                                    exact
                                    path={dashboardRoutes.coaching}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    Coaching Dashboard
                                                </title>
                                            </Helmet>
                                            {canManageCoaching() ? (
                                                <ManagerCoachingDashboard />
                                            ) : (
                                                <RepCoachingDashboard />
                                            )}
                                        </>
                                    )}
                                />

                                <Route
                                    exact
                                    path={dashboardRoutes.reports}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>Reports</title>
                                            </Helmet>
                                            <SingleReport />
                                        </>
                                    )}
                                />

                                {is_Auditor(auth?.role?.code_names) && (
                                    <Route
                                        exact
                                        path={dashboardRoutes.audit}
                                        render={() => (
                                            <>
                                                <Helmet>
                                                    <meta charSet="utf-8" />
                                                    <title>
                                                        {"Audit Dashboard"}
                                                    </title>
                                                </Helmet>
                                                <AuditReport domain={domain} />
                                            </>
                                        )}
                                    />
                                )}

                                <Route
                                    path={dashboardRoutes.custom}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>Reports</title>
                                            </Helmet>
                                            <CustomDashboard />
                                        </>
                                    )}
                                />

                                <Route
                                    path={`*`}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>Not Found</title>
                                            </Helmet>
                                            <NotFound backLink={routes.HOME} />
                                        </>
                                    )}
                                />
                            </Switch>
                        </div>
                    </div>
                </Suspense>
                <DashboardFiltersDrawer
                    visible={visible}
                    setVisible={setVisible}
                />
                <ScheduleReportModal
                    setShowScheduelModal={setShowScheduelModal}
                    showScheduleModal={showScheduleModal}
                    state={{
                        type: reportType,
                    }}
                />
                <ShareAnalyticsModal {...{ showShare, setShowShare }} />
            </HomeDashboardContext.Provider>
        );
    },
    () => true
);

const GoBack = () => {
    const history = useHistory();
    return (
        <div className="flex justifySpaceBetween  marginB16">
            <div className="flex alignCenter">
                <div
                    className={"curPoint marginR12 flex alignCenter"}
                    onClick={() => history.goBack()}
                >
                    <LeftArrowSvg
                        style={{
                            fontSize: "10px",
                            marginTop: "8px",
                            transform: "scale(0.8)",
                        }}
                    />
                    <div className="paddingT10 paddingL10 font16  bold">
                        Multi Team Level Analytics
                    </div>
                </div>
            </div>
        </div>
    );
};
