export interface CustomDashboardForm {
    id?: number;
    dashboard_name: string;
    description: string;
    reports: ReportObjectType[];
    single_objects: SingelObjectType[];
    teams: number[];
    reps: number[];
    created_by?: {
        id: number;
        first_name: string;
        middle_name: string;
        last_name: string;
        email: string;
        username: string;
        role: number;
        primary_phone: string;
        team_id: null | number;
    };
    access_level: "private" | "public" | "shared";
    layout?: GridLayout.Layout[];
}

type layoytObject = {
    i: number;
    x: number;
    y: number;
    w: number;
    h: number;
    card_type: "single_object" | "report";
    type: string;
    minW: number;
    minH: number;
    maxH: number;
    maxW: number;
};

export interface Filters {
    meeting_type: "email" | "call" | "chat" | undefined;
    teams_id: number[] | null;
    reps_id: number[] | null;
    template_id: null | number;
    min_duration: null | number;
    max_duration: null | number;
    start_date: null | number;
    end_date: null | number;
    audit_start_date: null | number;
    audit_end_date: null | number;
    trend_sdate: null;
    trend_edate: null;
    timezone: string;
    is_call_level: boolean;
    question_id: null | number;
    is_line_graph: boolean;
    limit: null;
    violation_id: null;
    parameter_list: null;
    is_manual: boolean;
    freq: null;
    auditors_id: null | number[];
    stages_id: null | number;
    call_types_id: null | number[];
    tags_id: null | number[];
    account_tags_id: null;
    speaker_type: null;
    threshold: {
        good: number;
        average: number;
        bad: number;
    };
    template_id: null | number;
    date_repr: string | null;
    audit_date_repr: string | null;
}

export interface RootStore {
    scheduled_reports: {
        all_reports: {
            loading: boolean;
            data: ReportObjectType[];
        };
    };
    common: {
        filterAuditTemplates: {
            active: number;
        };
    };
}

type reportTypes = {
    name: string;
    type: string;
};

export interface AuditCardType {
    title: string;
    name: string;
    count: number;
    change: number;
    active: boolean;
}

export interface dataType {
    count: number;
    change: number;
}
export interface ReportObjectType {
    id?: number;
    type: string;
    name: string;
    filters: Partial<Filters>;
    card_type: "report" | "single_object";
    custom_dashboard: number;
    layout: GridLayout.Layout;
    is_graph: boolean;
}
export interface SingelObjectType extends ReportObjectType {
    data: dataType;
}

export interface PinReportPayloadType {
    custom_dashboards: number[];
    card_type: "report" | "single_object";
    type: string;
    filters?: Filters;
}

export interface unPinReportPayloadType {
    id: number;
}

export interface shareReportPayloadType {
    emails: string[];
    dashboard_screenshot: file;
    custom_dashboard: number;
}
