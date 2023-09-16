import { UserType } from "./User";

export interface MeetingType {
    title: string;
    id: number;
    owner: UserType;
    sales_task: unknown;
    start_time: number;
    end_time: number;
    processing_status: string;
    stats: unknown;
    participants: unknown;
    call_type: number;
}

export interface MonologueType {
    start_time: number;
    end_time: number;
    name?: string;
    speaker_type?: string;
    text?: string;
    type?: string;
    color?: string;
    sentiment_score?: number[];
    speaker_name?: string;
    speaker_id?: number;
}

export interface TranscriptTopicType {
    [key: string]: Array<{
        start_time: number;
        end_time: number;
        name?: string;
        score: number;
        text: string;
        topic_id: number;
        last_index: number;
        detected_phrases: { [key: string]: string };
    }>;
}

export interface TranscriptType {
    speaker_name: string;
    start_time: number;
    end_time: number;
    monologue_text: string;
    word_alignment: string[];
    topics: TranscriptTopicType;
    speaker_type: string;
    speaker_id: number;
    sentiment_score: number[];
    sentence_categories: {
        question?: MonologueType[];
        action?: MonologueType[];
    };
    monologue_text: string;
}
