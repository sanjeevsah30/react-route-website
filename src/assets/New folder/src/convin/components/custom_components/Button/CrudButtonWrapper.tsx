import { Box } from "@mui/material";
import { alpha } from "@mui/system";
import React, { FunctionComponent } from "react";

export const CrudButtonWrapper: FunctionComponent<{
    onClick: () => void;
    children: React.ReactNode;
}> = ({ onClick, children }) => (
    <Box
        sx={(theme) => ({
            backgroundColor: alpha(theme.palette.textColors["333"], 0.1),
            px: 0.75,
            borderRadius: 0.75,
            color: theme.palette.mode === "light" ? "textColors.666" : "white",
        })}
        onClick={onClick}
        className="cursor-pointer h-[32px] flex items-center"
    >
        {children}
    </Box>
);
