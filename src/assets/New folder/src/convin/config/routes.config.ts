type RouteType = {
    name: string;
    to: string;
    path: string;
    checkCanAcess: boolean;
    canAccessName?: string;
};

type RouteTypeWithSubType = {
    name: string;
    hasSubType: boolean;
    subtype: { [key in Paths]?: RouteType };
};

type Paths =
    | "USER_PROFILE"
    | "USER_MANAGER"
    | "ROLE_MANAGER"
    | "TOPIC_MANAGER"
    | "INTEGRATIONS"
    | "TEAM_MANAGER"
    | "AUDIT_MANAGER"
    | "SAMPLING_MANAGER"
    | "VIOLATION_MANAGER"
    | "RECORDING_MANAGER"
    | "CALL_TYPE_MANAGER"
    | "CALL_TAGS_MANAGER"
    | "AGENT_ASSIST"
    | "NOTES"
    | "MANUAL_QMS"
    | "SCHEDULED_REPORTS"
    | "BILLING"
    | "SCORE_SENSE";

export const SettingRoutes: Record<Paths, RouteType> = {
    USER_PROFILE: {
        name: "User Profile",
        to: "user_profile",
        path: "user_profile",
        checkCanAcess: false,
    },
    USER_MANAGER: {
        name: "User Manager",
        to: "user_manager",
        path: "user_manager",
        checkCanAcess: true,
    },
    ROLE_MANAGER: {
        name: "Role Manager",
        to: "role_manager",
        path: "role_manager",
        checkCanAcess: true,
    },
    TOPIC_MANAGER: {
        name: "Topic Manager",
        to: "topic_manager",
        path: "topic_manager",
        checkCanAcess: true,
    },
    INTEGRATIONS: {
        name: "Integrations",
        to: "integrations",
        path: "integrations",
        checkCanAcess: true,
    },
    TEAM_MANAGER: {
        name: "Team Manager",
        to: "team_manager",
        path: "team_manager",
        checkCanAcess: true,
    },
    AUDIT_MANAGER: {
        name: "Audit Manager",
        to: "audit_manager",
        path: "audit_manager",
        checkCanAcess: true,
    },
    SAMPLING_MANAGER: {
        name: "Sampling Manager",
        to: "sampling_manager",
        path: "sampling_manager",
        checkCanAcess: true,
    },
    VIOLATION_MANAGER: {
        name: "Violation Manager",
        to: "violation_manager",
        path: "violation_manager",
        checkCanAcess: true,
    },
    RECORDING_MANAGER: {
        name: "Recording Manager",
        to: "recording_manager",
        path: "recording_manager",
        checkCanAcess: true,
    },
    CALL_TYPE_MANAGER: {
        name: "Type Manager",
        canAccessName: "Call Type Manager",
        to: "type_manager",
        path: "type_manager",
        checkCanAcess: true,
    },
    CALL_TAGS_MANAGER: {
        name: "Tags Manager",
        canAccessName: "Call Tags Manager",
        to: "tags_manager",
        path: "tags_manager",
        checkCanAcess: true,
    },
    BILLING: {
        name: "Billing",
        to: "billing",
        path: "billing",
        checkCanAcess: true,
    },
    SCHEDULED_REPORTS: {
        name: "Scheduled Reports",
        to: "scheduled_reports",
        path: "scheduled_reports",
        checkCanAcess: true,
    },
    NOTES: {
        name: "Notes",
        to: "notes",
        path: "notes",
        checkCanAcess: false,
    },
    MANUAL_QMS: {
        name: "Manual QMS",
        to: "qms",
        path: "qms",
        checkCanAcess: true,
        canAccessName: "QMS",
    },
    AGENT_ASSIST: {
        name: "Agent Assist",
        to: "agent_assist/battle_cards",
        path: "agent_assist/battle_cards",
        checkCanAcess: false,
    },
    SCORE_SENSE: {
        name: "Score Sense",
        to: "score_sense",
        path: "score_sense",
        checkCanAcess: true,
    },
};

export const SettingsTypeConfig: Array<RouteTypeWithSubType> = [
    {
        name: "General",
        hasSubType: true,
        subtype: {
            USER_PROFILE: SettingRoutes.USER_PROFILE,
            TEAM_MANAGER: SettingRoutes.TEAM_MANAGER,
            ROLE_MANAGER: SettingRoutes.ROLE_MANAGER,
            USER_MANAGER: SettingRoutes.USER_MANAGER,
            RECORDING_MANAGER: SettingRoutes.RECORDING_MANAGER,
        },
    },
    {
        name: "Integrations & Apps",
        hasSubType: true,
        subtype: {
            INTEGRATIONS: SettingRoutes.INTEGRATIONS,
            AGENT_ASSIST: SettingRoutes.AGENT_ASSIST,
        },
    },
    {
        name: "Product Settings",
        hasSubType: true,
        subtype: {
            AUDIT_MANAGER: SettingRoutes.AUDIT_MANAGER,
            SAMPLING_MANAGER: SettingRoutes.SAMPLING_MANAGER,
            VIOLATION_MANAGER: SettingRoutes.VIOLATION_MANAGER,
            CALL_TYPE_MANAGER: SettingRoutes.CALL_TYPE_MANAGER,
            CALL_TAGS_MANAGER: SettingRoutes.CALL_TAGS_MANAGER,
            TOPIC_MANAGER: SettingRoutes.TOPIC_MANAGER,
            MANUAL_QMS: SettingRoutes.MANUAL_QMS,
            SCHEDULED_REPORTS: SettingRoutes.SCHEDULED_REPORTS,
        },
    },
    {
        name: "AI Settings",
        hasSubType: true,
        subtype: {
            NOTES: SettingRoutes.NOTES,
            SCORE_SENSE: SettingRoutes.SCORE_SENSE,
        },
    },
    {
        name: "Billing",
        hasSubType: false,
        subtype: {
            BILLING: SettingRoutes.BILLING,
        },
    },
];
