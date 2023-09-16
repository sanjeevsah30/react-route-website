import { useContext } from "react";
import { isDefined } from "@convin/utils/helper/common.helper";
import { IQmsStateContext, QmsStateContext } from "../context/QmsStateContext";

const useQmsStateContext = (): IQmsStateContext => {
    const context = useContext(QmsStateContext);
    if (!isDefined(context))
        throw new Error(
            "CategoryStateContext must be use inside ParameterStateProvider"
        );
    return context;
};

export default useQmsStateContext;
