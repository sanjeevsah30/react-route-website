import React, {
    useState,
    useEffect,
    Suspense,
    createContext,
    useLayoutEffect,
    useRef,
} from "react";
import { withRouter, Route, Switch, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import sidebarConfig from "@constants/Sidebar";
import { FallbackUI, NotFound } from "@reusables";
import Topbar from "../Navigation/Topbar";
import Sidebar from "../Navigation/Sidebar";
import routes from "@constants/Routes";
import { logoutUser } from "@store/auth/actions";
import Sharer from "@container/Sharer/Sharer";
import commonConfig from "@constants/common/index";
import { myCallsTour, statisticsTour } from "@tours";
import MobileDrawer from "@container/Navigation/MobileDrawer";
import Onboarding from "../../Onboarding/Onboarding";

import {
    clearSearchFilters,
    getDeafultSearchView,
    getSearchViews,
    getTrackerById,
    getFilterByShareId,
    setActiveSearchView,
    setDefaultSearchFilters,
    setSearchFilters,
} from "@store/search/actions";
import * as commonActions from "@store/common/actions";
import {
    getTemplates,
    setActiveTemplate,
    setDashboardFilters,
} from "@store/dashboard/dashboard";
import { getDomain, getLocaleDate } from "@tools/helpers";
import {
    getTemplatesForFilter,
    setIsManualLevel,
} from "@store/call_audit/actions";
import { decodeTracker } from "@tools/searchFactory";
import { setIsAccountLevel } from "@store/call_audit/actions";
import TopbarConfig from "@constants/Topbar/index";
import { axiosInstance } from "@apis/axiosInstance";
import apiErrors from "@apis/common/errors";
import apiConfigs from "@apis/common/commonApiConfig";

import { fetchAccountsStage } from "@store/accounts/actions";
import CIDashboard from "../../CI/components/CIDashboard";
import auditConfig from "@constants/Audit/index";
import ConvinGpt from "../../ConvinGPT/ConvinGpt";
import LogoutDialog from "./LogoutDialog";

export const AuditRecordContext = createContext();

export const MeetingTypeConst = {
    calls: "call",
    chat: "chat",
    email: "email",
};

const AnalyticsDashboard = React.lazy(() =>
    import("../../AnalyticsDashboard/AnalyticsDashboard")
);

const IndividualCallRoutes = React.lazy(() =>
    import("../../IndividualCall/IndividualCallRoutes")
);
const Statistics = React.lazy(() => import("../Statistics/Statistics"));
const Coaching = React.lazy(() => import("../Coaching/Coaching"));

const Settings = React.lazy(() => import("../Settings/Settings"));
const MyMeetings = React.lazy(() => import("app/components/MyMeetings"));

const AuditReport = React.lazy(() =>
    import("app/components/Audit Report/AuditReport")
);
const Accounts = React.lazy(() => import("../../Accounts/Accounts"));

const NewLibraryContainer = React.lazy(() =>
    import("../../Library/NewLibraryContainer")
);

export const HomeContext = createContext();

const MAX_ONBOARDING_DEFAULT_OPENS = 5;
const ONBOARDING_COUNT_LS_KEY = "obclsk";

function Home(props) {
    const dispatch = useDispatch();
    const playerRef = useRef();
    const initActiveTypes = {
        calls: false,
        search: false,
        statistics: false,
        coaching: false,
        table: false,
        library: false,
        settings: false,
        ci_dashboard: false,
        audit_report: false,
        home: false,
        tour: false,
        accounts: false,
        help: false,
        gpt: false,
    };

    const activePageTypeConfig = {
        // A central handler for the active types and whether the filters are to be shown or not.
        calls: {
            title: sidebarConfig.PHONE_TITLE,
            isFilterActive: false,
            hideSearch: false,
        },
        search: { title: sidebarConfig.PHONE_TITLE, isFilterActive: false },
        statistics: {
            title: sidebarConfig.STATISTICS_TITLE,
            isFilterActive: true,
        },
        coaching: {
            title: sidebarConfig.COACHING_TITLE,
            isFilterActive: false,
        },
        table: { title: sidebarConfig.TABLE_TITLE, isFilterActive: false },
        settings: {
            title: sidebarConfig.SETTINGS_TITLE,
            isFilterActive: false,
            hideSearch: true,
        },
        library: { title: sidebarConfig.LIBRARY_TITLE, isFilterActive: false },
        ci_dashboard: {
            title: sidebarConfig.CI_TITLE,
            isFilterActive: false,
        },
        // audit_report: {
        //     title: sidebarConfig.AUDIT_REPORT,
        //     isFilterActive: false,
        // },
        home: {
            title: sidebarConfig.AI_AUDIT_DASHBOARD_TITLE,
            isFilterActive: false,
        },
        accounts: {
            title: sidebarConfig.ACCOUNTS_TITLE,
            isFilterActive: false,
            hideSearch: true,
        },
        help: { title: "Help", isFilterActive: false },
        gpt: {
            title: sidebarConfig.CONVINGPT_TITLE,
            isFilterActive: false,
        },
    };

    const domain = useSelector((state) => state.common.domain);
    const [activeTypes, setactiveTypes] = useState(initActiveTypes);
    const allCallTypes = useSelector((state) => state.common.call_types);
    const versionData = useSelector((state) => state.common.versionData);
    const allUsers = useSelector((state) => state.common.users);
    const allTags = useSelector((state) => state.common.tags);
    const { filterTeams, filterDates, filterCallDuration } = useSelector(
        (state) => state.common
    );
    const { defaultView } = useSelector((state) => state.search);
    const { dashboard_filters } = useSelector((state) => state.dashboard);

    const [_, setshowUploadCall] = useState(false);
    const [__, setshowJoinCall] = useState(false);
    const [activePageConfig, setactivePageConfig] = useState(
        activePageTypeConfig.calls
    ); // State to decide the active title of the page. Default : My Calls.
    // Call Overview Details
    // Sharer Config
    const [sharerConfig, setsharerConfig] = useState({
        id: 0,
        visible: false,
    });

    const isCoachingPermissionEnable = useSelector(
        (state) =>
            state.auth?.role?.code_names?.find(
                (obj) => obj?.heading === "Coaching"
            )?.is_visible
    );
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
        if (
            +localStorage.getItem(ONBOARDING_COUNT_LS_KEY) >=
            MAX_ONBOARDING_DEFAULT_OPENS
        ) {
            return false;
        } else {
            return true;
        }
    });

    const [callTags, setCallTags] = useState(dashboard_filters.call_tags);
    const [accTags, setAccTags] = useState(dashboard_filters.acc_tags);
    const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

    useEffect(() => {
        if (props.location.pathname === routes.HOME) {
            if (versionData?.domain_type === "b2c") {
                props.history.push(routes.AI_AUDIT_DASHBOARD);
                setactiveTypes({
                    ...initActiveTypes,
                    home: true,
                });
                setactivePageConfig(activePageTypeConfig.ai_audit_dashboard);
            } else {
                props.history.push(routes.CALLS);
                setactiveTypes({
                    ...initActiveTypes,
                    calls: true,
                });
                setactivePageConfig(activePageTypeConfig.calls);
            }
        } else {
            const pageTypes = Object.keys(initActiveTypes);
            const active = pageTypes.filter((e) =>
                props.location.pathname.includes(e)
            );
            if (active) {
                if (active[0] === "search") {
                    setactiveTypes({
                        ...initActiveTypes,
                        calls: true,
                    });
                } else {
                    setactiveTypes({
                        ...initActiveTypes,
                        [active[0]]: true,
                    });
                }
            }
            setactivePageConfig(
                activePageTypeConfig[props.location.pathname.split("/")[1]]
            );
            //------------------------
        }
        if (props.location.pathname === routes.CALL) {
            setIsOnboardingOpen(false);
        }
    }, [props.location.pathname]);

    let location = useLocation();

    const search = location.search;
    const widget = new URLSearchParams(search).get("widget");
    if (widget) {
        document.querySelector("body").classList.add("widget_container");
    }

    useEffect(() => {
        if (!allCallTypes.length) {
            dispatch(commonActions.getAllCallTypes());
        }

        if (!allUsers.length) {
            dispatch(commonActions.getAllUsers());
        }

        if (!allTags.length) {
            dispatch(commonActions.getTags());
        }
        if (filterTeams.teams.length <= 1) {
            dispatch(commonActions.getAllTeams());
        }
        // if (!violations.data.length) {
        //     dispatch(getViolationsForDashboard());
        // }

        dispatch(fetchAccountsStage());
    }, []);

    // Set details for individual calls

    const { auth } = useSelector((state) => state);
    const { role } = auth;

    const canAccess = (heading) => {
        if (heading === "Violation Manager") {
            let audit_manager_permissions = role?.code_names?.find(
                (e) => e.heading === "Audit Manager"
            ).permissions;

            const editKeys = [].concat.apply(
                [],
                Object.keys(audit_manager_permissions || {}).map(
                    (key) => audit_manager_permissions[key]?.edit
                )
            );

            return editKeys?.find(
                (e) => e.code_name === "audit.can_manage_violation"
            )?.is_selected;
        }

        if (heading === "Can Audit") {
            let audit_manager_permissions = role?.code_names?.find(
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
        }

        if (heading === sidebarConfig.CONVINGPT_TITLE) {
            return true;
        }

        return role?.code_names?.find((e) => e.heading === heading)?.is_visible;
    };

    const is_Auditor = (code_names) => {
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

    const auditor_permissions = (code_names) => {
        let audit_manager_permissions = code_names?.find(
            (e) => e.heading === "Audit Manager"
        ).permissions;

        const editKeys = [].concat.apply(
            [],
            Object.keys(audit_manager_permissions || {}).map(
                (key) => audit_manager_permissions[key]?.edit
            )
        );

        let permision_obj = {};
        editKeys?.forEach(
            (e) => (permision_obj[e.code_name.split(".")[1]] = e.is_selected)
        );
        return permision_obj;
    };

    const handleLogout = () => {
        const { refresh, access } = JSON.parse(
            window.localStorage.getItem("authTokens")
        );
        dispatch(commonActions.setLoader(true));
        axiosInstance
            .post(
                `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/person/logout/`,
                {
                    refresh,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                }
            )
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    dispatch(commonActions.setLoader(false));
                    return commonActions.showError(res);
                }
                dispatch(commonActions.setLoader(false));
                dispatch(logoutUser());
                props.history.push(routes.SIGNIN);
            })
            .catch((err) => {
                dispatch(commonActions.setLoader(false));
                return commonActions.showError(err);
            });
    };

    const handleActiveComponent = (type) => {
        if (type === "logout") {
            return setLogoutDialogVisible(true);
            // handleLogout();
        } else if (type === "onboarding") {
            return setIsOnboardingOpen(!isOnboardingOpen);
        } else {
            setactiveTypes({
                ...initActiveTypes,
                [type]: true,
            });

            if (type === "ci_dashboard") {
                props.history.push(
                    type === "ci_dashboard"
                        ? versionData.noInsightTab === false
                            ? `/${type}/insights`
                            : `/${type}/custom_tracking`
                        : `/${type}`
                );
            } else if (type === "library") {
                props.history.push(`/${type}/resources`);
            } else if (type === "gpt" && activePageConfig?.title === "GPT") {
                return;
            } else {
                props.history.push(
                    type === "gpt" ? `/${type}/chat` : `/${type}`
                );
            }

            setactivePageConfig(activePageTypeConfig[type]);
        }
    };

    const callHandlers = {
        // Object containing the functions required to handle uploading and scheduling of calls.
        handleUpload: () => {
            setshowUploadCall((isOpen) => !isOpen);
        },
        handleJoinCall: () => {
            setshowJoinCall((isOpen) => !isOpen);
        },
        sharerHandler: (id, visible) => {
            setsharerConfig({
                id: id,
                visible: visible,
            });
        },
    };

    useEffect(() => {
        if (props.location.pathname !== routes.CALL) {
            const currentCount = +localStorage.getItem(ONBOARDING_COUNT_LS_KEY);
            currentCount
                ? localStorage.setItem(
                      ONBOARDING_COUNT_LS_KEY,
                      currentCount + 1
                  )
                : localStorage.setItem(ONBOARDING_COUNT_LS_KEY, 1);
        }
    }, []);

    useEffect(() => {
        versionData?.filters?.processingStatus !== undefined &&
            dispatch(
                setDefaultSearchFilters({
                    processing_status: versionData.filters.processingStatus,
                })
            );
        if (versionData?.filters?.defaultAuditManual) {
            dispatch(
                setDashboardFilters({
                    ...dashboard_filters,
                    audit_filter: {
                        audit_type: auditConfig.MANUAL_AUDIT_TYPE,
                        auditors: [0],
                        manualAuditDateRange: [null, null],
                    },
                })
            );

            dispatch(
                setSearchFilters({
                    audit_filter: {
                        audit_type: auditConfig.MANUAL_AUDIT_TYPE,
                        auditors: [0],
                        manualAuditDateRange: [null, null],
                    },
                })
            );
        }
        if (versionData?.filters?.is_default_chat) {
            setMeetingType(MeetingTypeConst.chat);
        }
    }, [versionData?.filters?.processingStatus]);

    useEffect(() => {
        const url = new URLSearchParams(document.location.search);
        const start_date = url.get("start_date");
        const end_date = url.get("end_date");

        if (start_date || end_date) {
            return;
        }
        versionData?.filters?.defaultDate !== undefined &&
            dispatch(
                commonActions.setActiveFilterDate(
                    versionData?.filters?.defaultDate
                )
            );
    }, [versionData?.filters?.defaultDate]);

    useEffect(() => {
        const url = new URLSearchParams(document.location.search);
        const duration = url.get("duration");

        if (duration) {
            return;
        }

        if (
            versionData?.filters?.defaultDurationRange?.[0] === 0 &&
            versionData?.filters?.defaultDurationRange?.[1] === null
        ) {
            return dispatch(commonActions.setActiveCallDuration(0));
        }
        versionData?.filters?.defaultDurationRange &&
            dispatch(
                commonActions.setCustomFilterDuration(
                    versionData?.filters?.defaultDurationRange
                )
            );
    }, [versionData?.filters?.defaultDurationRange]);

    useEffect(() => {
        const url = new URLSearchParams(document.location.search);
        const level = url.get("level");
        if (level === "call") {
            return dispatch(setIsAccountLevel(false));
        } else if (level === "account") {
            return dispatch(setIsAccountLevel(true));
        }
        versionData?.filters?.isAccountLevelDashboard !== undefined &&
            dispatch(
                setIsAccountLevel(versionData.filters.isAccountLevelDashboard)
            );
    }, [versionData?.filters?.isAccountLevelDashboard]);

    const [fetchingShare, setFetchingShare] = useState(false);

    useLayoutEffect(() => {
        if (defaultView === null) {
            const url = new URLSearchParams(document.location.search);
            const team_id = url.get("team");
            const rep_id = url.get("rep");
            const duration = url.get("duration");
            const max_time = url.get("max_time");
            const start_date = url.get("start_date");
            const end_date = url.get("end_date");
            const min_time = url.get("min_time");
            const tracker = url.get("tracker");
            const share_id = url.get("share_id");

            const template = url.get("template");
            const meeting_type = url.get("meeting_type");

            if (share_id) {
                setFetchingShare(true);
                dispatch(getFilterByShareId(share_id))
                    .then((res) => {
                        dispatch(setActiveSearchView(0));
                        setFiltersForSearch(res.json_filters);
                        setFetchingShare(false);
                    })
                    .catch((err) => {
                        dispatch(clearSearchFilters());
                        dispatch(setActiveSearchView(0));
                        setFetchingShare(false);
                    });
            }

            if (tracker) {
                dispatch(getTrackerById(tracker))
                    .then((res) => {
                        dispatch(setActiveSearchView(0));
                        setFiltersForSearch(JSON.parse(res.search_json));
                        try {
                            const min = min_time
                                .split(" ")
                                .filter(
                                    (val, idx) =>
                                        idx !==
                                        Number(TopbarConfig.defaultDuration)
                                )
                                .join(" ");
                            const max = max_time
                                .split(" ")
                                .filter(
                                    (val, idx) =>
                                        idx !==
                                        Number(TopbarConfig.defaultDuration)
                                )
                                .join(" ");

                            if (min && max) {
                                const newRange = [
                                    new Date(min).toISOString(),
                                    new Date(max).toISOString(),
                                ];
                                let newOption =
                                    getLocaleDate(newRange[0]) +
                                    " - " +
                                    getLocaleDate(newRange[1]);

                                dispatch(
                                    commonActions.setFilterDates({
                                        [newOption]: {
                                            name: newOption,
                                            dateRange: newRange,
                                        },
                                        ...filterDates.dates,
                                    })
                                );

                                dispatch(
                                    commonActions.setActiveFilterDate(newOption)
                                );
                            }
                        } catch (err) {}
                    })
                    .catch((err) => {
                        dispatch(setActiveSearchView(0));
                        dispatch(clearSearchFilters());
                    });
            }

            const changeTeam =
                !props?.location?.pathname?.includes("ai_audit_dashboard") &&
                !(team_id || rep_id || duration || (start_date && end_date)) &&
                (!tracker || !share_id);

            template && dispatch(setActiveTemplate(+template));
            meeting_type && setMeetingType(meeting_type);

            duration &&
                dispatch(
                    commonActions.setCustomFilterDuration([
                        duration / 60 || 5,
                        null,
                    ])
                );

            rep_id && dispatch(commonActions.setActiveRep([Number(rep_id)]));

            dispatch(
                commonActions.changeActiveTeam(team_id ? [Number(team_id)] : [])
            );

            if (start_date && end_date) {
                const newRange = [
                    new Date(+start_date).toISOString(),
                    new Date(+end_date).toISOString(),
                ];
                let newOption =
                    getLocaleDate(newRange[0]) +
                    " - " +
                    getLocaleDate(newRange[1]);

                dispatch(
                    commonActions.setFilterDates({
                        [newOption]: {
                            name: newOption,
                            dateRange: newRange,
                        },
                        ...filterDates.dates,
                    })
                );

                dispatch(commonActions.setActiveFilterDate(newOption));
            }

            dispatch(getDeafultSearchView(changeTeam, tracker || share_id));

            dispatch(getSearchViews());
        }
        dispatch(getTemplates());
    }, []);

    useEffect(() => {
        dispatch(getTemplatesForFilter());
    }, []);

    const updateTopbarFilters = (data) => {
        dispatch(
            commonActions.changeActiveTeam(
                data.teamId ? [...data.teamId] : [],
                undefined,
                false
            )
        );

        if (data?.custom_data?.template?.id) {
            dispatch(setActiveTemplate(+data?.custom_data?.template?.id));
        }
        if (data?.custom_data?.isAccountLevel) {
            dispatch(setIsAccountLevel(true));
        }

        dispatch(
            commonActions.setActiveRep(
                data.repId
                    ? data?.repId?.length
                        ? data?.repId
                        : [data.repId]
                    : []
            )
        );
        let foundDuration = false;
        if (data.duration) {
            Object.keys(filterCallDuration.options).forEach((option) => {
                let curOption = filterCallDuration.options[option].value;

                if (
                    data.duration[0] === curOption[0] &&
                    data.duration[1] === curOption[1]
                ) {
                    foundDuration = true;
                    dispatch(commonActions.setActiveCallDuration(option));
                }
            });
            if (!foundDuration) {
                dispatch(commonActions.setCustomFilterDuration(data.duration));
            }
        }

        let foundDate = false;

        Object.keys(filterDates.dates).forEach((date) => {
            let curDate = filterDates.dates[date].dateRange;

            if (data.startTime === curDate[0] && data.endTime === curDate[1]) {
                foundDate = true;
                dispatch(commonActions.setActiveFilterDate(date));
            }
        });
        if (!foundDate) {
            let newOption =
                getLocaleDate(data.startTime) +
                " - " +
                getLocaleDate(data.endTime);

            dispatch(
                commonActions.setFilterDates({
                    [newOption]: {
                        name: newOption,
                        dateRange: [data.startTime, data.endTime],
                    },
                    ...filterDates.dates,
                })
            );

            dispatch(commonActions.setActiveFilterDate(newOption));
        }

        // updateDateFilter(data);
    };

    const setFiltersForSearch = (data) => {
        let decodedData = decodeTracker(data);

        dispatch(setIsManualLevel(decodedData.audit_filter));
        dispatch(
            setSearchFilters({
                client: decodedData?.client
                    ? {
                          value: decodedData?.client,
                          key: decodedData?.client,
                          label: decodedData?.custom_data?.client?.name || "",
                      }
                    : null,

                keywords: decodedData?.custom_data?.keywords || [],
                keyword_present_in_call: decodedData?.searchKeywords?.isInCall,
                keyword_said_by_rep: decodedData?.searchKeywords?.saidByRep,
                keyword_said_by_others:
                    decodedData?.searchKeywords?.saidByClient,
                call_tags: decodedData?.filterTags || [],
                call_types: decodedData?.callType || null,
                no_of_questions_by_rep: decodedData?.questions?.byOwner,
                no_of_questions_by_others: decodedData?.questions?.byClient,
                topic: decodedData?.topics?.topic,
                topic_in_call: decodedData?.topics?.inCall,
                interactivity: {
                    clientLongestMonologue:
                        decodedData?.interactivity?.clientLongestMonologue,
                    clientTalkRatio:
                        decodedData?.interactivity?.clientTalkRatio,
                    interactivity: decodedData?.interactivity?.interactivity,
                    ownerLongestMonologue:
                        decodedData?.interactivity?.ownerLongestMonologue,
                    ownerTalkRatio: decodedData?.interactivity?.ownerTalkRatio,
                    patience: decodedData?.interactivity?.patience,
                },
                recording_medium: decodedData?.conferenceMedium || null,
                processing_status: decodedData?.processing_status,
                template: decodedData?.custom_data?.template || null,
                activeTemplate: decodedData?.custom_data?.template?.id || null,
                activeQuestions:
                    decodedData?.custom_data?.questions &&
                    Object.keys(decodedData?.custom_data?.questions).length
                        ? { ...decodedData?.custom_data?.questions }
                        : {},
                // auditQuestions: [],
                audit_filter: decodedData.audit_filter,
            })
        );

        updateTopbarFilters(decodedData);
    };

    const [meetingType, setMeetingType] = useState(MeetingTypeConst.calls);
    return (
        <HomeContext.Provider
            value={{
                onboardingStatus: [isOnboardingOpen, setIsOnboardingOpen],
                handleActiveComponent,
                updateTopbarFilters,
                setFiltersForSearch,
                canAccess,
                is_Auditor,
                meetingType,
                setMeetingType,
                versionData,
                callTags,
                accTags,
                setCallTags,
                setAccTags,
                auditor_permissions,
            }}
        >
            <div className={`appHome ${widget ? "widget" : ""}`}>
                {sharerConfig.visible && (
                    <Sharer
                        domain={domain}
                        config={sharerConfig}
                        sharerHandler={callHandlers.sharerHandler}
                    />
                )}
                <MobileDrawer
                    activeTypes={activeTypes}
                    handleClick={handleActiveComponent}
                />
                <Sidebar
                    activeTypes={activeTypes}
                    handleClick={handleActiveComponent}
                />
                <LogoutDialog
                    open={logoutDialogVisible}
                    onOk={handleLogout}
                    onCancel={() => setLogoutDialogVisible(false)}
                />
                <div
                    className={`appHome-right flex1 ${widget ? "widget" : ""}`}
                >
                    {versionData?.domain_type ===
                    "b2c" ? null : !versionData.logo ? (
                        <Onboarding />
                    ) : (
                        <></>
                    )}

                    {props?.location?.search?.includes("acc_id") ||
                    ((props?.location?.pathname.includes(routes.CALL) ||
                        props?.location?.pathname.includes(routes.CHAT)) &&
                        !props?.location?.pathname.includes(routes.CALLS) &&
                        !props?.location?.pathname.includes(routes.GPT)) ? (
                        <></>
                    ) : (
                        <Topbar
                            activePageConfig={activePageConfig}
                            callHandlers={callHandlers}
                        />
                    )}

                    <Suspense fallback={<FallbackUI />}>
                        <div className="appHome-right-bottom">
                            <Switch>
                                <Route
                                    path={[
                                        routes.CALL,
                                        routes.CHAT,
                                        routes.EMAIL,
                                    ]}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {sidebarConfig.PHONE_TITLE}
                                                </title>
                                            </Helmet>
                                            <AuditRecordContext.Provider
                                                value={{ playerRef }}
                                            >
                                                <IndividualCallRoutes />
                                            </AuditRecordContext.Provider>
                                        </>
                                    )}
                                />
                                <Route
                                    path={[routes.CALLS, routes.SEARCH]}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {sidebarConfig.PHONE_TITLE}
                                                </title>
                                            </Helmet>
                                            <MyMeetings
                                                module="My Meetings"
                                                tourKey={
                                                    commonConfig.TOURS_KEYS
                                                        .overview
                                                }
                                                tourSteps={myCallsTour}
                                                callHandlers={callHandlers}
                                            />
                                        </>
                                    )}
                                />
                                <Route
                                    path={routes.STATISTICS}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {
                                                        sidebarConfig.STATISTICS_TITLE
                                                    }
                                                </title>
                                            </Helmet>
                                            <Statistics
                                                module="Stats"
                                                tourKey={
                                                    commonConfig.TOURS_KEYS
                                                        .statistics
                                                }
                                                tourSteps={statisticsTour}
                                            />
                                        </>
                                    )}
                                />

                                {isCoachingPermissionEnable ? (
                                    <Route
                                        exact
                                        path={`${routes.COACHING}/:sessionId`}
                                        render={() => (
                                            <>
                                                <Helmet>
                                                    <meta charSet="utf-8" />
                                                    <title>
                                                        {
                                                            sidebarConfig.COACHING_TITLE
                                                        }
                                                    </title>
                                                </Helmet>
                                                <Coaching />
                                            </>
                                        )}
                                    />
                                ) : null}
                                <Route
                                    path={`${routes.GPT}`}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {
                                                        sidebarConfig.CONVINGPT_TITLE
                                                    }
                                                </title>
                                            </Helmet>
                                            <ConvinGpt />
                                        </>
                                    )}
                                />
                                <Route
                                    path={routes.LIBRARY.resources}
                                    render={() => (
                                        <>
                                            {canAccess("Library") ? (
                                                <>
                                                    <Helmet>
                                                        <meta charSet="utf-8" />
                                                        <title>
                                                            {
                                                                sidebarConfig.LIBRARY_TITLE
                                                            }
                                                        </title>
                                                    </Helmet>
                                                    <NewLibraryContainer />
                                                </>
                                            ) : (
                                                <NotFound
                                                    backLink={routes.CALLS}
                                                />
                                            )}
                                        </>
                                    )}
                                />
                                <Route
                                    path={routes.LIBRARY.assessment}
                                    render={() => (
                                        <>
                                            {canAccess("Library") ? (
                                                <>
                                                    <Helmet>
                                                        <meta charSet="utf-8" />
                                                        <title>
                                                            {
                                                                sidebarConfig.LIBRARY_TITLE
                                                            }
                                                        </title>
                                                    </Helmet>
                                                    <NewLibraryContainer />
                                                </>
                                            ) : (
                                                <NotFound
                                                    backLink={routes.CALLS}
                                                />
                                            )}
                                        </>
                                    )}
                                />
                                <Route
                                    path={routes.SETTINGS}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {
                                                        sidebarConfig.SETTINGS_TITLE
                                                    }
                                                </title>
                                            </Helmet>
                                            <Settings module="Settings" />
                                        </>
                                    )}
                                />
                                {canAccess("Customer Intelligence") && (
                                    <Route
                                        path={`${routes.CI_DASHBOARD}`}
                                        render={() => (
                                            <>
                                                {/* <Helmet>
                                                    <meta charSet="utf-8" />
                                                    <title>
                                                        {sidebarConfig.CI_TITLE}
                                                    </title>
                                                </Helmet> */}
                                                <CIDashboard />
                                            </>
                                        )}
                                    />
                                )}

                                {versionData?.domain_type === "b2c" && (
                                    <Route
                                        path={routes.AI_AUDIT_DASHBOARD}
                                        render={() => (
                                            <>
                                                <Helmet>
                                                    <meta charSet="utf-8" />
                                                    <title>
                                                        {
                                                            sidebarConfig.AI_AUDIT_DASHBOARD_TITLE
                                                        }
                                                    </title>
                                                </Helmet>
                                                <AnalyticsDashboard />
                                            </>
                                        )}
                                    />
                                )}
                                {/* {versionData?.domain_type === "b2c" && (
                                    <Route
                                        path={`${routes.AI_AUDIT_DASHBOARD}/:details`}
                                        render={() => (
                                            <>
                                                <Helmet>
                                                    <meta charSet="utf-8" />
                                                    <title>
                                                        {
                                                            sidebarConfig.AI_AUDIT_DASHBOARD_TITLE
                                                        }
                                                    </title>
                                                </Helmet>

                                                <AnalyticsDashboard />
                                            </>
                                        )}
                                    />
                                )} */}
                                {is_Auditor(role?.code_names) &&
                                    versionData.domain_type === "b2b" && (
                                        <Route
                                            path={routes.AUDIT_REPORT}
                                            render={() => (
                                                <>
                                                    <Helmet>
                                                        <meta charSet="utf-8" />
                                                        <title>
                                                            {
                                                                sidebarConfig.AUDIT_REPORT
                                                            }
                                                        </title>
                                                    </Helmet>
                                                    <AuditReport
                                                        domain={domain}
                                                    />
                                                </>
                                            )}
                                        />
                                    )}
                                <Route
                                    path={routes.ACCOUNTS}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {
                                                        sidebarConfig.ACCOUNTS_TITLE
                                                    }
                                                </title>
                                            </Helmet>
                                            <Accounts />
                                        </>
                                    )}
                                />
                                <Route
                                    render={() => {
                                        return (
                                            <NotFound backLink={routes.CALLS} />
                                        );
                                    }}
                                />
                            </Switch>
                        </div>
                    </Suspense>
                </div>
            </div>
        </HomeContext.Provider>
    );
}

export default withRouter(Home);
