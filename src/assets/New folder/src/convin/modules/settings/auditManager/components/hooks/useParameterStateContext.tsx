import { useContext } from "react";
import {
    IParameterStateContext,
    ParameterStateContext,
} from "../context/ParameterStateContext";
import { isDefined } from "@convin/utils/helper/common.helper";

const useParameterStateContext = (): IParameterStateContext => {
    const context = useContext(ParameterStateContext);
    if (!isDefined(context))
        throw new Error(
            "ParameterStateContext must be use inside ParameterStateProvider"
        );
    return context;
};

export default useParameterStateContext;
