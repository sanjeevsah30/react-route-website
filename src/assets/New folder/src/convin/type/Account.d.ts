export interface AccountList {
    count: number;
    next: string | null;
    previous: string | null;
    results: AccountListResult[];
}

export interface AccountListResult {
    account_size: number;
    ai_score: number | null;
    avatar: string;
    close_date: Date | null;
    currency: string | null;
    duration: number;
    id: number;
    last_connected_date: string;
    lead_score: number;
    manual_score: number | null;
    meeting_count: number;
    name: string;
    stage: string | null;
    template: Template;
    sales_task: SalesTask;
}

export interface SalesTask {
    annual_revenue: number;
    company_name: string;
    created: string;
    description: string | null;
    id: number;
    industry: string | null;
    name: string;
    number_of_employees: number;
    owner: Owner;
    owner_team: number | null;
    primary_phone: string;
    type: string | null;
    updated: string;
    website: string | null;
}

export interface Owner {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    email: string;
    role: number;
    username: string;
}

export interface LeadScore {
    id: number;
    question: string;
    result: boolean;
    type_id: number;
    weight: number;
}

export interface Comment {
    comment: string;
    created: string;
    id: number;
    is_disabled: boolean;
    last_reply: string | null;
    media: record<string, unknown>;
    media_type: record<string, unknown>;
    owner: owner;
    parent: number | null;
    replies_count: number;
    reply_initials: string[];
    transcript: record<string, unknown>;
    updated: string;
}

export interface CommentList {
    count: number;
    next: string | null;
    previous: string | null;
    results: Comment[];
}

export interface MeetingsDetails {
    id: number;
    title: string;
}

export interface Graph {
    epoch: number;
    meetings: number;
    meetings_detail: MeetingsDetails[];
}

export interface Template {
    description: string;
    id: number;
    is_disabled: boolean;
    name: string;
    notify_on_audit: boolean;
    parameters: record<string, unknown>;
    teams: number[];
}

export interface Topics {
    category_id: number | null;
    count: number;
    description: string;
    exact_phrases: string[];
    id: number;
    intent: string;
    last_edited_by: string;
    last_edited_date: string;
    name: string;
    said_by: string;
}

export interface Account {
    account_size: number | null;
    ai_score: number;
    avatar: string;
    client: record<string, unknown>;
    close_date: string | null;
    crm_url: record<string, unknown> | null;
    currency: string | null;
    duration: number;
    id: number;
    last_connected_date: string;
    lead_score: number;
    manual_score: number;
    meeting_count: number;
    name: string;
    reps: Owner[];
    sales_task: SalesTask;
    stage: record<string, unknown>;
    template: Template;
    topics: Topics[];
}

export interface MeetingList {
    count: number;
    next: string | null;
    previous: string | null;
    results: Meeting[];
}

export interface Meeting {
    agenda: "string";
    call_type: string | null;
    client: record<string, unknown>;
    end_time: Date;
    id: number;
    owner: Owner;
    participants: record<string, unknown>;
    processing_status: string;
    reps: Owner[];
    search_context: record<string, unknown>;
    snippets: record<string, unknown>;
    start_time: Date;
    stats: Stats;
    tags: record<string, unknown>;
    title: string;
}

export interface Stats {
    ai_score: number | null;
    audit_time: number | null;
    audited_date: number | null;
    auditor: number | null;
    client_filler_rate: number;
    client_overlap_rate: number;
    client_question_count: number;
    client_sentiment: number;
    client_talk_ratio: number;
    client_talk_speed: number;
    dead_air_timestamp: number;
    duration: number;
    id: number;
    interactivity: number;
    lead_score: number | null;
    longest_monlogue_client_time_range: number | null;
    longest_monlogue_owner_time_range: number | null;
    longest_monologue_client: number;
    longest_monologue_owner: number;
    manual_score: number | null;
    max_dead_air: number;
    max_overlap: number;
    max_overlap_speaker: string;
    max_overlap_timestamp: number;
    owner_filler_rate: number;
    owner_overlap_rate: number;
    owner_question_count: number;
    owner_sentiment: number;
    owner_talk_ratio: number;
    owner_talk_speed: number;
    patience: number;
    sentiment: number;
    volume: number;
}

export interface CallTranscript {
    end_time: number;
    highlighted: boolean;
    monologue_text: string;
    sentence_categories: record<string, unknown>;
    sentiment_score: number[];
    speaker_id: number | null;
    speaker_name: string;
    speaker_type: string;
    start_time: number;
    topics: record<string, unknown>;
    word_alignment: [Array<number | string>];
}

export interface SubFilter {
    id: number;
    name: string;
    score: boolean;
}

export interface IQuestion {
    id: number;
    percent: number;
    question: string;
    score_given: number | null;
    score_label: string;
    type: string;
    sub_filters: SubFilter[];
}

export interface AIAccountScore {
    calculated_score: number;
    category: ConstrainDOMString;
    max_score: number;
    questions: IQuestion[];
}

export interface Stage {
    id: number;
    stage: string;
    label: string;
}
