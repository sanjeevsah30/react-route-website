import { useUpdateQmsFiledMutation } from "@convin/redux/services/settings/qms.service";
import { isDefined } from "@convin/utils/helper/common.helper";
import {
    Dispatch,
    ReactElement,
    ReactNode,
    createContext,
    useReducer,
    useCallback,
} from "react";

type MetaData = {
    date_time?: "date" | "time" | "both";
    choices?: string[];
    is_multiple?: boolean;
    nature: "text_field" | "select" | "date_time";
};

export type QmsField = {
    id?: number;
    name: string;
    card_type: "custom" | "default";

    is_disabled: boolean;
    is_mandatory: boolean;
    auditor?: number;
    is_customizable?: boolean;
    type?: string;
    metadata: MetaData;
};

export interface IQmsStateContext {
    state: QmsField;
    dispatch: Dispatch<Action>;
    prepareQmsStateForUpdate: (e: QmsField) => void;
    handleUpdate: (payload: QmsField, callBack?: () => void) => void;
}

export const QmsStateContext = createContext<IQmsStateContext>(
    {} as IQmsStateContext
);

const initialState: QmsField = {
    name: "",
    card_type: "custom",
    is_disabled: false,
    is_mandatory: false,
    metadata: {
        date_time: "date",
        choices: [],
        nature: "text_field",
    },
};

export enum ActionKind {
    updateState = "UPDATE",
    resetState = "RESET",
}

type Action = {
    type: "UPDATE" | "RESET";
    payload: Partial<QmsField>;
};

function Reducer(state: QmsField, action: Action) {
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

export default function QmsStateProvider({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const [updateQmsField] = useUpdateQmsFiledMutation();
    const prepareQmsStateForUpdate = (qmsField: QmsField): void => {
        dispatch({
            type: "UPDATE",
            payload: {
                ...qmsField,
            },
        });
    };
    const handleUpdate: IQmsStateContext["handleUpdate"] = useCallback(
        (payload, callBack) => {
            if (isDefined(payload.id))
                updateQmsField(payload)
                    .unwrap()
                    .then(() => {
                        dispatch({
                            type: "RESET",
                            payload: {},
                        });
                        if (typeof callBack === "function") callBack();
                    });
        },
        []
    );
    return (
        <QmsStateContext.Provider
            value={{
                state,
                dispatch,
                prepareQmsStateForUpdate,
                handleUpdate,
            }}
        >
            {children}
        </QmsStateContext.Provider>
    );
}
