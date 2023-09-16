import { useContext } from "react";
import { isDefined } from "@convin/utils/helper/common.helper";
import {
    CustomDashboardStateContext,
    ICustomDashboardStateContext,
} from "../context/CustomDahboardStateContext";

const useCustomDashboardStateContext = (): ICustomDashboardStateContext => {
    const context = useContext(CustomDashboardStateContext);
    if (!isDefined(context))
        throw new Error(
            "CategoryStateContext must be use inside ParameterStateProvider"
        );
    return context;
};

export default useCustomDashboardStateContext;
