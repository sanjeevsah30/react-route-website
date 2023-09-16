import { Role } from "@convin/type/Role";
import { ReactNode, createContext } from "react";
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

interface RoleContextProps {
    role: Role;
}

const RoleContext = createContext<RoleContextProps>({} as RoleContextProps);

// ----------------------------------------------------------------------

function RoleProvider({ children }: { children: ReactNode }) {
    const role = useSelector((state: any) => state.auth.role);
    return (
        <RoleContext.Provider
            value={{
                role,
            }}
        >
            {children}
        </RoleContext.Provider>
    );
}

export { RoleContext, RoleProvider };
