import React, { ReactElement } from "react";
import { Box, SxProps, Theme } from "@mui/material";

interface BorderedBoxProps {
    children: React.ReactNode;
    Component?: React.ComponentType<{
        children: React.ReactNode;
        sx: SxProps<Theme>;
        [x: string]: unknown;
    }>;
    sx?: SxProps<Theme>;
    onClick?: () => void;
    [x: string]: unknown;
}

function BorderedBox({
    Component = Box,
    children,
    sx = {},
    onClick,
    ...rest
}: BorderedBoxProps): ReactElement {
    return (
        <Component
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                ...sx,
            }}
            onClick={onClick}
            {...rest}
        >
            {children}
        </Component>
    );
}

BorderedBox.defaultProps = {
    sx: {},
    Component: Box,
    onClick: () => {
        return;
    },
};

export default BorderedBox;
