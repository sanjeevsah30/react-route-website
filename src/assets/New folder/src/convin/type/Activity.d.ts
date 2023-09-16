import { MeetingTypeConst } from "./Common";
import { scoreType } from "./ScoreSense";
import { UserType } from "./User";

export type ActivityPayload = {
    model: "gpt.models.ScoreSense";
    object_id: number;
};

export type ScoreSenseChange = Record<
    "after" | "before",
    {
        id: number;
        meeting_type: MeetingTypeConst;
        middle_bound: number;
        upper_bound: number;
        score_type: scoreType;
    }
>;

export type ActivityLog<change> = {
    model: string;
    id: number;
    object_id: number;
    action: "UPDATE" | "CREATE" | "DELETE";
    created_at: string;
    updated_at: string;
    changes: change;
    person: UserType | null;
};
