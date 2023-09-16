import { useUpdateParameterByIdMutation } from "@convin/redux/services/settings/auditManager.service";
import { Question, QuestionPayload, Reason } from "@convin/type/Audit";
import { isDefined } from "@convin/utils/helper/common.helper";
import {
    Dispatch,
    ReactElement,
    ReactNode,
    createContext,
    useCallback,
    useReducer,
} from "react";

export interface IParameterStateContext {
    state: ParameterStateType;
    dispatch: Dispatch<Action>;
    prepareParameterStateForUpdate: (e: Question) => void;
    handleUpdate: (
        parameter: { id: number; category: number } & Partial<QuestionPayload>,
        callBack?: () => void
    ) => void;
}

export const ParameterStateContext = createContext<IParameterStateContext>(
    {} as IParameterStateContext
);

export interface IParameterState {
    id?: number;
    question_desc: string;
    question_text: string;
    question_type: Question["question_type"];
    intent: Question["intent"];
    is_mandatory: Question["is_mandatory"];
    reasons: Reason[];
    is_live_assist: boolean;
    live_assist_alias: string;
    category?: number;
    settings: {
        default: number | string;
        mandate_notes_on: number[];
    };
}

export interface BooleanTypeSettingsState {
    settings: {
        yes_weight: number | string;
        no_weight: number | string;
        boolean_reasons: {
            yes_reasons: {
                id: number | string;
                reason_text: string;
                option_id: number;
            }[];
            no_reasons: {
                id: number | string;
                reason_text: string;
                option_id: number;
            }[];
        };
        boolean_violations: {
            no_weight: number[];
            yes_weight: number[];
        };
    };
}

export interface RatingTypeSettingsState {
    settings: {
        weight: number | string;
        rating_reasons: {
            [key: number]: {
                id: number | string;
                reason_text: string;
                option_id: number;
            }[];
        };
        rating_violations: {
            [key: number]: number[];
        };
    };
}

export interface CustomTypeSettingsState {
    settings: {
        custom: {
            id: string | number;
            default: boolean;
            mandate_notes: boolean;
            name: string;
            reasons: {
                id: number | string;
                reason_text: string;
            }[];
            weight: number | string;
            violation: number[];
        }[];
        is_template_level: boolean;
        is_deduction: boolean;
    };
}

export type ParameterStateType = IParameterState &
    Partial<BooleanTypeSettingsState> &
    Partial<RatingTypeSettingsState> &
    Partial<CustomTypeSettingsState>;

const initialState: ParameterStateType = {
    question_desc: "",
    question_text: "",
    question_type: "yes_no",
    intent: "neutral",
    is_mandatory: false,
    reasons: [],
    is_live_assist: false,
    live_assist_alias: "",
    settings: {
        default: -1,
        mandate_notes_on: [],

        /**Yes_No State */
        yes_weight: 0,
        no_weight: 0,
        boolean_reasons: {
            yes_reasons: [],
            no_reasons: [],
        },
        boolean_violations: {
            no_weight: [],
            yes_weight: [],
        },
        /** End of Yes_No State */

        /**Rating State */
        weight: 0,
        rating_reasons: Object.fromEntries(
            Array.from({ length: 11 }, (_, i) => [i, []])
        ),
        rating_violations: Object.fromEntries(
            Array.from({ length: 11 }, (_, i) => [i, []])
        ),
        /**End of Rating State */

        /**Custom State */
        is_template_level: true,
        is_deduction: false,
        custom: [],
        /**End of Custom State */
    },
};

export enum ActionKind {
    updateState = "UPDATE",
    resetState = "RESET",
}

type Action = {
    type: "UPDATE" | "RESET";
    payload: Partial<ParameterStateType>;
};

function Reducer(
    state: ParameterStateType,
    action: Action
): ParameterStateType {
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

export default function ParameterStateProvider({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const [updateParameter] = useUpdateParameterByIdMutation();
    const prepareParameterStateForUpdate = (parameter: Question): void => {
        const {
            id,
            question_type,
            question_desc,
            question_text,
            intent,
            is_mandatory,
            reasons,
            live_assist_alias,
            is_live_assist,
            settings,
            category,
        } = parameter;
        let parameterToEdit: Partial<ParameterStateType> = {
            id,
            question_type,
            question_text,
            question_desc,
            intent,
            is_mandatory,
            live_assist_alias,
            is_live_assist,
            category: category.id,
        };
        let settingsPayload: Partial<ParameterStateType["settings"]> = {
            default: settings.default,
            mandate_notes_on: settings.mandate_notes_on,
        };

        if (question_type === "yes_no") {
            settingsPayload = {
                ...settingsPayload,
                yes_weight: settings.yes_weight,
                no_weight: settings.no_weight,
                boolean_reasons: {
                    yes_reasons: reasons.filter((e) => e.option_id === 1),
                    no_reasons: reasons.filter((e) => e.option_id === 0),
                },
                ...(isDefined(settings.violation) && {
                    boolean_violations: {
                        no_weight: settings?.violation?.no_weight,
                        yes_weight: settings?.violation?.yes_weight,
                    },
                }),
            };

            parameterToEdit = {
                ...parameterToEdit,
                settings: { ...state.settings, ...settingsPayload },
            };
        } else if (question_type === "rating") {
            const rating_reasons = Object.fromEntries(
                Array.from({ length: 11 }, (_, i) => [i, [] as Reason[]])
            );
            reasons.forEach((e) => {
                rating_reasons[e.option_id].push(e);
            });
            settingsPayload = {
                ...settingsPayload,
                weight: settings.weight,
                rating_violations: settings.violation,
                rating_reasons,
            };
            parameterToEdit = {
                ...parameterToEdit,
                settings: { ...state.settings, ...settingsPayload },
            };
        } else if (question_type === "custom") {
            const custom = settings.custom.map((e) => ({
                ...e,
                violation: settings.violation[e.name],
                reasons: reasons.filter((reason) => reason.option_id === e.id),
            }));
            settingsPayload = {
                custom,
                is_deduction: settings.is_deduction || false,
                is_template_level: settings.is_template_level || true,
            };

            parameterToEdit = {
                ...parameterToEdit,
                settings: { ...state.settings, ...settingsPayload },
            };
        }
        dispatch({
            type: "UPDATE",
            payload: { ...state, ...parameterToEdit },
        });
    };
    const handleUpdate: IParameterStateContext["handleUpdate"] = useCallback(
        ({ id, category, ...rest }, callBack) => {
            if (isDefined(category) && isDefined(id))
                updateParameter({
                    id,
                    category,
                    ...rest,
                })
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
        <ParameterStateContext.Provider
            value={{
                state,
                dispatch,
                prepareParameterStateForUpdate,
                handleUpdate,
            }}
        >
            {children}
        </ParameterStateContext.Provider>
    );
}
