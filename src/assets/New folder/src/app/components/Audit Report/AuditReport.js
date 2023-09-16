import React, {
    createContext,
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { saveAs } from "file-saver";
import "./auditreport.scss";
import ExcelSvg from "app/static/svg/ExcelSvg";
import { Drawer, Input, Tabs, Select, Alert, Button } from "antd";

import { useDispatch, useSelector } from "react-redux";
import {
    changeActiveTeam,
    getAllUsers,
    openNotification,
    setActiveCallDuration,
    setActiveFilterDate,
    setActiveRep,
    setActiveTemplateForFilters,
    successSnackBar,
} from "@store/common/actions";
import reportConfig from "@constants/Report";

import { getAuditorColumList, getInsightsColumnList } from "./helper";

import Spinner from "@presentational/reusables/Spinner";
import {
    getAgentPerformanceDetailsRequest,
    getAgentWiseListRequest,
    getAudiorGraphRequest,
    getAuditorListRequest,
    getAuditorPerformanceRequest,
    getCallWiseListRequest,
    getCategoryInsightsRequest,
    getTeamListRequest,
    getTeamPerformanceDetailsRequest,
    getTopInsightsRequest,
    setAuditorCallWiseList,
    setReportActiveFilterDate,
    setReportFilterDates,
} from "@store/audit_report/actions";
import {
    capitalizeFirstLetter,
    checkArray,
    getDateTime,
    getLocaleDate,
} from "@tools/helpers";
import TopbarConfig from "@constants/Topbar/index";

import useResizeWidth from "hooks/useResizeWidth";
import LineGraph from "@presentational/Statistics/LineGraph";
import apiErrors from "@apis/common/errors";
import FallbackUI from "@presentational/reusables/FallbackUI";
import { useHistory, useLocation } from "react-router";
import routes from "@constants/Routes/index";
import {
    handleDownloadRequest,
    handleShareRequest,
} from "@apis/audit_report/index";
import { getError } from "@apis/common/index";
import PageFilters from "@presentational/PageFilters/PageFilters";
import { setActiveSearchView, setSearchFilters } from "@store/search/actions";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";
import { AuditCard } from "../AnalyticsDashboard/Components/AuditDashboardAnalytics";
import { auditCardLabels } from "../AnalyticsDashboard/Constants/dashboard.constants";
import { HomeDashboardContext } from "../AnalyticsDashboard/Context/HomeDashboardContext";

const AuditorTab = React.lazy(() => import("./AuditorTab"));
const { TextArea } = Input;
const { Option } = Select;

export const ReportContext = createContext();

function AuditReport(props) {
    const DOWNLOAD_TYPES = {
        excel: "excel",
        raw: "raw",
        graph: "graph",
    };
    const dispatch = useDispatch();
    const { showLoader, versionData } = useSelector((state) => state.common);
    const [dateType, setDateType] = useState("Last 30 days");
    const [shareVisible, setShareVisible] = useState(false);
    const [performanceReportVisible, setPerformanceReportVisible] =
        useState(false);
    const [columListVisible, setColumListVisible] = useState(false);
    const { handleActiveComponent, meetingType } = useContext(HomeContext);

    const [visible, setVisible] = useState(false);

    const [filters, setFilters] = useState({
        auditors: [0],
    });

    const {
        AUDITOR_REPORT,
        SALES_TEAM_REPORT,
        AGENT_REPORT,
        CALLS,
        ACCOUNTS,
        MINUTES,
        AGENTS,
        AGENT_ROUTE,
        SALES_TEAM_ROUTE,
    } = reportConfig;

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [shareName, setShareName] = useState("");

    //auditor data for the drawer
    const [auditorData, setAuditorData] = useState({});
    const [auditType, setAuditType] = useState(CALLS);
    const [commentError, setCommentError] = useState(false);

    const history = useHistory();
    const location = useLocation();

    const { filtersVisible } = useContext(HomeDashboardContext) || {};

    const {
        auditPerformanceDetails,
        auditorList,
        teamPerformanceDetails,
        teamList,
        top_insights,
        category_insights,
        agentList,
        agentPerformanceDetails,
        callWiseData,
        graphData,
        cardsLoading,
        topInsightsLoading,
        categoryInsightsLoading,
        tableLoading,

        auditorCallWiseData,
    } = useSelector((state) => state.auditReport);

    const {
        dashboard: { dashboard_filters },
    } = useSelector((state) => state);

    const {
        common: {
            filterDates,
            filterTeams,
            filterReps: filterAgents,
            filterCallDuration,
        },
    } = useSelector((state) => state);

    const calRef = useRef(null);
    const reportRef = useRef(null);

    const getInitTab = () => {
        switch (history.location.pathname) {
            case `${routes.AUDIT_REPORT}${SALES_TEAM_ROUTE}`:
                return SALES_TEAM_REPORT;
            case `${routes.AUDIT_REPORT}${AGENT_ROUTE}`:
                return AGENT_REPORT;
            default:
                return AUDITOR_REPORT;
        }
    };

    const [tab, setTab] = useState(getInitTab());

    const getPayload = () => {
        const [duration_gte, duration_lte] =
            filterCallDuration.options[filterCallDuration.active].value;
        let payload = {
            start_time:
                new Date(
                    filterDates?.dates?.[filterDates.active].dateRange[0]
                ).getTime() || null,
            end_time:
                new Date(
                    filterDates?.dates?.[filterDates.active].dateRange[1]
                ).getTime() || null,
            meeting_start_time:
                new Date(
                    dashboard_filters.audit_filter.manualAuditDateRange?.[0]
                ).getTime() || undefined,
            meeting_end_time:
                new Date(
                    dashboard_filters.audit_filter.manualAuditDateRange?.[1]
                ).getTime() || undefined,
            meeting_type: meetingType,
        };
        if (
            dashboard_filters?.audit_filter?.auditors?.filter((val) => {
                return val !== 0;
            }).length
        )
            payload = {
                ...payload,
                owners_id: dashboard_filters?.audit_filter?.auditors,
            };

        if (
            dashboard_filters?.call_tags.filter((val) => {
                return val !== 0;
            }).length
        ) {
            payload = {
                ...payload,
                tag_id: dashboard_filters?.call_tags,
            };
        }

        if (filterTeams.active?.length) {
            payload = {
                ...payload,
                teams_id: filterTeams.active,
            };
        }
        return tab === AUDITOR_REPORT
            ? payload
            : {
                  ...payload,
                  duration_gte: duration_gte * 60,
                  duration_lte: duration_lte * 60 || null,
              };
    };

    const handleRangeChange = (newRange) => {
        // Now adding the new values to the options for the dropdown menu for later use.
        let newOption =
            getLocaleDate(newRange[0]) + " - " + getLocaleDate(newRange[1]);

        dispatch(
            setReportFilterDates({
                [newOption]: {
                    name: newOption,
                    dateRange: newRange,
                },
                ...filterDates.dates,
            })
        );

        dispatch(setReportActiveFilterDate(newOption));

        // Now that the use of the date picker is over. It's okay to hide it.
        setShowDatePicker(false);
    };

    const handleDurationChange = (value) => {
        if (value === TopbarConfig.CUSTOMLABEL) {
            setShowDatePicker(true); // Show datepicker.
        } else {
            dispatch(setReportActiveFilterDate(value));
        }
    };

    const allUsers = useSelector((state) => state.common.users);

    const onShareClose = () => {
        setShareVisible(false);
    };

    const onPerformanceReportClose = () => {
        setPerformanceReportVisible(false);
    };

    const onRowClick = () => {
        setPerformanceReportVisible(true);
    };

    const getFileName = () => {
        let name = "";
        const date = new Date();
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yy = date.getFullYear() % 100;
        const hh = date.getHours();
        const mi = date.getMinutes();
        const ss = date.getSeconds();
        const dateSuffix = `${mm}_${dd}_${yy}_${hh}_${mi}_${ss}`;
        if (tab === AUDITOR_REPORT) {
            name += `audit_sheet_${dateSuffix}`;
        } else if (tab === SALES_TEAM_REPORT) {
            if (filterTeams.active.length === 0) {
                name += `team_sheet_${dateSuffix}`;
            } else name = `team_${filterTeams.active[0]}_sheet`;
        } else if (tab === AGENT_REPORT) {
            name = `agent_${filterAgents.active}_sheet_${dateSuffix}`;
        }
        return name;
    };

    useEffect(() => {
        dispatch(changeActiveTeam([]));
    }, []);

    useEffect(() => {
        switch (history.location.pathname) {
            // case `${routes.AUDIT_REPORT}${SALES_TEAM_ROUTE}`:
            //     setTab(SALES_TEAM_REPORT);
            //     break;
            // case `${routes.AUDIT_REPORT}${AGENT_ROUTE}`:
            //     setTab(AGENT_REPORT);
            //     break;
            default:
                setTab(AUDITOR_REPORT);
        }
    }, [location]);

    useEffect(() => {
        if (shareVisible) {
            setShareName(getFileName());
        } else {
            setShareName("");
            setForm({
                comment: "",
                emails: [],
            });
        }
    }, [shareVisible]);

    const { domain } = useSelector((state) => state.common);

    const [downloading, setIsDownloading] = useState(false);

    const handleDownload = (val, data) => {
        let url = "";
        let payload = { ...getPayload() };
        if (val === DOWNLOAD_TYPES.excel) {
            if (tab === AUDITOR_REPORT) {
                url = "/stats/auditor/report/download/";
            }
            if (tab === SALES_TEAM_REPORT) {
                if (filterTeams.active.length === 0) {
                    url = "/stats/audit/team/report/download/";
                } else
                    url = `/stats/audit/team/${filterTeams.active[0]}/report/download/`;
            }
            if (tab === AGENT_REPORT) {
                url = `/stats/audit/team/agent/${filterAgents.active}/report/download/`;
            }
        } else {
            if (tab === AUDITOR_REPORT) {
                url = "/stats/auditor/raw/download/";
                if (data?.auditorId) {
                    payload.auditor_id = data.auditorId;
                }
            }
        }
        setIsDownloading(true);
        return handleDownloadRequest(url, payload)
            .then((response) => {
                var blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                setIsDownloading(false);

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
                const { status, message } = getError(err);
                setIsDownloading(false);
                if (status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", message);
                }
            });
    };

    const handleShare = () => {
        let url = "";
        if (tab === AUDITOR_REPORT) {
            url = "/stats/auditor/report/share/";
        }
        if (tab === SALES_TEAM_REPORT) {
            if (filterTeams.active.length === 0) {
                url = "/stats/audit/team/report/share/";
            } else
                url = `/stats/audit/team/${filterTeams.active[0]}/report/share/`;
        }
        if (tab === AGENT_REPORT) {
            url = `/stats/audit/team/agent/${filterAgents.active}/report/share/`;
        }

        if (!form.comment) {
            setCommentError(true);
            setTimeout(() => {
                setCommentError(false);
            }, 2000);
            return;
        } else if (!form.emails.length) {
            setMailError(true);
            setTimeout(() => {
                setMailError(false);
            }, 2000);
            return;
        }

        return handleShareRequest(url, {
            ...getPayload(),
            filename: shareName + ".xlsx",
            ...form,
        })
            .then((response) => {
                successSnackBar("Report shared succesfully");
                setShareVisible(false);
            })
            .catch((err) => {
                if (getError(err) === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", err.message);
                }
            });
    };

    const [form, setForm] = useState({
        comment: "",
        emails: [],
    });

    const [mailError, setMailError] = useState(false);

    const handleEmails = (email) => {
        if (validateEmail(email)) {
            setForm({
                ...form,
                emails: [...form.emails, email],
            });
        } else {
            setMailError(true);
            setTimeout(() => {
                setMailError(false);
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

    const validateEmail = (email) => {
        var re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    useEffect(() => {
        if (!allUsers.length) {
            dispatch(getAllUsers());
        }
    }, []);

    const handleFetchReport = () => {
        // if (!filterAgents.active) {
        //     return;
        // }
        if (tab === AUDITOR_REPORT) {
            dispatch(getAuditorPerformanceRequest(getPayload()));
            dispatch(getAuditorListRequest(getPayload()));
        }
        if (tab === SALES_TEAM_REPORT) {
            dispatch(
                getTeamPerformanceDetailsRequest(
                    getPayload(),
                    filterTeams.active[0]
                )
            );
            if (filterTeams.active.length === 0) {
                dispatch(getTeamListRequest(getPayload()));
            } else {
                dispatch(
                    getTopInsightsRequest(
                        {
                            ...getPayload(),
                            team_insight: true,
                        },
                        filterTeams.active[0]
                    )
                );
                dispatch(
                    getCategoryInsightsRequest(
                        {
                            ...getPayload(),
                            team_insight: true,
                        },
                        filterTeams.active[0]
                    )
                );
                dispatch(
                    getAgentWiseListRequest(
                        {
                            ...getPayload(),
                        },
                        filterTeams.active[0]
                    )
                );
            }
        }
        if (tab === AGENT_REPORT) {
            if (!filterAgents.active) {
                dispatch(setActiveRep([filterAgents.reps[1]?.id]));
            }
            if (filterAgents?.reps?.length && filterAgents?.active) {
                dispatch(
                    getAgentPerformanceDetailsRequest(
                        getPayload(),
                        filterAgents.active
                    )
                );
                dispatch(
                    getTopInsightsRequest(getPayload(), filterAgents.active)
                );
                dispatch(
                    getCategoryInsightsRequest(
                        getPayload(),
                        filterAgents.active
                    )
                );
                dispatch(
                    getCallWiseListRequest(getPayload(), filterAgents.active)
                );
            }
        }
        reportRef?.current && reportRef.current.scrollTo(0, 0);
    };

    useEffect(() => {
        if (filtersVisible) return;
        if (filterTeams.length <= 1) {
            return;
        }
        handleFetchReport();
    }, [
        filterDates.active,
        filterTeams.active,
        filterAgents.active,
        filters?.auditors,
        meetingType,
        dashboard_filters,
    ]);

    useEffect(() => {
        if (performanceReportVisible) {
            dispatch(
                getAudiorGraphRequest(
                    {
                        ...getPayload(),
                        fields: ["calls", "accounts", "minutes", "agents"],
                    },
                    auditorData?.id
                )
            );
        }
    }, [
        performanceReportVisible,
        filterDates.active,
        filterCallDuration.active,
    ]);

    const compareText = (text) => {
        return filterDates.active === TopbarConfig.dateKeys.last30days ? (
            <span>
                {text}
                <span className="dove_gray_cl">
                    {getLocaleDate(filterDates?.dates?.last30days.dateRange[0])}
                </span>{" "}
                to{" "}
                <span className="dove_gray_cl">
                    {getLocaleDate(filterDates?.dates?.last30days.dateRange[1])}
                </span>
            </span>
        ) : (
            <span>
                {text} {filterDates.active}
            </span>
        );
    };

    const date = new Date();
    const [width] = useResizeWidth(656);
    const auditToShow = useCallback(() => {
        switch (auditType) {
            case CALLS:
                return auditorData?.call_audit_details;
            case ACCOUNTS:
                return auditorData?.account_audit_details;
            case MINUTES:
                return auditorData?.minute_audit_details;
            case AGENTS:
                return auditorData?.agent_audit_details;
            default:
                return {};
        }
    }, [auditorData, auditType, filterDates.active]);

    const renderGraph = useCallback(() => {
        const data = graphData[auditType];
        const xArr = [];
        const yArr = [];

        for (let i = 0; i < data?.length; i++) {
            const { epoch, count } = data[i];
            xArr.push(epoch);
            yArr.push(count);
        }

        return (
            <div className={"marginT20"}>
                <LineGraph
                    yAxisLabel={`${capitalizeFirstLetter(
                        auditType === "calls" ? meetingType : auditType
                    )}  Audited`}
                    xArr={xArr}
                    yArr={yArr}
                />
            </div>
        );
    }, [
        auditorData,
        auditType,
        performanceReportVisible,
        graphData,
        meetingType,
    ]);

    useEffect(() => {
        if (performanceReportVisible) {
            const findRecord = checkArray(auditorList?.results).find(
                ({ id }) => auditorData?.id === id
            );
            findRecord && setAuditorData(findRecord);
        }
    }, [auditorList?.results]);

    const handleTabChange = (key) => {
        switch (key) {
            // case SALES_TEAM_REPORT:
            //     history.push(`${routes.AUDIT_REPORT}${SALES_TEAM_ROUTE}`);
            //     break;
            // case AGENT_REPORT:
            //     history.push(`${routes.AUDIT_REPORT}${AGENT_ROUTE}`);
            //     break;
            default:
                history.push(`${routes.AUDIT_REPORT}`);
        }
    };

    const getAuditorCallsData = (id, name) => {
        dispatch(
            setAuditorCallWiseList({
                auditor: {
                    name,
                    id,
                },
            })
        );
    };

    useEffect(() => {
        if (auditorCallWiseData?.auditor?.id) {
            dispatch(changeActiveTeam([]));
            dispatch(setActiveRep([]));
            dispatch(setActiveCallDuration("0"));
            dispatch(setActiveFilterDate("all"));
            dispatch(setActiveSearchView(0));

            dispatch(setActiveTemplateForFilters(null));

            const [first = null, last = null] =
                filterDates?.dates?.[filterDates?.active]?.dateRange;

            dispatch(
                setSearchFilters({
                    audit_filter: {
                        auditors: [auditorCallWiseData?.auditor?.id],
                        audit_type: "Manual Audit",
                        manualAuditDateRange: [
                            first
                                ? new Date(
                                      new Date(new Date(first)).toUTCString()
                                  ).toISOString()
                                : null,
                            last
                                ? new Date(
                                      new Date(new Date(last)).toUTCString()
                                  ).toISOString()
                                : null,
                        ],
                    },
                })
            );
            dispatch(
                setAuditorCallWiseList({
                    auditor: null,
                })
            );

            handleActiveComponent("calls");
        }
    }, [auditorCallWiseData?.auditor]);

    return (
        <ReportContext.Provider
            value={{
                dateType,
                setDateType,
                setShareVisible,
                onRowClick,
                setPerformanceReportVisible,
                auditorColums: getAuditorColumList(
                    getAuditorCallsData,
                    versionData?.domain_type !== "b2c",
                    meetingType
                ),
                auditorList,
                teamList,
                insightsColumList: getInsightsColumnList(
                    versionData?.domain_type !== "b2c"
                ),
                setColumListVisible,
                showDatePicker,
                setShowDatePicker,
                handleDurationChange,
                handleRangeChange,
                filterDates,
                auditPerformanceDetails,
                showLoader,
                calRef,
                teamPerformanceDetails,
                filterTeams,
                top_insights,
                compareText,
                category_insights,
                agentList,
                getPayload,
                filterAgents,
                agentPerformanceDetails,
                setTab,
                callWiseData,
                setAuditorData,
                tab,
                columListVisible,
                handleDownload,
                handleFetchReport,
                handleTabChange,
                cardsLoading,
                topInsightsLoading,
                categoryInsightsLoading,
                tableLoading,
                filterCallDuration,
                DOWNLOAD_TYPES,
                versionData,
                auditorCallWiseData,
                visible,
                setVisible,
                filters,
                setFilters,
            }}
        >
            <div
                className="report-container"
                ref={reportRef}
                data-testid="component-audit-report"
            >
                <Spinner loading={showLoader}>
                    <Suspense fallback={<FallbackUI />}>
                        <AuditorTab downloading={downloading} />
                    </Suspense>
                </Spinner>
                <Drawer
                    title="Share"
                    placement="right"
                    closable={true}
                    onClose={onShareClose}
                    visible={shareVisible}
                    width={512}
                    className="report_drawer"
                    footer={
                        <div className="paddingTB10 flex row-reverse">
                            <Button onClick={handleShare} type="primary">
                                Share
                            </Button>
                        </div>
                    }
                >
                    <div className="flex alignCenter file_name_container">
                        <div className="marginL5">
                            <ExcelSvg />
                        </div>
                        <div className="marginL10 bold">
                            {shareVisible && `${shareName}.xlsx`}
                        </div>
                    </div>
                    <div className="marginT30">
                        <div className="bold">COMMENTS</div>
                        <p className="greyText marginB15">
                            You can add comments with the file shared
                        </p>
                        <TextArea
                            placeholder="Enter Comments"
                            autoSize={{ minRows: 6, maxRows: 8 }}
                            value={form.comment}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    comment: e.target.value,
                                })
                            }
                        />
                        {commentError && (
                            <Alert
                                message="Comment field cannot be empty"
                                type="error"
                                showIcon
                            />
                        )}
                    </div>
                    <div className="marginT30">
                        <div className="bold">SHARE VIA EMAIL</div>
                        <p className="greyText marginB15">
                            File will be shared to the emails enterd below
                        </p>
                        {mailError && (
                            <Alert
                                message="Please enter a valid email id"
                                type="error"
                                showIcon
                                closable
                            />
                        )}
                        <Select
                            mode="tags"
                            placeholder="Enter email"
                            onSelect={handleEmails}
                            onDeselect={removeEmails}
                            value={form.emails}
                            optionFilterProp="children"
                            className="input_bg_blue"
                            style={{
                                width: "100%",
                            }}
                        >
                            {allUsers.map((user) => (
                                <Option key={user.id} value={user.email}>
                                    {user?.first_name || user?.email}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </Drawer>
                <Drawer
                    className="auditor_rep_drawer"
                    title={
                        <span className="font22 bold600">
                            {auditorData?.name} - Audit Performance Report
                        </span>
                    }
                    placement="right"
                    closable={true}
                    onClose={onPerformanceReportClose}
                    visible={performanceReportVisible}
                    width={width}
                    footer={
                        <DrawerFooterDownload
                            onClick={() =>
                                handleDownload(DOWNLOAD_TYPES.raw, {
                                    auditorId: auditorData?.id,
                                })
                            }
                        />
                    }
                >
                    <div className="flex justifySpaceBetween marginTB30">
                        <div>
                            <div className="bold600 font20">
                                Overall Performance
                            </div>
                            <div className="dusty_gray_cl">
                                Last Updated on{" "}
                                {getDateTime(
                                    date,
                                    null,
                                    null,
                                    "MMM dd, yyyy - HH:MM"
                                )}
                            </div>
                        </div>

                        <PageFilters
                            hideDuration={true}
                            hideTeamSelect={true}
                            hideRepSelect={true}
                        />
                    </div>

                    <AuditCard
                        {...auditToShow()}
                        compareText={compareText}
                        xs={12}
                        title={auditCardLabels[auditType.slice(0, -1)]?.title}
                    />
                    <div className="flex justifySpaceBetween alignCenter marginT30">
                        <div className="bold600 font20">
                            Variation Statistics
                        </div>
                        <div>
                            <Select
                                className="audit_type_select"
                                value={auditType}
                                onChange={(val) => {
                                    setAuditType(val);
                                }}
                            >
                                <Option value={CALLS}>
                                    {capitalizeFirstLetter(meetingType) + "s "}
                                    Audited
                                </Option>
                                <Option value={ACCOUNTS}>
                                    Accounts Audited
                                </Option>
                                {meetingType === MeetingTypeConst.calls ? (
                                    <Option value={MINUTES}>
                                        Minutes Audited
                                    </Option>
                                ) : (
                                    <></>
                                )}

                                <Option value={AGENTS}>Agents Audited</Option>
                            </Select>
                        </div>
                    </div>
                    {renderGraph()}
                </Drawer>
            </div>
        </ReportContext.Provider>
    );
}

// const AuditCard = ({
//     name,
//     red_alert_class,
//     change,
//     count,
//     text_class,
//     compareText,
// }) => {
//     return (
//         <div
//             className={`width290 performance_card paddingLR16 paddingT23 posRel ${red_alert_class}`}
//         >
//             <div className="flex alignCenter justifySpaceBetween">
//                 <div className="bold">{name}</div>
//                 <ReportPercentage change={change} />
//             </div>
//             <div className="flex alignCenter justifySpaceBetween marginT5">
//                 <div className={`bolder font24 ${text_class}`}>{count}</div>
//             </div>
//         </div>
//     );
// };

const DrawerFooterDownload = ({ onClick }) => {
    return (
        <div className="flex justifyEnd">
            <Button
                type="primary"
                className="padding18 flex justifyCenter alignCenter borderRadius4"
                onClick={onClick}
            >
                Download Data
            </Button>
        </div>
    );
};

AuditCard.defaultProps = {
    red_alert_class: "",
    text_class: "textBlue",
};

export default AuditReport;
