import { useContext } from "react";
import { RoleContext } from "@convin/contexts/RoleContext";

const useRole = () => {
    const context = useContext(RoleContext);

    if (!context)
        throw new Error("Role context must be used inside RoleProvider");

    return context;
};

export default useRole;
