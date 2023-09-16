import { Box, Theme } from "@mui/material";
import { ReactElement } from "react";

interface DotProps {
    className?: string;
    [key: string]: unknown;
}

function Dot({ className, ...props }: DotProps): ReactElement {
    return (
        <Box
            className={className}
            sx={(theme: Theme) => ({
                width: 6,
                height: 6,
                borderRadius: "50%",
                display: "inline-block",
                backgroundColor: theme.palette.textColors["999"],
                ...props,
            })}
        />
    );
}

Dot.defaultProps = {
    className: "",
};
export default Dot;
