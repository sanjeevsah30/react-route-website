import { useContext } from "react";
import { isDefined } from "@convin/utils/helper/common.helper";

import {
    CustomDashboardModalStateContext,
    ICustomDashboardModalStateContext,
} from "../context/CustomDashboardModalStateContext";

const useCustomDashboardModalStateContext =
    (): ICustomDashboardModalStateContext => {
        const context = useContext(CustomDashboardModalStateContext);
        if (!isDefined(context))
            throw new Error(
                "CategoryStateContext must be use inside ParameterStateProvider"
            );
        return context;
    };

export default useCustomDashboardModalStateContext;
