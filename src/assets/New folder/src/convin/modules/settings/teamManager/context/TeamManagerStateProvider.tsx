import { SubTeam } from "@convin/type/Team";
import {
    Dispatch,
    ReactElement,
    ReactNode,
    createContext,
    useReducer,
} from "react";

enum ActionKind {
    "UPDATE",
    "RESET",
}
export type TeamManagerStateType = {
    teamToUpdate: {
        id?: number;
        name: string;
        subteams: Array<{ id: number | string } & Omit<SubTeam, "id">>;
    };
    isCRUDTeamDrawerOpen: boolean;
    isDeleteTeamModalOpen: boolean;
    isManageUsersDrawerOpen: boolean;
};

export const initialState: TeamManagerStateType = {
    teamToUpdate: {
        name: "",
        subteams: [],
    },
    isCRUDTeamDrawerOpen: false,
    isDeleteTeamModalOpen: false,
    isManageUsersDrawerOpen: false,
};

interface TeamManagerReducerAction {
    type: keyof typeof ActionKind;
    payload: Partial<TeamManagerStateType>;
}

function Reducer(
    state: TeamManagerStateType,
    action: TeamManagerReducerAction
) {
    const { type, payload } = action;
    switch (type) {
        case "UPDATE":
            return {
                ...state,
                ...payload,
            };

        case "RESET":
            return {
                ...initialState,
            };
        default:
            return state;
    }
}

export interface ITeamManagerStateContext {
    state: TeamManagerStateType;
    dispatch: Dispatch<TeamManagerReducerAction>;
}

export const TeamManagerStateContext = createContext<ITeamManagerStateContext>(
    {} as ITeamManagerStateContext
);

export default function TeamManagerProvider({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <TeamManagerStateContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            {children}
        </TeamManagerStateContext.Provider>
    );
}
