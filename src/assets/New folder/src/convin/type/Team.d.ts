import { UserType } from "@convin/type/User";

interface SubTeam {
    id: number;
    about: string;
    group: Team["id"] | null;
    manager: UserType | null;
    members: UserType[];
    name: string;
}

interface Team extends SubTeam {
    subteams: SubTeam[];
    template_exists: boolean;
}

interface TeamsPayload {
    subteams?: {
        group: number | null;
        id?: number | undefined;
        name: string;
        members?: Array<Partial<UserType>>;
    }[];
    name: string;
    id: number;
    members?: Array<Partial<UserType>>;
}

interface MemberAdded {
    members: number[];
    team: number | null;
}

interface SubteamTableData {
    id: number;
    name: string;
    count: number;
}
interface DeleteTeam {
    migration_team_id: number | null;
    team_id: number | null;
}

interface MoveMember {
    team_id: number | null;
    member_id: number | null;
}

interface MigrationPayloadType {
    team_id: number | null;
    migration_team_id: number | null;
}
