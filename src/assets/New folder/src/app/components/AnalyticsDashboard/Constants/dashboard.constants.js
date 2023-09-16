import {
    AllReportSvg,
    LeadLvlSvg,
    OverallSvg,
    ParaLvlSvg,
    RepSvg,
    TeamSvg,
    VioLvlSvg,
    CoachingSvg,
    ReportSvg,
} from "app/static/svg/indexSvg";
import AuditDashboardSvg from "../../../static/svg/AuditDashboardSvg";

export const tabIds = {
    analysis: "analysis",
    insights: "insights",
    parameters: "parameters",
    team_details: "team_details",
    rep_details: "rep_details",
    violation_details: "violation_details",
    leadscore_details: "leadscore_details",
    average_score: "average_score",
    composition: "composition",
    comparition: "comparition",
    reports: "all_reports",
    coaching: "coaching",
    custom: "custom",
    audit_report: "audit_report",
};

export const report_types = {
    parameters: "parameter_analysis_report",
    team_details: "team_analysis_report",
    rep_details: "agent_report",
    violation_details: "violation_analysis_report",
    leadscore_details: "lead_analysis_report",
    default: "agent_report",
    statistics: "statistics",
    audit: "auditor_raw_report",
};

export const dashboardRoutes = {
    home: "/home/analytics",
    team: "/home/team_level_dashboard",
    rep: "/home/rep_level_dashboard",
    parameter: "/home/parameter_level_dashboard",
    violation: "/home/violation_dashboard",
    lead: "/home/lead_dashboard",
    coaching: "/home/coaching",
    multiTeam: "/home/multi_team_dashboard",
    reports: "/home/reports",
    custom: "/home/custom",
    audit: "/home/audit_report",
};

export const CoachingTab = {
    id: tabIds.coaching,
    value: (
        <div className="flex alignCenter">
            <div
                className="flex alignCenter justifyCenter"
                style={{ width: "45px" }}
            >
                <CoachingSvg />
            </div>
            <div className="flex alignCenter justifyCenter">
                <span>Coaching Dashboard</span>
            </div>
        </div>
    ),
    path: dashboardRoutes.coaching,
};

export const AnalyticsTab = [
    {
        id: tabIds.analysis,
        value: (
            <div className="flex alignCenter">
                <div
                    className="flex alignCenter justifyCenter"
                    style={{ width: "45px" }}
                >
                    <OverallSvg />
                </div>
                <div className="flex alignCenter justifyCenter">
                    <span>Overall Dashboard</span>
                </div>
            </div>
        ),
        path: dashboardRoutes.home,
        hasSubTabs: true,
    },
    {
        id: tabIds.team_details,
        value: (
            <div className="flex alignCenter">
                <div
                    className="flex alignCenter justifyCenter"
                    style={{ width: "45px" }}
                >
                    <TeamSvg />
                </div>
                <div className="flex alignCenter justifyCenter">
                    <span>Team Level Dashboard</span>
                </div>
            </div>
        ),
        path: dashboardRoutes.team,
    },
    {
        id: tabIds.rep_details,
        value: (
            <div className="flex alignCenter">
                <div
                    className="flex alignCenter justifyCenter"
                    style={{ width: "45px" }}
                >
                    <RepSvg />
                </div>
                <div className="flex alignCenter justifyCenter">
                    <span>Rep Level Dashboard</span>
                </div>
            </div>
        ),
        path: dashboardRoutes.rep,
    },
    {
        id: tabIds.parameters,
        value: (
            <div className="flex alignCenter">
                <div
                    className="flex alignCenter justifyCenter"
                    style={{ width: "45px" }}
                >
                    <ParaLvlSvg />
                </div>
                <div className="flex alignCenter justifyCenter">
                    <span>Parameter Dashboard</span>
                </div>
            </div>
        ),
        path: dashboardRoutes.parameter,
    },
    {
        id: tabIds.leadscore_details,
        value: (
            <div className="flex alignCenter">
                <div
                    className="flex alignCenter justifyCenter"
                    style={{ width: "45px" }}
                >
                    <LeadLvlSvg />
                </div>
                <div className="flex alignCenter justifyCenter">
                    <span>Lead Dashboard</span>
                </div>
            </div>
        ),
        path: dashboardRoutes.lead,
    },
    {
        id: tabIds.violation_details,
        value: (
            <div className="flex alignCenter">
                <div
                    className="flex alignCenter justifyCenter"
                    style={{ width: "45px" }}
                >
                    <VioLvlSvg />
                </div>
                <div className="flex alignCenter justifyCenter">
                    <span>Violation Dashboard</span>
                </div>
            </div>
        ),
        path: dashboardRoutes.violation,
    },
    {
        id: tabIds.audit_report,
        value: (
            <div className="flex alignCenter">
                <div
                    className="flex alignCenter justifyCenter"
                    style={{ width: "45px" }}
                >
                    <AuditDashboardSvg
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            transform: "scale(1.1)",
                        }}
                    />
                </div>
                <div className="flex alignCenter justifyCenter">
                    <span>Audit Dashboard</span>
                </div>
            </div>
        ),
        path: dashboardRoutes.audit,
    },
    {
        id: tabIds.reports,
        value: (
            <div className="flex alignCenter">
                <div
                    className="flex alignCenter justifyCenter"
                    style={{ width: "45px" }}
                >
                    <AllReportSvg />
                </div>
                <div className="flex alignCenter justifyCenter">
                    <span>All Reports</span>
                </div>
            </div>
        ),
        path: dashboardRoutes.reports,
    },
    {
        id: tabIds.custom,
        value: (
            <div className="flex alignCenter">
                <div
                    className="flex alignCenter justifyCenter"
                    style={{ width: "45px" }}
                >
                    <AllReportSvg />
                </div>
                <div className="flex alignCenter justifyCenter">
                    <span>My Dashboard</span>
                </div>
            </div>
        ),
        path: dashboardRoutes.custom,
    },
];

