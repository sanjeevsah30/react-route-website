import { Role } from "./Role";
import { Subscription } from "@convin/type/Subscription";
import { SubTeam } from "@convin/type/Team";

interface OnboardingSteps {
    msg: string;
    link: string;
    done: boolean;
}

export interface AuthUserType extends UserType {
    id: number;
    onboarding_progress: {
        completed: number;
        total: number;
        steps: OnboardingSteps[];
    };
    manager: UserType | null;
    team_name: string;
    license_name: string;
    extra_details: {
        ip_address: [];
        mac_address: [];
        phone_numbers: [];
        platform_ids: Record<string, unknown>;
        display_names: [];
    };
    last_login: string | null;
    username: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    designation: number;
    user_type: number;
    timezone: string;
    alternate_phones: [];
    team: number;
    subscription: number;
    groups: [];
    user_permissions: [];
    role: Role;
}

export interface UserType {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    location: string;
    role_name: string;
    email: string;
    primary_phone: string | null;
    role: Role | null;
    team: SubTeam;
    subscription: Subscription;
    manager: UserType | null;
    date_joined: string;
    org_date_joined: string | null;
    is_active: boolean;
    last_login: string | null;
    user_type: number;
    timezone: string;
    alternate_phones: [];
    integrations: [];
    label: string;
}

export interface UpdateUserPayload {
    first_name: string;
    last_name: string;
    email: string;
    date_joined: string | null;
    org_date_joined: string | null;
    primary_phone: string | null;
    location: string;
    manager: number | null;
    role: number | null;
    user_type: number;
    team: number | null;
    is_active: boolean;
}
