import { createContext, useReducer } from "react";
import { useSelector } from "react-redux";
import datasetModalReducer, { initialState } from "./datasetModalReducer";

export const DatasetModalContext = createContext();

const DatasetModalProvider = ({ children }) => {
    const { filterCallDuration, filterDates } = useSelector(
        (state) => state.common
    );
    const [state, dispatch] = useReducer(datasetModalReducer, {
        ...initialState,
        durationOptions: filterCallDuration.options,
        dateOptions: filterDates.dates,
    });
    const value = {
        ...state,
        dispatch,
    };

    return (
        <DatasetModalContext.Provider value={value}>
            {children}
        </DatasetModalContext.Provider>
    );
};

export default DatasetModalProvider;
