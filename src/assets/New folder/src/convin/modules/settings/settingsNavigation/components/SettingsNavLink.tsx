import { alpha, useTheme } from "@mui/material";
import { ReactElement, useState } from "react";
import { NavLink } from "react-router-dom";

export default function SettingsNavLink({
    name,
    path,
}: {
    name: string;
    path: string;
}): ReactElement {
    const theme = useTheme();
    return (
        <NavLink
            to={`/settings/${path}/`}
            style={(isActive) => ({
                padding: theme.spacing(2),
                marginTop: theme.spacing(0.5),
                marginBottom: theme.spacing(0.5),
                ...(Boolean(isActive) && {
                    background: alpha(theme.palette.primary.main, 0.14),
                    color:
                        theme.palette.mode === "light"
                            ? theme.palette.primary.main
                            : "white",
                    borderRadius: "6px",
                    fontWeight: 600,
                }),
                ...(!isActive && {
                    color:
                        theme.palette.mode === "light"
                            ? theme.palette.textColors["333"]
                            : "white",
                }),
            })}
            className="block w-[158px] text-[14px] hover:bg-[#F5F5F5] rounded-[6px]"
        >
            {name}
        </NavLink>
    );
}
