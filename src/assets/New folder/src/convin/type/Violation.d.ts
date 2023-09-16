import { UserType } from "./User";

type userAction = {
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    middle_name: string;
    primary_phone: number;
    role: number;
    team_id: number;
    username: number;
};
export interface Violation<T = UserType> {
    id: number;
    action: T[];
    name: string;
    is_disabled: boolean;
    applicability: "template" | "category" | "question";
    label: string;
}
