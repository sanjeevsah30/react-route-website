export interface Role {
    id: number;
    allowed_teams: number[];
    can_be_edited: boolean;
    code_names: CodeNames[];
    description: string;
    is_default: boolean;
    name: string;
    permissions_count: number;
    users: string[];
}

interface CodeNames {
    heading: string;
    is_switch: boolean;
    is_visible: boolean;
    permissions: {
        [key: string]: {
            view: Permissions;
            edit: Permissions[];
            delete: Permissions[];
        };
    };
}

interface Permissions {
    code_name: string;
    display_name: string;
    is_negative: boolean;
    is_default: boolean;
    action: string;
    select_team: boolean;
    dependent_code_names: string[];
    related_code_names: string[];
    restrict_code_name: string;
    is_selected: boolean;
}
