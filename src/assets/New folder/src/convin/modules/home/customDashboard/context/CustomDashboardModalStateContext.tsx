import { datekeys, defaultConfig } from "@convin/config/default.config";
import { Filters } from "@convin/type/CustomDashboard";
import { getTimeZone, isDefined } from "@convin/utils/helper/common.helper";
import { convertDateToEpoch } from "@convin/utils/helper/date.helper";
import {
    Dispatch,
    ReactElement,
    ReactNode,
    createContext,
    useReducer,
} from "react";

import GridLayout from "react-grid-layout";

type State = {
    idToUpdate: number | null;
    teams: number[];
    reps: number[];
    tags: number[];
    call_types_id: number[];
    stage: number | null;
    level: 0 | 1;
    auditType: 0 | 1;
    template: number | null;
    name: string;
    meetingType: "email" | "call" | "chat";
    dateKey: string | null;
    dateOptions: typeof defaultConfig.dateConfig;
    durationOptions: typeof defaultConfig.durationConfig;
    durationKey: string | number;
    isReport: boolean;
    reportType: string;
    singleObjectName: string;
    reportName: string;
    singleObjectData: Record<"count" | "change", number>;
    layout: GridLayout.Layout;
    auditDateKey: string | null;
    auditDateOptions: typeof defaultConfig.dateConfig;
    auditors: number[];
};

export interface ICustomDashboardModalStateContext {
    state: State;
    dispatch: Dispatch<Action>;
    updateState: (e: Partial<State>) => void;
    prepareFilters: () => Partial<Filters>;
}

export const CustomDashboardModalStateContext =
    createContext<ICustomDashboardModalStateContext>(
        {} as ICustomDashboardModalStateContext
    );

const initialState: State = {
    idToUpdate: null,
    teams: [],
    reps: [],
    tags: [],
    call_types_id: [],
    stage: null,
    level: 1,
    auditType: 1,
    auditors: [],
    template: null,
    name: "",
    meetingType: "call",
    dateKey: datekeys.last30days,
    dateOptions: defaultConfig.dateConfig,
    auditDateKey: datekeys.last30days,
    auditDateOptions: defaultConfig.dateConfig,
    durationOptions: defaultConfig.durationConfig,
    durationKey: 2,
    isReport: false,
    reportType: "",
    singleObjectName: "",
    reportName: "",
    singleObjectData: {
        count: 0,
        change: 0,
    },
    layout: {
        i: "",

        x: 0,

        y: 0,

        w: 0,

        h: 0,
    },
};

export enum ActionKind {
    updateState = "UPDATE",
    resetState = "RESET",
}

type Action = {
    type: "UPDATE" | "RESET";
    payload: Partial<State>;
};

function Reducer(state: State, action: Action) {
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

export default function CustomDashboardModalStateProvider({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const updateState: ICustomDashboardModalStateContext["updateState"] = (
        state
    ) => {
        dispatch({
            type: "UPDATE",
            payload: {
                ...state,
            },
        });
    };

    const prepareFilters: ICustomDashboardModalStateContext["prepareFilters"] =
        () => {
            const min_duration =
                state.durationOptions[state.durationKey].value[0];
            const max_duration =
                state.durationOptions[state.durationKey].value[1];
            const dateKeyIsCustom = !Object.keys(datekeys).includes(
                state.dateKey || ""
            );
            const auditDateKeyIsCustom = !Object.keys(datekeys).includes(
                state.auditDateKey || ""
            );
            return {
                meeting_type: state.meetingType,
                teams_id: state.teams.length ? state.teams : null,
                reps_id: state.reps.length ? state.reps : null,
                template_id: state.template,
                ...(isDefined(min_duration) && {
                    min_duration: min_duration * 60,
                }),
                ...(isDefined(max_duration) && {
                    max_duration: max_duration * 60,
                }),
                ...(isDefined(state.dateKey)
                    ? dateKeyIsCustom
                        ? {
                              start_date: convertDateToEpoch(
                                  state.dateOptions[state.dateKey].dateRange[0]
                              ),
                              end_date: convertDateToEpoch(
                                  state.dateOptions[state.dateKey].dateRange[1]
                              ),
                          }
                        : {
                              date_repr: state.dateKey,
                              start_date: null,
                              end_date: null,
                          }
                    : {}),
                ...(isDefined(state.auditDateKey) && Boolean(state.auditType)
                    ? auditDateKeyIsCustom
                        ? {
                              audit_start_date: convertDateToEpoch(
                                  state.auditDateOptions[state.auditDateKey]
                                      .dateRange[0]
                              ),
                              audit_end_date: convertDateToEpoch(
                                  state.auditDateOptions[state.auditDateKey]
                                      .dateRange[1]
                              ),
                          }
                        : {
                              audit_date_repr: state.auditDateKey,
                              audit_start_date: null,
                              audit_end_date: null,
                          }
                    : {
                          audit_date_repr: null,
                          audit_start_date: null,
                          audit_end_date: null,
                      }),
                is_call_level: Boolean(state.level),
                is_manual: Boolean(state.auditType),
                auditors_id: Boolean(state.auditType)
                    ? state?.auditors?.length
                        ? state.auditors
                        : null
                    : null,
                stages_id: state.stage,
                tags_id: state.tags.length ? state.tags : null,
                call_types_id: state.call_types_id.length
                    ? state.call_types_id
                    : null,
                timezone: getTimeZone(),
            };
        };
    return (
        <CustomDashboardModalStateContext.Provider
            value={{
                state,
                dispatch,
                updateState,
                prepareFilters,
            }}
        >
            {children}
        </CustomDashboardModalStateContext.Provider>
    );
}
