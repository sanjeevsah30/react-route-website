import { useContext } from "react";
import { isDefined } from "@convin/utils/helper/common.helper";
import {
    ITeamManagerStateContext,
    TeamManagerStateContext,
} from "../context/TeamManagerStateProvider";

const useTeamManagerContext = (): ITeamManagerStateContext => {
    const context = useContext(TeamManagerStateContext);
    if (!isDefined(context))
        throw new Error("TeamManagerContext can only be used in the provider.");
    return context;
};

export default useTeamManagerContext;
