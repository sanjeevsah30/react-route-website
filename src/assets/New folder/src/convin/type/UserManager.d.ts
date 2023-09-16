import { UserType } from "./User";
import { FormFieldType } from "./Common";
export interface FilterData {
    label: string;
    value: string | number | boolean | null;
}

export interface InviteUserType extends UserType {
    invitation_id: string;
    extra_info: Record<string, unknown>;
    team: number;
    role: number;
    license: number;
}

export interface InviteUser {
    count: number;
    next: number | null;
    previous: number | null;
    results: InviteUserType[];
}

export interface CreateUserPayload extends UserType {
    team: number | string | null;
    role: number | string | null;
    subscription: number | string | null;
}

export interface CreateUserFormValues {
    email: FormFieldType;
    first_name: FormFieldType;
    last_name: FormFieldType;
    primary_phone: FormFieldType;
    role: FormFieldType;
    team: FormFieldType;
    user_type: FormFieldType;
    subscription: FormFieldType;
}
