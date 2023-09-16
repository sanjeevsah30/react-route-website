import { createContext, useReducer } from "react";
import { useSelector } from "react-redux";
import ruleModalReducer, { initialState } from "./ruleModalReducer";

export const RuleModalContext = createContext();

const RuleModalProvider = ({ children }) => {
    const { filterCallDuration, filterDates } = useSelector(
        (state) => state.common
    );
    const auditOptions = [
        { value: "ai", label: "AI" },
        { value: "manual", label: "Manual" },
    ];
    const schedulingOptions = [
        { value: "recurring", label: "Recurring" },
        { value: "one_time", label: "One Time" },
    ];
    const [state, dispatch] = useReducer(ruleModalReducer, {
        ...initialState,
        durationOptions: filterCallDuration.options,
        dateOptions: filterDates.dates,
    });
    const value = {
        ...state,
        auditOptions,
        schedulingOptions,
        dispatch,
    };

    return (
        <RuleModalContext.Provider value={value}>
            {children}
        </RuleModalContext.Provider>
    );
};

export default RuleModalProvider;
