import { useContext } from "react";
import { isDefined } from "@convin/utils/helper/common.helper";
import {
    ICategoryStateContext,
    CategorySateContext,
} from "../context/CategoryStateContext";

const useCategoryStateContext = (): ICategoryStateContext => {
    const context = useContext(CategorySateContext);
    if (!isDefined(context))
        throw new Error(
            "CategoryStateContext must be use inside CategoryStateProvider"
        );
    return context;
};

export default useCategoryStateContext;
