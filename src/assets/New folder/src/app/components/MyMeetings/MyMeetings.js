import callsConfig from "@constants/MyCalls/index";
import { shareCall } from "@apis/sharer/index";
import { prepareSearchData } from "../../../store/search/utils";
import React, {
    useEffect,
    useReducer,
    useState,
    createContext,
    useContext,
    useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import withReactTour from "hoc/withReactTour";
import UpcomingCalls from "./UpcomingCalls";
import {
    updateSidebarData,
    reInitSidebar,
    getUpcomingCalls,
} from "@store/calls/actions";
import { Search } from "../Search/index";
import commonConfig from "@constants/common/index";
import apiErrors from "@apis/common/errors";
import { openNotification } from "@store/common/actions";
import { searchTour } from "@tours";
import { compose } from "redux";
import withErrorCollector from "hoc/withErrorCollector";
import {
    Button,
    Checkbox,
    Col,
    Collapse,
    Drawer,
    Popconfirm,
    Row,
    Select,
    Tooltip,
    Modal,
    Switch,
    Alert,
    notification,
    Input,
    Spin,
} from "antd";
import CloseSvg from "app/static/svg/CloseSvg";

import FillterSvg from "app/static/svg/FillterSvg";
import PageFilters from "@presentational/PageFilters/PageFilters";
import AlertSvg from "app/static/svg/AlertSvg";
import { TickSvg } from "app/static/svg/TickSvg";
import CircleInfoSvg from "app/static/svg/CircleInfoSvg";
import LinkSvg from "app/static/svg/LinkSvg";
import MinusSvg from "app/static/svg/MinusSvg";
import PlusSvg from "app/static/svg/PlusSvg";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";
import MailSvg from "app/static/svg/MailSvg";
import { LoadingOutlined } from "@ant-design/icons";

import {
    clearSearchFilters,
    deleteSearchView,
    getTrackers,
    setActiveSamplingRule,
    setActiveSearchView,
    setSearchFilters,
} from "@store/search/actions";
import {
    setUpcomingCallsActiveTeamFilter,
    setUpcomingCallsParticipantsFilters,
} from "@store/calls/actions";
import FiltersUI from "../Accounts/Pages/DetailsPage/Components/FiltersUI";
import {
    changeActiveTeam,
    changeCallType,
    clearFilters,
    getSalesTasks,
    setActiveCallDuration,
    setActiveFilterDate,
    setActiveRep,
    setGSText,
} from "@store/common/actions";
import config from "@constants/Search/index";
import DeleteSvg from "app/static/svg/DeleteSvg";
import Icon from "@presentational/reusables/Icon";
import { capitalizeFirstLetter } from "@tools/helpers";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";
import SortArrow from "../Resuable/SortArrow/SortArrow";
import { AI_SCORE_SORT_KEY } from "@constants/Account/index";
import InfoCircleSvg from "../../static/svg/InfoCircleSvg";
import FilterLinesSvg from "../../static/svg/FilterLinesSvg";
import CalendarFilledSvg from "../../static/svg/CalendarFilledSvg";
import ChevronDownSvg from "../../static/svg/ChevronDownSvg";
import {
    dowloadCallList,
    getCallList,
} from "../../../store/callListSlice/callListSlice";
import { useHistory } from "react-router-dom";
import { DownLoadSvg } from "app/static/svg/indexSvg";
import DownloadSvg from "app/static/svg/DownloadSvg";
import { getError } from "@apis/common/index";
import { Helmet } from "react-helmet";
import sidebarConfig from "app/constants/Sidebar";

const { Panel } = Collapse;
const { Option, OptGroup } = Select;
const { TextArea } = Input;

const initialState = {
    showUpcommingCalls: false,
    showFilters: false,
    showAlerts: false,
    showCreateTrackerModal: false,
    showCrateViewModal: false,
};

export const SearchContext = createContext();

const constants = {
    SHOW_UPCOMMING_CALLS: "SHOW_UPCOMMING_CALLS",
    CLOSE_UPCOMMING_CALLS: "CLOSE_UPCOMMING_CALLS",

    SHOW_FILTERS: "SHOW_FILTERS",
    CLOSE_FILTERS: "CLOSE_FILTERS",
    SHOW_ALERTS: "SHOW_ALERTS",
    CLOSE_ALERTS: "CLOSE_ALERTS",
    SHOW_TRACKER_MODAL: "SHOW_TRACKER_MODAL",
    CLOSE_TRACKER_MODAL: "CLOSE_TRACKER_MODAL",
    SHOW_CREATE_VIEW_MODAL: "SHOW_CREATE_VIEW_MODAL",
    CLOSE_CREATE_VIEW_MODAL: "CLOSE_CREATE_VIEW_MODAL",
};

function reducer(state, action) {
    switch (action.type) {
        case constants.SHOW_UPCOMMING_CALLS:
            return { showUpcommingCalls: true };
        case constants.CLOSE_UPCOMMING_CALLS:
            return { showUpcommingCalls: false };
        case constants.SHOW_FILTERS:
            return { showFilters: true };
        case constants.CLOSE_FILTERS:
            return { showFilters: false };
        case constants.SHOW_ALERTS:
            return { showAlerts: true };
        case constants.CLOSE_ALERTS:
            return { showAlerts: false };
        case constants.SHOW_TRACKER_MODAL:
            return { showCreateTrackerModal: true };
        case constants.CLOSE_TRACKER_MODAL:
            return { showCreateTrackerModal: false };
        case constants.SHOW_CREATE_VIEW_MODAL:
            return { showCrateViewModal: true };
        case constants.CLOSE_CREATE_VIEW_MODAL:
            return { showCrateViewModal: false };
        default:
            throw new Error();
    }
}

const MyMeetings = (props) => {
    const dispatch = useDispatch();
    const [state, setState] = useReducer(reducer, initialState);
    const [showFilters, setShowFilters] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [isSharing, setisSharing] = useState(false);
    const [showAlret, setshowAlret] = useState(false);
    const [mailError, setmailError] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [activeSidebarView, setActiveSidebarView] = useState(
        callsConfig.SEARCH_VIEW
    );
    const [activeMenu, setActiveMenu] = useState(callsConfig.COMPLETED_TYPE);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showUpdateView, setShowUpdateView] = useState(false);
    const { updateTopbarFilters, setFiltersForSearch } =
        useContext(HomeContext);
    const history = useHistory();
    const {
        common,
        search: {
            fields,
            views,
            defaultView,
            activeFilters,
            defaultSearchFilters,
            searchFilters,
            samplingRules,
            activeSamplingRule,
        },
        calls: {
            upcomingCallsFilters: {
                filterTeams: upcomingFiltersTeams,
                filterReps: upcomingFilterReps,
            },
        },
        callListSlice: { count, calls, loadingCalls },
        callAudit: { searchAuditTemplate },
        auth,
        accounts: { filters },
    } = useSelector((state) => state);

    const {
        versionData,
        filterTeams,
        showLoader: loading,
        filterReps,
        filterDates,
        filterCallDuration,
        gsText,
        domain,
        users,
    } = common;

    const [newTrackerModal, setnewTrackerModal] = useState(false);

    // const [filtersData, setfiltersData] = useState({});

    const prepareData = (flag = true) => {
        let data = {
            client: searchFilters?.client?.value,
            searchKeywords: {
                keywords: searchFilters?.keywords,
                isInCall: searchFilters?.keyword_present_in_call,
                saidByOwner: searchFilters?.keyword_said_by_rep,
                saidByClient: searchFilters?.keyword_said_by_others,
            },
            filterTags: searchFilters?.call_tags,
            questions: {
                byOwner: searchFilters?.no_of_questions_by_rep,
                byClient: searchFilters?.no_of_questions_by_others,
            },
            topics: {
                topic: searchFilters?.topic,
                inCall: searchFilters?.topic_in_call,
            },
            interactivity: searchFilters?.interactivity,
            callType: searchFilters?.call_types,
            callDuration:
                filterCallDuration.options[filterCallDuration.active].value,
            activeReps: filterReps.active,
            activeTeam: filterTeams.active,
            activeDateRange: filterDates.dates[filterDates.active].dateRange,
            conferenceMedium: searchFilters?.recording_medium,
            processingStatus: searchFilters?.processing_status,
            auditQuestions: searchFilters?.activeQuestions,
            template: searchFilters?.template,
            audit_filter: searchFilters.audit_filter,
            min_aiscore: searchFilters.min_aiscore,
            max_aiscore: searchFilters.max_aiscore,
            stage: searchFilters.stage,
            sortKey: searchFilters.sortKey,
            meetingType,
            versionData,
            min_patience: searchFilters.min_patience,
            max_patience: searchFilters.max_patience,
            max_interruption_count: searchFilters.max_interruption_count,
            min_interruption_count: searchFilters.min_interruption_count,
            min_talktime: searchFilters?.min_talktime,
            max_talktime: searchFilters?.max_talktime,
        };

        return data;
    };

    const [form, setForm] = useState({
        comment: "",
        emails: [],
        isPublic: false,
        publicUrl: "",
    });

    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);

    const submitForm = (getPublic) => {
        const payload = {
            comment: "",
            emails: form.emails,
            json_filters: prepareSearchData(
                fields,
                prepareData(),
                {
                    client: searchFilters.client
                        ? common.salesTasks.find(
                              ({ id }) => +searchFilters.client.value === id
                          ) || {
                              ...searchFilters.client,
                              name: searchFilters.client.label,
                              id: searchFilters.client.id,
                          }
                        : null,
                    topics:
                        common.topics.find(
                            ({ id }) => id === searchFilters.topic
                        ) || null,
                    tags: common.tags.filter(({ id }) => {
                        for (let tag of searchFilters.call_tags) {
                            if (+tag === id) return true;
                        }
                        return false;
                    }),
                    owner:
                        common.filterReps?.reps?.find(
                            ({ id }) => id === common.filterReps.active
                        ) || null,
                    team:
                        common.filterTeams?.teams?.find(
                            ({ id }) => id === common.filterTeams.active
                        ) || null,
                    questions: Object.keys(searchFilters.activeQuestions).length
                        ? searchFilters.activeQuestions
                        : null,
                    template: Object.keys(searchFilters.activeQuestions).length
                        ? searchFilters.template || null
                        : null,
                    keywords: searchFilters.keywords,
                    audit_filter: searchFilters?.audit_filter,
                    stage: filters.stage.find(
                        ({ id }) => searchFilters.stage === id
                    ),
                    meetingType,
                },
                stats_threshold
            ),
            // json_filters:{...activeFilters},
            owner: auth.id,
        };

        if (!getPublic) {
            if (!form.emails.length) {
                setmailError(true);
                setTimeout(() => {
                    setmailError(false);
                }, 2000);
                return;
            }
        } else {
            setisSharing(true);
        }

        shareCall(domain, payload).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                setForm({
                    ...form,
                    publicUrl: res?.data?.url,
                    isPublic: true,
                });
                if (!getPublic) {
                    navigator.clipboard.writeText(res?.data?.url, 100);
                    setForm({
                        ...form,
                        publicUrl: res?.data?.url,
                        isPublic: getPublic,
                    });
                    notification.success({
                        message: "Shared Successfully",
                    });
                } else {
                }
            }
            setisSharing(false);
        });
    };

    const validateEmail = (email) => {
        var re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleEmails = (email) => {
        if (validateEmail(email)) {
            setForm({
                ...form,
                emails: [...form.emails, email],
            });
        } else {
            setmailError(true);
            setTimeout(() => {
                setmailError(false);
            }, 2000);
        }
    };

    const removeEmails = (email) => {
        let updatedMails = [...form.emails];
        let mailToRemove = updatedMails.findIndex((mail) => mail === email);
        updatedMails.splice(mailToRemove, 1);
        setForm({
            ...form,
            emails: updatedMails,
        });
    };

    const onToggle = (checked) => {
        setIsChecked(true);
        setshowAlret(false);
        if (checked) {
            submitForm(true);
        } else {
            setForm({
                ...form,
                isPublic: false,
                publicUrl: "",
            });
            setIsChecked(false);
        }
    };

    const handlers = {
        handleActiveMenu: ({ key }) => {
            setActiveMenu(key);
            localStorage.setItem(callsConfig.SUBNAV, key);
            dispatch(reInitSidebar(key));
        },

        setSidebarData: (call, type) => {
            dispatch(updateSidebarData(call, type));
        },
        handleSearchToggle: ({ key }) => {
            setActiveSidebarView(key);
        },
    };

    const clearSearch = () => {
        dispatch(setGSText(""));
        dispatch(clearFilters());
        dispatch(getSalesTasks({}));
        // dispatch(getRepByTeam(0));
        dispatch(clearSearchFilters());
    };

    const [filtersUpcomingCalls, setFiltersUpcomingCalls] = useState([]);

    // useEffect(() => {
    //     dispatch(getRepByTeam(filterTeams.active));
    //     return () => {
    //         dispatch(setActiveRep(0));
    //         dispatch(clearSearchFilters());
    //     };
    // }, []);

    useEffect(() => {
        showFilters || applyUpcomingCallsFilters();
    }, [upcomingFilterReps.active, upcomingFiltersTeams.active]);

    const applyUpcomingCallsFilters = () => {
        const data = [];
        if (upcomingFiltersTeams.active) {
            data.push({
                id: "team." + upcomingFiltersTeams.active,
                type: "team",
                name: capitalizeFirstLetter(
                    upcomingFiltersTeams?.teams?.find(
                        (team) => team?.id === +upcomingFiltersTeams.active
                    )?.name || ""
                ),
            });
        }
        if (upcomingFilterReps?.active?.length) {
            for (let participant of upcomingFilterReps.active) {
                data.push({
                    id: participant,
                    type: "Participant",
                    name: upcomingFilterReps?.reps?.find(
                        (rep) => rep.email === participant
                    )?.name,
                });
            }
        }
        setFiltersUpcomingCalls(data);
    };
    const getActiveUpcommingFilters = () => {
        const payload = {};

        if (upcomingFiltersTeams.active)
            payload.team = upcomingFiltersTeams.active;

        if (upcomingFilterReps?.active?.length)
            payload.members = upcomingFilterReps.active;

        return payload;
    };

    const upcomingCallshandlers = {
        getCalls: (next) => {
            dispatch(getUpcomingCalls(getActiveUpcommingFilters(), next));
        },

        changeCallType: (type, callId) => {
            dispatch(
                changeCallType(
                    type,
                    callId,
                    "meeting",
                    callsConfig.UPCOMING_TYPE
                )
            );
        },
    };

    const handleRemoveUpcomingCallFilters = ({ type, id }) => {
        switch (type) {
            case "team":
                return dispatch(setUpcomingCallsActiveTeamFilter(0));
            case "Particpant":
                return dispatch(
                    setUpcomingCallsParticipantsFilters(
                        upcomingFilterReps?.active?.filter(
                            (email) => email !== id
                        )
                    )
                );

            default:
        }
    };

    const clearUpcommingCallFilters = () => {
        dispatch(setUpcomingCallsActiveTeamFilter(0));
        dispatch(setUpcomingCallsParticipantsFilters([]));
        applyUpcomingCallsFilters();
        setShowFilters(false);
    };

    const handleRemove = ({ type, id }) => {
        const { FILTER_CONSTANTS: CONSTANTS } = config;
        console.log(type, CONSTANTS.LEADCONFIG);
        const {
            client,

            keyword_present_in_call,
            keyword_said_by_rep,
            keyword_said_by_others,

            call_types,
            no_of_questions_by_rep,
            no_of_questions_by_others,
            topic,
            topic_in_call,
            interactivity: {
                clientLongestMonologue,
                clientTalkRatio,
                interactivity,
                ownerLongestMonologue,
                ownerTalkRatio,
                patience,
            },
            recording_medium,
            processing_status,
            audit_filter,
            min_aiscore,
            max_aiscore,
            stage,
            min_talktime,
            max_talktime,
            lead_config,
            audit_feedback_status,
        } = defaultSearchFilters;
        console.log(CONSTANTS.LEADCONFIG);
        switch (type) {
            case CONSTANTS.CALL_SCORING: {
                let activeQuestions = { ...searchFilters.activeQuestions };
                const toRemove = id.split(".")?.[1];
                delete activeQuestions[toRemove];

                return dispatch(
                    setSearchFilters({
                        activeQuestions,
                    })
                );
            }

            case CONSTANTS.CLIENT:
                dispatch(setSearchFilters({ client }));
                break;
            case CONSTANTS.KEYWORDS: {
                const toRemove = id.split(".")?.[1];
                dispatch(setGSText(""));
                return dispatch(
                    setSearchFilters({
                        keywords: searchFilters.keywords.filter(
                            (keyword) => toRemove !== keyword
                        ),
                    })
                );
            }

            case CONSTANTS.WORD_IN_CALL:
                return dispatch(
                    setSearchFilters({
                        keyword_present_in_call,
                    })
                );
            case CONSTANTS.WORD_SAID_BY_REP:
                return dispatch(
                    setSearchFilters({
                        keyword_said_by_rep,
                    })
                );
            case CONSTANTS.WORD_SAID_BY_OTHERS:
                return dispatch(
                    setSearchFilters({
                        keyword_said_by_others,
                    })
                );
            case CONSTANTS.CALL_TAG: {
                const toRemove = id.split(".")?.[1];
                return dispatch(
                    setSearchFilters({
                        call_tags: searchFilters.call_tags.filter(
                            (id) => +id !== +toRemove
                        ),
                    })
                );
            }
            case CONSTANTS.CALL_TYPE:
                const toRemove = id.split(".")?.[1];
                return dispatch(
                    // setSearchFilters({
                    //     call_types,
                    // })
                    setSearchFilters({
                        call_types: searchFilters.call_types?.filter(
                            (item) => +item !== +toRemove
                        ),
                    })
                );
            case CONSTANTS.QUESTIONS_BY_REP:
                return dispatch(
                    setSearchFilters({
                        no_of_questions_by_rep,
                    })
                );
            case CONSTANTS.QUESTIONS_BY_OTHERS:
                return dispatch(
                    setSearchFilters({
                        no_of_questions_by_others,
                    })
                );
            case CONSTANTS.TOPIC:
                return dispatch(
                    setSearchFilters({
                        topic,
                    })
                );
            case CONSTANTS.TOPIC_IN_CALL:
                return dispatch(
                    setSearchFilters({
                        topic_in_call,
                    })
                );
            case CONSTANTS.CLINET_MONOLOGUE:
                return dispatch(
                    setSearchFilters({
                        interactivity: {
                            ...searchFilters.interactivity,
                            clientLongestMonologue,
                        },
                    })
                );
            case CONSTANTS.CLIENT_TALK_RATIO:
                return dispatch(
                    setSearchFilters({
                        interactivity: {
                            ...searchFilters.interactivity,
                            clientTalkRatio,
                        },
                    })
                );
            case CONSTANTS.INTERACTIVITY:
                return dispatch(
                    setSearchFilters({
                        interactivity: {
                            ...searchFilters.interactivity,
                            interactivity,
                        },
                    })
                );
            case CONSTANTS.REP_TALK_RATIO:
                return dispatch(
                    setSearchFilters({
                        interactivity: {
                            ...searchFilters.interactivity,
                            ownerTalkRatio,
                        },
                    })
                );
            case CONSTANTS.REP_MONOLOGUE:
                return dispatch(
                    setSearchFilters({
                        interactivity: {
                            ...searchFilters.interactivity,
                            ownerLongestMonologue,
                        },
                    })
                );
            case CONSTANTS.PATIENCE:
                return dispatch(
                    setSearchFilters({
                        max_patience: 100,
                        min_patience: 0,
                    })
                );
            case CONSTANTS.INTERRUPTION_COUNT:
                return dispatch(
                    setSearchFilters({
                        min_interruption_count: null,
                        max_interruption_count: null,
                    })
                );
            case CONSTANTS.RECORDING_MEDIUM:
                return dispatch(
                    setSearchFilters({
                        recording_medium,
                    })
                );
            case CONSTANTS.PROCESSING_STATUS:
                return dispatch(
                    setSearchFilters({
                        processing_status,
                    })
                );
            case CONSTANTS.MIN_AI_SCORE:
                return dispatch(
                    setSearchFilters({
                        min_aiscore,
                    })
                );
            case CONSTANTS.MAX_AI_SCORE:
                return dispatch(
                    setSearchFilters({
                        max_aiscore,
                    })
                );
            case CONSTANTS.TEAM: {
                const toRemove = Number(id.split(".")?.[1]);
                return dispatch(
                    changeActiveTeam(
                        filterTeams.active?.filter(
                            (team_id) => team_id !== toRemove
                        )
                    )
                );
            }

            case CONSTANTS.stage:
                return dispatch(
                    setSearchFilters({
                        stage,
                    })
                );

            case CONSTANTS.MIN_TALKTIME:
                return dispatch(
                    setSearchFilters({
                        min_talktime,
                    })
                );

            case CONSTANTS.MAX_TALKTIME:
                return dispatch(
                    setSearchFilters({
                        max_talktime,
                    })
                );
            // return dispatch(getRepByTeam('0'));

            case CONSTANTS.OWNER:
                const repToRemove = Number(id.split(".")?.[1]);
                return dispatch(
                    setActiveRep(
                        filterReps.active?.filter(
                            (rep_id) => rep_id !== repToRemove
                        )
                    )
                );
            // dispatch(setActiveRep([]));
            // break;
            case CONSTANTS.DATE:
                dispatch(setActiveFilterDate("all"));
                break;
            case CONSTANTS.DURATION:
                dispatch(setActiveCallDuration("2"));
                break;
            case CONSTANTS.AUDIT_TYPE:
                dispatch(
                    setSearchFilters({ audit_filter, audit_feedback_status })
                );
                break;
            case CONSTANTS.AUDIT_STATUS:
                dispatch(
                    setSearchFilters({ audit_filter, audit_feedback_status })
                );

                break;
            case CONSTANTS.AUDITED_DATE:
                dispatch(
                    setSearchFilters({
                        audit_filter: {
                            ...searchFilters.audit_filter,
                            manualAuditDateRange: [null, null],
                        },
                    })
                );
                break;
            case CONSTANTS.AUDITOR:
                {
                    const toRemove = Number(id.split(".")?.[1]);

                    dispatch(
                        setSearchFilters({
                            audit_filter: {
                                ...searchFilters.audit_filter,
                                auditors:
                                    searchFilters?.audit_filter?.auditors?.filter?.(
                                        (id) => id !== toRemove
                                    ),
                            },
                        })
                    );
                }
                break;
            case CONSTANTS.LEADCONFIG:
                dispatch(
                    setSearchFilters({
                        lead_config: {
                            is_hot: false,
                            is_warm: false,
                            is_cold: false,
                        },
                    })
                );
                break;
            default:
        }
    };

    // useEffect(() => {
    //     if (state.showUpcommingCalls) {
    //         dispatch(setUpcomingCallsActiveTeamFilter(0));
    //     }
    // }, [state.showUpcommingCalls]);

    useEffect(() => {
        if (gsText && defaultView === 0) {
            return;
        }

        if (defaultView !== null) {
            applyView(defaultView);
        }
    }, [defaultView]);

    useEffect(() => {
        dispatch(getTrackers());
    }, []);

    const applyView = (value) => {
        //value is zero it means its completed calls

        if (+value) {
            const currentView = views.find(({ id }) => id === +value);
            if (currentView) {
                setFiltersForSearch(currentView.json_filters);
            }
        } else {
        }
    };

    const { meetingType, setMeetingType, is_Auditor, canAccess } =
        useContext(HomeContext);
    const { role } = auth;

    return (
        <SearchContext.Provider
            value={{
                setFiltersForSearch,
                setDrawerState: setState,
                drawerAction: constants,
                upcomingCallshandlers,
                showUpdateView,
                setShowUpdateView,
            }}
        >
            <Helmet>
                <meta charSet="utf-8" />
                <title>{sidebarConfig.PHONE_TITLE}</title>
            </Helmet>
            <main className={`call__list__page`}>
                <div className="flexShrink call__list__page__header paddingR26">
                    <div>
                        <Select
                            value={
                                defaultView
                                    ? defaultView
                                    : activeSamplingRule
                                    ? `sampling_${activeSamplingRule}`
                                    : 0
                            }
                            onChange={(value) => {
                                if (
                                    typeof value !== "number" &&
                                    value.startsWith("sampling")
                                ) {
                                    dispatch(setActiveSearchView(null));
                                    clearSearch();
                                    dispatch(
                                        setActiveSamplingRule(
                                            Number(value.split("_")[1])
                                        )
                                    );
                                } else {
                                    dispatch(setActiveSamplingRule(null));
                                    dispatch(setGSText(""));
                                    dispatch(setActiveSearchView(value));
                                    if (value === 0) {
                                        clearSearch();
                                    }
                                }
                            }}
                            className="view__select"
                            dropdownRender={(menu) => (
                                <div>
                                    <span className="topbar-label">
                                        My Saved Views
                                    </span>
                                    {menu}
                                </div>
                            )}
                            suffixIcon={
                                <div>
                                    <ChevronDownSvg
                                        className="ant-select-suffix"
                                        style={{
                                            color: "#333333",
                                            marginTop: "0.25rem",
                                        }}
                                    />
                                </div>
                            }
                            optionFilterProp="children"
                            dropdownClassName={
                                "account_select_dropdown view_select_dropdown"
                            }
                        >
                            {views?.map(({ id, name, is_default }, idx) => (
                                <Option value={id} key={idx}>
                                    <div>
                                        <Checkbox
                                            className="marginR14"
                                            checked={id === defaultView}
                                            onChange={(e) => {
                                                dispatch(
                                                    setActiveSamplingRule(null)
                                                );
                                                dispatch(
                                                    setActiveSearchView(id)
                                                );
                                                if (id === 0) {
                                                    clearSearch();
                                                }
                                            }}
                                            onClick={(e) => {
                                                if (id === 0) {
                                                    clearSearch();
                                                    dispatch(
                                                        setActiveSearchView(id)
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                    <span className="flex1 text_ellipsis">
                                        {id === 0
                                            ? meetingType ===
                                              MeetingTypeConst.calls
                                                ? "Completed Calls"
                                                : "Completed Chats"
                                            : name}
                                    </span>
                                    {!!(id !== 0) && (
                                        <Popconfirm
                                            title="Are you sure to delete this view?"
                                            onConfirm={(e) => {
                                                e.stopPropagation();
                                                if (id === defaultView) {
                                                    dispatch(
                                                        setActiveSearchView(0)
                                                    );
                                                    clearSearch();
                                                }
                                                dispatch(deleteSearchView(id));
                                            }}
                                            onCancel={(e) =>
                                                e.stopPropagation()
                                            }
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="delete_btn"
                                            >
                                                <DeleteSvg />
                                            </div>
                                        </Popconfirm>
                                    )}
                                </Option>
                            ))}
                            {samplingRules
                                ?.filter((rule) => rule.audit_type === "manual")
                                ?.map((rule) => (
                                    <Option
                                        value={`sampling_${rule.id}`}
                                        key={`sampling_${rule.id}`}
                                        // onClick={() => {
                                        //     console.log(rule.id);
                                        //     dispatch(
                                        //         setActiveSamplingRule(rule.id)
                                        //     );
                                        // }}
                                    >
                                        {rule.name}
                                    </Option>
                                ))}
                        </Select>
                        <div className="results_container_home">
                            Showing {count} {count === 1 ? "Result" : "Results"}{" "}
                        </div>
                    </div>

                    <div className="call__list__page__header__right">
                        <PageFilters
                            className="topbar__filters"
                            showChat={true}
                        />

                        <Button
                            className="borderRadius4 capitalize flex alignCenter filter_btn  active_hover active_focus br4"
                            size={36}
                            onClick={() =>
                                setState({ type: constants.SHOW_FILTERS })
                            }
                            style={{
                                height: "36px",
                                color: "#666666",
                            }}
                        >
                            <FilterLinesSvg
                                style={{
                                    lineHeight: 0,
                                }}
                            />
                            <span>FILTER</span>
                        </Button>

                        <Tooltip title="Alerts">
                            <Button
                                className="borderRadius4 capitalize flex alignCenter active_hover"
                                onClick={() =>
                                    setState({
                                        type: constants.SHOW_ALERTS,
                                    })
                                }
                                style={{
                                    height: "36px",
                                    width: "36px",
                                }}
                                icon={
                                    <AlertSvg
                                        style={{
                                            color: "#333333",
                                            width: "100%",
                                        }}
                                    />
                                }
                            />
                        </Tooltip>
                        <Tooltip title="Upcoming Meetings">
                            {/* {!!trackers?.count && (
                                <div className="alert_count">
                                    <span>{trackers?.count}</span>
                                </div>
                            )} */}

                            <Button
                                onClick={() =>
                                    setState({
                                        type: constants.SHOW_UPCOMMING_CALLS,
                                    })
                                }
                                className="borderRadius5 upcoming_meetings_btn active_hover"
                                icon={<CalendarFilledSvg />}
                            />
                        </Tooltip>
                        {versionData?.domain_type === "b2c" &&
                            is_Auditor(role.code_names) && (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        history.push(`/call/qms`);
                                    }}
                                >
                                    Start Audit
                                </Button>
                            )}
                    </div>
                </div>
                {!!activeFilters?.length && (
                    <div className="marginB18 flex justifySpaceBetween width100p paddingR26">
                        <FiltersUI
                            data={[...activeFilters]}
                            blockWidth={200}
                            maxCount={4}
                            removeFilter={handleRemove}
                            clearAll={() => {
                                clearSearch();
                                dispatch(setActiveSearchView(0));
                            }}
                        />

                        {
                            <div className="flex alignCenter">
                                <button
                                    onClick={() => setShowShare(true)}
                                    className="marginR12 create_alert_btn"
                                >
                                    {meetingType === MeetingTypeConst.chat
                                        ? "SHARE CHAT"
                                        : "SHARE"}
                                </button>
                                <button
                                    onClick={() =>
                                        setState({
                                            type: constants.SHOW_TRACKER_MODAL,
                                        })
                                    }
                                    className="marginR12 create_alert_btn"
                                >
                                    CREATE ALERT
                                </button>
                                <button
                                    onClick={() =>
                                        setState({
                                            type: constants.SHOW_CREATE_VIEW_MODAL,
                                        })
                                    }
                                    className="create_alert_btn"
                                >
                                    {showUpdateView
                                        ? "UPDATE VIEW"
                                        : "SAVE THIS VIEW"}
                                </button>
                                <Button
                                    type="text"
                                    className="create_alert_btn marginL12"
                                    onClick={() => {
                                        dispatch(
                                            dowloadCallList({
                                                filters: prepareSearchData(
                                                    fields,
                                                    prepareData(),
                                                    {
                                                        client: searchFilters.client
                                                            ? common.salesTasks.find(
                                                                  ({ id }) =>
                                                                      +searchFilters
                                                                          .client
                                                                          .value ===
                                                                      id
                                                              ) || {
                                                                  ...searchFilters.client,
                                                                  name: searchFilters
                                                                      .client
                                                                      .label,
                                                                  id: searchFilters
                                                                      .client
                                                                      .id,
                                                              }
                                                            : null,
                                                        topics:
                                                            common.topics.find(
                                                                ({ id }) =>
                                                                    id ===
                                                                    searchFilters.topic
                                                            ) || null,
                                                        tags: common.tags.filter(
                                                            ({ id }) => {
                                                                for (let tag of searchFilters.call_tags) {
                                                                    if (
                                                                        +tag ===
                                                                        id
                                                                    )
                                                                        return true;
                                                                }
                                                                return false;
                                                            }
                                                        ),
                                                        owner:
                                                            common.filterReps?.reps?.find(
                                                                ({ id }) =>
                                                                    id ===
                                                                    common
                                                                        .filterReps
                                                                        .active
                                                            ) || null,
                                                        team:
                                                            common.filterTeams?.teams?.find(
                                                                ({ id }) =>
                                                                    id ===
                                                                    common
                                                                        .filterTeams
                                                                        .active
                                                            ) || null,
                                                        questions: Object.keys(
                                                            searchFilters.activeQuestions
                                                        ).length
                                                            ? searchFilters.activeQuestions
                                                            : null,
                                                        template: Object.keys(
                                                            searchFilters.activeQuestions
                                                        ).length
                                                            ? searchFilters.template ||
                                                              null
                                                            : null,
                                                        keywords:
                                                            searchFilters.keywords,
                                                        audit_filter:
                                                            searchFilters?.audit_filter,
                                                        stage: filters.stage.find(
                                                            ({ id }) =>
                                                                searchFilters.stage ===
                                                                id
                                                        ),
                                                        meetingType,
                                                    },
                                                    stats_threshold
                                                ),
                                                sampling_pk:
                                                    activeSamplingRule ||
                                                    undefined,
                                            })
                                        );
                                    }}
                                    disabled={loadingCalls}
                                >
                                    <DownloadSvg />
                                    <Spin
                                        style={{
                                            position: "absolute",
                                            top: "60%",
                                            left: "50%",
                                            transform: "translate(-50%,-50%)",
                                        }}
                                        spinning={loadingCalls}
                                        indicator={
                                            <LoadingOutlined
                                                style={{
                                                    fontSize: 24,
                                                    height: 24,
                                                    width: 24,
                                                }}
                                                spin
                                            />
                                        }
                                    />
                                </Button>
                            </div>
                        }
                    </div>
                )}

                <Modal
                    centered
                    visible={showShare}
                    closable={false}
                    onCancel={() => {
                        setForm({
                            ...form,
                            publicUrl: "",
                            comment: "",
                            emails: [],
                            isPublic: false,
                        });
                        setShowShare(false);
                        setIsChecked(false);
                        setisSharing(false);
                    }}
                    footer={null}
                    width="605px"
                    className="model_container bold600"
                >
                    <div
                        className="font16 flex paddingTB25 paddingLR25 marginB24 alignCenter justifySpaceBetween width100p"
                        style={{
                            borderBottom: "1px solid rgba(153, 153, 153, 0.2)",
                        }}
                    >
                        <span>
                            <MailSvg />{" "}
                            <span className="marginL11">
                                Share{" "}
                                {meetingType === MeetingTypeConst.chat
                                    ? "Chats"
                                    : meetingType === MeetingTypeConst.chat
                                    ? "Emails"
                                    : "Conversations "}
                                via Email
                            </span>
                        </span>
                        <span
                            className="close_btn"
                            onClick={() => {
                                setForm({
                                    ...form,
                                    publicUrl: "",
                                    comment: "",
                                    emails: [],
                                    isPublic: false,
                                });
                                setShowShare(false);
                                setIsChecked(false);
                            }}
                        >
                            <CloseSvg />
                        </span>
                    </div>
                    <div className="shareLink_card_container paddingLR25">
                        <div className="font14 marginB12">
                            Conversation Comment
                        </div>
                        <div className="marginB24 width100p">
                            <TextArea
                                className="flex comment_input"
                                rows={2}
                                placeholder="Write a comment..."
                                onBlur={({ target: { value } }) =>
                                    setForm({ ...form, comment: value })
                                }
                                value={form.comment}
                                onChange={({ target: { value } }) =>
                                    setForm({ ...form, comment: value })
                                }
                            />
                        </div>
                        <div className="font14 marginB12">Share to</div>
                        {mailError && (
                            <Alert
                                message="Please enter a valid email id"
                                type="error"
                                showIcon
                                closable
                            />
                        )}
                        <div
                            className="flex alignCenter justifySpaceBetween width100p paddingLR6 paddingTB4"
                            style={{
                                border: "1px solid rgba(153, 153, 153, 0.2)",
                                borderRadius: "5px",
                            }}
                        >
                            <div className="select_container width100p">
                                <Select
                                    mode="tags"
                                    placeholder="Enter email and press enter"
                                    onSelect={handleEmails}
                                    onDeselect={removeEmails}
                                    value={form.emails}
                                    className="email_container width100p"
                                >
                                    {users.map((user) => (
                                        <Select.Option key={user.email}>
                                            {user?.first_name || user?.email}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                            <button
                                className="link_btn paddingTB8 paddingLR25 goodblue_cl goodblue_bg"
                                onClick={() => {
                                    submitForm(false);
                                }}
                            >
                                SHARE
                            </button>
                        </div>
                        <div className="flex marginT18 marginB50  bold400 font12">
                            <span>
                                <CircleInfoSvg />
                            </span>
                            <span className="marginL10">
                                A public Link will be shared with the listed
                                conversations to the above mentioned email.
                            </span>
                        </div>
                    </div>

                    <div
                        className="flex alignCenter justifySpaceBetween paddingLR25 paddingB12 width100p"
                        style={{
                            borderBottom: "1px solid rgba(153, 153, 153, 0.2)",
                        }}
                    >
                        <div className="bold600 font18">
                            <LinkSvg />
                            <span className="marginL14">
                                Create a Shareable Link
                            </span>
                        </div>
                        <div>
                            <span className="bold600 font14 marginR17">
                                Generate public link
                            </span>
                            <span>
                                <Switch
                                    checked={isChecked}
                                    onChange={onToggle}
                                    loading={isSharing}
                                />
                            </span>
                        </div>
                    </div>

                    <div className="paddingLR25 paddingB24">
                        <div
                            className="flex alignCenter justifySpaceBetween width100p paddingLR6 paddingTB4 marginT9"
                            style={{
                                border: "1px solid rgba(153, 153, 153, 0.2)",
                                borderRadius: "5px",
                            }}
                        >
                            <input
                                type="text"
                                className="link_input bold400 font14"
                                value={form.isPublic ? form.publicUrl : ""}
                            />
                            <button
                                className="link_btn paddingTB8 paddingLR25 goodblue_cl goodblue_bg"
                                onClick={() => {
                                    if (form.isPublic) {
                                        navigator.clipboard.writeText(
                                            form.publicUrl,
                                            100
                                        );
                                        setshowAlret(true);
                                    }
                                }}
                            >
                                Copy Link
                            </button>
                        </div>
                        <div className="flex marginT18 bold400 font12 width100p">
                            <span>
                                <CircleInfoSvg />
                            </span>
                            <span className="marginL10">
                                A public link will be generated and can be
                                shared with anyone.
                            </span>
                        </div>
                        {showAlret && form.publicUrl ? (
                            <div className="alert_container marginT24">
                                <Alert
                                    message={
                                        <div className="flex alignCenter justifyCenter">
                                            <TickSvg
                                                style={{
                                                    color: "#52C41A",
                                                    marginRight: "8px",
                                                }}
                                            />
                                            <div className="goodcolor_cl">
                                                Link has been copied to
                                                clipboard
                                            </div>
                                        </div>
                                    }
                                    type="success"
                                    className="share_message_close"
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </Modal>

                <div className="card__name paddingLR23  width100p">
                    <Row className=" width100p">
                        <Col span={6}>
                            Name
                            <InfoButton
                                title={"Event name from your calendar"}
                            />
                        </Col>
                        <Col span={4}>
                            Owner
                            <InfoButton title={"Host of the meeting"} />
                        </Col>
                        <Col span={4}>
                            Client
                            <InfoButton title={"Prospect"} />
                        </Col>
                        {versionData?.domain_type === "b2c" ? (
                            <></>
                        ) : (
                            <Col span={2}>
                                Talk Ratio
                                <InfoButton
                                    title={
                                        " Time host spends talking compared to clients in the call"
                                    }
                                />
                            </Col>
                        )}
                        {versionData?.domain_type === "b2c" ? (
                            <Col
                                span={3}
                                className="flex alignCenter curPoint score"
                                onClick={() => {
                                    if (
                                        searchFilters.sortKey ===
                                        AI_SCORE_SORT_KEY.dsc
                                    ) {
                                        return dispatch(
                                            setSearchFilters({
                                                sortKey: AI_SCORE_SORT_KEY.asc,
                                            })
                                        );
                                    }

                                    dispatch(
                                        setSearchFilters({
                                            sortKey: AI_SCORE_SORT_KEY.dsc,
                                        })
                                    );
                                }}
                            >
                                <span>Score</span>
                                <SortArrow
                                    active={
                                        searchFilters.sortKey ===
                                            AI_SCORE_SORT_KEY.dsc ||
                                        searchFilters.sortKey ===
                                            AI_SCORE_SORT_KEY.asc
                                    }
                                    isDsc={
                                        searchFilters.sortKey ===
                                        AI_SCORE_SORT_KEY.dsc
                                    }
                                />
                                <InfoButton title={"Audit Score"} />
                            </Col>
                        ) : (
                            // <Col span={3}></Col>
                            <></>
                        )}

                        <Col span={3}>
                            Tags
                            <InfoButton title={"Call Tags"} />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={1}></Col>
                    </Row>
                </div>

                <Search
                    isDrawerVisible={showDrawer}
                    closeDrawer={() => setShowDrawer(false)}
                    tourKey={commonConfig.TOURS_KEYS.search}
                    tourSteps={searchTour}
                    isCallActive={props.isCallActive}
                    setCall={props.setCall}
                    showTrackersUI={
                        activeSidebarView === callsConfig.TRACKER_VIEW
                    }
                    sharerHandler={props.callHandlers.sharerHandler}
                    handleSearchToggle={handlers.handleSearchToggle}
                    activeSidebarView={activeSidebarView}
                    drawerState={state}
                    setDrawerState={setState}
                    drawerAction={constants}
                    newTrackerModal={newTrackerModal}
                    setnewTrackerModal={setnewTrackerModal}
                    clearSearch={clearSearch}
                    updateTopbarFilters={updateTopbarFilters}
                />

                {/* {activeMenu === callsConfig.UPCOMING_TYPE && (
                <section className="calls">
                    <UpcomingCalls
                        {...props}
                        setSidebarData={handlers.setSidebarData}
                    />
                    {!widget && activeMenu === callsConfig.UPCOMING_TYPE && (
                        <MeetingsSidebar type={activeMenu} />
                    )}
                </section>
            )} */}

                <Drawer
                    className={
                        "upcomming__calls__drawer drawer__filters search__filter__drawer"
                    }
                    title={
                        <div>
                            {showFilters ? (
                                <div className="title__main__heading">
                                    <span
                                        className={"curPoint"}
                                        onClick={() => {
                                            setShowFilters(false);
                                        }}
                                    >
                                        <LeftArrowSvg
                                            style={{
                                                fontSize: "14px",
                                                marginTop: "8px",
                                            }}
                                        />
                                    </span>
                                    <span> Upcoming Meeting Filters</span>
                                </div>
                            ) : (
                                <>
                                    <div className="title__main__heading">
                                        Upcoming Meetings
                                    </div>
                                    <div className="title__sub__heading">
                                        Don’t miss the scheduled events
                                    </div>
                                </>
                            )}
                        </div>
                    }
                    placement="right"
                    onClose={() =>
                        setState({ type: constants.CLOSE_UPCOMMING_CALLS })
                    }
                    visible={state.showUpcommingCalls}
                    width={"480px"}
                    extra={
                        <>
                            {showFilters || (
                                <span
                                    className="filter_button"
                                    onClick={() => setShowFilters(true)}
                                >
                                    <FillterSvg />
                                </span>
                            )}

                            <span
                                onClick={() =>
                                    setState({
                                        type: constants.CLOSE_UPCOMMING_CALLS,
                                    })
                                }
                            >
                                <CloseSvg />
                            </span>
                        </>
                    }
                    footer={
                        showFilters ? (
                            <div className="filter_footer">
                                <Button
                                    className="footer_button clear__button"
                                    onClick={clearUpcommingCallFilters}
                                >
                                    Clear
                                </Button>
                                <Button
                                    type="primary"
                                    className="footer_button"
                                    onClick={() => {
                                        setShowFilters(false);
                                        applyUpcomingCallsFilters();
                                    }}
                                >
                                    Apply Filter
                                </Button>
                            </div>
                        ) : (
                            <></>
                        )
                    }
                >
                    {showFilters ? (
                        <Collapse
                            expandIconPosition={"right"}
                            // accordion={props.isAccordion}

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
                            defaultActiveKey={["team", "team_member"]}
                        >
                            <Panel
                                header={"Filter by team"}
                                key="team"
                                id="upcoming_meetings_team_filter"
                            >
                                <Select
                                    className="custom__select filter__select"
                                    value={upcomingFiltersTeams.active}
                                    onChange={(val) => {
                                        dispatch(
                                            setUpcomingCallsActiveTeamFilter([
                                                val,
                                            ])
                                        );
                                    }}
                                    dropdownRender={(menu) => (
                                        <div>
                                            <span className={"topbar-label"}>
                                                Select Team
                                            </span>
                                            {menu}
                                        </div>
                                    )}
                                    suffixIcon={
                                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                                    }
                                    style={{
                                        height: "36px",
                                        width: "100%",
                                    }}
                                    dropdownClassName={
                                        "account_select_dropdown"
                                    }
                                >
                                    {upcomingFiltersTeams.teams.map((team) => {
                                        return team?.subteams?.length ? (
                                            <OptGroup label={team.name}>
                                                {team.subteams.map((team) => (
                                                    <Option
                                                        key={team.id}
                                                        value={team.id}
                                                    >
                                                        {team.name}
                                                    </Option>
                                                ))}
                                            </OptGroup>
                                        ) : (
                                            <Option
                                                key={team.id}
                                                value={team.id}
                                            >
                                                {team.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Panel>
                            <Panel
                                header={"Filter by Team Member"}
                                key="team_member"
                                id="upcoming_meetings_member_filter"
                            >
                                <Checkbox.Group
                                    className="flex row"
                                    onChange={(values) => {
                                        dispatch(
                                            setUpcomingCallsParticipantsFilters(
                                                [...values]
                                            )
                                        );
                                        // setColumn_list([...values]);
                                    }}
                                    value={upcomingFilterReps.active}
                                >
                                    {upcomingFilterReps.reps.map((rep) =>
                                        rep.email ? (
                                            <div
                                                key={rep.email}
                                                className={"col-24 paddingB24"}
                                            >
                                                <Checkbox value={rep.email}>
                                                    {rep.name}
                                                    {/* {` (${rep.email})`} */}
                                                </Checkbox>
                                            </div>
                                        ) : null
                                    )}
                                </Checkbox.Group>
                            </Panel>
                        </Collapse>
                    ) : (
                        <UpcomingCalls
                            {...props}
                            setSidebarData={handlers.setSidebarData}
                            filtersUpcomingCalls={filtersUpcomingCalls}
                            removeFilter={handleRemoveUpcomingCallFilters}
                            clearAll={clearUpcommingCallFilters}
                        />
                    )}
                </Drawer>
            </main>
        </SearchContext.Provider>
    );
};

const InfoButton = ({ title }) => (
    <Tooltip title={title}>
        <InfoCircleSvg
            style={{
                transform: "scale(0.8)",
                marginBottom: "2px",
                marginLeft: "0.5rem",
            }}
        />
    </Tooltip>
);

export default compose(withReactTour, withErrorCollector)(MyMeetings);
