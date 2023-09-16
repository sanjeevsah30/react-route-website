import { Team } from "./Team";
import { MeetingTypeConst } from "./Common";

export interface Template {
    id: number;
    teams: Team[];
    categories_count: number;
    overall_score: number;
    name: string;
    description: string;
    parameters: {
        call_tags: number[];
        call_types: number[];
        meeting_type: MeetingTypeConst | null;
    };
    is_default: boolean;
    notify_on_audit: boolean;
}

export interface TemplatePayload {
    teams: number[];
    name: string;
    parameters: {
        call_tags: number[];
        call_types: number[];
        meeting_type: MeetingTypeConst | null;
    };
    is_default: boolean;
    notify_on_audit: boolean;
}

export interface CategoryPayload {
    description: string;
    id: number;
    is_disabled: boolean;
    name: string;
    seq_no: number;
    template: number;
}

export interface CategorySequencePayload {
    categories_data: Pick<Category, "id" | "seq_no">[];
}

export interface Category {
    description: string;
    id: number;
    is_disabled: boolean;
    name: string;
    questions_count: number;
    seq_no: number;
    template: Template;
}

export interface CategoryPayload extends Category {
    template: number;
}
export interface Question {
    id: number;
    reasons: Reason[];
    applicable_violation: ApplicableViolations[];
    has_filters: boolean;
    question_text: string;
    question_desc: string;
    question_type: "yes_no" | "rating" | "custom" | "none";
    intent: "positive" | "negative" | "neutral";
    intent_option_id: number;
    max_option_id: number;
    has_filters: boolean;
    is_live_assist: boolean;
    live_assist_alias: string;
    settings: {
        default: number;
        mandate_notes_on: number[];
        no_weight?: number;
        yes_weight?: number;
        weight: number;
        violation: {
            [key in "yes_weight" | "no_weight" | number | string]: number[];
        };
        is_deduction?: boolean;
        is_template_level?: boolean;
        custom: {
            id: number;
            default: boolean;
            mandate_notes: boolean;
            name: string;
            reasons: {
                id?: Reason["id"];
                option_id: number;
                reason_text: string;
            }[];
            weight: number | string;
        }[];
    };
    seq_no: number;
    category: Category;
    is_disabled: boolean;
    is_mandatory: boolean;
}

export interface QuestionPayload extends Question {
    id?: number;
    reasons: Partial<Reason>[];
    applicable_violation: number[];
    category?: Category["id"];
    settings: {
        default: number | string;
        mandate_notes_on: number[];
        no_weight?: number;
        yes_weight?: number;
        weight?: number;
        violation?: { [key in "yes_weight" | "no_weight" | number]?: number[] };
        is_deduction?: boolean;
        is_template_level?: boolean;
        custom?: {
            id?: number;
            default: boolean;
            mandate_notes: boolean;
            name: string;
            reasons: {
                id?: number;
                reason_text: string;
            }[];
            weight: number | string;
        }[];
    };
    category: number;
}

export interface QuestionSequencePayload {
    questions_data: Pick<Question, "id" | "seq_no">[];
}

export interface Reason {
    id: number | string;
    reason_text: string;
    option_id: number;
    is_disabled: boolean;
    question: number;
}

export interface ApplicableViolations {
    id: number;
    name: string;
    applicability: string;
    is_disabled: boolean;
    action: number[];
}

export interface AuditStat {
    name: string;
    count: number;
    change: number;
}

export interface AuditorListResut {
    id: number;
    name: string;
    account_audit_details: AuditStat;
    agent_audit_details: AuditStat;
    minute_audit_details: AuditStat;
    call_audit_details: AuditStat;
    teams_covered: string[];
}

export interface AuditorList {
    count: number;
    next: string | null;
    previous: string | null;
    results: AuditorListResult[];
}

export interface AuditPerformanceGraphStat {
    epoch: number;
    count: number;
}

export interface AuditPerformanceGraph {
    accounts: AuditPerformanceGraphStat[];
    agents: AuditPerformanceGraphStat[];
    calls: AuditPerformanceGraphStat[];
    minutes: AuditPerformanceGraphStat[];
}

export interface AuditPerformanceGraphPayload {
    fields: Strings[];
    id: number;
    start_time: number | undefined;
    end_time: number | undefined;
}
