import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function ClockSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 20 20"
            sx={{ width: 20, height: 20, fill: "none", ...sx }}
        >
            <path
                d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C19.9939 15.5203 15.5203 19.9939 10 20ZM10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C17.995 5.58378 14.4162 2.00496 10 2ZM15 11H9V5H11V9H15V11Z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

ClockSvg.defaultProps = {
    sx: {},
};
