import { MeetingTypeConst } from "./Common";

export type scoreType = "Lead" | "CSAT" | "Collection";

export interface ScoreSense<score_type extends scoreType> {
    id: number;
    lower_range: [number, number];
    mid_range: [number, number];
    upper_range: [number, number];
    upper_bound: number;
    middle_bound: number;
    score_type: score_type;
    teams: number[];
    tags: number[];
    call_type: number[];
    meeting_type: MeetingTypeConst;
}
