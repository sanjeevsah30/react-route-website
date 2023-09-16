import { useUpdateDashboardMutation } from "@convin/redux/services/home/customDashboard.service";
import { CustomDashboardForm } from "@convin/type/CustomDashboard";
import { isDefined } from "@convin/utils/helper/common.helper";
import {
    Dispatch,
    ReactElement,
    ReactNode,
    createContext,
    useReducer,
    useCallback,
} from "react";

export interface ICustomDashboardStateContext {
    state: CustomDashboardForm;
    dispatch: Dispatch<Action>;
    prepareDashboardStateForUpdate: (e: Partial<CustomDashboardForm>) => void;
}

export const CustomDashboardStateContext =
    createContext<ICustomDashboardStateContext>(
        {} as ICustomDashboardStateContext
    );

const initialState: CustomDashboardForm = {
    dashboard_name: "",
    description: "",
    reports: [],
    single_objects: [],
    teams: [],
    reps: [],
    access_level: "private",
};

export enum ActionKind {
    updateState = "UPDATE",
    resetState = "RESET",
}

type Action = {
    type: "UPDATE" | "RESET";
    payload: Partial<CustomDashboardForm>;
};

function Reducer(state: CustomDashboardForm, action: Action) {
    const { type, payload } = action;
    switch (type) {
        case ActionKind.updateState:
            return {
                ...state,
                ...payload,
            };
        case ActionKind.resetState:
            return {
                ...initialState,
            };
        default:
            return state;
    }
}

export default function CustomDashboardStateProvider({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const prepareDashboardStateForUpdate: ICustomDashboardStateContext["prepareDashboardStateForUpdate"] =
        (dashboardField) => {
            dispatch({
                type: "UPDATE",
                payload: {
                    ...state,
                    ...dashboardField,
                },
            });
        };

    return (
        <CustomDashboardStateContext.Provider
            value={{
                state,
                dispatch,
                prepareDashboardStateForUpdate,
            }}
        >
            {children}
        </CustomDashboardStateContext.Provider>
    );
}
