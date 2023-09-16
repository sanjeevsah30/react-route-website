import { Box, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

interface Props {
    children: React.ReactNode;
    Component: React.ComponentType<{
        children: React.ReactNode;
        sx: SxProps<Theme>;
        [x: string]: unknown;
    }>;
    sx?: SxProps<Theme>;
    [x: string]: unknown;
}

function DropShadowBox({
    Component = Box,
    children,
    sx,
    ...rest
}: Props): ReactElement {
    return (
        <Component
            sx={{
                boxShadow: "0px 0px 20px 0px #0000000D",
                borderRadius: 1,
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Component>
    );
}

DropShadowBox.defaultProps = {
    sx: {},
};

export default DropShadowBox;