export const getCustomTab = ({ name, id }) => {
    return {
        id: "custom",
        value: (
            <div className="flex alignCenter">
                <div
                    className="flex alignCenter justifyCenter"
                    style={{ width: "45px" }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M3.33333 10.8331H8.33333C8.79167 10.8331 9.16667 10.4581 9.16667 9.99976V3.33309C9.16667 2.87476 8.79167 2.49976 8.33333 2.49976H3.33333C2.875 2.49976 2.5 2.87476 2.5 3.33309V9.99976C2.5 10.4581 2.875 10.8331 3.33333 10.8331ZM3.33333 17.4998H8.33333C8.79167 17.4998 9.16667 17.1248 9.16667 16.6664V13.3331C9.16667 12.8748 8.79167 12.4998 8.33333 12.4998H3.33333C2.875 12.4998 2.5 12.8748 2.5 13.3331V16.6664C2.5 17.1248 2.875 17.4998 3.33333 17.4998ZM11.6667 17.4998H16.6667C17.125 17.4998 17.5 17.1248 17.5 16.6664V9.99976C17.5 9.54142 17.125 9.16642 16.6667 9.16642H11.6667C11.2083 9.16642 10.8333 9.54142 10.8333 9.99976V16.6664C10.8333 17.1248 11.2083 17.4998 11.6667 17.4998ZM10.8333 3.33309V6.66642C10.8333 7.12476 11.2083 7.49976 11.6667 7.49976H16.6667C17.125 7.49976 17.5 7.12476 17.5 6.66642V3.33309C17.5 2.87476 17.125 2.49976 16.6667 2.49976H11.6667C11.2083 2.49976 10.8333 2.87476 10.8333 3.33309Z"
                            fill="#1A62F2"
                        />
                    </svg>
                </div>
                <div className="flex alignCenter justifyCenter">
                    <span>{name}</span>
                </div>
            </div>
        ),
        path: `/home/custom/${id}`,
        hasSubTabs: true,
    };
};

export const auditCardLabels = {
    auditor: {
        title: "No. of Auditors",
        valueLabel: "auditor_count",
        graphKey: "auditor_count",
        totalKey: "agents",
    },
    account: {
        title: "Accounts Audited",
        valueLabel: "account_count",
        graphKey: "accounts_audited",
        totalKey: "accounts",
    },
    agent: {
        title: "Agents Audited",
        valueLabel: "agent_audited",
        graphKey: "agent_audited",
        totalKey: "agents",
    },
    call: {
        title: "Calls Audited",
        valueLabel: "call_audited",
        graphKey: "call_audited",
        totalKey: "calls",
    },
    chat: {
        title: "Chats Audited",
        valueLabel: "chat_audited",
        graphKey: "chat_audited",
        totalKey: "chats",
    },
    email: {
        title: "Emails Audited",
        valueLabel: "email_audited",
        graphKey: "email_audited",
        totalKey: "emails",
    },
    minutes: {
        title: "Minutes Audited",
        valueLabel: "minute_audited",
        graphKey: "minute_audited",
        totalKey: "minutes",
    },
    minute: {
        title: "Minutes Audited",
        valueLabel: "minute_audited",
        graphKey: "minute_audited",
        totalKey: "minutes",
    },
};

export const auditTotalLabel = "current_stats";
export const auditPercentageLabel = "percentage";
export const downloadableReports = new Set([
    "fyers_monthly_quality_reports",
    "beato_coaching_report",
    "carestack_support_parameter_report",
    "coaching_assessment_report",
    "fyers_quality_reports",
    "fyers_qa_audit_reports",
    "product_utilisation_report",
    "ai_audit_dump_report",
    "aesl_counselor_report",
    "aesl_manager_report",
    "parameter_detailed_analysis_report",
    "rcl_acpt_report",
    "aesl_tl_report",
    "acko_ai_audit_dump_report",
]);
