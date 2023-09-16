import { Category } from "@convin/type/Audit";
import {
    Dispatch,
    ReactElement,
    ReactNode,
    createContext,
    useReducer,
} from "react";

type CategoryStateType = {
    name: string;
    description: string;
    id?: number;
};

export interface ICategoryStateContext {
    state: CategoryStateType;
    dispatch: Dispatch<Action>;
    prepareCategoryStateForUpdate: (e: Category) => void;
}

export const CategorySateContext = createContext<ICategoryStateContext>(
    {} as ICategoryStateContext
);

const initialState: CategoryStateType = {
    name: "",
    description: "",
};

export enum ActionKind {
    updateState = "UPDATE",
    resetState = "RESET",
}

type Action = {
    type: "UPDATE" | "RESET";
    payload: Partial<CategoryStateType>;
};

function Reducer(state: CategoryStateType, action: Action): CategoryStateType {
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

export default function CategoreyStateProvider({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const prepareCategoryStateForUpdate: ICategoryStateContext["prepareCategoryStateForUpdate"] =
        (category) => {
            dispatch({
                type: "UPDATE",
                payload: {
                    ...state,
                    name: category.name,
                    description: category.description,
                    id: category.id,
                },
            });
        };
    return (
        <CategorySateContext.Provider
            value={{
                state,
                dispatch,
                prepareCategoryStateForUpdate,
            }}
        >
            {children}
        </CategorySateContext.Provider>
    );
}
