import { UserType } from "@convin/type/User";
import { Violation } from "@convin/type/Violation";
import {
    Dispatch,
    ReactElement,
    ReactNode,
    createContext,
    useReducer,
} from "react";

type ViolationStateType = {
    id?: number;
    name: string;
    action: UserType["id"][];
    applicability: Violation["applicability"];
};

export interface IViolationStateContext {
    state: ViolationStateType;
    dispatch: Dispatch<Action>;
    prepareViolationStateForUpdate: (e: Violation) => void;
}

export const ViolationSateContext = createContext<IViolationStateContext>(
    {} as IViolationStateContext
);

const initialState: ViolationStateType = {
    name: "",
    action: [],
    applicability: "template",
};

export enum ActionKind {
    updateState = "UPDATE",
    resetState = "RESET",
}

type Action = {
    type: "UPDATE" | "RESET";
    payload: Partial<ViolationStateType>;
};

function Reducer(
    state: ViolationStateType,
    action: Action
): ViolationStateType {
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

export default function ViolaStateProvider({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const prepareViolationStateForUpdate: IViolationStateContext["prepareViolationStateForUpdate"] =
        (e) => {
            dispatch({
                type: "UPDATE",
                payload: {
                    ...state,
                    name: e.name,
                    action: e.action.map((user) => user.id),
                    applicability: e.applicability,
                    id: e.id,
                },
            });
        };
    return (
        <ViolationSateContext.Provider
            value={{
                state,
                dispatch,
                prepareViolationStateForUpdate,
            }}
        >
            {children}
        </ViolationSateContext.Provider>
    );
}
