import { useContext } from "react";
import { isDefined } from "@convin/utils/helper/common.helper";
import {
    IViolationStateContext,
    ViolationSateContext,
} from "../context/ViolationCRUDStateContext";

const useViolationCRUDStateContext = (): IViolationStateContext => {
    const context = useContext(ViolationSateContext);
    if (!isDefined(context))
        throw new Error(
            "ViolationSateContext must be use inside ViolationStateProvider"
        );
    return context;
};

export default useViolationCRUDStateContext;
